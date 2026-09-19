import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from 'firebase/auth'
import type { Movie } from '../../types/omdb'
import { getMovies, initialMovies } from './HomeModel'
import { addFavouriteMovie } from '../Favourites/FavouritesModel'

function useHomeViewModel(query: string, user: User | null) {
  const navigate = useNavigate()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadInitialMovies() {
    setLoading(true)
    setError(null)

    try {
      const results = await initialMovies()
      setMovies(results)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch() {
    setLoading(true)
    setError(null)

    try {
      const results = await getMovies(query)
      setMovies(results)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleFavouriteClick(movie: Movie) {
    if (!user) {
      navigate('/favourites')
      return
    }

    try {
      await addFavouriteMovie(user.uid, movie)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  return {
    movies,
    loading,
    error,
    handleSearch,
    loadInitialMovies,
    handleFavouriteClick,
  }
}

export default useHomeViewModel