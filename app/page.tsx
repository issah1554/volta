"use client";

import { useEffect, useRef, useState } from "react";
import MapView from "@/components/MapView";
import SearchBox from "@/components/SearchBox";
import InfoPanel from "@/components/InfoPanel";
import RightSideBar from "@/components/layout/RightSideBar";
import LeftSideBar from "@/components/layout/LeftSideBar";
import MainPanel from "@/components/layout/MainPanel";
import Dashboard from "@/components/Dashboard";
import UserManagement from "@/components/UserManagement";
import UserProfile from "@/components/UserProfile";
import Vehicles from "@/components/Vehicles";
import Nodes from "@/components/Nodes";
import Routes from "@/components/Routes";
import type { UserRow } from "@/components/UserManagement";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { clearAuth, logout, type AuthUser } from "@/services/auth";
import { ApiError } from "@/services/apiClient";
import { Toast } from "@/components/ui/Toast";
import { getStoredUser } from "@/services/tokenStore";
import socketIOClient from "socket.io-client";
import { LocationData } from "@/types/socket";

export default function HomePage() {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [sharing, setSharing] = useState(false);
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<
    "dash" | "users" | "user-profile" | "vehicles" | "routes" | "nodes" | "login" | "register" | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const sharingRef = useRef(false);
  const socketRef = useRef<ReturnType<typeof socketIOClient> | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const isAdmin = currentUser?.role === "admin";

  const userId = useRef("user-" + Math.floor(Math.random() * 10000));

  // Keep sharingRef in sync with state
  useEffect(() => {
    sharingRef.current = sharing;
  }, [sharing]);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setCurrentUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin && (activePanel === "users" || activePanel === "user-profile")) {
      setActivePanel(null);
      setSelectedUser(null);
    }
  }, [activePanel, isAdmin]);

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
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

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
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        socketRef.current?.emit("sendLocation", {
          userId: userId.current,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: Date.now(),
        });
      },
      () => {
        setSharing(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [sharing]);

  return (
    <div className="relative h-screen w-screen">
      <MapView mapRef={mapRef} />
      <RightSideBar
        mapRef={mapRef}
        sharing={sharing}
        onShareToggle={() => setSharing((prev) => !prev)}
        isLoggedIn={isLoggedIn}
        user={currentUser ?? undefined}
        onLoginClick={() => {
          setIsLeftOpen(false);
          setActivePanel("login");
        }}
        onRegisterClick={() => {
          setIsLeftOpen(false);
          setActivePanel("register");
        }}
        onLogoutClick={async () => {
          try {
            await logout();
            clearAuth();
            setCurrentUser(null);
            Toast.fire({ icon: "success", title: "Logged out." });
            setIsLoggedIn(false);
          } catch (error) {
            clearAuth();
            setCurrentUser(null);
            const message =
              error instanceof ApiError
                ? error.message
                : "Unable to log out right now.";
            Toast.fire({ icon: "error", title: message });
          }
        }}
      />
      <LeftSideBar
        isOpen={isLeftOpen}
        isAdmin={isAdmin}
        onClose={() => setIsLeftOpen(false)}
        onSelect={(label) => {
          if (["dash", "users", "vehicles", "routes", "nodes"].includes(label)) {
            if (label === "users" && !isAdmin) {
              setActivePanel(null);
              setIsLeftOpen(false);
              return;
            }
            setActivePanel(label as "dash" | "users" | "vehicles" | "routes" | "nodes");
            setIsLeftOpen(false);
          } else {
            setActivePanel(null);
          }
        }}
      />
      {activePanel && (
        <MainPanel title={activePanel} onClose={() => setActivePanel(null)}>
          {activePanel === "dash" ? (
            <Dashboard />
          ) : activePanel === "users" ? (
            <UserManagement
              onViewProfile={(user) => {
                setSelectedUser(user);
                setActivePanel("user-profile");
              }}
            />
          ) : activePanel === "user-profile" && selectedUser ? (
            <UserProfile
              user={selectedUser}
              onBack={() => {
                setActivePanel("users");
              }}
            />
          ) : activePanel === "vehicles" ? (
            <Vehicles />
          ) : activePanel === "nodes" ? (
            <Nodes />
          ) : activePanel === "routes" ? (
            <Routes />
          ) : activePanel === "login" || activePanel === "register" ? (
            activePanel === "login" ? (
              <LoginForm
                onSubmit={(user) => {
                  setIsLoggedIn(true);
                  setCurrentUser(user ?? null);
                  setActivePanel(null);
                }}
              />
            ) : (
              <RegisterForm
                onSubmit={() => {
                  setIsLoggedIn(true);
                  setActivePanel(null);
                }}
              />
            )
          ) : (
            <div className="text-sm text-main-700">
              Add content here.
            </div>
          )}
        </MainPanel>
      )}
      <SearchBox
        isSidebarOpen={isLeftOpen}
        onToggleSidebar={() => setIsLeftOpen((prev) => !prev)}
        containerClassName={activePanel ? "z-[1200]" : ""}
      />
      <InfoPanel />
    </div>
  );
}
