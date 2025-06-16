export default function Divider({ vertical }: { vertical?: boolean }) {
    return (<div className={`${vertical ? "h-full w-[2px] mx-2" : "w-full h-[2px] my-2"} bg-bg-lighter`}></div>);
}
