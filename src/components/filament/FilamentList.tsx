"use client";

import { useEffect, useState } from "react";
import FilamentEntry from "./Filament";
import { Filament } from "@/db/types";
import Skeleton from "../Skeleton";
import { getAllFilaments } from "@/app/lib/filament";
import { Plus } from "lucide-react";
import AddFilament from "./AddFilament";

export default function FilamentList({ isEmpty, allowAdd }: { allowAdd?: boolean, isEmpty?: boolean }) {
    const [filaments, setFilaments] = useState<Filament[]>([]);
    const [loading, setLoading] = useState(true);

    const [addFilamentOpen, setAddFilamentOpen] = useState(false);

    useEffect(() => {
        getAllFilaments().then(res => {
            if (!res.error)
                setFilaments(res.data!);

            setLoading(false);
        });
    }, []);

    function deleteFilament(i: number) {
        setFilaments([...filaments.slice(0, i), ...filaments.slice(i + 1)]);
    }

    function editFilament(i: number, newData: Filament) {
        setFilaments([...filaments.slice(0, i), newData, ...filaments.slice(i + 1)]);
    }

    return (<>
        {filaments.length === 0 && <Skeleton width={200} height={269} count={1} />}

        {filaments
            .map((f, i) => {
                if (f.currentMass <= 0 && !isEmpty)
                    return null;
                if (f.currentMass > 0 && isEmpty)
                    return null;
                return <FilamentEntry key={f.id} filament={f} onDelete={() => deleteFilament(i)} onEdit={f => editFilament(i, f)} />;
            })
        }

        {(allowAdd && !loading) &&
            <div
                className={`bg-bg-light rounded-lg p-2 flex flex-col gap-1 items-center justify-center relative w-[175px] 
                    cursor-pointer transition-all border-2 border-transparent hover:border-primary min-h-[269px]`}
                onClick={() => setAddFilamentOpen(true)}
            >
                <Plus className="absolute-center text-gray-500" size={64} />
            </div>
        }

        <AddFilament open={addFilamentOpen} onClose={() => setAddFilamentOpen(false)} onAdd={f => setFilaments([...filaments, f])} />
    </>);
}
