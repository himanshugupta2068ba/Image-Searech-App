import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import TopSearchesBanner from './TopSearchesBanner';
import Login from './Login';
import SearchBar from './SearchBar';
import ImageGrid from './ImageGrid';
import SearchHistory from './SearchHistory';
import './Home.css';

function Home() {
  const { user, loading } = useAuth();
  const [searchResults, setSearchResults] = useState(null);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term, results) => {
    setSearchTerm(term);
    setSearchResults(results);
    setSelectedImages(new Set()); // Reset selection on new search
  };

  const handleImageSelect = (imageId) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Header />
      <TopSearchesBanner />
      
      {!user ? (
        <Login />
      ) : (
        <div className="main-content">
          <div className="content-wrapper">
            <div className="search-section">
              <SearchBar onSearch={handleSearch} />
              
              {searchResults && (
                <>
                  <div className="search-info">
                    <p className="search-message">
                      You searched for <strong>"{searchTerm}"</strong> — {searchResults.results} results.
                    </p>
                    {selectedImages.size > 0 && (
                      <p className="selection-counter">
                        Selected: <strong>{selectedImages.size}</strong> image{selectedImages.size !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  
                  <ImageGrid 
                    images={searchResults.images}
                    selectedImages={selectedImages}
                    onImageSelect={handleImageSelect}
                  />
                </>
              )}
            </div>
            
            <SearchHistory />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

