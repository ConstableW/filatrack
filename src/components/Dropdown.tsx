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
            <DropdownMenuContent
                className={`p-2 bg-bg-lighter rounded-lg text-sm flex flex-col min-w-[150px] 
                    fade-in z-50 drop-shadow-lg max-h-[400px] overflow-scroll`}
            >
                {children}
            </DropdownMenuContent>
        </DropdownMenuPortal>
    );
}

export function DropdownItem({ children, danger, onClick, ...props }: { danger?: boolean, onClick?: () => void }
& React.AllHTMLAttributes<HTMLDivElement>
& React.PropsWithChildren) {
    return (
        <DropdownMenuItem
            className={`${danger && "text-danger"} px-2 py-1 rounded-lg 
                cursor-pointer outline-none transition-all hover:bg-bg-lightest ${props.className}`
            }
            style={props.style}
            onClick={e => {
                e.stopPropagation();
                onClick?.();
            }}
        >
            {children}
        </DropdownMenuItem>
    );
}
