import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';

const API_URL = import.meta.env.VITE_API_URL;

// RecipeDetailPage component - displays detailed information about a single recipe
function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recipe details by ID from URL params
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/recipes/${id}`)
      .then((response) => {
        setRecipe(response.data);
        setError(null);
      })
      .catch((err) => {
        setError('Failed to load recipe details');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (error) return <p className="error">{error}</p>;

  if (!recipe) return <p>Recipe not found</p>;

  return (
    <div className="recipe-detail-page">
      <Link to="/recipes" className="back-link">← Back to Recipes</Link>

      <article className="recipe-detail">
        <h1>{recipe.title}</h1>

        {recipe.image_url && (
          <img src={recipe.image_url} alt={recipe.title} className="recipe-image" />
        )}

        <section className="recipe-meta">
          <div className="meta-item">
            <strong>Cuisine:</strong> {recipe.cuisine}
          </div>
          <div className="meta-item">
            <strong>Cook Time:</strong> {recipe.cook_time_minutes} minutes
          </div>
          <div className="meta-item">
            <strong>Servings:</strong> {recipe.servings}
          </div>
          <div className="meta-item">
            <strong>Difficulty:</strong> {recipe.difficulty}
          </div>
        </section>

        {recipe.tags && recipe.tags.length > 0 && (
          <section className="tags">
            <strong>Tags:</strong>
            <div className="tag-list">
              {recipe.tags.map((tag) => (
                <span key={tag.id} className="tag">{tag.name}</span>
              ))}
            </div>
          </section>
        )}

        <section className="recipe-section">
          <h2>Description</h2>
          <p>{recipe.description}</p>
        </section>

        <section className="recipe-section">
          <h2>Instructions</h2>
          <p>{recipe.instructions}</p>
        </section>

        {recipe.reviews && recipe.reviews.length > 0 && (
          <section className="reviews-section">
            <h2>Reviews ({recipe.reviews.length})</h2>
            <div className="reviews-list">
              {recipe.reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <strong>{review.username}</strong>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}

export default RecipeDetailPage;
