// LoadingSpinner component - simple loading indicator
// Used while data is being fetched from the API
function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

export default LoadingSpinner;
