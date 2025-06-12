"use client";

import FilamentList from "@/components/filament/FilamentList";
import { sidebarWidth } from "../lib/random";
import { useEffect, useState } from "react";

export default function HomePage() {
    const [width, setWidth] = useState(0);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        setWidth(window.innerWidth);
        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    const isMobile = !width ? false : width <= 768;

    return <div
        className="bg-bg w-full md:rounded-lg md:rounded-b-none md:m-2 p-4 pt-2 mb-[75px] md:mb-0 h-full"
        style={{ marginLeft: (!width || isMobile) ? undefined : sidebarWidth }}
    >
        <h1>Your Filament</h1>
        <FilamentList allowAdd />
        <h1>Empty Filament</h1>
        <FilamentList isEmpty />
    </div>;
}
