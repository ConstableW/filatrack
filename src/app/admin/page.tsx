"use client";

// This page is just analytics for me. You can browse all you want through here.
// This endpoint requires you to be logged in to my account.

import Divider from "@/components/Divider";
import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { getBatchAnalyticEntries, getTotalFilament, getTotalLogs, getTotalUsers } from "../lib/analytics";
import { analyticsTable } from "@/db/schema/analytics";
import Select from "@/components/Select";

const dateFormatter = Intl.DateTimeFormat(undefined, {
    month: "2-digit",
    day: "2-digit",
});

const timeSpanOptions = [7, 14, 30, 60, 365];
const day = 1000 * 60 * 60 * 24;

export default function AdminPage() {
    const [currentStats, setCurrentStats] = useState({
        totalUsers: 0,
        totalFilament: 0,
        totalLogs: 0,
    });

    const [entries, setEntries] = useState<(typeof analyticsTable.$inferSelect)[]>([]);
    const [selectedTimeSpan, setSelectedTimeSpan] = useState(timeSpanOptions[0]);

    const [loading, setLoading] = useState(false);

    async function getEntries() {
        setEntries([]);
        setLoading(true);

        getBatchAnalyticEntries(new Date(new Date().getTime() - (selectedTimeSpan - 1) * day), new Date())
            .then(r => setEntries(r.data!.reverse()));

        setLoading(false);
    }

    useEffect(() => {
        getEntries();
    }, [selectedTimeSpan]);

    useEffect(() => {
        (async() => {
            setCurrentStats({
                totalUsers: (await getTotalUsers()).data!,
                totalFilament: (await getTotalFilament()).data!,
                totalLogs: (await getTotalLogs()).data!,
            });

            getEntries();
        })();
    }, []);

    return (<>
        <div className="rounded-lg bg-bg-light p-4 m-10 mb-2">
            <h1>Analytics</h1>

            <Select value={selectedTimeSpan} onChange={e => setSelectedTimeSpan(parseInt(e.target.value))}>
                {timeSpanOptions.map(o => <option key={o} value={o}>{o} days</option>)}
            </Select>
        </div>
        <div className="w-full flex flex-row gap-2 p-10 pt-0">
            <div className="w-full bg-bg-light p-5 rounded-lg">
                <h1 className="text-gray-500">Users</h1>
                <Divider />
                <p>Total Users</p>
                <h1>{currentStats.totalUsers}</h1>

                <LineChart
                    height={300}
                    series={[
                        {
                            data: entries.map(e => e.signUps).reverse(),
                        },
                    ]}
                    loading={loading}
                    yAxis={[{ label: "Sign-Ups" }]}
                    xAxis={[
                        {
                            scaleType: "point",
                            data: Array
                                .from({ length: entries.length })
                                .map((_, i) => new Date(new Date().getTime() - i * day))
                                .reverse(),
                            valueFormatter: (value: Date) => dateFormatter.format(value),
                        },
                    ]}
                />
            </div>
            <div className="w-full bg-bg-light p-5 rounded-lg">
                <h1 className="text-gray-500">Filament</h1>
                <Divider />
                <p>Total Filament</p>
                <h1>{currentStats.totalFilament}</h1>

                <LineChart
                    height={300}
                    series={[
                        {
                            data: entries.map(e => e.filamentCreated).reverse(),
                        },
                    ]}
                    loading={loading}
                    yAxis={[{ label: "Filament Created" }]}
                    xAxis={[
                        {
                            scaleType: "point",
                            data: Array
                                .from({ length: entries.length })
                                .map((_, i) => new Date(new Date().getTime() - i * day))
                                .reverse(),
                            valueFormatter: (value: Date) => dateFormatter.format(value),
                        },
                    ]}
                />
            </div>
        </div>
    </>);
}
