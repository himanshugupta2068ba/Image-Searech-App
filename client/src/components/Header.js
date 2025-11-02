import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">Image Search App</h1>
        <div className="header-user">
          <span className="user-name">{user.name}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

