import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Simple demo authentication - in production, use proper password hashing
const DEMO_USERS = [
  { email: "admin@jefferson.edu", password: "admin123", name: "Admin User" },
  { email: "jun.li@jefferson.edu", password: "physics123", name: "Jun Li" },
  { email: "d.thomas@jefferson.edu", password: "medical123", name: "D. Thomas" },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user with matching credentials
    const user = DEMO_USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set authentication cookie
    const cookieStore = cookies()
    cookieStore.set(
      "auth-token",
      JSON.stringify({
        email: user.email,
        name: user.name,
        loginTime: Date.now(),
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
      },
    )

    return NextResponse.json({ success: true, user: { email: user.email, name: user.name } })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
