"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
    theme: Theme;
    toggle: () => void;
}>({ theme: "light", toggle: () => {} });

export function useTheme() {
    return useContext(ThemeContext);
}

function readTheme(): Theme {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme") as Theme | null;
    return stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const themeRef = useRef<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const theme = readTheme();
        themeRef.current = theme;
        document.documentElement.classList.toggle("dark", theme === "dark");
        setMounted(true);
    }, []);

    const toggle = useCallback(() => {
        const next = themeRef.current === "dark" ? "light" : "dark";
        themeRef.current = next;
        localStorage.setItem("theme", next);
        document.documentElement.classList.toggle("dark", next === "dark");
        setMounted((v) => !v);
    }, []);

    if (!mounted) {
        return <ThemeContext.Provider value={{ theme: "light", toggle }}>{children}</ThemeContext.Provider>;
    }

    return (
        <ThemeContext.Provider value={{ theme: themeRef.current, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}
