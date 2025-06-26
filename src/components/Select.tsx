import React from "react";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "./Dropdown";
import { ChevronDown } from "lucide-react";
import Subtext from "./Subtext";

export default function Select({ options, value, onChange, placeholder, ...props }:
    { options: Record<string, React.ReactNode>, value: string, onChange: (val: string) => void, placeholder?: string } &
Omit<React.SelectHTMLAttributes<HTMLButtonElement>, "value" | "onChange" | "children">) {
    return (
        <Dropdown>
            <DropdownTrigger asChild>
                <button {...props} className={`px-2 py-1 pr-2 rounded-lg bg-bg-lighter border-2 outline-none drop-shadow-lg
                flex flex-row justify-between gap-4 items-center border-transparent focus:border-primary transition-all 
                cursor-pointer text-sm ${props.className ?? ""}`}>
                    {options[value] ?? <Subtext>{placeholder}</Subtext>}
                    <ChevronDown />
                </button>
            </DropdownTrigger>
            <DropdownContent>
                {Object.keys(options)
                    .map(k => <DropdownItem
                        onClick={() => onChange(k)}
                        className={`${value === k && "!border-primary"} border-2 border-transparent`}
                        key={k}
                    >
                        {options[k]}
                    </DropdownItem>)
                }
            </DropdownContent>
        </Dropdown>
    );
}
