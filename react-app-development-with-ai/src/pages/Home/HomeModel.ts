import type { Movie } from '../../types/omdb'
import { searchMovies } from '../../services/omdbMovieService'

const SEED_KEYWORDS = [
  'Batman',
  'Avengers',
  'Harry Potter',
  'Star Wars',
  'Spider-Man',
  'Marvel',
  'Disney',
  'Matrix',
  'Lord of the Rings',
  'Fast',
  'Mission Impossible',
  'Pixar',
  'Horror',
  'Comedy',
  'Action',
]

const INITIAL_MOVIES_COUNT = 20
const KEYWORDS_PER_ATTEMPT = 4
const MAX_ATTEMPTS = 6

function shuffle<T>(items: T[]): T[] {
  const result = [...items]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temporary = result[i]
    result[i] = result[j]
    result[j] = temporary
  }

  return result
}

function pickRandomKeywords(count: number, exclude: string[]): string[] {
  const available = SEED_KEYWORDS.filter((keyword) => !exclude.includes(keyword))
  return shuffle(available).slice(0, count)
}

export async function initialMovies(): Promise<Movie[]> {
  const movies: Movie[] = []
  const seenIds = new Set<string>()
  const usedKeywords: string[] = []

  for (
    let attempt = 0;
    attempt < MAX_ATTEMPTS && movies.length < INITIAL_MOVIES_COUNT;
    attempt++
  ) {
    const keywords = pickRandomKeywords(KEYWORDS_PER_ATTEMPT, usedKeywords)

    if (keywords.length === 0) {
      break
    }

    usedKeywords.push(...keywords)

    const batches = await Promise.all(
      keywords.map((keyword) => searchMovies(keyword)),
    )

    for (const batch of batches) {
      for (const movie of batch) {
        if (!seenIds.has(movie.imdbID)) {
          seenIds.add(movie.imdbID)
          movies.push(movie)
        }
      }
    }
  }

  return shuffle(movies).slice(0, INITIAL_MOVIES_COUNT)
}

export async function getMovies(query: string): Promise<Movie[]> {
  const cleanedQuery = query.trim()

  if (cleanedQuery.length < 2) {
    throw new Error('Search query must contain at least two characters')
  }

  return searchMovies(cleanedQuery)
}