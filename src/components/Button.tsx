import React from "react";
import Spinner from "./Spinner";

export enum ButtonStyles {
    primary = "bg-primary hover:bg-secondary disabled:bg-primary-disabled text-white",
    secondary = "bg-bg-lighter hover:bg-bg-lightest disabled:bg-bg text-white",
    danger = "bg-danger hover:bg-danger disabled:bg-danger-secondary text-white",
}

export default function Button({ look, loading, ...props }:
    React.ButtonHTMLAttributes<HTMLButtonElement> & { look?: ButtonStyles, loading?: boolean }) {
    return (
        <button
            {...props}
            className={`px-2 py-1 rounded-lg ${props.className ?? ""} ${look ?? ButtonStyles.primary} 
            transition-all flex justify-center items-center text-sm cursor-pointer
            hover:scale-105 active:scale-95`}
            disabled={loading || props.disabled}
        >
            {loading && <Spinner />} {props.children}
        </button>
    );
}
