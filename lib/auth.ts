import { sql } from "./database"
import { cookies } from "next/headers"
import crypto from "crypto"

export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export async function checkAuth() {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get("auth-token")

    if (!authToken) {
      return null
    }

    const user = JSON.parse(authToken.value)

    // Check if token is expired (24 hours)
    if (Date.now() - user.loginTime > 24 * 60 * 60 * 1000) {
      return null
    }

    return user
  } catch (error) {
    return null
  }
}

export async function getUser(email: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM neon_auth.users_sync WHERE email = ${email}
  `
  return result[0] || null
}

export async function createUser(email: string, name: string): Promise<User> {
  const id = crypto.randomUUID()
  const result = await sql`
    INSERT INTO neon_auth.users_sync (id, email, name, created_at, updated_at)
    VALUES (${id}, ${email}, ${name}, NOW(), NOW())
    RETURNING *
  `
  return result[0]
}

export async function getAllUsers(): Promise<User[]> {
  const result = await sql`
    SELECT * FROM neon_auth.users_sync 
    WHERE deleted_at IS NULL
    ORDER BY name
  `
  return result
}
