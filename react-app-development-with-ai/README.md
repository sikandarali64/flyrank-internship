# React App

A movie search application built with Vite, React, and TypeScript. Features OMDb movie search, random movie discovery, Firebase Authentication, and per-user favourites stored in Cloud Firestore.

## Stack

- Vite + React + TypeScript (functional components only, no UI library)
- React Router (navigation)
- OMDb API (movie search)
- Firebase Authentication (Sign in / Sign up)
- Firebase Cloud Firestore (per-user favourites)

## Setup

1. Install dependencies: `npm install`
2. Create a `.env` file from the `.env.example` template and fill in your keys:
   - `VITE_OMDB_API_KEY` – OMDb API key from https://www.omdbapi.com/apikey.aspx
   - `VITE_FIREBASE_*` – Firebase web-app config values from the Firebase console
3. Run the dev server: `npm run dev`

## Scripts

- `npm run dev` – start the dev server
- `npm run build` – typecheck and build
- `npm run lint` – lint with oxlint
- `npm run preview` – preview the production build

## Project structure

```
src/
├── components/
│   ├── Header/           # Nav links, search, logout button
│   └── MovieCard/        # Presentational movie card
├── context/
│   └── AuthContext.tsx   # Firebase auth state provider
├── pages/
│   ├── Auth/             # AuthModel, useAuthViewModel, AuthView
│   ├── Favourites/       # FavouritesModel, useFavouritesViewModel, FavouritesView
│   └── Home/             # HomeModel, useHomeViewModel, HomeView
├── services/
│   ├── authService.ts    # Firebase auth wrapper
│   ├── firebaseService.ts# Firebase init + favourites CRUD
│   └── omdbMovieService.ts # OMDb API search
└── types/
    └── omdb.ts           # Movie + OMDb response types
```

Favourites are stored under `users/{userId}/favourites/{imdbID}` in Cloud Firestore.

## Prompt history

The application was built through the following prompt sequence:

1. **Init**: Initialize a new React application using Vite, React, and TypeScript. Use functional components only. Do not install any UI library. Do not add any movie functionality yet.

2. **Cleanup**: Remove all default Vite content, images, styles, and demonstration code. Leave a minimal working React application with an empty App component. Do not create any additional components or functionality.

3. **Header**: Create a reusable Header component containing a Home link, a Favourites link, a search input, and a Search button. Use React Router links for navigation. Only create and display the Header. Do not create the Home or Favourites screens yet. Do not connect the search input to any functionality.

4. **Header styling**: Add styling to the header.

5. **Header colours**: Change the background colour and give it better colour.

6. **Home MVVM placeholders**: Create the empty MVVM file structure for the Home screen (HomeModel.ts, useHomeViewModel.ts, HomeView.tsx) with minimal placeholder exports so the application compiles. No API requests, React state, or movie UI.

7. **Favourites MVVM placeholders**: Create the empty MVVM file structure for the Favourites screen (FavouritesModel.ts, useFavouritesViewModel.ts, FavouritesView.tsx) with minimal placeholder exports. No Firebase, state, movie cards, or other functionality.

8. **OMDb service stub**: Create a services folder and an empty OMDb movie service file (src/services/omdbMovieService.ts) with a short comment explaining it will contain communication with the OMDb API. Do not implement the API request yet.

9. **OMDb search**: Implement the OMDb movie search request inside src/services/omdbMovieService.ts: `searchMovies(query): Promise<Movie[]>`. Use the OMDb API, read the API key from VITE_OMDB_API_KEY, encode the search query, use the Movie and OmdbSearchResponse types, return the Search array as Movie[], and throw readable errors for HTTP failures and OMDb `Response: "False"`. Use `https://www.omdbapi.com/`. No React hooks, no useEffect, no state.

10. **Debug logs**: Add console logs to double check the OMDb request works.

11. **HomeModel**: Implement src/pages/Home/HomeModel.ts with `getMovies(query)`: trim the query, validate at least two characters, call searchMovies, return the movie list. No React hooks, no direct fetch.

12. **useHomeViewModel**: Implement src/pages/Home/useHomeViewModel.ts managing query, movies, loading, error with useState and a `handleSearch()` function that loads movies, stores readable errors, and returns all state/actions.

13. **HomeView**: Implement src/pages/Home/HomeView.tsx: search input bound to query, search on button click and form submit, loading message, error message, movie list via .map() showing title, year, type, poster.

14. **Remove duplicate search input**: The header already has a search input, so lift the query state to App and wire the header input (and its Search button) to drive the Home search.

15. **initialMovies**: Create `initialMovies()` inside HomeModel: fetch at least 20 random movies on Home open, different selection each launch, random seed keywords, Promise.all in parallel, merge, dedupe by imdbID, shuffle, return exactly 20 unique movies.

16. **MovieCard**: Create a reusable presentational MovieCard component (poster, title, year, type, disabled Favourite button) and render it in HomeView via .map().

17. **Home reload bug**: When searching and pressing Home, nothing loaded – wire initialMovies() so random movies reload when the Home screen opens or the Home link is clicked.

18. **Firebase config**: Create src/services/firebaseService.ts initializing Firebase from environment variables and export the database instance. No favourites logic, no auth, no HomeView changes.

19. **Favourites service**: Add `addFavourite(movie)`, `removeFavourite(imdbID)`, `getFavourites()` to firebaseService.ts using imdbID as unique ID, typed data, readable errors.

20. **Auth + favourites + routing**: Implement useFavouritesViewModel and FavouritesView, connect the Home Favourite button, update Firebase to use getAuth + getFirestore, create authService (registerUser/loginUser/logoutUser/subscribeToAuthChanges), create the Auth MVVM stack (AuthModel, useAuthViewModel, AuthView), create AuthContext with user/authLoading/logout, add protected routes (/auth, protected /favourites), redirect unauthenticated favourite clicks to /auth, move favourite click logic to the Home view model, store favourites per user under `users/{userId}/favourites/{imdbID}`, add a logout button, and document the prompts.