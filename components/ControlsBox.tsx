"use client";

import { useState } from "react";

export default function ControlsBox() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="absolute left-5 top-5 z-1000">
            {/* Search box with embedded toggle */}
            <div
                className="flex w-104 max-w-[calc(100vw-40px)] items-center gap-2 rounded-full
                border border-gray-200 bg-white/80 px-2 py-1 shadow-xl backdrop-blur-sm
                focus-within:ring-2 focus-within:ring-accent"
            >

                {/* Sidebar Toggle (inside search) */}
                <button
                    type="button"
                    aria-label="Toggle sidebar"
                    aria-expanded={isSidebarOpen}
                    onClick={() => setIsSidebarOpen((v) => !v)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                    <i className={`bi ${isSidebarOpen ? "bi-x-lg" : "bi-list"} text-base`} />
                </button>

                {/* Input */}
                <input
                    type="search"
                    placeholder="Search for a route"
                    className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
                />
                
                {/* Search Icon */}
                <i className="bi bi-search text-gray-500 px-2" />

            </div>
        </div>
    );
}
