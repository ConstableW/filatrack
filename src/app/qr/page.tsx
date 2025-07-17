"use client";

import { Filament } from "@/db/types";
import { Box, Weight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Suspense, useEffect, useState } from "react";
import { getFilament } from "../lib/db/filament";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import { endpoints } from "../lib/constants";
import { grams } from "../lib/units";

function QRPageComponent() {
    const searchParams = useSearchParams();

    const [filament, setFilament] = useState<Filament[]>([]);

    if (!searchParams.has("filament") || !searchParams.has("options"))
        return null;

    const filamentList = searchParams.get("filament")!.split(",");
    const options = searchParams.get("options")!.split(",");

    useEffect(() => {
        const filamentData: Filament[] = [];

        (async() => {
            for (const f of filamentList) {
                await getFilament(f).then(res => {
                    if (res.error)
                        toast.error(`Error retireving filament: ${res.error}`);

                    filamentData.push(res.data!);
                });
            }
            setFilament(filamentData);
        })();
    }, []);

    useEffect(() => {
        if (filament.length !== filamentList.length)
            return;

        setTimeout(print, 1000);
    }, [filament]);

    return (<>
        {!filament.length && <Spinner />}
        {filament.map(f => <div
            className={`${options.includes("border") && "border-2 border-black"}
            rounded-lg p-3 bg-white inline-block text-black mr-1`}
            key={f.shortId}
        >
            <QRCodeSVG
                value={`${endpoints.app}?f=${f.shortId}`}
                imageSettings={{
                    src: "/filament-black.png",
                    width: 35,
                    height: 35,
                    excavate: true,
                }}
                width="100%"
                level="M"
            />
            {options.includes("name") && <h3 className="text-wrap text-center leading-5 my-1">{f.name}</h3>}
            {options.includes("brand") && <p className="text-wrap text-center leading-5 my-1">{f.brand}</p>}
            {options.includes("mass") && <div className="flex flex-row w-full justify-center items-center gap-1 text-sm">
                <Weight size={20} />
                {grams(f.startingMass)}
            </div>}
            {options.includes("mat") && <div className="flex flex-row w-full justify-center items-center gap-1 text-sm">
                <Box size={20} />
                {f.material}
            </div>}
        </div>)}
    </>);
}

export default function QRPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <QRPageComponent />
        </Suspense>
    );
}
