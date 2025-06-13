"use client";

import FilamentList from "@/components/filament/FilamentList";
import { sidebarWidth } from "../lib/random";
import { useEffect, useState } from "react";
import Select from "@/components/Select";
import { Filament } from "@/db/types";
import { ListFilter } from "lucide-react";

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

    const [sortBy, setSortBy] = useState<keyof Filament>("name");

    return <div
        className="bg-bg w-full md:rounded-lg md:rounded-b-none md:m-2 p-4 pt-2 mb-[75px] md:mb-0 h-full"
        style={{ marginLeft: (!width || isMobile) ? undefined : sidebarWidth }}
    >
        <div className="w-full bg-bg-light rounded-lg p-2 flex flex-row items-center gap-1">
            <ListFilter />
            <Select value={sortBy} onChange={e => setSortBy(e.target.value as keyof Filament)}>
                <option value="name">Name</option>
                <option value="brand">Brand</option>
                <option value="material">Material</option>
                <option value="lastUsed">Last Used</option>
                <option value="currentMass">Current Mass</option>
                <option value="startingMass">Starting Mass</option>
            </Select>
        </div>
        <FilamentList allowAdd title="Your Filament" sortBy={sortBy} />
        <FilamentList isEmpty title="Empty Filament" sortBy={sortBy} />
    </div>;
}
