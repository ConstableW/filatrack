import { Box, Filament } from "@/db/types";
import { Pencil, Plus, X } from "lucide-react";
import Button, { ButtonStyles } from "../Button";
import Divider from "../Divider";
import Spinner from "../Spinner";
import Subtext from "../Subtext";
import BoxEntry from "./Box";
import CreateBoxModal from "./CreateBox";
import { useState } from "react";
import { ReorderableList } from "../RerorderList";
import { reorderBoxes } from "@/lib/db/boxes";

export default function BoxList({ allBoxes, allFilament, onReorder, onDelete, onEdit, onAdd }:
    { allBoxes?: Box[], allFilament?: Filament[], onReorder: (newBoxes: Box[]) => void,
        onDelete: (boxId: string) => void, onEdit: (newBox: Box, i: number) => void, onAdd: (box: Box) => void }) {
    const [openModal, setOpenModal] = useState("");
    const [editMode, setEditMode] = useState(false);

    function onReorderBoxes(newElements: React.ReactElement[]) {
        if (!allBoxes)
            return;

        const newBoxIds = newElements.map(e => e.key!.slice(2));

        const newBoxes = newBoxIds.map(id => allBoxes.find(b => b.id === id)!).map((f, i) => ({ ...f, index: i }));

        reorderBoxes(newBoxes);
        onReorder(newBoxes);
    }

    const boxElements = allBoxes?.map((box, i) => allFilament &&
    <BoxEntry
        box={box}
        allFilament={allFilament}
        key={box.id}
        onEdit={newBox => onEdit(newBox, i)}
        onDelete={() => onDelete(box.id)}
        editMode={editMode}
    />);

    return (<>
        <div className="flex justify-between items-center mt-2">
            <h2>Filament Boxes</h2>

            <div className="flex gap-2">
                <Button
                    onClick={() => setEditMode(!editMode)}
                    look={editMode ? ButtonStyles.primary : ButtonStyles.secondary}
                >
                    {editMode ? <X size={32} /> : <Pencil size={24} />}
                </Button>

                {!editMode && <Button
                    onClick={() => setOpenModal("add")}
                >
                    <Plus size={32} />
                </Button>}
            </div>
        </div>

        <Divider />

        <div className="flex flex-col md:flex-row gap-2 flex-wrap">
            {!allBoxes && <Spinner />}
            {allBoxes && !allBoxes.length && <Subtext>Nothing to see here.</Subtext>}
            {(allBoxes && allFilament) && editMode ?
                <ReorderableList onChange={onReorderBoxes}>
                    {boxElements}
                </ReorderableList> :
                boxElements
            }
        </div>

        {editMode && <Subtext>Click & drag boxes to reorder</Subtext>}

        {allBoxes && <CreateBoxModal
            open={openModal === "add"}
            onClose={() => setOpenModal("")}
            onAdd={onAdd}
        />}
    </>);
}
