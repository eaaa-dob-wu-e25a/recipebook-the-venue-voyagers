// StarRating component - displays star rating visually
// Props: rating (number 1-5)
function StarRating({ rating }) {
  const stars = [];

  // Create filled stars (★) for the rating, empty stars (☆) for the rest
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<span key={i} className="star filled">★</span>);
    } else {
      stars.push(<span key={i} className="star empty">☆</span>);
    }
  }

  return (
    <div className="star-rating">
      {stars}
      <span className="rating-value">({rating}/5)</span>
    </div>
  );
}

export default StarRating;
