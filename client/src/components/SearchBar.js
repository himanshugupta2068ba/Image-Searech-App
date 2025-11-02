import React, { useState } from 'react';
import axios from 'axios';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!term.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        '/api/search',
        { term: term.trim() },
        { withCredentials: true }
      );
      onSearch(term.trim(), response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Please log in to search');
      } else if (error.response?.status === 400) {
        setError(error.response.data.error || 'Invalid search term');
      } else {
        setError('Failed to search. Please try again.');
      }
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              setError(null);
            }}
            placeholder="Search for images..."
            className="search-input"
            disabled={loading}
          />
          <button
            type="submit"
            className="search-button"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-small"></span>
            ) : (
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            )}
          </button>
        </div>
        {error && <div className="search-error">{error}</div>}
      </form>
    </div>
  );
}

export default SearchBar;

