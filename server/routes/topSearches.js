import express from 'express';
import Search from '../models/Search.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const topSearches = await Search.aggregate([
      {
        $group: {
          _id: '$term',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          term: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({ topSearches });
  } catch (error) {
    console.error('Top searches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

