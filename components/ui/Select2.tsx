import { useState, useRef, useEffect } from "react";

export interface Option {
    value: string;
    label: string;
}

type SelectColor = "primary" | "secondary" | "neutral" | "accent";
type SelectSize = "sm" | "md" | "lg" | "xl" | "2xl";
type SelectRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

interface Select2Props {
    options: Option[];
    multiple?: boolean;
    placeholder?: string;
    color?: SelectColor;
    size?: SelectSize;
    radius?: SelectRadius;
}

const colorStyles: Record<
    SelectColor,
    { ring: string; text: string; bg: string; hover: string }
> = {
    neutral: {
        ring: "border-2 border-main focus:ring-2 focus:ring-main focus:border-none focus:outline-none",
        text: "text-main",
        bg: "bg-main/10 text-main",
        hover: "hover:bg-main/5",
    },
    primary: {
        ring: "border-2 border-primary focus:ring-2 focus:ring-primary focus:border-none focus:outline-none",
        text: "text-primary",
        bg: "bg-primary/10 text-main",
        hover: "hover:bg-primary/5",
    },
    secondary: {
        ring: "border-2 border-secondary focus:ring-2 focus:ring-secondary focus:border-none focus:outline-none",
        text: "text-secondary",
        bg: "bg-secondary/10 text-main",
        hover: "hover:bg-secondary/5",
    },
    accent: {
        ring: "border-2 border-accent focus:ring-2 focus:ring-accent focus:border-none focus:outline-none",
        text: "text-accent",
        bg: "bg-accent/10 text-main",
        hover: "hover:bg-accent/5",
    },
};

const sizeStyles: Record<SelectSize, string> = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-2.5 text-lg",
    xl: "px-4 py-3 text-xl",
    "2xl": "px-5 py-3.5 text-2xl",
};

const optionSizeStyles: Record<SelectSize, string> = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-2.5 text-lg",
    xl: "px-4 py-3 text-xl",
    "2xl": "px-5 py-3.5 text-2xl",
};

const radiusStyles: Record<SelectRadius, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
};

export default function Select2({
    options,
    multiple = false,
    placeholder = "Search...",
    color = "primary",
    size = "md",
    radius = "md",
}: Select2Props) {
    const [inputValue, setInputValue] = useState("");
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [showOptions, setShowOptions] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const styles = colorStyles[color];

    const uniqueOptions = Array.from(
        new Map(options.map(o => [o.value, o])).values()
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setShowOptions(false);
                setIsFocused(false);

                if (!multiple && selectedValues.length > 0) {
                    const selectedOption = uniqueOptions.find(
                        o => o.value === selectedValues[0]
                    );
                    if (selectedOption) {
                        setInputValue(selectedOption.label);
                    }
                }
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () =>
            document.removeEventListener("click", handleClickOutside);
    }, [multiple, selectedValues, uniqueOptions]);

    const handleSelect = (option: Option) => {
        if (multiple) {
            setSelectedValues(prev =>
                prev.includes(option.value)
                    ? prev.filter(v => v !== option.value)
                    : [...prev, option.value]
            );
            setInputValue("");
        } else {
            setSelectedValues([option.value]);
            setInputValue(option.label);
            setShowOptions(false);
        }
    };

    const clearInput = () => {
        setInputValue("");
        if (!multiple) {
            setSelectedValues([]);
        }
        setShowOptions(true);
    };


    const filteredOptions = uniqueOptions.filter(o =>
        o.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    const orderedOptions = [
        ...filteredOptions.filter(o => selectedValues.includes(o.value)),
        ...filteredOptions.filter(o => !selectedValues.includes(o.value)),
    ];


    return (
        <div ref={containerRef} className="relative w-full max-w-xs font-inter">
            <div className="relative w-full">
                <input
                    type="text"
                    className={`
                        w-full cursor-pointer transition pr-8
                        ${sizeStyles[size]}
                        ${radiusStyles[radius]}
                        ${styles.ring} ${styles.text}
                    `}
                    placeholder={
                        multiple && selectedValues.length > 0
                            ? `${selectedValues.length} selected`
                            : placeholder
                    }
                    value={
                        !multiple && !isFocused && selectedValues.length > 0
                            ? uniqueOptions.find(
                                o => o.value === selectedValues[0]
                            )?.label ?? ""
                            : inputValue
                    }
                    onChange={e => setInputValue(e.target.value)}
                    onFocus={() => {
                        setShowOptions(true);
                        setIsFocused(true);
                        if (!multiple) setInputValue("");
                    }}
                />

                {inputValue && (
                    <button
                        type="button"
                        onClick={clearInput}
                        className="
                            absolute right-2 top-1/2 -translate-y-1/2
                            text-main/60 hover:text-main
                            text-sm leading-none
                        "
                        aria-label="Clear"
                    >
                        <i className="bi bi-x-lg text-danger"></i>
                    </button>
                )}
            </div>

            {showOptions && (
                <div
                    className={`
                        absolute z-50 mt-1 w-full max-h-44 overflow-y-auto
                        border-2 border-main-300 bg-main-200
                        ${radiusStyles[radius]}
                    `}
                >
                    {filteredOptions.length === 0 ? (
                        <div
                            className={`
                                italic text-main text-left
                                ${optionSizeStyles[size]}
                            `}
                        >
                            No items found
                        </div>
                    ) : (
                        orderedOptions.map(option => {
                            const isSelected = selectedValues.includes(
                                option.value
                            );

                            return (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option)}
                                    className={`
                                        cursor-pointer transition text-left
                                        ${optionSizeStyles[size]}
                                        ${styles.hover}
                                        ${isSelected
                                            ? `${styles.text} ${styles.bg} font-semibold`
                                            : ""
                                        }
                                    `}
                                >
                                    {option.label}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
