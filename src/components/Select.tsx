import React from "react";

export default function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select {...props} className={`px-2 py-1 rounded-lg bg-bg-lighter ${props.className ?? ""}`}>
            {props.children}
        </select>
    );
}
