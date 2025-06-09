export default function TabButton({
    children, active, onClick,
}: Readonly<{ children: React.ReactNode, active?: boolean, onClick: () => void }>) {
    return (
        <button className={`cursor-pointer px-2 py-1 rounded-lg hover:bg-bg-lighter 
        ${active ? "!bg-primary" : ""} transition-all`}
        onClick={onClick}
        >
            {children}
        </button>
    );
}
