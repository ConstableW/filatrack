"use client";

import { Box, EllipsisVertical, Weight } from "lucide-react";
import FilamentIcon from "../icons/Filament";
import Subtext from "../Subtext";
import Button, { ButtonStyles } from "../Button";
import { useEffect, useState } from "react";
import Modal, { ModalFooter } from "../Modal";
import Divider from "../Divider";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "../Dropdown";
import { deleteFilament, editFilament } from "@/app/lib/filament";
import LogFilamentModal from "./LogFilament";
import FilamentHistoryModal from "./FilamentHistory";
import { toDateString } from "@/app/lib/date";
import { Filament } from "@/db/types";
import { grams } from "@/app/lib/units";
import AddFilament from "./AddFilament";

export default function FilamentEntry({ filament, isPreview, onDelete, onEdit }:
    { filament: Filament, isPreview?: boolean, onDelete?: () => void, onEdit?: (filament: Filament) => void }) {
    const [openModal, setOpenModal] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (openModal === "") {
            setLoading(false);
            setError("");
        }
    }, [openModal]);

    async function onDeleteConfirm() {
        setLoading(true);

        const res = await deleteFilament(filament.id);
        if (res.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        setLoading(false);
        setOpenModal("");
        onDelete?.();
    }

    async function onMoveConfirm() {
        setLoading(true);

        const res = await editFilament(filament.id, {
            currentMass: 0,
        });
        if (res.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        setLoading(false);
        setOpenModal("");
        onEdit?.(res.data!);
    }

    return (<>
        <div className={`bg-bg-light rounded-lg p-2 flex flex-col gap-1 items-center 
            justify-center relative border-2 border-transparent transition-all
            ${isPreview ? "bg-bg-lighter" : "hover:border-primary cursor-pointer "}`}
        >
            <FilamentIcon
                size={75}
                color={filament.color}
                stage={filament.currentMass <= 0 ? 5 : Math.floor(filament.currentMass / filament.startingMass * 5)}
            />

            <p className="text-lg">{filament.name}</p>

            {filament.brand && <Subtext>{filament.brand}</Subtext>}

            <Subtext>Last Used {filament.lastUsed.getTime() === 0 ? "Never" : toDateString(filament.lastUsed)}</Subtext>
            <div className="flex flex-row gap-2">
                <Subtext className="text-xs flex flex-row gap-1 items-center">
                    <Weight size={16} /> {grams(filament.currentMass)} / {grams(filament.startingMass)}
                </Subtext>
                <Subtext className="text-xs flex flex-row gap-1 items-center"><Box size={16} /> {filament.material}</Subtext>
            </div>
            {(!isPreview && filament.currentMass > 0) &&
            <Button className="w-full mt-1" onClick={() => setOpenModal("log")}>Log</Button>
            }

            {!isPreview && <button
                className="absolute top-1 right-1 p-1 rounded-full cursor-pointer transition-all bg-bg-light hover:bg-bg-lighter"
            >
                <Dropdown>
                    <DropdownTrigger asChild>
                        <EllipsisVertical className="text-gray-500" />
                    </DropdownTrigger>
                    <DropdownContent>
                        <DropdownItem onClick={() => setOpenModal("history")}>History</DropdownItem>

                        <DropdownItem onClick={() => setOpenModal("edit")}>Edit</DropdownItem>

                        {filament.currentMass > 0 &&
                        <DropdownItem onClick={() => setOpenModal("move")}>Move to Empty</DropdownItem>}

                        <DropdownItem onClick={() => setOpenModal("delete")} danger>Delete</DropdownItem>
                    </DropdownContent>
                </Dropdown>
            </button>}
        </div>

        {!isPreview && <>
            <LogFilamentModal
                open={openModal === "log"}
                onClose={() => setOpenModal("")}
                filament={filament}
                onFinish={f => onEdit?.(f)}
            />

            <FilamentHistoryModal
                open={openModal === "history"}
                onClose={() => setOpenModal("")}
                filament={filament}
            />

            <AddFilament
                open={openModal === "edit"}
                onClose={() => setOpenModal("")}
                currentFilament={filament}
                onAdd={onEdit}
            />

            <Modal open={openModal === "move"} onClose={() => setOpenModal("")} title="Move Filament">
                <Subtext className="mb-2">Change which folder your filament is in.</Subtext>
                <Divider />
                <p className="w-full text-center">Are you sure you want to move this filament?</p>
                <div className="w-full flex justify-center items-center">
                    <FilamentEntry isPreview filament={filament} />
                </div>
                <p className="w-full text-center">This will set it's current mass to 0g.</p>
                <ModalFooter
                    tip={"If you no longer have this filament or you want it removed from your library, delete it instead."}
                    error={error}
                >
                    <Button look={ButtonStyles.secondary} onClick={() => setOpenModal("")}>Cancel</Button>
                    <Button onClick={onMoveConfirm} loading={loading}>Confirm</Button>
                </ModalFooter>
            </Modal>

            <Modal open={openModal === "delete"} onClose={() => setOpenModal("")} title="Delete Filament">
                <Subtext className="mb-2">Removes this filament from your library.</Subtext>
                <Divider />
                <p className="w-full text-center">Are you sure you want to delete this filament?</p>
                <div className="w-full flex justify-center items-center">
                    <FilamentEntry isPreview filament={filament} />
                </div>
                <p className="w-full text-center">This will also delete all of the logs made with this filament.</p>
                <ModalFooter
                    tip={`Don't delete the filament if you just used it all up. 
                        Instead, press the 'Move to Empty' button in the filament's menu.`}
                    error={error}
                >
                    <Button look={ButtonStyles.secondary} onClick={() => setOpenModal("")}>Cancel</Button>
                    <Button look={ButtonStyles.danger} onClick={onDeleteConfirm} loading={loading}>Confirm</Button>
                </ModalFooter>
            </Modal>
        </>}
    </>);
}
