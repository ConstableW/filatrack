import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminPageLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await auth();

    if (!session || !session.user)
        return redirect("/login");

    if (session.user.id! !== process.env.ADMIN_USER_ID!)
        return redirect("/app");

    return children;
}
