"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import Avatar from "@/components/ui/Avatar";

interface RightSideBarProps {
  onShareToggle?: () => void;
  sharing?: boolean;
  mapRef?: RefObject<any>;
  baseLayer?: "street" | "satellite";
  onBaseLayerChange?: (layer: "street" | "satellite") => void;
  isLoggedIn?: boolean;
  user?: {
    full_name?: string;
    email?: string;
    role?: string;
    public_id?: string;
  };
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onLogoutClick?: () => void;
}


export default function RightSideBar({
  mapRef,
  sharing,
  onShareToggle,
  baseLayer = "street",
  onBaseLayerChange,
  isLoggedIn,
  user,
  onLoginClick,
  onRegisterClick,
  onLogoutClick,
}: RightSideBarProps) {
  const isSharing = Boolean(sharing);
  const handleZoomIn = () => mapRef?.current?.map?.zoomIn?.();
  const handleZoomOut = () => mapRef?.current?.map?.zoomOut?.();
  const handleLocate = () => mapRef?.current?.startWatching?.();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const [layersOpen, setLayersOpen] = useState(false);
  const layersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
      if (layersRef.current && !layersRef.current.contains(event.target as Node)) {
        setLayersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const baseBtn =
    "grid h-10 w-10 place-items-center bg-white text-slate-800 shadow-md ring-1 ring-slate-200 hover:bg-slate-50 active:translate-y-px active:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    // Tailwind-only layout (no leaflet control classes)
    <div className="absolute right-3 top-3 z-1000 flex flex-col items-end gap-2">
      {/* Zoom */}
      <div className="overflow-hidden rounded-xl">
        <a
          className={`${baseBtn} rounded-t-xl`}
          href="#"
          aria-label="Zoom In"
          title="Zoom In"
          onClick={(e) => {
            e.preventDefault();
            handleZoomIn();
          }}
        >
          <i className="bi bi-plus-lg text-lg" />
        </a>
        <div className="h-px w-full bg-slate-200" />
        <a
          className={`${baseBtn} rounded-b-xl`}
          href="#"
          aria-label="Zoom Out"
          title="Zoom Out"
          onClick={(e) => {
            e.preventDefault();
            handleZoomOut();
          }}
        >
          <i className="bi bi-dash-lg text-lg" />
        </a>
      </div>

      {/* Locate */}
      <a
        className={`${baseBtn} rounded-xl`}
        href="#"
        role="button"
        aria-label="Show My Location"
        title="Show My Location"
        onClick={(e) => {
          e.preventDefault();
          handleLocate();
        }}
      >
        <i className="bi bi-cursor-fill text-lg" />
      </a>

      {/* Layers */}
      <div className="relative" ref={layersRef}>
        <button
          type="button"
          className={`${baseBtn} rounded-xl`}
          aria-label="Layers"
          title="Layers"
          onClick={() => setLayersOpen((v) => !v)}
        >
          <i className="bi bi-stack text-lg" />
        </button>
        {layersOpen && (
          <div className="absolute right-full top-1/2 mr-2 w-40 -translate-y-1/2 rounded-xl border border-white/40 bg-white/90 p-2 text-xs shadow-xl backdrop-blur-md">
            <button
              type="button"
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-white/80 ${baseLayer === "street" ? "text-primary" : "text-main-800"
                }`}
              onClick={() => {
                onBaseLayerChange?.("street");
                setLayersOpen(false);
              }}
            >
              <i className="bi bi-map" />
              Street
            </button>
            <button
              type="button"
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-white/80 ${baseLayer === "satellite" ? "text-primary" : "text-main-800"
                }`}
              onClick={() => {
                onBaseLayerChange?.("satellite");
                setLayersOpen(false);
              }}
            >
              <i className="bi bi-globe2" />
              Satellite
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <a
        className={`${baseBtn} rounded-xl`}
        href="#"
        aria-label="Legend"
        title="Legend"
      >
        <i className="bi bi-info-lg text-lg" />
      </a>

      {/* Share */}
      <a
        className={`${baseBtn} rounded-xl ${isSharing ? "border-accent-400 bg-accent text-accent hover:bg-accent-500/30" : ""}`}
        href="#"
        aria-label="Share"
        aria-pressed={isSharing}
        title={isSharing ? "Stop Sharing" : "Share"}
        onClick={(e) => {
          e.preventDefault();
          onShareToggle?.();
        }}
      >
        <i className={`bi ${isSharing ? "bi-ban text-accent" : "bi-share-fill"} text-lg`} />
      </a>


      {/* Account */}
      <div className="relative" ref={accountRef}>
        <button
          type="button"
          className={`${baseBtn} rounded-xl`}
          aria-label="Account"
          title="Account"
          onClick={() => setAccountOpen((v) => !v)}
        >
          <i className={`${isLoggedIn ? "bi bi-person-fill text-lg text-primary" : "bi bi-person text-lg "}`} />
        </button>
        {accountOpen && (
          <div className="absolute right-full top-1/2 mr-2 w-56 -translate-y-1/2 rounded-xl border border-white/40 bg-white/90 p-2 shadow-xl backdrop-blur-md">
            {!isLoggedIn ? (
              <div className="space-y-1">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-main-800 transition hover:bg-white/80"
                  onClick={() => {
                    setAccountOpen(false);
                    onLoginClick?.();
                  }}
                >
                  <i className="bi bi-box-arrow-in-right text-base text-main-700" />
                  Login
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-main-800 transition hover:bg-white/80"
                  onClick={() => {
                    setAccountOpen(false);
                    onRegisterClick?.();
                  }}
                >
                  <i className="bi bi-person-plus-fill text-base text-main-700" />
                  Register
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-lg border border-white/60 bg-white/80 px-2 py-2 text-xs text-main-700">
                  <Avatar
                    alt={user?.full_name || "User"}
                    initials={user?.full_name || user?.email || "User"}
                    size={36}
                    status="online"
                    className="shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-main-900">
                      {user?.full_name || "User"}
                    </p>
                    {user?.email && (
                      <p className="truncate text-xs text-main-600">{user.email}</p>
                    )}
                    {user?.role && (
                      <p className="text-[11px] uppercase tracking-wide text-main-500">
                        {user.role}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-main-800 transition hover:bg-white/80"
                  onClick={() => {
                    setAccountOpen(false);
                    onLogoutClick?.();
                  }}
                >
                  <i className="bi bi-box-arrow-right text-base text-main-700" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
