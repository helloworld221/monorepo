import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Media App
        </Link>
        <div className="navbar-nav">
          {isAuthenticated && user ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <div className="user-avatar" onClick={toggleDropdown}>
                {user.picture ? (
                  <img src={user.picture} alt={user.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.picture ? (
                        <img src={user.picture} alt={user.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="user-info-text">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                      setDropdownOpen(false);
                    }}
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
