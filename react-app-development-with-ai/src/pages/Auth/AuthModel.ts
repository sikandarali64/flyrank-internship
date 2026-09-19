import type { User } from 'firebase/auth'
import { loginUser, logoutUser, registerUser } from '../../services/authService'

function validateCredentials(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function register(email: string, password: string): Promise<User> {
  const normalizedEmail = normalizeEmail(email)
  validateCredentials(normalizedEmail, password)
  return registerUser(normalizedEmail, password)
}

export async function login(email: string, password: string): Promise<User> {
  const normalizedEmail = normalizeEmail(email)
  validateCredentials(normalizedEmail, password)
  return loginUser(normalizedEmail, password)
}

export async function logout(): Promise<void> {
  return logoutUser()
}