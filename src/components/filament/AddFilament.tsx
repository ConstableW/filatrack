"use client";

import { useEffect, useState } from "react";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import Divider from "../Divider";
import Input from "../Input";
import Button, { ButtonStyles } from "../Button";
import { useObjectState } from "@/app/lib/hooks";
import MaterialPicker from "./MaterialPicker";
import MassPicker from "./MassPicker";
import { Filament, UserSettings } from "@/db/types";
import Spinner from "../Spinner";
import FilamentColorPicker, { filamentColors } from "./ColorPicker";
import { randomFrom } from "@/app/lib/random";
import { DBCreateParams, DBRes } from "@/app/lib/db/types";
import { app } from "@/app/lib/db";

export default function AddFilamentModal({ onAdd, currentFilament, open, onClose, userSettings }:
    ModalProps & { currentFilament?: Filament, onAdd?: (filament: Filament | Filament[]) => void, userSettings: UserSettings }) {
    const [step, setStep] = useState(-1);

    const [copiesToAdd, setCopiesToAdd] = useState("0");

    const [filamentData, setFilamentData] = useObjectState<DBCreateParams<Omit<Filament, "shortId">>>(currentFilament ?? {
        name: "",
        brand: "",
        color: randomFrom(filamentColors),
        material: userSettings.defaultMaterial,
        note: "",

        currentMass: userSettings.defaultMass,
        startingMass: userSettings.defaultMass,

        lastUsed: new Date(0),
    });

    function reset() {
        setFilamentData({
            name: "",
            brand: "",
            color: randomFrom(filamentColors),
            material: userSettings?.defaultMaterial ?? "PLA",
            note: "",

            currentMass: userSettings?.defaultMass ?? 1000,
            startingMass: userSettings?.defaultMass ?? 1000,

            lastUsed: new Date(0),
        });
        setStep(0);
        setError("");
        setCopiesToAdd("0");
    }

    const [error, setError] = useState("");
    const [requiredError, setRequiredError] = useState(false);
    const [loading, setLoading] = useState(false);

    async function addFilament() {
        setError("");
        setRequiredError(false);

        if (!filamentData.name || !filamentData.color || !filamentData.material) {
            setError("You must fill out all required fields");
            setRequiredError(true);
            return;
        }

        if (!(/^#(?:[0-9a-fA-F]{3}){1,2}$/).test(filamentData.color)) {
            setError("Invalid color hex code.");
            return;
        }

        setLoading(true);

        const res = currentFilament ?
            await app.filament.editFilament(currentFilament.id, filamentData) :
            await app.filament.createFilament(filamentData);

        let copiesRes: DBRes<Filament[]> | null = null;
        if (!currentFilament && parseInt(copiesToAdd) > 0 && !Number.isNaN(parseInt(copiesToAdd)))
            copiesRes = await app.filament.createMultipleFilament(filamentData, parseInt(copiesToAdd));

        if (res.error || copiesRes?.error) {
            setError(res.error ?? copiesRes?.error!);
            setLoading(false);
            return;
        }

        setLoading(false);
        onClose();

        onAdd?.([res.data!, ...(copiesRes?.data! ?? [])]);
    }

    useEffect(() => {
        reset();

        if (currentFilament)
            setFilamentData(currentFilament);
    }, [open]);

    return (<>
        <Modal open={open} onClose={onClose} title={`${currentFilament ? "Edit" : "Add"} Filament`}>
            <Subtext>
                {currentFilament ? "Edit this filament's properties." : "Add a new filament to start tracking it's usage."}
            </Subtext>
            <Divider />

            {step === -1 && <Spinner />}

            {step === 0 && <>
                <Input
                    label="Name"
                    value={filamentData.name}
                    onChange={e => setFilamentData({ name: e.target.value })}
                    error={(requiredError && !filamentData.name) && "This field is required"}
                    maxLength={32}
                />
                <Input
                    label="Brand"
                    value={filamentData.brand}
                    onChange={e => setFilamentData({ brand: e.target.value })}
                    maxLength={32}
                />

                <Input label="Notes" value={filamentData.note} onChange={e => setFilamentData({ note: e.target.value })} />
                {!currentFilament && <>
                    <Input
                        label="Copies To Add"
                        type="number"
                        value={copiesToAdd}
                        onChange={e => setCopiesToAdd(e.target.value)}
                    />
                    <Subtext>The amount of copies of this filament to add as well as the original.</Subtext>
                </>}

                <p>Color</p>
                <FilamentColorPicker value={filamentData.color} onChange={c => setFilamentData({ color: c })} />
            </>}

            {step === 1 && <>
                <p>Material</p>
                <MaterialPicker value={filamentData.material} onChange={m => setFilamentData({ material: m })} />
            </>}

            {step === 2 && <>
                <MassPicker values={filamentData} onChange={setFilamentData} />
            </>}

            <ModalFooter error={error}>
                {step >= 0 && <>
                    <Button onClick={() => setStep(Math.max(0, step - 1))} look={ButtonStyles.secondary}>
                        Previous
                    </Button>
                    <Button onClick={() => (step === 2 ? addFilament() : setStep(step + 1))} loading={loading}>
                        {step === 2 ? (currentFilament ? "Edit" : "Add") : "Next"}
                    </Button>
                </>}
            </ModalFooter>
        </Modal>
    </>);
}
