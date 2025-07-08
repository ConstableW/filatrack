import React from "react";

export default function FilamentIcon({ size, color, stage }: { size: number, color: string, stage?: number }) {
    return (<div className="relative" style={{ width: size, height: size }}>
        <img src="/filament.svg" width={size} height={size}  className="absolute" />
        <div
            className="mask-contain"
            style={{ width: size, height: size, backgroundColor: color, maskImage: `url(/filament-color-mask-${stage ?? 5}.svg)` }}
        />
    </div>
    );
}
