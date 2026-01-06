"use client";

export default function InfoPanel() {
    return (
        <div
            id="info-panel"
            className="hidden absolute top-5 right-5 z-1000 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl w-87.5 max-w-[calc(100vw-40px)]"
        >
            <h6 className="font-semibold mb-2 flex items-center gap-2">
                <i className="bi bi-info-circle-fill" />
                Route Information
            </h6>

            <p className="text-sm mb-1">
                <strong>Distance:</strong>{" "}
                <span id="distance">-</span> meters
            </p>

            <ol
                id="path-steps"
                className="list-decimal pl-5 mt-2 max-h-50 overflow-y-auto text-sm"
            />
        </div>
    );
}
