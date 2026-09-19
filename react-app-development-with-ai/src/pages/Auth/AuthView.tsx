import type { FormEvent } from 'react'
import useAuthViewModel from './useAuthViewModel'

function AuthView() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    loading,
    error,
    handleSubmit,
    toggleMode,
  } = useAuthViewModel()

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    handleSubmit()
  }

  const isLogin = mode === 'login'

  return (
    <main>
      <h1>{isLogin ? 'Login' : 'Create Account'}</h1>

      <form onSubmit={onSubmit}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          aria-label="Email"
        />

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          aria-label="Password"
        />

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>

      <button type="button" onClick={toggleMode}>
        {isLogin ? 'Create Account' : 'Login'}
      </button>
    </main>
  )
}

export default AuthView