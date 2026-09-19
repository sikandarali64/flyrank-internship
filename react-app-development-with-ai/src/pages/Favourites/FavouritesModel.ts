import {
  addFavourite,
  getFavourites,
  removeFavourite,
} from '../../services/firebaseService'
import type { Movie } from '../../types/omdb'

export async function loadFavourites(userId: string): Promise<Movie[]> {
  return getFavourites(userId)
}

export async function addFavouriteMovie(
  userId: string,
  movie: Movie,
): Promise<void> {
  return addFavourite(userId, movie)
}

export async function deleteMovie(
  userId: string,
  imdbID: string,
): Promise<void> {
  return removeFavourite(userId, imdbID)
}