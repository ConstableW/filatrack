import { useState } from "react";
import Button from "../Button";
import Divider from "../Divider";
import Input from "../Input";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import FilamentEntry from "./Filament";
import { Filament, FilamentLog } from "@/db/types";
import { DBRes } from "@/app/lib/db/types";
import { app } from "@/app/lib/db";

export default function LogFilamentModal({ open, onClose, filament, onFinish, currentLog }:
    { filament: Filament, onFinish: (newFilament: Filament, newLog: FilamentLog) => void, currentLog?: FilamentLog } & ModalProps) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [filamentUsed, setFilamentUsed] = useState(currentLog?.filamentUsed ?? 0);

    async function logFilament() {
        if (filamentUsed === 0) {
            setError("Last time I checked, you can't 3d print anything with 0 grams of filament.");
            return;
        }

        setLoading(true);
        setError("");

        let res: DBRes<FilamentLog> | null = null;
        if (currentLog) {
            res = await app.filament.editFilamentLog({
                filamentUsed,
                filamentId: currentLog.filamentId,
                time: currentLog.time,
            });
        } else {
            res = await app.filament.createFilamentLog({
                filamentUsed,

                previousMass: filament.currentMass,
                newMass: filament.currentMass - filamentUsed,

                filamentId: filament.id,
                time: new Date(),

                print: null,
            });
        }

        if (res.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        const editRes = await app.filament.editFilament(filament.id, {
            currentMass: (currentLog ? currentLog.previousMass : filament.currentMass) - filamentUsed,
            lastUsed: new Date(Math.max((currentLog ? currentLog.time : new Date()).getTime(), filament.lastUsed.getTime())),
        });

        if (editRes.error) {
            setError(editRes.error);
            setLoading(false);
            return;
        }

        setLoading(false);
        setError("");
        setFilamentUsed(0);
        onClose();
        onFinish(editRes.data!, res.data!);
    }

    return (
        <Modal open={open} onClose={onClose} title="Log Filament Use">
            <Subtext className="mb-2">
                    If you've used this filament, log how much was used so you'll know how much is left.
            </Subtext>
            <Divider />
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                <Input
                    label="Filament Used (g)"
                    className="md:w-1/2"
                    type="number"
                    value={filamentUsed}
                    onChange={e => setFilamentUsed(parseInt(e.target.value))}
                    autoFocus={true}
                />
                <FilamentEntry filament={filament} isPreview />
            </div>
            <p className="w-full text-center text-sm">
                This will leave{" "}
                {Math.max(
                    0,
                    (currentLog ? currentLog.previousMass : filament.currentMass) -
                    (Number.isNaN(filamentUsed) ? 0 : filamentUsed)
                )}
                    g / {filament.startingMass / 1000}kg remaining.
            </p>

            {(filament.currentMass - (Number.isNaN(filamentUsed) ? 0 : filamentUsed)) <= 0 &&
                <span className="text-danger">This action will put your filament into your Empty Filament.</span>
            }
            <ModalFooter
                error={error}>
                <Button loading={loading} onClick={logFilament}>Confirm</Button>
            </ModalFooter>
        </Modal>
    );
}
