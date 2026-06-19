import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthUser, SessionData } from "@/lib/auth";
import { Session } from "node:inspector";
import path from "node:path";

export async function POST(request: Request) {
    try {
        const { username, password} = await request.json();

        if(!username || !password) {
            return NextResponse.json(
                {error: 'username and password are required'},
                {status: 400}
            );
        }
        //forward (proxy) the login request to the external DummyJSON auth service
        const response = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                username,
                password,
                expiresInMins: 30,
            }),
        });

        if(!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.message || "Invalid credentials" },
                { status: response.status }
            );
        } 

        const data = await response.json();

        //map roles based on username
        let role: "admin" | "user" = "user";
        if(data.username === "emilys") {
            role = "admin";
        } else if (data.username === "michaelw") {
            role = "user";
        }

        const authUser: AuthUser = {
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            image: data.image,
            role,
        };

        const sessionData: SessionData = {
            user: authUser,
            token: data.accessToken,
        };

        //Map roles based on username, create a secure HttpOnly session cookie, and return user profile
        const cookieStore = await cookies();
        cookieStore.set("session", JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 30, //30 min
        });

        return NextResponse.json(authUser);
    } catch (error: any) {
        console.error('login proxy error:', error);
        return NextResponse.json(
            {error: 'an unexpected authentication error occured'},
            {status: 500}
        );
    }
}