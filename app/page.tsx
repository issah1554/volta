'use client';

import { useEffect, useRef, useState } from "react";
import MapView from "@/components/MapView";
import ControlsBox from "@/components/ControlsBox";
import InfoPanel from "@/components/InfoPanel";
import Legend from "@/components/Legend";
import socketIOClient from "socket.io-client";
import { LocationData } from "@/types/socket";

export default function HomePage() {
  const mapRef = useRef<any>(null); // Leaflet map ref
  const markersRef = useRef<Record<string, any>>({});
  const [sharing, setSharing] = useState(false);

  const socketRef = useRef<ReturnType<typeof socketIOClient> | null>(null);
  const userId = useRef("user-" + Math.floor(Math.random() * 10000));

  // Connect to Socket.IO
  useEffect(() => {
    const socket = socketIOClient("http://localhost:3001");
    socketRef.current = socket;

    socket.on("locationUpdate", (locations: LocationData[]) => {
      if (!mapRef.current) return;

      locations.forEach((loc) => {
        // Update existing marker
        if (markersRef.current[loc.userId]) {
          markersRef.current[loc.userId].setLatLng([loc.lat, loc.lng]);
        } else {
          // Add new marker
          const marker = mapRef.current?.L.marker([loc.lat, loc.lng])
            .addTo(mapRef.current.map)
            .bindPopup(`User: ${loc.userId}`);
          markersRef.current[loc.userId] = marker;

        }
      });
    });

    return () => {
      socket.disconnect(); // cleanup
    };
  }, []);

  // Share location at interval
  useEffect(() => {
    if (!sharing) return;

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
      <ControlsBox
        onShareToggle={() => setSharing((prev) => !prev)}
        sharing={sharing}
      />
      <InfoPanel />
      <Legend />
    </div>
  );
}
