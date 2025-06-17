import Button, { ButtonStyles } from "../Button";
import Divider from "../Divider";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";
import { toDateString, toTimeString } from "@/app/lib/date";
import { Filament, FilamentLog } from "@/db/types";
import { ArrowRight, Clock, Pencil, Trash2 } from "lucide-react";
import { grams } from "@/app/lib/units";
import LogFilamentModal from "./LogFilament";
import { app } from "@/app/lib/db";

function FilamentHistoryEntry({ log, i, onDelete, onEdit, preview, filament }:
    {
        log: FilamentLog,
        i: number,
        onDelete?: () => void,
        onEdit?: (l: FilamentLog) => void,
        preview?: boolean,
        filament?: Filament
    }) {
    const [openModal, setOpenModal] = useState("");

    return (<>
        <div className="bg-bg-lighter rounded-lg w-full p-2 flex flex-row justify-between items-center">
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
            {!preview && <div className="flex flex-col gap-2">
                <Pencil size={20} className="cursor-pointer hover:scale-105 transition-all" onClick={() => setOpenModal("edit")} />
                <Trash2 size={20} className="cursor-pointer hover:scale-105 transition-all" onClick={() => setOpenModal("delete")} />
            </div>}
        </div>

        {!preview && <Modal open={openModal === "delete"} onClose={() => setOpenModal("")} title="Delete Log" level={1}>
            <Subtext>Delete this log from the filament.</Subtext>
            <Divider />

            <p>Are you sure you want to delete this log?</p>
            <FilamentHistoryEntry log={log} i={i} preview />

            <ModalFooter>
                <Button onClick={() => setOpenModal("")} look={ButtonStyles.secondary}>Cancel</Button>
                <Button onClick={() => {
                    setOpenModal("");
                    onDelete?.();
                }} look={ButtonStyles.danger}>Delete</Button>
            </ModalFooter>
        </Modal>}

        {!preview && <LogFilamentModal
            open={openModal === "edit"}
            onClose={() => setOpenModal("")}
            filament={filament!}
            currentLog={log}
            onFinish={(_, l) => onEdit?.(l)}
        />}
    </>);
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
        app.filament.getFilamentLogs(filament.id).then(r => {
            setLoading(false);

            if (r.error) {
                setError(r.error);
                return;
            }

            setLogs(r.data!);
        });
    }, [open]);

    function onEditLog(newLog: FilamentLog, i: number) {
        setLogs([...logs.slice(0, i), newLog, ...logs.slice(i + 1)]);
    }

    function onDeleteLog(i: number) {
        app.filament.deleteFilamentLog(logs[i]);
        setLogs([...logs.slice(0, i), ...logs.slice(i + 1)]);
    }

    return (
        <Modal open={open} onClose={onClose} title="Filament History">
            <Subtext className="mb-2 md:min-w-0 min-w-[300px]">See all the times this filament was used.</Subtext>
            <Divider />
            {loading && <Spinner />}
            <div className="flex flex-col gap-2">
                {logs.map((l, i) => <FilamentHistoryEntry
                    log={l}
                    i={i + 1}
                    key={l.id}
                    onEdit={l => onEditLog(l, i)}
                    onDelete={() => onDeleteLog(i)}
                    filament={filament}
                />)}
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
