import express from "express";
import { Login, Logout, Me, CreateUser } from "../controllers/User.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/me", Me);
router.post("/login", Login);
router.delete("/logout", Logout);

router.post("/users", adminOnly, CreateUser);

export default router;
