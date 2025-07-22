"use client";

import { Filament } from "@/db/types";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getAllFilaments } from "../../lib/db/filament";
import Spinner from "@/components/Spinner";
import { FilamentQREntry } from "@/components/filament/FilamentQREntry";

function QRPageComponent() {
    const searchParams = useSearchParams();

    const [filament, setFilament] = useState<Filament[]>([]);

    if (!searchParams.has("filament") || !searchParams.has("options"))
        return null;

    const filamentList = searchParams.get("filament")!.split(",");
    const options = searchParams.get("options")!.split(",");

    useEffect(() => {
        getAllFilaments().then(res => {
            if (res.error)
                return;

            setFilament(res.data.filter(f => filamentList.includes(f.id)));
        });
    }, []);

    useEffect(() => {
        if (filament.length !== filamentList.length)
            return;

        setTimeout(print, 1000);
    }, [filament]);

    return (
        <div className="flex gap-1 flex-wrap nobg">
            {!filament.length && <Spinner />}
            {filament.map(f => <FilamentQREntry options={options} filament={f} key={f.id} />)}
        </div>
    );
}

export default function QRPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <QRPageComponent />
        </Suspense>
    );
}
