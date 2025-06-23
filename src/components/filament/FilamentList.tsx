"use client";

import { useEffect, useState } from "react";
import FilamentEntry from "./Filament";
import { Filament, UserSettings } from "@/db/types";
import Skeleton from "../Skeleton";
import { Plus } from "lucide-react";
import AddFilamentModal from "./AddFilament";
import Divider from "../Divider";
import { toast } from "sonner";
import { app } from "@/app/lib/db";

export default function FilamentList({ isEmpty, allowAdd, title, sortBy, search }:
    { allowAdd?: boolean, isEmpty?: boolean, title: string, sortBy?: keyof Filament, search?: string }) {
    const [filaments, setFilaments] = useState<Filament[]>([]);
    const [filamentsToShow, setFilamentsToShow] = useState<number[] | null>(null);

    const [loading, setLoading] = useState(true);

    const [addFilamentOpen, setAddFilamentOpen] = useState(false);

    const [userSettings, setUserSettings] = useState<UserSettings>();

    function sort() {
        if (!sortBy)
            return;

        let newFilaments: Filament[] = [...filaments];

        if (sortBy === "currentMass" || sortBy === "startingMass")
            newFilaments = [...filaments.sort((a, b) => b[sortBy] - a[sortBy])];

        if (sortBy === "name" || sortBy === "brand" || sortBy === "material" || sortBy === "lastUsed")
            newFilaments = [...filaments.sort((a, b) => {
                if (a[sortBy] < b[sortBy])
                    return -1;
                if (a[sortBy] > b[sortBy])
                    return 1;
                return 0;
            })];

        if (sortBy === "lastUsed")
            newFilaments.reverse();

        setFilaments(newFilaments);
    }

    function updateSearch() {
        if (!search) {
            setFilamentsToShow(null);
            return;
        }

        let searchField = "name";

        if (search.startsWith("b:"))
            searchField = "brand";
        else if (search.startsWith("m:"))
            searchField = "material";

        search = search.replace(/^.:/, "").trim();

        const toShow = [];

        for (const filament of filaments) {
            if ((filament[searchField as keyof Filament] as string).toLowerCase().includes(search.toLowerCase()))
                toShow.push(filaments.indexOf(filament));
        }

        setFilamentsToShow(toShow);

        sort();
    }

    useEffect(() => {
        app.settings.getUserSettings().then(res => {
            if (res.error) {
                toast.error(`Error retrieving filament: ${res.error}`);
                return;
            }

            setUserSettings(res.data!);
        });

        app.filament.getAllFilaments().then(res => {
            if (res.error) {
                toast.error(`Error retrieving filament: ${res.error}`);
                return;
            }

            setFilaments(res.data!);

            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!filaments.length)
            return;

        updateSearch();
        sort();
    }, [loading]);

    useEffect(() => {
        sort();
    }, [sortBy]);

    useEffect(() => {
        updateSearch();
    }, [search]);

    function deleteFilament(i: number) {
        setFilaments([...filaments.slice(0, i), ...filaments.slice(i + 1)]);
    }

    function editFilament(i: number, newData: Filament) {
        setFilaments([...filaments.slice(0, i), newData, ...filaments.slice(i + 1)]);
    }

    return (<>
        <h2>{title}</h2>
        <Divider />

        <div className={`${!loading && "grid grid-cols-2"} md:flex md:flex-row gap-2 md:flex-wrap`}>
            {loading && <Skeleton
                width="100%"
                height={269}
                count={2}
                className="flex flex-row gap-2 md:flex-wrap [&>br]:hidden md:w-full *:w-full md:*:!w-[175px]"
            />}

            {filaments
                .map((f, i) => {
                    if (filamentsToShow !== null && !filamentsToShow.includes(i))
                        return null;
                    if (f.currentMass <= 0 && !isEmpty)
                        return null;
                    if (f.currentMass > 0 && isEmpty)
                        return null;
                    return <FilamentEntry
                        key={f.id}
                        filament={f}
                        onDelete={() => deleteFilament(i)}
                        onEdit={f => editFilament(i, f)}
                        userSettings={userSettings}
                    />;
                })
            }

            {(allowAdd && !loading) &&
            <div
                className={`bg-bg-light rounded-lg p-2 flex flex-col gap-1 items-center justify-center relative md:w-[175px] 
                    cursor-pointer transition-all border-2 border-transparent hover:border-primary w-full min-h-[230px]`}
                onClick={() => setAddFilamentOpen(true)}
            >
                <Plus className="absolute-center text-gray-500" size={64} />
            </div>
            }

            <AddFilamentModal
                open={addFilamentOpen}
                onClose={() => setAddFilamentOpen(false)}
                onAdd={f => setFilaments([...filaments, ...(Array.isArray(f) ? f : [f])])}
            />
        </div>
    </>);
}
