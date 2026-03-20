# RecipeBook API

A simple Express.js backend API for the RecipeBook React application. This API connects to a SQLite database and provides endpoints for managing recipes, users, tags, and reviews.

## Setup

### Prerequisites
- Node.js 14+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```bash
PORT=8080
```

3. Seed the database with sample data:
```bash
npm run seed
```

4. Start the server:
```bash
npm start
```

The API will be available at `http://localhost:8080`

## API Endpoints

### Recipes

#### GET /recipes
List all recipes with optional filtering.

**Query Parameters:**
- `cuisine` (optional): Filter by cuisine type (e.g., "Italian", "Indian")
- `search` (optional): Search recipes by title or description

**Example Request:**
```
GET /recipes?cuisine=Italian
GET /recipes?search=pasta
```

**Example Response:**
```json
[
  {
    "id": 1,
    "title": "Spaghetti Bolognese",
    "description": "Classic Italian pasta dish with rich meat sauce",
    "instructions": "Cook spaghetti...",
    "image_url": "https://...",
    "cuisine": "Italian",
    "cook_time_minutes": 35,
    "servings": 4,
    "difficulty": 2,
    "created_by": 3,
    "created_at": "2024-01-15T10:30:00.000Z",
    "tags": [
      { "id": 1, "name": "Comfort Food" }
    ]
  }
]
```

---

#### GET /recipes/:id
Get a single recipe with tags, reviews, and creator information.

**Example Request:**
```
GET /recipes/1
```

**Example Response:**
```json
{
  "id": 1,
  "title": "Spaghetti Bolognese",
  "description": "Classic Italian pasta dish with rich meat sauce",
  "instructions": "Cook spaghetti...",
  "image_url": "https://...",
  "cuisine": "Italian",
  "cook_time_minutes": 35,
  "servings": 4,
  "difficulty": 2,
  "created_by": 3,
  "created_at": "2024-01-15T10:30:00.000Z",
  "tags": [
    { "id": 1, "name": "Comfort Food" }
  ],
  "creator": {
    "id": 3,
    "username": "carlo_italian",
    "profile_picture_url": "https://..."
  },
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Excellent!",
      "created_at": "2024-01-16T08:15:00.000Z",
      "username": "john_chef",
      "profile_picture_url": "https://..."
    }
  ]
}
```

---

#### POST /recipes
Create a new recipe.

**Request Body:**
```json
{
  "title": "Margherita Pizza",
  "description": "Simple Italian pizza with fresh mozzarella",
  "instructions": "Make dough, add tomato sauce, bake...",
  "image_url": "https://...",
  "cuisine": "Italian",
  "cook_time_minutes": 25,
  "servings": 2,
  "difficulty": 2,
  "created_by": 3,
  "tags": [1, 4]
}
```

**Required Fields:** `title`, `instructions`, `created_by`

**Example Response:** (Returns the created recipe)
```json
{
  "id": 11,
  "title": "Margherita Pizza",
  ...
}
```

---

#### PUT /recipes/:id
Update an existing recipe.

**Request Body:**
```json
{
  "title": "Spaghetti Bolognese (Updated)",
  "description": "...",
  "instructions": "...",
  "image_url": "https://...",
  "cuisine": "Italian",
  "cook_time_minutes": 40,
  "servings": 4,
  "difficulty": 2
}
```

**Example Response:** (Returns the updated recipe)
```json
{
  "id": 1,
  "title": "Spaghetti Bolognese (Updated)",
  ...
}
```

---

#### DELETE /recipes/:id
Delete a recipe (cascades to associated tags and reviews).

**Example Request:**
```
DELETE /recipes/1
```

**Example Response:**
```json
{
  "message": "Recipe deleted successfully",
  "id": 1
}
```

---

### Users

#### GET /users
List all users.

**Example Response:**
```json
[
  {
    "id": 1,
    "username": "john_chef",
    "email": "john@example.com",
    "profile_picture_url": "https://...",
    "created_at": "2024-01-10T09:00:00.000Z"
  }
]
```

---

#### GET /users/:id
Get a single user with their recipes and reviews.

**Example Response:**
```json
{
  "id": 1,
  "username": "john_chef",
  "email": "john@example.com",
  "profile_picture_url": "https://...",
  "created_at": "2024-01-10T09:00:00.000Z",
  "recipes": [
    { "id": 1, "title": "Spaghetti Bolognese", "cuisine": "Italian" }
  ],
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Great recipe!",
      "created_at": "2024-01-16T08:15:00.000Z",
      "recipe_title": "Chicken Tikka Masala"
    }
  ]
}
```

---

### Tags

#### GET /tags
List all available tags.

**Example Response:**
```json
[
  { "id": 1, "name": "Quick" },
  { "id": 2, "name": "Vegetarian" },
  { "id": 3, "name": "Comfort Food" },
  { "id": 4, "name": "Healthy" }
]
```

---

### Reviews

#### POST /reviews
Create a review for a recipe.

**Request Body:**
```json
{
  "recipe_id": 1,
  "user_id": 2,
  "rating": 5,
  "comment": "Absolutely delicious! Made it last weekend."
}
```

**Required Fields:** `recipe_id`, `user_id`, `rating` (1-5)

**Example Response:**
```json
{
  "id": 9,
  "recipe_id": 1,
  "user_id": 2,
  "rating": 5,
  "comment": "Absolutely delicious! Made it last weekend.",
  "created_at": "2024-01-17T14:30:00.000Z"
}
```

---

## Database Schema

### Tables

- **users**: User accounts (username, email, profile picture)
- **recipes**: Recipe data (title, description, instructions, cuisine, difficulty, etc.)
- **tags**: Recipe tags (Quick, Vegetarian, Healthy, etc.)
- **recipe_tags**: Junction table linking recipes to tags (many-to-many)
- **reviews**: User reviews for recipes (rating 1-5, comment)

All timestamps use ISO 8601 format with UTC timezone.

## Error Handling

The API returns standard HTTP status codes:
- `200 OK`: Successful GET request
- `201 Created`: Successful POST request
- `400 Bad Request`: Missing or invalid required fields
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses include a JSON object with an `error` field:
```json
{
  "error": "Missing required fields"
}
```

## Running in Development

For development with auto-reload, you can use `nodemon`:
```bash
npm install --save-dev nodemon
npm run dev  # (if configured in package.json)
```

Or manually restart the server after code changes:
```bash
npm start
```
