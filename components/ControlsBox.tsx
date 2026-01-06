"use client";

import Select2 from "./ui/Select2";
const locations = [
     { label: "Main Gate", value: "main_gate" },
     { label: "Library", value: "library" },
    { label: "Lecture Hall 1", value: "lecture_hall_1" },
    { label: "Cafeteria", value: "cafeteria" },
];

export default function ControlsBox() {
    return (
        <div className="absolute top-5 left-5 z-1000 bg-white/50 backdrop-blur-sm p-5 rounded-2xl shadow-xl w-87.5 max-w-[calc(100vw-40px)]">

            <div className="mb-3">
                <Select2 options={locations} radius="full" placeholder="Choose a routes"/>
            </div>

            <button
                onClick={() => (window as any).showNetwork?.()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full mt-2 transition"
            >
                <i className="bi bi-diagram-3 mr-2" />
                Show Network
            </button>
        </div>
    );
}
