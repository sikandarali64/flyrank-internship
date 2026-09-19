import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore'
import type { Movie } from '../types/omdb'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const db = getFirestore(app)

const USERS_COLLECTION = 'users'
const FAVOURITES_COLLECTION = 'favourites'

function isMovie(value: unknown): value is Movie {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.Title === 'string' &&
    typeof candidate.Year === 'string' &&
    typeof candidate.imdbID === 'string' &&
    typeof candidate.Type === 'string' &&
    typeof candidate.Poster === 'string'
  )
}

export async function addFavourite(userId: string, movie: Movie): Promise<void> {
  if (!userId) {
    throw new Error('User id is required to add a favourite')
  }

  try {
    await setDoc(
      doc(db, USERS_COLLECTION, userId, FAVOURITES_COLLECTION, movie.imdbID),
      movie,
    )
  } catch (e) {
    throw new Error(
      e instanceof Error
        ? `Failed to add favourite: ${e.message}`
        : 'Failed to add favourite',
    )
  }
}

export async function removeFavourite(
  userId: string,
  imdbID: string,
): Promise<void> {
  if (!userId) {
    throw new Error('User id is required to remove a favourite')
  }

  try {
    await deleteDoc(
      doc(db, USERS_COLLECTION, userId, FAVOURITES_COLLECTION, imdbID),
    )
  } catch (e) {
    throw new Error(
      e instanceof Error
        ? `Failed to remove favourite: ${e.message}`
        : 'Failed to remove favourite',
    )
  }
}

export async function getFavourites(userId: string): Promise<Movie[]> {
  if (!userId) {
    throw new Error('User id is required to load favourites')
  }

  try {
    const snapshot = await getDocs(
      collection(db, USERS_COLLECTION, userId, FAVOURITES_COLLECTION),
    )

    const movies: Movie[] = []

    snapshot.forEach((document) => {
      const movie = document.data()
      if (isMovie(movie)) {
        movies.push(movie)
      }
    })

    return movies
  } catch (e) {
    throw new Error(
      e instanceof Error
        ? `Failed to load favourites: ${e.message}`
        : 'Failed to load favourites',
    )
  }
}

export { auth, db }