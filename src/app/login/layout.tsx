import { auth } from "@/auth";
import Spinner from "@/components/Spinner";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function LoginLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await auth();

    if (session)
        return redirect("/app");

    return (
        <Suspense fallback={<Spinner />}>
            {children}
        </Suspense>
    );
}
