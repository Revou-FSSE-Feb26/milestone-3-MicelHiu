import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SessionData } from "@/lib/auth";

export async function GET() {
    try {
        //retrieve, parse, and return the session cookie payload
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');

        if(!sessionCookie || !sessionCookie.value) {
            return NextResponse.json(
                {error: 'not authenticated'},
                {status: 401}
            );
        }

        const sessionData: SessionData = JSON.parse(sessionCookie.value);

        //return only the user info (hiding the JWT token from browser scripts)
        return NextResponse.json(sessionData.user);
    } catch (error) {
        console.error("fetch session error:", error);
        return NextResponse.json(
            { error: "Failed to fetch session" },
            { status: 500 }
        );
    }
}