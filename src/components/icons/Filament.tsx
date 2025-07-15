import { Filament } from "@/db/types";
import React from "react";

export default function FilamentIcon({ size, filament }: { size: number, filament?: Filament }) {
    const stage = filament ?
        filament.currentMass <= 0 ? 5 : Math.min(5, Math.max(1, Math.ceil(filament.currentMass / filament.startingMass * 5))) :
        5;

    return (<div className="relative" style={{ width: size, height: size }}>
        <img src="/filament.svg" width={size} height={size}  className="absolute" />
        <div
            className="mask-contain"
            style={{
                width: size,
                height: size,
                backgroundColor: filament?.color ?? "#000",
                maskImage: `url(/filament-color-mask-${stage ?? 5}.svg)`,
            }}
        />
    </div>
    );
}
