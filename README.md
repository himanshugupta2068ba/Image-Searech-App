# MERN Image Search App

A full-stack image search application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring OAuth authentication and Unsplash API integration.

## Features

- **OAuth Authentication**: Login with Google, Facebook, or GitHub using Passport.js(only google working)
- **Image Search**: Search for images using the Unsplash API
- **Multi-Select Grid**: Select multiple images with checkbox overlay
- **Top Searches**: View the top 5 most frequent search terms across all users
- **Search History**: Personal search history for each authenticated user
- **Responsive Design**: Modern UI that works on all screen sizes

## Project Structure

```
internassignment/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
├── server/          # Express backend
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
└── package.json
```







### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- OAuth credentials for Google, Facebook, and GitHub
- Unsplash API access key

### 1. Install Dependencies

```bash
npm run install-all
```

Or install separately:

```bash
npm install
cd server && npm install
cd ../client && npm install
```








### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 5. Run the Application

```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run server  # Backend on http://localhost:5000
npm run client  # Frontend on http://localhost:3000
```

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/facebook` - Initiate Facebook OAuth
- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout user

### Search
- `POST /api/search` - Search for images (requires authentication)
  - Body: `{ term: "search query" }`

### History
- `GET /api/history` - Get user's search history (requires authentication)

### Top Searches
- `GET /api/top-searches` - Get top 5 most frequent search terms

## Technologies Used

### Backend
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- Passport.js - Authentication middleware
- Express Session - Session management
- Axios - HTTP client for Unsplash API

### Frontend
- React - UI library
- React Router - Routing
- Axios - HTTP client
- CSS3 - Styling

## Features Implementation

1. **Authentication**: OAuth providers integrated with Passport.js strategies
2. **Protected Routes**: Middleware ensures only authenticated users can search
3. **Search Storage**: All searches stored in MongoDB with userId, term, and timestamp
4. **Image Display**: 4-column responsive grid (adapts to screen size)
5. **Multi-Select**: Client-side state management for selected images
6. **Top Searches**: Aggregation query to find most frequent search terms
7. **Search History**: User-specific history with relative timestamps

## License

ISC

