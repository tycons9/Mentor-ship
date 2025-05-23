import express from "express";
import { createSession } from "../controllers/session.controllers.js";

const router = express.Router();

router.post("/", createSession);

export default router;
