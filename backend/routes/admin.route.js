import express from "express";
import { adminLogin, generatenewaccesstoken } from "../controllers/auth/admin.controller.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/generatenewaccesstoken", generatenewaccesstoken);

export default router;