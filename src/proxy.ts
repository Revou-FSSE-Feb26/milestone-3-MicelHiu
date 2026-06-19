import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SessionData } from "@/lib/auth";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if(pathname.startsWith("/dashboard/admin")) {
        const sessionCookie = request.cookies.get('session')?.value;
        if(!sessionCookie) {
            const loginUrl = new URL ("/login", request.url);
            return NextResponse.redirect(loginUrl);
        }

        try {
            const sessionData: SessionData = JSON.parse(sessionCookie);
            const user = sessionData.user;

            if(user.role !== "admin") {
                const unAuthorizedUrl = new URL("/dashboard", request.url);
                return NextResponse.redirect(unAuthorizedUrl);
            }

            return NextResponse.next();
        }catch (error) {
            console.error("Proxy Auth Verification Error:", error);
            // In case of cookie corruption or parsing issues, flush the bad cookie
            // and redirect the user back to the sign-in screen to prevent loading loops.
            const loginRedirect = NextResponse.redirect(new URL("/login", request.url));
            loginRedirect.cookies.delete("session");
            return loginRedirect;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/admin/:path*"],
};