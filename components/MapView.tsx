"use client";

import { useEffect } from "react";

export default function MapView() {
    useEffect(() => {
        let map: any;

        const initMap = async () => {
            const L = await import("leaflet");

            map = L.map("map").setView([-6.7924, 39.2083], 17);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map);
        };

        initMap();

        return () => {
            if (map) map.remove();
        };
    }, []);

    return <div id="map" className="h-screen w-screen" />;
}
