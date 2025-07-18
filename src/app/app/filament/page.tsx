"use client";

import FilamentList from "@/components/filament/FilamentList";
import { useEffect, useState } from "react";
import { Filament, UserSettings } from "@/db/types";
import { ListFilter } from "lucide-react";
import Input from "@/components/Input";
import { app } from "../../../lib/db";
import { useDevice } from "../../../lib/hooks";
import SearchTipsModal from "@/components/filament/SearchTips";
import Footer from "@/components/Footer";
import { sidebarWidth } from "../../../lib/constants";
import { Select } from "@/components/Select";
import { handleApiError } from "../../../lib/errors";

export default function HomePage() {
    const [isMobile, width] = useDevice();

    const [sortBy, setSortBy] = useState<keyof Filament>("index");
    const [search, setSearch] = useState("");
    const [searchTipsOpen, setSearchTipsOpen] = useState(false);

    const [userSettings, setUserSettings] = useState<UserSettings>();

    const [allFilament, setAllFilament] = useState<Filament[]>();

    useEffect(() => {
        app.settings.getUserSettings().then(res => {
            if (res.error)
                return void handleApiError(res.error, "toast");

            setUserSettings(res.data!);
        });

        app.filament.getAllFilaments().then(res => {
            if (res.error)
                return void handleApiError(res.error, "toast");

            setAllFilament(res.data!);
        });
    }, []);

    return <>
        <div
            className="bg-bg w-full p-4 pt-2 mb-[75px] md:mb-0 h-full pb-20"
            style={{ marginLeft: (!width || isMobile) ? undefined : sidebarWidth }}
        >
            <div className="w-full bg-bg-light rounded-lg p-2 flex flex-col md:flex-row md:items-center gap-1 drop-shadow-lg">
                <div className="flex flex-row items-center gap-1 w-full md:w-[unset]">
                    <ListFilter className="min-w-[24px]" />
                    <Select
                        value={sortBy}
                        onChange={v => setSortBy(v as keyof Filament)}
                        className="h-full w-full"
                        options={{
                            index: "Custom",
                            name: "Name",
                            brand: "Brand",
                            material: "Material",
                            lastUsed: "Last Used",
                            currentMass: "Current Mass",
                            startingMass: "Starting Mass",
                        }}
                    />
                </div>
                <Input
                    placeholder="Search Filament..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="focus-within:w-full transition-all"
                    onFocus={() => setSearchTipsOpen(!(userSettings?.seenSearchTips ?? true))}
                />
            </div>

            <FilamentList
                allowAdd
                title="Your Filament"
                sortBy={sortBy}
                search={search}
                data={allFilament?.filter(f => f.currentMass > 0) ?? null}
                userSettings={userSettings}
            />
            <FilamentList
                isEmpty
                title="Empty Filament"
                sortBy={sortBy}
                search={search}
                data={allFilament?.filter(f => f.currentMass <= 0) ?? null}
                userSettings={userSettings}
            />

            <Footer />
        </div>

        <SearchTipsModal open={searchTipsOpen} onClose={() => {
            setUserSettings({ ...userSettings!, seenSearchTips: true });
            setSearchTipsOpen(false);
        }} />
    </>;
}
