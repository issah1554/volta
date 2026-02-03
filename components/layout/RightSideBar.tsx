"use client";

import { RefObject } from "react";

interface RightSideBarProps {
  onShareToggle?: () => void;
  sharing?: boolean;
  mapRef?: RefObject<any>;
}


export default function RightSideBar({ mapRef, sharing, onShareToggle }: RightSideBarProps) {
  const handleZoomIn = () => mapRef?.current?.map?.zoomIn?.();
  const handleZoomOut = () => mapRef?.current?.map?.zoomOut?.();
  const handleLocate = () => mapRef?.current?.startWatching?.();

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
      <a
        className={`${baseBtn} rounded-xl`}
        href="#"
        aria-label="Layers"
        title="Layers"
      >
        <i className="bi bi-stack text-lg" />
      </a>

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
        className={`${baseBtn} rounded-xl ${sharing ? "border-accent-400 bg-accent-500/10 hover:bg-accent-500/30  text-accent" : ""}`}
        href="#"
        aria-label="Share"
        title="Share"
        onClick={(e) => {
          e.preventDefault();
          onShareToggle?.();
        }}
      >
        <i className="bi bi-share-fill text-lg" />
      </a>


      {/* Query (disabled) */}
      <a
        className={`${baseBtn} rounded-xl`}
        href="#"
        aria-label="Query features"
        title="Account"
        aria-disabled="true"
        onClick={(e) => e.preventDefault()}
      >
        <i className="bi bi-person text-lg" />
      </a>
    </div>
  );
}
