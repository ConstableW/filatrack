import React from "react";

export default function SidebarItem({ children, href }: { children: React.ReactNode, href: string }) {
    return (
        <a href={href} className="flex flex-row gap-2 w-full h-8 px-2 py-1 rounded-lg items-center hover:bg-bg-lighter transition-all">
            {children}
        </a>
    );
}
