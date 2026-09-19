import MovieCard from '../../components/MovieCard/MovieCard'
import { useAuth } from '../../context/AuthContext'
import useFavouritesViewModel from './useFavouritesViewModel'

function FavouritesView() {
  const { user } = useAuth()
  const { favourites, loading, error, removeMovie } = useFavouritesViewModel(
    user ? user.uid : '',
  )

  if (!user) {
    return null
  }

  return (
    <main>
      {loading && <p>Loading...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && favourites.length === 0 && (
        <p>You have no favourite movies yet.</p>
      )}

      {!loading && !error && favourites.length > 0 && (
        <ul className="movie-grid">
          {favourites.map((movie) => (
            <li key={movie.imdbID}>
              <MovieCard
                movie={movie}
                onFavouriteClick={(selectedMovie) =>
                  removeMovie(selectedMovie.imdbID)
                }
                favouriteLabel="Remove"
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default FavouritesView