import express from "express";

import { GetSidebar } from "../controllers/Sidebar.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/sidebar", GetSidebar);

export default router;
