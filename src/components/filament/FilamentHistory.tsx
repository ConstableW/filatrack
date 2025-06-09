import { Weight } from "lucide-react";
import Button from "../Button";
import Divider from "../Divider";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import { useEffect, useState } from "react";
import { getFilamentLogs } from "@/app/lib/filament";
import Spinner from "../Spinner";
import { toDateString } from "@/app/lib/date";
import { Filament, FilamentLog } from "@/db/types";

function FilamentHistoryEntry({ log }: { log: FilamentLog }) {
    return (
        <div className="bg-bg-lighter rounded-lg w-full p-2">
            <p>{toDateString(log.time)}</p>
            <Subtext className="flex flex-row items-center">
                <Weight /> {log.filamentUsed}g used ({log.previousMass}g -&gt; {log.newMass}g)
            </Subtext>
        </div>
    );
}

export default function FilamentHistoryModal({ open, onClose, filament }: { filament: Filament } & ModalProps) {
    const [logs, setLogs] = useState<FilamentLog[]>([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
            <Subtext className="mb-2">See all the times this filament was used.</Subtext>
            <Divider />
            {loading && <Spinner />}
            <div className="flex flex-col gap-2">
                {logs.map(l => <FilamentHistoryEntry log={l} key={l.id} />)}
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
