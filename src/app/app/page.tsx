"use client";

import FilamentList from "@/components/filament/FilamentList";
import { sidebarWidth } from "../lib/random";
import { useEffect, useState } from "react";
import Select from "@/components/Select";
import { Filament, UserSettings } from "@/db/types";
import { ListFilter } from "lucide-react";
import Input from "@/components/Input";
import Modal, { ModalFooter } from "@/components/Modal";
import Subtext from "@/components/Subtext";
import Divider from "@/components/Divider";
import Button from "@/components/Button";
import { app } from "../lib/db";

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
    const [search, setSearch] = useState("");
    const [searchTipsOpen, setSearchTipsOpen] = useState(false);

    const [userSettings, setUserSettings] = useState<UserSettings>();

    useEffect(() => {
        app.settings.getUserSettings().then(r => {
            if (r.error)
                return;

            setUserSettings(r.data!);
        });
    }, []);

    return <>
        <div
            className="bg-bg w-full md:rounded-lg md:rounded-b-none md:m-2 p-4 pt-2 mb-[75px] md:mb-0 h-full"
            style={{ marginLeft: (!width || isMobile) ? undefined : sidebarWidth }}
        >
            <div className="w-full bg-bg-light rounded-lg p-2 flex flex-col md:flex-row md:items-center gap-1">
                <div className="flex flex-row items-center gap-1 w-full md:w-[unset]">
                    <ListFilter className="min-w-[24px]" />
                    <Select value={sortBy} onChange={e => setSortBy(e.target.value as keyof Filament)} className="h-full w-full">
                        <option value="name">Name</option>
                        <option value="brand">Brand</option>
                        <option value="material">Material</option>
                        <option value="lastUsed">Last Used</option>
                        <option value="currentMass">Current Mass</option>
                        <option value="startingMass">Starting Mass</option>
                    </Select>
                </div>
                <Input
                    placeholder="Search Filament..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="focus-within:w-full transition-all"
                    onFocus={() => setSearchTipsOpen(!(userSettings?.seenSearchTips ?? true))}
                />
            </div>
            <FilamentList allowAdd title="Your Filament" sortBy={sortBy} search={search} />
            <FilamentList isEmpty title="Empty Filament" sortBy={sortBy} search={search} />
        </div>

        <Modal open={searchTipsOpen} onClose={() => {
            setUserSettings({ ...userSettings!, seenSearchTips: true });
            app.settings.updateUserSettings({ seenSearchTips: true });
            setSearchTipsOpen(false);
        }} title="Search Tips">
            <Subtext>Some shorthands for searching your filament.</Subtext>
            <Divider />

            <p>By default, the search will search for title. Prefix your search with any one of these to search a different field.</p>
            <p><code>b:</code> Brand</p>
            <p><code>m:</code> Material</p>

            <ModalFooter tip="This modal won't show again. If you want to see the tips again, go to settings.">
                <Button onClick={() => {
                    setUserSettings({ ...userSettings!, seenSearchTips: true });
                    app.settings.updateUserSettings({ seenSearchTips: true });
                    setSearchTipsOpen(false);
                }}>Ok</Button>
            </ModalFooter>
        </Modal>
    </>;
}
