import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionProvider } from "next-auth/react";

const lexend = Lexend({
    variable: "--font-lexend",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Filatrack - Simple Filament Tracking",
    description: "Super-simple tracking of all your 3d printing filaments",
    icons: [
        {
            url: "/favicon-96x96.png",
            sizes: "96x96",
            type: "image/png",
        },
        {
            url: "/favicon.svg",
            type: "image/svg+xml",
        },
        {
            url: "/favicon.ico",
            rel: "shortcut icon",
        },
        {
            url: "/apple-touch-icon.png",
            rel: "apple-touch-icon",
            sizes: "180x180",
        },
    ],
    applicationName: "Filatrack",
    appleWebApp: {
        capable: true,
        title: "Filatrack",
        startupImage: "/filament.png",
    },
    manifest: "/site.webmanifest",
    keywords: ["filament", "3d printing", "tracker", "spool", "pla"],
    openGraph: {
        title: "Filatrack",
        description: "A super-simple way to keep inventory of your filament rolls.",
        url: "https://filatrack.vercel.app/",
        siteName: "Filatrack",
        images: [
            {
                url: "https://filatrack.vercel.app/apple-touch-icon.png",
            },
        ],
    },
    twitter: {
        card: "summary",
        site: "@drew_rat",
        creator: "@drew_rat",
        images: "https://filatrack.vercel.app/apple-touch-icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${lexend.variable} antialiased bg-bg`}
            >
                <SessionProvider>
                    {children}
                </SessionProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
