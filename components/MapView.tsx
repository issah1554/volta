'use client';
import { useEffect, RefObject } from "react";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
    mapRef?: RefObject<any>;
}

export default function MapView({ mapRef }: MapViewProps) {
    useEffect(() => {
        (async () => {
            const L = await import("leaflet");

            const map = L.map("map", { zoomControl: false }).setView([-6.7924, 39.2083], 17);
            if (mapRef) mapRef.current = { map, L }; // attach L to ref

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map);

            L.control.zoom({ position: "topright" }).addTo(map);
            L.control.scale({ position: "bottomleft" }).addTo(map);
        })();
    }, [mapRef]);

    return <div id="map" className="h-screen w-screen" />;
}
