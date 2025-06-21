export default function Divider({ vertical, className }: { vertical?: boolean, className?: string }) {
    return (<div
        className={`${vertical ? "h-full min-w-[2px] mx-2" : "w-full h-[2px] my-2"} 
        bg-bg-lighter 
        ${className ?? ""}`}
    />);
}
