import { useEffect, useState } from 'react'
import type { Movie } from '../../types/omdb'
import { deleteMovie, loadFavourites } from './FavouritesModel'

function useFavouritesViewModel(userId: string) {
  const [favourites, setFavourites] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadMovies() {
    setLoading(true)
    setError(null)

    try {
      const results = await loadFavourites(userId)
      setFavourites(results)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function removeMovie(imdbID: string) {
    try {
      await deleteMovie(userId, imdbID)
      setFavourites((current) =>
        current.filter((movie) => movie.imdbID !== imdbID),
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  useEffect(() => {
    if (userId) {
      loadMovies()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return { favourites, loading, error, loadMovies, removeMovie }
}

export default useFavouritesViewModel