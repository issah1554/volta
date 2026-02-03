"use client";

interface LeftSideBarProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (label: string) => void;
}

const menuItems = [
    { label: "dash", icon: "bi-speedometer2" },
    { label: "users", icon: "bi-people-fill" },
    { label: "vehicles", icon: "bi-truck-front-fill" },
    { label: "nodes", icon: "bi-diagram-3-fill" },
    { label: "routes", icon: "bi-signpost-split-fill" },
];

export default function LeftSideBar({ isOpen, onClose, onSelect }: LeftSideBarProps) {
    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    className="absolute inset-0 z-1050 cursor-default bg-black/15"
                    onClick={onClose}
                />
            )}
            <aside
                className={`absolute left-0 top-0 z-1100 h-full w-64 border-r border-white/30 bg-white/70 shadow-xl backdrop-blur-md transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                aria-hidden={!isOpen}
            >
                <div className="flex items-center justify-between px-5 pt-5 border-b border-main/30 pb-3">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        {/* Bolt Icon */}
                        <i className="bi bi-lightning-charge-fill text-primary text-xl" />

                        {/* Brand Name */}
                        <span className="text-xl font-semibold tracking-wide text-main-800">
                            Volta
                        </span>
                    </div>

                    {/* Close Button */}
                    <button
                        type="button"
                        aria-label="Close sidebar"
                        onClick={onClose}
                        className="grid h-8 w-8 place-items-center rounded-full text-main-700 transition hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <i className="bi bi-x-lg text-sm" />
                    </button>
                </div>

                <nav className="mt-3 space-y-2 px-5 pb-6">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href="#"
                            className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-main-800 transition hover:bg-white/80"
                            onClick={(event) => {
                                event.preventDefault();
                                onSelect(item.label);
                            }}
                        >
                            <i className={`bi ${item.icon} text-base text-main-700`} />
                            <span className="ml-3 capitalize">{item.label}</span>
                        </a>
                    ))}
                </nav>
            </aside>
        </>
    );
}
