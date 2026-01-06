"use client";

import { useEffect } from "react";

export default function MapView() {
    useEffect(() => {
        let map: any;

        const initMap = async () => {
            const L = await import("leaflet");

            // initialize map
            map = L.map("map", {
                zoomControl: false, // disable default bottom-left zoom
            }).setView([-6.7924, 39.2083], 17);

            // add tile layer
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map);

            // -------------------------------
            // 1. Zoom control (top-right)
            L.control.zoom({
                position: "topright",
            }).addTo(map);

            // 2. Scale control
            L.control.scale({
                position: "bottomleft",
                metric: true,
                imperial: false,
            }).addTo(map);

            // 3. Locate me button
            const locateControl = L.Control.extend({
                onAdd: function () {
                    const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
                    div.innerHTML = `<a href="#" title="Locate Me" class="px-2 py-1 text-gray-800 hover:bg-gray-200"><i class="bi bi-geo-alt-fill"></i></a>`;
                    div.onclick = () => {
                        map.locate({ setView: true, maxZoom: 18 });
                    };
                    return div;
                }
            });
            new locateControl({ position: "topright" }).addTo(map);

            // optional: handle location found
            map.on("locationfound", function (e: any) {
                L.marker(e.latlng)
                    .addTo(map)
                    .bindPopup("You are here")
                    .openPopup();
            });
        };

        initMap();

        return () => {
            if (map) map.remove();
        };
    }, []);

    return <div id="map" className="h-screen w-screen" />;
}
