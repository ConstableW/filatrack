"use client";

import { app } from "@/app/lib/db";
import { useDevice, useObjectState } from "@/app/lib/hooks";
import { sidebarWidth } from "@/app/lib/random";
import Button, { ButtonStyles } from "@/components/Button";
import Divider from "@/components/Divider";
import MassPicker from "@/components/filament/MassPicker";
import MaterialPicker from "@/components/filament/MaterialPicker";
import SearchTipsModal from "@/components/filament/SearchTips";
import Input from "@/components/Input";
import Modal, { ModalFooter } from "@/components/Modal";
import Spinner from "@/components/Spinner";
import Subtext from "@/components/Subtext";
import Tab from "@/components/tabs/Tab";
import Tablist from "@/components/tabs/Tablist";
import { UserSettings } from "@/db/types";
import { X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
    const [isMobile, width] = useDevice();

    const { data: session } = useSession();

    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const [username, setUsernameInput] = useState("");

    const [userSettings, setUserSettingsData] = useObjectState<UserSettings>({
        userId: "",
        timeFormat: "12-hour",
        dateFormat: "mm/dd/yyyy",
        defaultMaterial: "PLA",
        materialPickerOptions: [],
        defaultMass: 1000,
        seenSearchTips: false,
        seenDialogs: [],
        additionalFilamentModifier: 0,
    });

    const [modal, setModal] = useState("");
    const [deleteAccountConfirm, setDeleteAccountConfirm] = useState(false);

    useEffect(() => {
        if (!session)
            return;

        setLoading(true);

        setUsernameInput(session.user!.name!);

        app.settings.getUserSettings().then(r => setUserSettingsData(r.data ?? {}));

        setLoading(false);
    }, [session]);

    async function saveUsername() {
        setSaveLoading(true);

        const res = await app.settings.setUsername(username);

        if (res.error)
            console.error(res.error);

        setSaveLoading(false);
    }

    async function saveSettings() {
        setSaveLoading(true);

        const res = await app.settings.updateUserSettings(userSettings);

        if (res.error)
            console.error(res.error);

        setUserSettingsData(res.data!);

        setSaveLoading(false);
    }

    async function deleteAccount() {
        setModal("");
        setDeleteAccountConfirm(false);

        setSaveLoading(false);

        await app.settings.deleteUser();

        signOut();
    }

    return (<div
        className="bg-bg w-full p-4 pt-2 mb-[75px] md:mb-0 h-full"
        style={{ marginLeft: (!width || isMobile) ? undefined : sidebarWidth }}
    >
        <Tablist tabs={["Account", "Preferences"]} activeTab="Account">
            <Tab name="Account" className="w-[200px]">
                <h1>Account</h1>

                {(!session || loading) && <Spinner />}

                {(session && !loading) && <>
                    <img src={session.user!.image!} className="rounded-full w-[100px]" />

                    <Input label="Username" value={username} onChange={e => setUsernameInput(e.target.value)} maxLength={12} />

                    <Divider />

                    <Button look={ButtonStyles.danger} onClick={() => setModal("delete")}>Delete Account</Button>

                    <Divider />

                    <Button loading={saveLoading} onClick={saveUsername}>Save</Button>
                </>}

                <Modal open={modal === "delete"} onClose={() => setModal("")} danger title="Delete Account">
                    <Subtext>Delete all of your data involving Filatrack.</Subtext>
                    <Divider />

                    <p className="min-w-[300px] md:min-w-0">
                        Are you SURE you want to DELETE your Filatrack account?
                        This will delete ALL data, including added filament and their logs.
                        Your account will not be recoverable.
                    </p>

                    <Divider />

                    <Input
                        type="checkbox"
                        label="I wish to delete all of my data from Filatrack."
                        onChange={e => setDeleteAccountConfirm(e.target.checked)}
                        checked={deleteAccountConfirm}
                    />

                    <ModalFooter>
                        <Button onClick={() => setModal("")} look={ButtonStyles.secondary}>Cancel</Button>
                        <Button
                            onClick={deleteAccount}
                            look={ButtonStyles.danger}
                            disabled={!deleteAccountConfirm}
                        >Continue</Button>
                    </ModalFooter>
                </Modal>
            </Tab>
            <Tab name="Preferences">
                <h1>Preferences</h1>

                {(!session || loading) && <Spinner />}

                {!loading && <>
                    {/* <p>Time Format</p>
                    <Select value={userSettings.timeFormat} onChange={e => setUserSettingsData({ timeFormat: e.target.value })}>
                        <option value="12-hour">12-hour</option>
                        <option value="24-hour">24-hour</option>
                    </Select>

                    <p>Date Format</p>
                    <Select value={userSettings.dateFormat} onChange={e => setUserSettingsData({ dateFormat: e.target.value })}>
                        <option value="mm/dd/yyyy">mm/dd/yyyy</option>
                        <option value="dd/mm/yyyy">dd/mm/yyyy</option>
                        <option value="yyyy/mm/dd">yyyy/mm/dd</option>
                    </Select> */}

                    <Divider />

                    <Button onClick={() => setModal("search")}>View Search Tips</Button>
                    <SearchTipsModal open={modal === "search"} onClose={() => setModal("")} />

                    <Divider />

                    <Input
                        label="Additional Filament Modifier (g)"
                        type="number"
                        value={userSettings.additionalFilamentModifier}
                        onChange={e => setUserSettingsData({ additionalFilamentModifier: parseInt(e.target.value) })}
                    />
                    <Subtext>When you log filament, this value will be added to account for purge material or waste.</Subtext>

                    <Divider />

                    <b>Default Material</b>
                    <Button onClick={() => setModal("materialpickeroptions")}>Edit Options</Button>
                    <div>
                        <MaterialPicker
                            value={userSettings.defaultMaterial}
                            onChange={v => setUserSettingsData({ defaultMaterial: v })}
                            userSettings={userSettings}
                        />
                    </div>

                    <Divider />

                    <b>Default Filament Mass</b>
                    <div>
                        <MassPicker
                            values={{ currentMass: userSettings.defaultMass, startingMass: userSettings.defaultMass }}
                            onChange={v => setUserSettingsData({ defaultMass: v.currentMass })}
                            noHelper
                        />
                    </div>

                    <Divider />

                    <Button loading={saveLoading} onClick={saveSettings}>Save</Button>

                    <Modal open={modal === "materialpickeroptions"} onClose={() => setModal("")} title="Edit Material Picker Options">
                        <Subtext>Edit the default options for the material picker</Subtext>
                        <Divider />

                        <Input
                            placeholder="Press enter to add option"
                            onKeyDown={e => {
                                if (e.key !== "Enter")
                                    return;

                                setUserSettingsData({
                                    materialPickerOptions: [
                                        ...userSettings.materialPickerOptions,
                                        (e.target as HTMLInputElement).value,
                                    ],
                                });

                                (e.target as HTMLInputElement).value = "";
                            }}
                            maxLength={7}
                        />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mt-2">
                            {userSettings.materialPickerOptions.map((v, i) => (
                                <div
                                    className={`bg-bg-lighter rounded-full px-3 py-1 
                                        text-center flex items-center justify-between`}
                                    key={v}
                                >
                                    {v}
                                    <X
                                        className="text-gray-500 cursor-pointer min-w-[24px] ml-1"
                                        onClick={() => setUserSettingsData({
                                            materialPickerOptions: [
                                                ...userSettings.materialPickerOptions.slice(0, i),
                                                ...userSettings.materialPickerOptions.slice(i + 1),
                                            ],
                                        })}
                                    />
                                </div>
                            ))}
                        </div>

                        <ModalFooter>
                            <Button onClick={() => saveSettings().then(() => setModal(""))} loading={saveLoading}>Save</Button>
                        </ModalFooter>
                    </Modal>
                </>}
            </Tab>
        </Tablist>
        <a href="/about/privacy-policy" className="style">Privacy Policy</a>
    </div>);
}
