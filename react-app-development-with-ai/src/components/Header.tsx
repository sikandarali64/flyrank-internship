import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

interface HeaderProps {
  query: string
  setQuery: (value: string) => void
  onSearch: () => void
  onHomeClick: () => void
}

function Header({ query, setQuery, onSearch, onHomeClick }: HeaderProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    navigate('/')
    onSearch()
  }

  async function handleLogout() {
    await logout()
  }

  return (
    <header className="header">
      <nav className="header__nav">
        <Link to="/" className="header__link" onClick={onHomeClick}>
          Home
        </Link>
        <Link to="/favourites" className="header__link">
          Favourites
        </Link>
      </nav>
      <form className="header__search" onSubmit={onSubmit}>
        <input
          type="text"
          className="header__input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search movies"
          aria-label="Search movies"
        />
        <button type="submit" className="header__button">
          Search
        </button>
      </form>
      {user && (
        <button
          type="button"
          className="header__button header__logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </header>
  )
}

export default Header