import logo from '../assets/logo.png';

export default function Login({
  email,
  setEmail,
  password,
  setPassword,
  loginError,
  handleLogin
}) {
  return (
    <main className="app-container login-container">
      <section className="login-card">
        <header>
          <img src={logo} alt="OmniKey Logo" className="logoh" />
          <p className="portal-subtitle">
            Secure University Exam Records Desk
          </p>
        </header>

        {loginError && (
          <div className="alert error" role="alert">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eyad@university.edu"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="12345678"
              required
            />
          </div>

          <button type="submit" className="btn primary-btn">
            Sign In
          </button>
        </form>
      </section>
    </main>
  );
}
