import React, { useState, ReactElement, useEffect, isValidElement, ReactNode } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    arrayMove,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ReorderableListProps = {
  children: ReactNode;
  onChange?: (newOrder: ReactElement[]) => void;
};

function SortableItem(props: { id: string; child: ReactElement }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        flex: "0 0 auto",
        cursor: "grab",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {props.child}
        </div>
    );
}

export function ReorderableList({
    children,
    onChange,
}: ReorderableListProps) {
    const [items, setItems] = useState<string[]>([]);
    const [childMap, setChildMap] = useState<Record<string, ReactElement>>({});

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        const normalized = React.Children.toArray(children).filter(isValidElement);
        const mapped: Record<string, ReactElement> = {};
        const ids: string[] = [];

        normalized.forEach(child => {
            if (!child.key) {
                throw new Error("Each child must have a unique `key` prop.");
            }

            const id = child.key.toString();
            ids.push(id);
            mapped[id] = child;
        });

        setItems(ids);
        setChildMap(mapped);
    }, [children]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.indexOf(active.id.toString());
            const newIndex = items.indexOf(over.id.toString());

            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);

            if (onChange) {
                const newOrder = newItems.map(id => childMap[id]);
                onChange(newOrder);
            }
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={rectSortingStrategy}
            >
                <div className="flex flex-row flex-wrap gap-2">
                    {items.map(id => (
                        <SortableItem key={id} id={id} child={childMap[id]} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
