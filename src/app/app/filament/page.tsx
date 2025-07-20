"use client";

import { useEffect, useState } from "react";
import { Box, Filament, UserSettings } from "@/db/types";
import { ListFilter } from "lucide-react";
import Input from "@/components/Input";
import { app } from "../../../lib/db";
import { useDevice } from "../../../lib/hooks";
import SearchTipsModal from "@/components/filament/SearchTips";
import Footer from "@/components/Footer";
import { sidebarWidth } from "../../../lib/constants";
import { Select } from "@/components/Select";
import { handleApiError } from "../../../lib/errors";
import FilamentList from "@/components/filament/FilamentList";
import BoxList from "@/components/boxes/BoxList";

export default function FilamentPage() {
    const [isMobile, width] = useDevice();

    const [sortBy, setSortBy] = useState<keyof Filament>("index");
    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState("");

    const [userSettings, setUserSettings] = useState<UserSettings>();

    const [allFilament, setAllFilament] = useState<Filament[]>();
    const [allBoxes, setAllBoxes] = useState<Box[]>();

    function fetchFilament() {
        app.filament.getAllFilaments().then(res => {
            if (res.error)
                return void handleApiError(res.error, "toast");

            setAllFilament(res.data!);
        });
    }

    useEffect(() => {
        app.settings.getUserSettings().then(res => {
            if (res.error)
                return void handleApiError(res.error, "toast");

            setUserSettings(res.data!);
        });

        fetchFilament();

        app.boxes.getAllBoxes().then(res => {
            if (res.error)
                return void handleApiError(res.error, "toast");

            setAllBoxes(res.data!);
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
                    onFocus={() => setOpenModal((userSettings?.seenSearchTips ?? true) ? "" : "searchtips")}
                />
            </div>

            <BoxList
                allBoxes={allBoxes}
                allFilament={allFilament}
                onAdd={box => setAllBoxes([...allBoxes!, box])}
                onEdit={(newBox, i) => setAllBoxes([...allBoxes!.slice(0, i), newBox, ...allBoxes!.slice(i + 1)])}
                onDelete={boxId => setAllBoxes(allBoxes?.filter(b => b.id !== boxId))}
                onReorder={setAllBoxes}
            />

            <FilamentList
                data={search ? allFilament : allFilament?.filter(f => !f.box)}
                title="Your Filament"
                allowAdd
                sortBy={sortBy}
                search={search}
                allBoxes={allBoxes}
                userSettings={userSettings}
                onModify={fetchFilament}
            />

            <Footer />
        </div>

        <SearchTipsModal
            open={openModal === "searchtips"}
            onClose={() => {
                setUserSettings({ ...userSettings!, seenSearchTips: true });
                setOpenModal("");
            }}
        />
    </>;
}
