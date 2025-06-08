import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger }
    from "@radix-ui/react-dropdown-menu";

export function Dropdown({ children }: React.PropsWithChildren) {
    return (
        <DropdownMenu>
            {children}
        </DropdownMenu>
    );
}

export function DropdownTrigger({ asChild, children }: { asChild?: boolean } & React.PropsWithChildren) {
    return (
        <DropdownMenuTrigger asChild={asChild}>
            {children}
        </DropdownMenuTrigger>
    );
}

export function DropdownContent({ children }: React.PropsWithChildren) {
    return (
        <DropdownMenuPortal>
            <DropdownMenuContent className="p-2 bg-bg-lighter rounded-lg text-sm flex flex-col min-w-[150px] fade-in">
                {children}
            </DropdownMenuContent>
        </DropdownMenuPortal>
    );
}

export function DropdownItem({ children, danger, onClick }: { danger?: boolean, onClick?: () => void } & React.PropsWithChildren) {
    return (
        <DropdownMenuItem
            className={`${danger && "text-danger"} px-2 py-1 rounded-lg 
                cursor-pointer outline-none transition-all hover:bg-bg-lightest`
            }
            onClick={onClick}
        >
            {children}
        </DropdownMenuItem>
    );
}
