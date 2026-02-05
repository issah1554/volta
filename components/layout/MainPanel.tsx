"use client";

import type { ReactNode } from "react";

interface MainPanelProps {
    title: string;
    onClose: () => void;
    children?: ReactNode;
}

export default function MainPanel({ title, onClose, children }: MainPanelProps) {
    return (
        <div className="absolute left-0 right-0 top-0 z-1100 h-screen sm:left-0 sm:right-auto">
            <div
                className="
          w-full max-w-full
          sm:w-114 sm:max-w-[calc(100vw-40px)]
          h-full
          border border-white/30 bg-white/80 pt-14
          shadow-xl backdrop-blur-sm
          flex flex-col ">
                <div className="flex items-center justify-between px-4 py-3 border-b border-main/20">
                    <div className="text-sm font-semibold capitalize text-main-800">
                        {title}
                    </div>
                    <button
                        type="button"
                        aria-label="Close panel"
                        onClick={onClose}
                        className="grid h-8 w-8 place-items-center rounded-full text-main-700 transition hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <i className="bi bi-x-lg text-sm" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4 text-sm text-main-700">
                    {children ?? "Add content here."}
                </div>
            </div>
        </div>
    );
}
