import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

// Track which strategies are registered
export const registeredStrategies = new Set();

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Function to setup strategies (called after dotenv loads)
export function setupPassportStrategies() {
  // Google Strategy (only if credentials are provided)
  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const hasGoogleCredentials = googleClientId && googleClientSecret;

  console.log('[Passport] Google Client ID check:', {
    exists: !!process.env.GOOGLE_CLIENT_ID,
    length: process.env.GOOGLE_CLIENT_ID?.length || 0,
    trimmed: googleClientId?.length || 0
  });

  if (hasGoogleCredentials) {
    console.log('✓ Google credentials found - setting up strategy...');
    passport.use('google', new GoogleStrategy({
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      // callbackURL: '/api/auth/google/callback'
      callbackURL: 'http://localhost:5000/api/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            provider: 'google'
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));
    registeredStrategies.add('google');
    console.log('✓ Google OAuth strategy configured successfully!');
  } else {
    console.warn('✗ Google OAuth not configured:');
    console.warn('  - GOOGLE_CLIENT_ID:', googleClientId ? `exists (length: ${googleClientId.length})` : 'MISSING');
    console.warn('  - GOOGLE_CLIENT_SECRET:', googleClientSecret ? `exists (length: ${googleClientSecret.length})` : 'MISSING');
  }

  // Facebook Strategy (only if credentials are provided)
  const facebookAppId = process.env.FACEBOOK_APP_ID?.trim();
  const facebookAppSecret = process.env.FACEBOOK_APP_SECRET?.trim();
  const hasFacebookCredentials = facebookAppId && facebookAppSecret;

  if (hasFacebookCredentials) {
    passport.use('facebook', new FacebookStrategy({
      clientID: facebookAppId,
      clientSecret: facebookAppSecret,
      callbackURL: '/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ facebookId: profile.id });
      if (!user) {
        user = await User.create({
          facebookId: profile.id,
          email: profile.emails?.[0]?.value || '',
          name: profile.displayName,
          provider: 'facebook'
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
  registeredStrategies.add('facebook');
  console.log('Facebook OAuth strategy configured');
} else {
    console.warn('Facebook OAuth not configured: Missing FACEBOOK_APP_ID or FACEBOOK_APP_SECRET');
  }

  // GitHub Strategy (only if credentials are provided)
  const githubClientId = process.env.GITHUB_CLIENT_ID?.trim();
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET?.trim();
  const hasGitHubCredentials = githubClientId && githubClientSecret;

  if (hasGitHubCredentials) {
    passport.use('github', new GitHubStrategy({
      clientID: githubClientId,
      clientSecret: githubClientSecret,
      callbackURL: '/api/auth/github/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        user = await User.create({
          githubId: profile.id,
          email: profile.emails?.[0]?.value || profile.username + '@github.com',
          name: profile.displayName || profile.username,
          provider: 'github'
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
  registeredStrategies.add('github');
  console.log('GitHub OAuth strategy configured');
} else {
    console.warn('GitHub OAuth not configured: Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET');
  }
}

