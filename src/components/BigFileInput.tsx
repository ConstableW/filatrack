import { Upload } from "lucide-react";
import { ChangeEvent, InputHTMLAttributes, useRef, useState } from "react";
import Subtext from "./Subtext";

export default function BigFileInput(props: InputHTMLAttributes<HTMLInputElement>) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState("");

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        setFileName(e.target.files?.[0].name ?? "");
        props.onChange?.(e);
    }

    function onClick() {
        if (!inputRef.current)
            return;

        inputRef.current.click();
    }

    return (<>
        <input type="file" onChange={onChange} value={props.value} hidden ref={inputRef} />
        <div
            className={`w-full flex flex-col gap-1 items-center justify-center cursor-pointer
            bg-bg py-2 rounded-lg border-2 border-transparent text-gray-500 focus:border-primary`}
            onClick={onClick}
        >
            <Upload size={48} />
            {fileName && <p className="text-white text-sm">{fileName}</p>}
            <div className="text-center">
                <Subtext>Browse files to upload</Subtext>
                <Subtext>or drag file here</Subtext>
            </div>
        </div>
    </>);
}
