"use client";

export default function ControlsBox() {
    return (
        <div className="absolute top-5 left-5 z-1000 bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-xl w-87.5 max-w-[calc(100vw-40px)]">
            <h5 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <i className="bi bi-map-fill text-yellow-500" />
                DIT Route Finder
            </h5>

            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                    <i className="bi bi-flag-fill mr-1" />
                    Destination
                </label>
                <select
                    id="end"
                    defaultValue=""
                    className="w-full rounded-lg border px-3 py-2"
                >
                    <option value="" disabled>
                        Select destination
                    </option>
                </select>

            </div>

            <button
                onClick={() => (window as any).findPath?.()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg mt-2 transition"
            >
                <i className="bi bi-signpost-split mr-2" />
                Find Route
            </button>

            <button
                onClick={() => (window as any).clearRoute?.()}
                className="w-full border py-2 rounded-lg mt-2 hover:bg-gray-100 transition"
            >
                <i className="bi bi-x-circle mr-2" />
                Clear Route
            </button>

            <button
                onClick={() => (window as any).showNetwork?.()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg mt-2 transition"
            >
                <i className="bi bi-diagram-3 mr-2" />
                Show Network
            </button>
        </div>
    );
}
