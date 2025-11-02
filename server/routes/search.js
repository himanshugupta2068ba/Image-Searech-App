import express from 'express';
import axios from 'axios';
import { isAuthenticated } from '../middleware/auth.js';
import Search from '../models/Search.js';

const router = express.Router();

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { term } = req.body;
    
    if (!term || term.trim() === '') {
      return res.status(400).json({ error: 'Search term is required' });
    }

    const userId = req.user._id;
    const searchTerm = term.trim();

    // Store search in database
    await Search.create({
      userId,
      term: searchTerm,
      timestamp: new Date()
    });

    // Fetch images from Unsplash API
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY?.trim();
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'your-unsplash-access-key') {
      return res.status(500).json({ 
        error: 'Unsplash API key not configured. Please add your UNSPLASH_ACCESS_KEY to the .env file. Get it from https://unsplash.com/developers' 
      });
    }

    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: searchTerm,
        per_page: 20,
        client_id: UNSPLASH_ACCESS_KEY
      }
    });

    const images = response.data.results.map((photo) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbnail: photo.urls.thumb,
      description: photo.description || photo.alt_description || 'No description',
      width: photo.width,
      height: photo.height,
      user: photo.user.name,
      userUrl: photo.user.links.html
    }));

    res.json({
      term: searchTerm,
      total: response.data.total,
      results: images.length,
      images
    });
  } catch (error) {
    console.error('Search error:', error);
    if (error.response) {
      if (error.response.status === 401) {
        return res.status(401).json({ 
          error: 'Invalid Unsplash API key. Please check your UNSPLASH_ACCESS_KEY in the .env file.' 
        });
      }
      res.status(error.response.status).json({ 
        error: `Unsplash API error: ${error.response.statusText || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;

