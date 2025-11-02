import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TopSearchesBanner.css';

function TopSearchesBanner() {
  const [topSearches, setTopSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopSearches();
  }, []);

  const fetchTopSearches = async () => {
    try {
      const response = await axios.get('/api/top-searches');
      setTopSearches(response.data.topSearches);
    } catch (error) {
      console.error('Error fetching top searches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="top-searches-banner">
        <div className="banner-content">
          <span className="banner-label">Top Searches:</span>
          <span className="loading-text">Loading...</span>
        </div>
      </div>
    );
  }

  if (topSearches.length === 0) {
    return null;
  }

  return (
    <div className="top-searches-banner">
      <div className="banner-content">
        <span className="banner-label">🔥 Top Searches:</span>
        <div className="top-searches-list">
          {topSearches.map((item, index) => (
            <span key={index} className="search-item">
              {item.term} ({item.count})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopSearchesBanner;

