"use client";

import { day } from "@/app/lib/date";
import { randomFrom, randomInt } from "@/app/lib/random";
import { Filament } from "@/db/types";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import FilamentEntry from "./Filament";

const filamentNames = {
    Red: "#FF0000",
    Green: "#00FF00",
    Blue: "#0000FF",
    Black: "#000000",
    White: "#FFFFFF",
    Yellow: "#FFFF00",
    Purple: "#800080",
    Wood: "#8B4513",
    Gray: "#808080",
    "Carbon Fiber": "#333333",
    Transparent: "#FFFFFF",
    "Glow in the Dark": "#00FF00",
};

const filamentBrands = [
    "Prusa",
    "Hatchbox",
    "eSUN",
    "MatterHackers",
    "Polymaker",
    "Sunlu",
    "Raise3D",
    "Anycubic",
    "Creality",
    "Elegoo",
    "Bambu",
];

const filamentMaterials = [
    "PLA",
    "ABS",
    "PETG",
    "TPU",
    "ASA",
    "PLA+",
    "HIPS",
    "PC",
    "PVA",
    "Nylon",
    "Wood-filled PLA",
];

const filamentMaxMass = [2000, 1000, 500, 250, 200];

export function randomFilament(): Filament {
    const name = randomFrom(Object.keys(filamentNames));
    const maxMass = randomFrom(filamentMaxMass);

    return {
        name,
        id: `${randomInt(1, 10000000)}`,
        shortId: "",
        userId: "",
        brand: randomFrom(filamentBrands),
        color: filamentNames[name as keyof typeof filamentNames]!,
        lastUsed: new Date(Date.now() - randomInt(0, 100) * day),
        material: randomFrom(filamentMaterials),
        note: "",
        currentMass: randomInt(1, maxMass),
        startingMass: maxMass,
        index: 0,

        printingTemperature: null,
        diameter: null,
        cost: null,

        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

function RandomizedFilament() {
    const [filament, setFilament] = useState(randomFilament());

    useEffect(() => {
        const interval = setInterval(() => setFilament(randomFilament()), 1000);

        return () => clearInterval(interval);
    }, []);

    return <FilamentEntry filament={filament} isPreview />;
}

export default dynamic(() => Promise.resolve(RandomizedFilament), { ssr: false });
