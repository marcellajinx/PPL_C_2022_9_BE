import express from "express";
import { getVillageName } from "../controllers/Desa.js";

import { mhsOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/village/:id", getVillageName);

export default router;
