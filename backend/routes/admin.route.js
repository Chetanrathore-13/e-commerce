import express from "express";
import { adminLogin } from "../controllers/auth/admin.controller.js";

const router = express.Router();

router.post("/login", adminLogin);

export default router;