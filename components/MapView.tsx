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

            const pulsingIcon = L.divIcon({
                className: "pulse-marker",
                iconSize: [16, 16],
                iconAnchor: [8, 8],   // center the icon
            });

            if (mapRef) mapRef.current = { map, L, pulsingIcon };

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map);

            L.control.zoom({ position: "topright" }).addTo(map);
            L.control.scale({ position: "bottomleft" }).addTo(map);

            // Locate me button
            const locateControl = L.Control.extend({
                onAdd: function () {
                    const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
                    div.innerHTML = `<a href="#" title="Locate Me" class="px-2 py-1 text-gray-800 hover:bg-gray-200"><i class="bi bi-geo-alt-fill"></i></a>`;
                    div.onclick = () => map.locate({ setView: true, maxZoom: 18 });
                    return div;
                },
            });
            new locateControl({ position: "topright" }).addTo(map);

            map.on("locationfound", (e: any) => {
                L.marker(e.latlng, { icon: pulsingIcon })
                    .addTo(map)
                    .bindPopup("You are here")
                    .openPopup();
            });

        })();
    }, [mapRef]);

    return <div id="map" className="h-screen w-screen" />;
}
