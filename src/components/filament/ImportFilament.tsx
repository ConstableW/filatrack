import { useState } from "react";
import BigFileInput from "../BigFileInput";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import Button from "../Button";
import { Filament } from "@/db/types";
import { DBCreateParams } from "@/app/lib/db/types";
import Divider from "../Divider";

type ImportMethodSettings = {
    getFilamentList: (data: any) => any;
    getFilamentEntry: (entry: any) => DBCreateParams<Filament>;
    notes: string;
}

const importMethods: Record<string, ImportMethodSettings> = {
    "3dfilamentprofiles": {
        getFilamentList: (data: any) => data.Filaments,
        getFilamentEntry: (entry: any) => ({
            name: entry.Name,
            color: entry.Color,
            brand: entry.Brand,
            material: entry.Type,
            note: "",
            lastUsed: new Date(0),
            currentMass: 1000,
            startingMass: 1000,
            shortId: crypto.randomUUID().slice(0, 8),
        }),
        notes: "You will have to manually set filament mass as 3dFilamentProfiles does not export it.",
    },
};

export default function ImportFilamentModal({ method, ...props }: { method: string } & ModalProps) {
    const [file, setFile] = useState<File>();

    return (
        <Modal {...props} title="Import Filament">
            <Subtext>Import your filament from other platforms.</Subtext>

            <Divider />

            <BigFileInput onChange={e => setFile(e.target.files?.[0])} accept="application/json" />

            <Divider />

            {importMethods[method].notes && <Subtext>
                {importMethods[method].notes}
            </Subtext>}

            <ModalFooter>
                <Button>Import</Button>
            </ModalFooter>
        </Modal>
    );
}
