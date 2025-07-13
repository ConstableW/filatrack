import { createElement } from "react";

export default function Input({ multiline, label, error, ...props }:
    React.InputHTMLAttributes<HTMLInputElement> & { multiline?: boolean | "true"; label?: string; error?: string | false }) {
    const Component = multiline ? "textarea" : "input";

    return (<div className={`flex ${props.type === "checkbox" ? "flex-row gap-2" : "flex-col"}`}>
        {(label && props.type !== "checkbox") &&
            <label className="text-white">{label}</label>
        }
        {createElement(Component, {
            ...props,
            className: `px-2 py-1 rounded-lg ${props.className ?? ""} bg-bg-lighter border-2 border-transparent
            text-white items-center outline-none focus:outline-none drop-shadow-lg
            focus:border-primary disabled:text-gray-400 text-sm transition-all ${error && "!border-danger"}`,
        })}
        {(label && props.type === "checkbox") &&
            <label className="text-white">{label}</label>
        }
        {(!!error) && <p className="text-danger text-xs">{error}</p>}
    </div>);
}
