export default function Legend() {
    return (
        <div className="absolute bottom-5 right-5 z-1000 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl text-sm space-y-2">
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-green-500" />
                Start Point
            </div>
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-500" />
                End Point
            </div>
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500" />
                Route
            </div>
        </div>
    );
}
