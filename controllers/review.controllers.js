import * as Review from "../models/review.models.js";

export const submitReview = async (req, res) => {
  const { session_id, reviewer_id, rating, comment } = req.body;

  if (!session_id || !reviewer_id || !rating) {
    return res.status(400).json({ error: "session_id, reviewer_id, and rating are required" });
  }

  try {
    const reviewId = await Review.createReview(session_id, reviewer_id, rating, comment);
    res.status(201).json({ message: "Review submitted", reviewId });
  } catch (error) {
    console.error("Error creating review:", error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: "Invalid session_id or reviewer_id. Make sure both exist." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const fetchReviews = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const reviews = await Review.getReviewsBySession(sessionId);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const editReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!rating && !comment) {
    return res.status(400).json({ error: "At least one of rating or comment must be provided" });
  }

  try {
    const success = await Review.updateReview(id, rating, comment);
    if (!success) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ message: "Review updated" });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const success = await Review.deleteReview(id);
    if (!success) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
