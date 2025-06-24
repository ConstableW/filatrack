"use client";

import { useEffect, useState } from "react";
import FilamentEntry from "./Filament";
import { Filament, UserSettings } from "@/db/types";
import Skeleton from "../Skeleton";
import { Plus } from "lucide-react";
import AddFilamentModal from "./AddFilament";
import Divider from "../Divider";

export default function FilamentList({ allFilament, userSettings, isEmpty, allowAdd, title, sortBy, search }:
    { allFilament?: Filament[], userSettings?: UserSettings, allowAdd?: boolean,
        isEmpty?: boolean, title: string, sortBy?: keyof Filament, search?: string
}) {
    const [filament, setFilament] = useState<Filament[]>([]);
    const [filamentsToShow, setFilamentsToShow] = useState<number[] | null>(null);

    const [loading, setLoading] = useState(true);

    const [addFilamentOpen, setAddFilamentOpen] = useState(false);

    function sort() {
        if (!sortBy)
            return;

        let newFilaments: Filament[] = [...filament];

        if (sortBy === "currentMass" || sortBy === "startingMass")
            newFilaments = [...filament.sort((a, b) => b[sortBy] - a[sortBy])];

        if (sortBy === "name" || sortBy === "brand" || sortBy === "material" || sortBy === "lastUsed")
            newFilaments = [...filament.sort((a, b) => {
                if (a[sortBy] < b[sortBy])
                    return -1;
                if (a[sortBy] > b[sortBy])
                    return 1;
                return 0;
            })];

        if (sortBy === "lastUsed")
            newFilaments.reverse();

        setFilament(newFilaments);
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

        for (const f of filament) {
            if ((f[searchField as keyof Filament] as string).toLowerCase().includes(search.toLowerCase()))
                toShow.push(filament.indexOf(f));
        }

        setFilamentsToShow(toShow);

        sort();
    }

    useEffect(() => {
        if (!filament.length)
            return;

        updateSearch();
        sort();
    }, [loading]);

    useEffect(() => {
        if (!userSettings || !allFilament?.length)
            return;

        setLoading(false);
        setFilament(allFilament);
    }, [userSettings, allFilament]);

    useEffect(() => {
        sort();
    }, [sortBy]);

    useEffect(() => {
        updateSearch();
    }, [search]);

    function deleteFilament(i: number) {
        setFilament([...filament.slice(0, i), ...filament.slice(i + 1)]);
    }

    function editFilament(i: number, newData: Filament) {
        setFilament([...filament.slice(0, i), newData, ...filament.slice(i + 1)]);
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

            {filament
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

            {userSettings && <AddFilamentModal
                open={addFilamentOpen}
                onClose={() => setAddFilamentOpen(false)}
                onAdd={f => setFilament([...filament, ...(Array.isArray(f) ? f : [f])])}
                userSettings={userSettings}
            />}
        </div>
    </>);
}
