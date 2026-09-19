import { useEffect, type FormEvent } from 'react'
import MovieCard from '../../components/MovieCard/MovieCard'
import { useAuth } from '../../context/AuthContext'
import useHomeViewModel from './useHomeViewModel'

interface HomeViewProps {
  query: string
  searchSignal: number
  homeSignal: number
}

function HomeView({ query, searchSignal, homeSignal }: HomeViewProps) {
  const { user } = useAuth()
  const {
    movies,
    loading,
    error,
    handleSearch,
    loadInitialMovies,
    handleFavouriteClick,
  } = useHomeViewModel(query, user)

  useEffect(() => {
    if (searchSignal > 0) {
      handleSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchSignal])

  useEffect(() => {
    loadInitialMovies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSignal])

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    handleSearch()
  }

  return (
    <main>
      <form onSubmit={onSubmit}>
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && movies.length > 0 && (
        <ul className="movie-grid">
          {movies.map((movie) => (
            <li key={movie.imdbID}>
              <MovieCard
                movie={movie}
                onFavouriteClick={handleFavouriteClick}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default HomeView