import { NextResponse } from "next/server";

//URL hanya ada di server, tidak terekspos di browser.
const MOCK_API = "https://6a3590b3708f62230b192890.mockapi.io/products";

//admin fetch daftar product
export async function GET() {
    const res = await fetch(`${MOCK_API}/products`);
    const data = await res.json();
    return NextResponse.json(data);
}

//admin submit form "add product"
export async function POST(request: Request) {
    const body = await request.json();
    //validasi input
    if(!body.name || !body.price || !body.description || !body.category) {
        return NextResponse.json(
            {error: "Data incomplete"},
            {status: 400}
        );
    }

    const res = await fetch(`${MOCK_API}/products`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: 201});
}