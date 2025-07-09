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
import { ArrowLeft } from "lucide-react";
import { endpoints } from "../lib/constants";

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
        authenticationMethods: {},
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

                authenticationMethods: (await app.analytics.getAuthenticationMethodStats()).data!,
            });
        })();
    }, []);

    return (<>
        <div className="rounded-lg bg-bg-light p-4 m-3 md:m-10 mb-2 md:mb-2">
            <a className="style flex gap-1 items-center" href={endpoints.app}><ArrowLeft /> Back</a>
            <h1>Analytics</h1>

            <Select value={`${timespan}`} onChange={v => setTimespan(parseInt(v))} options={
                timeSpanOptions.reduce((acc, val) => {
                    acc[`${val}`] = `${val} days`;
                    return acc;
                }, {} as Record<string, string>)
            } />
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
                    yAxis={[{ label: "Sign-Ups", min: 0 }]}
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
                <Divider />
                <h2 className="text-gray-500">Authentication Methods</h2>
                <Divider />
                <table>
                    <thead>
                        <tr>
                            <td>Method</td>
                            <td>Users</td>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(currentStats.authenticationMethods).map(method => <tr key={method}>
                            <td>{method}</td>
                            <td>{currentStats.authenticationMethods[method as keyof typeof currentStats.authenticationMethods]}</td>
                        </tr>)}
                    </tbody>
                </table>
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
                    yAxis={[{
                        min: 0,
                    }]}
                />
            </div>
        </div>
    </>);
}
