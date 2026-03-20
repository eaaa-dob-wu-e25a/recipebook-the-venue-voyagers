# RecipeBook

A full-stack recipe browsing application built with React frontend and Express.js backend, connected to a SQLite database. This project demonstrates how to build a modern web application with API integration.

**Course:** Advanced ReactJS @ Erhvervsakademi Aarhus
**Session 2:** Connecting a React Frontend to a Backend API

## Project Structure

```
RecipeBook/
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Express API server
│   ├── database.js    # SQLite setup and schema
│   ├── seed.js        # Database seeding script
│   ├── index.js       # Main API routes
│   ├── .env.example   # Environment variables template
│   └── package.json
└── README.md          # This file
```

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the API server:
```bash
npm start
```

The backend API will be running at `http://localhost:8080`

### Frontend Setup

1. In a new terminal, navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the backend URL:
```bash
REACT_APP_API_URL=http://localhost:8080
```

4. Start the React development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## Running Both Together

For development, you need two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

The React app will automatically reload when you make changes, and it will communicate with the backend API.

## Available API Endpoints

The backend provides the following endpoints:

### Recipes
- `GET /recipes` - List all recipes (with optional filters)
- `GET /recipes/:id` - Get a single recipe with details
- `POST /recipes` - Create a new recipe
- `PUT /recipes/:id` - Update a recipe
- `DELETE /recipes/:id` - Delete a recipe

### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user details with their recipes and reviews

### Tags
- `GET /tags` - List all available tags

### Reviews
- `POST /reviews` - Create a review for a recipe

For detailed API documentation, see [backend/README.md](backend/README.md)

## Database

The backend uses SQLite (better-sqlite3) with the following tables:

- **users** - User accounts and profiles
- **recipes** - Recipe data with metadata
- **tags** - Recipe categories (Quick, Vegetarian, Healthy, etc.)
- **recipe_tags** - Links recipes to tags (many-to-many)
- **reviews** - User reviews and ratings for recipes

The database file (`recipes.db`) is created automatically when you run `npm run seed`.

## Learning Goals

This project demonstrates:

1. **React Fundamentals**
   - Component structure and lifecycle
   - State management
   - Props and component communication
   - Hooks (useState, useEffect)

2. **API Integration**
   - Fetching data from a backend API
   - Handling asynchronous requests
   - Error handling and loading states
   - Query parameters and filtering

3. **Backend Development**
   - Express.js server setup
   - RESTful API design
   - Database integration
   - CRUD operations (Create, Read, Update, Delete)

4. **Full-Stack Concepts**
   - Client-server communication
   - CORS (Cross-Origin Resource Sharing)
   - Environment variables
   - Database schema design

## Technologies Used

### Frontend
- React 18+
- React Router (for navigation)
- Fetch API or Axios (for HTTP requests)
- CSS (styling)

### Backend
- Node.js
- Express.js
- SQLite with better-sqlite3
- CORS middleware

## Environment Variables

### Backend (.env)
```
PORT=8080
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080
```

## Sample Data

The seed script includes:
- 5 users
- 10 recipes covering diverse cuisines (Italian, Indian, Japanese, Mexican, Danish, Greek, etc.)
- 8 tags (Quick, Vegetarian, Healthy, Comfort Food, Dessert, Spicy, Vegan, Gluten-Free)
- Multiple reviews and ratings

Run `npm run seed` in the backend directory to populate the database.

## Common Commands

### Backend
```bash
npm install          # Install dependencies
npm start            # Start the server
npm run seed         # Seed the database with sample data
```

### Frontend
```bash
npm install          # Install dependencies
npm start            # Start development server
npm build            # Create production build
npm test             # Run tests
```

## Troubleshooting

**Backend won't start:**
- Make sure port 8080 is not in use
- Check that `.env` file exists
- Run `npm install` to install dependencies

**Frontend can't connect to backend:**
- Verify backend is running on `http://localhost:8080`
- Check `REACT_APP_API_URL` in frontend `.env`
- Make sure CORS is enabled (it is by default)

**Database errors:**
- Try deleting `backend/recipes.db` and running `npm run seed` again
- Make sure you have write permissions in the backend folder

## Next Steps

To extend this project:

1. **Add authentication** - User login/registration
2. **Implement favorites** - Allow users to save favorite recipes
3. **Advanced filtering** - Filter by difficulty, cook time, cuisine
4. **Add images** - Upload recipe images instead of using URLs
5. **Deploy** - Host frontend on Vercel/Netlify, backend on Heroku/Railway

## Notes for Instructors

This is a teaching codebase designed for students to:
- Understand how frontend and backend communicate
- Learn REST API design principles
- Practice CRUD operations
- See how databases integrate with web applications

The code is intentionally simple and well-commented for educational clarity.
