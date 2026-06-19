import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();

        //delete the 'session cookie by setting its maxage to 0
        cookieStore.set("session", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return NextResponse.json({success: true, message: "logged out successfully"});
    } catch (error) {
        console.error("Logout API error:", error);
        return NextResponse.json(
            { error: "Failed to log out cleanly" },
            { status: 500 }
        );
    }
        
}