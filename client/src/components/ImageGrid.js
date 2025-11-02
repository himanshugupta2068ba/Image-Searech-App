import React from 'react';
import './ImageGrid.css';

function ImageGrid({ images, selectedImages, onImageSelect }) {
  return (
    <div className="image-grid-container">
      <div className="image-grid">
        {images.map((image) => {
          const isSelected = selectedImages.has(image.id);
          return (
            <div
              key={image.id}
              className={`image-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onImageSelect(image.id)}
            >
              <img
                src={image.thumbnail || image.url}
                alt={image.description}
                className="grid-image"
                loading="lazy"
              />
              <div className="image-overlay">
                <div className={`checkbox-wrapper ${isSelected ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onImageSelect(image.id)}
                    className="image-checkbox"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ImageGrid;

