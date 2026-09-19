import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { auth } from './firebaseService'

function toReadableError(error: unknown): string {
  if (error instanceof Error && 'code' in error) {
    const code = (error as { code?: string }).code

    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists'
      case 'auth/invalid-email':
        return 'The email address is not valid'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters'
      case 'auth/user-not-found':
        return 'No account found with this email'
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Incorrect email or password'
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later'
      default:
        return error.message
    }
  }

  return 'Something went wrong'
}

export async function registerUser(
  email: string,
  password: string,
): Promise<User> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    return credential.user
  } catch (e) {
    throw new Error(toReadableError(e))
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return credential.user
  } catch (e) {
    throw new Error(toReadableError(e))
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth)
  } catch (e) {
    throw new Error(toReadableError(e))
  }
}

export function subscribeToAuthChanges(
  callback: (user: User | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback)
}