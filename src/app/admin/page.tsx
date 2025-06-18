"use client";

// This page is just analytics for me. You can browse all you want through here.
// This endpoint requires you to be logged in to my account.

import Divider from "@/components/Divider";
import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import Select from "@/components/Select";
import { app } from "../lib/db";
import { AnalyticEntry } from "../lib/db/analytics";
import { day } from "../lib/date";

const dateFormatter = Intl.DateTimeFormat(undefined, {
    month: "2-digit",
    day: "2-digit",
});

const timeSpanOptions = [7, 14, 30, 60, 365];

export default function AdminPage() {
    const [currentStats, setCurrentStats] = useState({
        totalUsers: 0,
        totalFilament: 0,
        totalLogs: 0,
    });

    const [entries, setEntries] = useState<AnalyticEntry[]>([]);

    const [timespan, setTimespan] = useState(timeSpanOptions[0]);
    const [loading, setLoading] = useState(false);

    async function getEntries() {
        setEntries([]);
        setLoading(true);

        app.analytics.getBatchAnalyticEntries(new Date(new Date().getTime() - (timespan - 1) * day), new Date())
            .then(r => setEntries(r.data!.reverse()));

        setLoading(false);
    }

    useEffect(() => {
        getEntries();
    }, [timespan]);

    useEffect(() => {
        (async() => {
            setCurrentStats({
                totalUsers: (await app.analytics.getTotalUsers()).data!,
                totalFilament: (await app.analytics.getTotalFilament()).data!,
                totalLogs: (await app.analytics.getTotalLogs()).data!,
            });
        })();
    }, []);

    return (<>
        <div className="rounded-lg bg-bg-light p-4 m-3 md:m-10 mb-2 md:mb-2">
            <h1>Analytics</h1>

            <Select value={timespan} onChange={e => setTimespan(parseInt(e.target.value))}>
                {timeSpanOptions.map(o => <option key={o} value={o}>{o} days</option>)}
            </Select>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-2 p-3 md:p-10 md:pt-0 pt-0">
            <div className="w-full bg-bg-light p-5 rounded-lg">
                <h1 className="text-gray-500">Users</h1>
                <Divider />
                <p>Total Users</p>
                <h1>{currentStats.totalUsers}</h1>

                <LineChart
                    height={300}
                    series={[
                        {
                            data: Array.from({ length: timespan }).map((_, i) => entries[i]?.signUps ?? 0)
                                .reverse(),
                        },
                    ]}
                    yAxis={[{ label: "Sign-Ups" }]}
                    xAxis={[
                        {
                            scaleType: "point",
                            data: Array
                                .from({ length: timespan })
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
                <div className="flex flex-row gap-2 items-center">
                    <div className="pr-2 border-r-2 border-r-bg-lighter">
                        <p>Total Filament</p>
                        <h1>{currentStats.totalFilament}</h1>
                    </div>
                    <div>
                        <p>Total Logs</p>
                        <h1>{currentStats.totalLogs}</h1>
                    </div>
                </div>

                <LineChart
                    height={300}
                    series={[
                        {
                            data: Array.from({ length: timespan }).map((_, i) => entries[i]?.filamentCreated ?? 0)
                                .reverse(),
                            label: "Filament Created",
                        },
                        {
                            data: Array.from({ length: timespan }).map((_, i) => entries[i]?.logsCreated ?? 0)
                                .reverse(),
                            label: "Logs Created",
                        },
                    ]}
                    xAxis={[
                        {
                            scaleType: "point",
                            data: Array
                                .from({ length: timespan })
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
