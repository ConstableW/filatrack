"use client";

import Divider from "@/components/Divider";
import FilamentList from "@/components/filament/FilamentList";
import Footer from "@/components/Footer";
import Spinner from "@/components/Spinner";
import Tablist from "@/components/tabs/Tablist";
import { Filament, UserSettings } from "@/db/types";
import { endpoints, sidebarWidth } from "@/lib/constants";
import { day } from "@/lib/date";
import { app } from "@/lib/db";
import { handleApiError } from "@/lib/errors";
import { useDevice } from "@/lib/hooks";
import { grams } from "@/lib/units";
import { PieChart, PieValueType, useDrawingArea } from "@mui/x-charts";
import { useEffect, useState } from "react";

function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return <text
        x={left + width / 2}
        y={top + height / 2}
        textAnchor="middle"
        dominantBaseline="ideographic"
        className="text-center whitespace-pre-wrap"
    >
        {children}
    </text>;
}

export default function DashboardPage() {
    const [isMobile, width] = useDevice();

    const [allFilament, setAllFilament] = useState<Filament[]>();
    const [userSettings, setUserSettings] = useState<UserSettings>();

    const [chartMode, setChartMode] = useState<"Color" | "Material" | "Brand">("Color");
    const [chartData, setChartData] = useState<PieValueType[]>([]);

    useEffect(() => {
        app.filament.getAllFilaments().then(res => {
            if (res.error)
                return void handleApiError(res.error, "toast");

            setAllFilament(res.data!);
        });

        app.settings.getUserSettings().then(res => {
            if (res.error)
                return void handleApiError(res.error, "toast");

            setUserSettings(res.data!);
        });
    }, []);

    useEffect(() => {
        if (!allFilament)
            return;

        if (chartMode === "Color") {
            const colors: Record<string, number> = {};

            allFilament.forEach(f => colors[f.color] = colors[f.color] ?
                colors[f.color] + f.currentMass :
                f.currentMass);

            setChartData(Object.keys(colors).map(k => ({
                value: colors[k],
                color: k,
                label: k || "[unset]",
            })));
        } else if (chartMode === "Brand") {
            const brands: Record<string, number> = {};

            allFilament.forEach(f => brands[f.brand] = brands[f.brand] ?
                brands[f.brand] + f.currentMass :
                f.currentMass);

            setChartData(Object.keys(brands).map(k => ({
                value: brands[k],
                label: k || "[unset]",
            })));
        } else if (chartMode === "Material") {
            const materials: Record<string, number> = {};

            allFilament.forEach(f => materials[f.material] = materials[f.material] ?
                materials[f.material] + f.currentMass :
                f.currentMass);

            setChartData(Object.keys(materials).map(k => ({
                value: materials[k],
                label: k || "[unset]",
            })));
        }
    }, [chartMode, allFilament]);

    return (
        <div
            className="bg-bg w-full p-4 pt-2 mb-[75px] md:mb-0 h-full pb-20"
            style={{ marginLeft: (!width || isMobile) ? undefined : sidebarWidth }}
        >
            <h1>Dashboard</h1>
            <Divider />

            {!allFilament && <Spinner />}

            {allFilament && !allFilament.length && <p className="whitespace-pre-wrap">
                It seems you haven't added any filament yet.{"\n"}
                Go to the <a href={endpoints.filament} className="style">Filament</a> page to add filament!
            </p>}
            {allFilament && !!allFilament.length && <>
                <div className="w-full flex justify-center mb-2">
                    <Tablist
                        tabs={["Color", "Material", "Brand"]}
                        activeTab="Color"
                        onTabChange={v => setChartMode(v as typeof chartMode)}
                        className="w-fit"
                    />
                </div>

                <PieChart
                    series={[{
                        innerRadius: 60,
                        outerRadius: 100,
                        paddingAngle: 0,
                        cornerRadius: 2,
                        arcLabel: chartMode !== "Color" ? "label" : undefined,
                        highlightScope: { fade: "global", highlight: "item" },
                        valueFormatter: v => grams(v.value),
                        data: chartData,
                    }]}
                    height={200}
                    hideLegend
                    className="[&_path]:!stroke-bg-light [&_text]:!fill-white [&_text]:text-shadow-md [&_text]:text-shadow-black"
                >
                    <PieCenterLabel>
                        {grams(allFilament.map(f => f.currentMass).reduce((prev, curr) => prev + curr))}{"\n"}/
                        {grams(allFilament.map(f => f.startingMass).reduce((prev, curr) => prev + curr))}
                    </PieCenterLabel>
                </PieChart>

                <FilamentList
                    data={allFilament
                        .filter(f => (f.lastUsed ? f.lastUsed.getTime() > (Date.now() - 7 * day) : false))
                        .sort((a, b) => a.lastUsed.getTime() - b.lastUsed.getTime())
                    }
                    title="Recently Used Filament"
                    userSettings={userSettings}
                />
            </>}

            <Footer />
        </div>
    );
}

