import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000";

function Reviews({ destinationId, userId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadReviews = async () => {
    try {
      const response = await fetch(
        `${API_URL}/reviews/destination/${destinationId}`
      );

      if (!response.ok) {
        throw new Error("Could not load reviews");
      }

      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Review loading error:", error);
    }
  };

  useEffect(() => {
    if (destinationId) {
      loadReviews();
    }
  }, [destinationId]);

  const submitReview = async (e) => {
    e.preventDefault();

    if (!feedback.trim()) {
      setMessage("Please write your review.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination_id: Number(destinationId),
          user_id: Number(userId),
          rating: Number(rating),
          feedback: feedback.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to submit review");
      }

      setFeedback("");
      setRating(5);
      setMessage("Review submitted successfully.");

      await loadReviews();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="reviews-section">
      <h2>⭐ Reviews</h2>

      {reviews.length === 0 ? (
        <p className="no-reviews">
          No reviews yet. Be the first to review this destination!
        </p>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-header">
                <span className="review-stars">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>

                <span className="review-user">
                  User #{review.user_id}
                </span>
              </div>

              <p>{review.feedback}</p>
            </div>
          ))}
        </div>
      )}

      <div className="review-form">
        <h3>Write a Review</h3>

        <form onSubmit={submitReview}>
          <label>Rating</label>

          <div className="rating-selector">
            {[1, 2, 3, 4, 5].map((number) => (
              <button
                key={number}
                type="button"
                className={number <= rating ? "selected-star" : ""}
                onClick={() => setRating(number)}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your experience..."
            rows="4"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>

          {message && (
            <p className="review-message">
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Reviews;