import { PrinterIcon, EllipsisVertical, Box, Timer, Clock, TextIcon } from "lucide-react";
import Button from "../Button";
import Divider from "../Divider";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "../Dropdown";
import FilamentEntry from "../filament/Filament";
import Subtext from "../Subtext";
import { Filament } from "@/db/types";
import { useEffect, useState } from "react";
import LogPrintModal from "./LogPrint";
import Input from "../Input";
import { getLoadedFilament, Printer } from "@/app/lib/db/printers";
import { toDateString } from "@/app/lib/date";
import { toast } from "sonner";
import Spinner from "../Spinner";
import { randomInt } from "@/app/lib/random";

export function MiniPrinterEntry({ printer, inMenu }: { printer: Printer, inMenu?: boolean }) {
    return (
        <div className={!inMenu && "bg-bg-lighter p-2 rounded-lg" || undefined}>
            <b>{printer.name}</b>
            <Subtext className="flex flex-row gap-1 items-center"><Box /> {printer.model}</Subtext>

            <Subtext className="flex flex-row gap-1 items-center"><Box /> {printer.model}</Subtext>
            <Subtext className="flex flex-row gap-1 items-center"><Timer /> {printer.hours} Print Hours</Subtext>
            <Subtext className="flex flex-row gap-1 items-center"><Clock /> Last Used {toDateString(printer.lastUsed)}</Subtext>
            <Subtext className="flex flex-row gap-1 items-center"><TextIcon /> {printer.attributes}</Subtext>
        </div>
    );
}

export function FilamentSlotList({ printer, selectable, values, onChange }:
    { printer: Printer, selectable?: boolean, values?: Filament[], onChange?: (values: Filament[]) => void }) {
    const [loadedFilament, setLoadedFilament] = useState<Filament[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLoadedFilament(printer.id).then(r => {
            setLoading(false);

            if (r.error)
                return void toast.error(`Error retrieving loaded filament: ${r.error}`);

            setLoadedFilament(r.data!);
        });
    }, []);

    function onEdit(newFilament: Filament) {
        const i = loadedFilament.indexOf(newFilament);
        if (!newFilament.printer || newFilament.printer !== printer.id) {
            const newLoadedFilament = [...loadedFilament];
            newLoadedFilament.splice(i, 1);
            setLoadedFilament(newLoadedFilament);
            return;
        }

        if (printer.filamentSlots === 1)
            return void setLoadedFilament([newFilament]);

        setLoadedFilament([...loadedFilament.slice(0, i), newFilament, ...loadedFilament.slice(i + 1)]);
    }

    return (
        <div className="w-full flex flex-row flex-wrap justify-center gap-2">
            {loading && <Spinner />}
            {loadedFilament.map(f => (
                <FilamentSlot
                    filament={f}
                    selectable={selectable}
                    selected={values?.map(f => f.id).includes(f.id)}
                    onEdit={onEdit}
                    onChange={v => {
                        console.log(v);
                        if (!values)
                            return;
                        let newValues = [...values];
                        if (v)
                            newValues.push(f);
                        else
                            newValues.splice(values.indexOf(f), 1);

                        onChange!(newValues);
                    }}
                    key={f.id}
                />
            ))}
            {!loading &&
            (Array.from({ length: printer.filamentSlots - loadedFilament.length }).map(() => (
                <FilamentSlot key={randomInt(0, 10000)} />
            )))
            }
        </div>
    );
}

export function FilamentSlot({ filament, selectable, selected, onChange, onEdit }:
    { filament?: Filament, selectable?: boolean, selected?: boolean,
        onChange?: (checked: boolean) => void, onEdit?: (f: Filament) => void }) {
    if (filament)
        return <div
            className={`relative rounded-lg transition-all
                ${selectable && "cursor-pointer border-2 border-transparent"} 
                ${selected && "!border-primary"}
            `}
            onClick={() => onChange?.(!selected)}
        >
            {selectable &&
            <Input
                className="absolute top-1 left-1 z-50"
                type="checkbox"
                checked={selected}
                onChange={e => onChange?.(e.target.checked)}
            />
            }
            <FilamentEntry filament={filament} noLog isPreview={selectable} light onEdit={onEdit} />
        </div>;

    return <div className="relative w-[175px] min-h-[200px] border-2 border-bg-lighter rounded-lg">
        <Subtext className="absolute-center text-center">No filament loaded</Subtext>
    </div>;
}

export function PrinterEntry({ printer, onEdit }: { printer: Printer, onEdit?: (p: Printer) => void }) {
    const [openModal, setOpenModal] = useState("");

    return (<>
        <div className="w-full bg-bg-light p-2 rounded-lg flex flex-col">
            <div className="w-full flex flex-col gap-1">
                <h2 className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <PrinterIcon size={32} /> {printer.name}
                    </div>
                    <button
                        className={`p-1 rounded-full cursor-pointer 
                                    transition-all bg-bg-light hover:bg-bg-lighter`}
                    >
                        <Dropdown>
                            <DropdownTrigger asChild>
                                <EllipsisVertical className="text-gray-500" />
                            </DropdownTrigger>
                            <DropdownContent>
                                <DropdownItem>History</DropdownItem>
                                <DropdownItem>Edit</DropdownItem>
                                <DropdownItem danger>Delete</DropdownItem>
                            </DropdownContent>
                        </Dropdown>
                    </button>
                </h2>

                <Divider className="!my-0" />

                <Subtext className="flex flex-row gap-1 items-center"><Box /> {printer.model}</Subtext>
                <Subtext className="flex flex-row gap-1 items-center"><Timer /> {printer.hours} Print Hours</Subtext>
                <Subtext className="flex flex-row gap-1 items-center"><Clock /> Last Used {toDateString(printer.lastUsed)}</Subtext>
                <Subtext className="flex flex-row gap-1 items-center"><TextIcon /> {printer.attributes}</Subtext>

                <h3>Filament Slots</h3>
                <Divider className="mt-0 mb-1" />
                <FilamentSlotList printer={printer} />

                <Divider className="!my-1" />

                <Button onClick={() => setOpenModal("log")}>Log Print</Button>
            </div>
        </div>

        <LogPrintModal open={openModal === "log"} onClose={() => setOpenModal("")} printer={printer} onEdit={onEdit} />
    </>);
}
