"use client";

import MapView from "@/components/MapView";
import ControlsBox from "@/components/ControlsBox";
import InfoPanel from "@/components/InfoPanel";
import Legend from "@/components/Legend";

export default function HomePage() {
  return (
    <div className="relative h-screen w-screen">
      <MapView />
      <ControlsBox />
      <InfoPanel />
      <Legend />
    </div>
  );
}
