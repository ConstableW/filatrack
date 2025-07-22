"use client";

import { Filament } from "@/db/types";
import { Box, Weight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Suspense, useEffect, useState } from "react";
import { getAllFilaments } from "../../lib/db/filament";
import Spinner from "@/components/Spinner";
import { grams } from "../../lib/units";
import { endpoints } from "@/lib/constants";

export function FilamentQREntry({ options, filament }: { options: string[], filament: Filament }) {
    return (<div
        className={`${options.includes("border") && "border-2 border-black"}
            p-3 bg-white text-black mr-1 flex gap-4 w-[350px] relative`}
        key={filament.shortId}
    >
        <QRCodeSVG
            value={`${endpoints.app}?f=${filament.shortId}`}
            imageSettings={{
                src: "/filament-black.png",
                width: 35,
                height: 35,
                excavate: true,
            }}
            level="M"
            className="h-full"
        />

        <div className="flex flex-col pr-2 justify-center max-w-[150px]">
            {options.includes("name") && <p className="text-xl font-bold leading-5 mb-1">{filament.name}</p>}
            {options.includes("brand") && <p>{filament.brand}</p>}
            {options.includes("mass") && <div className="flex flex-row items-center gap-1 text-sm">
                <Weight size={20} />
                {grams(filament.startingMass)}
            </div>}
            {options.includes("mat") && <div className="flex flex-row items-center gap-1 text-sm">
                <Box size={20} />
                {filament.material}
            </div>}
        </div>

        {options.includes("swatch") && <div
            className="absolute bottom-3 right-3 w-8 h-8 border-2 rounded-sm"
            style={{ backgroundColor: filament.color }}
        />}
    </div>);
}

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
