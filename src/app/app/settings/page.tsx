"use client";

import { useObjectState } from "@/app/lib/hooks";
import { getUserId, getUserSettings, setUsername, setUserSettings } from "@/app/lib/settings";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import MassPicker from "@/components/filament/MassPicker";
import MaterialPicker from "@/components/filament/MaterialPicker";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Spinner from "@/components/Spinner";
import Tab from "@/components/tabs/Tab";
import Tablist from "@/components/tabs/Tablist";
import { userSettingsTable } from "@/db/schema/settings";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
    const { data: session } = useSession();

    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const [username, setUsernameInput] = useState("");
    const [userId, setUserId] = useState("");

    const [userSettings, setUserSettingsData] = useObjectState<typeof userSettingsTable.$inferSelect>({
        userId: "",
        timeFormat: "12-hour",
        dateFormat: "mm/dd/yyyy",
        defaultMaterial: "PLA",
        defaultMass: 1000,
    });

    useEffect(() => {
        if (!session)
            return;

        setLoading(true);

        setUsernameInput(session.user!.name!);

        getUserId().then(r => {
            if (r.error)
                return;

            setUserId(r.data ?? "");
            getUserSettings(r.data!).then(r => setUserSettingsData(r.data ?? {}));

            setLoading(false);
        });
    }, [session]);

    async function saveUsername() {
        setSaveLoading(true);

        const res = await setUsername(username);

        if (res.error)
            console.error(res.error);

        setSaveLoading(false);
    }

    async function saveSettings() {
        setSaveLoading(true);

        const res = await setUserSettings(userId, userSettings);

        if (res.error)
            console.error(res.error);

        setUserSettingsData(res.data!);

        setSaveLoading(false);
    }

    return (<>
        <Tablist tabs={["Account", "Preferences"]} activeTab="Account">
            <Tab name="Account" className="w-[200px]">
                <h1>Account</h1>

                {(!session || loading) && <Spinner />}

                {(session && !loading) && <>
                    <img src={session.user!.image!} className="rounded-full w-[100px]" />

                    <Input label="Username" value={username} onChange={e => setUsernameInput(e.target.value)} maxLength={12} />

                    <Divider />

                    <Button loading={saveLoading} onClick={saveUsername }>Save</Button>
                </>}
            </Tab>
            <Tab name="Preferences">
                <h1>Preferences</h1>

                {(!session || loading) && <Spinner />}

                {!loading && <>
                    <p>Time Format</p>
                    <Select value={userSettings.timeFormat} onChange={e => setUserSettingsData({ timeFormat: e.target.value })}>
                        <option value="12-hour">12-hour</option>
                        <option value="24-hour">24-hour</option>
                    </Select>

                    <p>Date Format</p>
                    <Select value={userSettings.dateFormat} onChange={e => setUserSettingsData({ dateFormat: e.target.value })}>
                        <option value="mm/dd/yyyy">mm/dd/yyyy</option>
                        <option value="dd/mm/yyyy">dd/mm/yyyy</option>
                        <option value="yyyy/mm/dd">yyyy/mm/dd</option>
                    </Select>

                    <Divider />

                    <h2>Defaults</h2>

                    <b>Default Material</b>
                    <div className="w-[400px]">
                        <MaterialPicker
                            value={userSettings.defaultMaterial}
                            onChange={v => setUserSettingsData({ defaultMaterial: v })}
                        />
                    </div>

                    <Divider />

                    <b>Default Filament Mass</b>
                    <div className="w-[400px]">
                        <MassPicker
                            values={{ currentMass: userSettings.defaultMass, startingMass: userSettings.defaultMass }}
                            onChange={v => setUserSettingsData({ defaultMass: v.currentMass })}
                            noHelper
                        />
                    </div>

                    <Divider />

                    <Button loading={saveLoading} onClick={saveSettings}>Save</Button>
                </>}
            </Tab>
        </Tablist>
    </>);
}
