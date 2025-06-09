"use client";

import { useEffect, useState } from "react";
import Skeleton from "../Skeleton";
import FilamentEntry from "./Filament";
import AddFilament from "./AddFilament";
import { getAllFilaments } from "@/app/lib/filament";
import { Filament } from "@/db/types";

export default function FilamentList({ isEmpty, allowAdd }: { allowAdd?: boolean, isEmpty?: boolean }) {
    const [filaments, setFilaments] = useState<Filament[]>([]);

    useEffect(() => {
        getAllFilaments().then(res => {
            if (!res.error)
                setFilaments(res.data!);
        });
    }, []);

    function deleteFilament(i: number) {
        setFilaments([...filaments.slice(0, i), ...filaments.slice(i + 1)]);
    }

    function editFilament(i: number, newData: Filament) {
        setFilaments([...filaments.slice(0, i), newData, ...filaments.slice(i + 1)]);
    }

    return (<>
        {!filaments && <Skeleton width={200} height={269} />}

        {filaments
            .map((f, i) => {
                if (f.currentMass <= 0 && !isEmpty)
                    return null;
                if (f.currentMass > 0 && isEmpty)
                    return null;
                return <FilamentEntry key={f.id} filament={f} onDelete={() => deleteFilament(i)} onEdit={f => editFilament(i, f)} />;
            })
        }

        {allowAdd && <AddFilament onAdd={f => setFilaments([...filaments, f])} />}
    </>);
}
