"use client";

interface SearchBoxProps {
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    containerClassName?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    placeholder?: string;
}

export default function SearchBox({
    isSidebarOpen,
    onToggleSidebar,
    containerClassName,
    searchValue,
    onSearchChange,
    placeholder,
}: SearchBoxProps) {
    const inputValueProps = searchValue === undefined ? {} : { value: searchValue };

    return (
        <div className={`absolute left-3 right-3 top-3 z-1200 sm:left-5 sm:right-auto sm:top-5 ${containerClassName ?? ""}`}>
            {/* Responsive search box */}
            <div
                className="
          flex items-center gap-2 rounded-full
          border border-gray-200 bg-white/80 shadow backdrop-blur-sm
          px-2 py-1
          w-full max-w-full
          sm:w-104 sm:max-w-[calc(100vw-40px)]
          focus-within:ring focus-within:ring-main-400
        "
            >
                {/* Sidebar Toggle (inside search) */}
                <button
                    type="button"
                    aria-label="Toggle sidebar"
                    aria-expanded={isSidebarOpen}
                    onClick={onToggleSidebar}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                    <i className={`bi ${isSidebarOpen ? "bi-x-lg" : "bi-list"} text-base`} />
                </button>

                {/* Input */}
                <input
                    type="search"
                    placeholder={placeholder ?? "Search for a route"}
                    className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
                    onChange={(event) => onSearchChange?.(event.target.value)}
                    {...inputValueProps}
                />

                {/* Search Icon */}
                <i className="bi bi-search shrink-0 px-2 text-gray-500" />
            </div>
        </div>
    );
}
