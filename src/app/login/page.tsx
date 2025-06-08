"use client";

import Button from "@/components/Button";
import { signIn } from "next-auth/react";
import React from "react";
import { FaGithub } from "react-icons/fa";

function LogInButton({ provider, children }: { provider: string } & React.PropsWithChildren) {
    return (
        <Button
            className="flex flex-row gap-1 items-center"
            onClick={() => signIn(provider, {
                redirectTo: "/home",
            })}
        >
            {children}
        </Button>
    );
}

export default function LoginPage() {
    return (<main className="absolute-center bg-bg-light p-3 flex flex-col gap-2 rounded-lg">
        <h2>Log In</h2>
        <LogInButton provider="github"><FaGithub size={32} /> Sign in with GitHub</LogInButton>
    </main>);
}
