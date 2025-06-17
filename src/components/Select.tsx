import React from "react";

export default function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select {...props} className={`px-2 py-1 pr-2 rounded-lg bg-bg-lighter border-2 
        border-transparent focus:border-primary transition-all cursor-pointer ${props.className ?? ""}`}>
            {props.children}
        </select>
    );
}
