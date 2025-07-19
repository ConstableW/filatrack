import { NextResponse } from "next/server";

// Catch-all to reduce response size for bots trying to find vulnerabilities

export async function GET() {
    return new NextResponse("haha you thought");
}
