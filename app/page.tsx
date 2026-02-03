"use client";

import { useEffect, useRef, useState } from "react";
import MapView from "@/components/MapView";
import SearchBox from "@/components/SearchBox";
import InfoPanel from "@/components/InfoPanel";
import RightSideBar from "@/components/layout/RightSideBar";
import socketIOClient from "socket.io-client";
import { LocationData } from "@/types/socket";

export default function HomePage() {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [sharing, setSharing] = useState(false);
  const sharingRef = useRef(false);
  const socketRef = useRef<ReturnType<typeof socketIOClient> | null>(null);

  const userId = useRef("user-" + Math.floor(Math.random() * 10000));

  // Keep sharingRef in sync with state
  useEffect(() => {
    sharingRef.current = sharing;
  }, [sharing]);

  // Connect to Socket.IO
  useEffect(() => {
    const socket = socketIOClient(
      process.env.NEXT_PUBLIC_SOCKET_URL!,
      {
        path: process.env.NEXT_PUBLIC_SOCKET_PATH!,
      }
    );
    socketRef.current = socket;

    socket.on("locationUpdate", (locations: LocationData[]) => {
      if (!mapRef.current) return;

      const { L, map, pulsingIcon } = mapRef.current;

      // ---- 1. Build set of active userIds from payload ----
      const activeIds = new Set(locations.map((l) => l.userId));

      // ---- 2. Remove markers for users that are no longer in activeIds ----
      Object.entries(markersRef.current).forEach(([id, marker]) => {
        if (!activeIds.has(id)) {
          map.removeLayer(marker);
          delete markersRef.current[id];
        }
      });

      // ---- 3. Upsert markers for all locations in payload ----
      locations.forEach((loc) => {
        const isMe = loc.userId === userId.current;

        // If it's me and I'm not sharing anymore, ensure my marker is gone
        if (isMe && !sharingRef.current) {
          const myMarker = markersRef.current[loc.userId];
          if (myMarker) {
            map.removeLayer(myMarker);
            delete markersRef.current[loc.userId];
          }
          return; // do not recreate marker
        }

        if (markersRef.current[loc.userId]) {
          markersRef.current[loc.userId].setLatLng([loc.lat, loc.lng]);
        } else {
          const marker = L.marker([loc.lat, loc.lng], { icon: pulsingIcon })
            .addTo(map)
            .bindPopup(`User: ${loc.userId}`);

          markersRef.current[loc.userId] = marker;
        }
      });
    });

    return () => {
      socket.off("locationUpdate");
      socket.disconnect();
    };
  }, []);

  // Share / stop sharing location
  useEffect(() => {
    // When turning OFF sharing: remove ONLY my marker and stop sending
    if (!sharing) {
      if (mapRef.current) {
        const { map } = mapRef.current;
        const myMarker = markersRef.current[userId.current];

        if (myMarker) {
          map.removeLayer(myMarker);
          delete markersRef.current[userId.current];
        }
      }

      socketRef.current?.emit("stopSharing", { userId: userId.current });
      return;
    }

    // When turning ON sharing: start sending positions
    const interval = setInterval(() => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition((pos) => {
        socketRef.current?.emit("sendLocation", {
          userId: userId.current,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: Date.now(),
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [sharing]);

  return (
    <div className="relative h-screen w-screen">
      <MapView mapRef={mapRef} />
      <RightSideBar mapRef={mapRef}
        onShareToggle={() => setSharing((prev) => !prev)}
        sharing={sharing}
      />
      <SearchBox
      />
      <InfoPanel />
    </div>
  );
}
