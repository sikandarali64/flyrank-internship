import type { Movie, OmdbSearchResponse } from '../types/omdb'

const API_URL = 'https://www.omdbapi.com/'

export async function searchMovies(query: string): Promise<Movie[]> {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY
  const url = `${API_URL}?apikey=${apiKey}&s=${encodeURIComponent(query)}`
  console.log('[OMDb] Request URL:', url)

  const response = await fetch(url)
  console.log('[OMDb] Response status:', response.status)

  if (!response.ok) {
    console.error('[OMDb] HTTP error:', response.status, response.statusText)
    throw new Error(
      `Failed to fetch movies from OMDb (${response.status} ${response.statusText})`,
    )
  }

  const data = (await response.json()) as OmdbSearchResponse & { Error?: string }
  console.log('[OMDb] Response body:', data)

  if (data.Response === 'False') {
    console.error('[OMDb] API error:', data.Error)
    throw new Error(data.Error ?? 'OMDb returned no movies for this query')
  }

  console.log(
    '[OMDb] Movies found:',
    data.Search.length,
    data.Search.map((movie) => movie.Title),
  )

  return data.Search
}