"use client";

import { useEffect, useState } from "react";
import FilamentEntry from "./Filament";
import { Filament, UserSettings } from "@/db/types";
import Skeleton from "../Skeleton";
import { Plus } from "lucide-react";
import AddFilamentModal from "./AddFilament";
import Divider from "../Divider";
import Button from "../Button";
import Subtext from "../Subtext";

export default function FilamentList({ data, userSettings, allowAdd, title, sortBy, search }:
    { data?: Filament[] | null, userSettings?: UserSettings, allowAdd?: boolean,
        isEmpty?: boolean, title: string, sortBy?: keyof Filament, search?: string
}) {
    const [addFilamentOpen, setAddFilamentOpen] = useState(false);

    const [filament, setFilament] = useState(data);
    const [searchedFilament, setSearchedFilament] = useState<number[] | null>(null);

    function sort() {
        if (!sortBy || !filament)
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
    }

    function updateSearch() {
        if (!search || !filament) {
            setSearchedFilament(null);
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

        sort();
        setSearchedFilament(toShow);
    }

    function deleteFilament(i: number) {
        if (!filament)
            return;
        setFilament([...filament.slice(0, i), ...filament.slice(i + 1)]);
    }

    function editFilament(i: number, newData: Filament) {
        if (!filament)
            return;
        setFilament([...filament.slice(0, i), newData, ...filament.slice(i + 1)]);
    }

    useEffect(() => {
        setFilament(data);
        updateSearch();
    }, [data]);

    return (<>
        <div className="flex flex-row items-center justify-between mt-1">
            <h2>{title}</h2>
            {allowAdd && <Button
                onClick={() => setAddFilamentOpen(true)}
            >
                <Plus size={32} />
            </Button>}
        </div>
        <Divider />

        <div className={`${!filament && "grid grid-cols-2"} md:flex md:flex-row gap-2 md:flex-wrap`}>
            {!filament && <Skeleton
                width="100%"
                height={269}
                count={2}
                className="flex flex-row gap-2 md:flex-wrap [&>br]:hidden md:w-full *:w-full md:*:!w-[175px]"
            />}

            {filament?.map((f, i) => (
                (searchedFilament === null || searchedFilament.includes(i)) &&
                    <FilamentEntry
                        key={f.id}
                        filament={f}
                        onDelete={() => deleteFilament(i)}
                        onEdit={f => editFilament(i, f)}
                        onAdd={f => setFilament([...filament, f])}
                        userSettings={userSettings}
                    />
            ))}

            {(allowAdd && !!filament?.length) &&
            <div
                className={`bg-bg-light rounded-lg p-2 flex flex-col gap-1 items-center justify-center relative md:w-[175px] 
                    cursor-pointer transition-all border-2 border-transparent hover:border-primary w-full min-h-[230px] 
                    drop-shadow-lg`}
                onClick={() => setAddFilamentOpen(true)}
            >
                <Plus className="absolute-center text-gray-500" size={64} />
            </div>
            }

            {(filament && !allowAdd) && <Subtext>Nothing to see here.</Subtext>}

            {(userSettings && filament) && <AddFilamentModal
                open={addFilamentOpen}
                onClose={() => setAddFilamentOpen(false)}
                onAdd={f => setFilament([...filament, ...(Array.isArray(f) ? f : [f])])}
                userSettings={userSettings}
            />}
        </div>
    </>);
}
