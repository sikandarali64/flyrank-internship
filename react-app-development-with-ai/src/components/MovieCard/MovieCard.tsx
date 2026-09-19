import type { Movie } from '../../types/omdb'

interface MovieCardProps {
  movie: Movie
  onFavouriteClick?: (movie: Movie) => void
  favouriteLabel?: string
}

function MovieCard({
  movie,
  onFavouriteClick,
  favouriteLabel = 'Favourite',
}: MovieCardProps) {
  return (
    <article className="movie-card">
      {movie.Poster !== 'N/A' && <img src={movie.Poster} alt={movie.Title} />}
      <h2>{movie.Title}</h2>
      <p>Year: {movie.Year}</p>
      <p>Type: {movie.Type}</p>
      <button type="button" onClick={() => onFavouriteClick?.(movie)}>
        {favouriteLabel}
      </button>
    </article>
  )
}

export default MovieCard