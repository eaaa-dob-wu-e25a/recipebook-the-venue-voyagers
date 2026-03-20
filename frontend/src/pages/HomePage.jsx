import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = process.env.REACT_APP_API_URL;

// HomePage component - displays welcome message and featured recipes
function HomePage() {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch a few recipes to display as featured
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/recipes`)
      .then((response) => {
        // Take first 3 recipes as featured
        setFeaturedRecipes(response.data.slice(0, 3));
        setError(null);
      })
      .catch((err) => {
        setError('Failed to load featured recipes');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to RecipeBook</h1>
        <p>Discover delicious recipes from around the world</p>
        <Link to="/recipes" className="btn btn-primary">Browse All Recipes</Link>
      </section>

      <section className="featured-section">
        <h2>Featured Recipes</h2>
        {loading && <LoadingSpinner />}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <div className="recipe-grid">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
