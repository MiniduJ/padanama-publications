import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || "admin@padanamapublication.lk";
    const expectedPassword = process.env.ADMIN_PASSWORD || "Padanama@Admin2026#Secure";
    const sessionToken = process.env.ADMIN_SESSION_TOKEN || "padanama-super-admin-secure-token-2026";

    if (email === expectedEmail && password === expectedPassword) {
      const response = NextResponse.json({ success: true, redirect: "/admin" });

      response.cookies.set("padanama_admin_token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { error: "වැරදි ඊමේල් ලිපිනයක් හෝ මුරපදයක් (Invalid admin credentials)" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("padanama_admin_token");
  return response;
}
