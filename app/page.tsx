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
  const [baseLayer, setBaseLayer] = useState<"street" | "satellite">("street");
  const [routeSearch, setRouteSearch] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const sharingRef = useRef(false);
  const routeLineRef = useRef<any>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const selectedRouteRef = useRef<string | null>(null);
  const subscriptionRef = useRef<{ routeId: string | null; requestId: string | null }>({
    routeId: null,
    requestId: null,
  });
  const requestIdCounter = useRef(0);
  const isAdmin = currentUser?.role === "admin";

  const userId = useRef("user-" + Math.floor(Math.random() * 10000));

  // Keep sharingRef in sync with state
  useEffect(() => {
    sharingRef.current = sharing;
  }, [sharing]);

  useEffect(() => {
    selectedRouteRef.current = selectedRouteId;
  }, [selectedRouteId]);

  function parseLineString(geometry: string): Array<[number, number]> | null {
    const match = geometry.match(/linestring\s*\((.+)\)/i);
    if (!match) return null;
    const pairs = match[1].split(",");
    const coords: Array<[number, number]> = [];

    for (const pair of pairs) {
      const parts = pair.trim().split(/\s+/);
      if (parts.length < 2) continue;
      const lng = Number(parts[0]);
      const lat = Number(parts[1]);
      if (Number.isNaN(lat) || Number.isNaN(lng)) continue;
      coords.push([lat, lng]);
    }

    return coords.length ? coords : null;
  }

  function showRouteLine(geometry?: string | null) {
    const mapInstance = mapRef.current?.map;
    const L = mapRef.current?.L;
    if (!mapInstance || !L) return;

    if (routeLineRef.current) {
      mapInstance.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    if (!geometry) return;
    const coords = parseLineString(geometry);
    if (!coords) return;

    const line = L.polyline(coords, {
      color: "#2563eb",
      weight: 4,
      opacity: 0.9,
    });
    line.addTo(mapInstance);
    routeLineRef.current = line;
    mapInstance.fitBounds(line.getBounds(), { padding: [24, 24] });
  }

  function toRouteIdPayload(routeId: string) {
    const numericId = Number(routeId);
    return Number.isNaN(numericId) ? routeId : numericId;
  }

  function nextRequestId() {
    requestIdCounter.current += 1;
    return `rsub-${requestIdCounter.current}`;
  }

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

  function handleLocationUpdate(locations: LocationData[]) {
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
  }

  function sendSocketPayload(payload: unknown) {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payload));
  }

  function sendSocketEvent(event: string, data: unknown) {
    sendSocketPayload({ event, data });
  }

  function sendRouteSubscription(type: "route.subscribe" | "route.unsubscribe", routeId: string, requestId: string) {
    sendSocketPayload({
      type,
      request_id: requestId,
      payload: {
        route_id: toRouteIdPayload(routeId),
      },
    });
  }

  // Connect to WebSocket
  useEffect(() => {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL!);
    socketRef.current = socket;

    const onOpen = () => {
      const active = subscriptionRef.current;
      if (active.routeId && active.requestId) {
        sendRouteSubscription("route.subscribe", active.routeId, active.requestId);
      }
    };

    const onMessage = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data);
        if (Array.isArray(payload)) {
          handleLocationUpdate(payload);
          return;
        }
        if (payload?.type === "route.subscribe.ok") {
          const routeId = payload?.data?.route_id;
          console.log("Route subscription OK", { routeId, requestId: payload?.request_id });
          return;
        }
        if (payload?.event === "locationUpdate" && Array.isArray(payload.data)) {
          handleLocationUpdate(payload.data);
        }
      } catch {
        // Ignore non-JSON or unexpected payloads
      }
    };

    socket.addEventListener("open", onOpen);
    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("message", onMessage);
      socket.close();
    };
  }, []);

  useEffect(() => {
    const previous = subscriptionRef.current;
    if (previous.routeId === selectedRouteId) return;

    if (previous.routeId && previous.requestId) {
      sendRouteSubscription("route.unsubscribe", previous.routeId, previous.requestId);
    }

    if (selectedRouteId) {
      const requestId = nextRequestId();
      subscriptionRef.current = { routeId: selectedRouteId, requestId };
      sendRouteSubscription("route.subscribe", selectedRouteId, requestId);
    } else {
      subscriptionRef.current = { routeId: null, requestId: null };
    }
  }, [selectedRouteId]);

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

      sendSocketEvent("stopSharing", { userId: userId.current });
      return;
    }

    // When turning ON sharing: start sending positions
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        sendSocketEvent("sendLocation", {
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
      <MapView mapRef={mapRef} baseLayer={baseLayer} />
      <RightSideBar
        mapRef={mapRef}
        sharing={sharing}
        onShareToggle={() => setSharing((prev) => !prev)}
        baseLayer={baseLayer}
        onBaseLayerChange={setBaseLayer}
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
        isLoggedIn={isLoggedIn}
        onClose={() => setIsLeftOpen(false)}
        onSelect={(label) => {
          if (!isLoggedIn) {
            if (label === "routes") {
              setActivePanel("routes");
              setIsLeftOpen(false);
              return;
            }
            setActivePanel(null);
            setIsLeftOpen(false);
            return;
          }
          const allowedPanels = isAdmin
            ? ["dash", "users", "vehicles", "routes", "nodes"]
            : ["dash", "vehicles"];

          if (allowedPanels.includes(label)) {
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
            <Routes
              searchQuery={routeSearch}
              showActions={isAdmin}
              selectedRouteId={selectedRouteId}
              onRouteSelect={(route) => {
                setSelectedRouteId(route.id);
                showRouteLine(route.geometry ?? null);
              }}
            />
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
        searchValue={routeSearch}
        onSearchChange={(value) => {
          setRouteSearch(value);
          if (value.trim()) {
            setActivePanel("routes");
          }
        }}
      />
      <InfoPanel />
    </div>
  );
}
