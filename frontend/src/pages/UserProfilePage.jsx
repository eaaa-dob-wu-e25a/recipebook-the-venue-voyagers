import { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import RecipeCard from '../components/RecipeCard';

const API_URL = process.env.REACT_APP_API_URL;

// UserProfilePage component - displays user profile with their recipes and reviews
// For now, hardcoded to user ID 1 (no authentication yet)
function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data with ID 1 (hardcoded for now)
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/users/1`)
      .then((response) => {
        setUser(response.data.user);
        setError(null);
      })
      .catch((err) => {
        setError('Failed to load user profile');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) return <p className="error">{error}</p>;

  if (!user) return <p>User not found</p>;

  return (
    <div className="profile-page">
      <section className="profile-header">
        <h1>{user.name}</h1>
        {user.email && <p className="user-email">{user.email}</p>}
        {user.bio && <p className="user-bio">{user.bio}</p>}
      </section>

      {user.recipes && user.recipes.length > 0 && (
        <section className="profile-section">
          <h2>Recipes by {user.name}</h2>
          <div className="recipe-grid">
            {user.recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {user.reviews && user.reviews.length > 0 && (
        <section className="profile-section">
          <h2>Reviews by {user.name}</h2>
          <div className="reviews-list">
            {user.reviews.map((review) => (
              <div key={review.id} className="review-item">
                <h3>{review.recipe_title || 'Recipe'}</h3>
                <p className="review-rating">Rating: {review.rating}/5</p>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default UserProfilePage;
