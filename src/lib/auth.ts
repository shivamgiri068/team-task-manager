import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_ethara_task_manager_key_123!'
const secretKey = new TextEncoder().encode(JWT_SECRET)

export type AuthUser = {
  id: string
  email: string
  name: string
  role: string
}

export async function signToken(payload: AuthUser) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secretKey)
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload as AuthUser
  } catch (error) {
    return null
  }
}

export async function getSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) return null
  return verifyToken(token)
}
