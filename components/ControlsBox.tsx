'use client';

import Select2 from "./ui/Select2";

const locations = [
    { label: "Main Gate", value: "main_gate" },
    { label: "Library", value: "library" },
    { label: "Lecture Hall 1", value: "lecture_hall_1" },
    { label: "Cafeteria", value: "cafeteria" },
];

interface ControlsBoxProps {
    onShareToggle: () => void;
    sharing: boolean;
}

export default function ControlsBox({ onShareToggle, sharing }: ControlsBoxProps) {
    return (
        <div className="absolute top-5 left-5 z-1000 bg-white/50 border-2 border-gray-200 backdrop-blur-sm px-4 py-3 rounded-full shadow-xl w-100 max-w-[calc(100vw-40px)] flex items-center gap-3">
            <Select2
                options={locations}
                radius="full"
                placeholder="Choose a routes"
            />

            <button
                onClick={onShareToggle}
                className={`bg-primary-500/10 hover:bg-primary-500/30 p-2 border-2 border-primary-400 rounded-full transition flex items-center gap-2 text-primary ${sharing ? "bg-red-500/20 border-red-500 text-red-600" : ""
                    }`}
            >
                <i className="bi bi-share" />
                {sharing ? "Stop Sharing" : "Share"}
            </button>
        </div>
    );
}
