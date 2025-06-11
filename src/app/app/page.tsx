import FilamentList from "@/components/filament/FilamentList";

export default async function HomePage() {
    return <>
        <h1>Your Filament</h1>
        <FilamentList allowAdd />
        <h1>Empty Filament</h1>
        <FilamentList isEmpty />
    </>;
}
