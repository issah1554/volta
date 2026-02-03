"use client";

interface MainPanelProps {
    title: string;
    onClose: () => void;
}

export default function MainPanel({ title, onClose }: MainPanelProps) {
    return (
        <div className="absolute right-3 top-0 z-1100 h-screen sm:right-auto">
            <div
                className="
          w-full max-w-full
          sm:w-104 sm:max-w-[calc(100vw-40px)]
          h-full
          border border-white/30 bg-white/80 pt-16
          shadow-xl backdrop-blur-sm ">
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
                <div className="px-4 py-4 text-sm text-main-700">
                    Add content here.
                </div>
            </div>
        </div>
    );
}
