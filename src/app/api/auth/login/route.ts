import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        //1. ambil username dn password yang dikirim dari form login
        const body = await req.json();
        const { username, password } = body;

        //2. validasi, jangan sampai req kosong diterusin ke api
        if(!username || !password) {
            return NextResponse.json(
                { message: "Username and password are required"},
                { status: 400 }
            );
        }

        //3. teruskan ke api
        const response = await fetch("https://dummyjson.com/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({username, password, expiresInMins: 60*24}),
        });

        //4. kalau api returnn error (user/pass salah)
        if(!response.ok) {
            return NextResponse.json(
                { message: "Invalid username or password"},
                { status: 401 }
            );
        }

        //5. ambil token dari response fake store api
        const data = await response.json();

        //6. kembalikan token ke client
        return NextResponse.json({
            token: data.accessToken,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            image: data.image
        }, {status: 200});
    } catch (error) {
        return NextResponse.json(
            {message: "internal server error"},
            {status: 500}
        );
    }
}