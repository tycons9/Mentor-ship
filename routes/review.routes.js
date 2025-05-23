import express from "express";
import { submitReview, fetchReviews ,editReview,
  deleteReview, } from "../controllers/review.controllers.js";

const router = express.Router();

router.post("/", submitReview);
router.get("/:sessionId", fetchReviews);
router.put("/:id", editReview);       
router.delete("/:id", deleteReview);
export default router;
