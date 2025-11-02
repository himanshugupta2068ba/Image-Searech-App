import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import Search from '../models/Search.js';

const router = express.Router();

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const history = await Search.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50)
      .select('term timestamp')
      .lean();

    res.json({ history });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

