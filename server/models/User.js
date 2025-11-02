import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: String,
  facebookId: String,
  githubId: String,
  email: String,
  name: String,
  provider: String
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);

