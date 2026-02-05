'use client';

import { useEffect, useRef, RefObject } from "react";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
    mapRef?: RefObject<any>;
    baseLayer?: "street" | "satellite";
}

export default function MapView({ mapRef, baseLayer = "street" }: MapViewProps) {
    const baseLayerRef = useRef(baseLayer);

    useEffect(() => {
        baseLayerRef.current = baseLayer;
        mapRef?.current?.setBaseLayer?.(baseLayer);
    }, [baseLayer, mapRef]);

    useEffect(() => {
        let cleanup: (() => void) | null = null;

        (async () => {
            const L = await import("leaflet");

            const map = L.map("map", { zoomControl: false }).setView([-6.7924, 39.2083], 17);

            const pulsingIcon = L.divIcon({
                className: "pulse-marker",
                iconSize: [16, 16],
                iconAnchor: [8, 8],
            });

            const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            });

            const satelliteLayer = L.tileLayer(
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                {
                    attribution: "Tiles &copy; Esri",
                }
            );

            let currentBaseLayer = streetLayer;
            currentBaseLayer.addTo(map);

            L.control.scale({ position: "bottomleft" }).addTo(map);

            // --- Continuous tracking state (inside this effect) ---
            let watchId: number | null = null;
            let meMarker: any = null;

            const startWatching = () => {
                if (!navigator.geolocation) return;

                // prevent multiple watchers if user clicks many times
                if (watchId !== null) return;

                watchId = navigator.geolocation.watchPosition(
                    (pos) => {
                        const { latitude, longitude, accuracy } = pos.coords;
                        const latlng = L.latLng(latitude, longitude);

                        // Create marker once, then update
                        if (!meMarker) {
                            meMarker = L.marker(latlng, { icon: pulsingIcon })
                                .addTo(map)
                                .bindPopup("You are here");
                            meMarker.openPopup();
                        } else {
                            meMarker.setLatLng(latlng);
                        }

                        // keep camera following user
                        map.setView(latlng, Math.max(map.getZoom(), 18), { animate: true });

                        // optional: show accuracy circle
                        // (uncomment if you want)
                        // if (!accuracyCircle) accuracyCircle = L.circle(latlng, { radius: accuracy }).addTo(map);
                        // else accuracyCircle.setLatLng(latlng).setRadius(accuracy);
                    },
                    (err) => {
                        console.error("watchPosition error:", err);
                        stopWatching(); // stop if permission denied, etc.
                    },
                    {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 10000,
                    }
                );
            };

            const stopWatching = () => {
                if (watchId !== null) {
                    navigator.geolocation.clearWatch(watchId);
                    watchId = null;
                }
            };

            if (mapRef) {
                mapRef.current = {
                    map,
                    L,
                    pulsingIcon,
                    startWatching,
                    setBaseLayer: (layer: "street" | "satellite") => {
                        const nextLayer = layer === "satellite" ? satelliteLayer : streetLayer;
                        if (currentBaseLayer === nextLayer) return;
                        map.removeLayer(currentBaseLayer);
                        currentBaseLayer = nextLayer;
                        currentBaseLayer.addTo(map);
                    },
                };
                mapRef.current.setBaseLayer(baseLayerRef.current);
            }

            // Cleanup when component unmounts
            cleanup = () => {
                stopWatching();
                map.remove();
            };
        })();

        return () => {
            cleanup?.();
        };
    }, [mapRef]);

    return <div id="map" className="h-screen w-screen" />;
}
