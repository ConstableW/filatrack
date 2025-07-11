import React from "react";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "./Dropdown";
import { Check, ChevronDown } from "lucide-react";
import Subtext from "./Subtext";

export function Select({ options, value, onChange, placeholder, ...props }:
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

export function SelectMultiple({ options, values, onChange, placeholder, ...props }:
    { options: Record<string, React.ReactNode>, values: string[], onChange: (newVals: string[]) => void, placeholder?: string } &
Omit<React.SelectHTMLAttributes<HTMLButtonElement>, "value" | "onChange" | "children">) {
    return (
        <Dropdown>
            <DropdownTrigger asChild>
                <button {...props} className={`px-2 py-1 pr-2 rounded-lg bg-bg-lighter border-2 outline-none drop-shadow-lg
                flex flex-row justify-between gap-4 items-center border-transparent focus:border-primary transition-all 
                cursor-pointer text-sm ${props.className ?? ""}`}>
                    {!values.length && <Subtext>{placeholder}</Subtext>}
                    <ChevronDown />
                </button>
            </DropdownTrigger>
            <DropdownContent>
                {Object.keys(options)
                    .map(k => <DropdownItem
                        onClick={() => {
                            if (values.includes(k))
                                onChange([...values.slice(0, values.indexOf(k)), ...values.slice(values.indexOf(k) + 1)]);
                            else
                                onChange([...values, k]);
                        }}
                        className={`${values.includes(k) && "!border-primary"} border-2 border-transparent`}
                        key={k}
                    >
                        {values.includes(k) && <Check className="text-gray-500" />}
                        {options[k]}
                    </DropdownItem>)
                }
            </DropdownContent>
        </Dropdown>
    );
}
