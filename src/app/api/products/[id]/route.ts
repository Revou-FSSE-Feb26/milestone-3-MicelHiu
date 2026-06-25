import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const MOCK_API = "https://6a3590b3708f62230b192890.mockapi.io/products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numberId = Number(id);

  const res = await fetch(`${MOCK_API}/products/${numberId}`);
  if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  const data = await res.json();
  return NextResponse.json(data);
}

//edit product
export async function PUT(request: Request, { params }:{params: Promise<{id:string}>}) {
    const {id} = await params;
    const numericId = Number(id);
    const cookieStore = await cookies();
    //tolak req, kalau tidak ada session cookie, proteksi server-side
    if (!cookieStore.get('session')) return NextResponse.json(
        {error: "no session detected"},
        {status: 401}
    );

    const body = await request.json();
    const res = await fetch(`${MOCK_API}/products/${numericId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
    });
    return NextResponse.json(await res.json());
}

//delete
export async function DELETE(req_: Request, { params }: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const numericId = Number(id);
    const cookieStore = await cookies();
    if(!cookieStore.get('session')) return NextResponse.json(
        {error: 'no session detected'},
        {status: 401},
    );

    await fetch(`${MOCK_API}/products/${numericId}`, {method: "DELETE"});
    return NextResponse.json({success: true});
}