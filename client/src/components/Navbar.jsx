import logo from '../assets/logo.svg';

export default function Navbar({
  loggedInUser,
  isUserMenuOpen,
  setIsUserMenuOpen,
  handleSignOut
}) {
  return (
    <nav className="top-navbar" aria-label="Main Navigation">
      <div className="nav-logo">
        <img src={logo} alt="OmniKey Logo" className="logo" />
      </div>

      <div className="nav-user-menu-container">
        <button
          className="user-menu-toggle"
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          aria-expanded={isUserMenuOpen}
          aria-haspopup="true"
        >
          <span>Prof. {loggedInUser?.user_name}</span>
          <span className="dropdown-arrow">&#9662;</span>
        </button>

        {isUserMenuOpen && (
          <div className="user-dropdown-menu">
            <button
              onClick={handleSignOut}
              className="dropdown-signout-btn"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
