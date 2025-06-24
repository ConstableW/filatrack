import { Filament } from "@/db/types";
import Modal, { ModalProps } from "../Modal";
import FilamentEntry from "./Filament";
import Subtext from "../Subtext";
import Divider from "../Divider";
import FilamentHistoryList from "./FilamentHistory";
import Button from "../Button";

export default function FilamentDetailsModal({ filament, openLogModal, ...props }:
    { filament: Filament, openLogModal: () => void } & ModalProps) {
    return (
        <Modal {...props} title="Filament Details">
            <Subtext>View extra details and usage of this filament.</Subtext>
            <Divider />

            <div className="flex flex-col md:flex-row max-w-[500px]">
                <FilamentEntry
                    isPreview
                    filament={filament}
                />
                <Divider vertical className="hidden md:block" />
                <Divider className="block md:hidden" />
                <div className="max-h-[150px] md:max-h-[250px] overflow-y-scroll overflow-x-hidden">
                    <FilamentHistoryList filament={filament} />
                </div>
            </div>

            <Divider />

            <Button className="w-full" onClick={openLogModal}>Log</Button>
        </Modal>
    );
}
