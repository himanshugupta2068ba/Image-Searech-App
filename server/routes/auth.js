import express from 'express';
import passport from 'passport';
import { registeredStrategies } from '../config/passport.js';

const router = express.Router();

// Helper middleware to check if strategy exists
const checkStrategy = (strategyName) => (req, res, next) => {
  if (!registeredStrategies.has(strategyName)) {
    const varNames = {
      google: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET',
      facebook: 'FACEBOOK_APP_ID and FACEBOOK_APP_SECRET',
      github: 'GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET'
    };
    return res.status(503).json({ 
      error: `${strategyName.charAt(0).toUpperCase() + strategyName.slice(1)} OAuth is not configured. Please add ${varNames[strategyName]} to your .env file in the server/ directory and restart the server.` 
    });
  }
  next();
};

// Google OAuth
router.get('/google',
  checkStrategy('google'),
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  checkStrategy('google'),
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
  }
);

// Facebook OAuth
router.get('/facebook',
  checkStrategy('facebook'),
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  checkStrategy('facebook'),
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
  }
);

// GitHub OAuth
router.get('/github',
  checkStrategy('github'),
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  checkStrategy('github'),
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
  }
);

// Get current user
router.get('/user', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;

