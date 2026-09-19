import { useState, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthView from './pages/Auth/AuthView'
import FavouritesView from './pages/Favourites/FavouritesView'
import HomeView from './pages/Home/HomeView'

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return <p>Loading...</p>
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}

function RequireGuest({ children }: { children: ReactNode }) {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return <p>Loading...</p>
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const [query, setQuery] = useState('')
  const [searchSignal, setSearchSignal] = useState(0)
  const [homeSignal, setHomeSignal] = useState(0)

  function handleHeaderSearch() {
    setSearchSignal((signal) => signal + 1)
  }

  function handleHomeClick() {
    setHomeSignal((signal) => signal + 1)
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Header
          query={query}
          setQuery={setQuery}
          onSearch={handleHeaderSearch}
          onHomeClick={handleHomeClick}
        />
        <Routes>
          <Route
            path="/"
            element={
              <HomeView
                query={query}
                searchSignal={searchSignal}
                homeSignal={homeSignal}
              />
            }
          />
          <Route
            path="/auth"
            element={
              <RequireGuest>
                <AuthView />
              </RequireGuest>
            }
          />
          <Route
            path="/favourites"
            element={
              <RequireAuth>
                <FavouritesView />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App