import { Filament } from "@/db/types";
import { baseUrl, endpoints } from "@/lib/constants";
import { grams } from "@/lib/units";
import { Weight, Box } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export function FilamentQREntry({ options, filament }: { options: string[], filament: Filament }) {
    return (<div
        className={`${options.includes("border") && "border-2 border-black"}
            p-3 bg-white text-black mr-1 flex gap-4 w-[350px] relative`}
        key={filament.shortId}
    >
        <div className="">
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
            <p className="text-xs leading-2 w-full text-center">{baseUrl.replaceAll(/(http(s)?:\/\/|\/)/g, "")}</p>
        </div>

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
