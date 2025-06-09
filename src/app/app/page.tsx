import FilamentList from "@/components/filament/FilamentList";

export default async function HomePage() {
    return <>
        <h1>Your Filament</h1>
        <div className="flex flex-row gap-2 flex-wrap">
            <FilamentList allowAdd />
        </div>
        <h1>Empty Filament</h1>
        <div className="flex flex-row gap-2">
            <FilamentList isEmpty />
        </div>
    </>;
}
