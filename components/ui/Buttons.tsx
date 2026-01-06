import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color: "primary" | "secondary" | "accent" | "neutral" | "success" | "warning" | "error" | "info" | "light" | "dark";
    size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    variant?: "solid" | "outline" | "text";
    rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
}

export function Button({
    color,
    size,
    variant = "solid",
    rounded = "sm",
    className = "",
    children,
    type,
    ...props
}: ButtonProps) {
    const roundedClasses = {
        none: "rounded-none",
        sm: "rounded",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
    };

    const baseClasses =
        "font-sans font-medium shadow inline-flex items-center justify-center gap-2 focus:outline-none  transition disabled:opacity-50 disabled:cursor-not-allowed";

    const sizes = {
        xs: "text-xs px-2 py-1",
        sm: "text-sm px-3 py-1.5",
        md: "text-base px-4 py-2",
        lg: "text-lg px-5 py-2.5",
        xl: "text-xl px-6 py-3",
        "2xl": "text-2xl px-7 py-3.5",
    };

    const colorClasses = {
        primary: {
            solid: "bg-primary text-white hover:bg-primary/90 focus:ring-primary",
            outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary/10 focus:ring-primary",
            text: "text-primary bg-transparent hover:bg-primary/10 focus:ring-primary",
        },
        secondary: {
            solid: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary",
            outline: "border-2 border-secondary text-secondary bg-transparent hover:bg-secondary/10 focus:ring-secondary",
            text: "text-secondary bg-transparent hover:bg-secondary/10 focus:ring-secondary",
        },
        accent: {
            solid: "bg-accent text-white hover:bg-accent/90 focus:ring-accent",
            outline: "border-2 border-accent text-accent bg-transparent hover:bg-accent/10 focus:ring-accent",
            text: "text-accent bg-transparent hover:bg-accent/10 focus:ring-accent",
        },
        neutral: {
            solid: "bg-main text-white hover:bg-main/90 focus:ring-main",
            outline: "border-2 border-main text-main bg-transparent hover:bg-main/10 focus:ring-main",
            text: "text-main bg-transparent hover:bg-main/10 focus:ring-main",
        },
        success: {
            solid: "bg-success text-white hover:bg-success/90 focus:ring-success",
            outline: "border-2 border-success text-success bg-transparent hover:bg-success/10 focus:ring-success",
            text: "text-success bg-transparent hover:bg-success/10 focus:ring-success",
        },
        warning: {
            solid: "bg-warning text-white hover:bg-warning/90 focus:ring-warning",
            outline: "border-2 border-warning text-warning bg-transparent hover:bg-warning/10 focus:ring-warning",
            text: "text-warning bg-transparent hover:bg-warning/10 focus:ring-warning",
        },
        error: {
            solid: "bg-error text-white hover:bg-error/90 focus:ring-error",
            outline: "border-2 border-error text-error bg-transparent hover:bg-error/10 focus:ring-error",
            text: "text-error bg-transparent hover:bg-error/10 focus:ring-error",
        },
        info: {
            solid: "bg-info text-white hover:bg-info/90 focus:ring-info",
            outline: "border-2 border-info text-info bg-transparent hover:bg-info/10 focus:ring-info",
            text: "text-info bg-transparent hover:bg-info/10 focus:ring-info",
        },
        light: {
            solid: "bg-light text-black hover:bg-light/90 focus:ring-light",
            outline: "border-2 border-light text-light bg-transparent hover:bg-light/10 focus:ring-light",
            text: "text-light bg-transparent hover:bg-light/10 focus:ring-light",
        },
        dark: {
            solid: "bg-dark text-white hover:bg-dark/80 focus:ring-dark",
            outline: "border-2 border-dark text-dark bg-transparent hover:bg-dark/10 focus:ring-dark",
            text: "text-dark bg-transparent hover:bg-dark/10 focus:ring-dark",
        },
    };

    const classes = [
        baseClasses,
        roundedClasses[rounded],
        sizes[size],
        colorClasses[color][variant],
        className,
    ].join(" ");

    return (
        <button
            {...props}
            type={type ?? "button"}
            className={classes}
        >
            {children}
        </button>
    );
}
