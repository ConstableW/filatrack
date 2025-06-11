import Button from "../Button";
import Divider from "../Divider";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import { useEffect, useState } from "react";
import { getFilamentLogs } from "@/app/lib/filament";
import Spinner from "../Spinner";
import { toDateString, toTimeString } from "@/app/lib/date";
import { Filament, FilamentLog } from "@/db/types";
import { ArrowRight, Clock } from "lucide-react";
import { grams } from "@/app/lib/units";

function FilamentHistoryEntry({ log, i }: { log: FilamentLog, i: number }) {
    return (
        <div className="bg-bg-lighter rounded-lg w-full p-2">
            <div className="flex flex-row items-center gap-2">
                <div className="pr-2 border-r-2 border-bg-lightest h-full">
                    <p className="text-gray-500 text-2xl">{i}</p>
                </div>
                <div className="w-full">
                    <div className="flex flex-row items-center gap-1">
                        {log.filamentUsed}g
                        <Subtext className="flex flex-row items-center gap-1">
                            ({grams(log.previousMass)} <ArrowRight size={16} /> {grams(log.newMass)})
                        </Subtext>
                    </div>
                    <Subtext className="flex flex-row items-center gap-1 text-xs">
                        <Clock size={16} /> {toDateString(log.time)}, {toTimeString(log.time, false)}
                    </Subtext>
                </div>
            </div>
        </div>
    );
}

export default function FilamentHistoryModal({ open, onClose, filament }: { filament: Filament } & ModalProps) {
    const [logs, setLogs] = useState<FilamentLog[]>([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!open)
            return;

        setLoading(true);

        setLogs([]);
        getFilamentLogs(filament.id).then(r => {
            setLoading(false);

            if (r.error) {
                setError(r.error);
                return;
            }

            setLogs(r.data!);
        });
    }, [open]);

    return (
        <Modal open={open} onClose={onClose} title="Filament History">
            <Subtext className="mb-2 md:min-w-0 min-w-[300px]">See all the times this filament was used.</Subtext>
            <Divider />
            {loading && <Spinner />}
            <div className="flex flex-col gap-2">
                {logs.map((l, i) => <FilamentHistoryEntry log={l} i={i + 1} key={l.id} />)}
            </div>
            {(logs.length === 0 && !loading) &&
                <p className="w-full text-center">
                    Looks like you haven't logged anything for this filament yet. Get printing!
                </p>
            }
            <ModalFooter error={error}>
                <Button onClick={onClose}>Done</Button>
            </ModalFooter>
        </Modal>
    );
}
