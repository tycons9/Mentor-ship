import db from "../config/db.js";

export const createReview = async (session_id, reviewer_id, rating, comment) => {
  const [result] = await db.execute(
    "INSERT INTO reviews (session_id, reviewer_id, rating, comment) VALUES (?, ?, ?, ?)",
    [session_id, reviewer_id, rating, comment]
  );
  return result.insertId;
};

export const getReviewsBySession = async (session_id) => {
  const [reviews] = await db.execute(
    "SELECT * FROM reviews WHERE session_id = ? ORDER BY id DESC",
    [session_id]
  );
  return reviews;
};
export const updateReview = async (id, rating, comment) => {
  const [result] = await db.execute(
    "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?",
    [rating, comment, id]
  );
  return result.affectedRows > 0;
};

export const deleteReview = async (id) => {
  const [result] = await db.execute(
    "DELETE FROM reviews WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};
