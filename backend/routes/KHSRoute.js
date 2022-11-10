import express from "express";

import {
  GetKHSByNIM,
  // GetKHSByNIMSem,
  GetSemesterByNIM,
  CreateKHS,
  GetPieChartVerifKHS,
  GetAllKHS,
  checkKHS,
  GetKHSByDoswal,
  UpdateKHS,
} from "../controllers/KHS.js";
import { mhsOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/khs/:nim", GetKHSByNIM);
router.get("/khs", GetAllKHS);
router.get("/khsd/:doswal/:keyword/:status", GetKHSByDoswal);
router.get("/sem/:nim", GetSemesterByNIM);
router.post("/khs", mhsOnly, CreateKHS);
router.get("/chart/pieverifkhs", GetPieChartVerifKHS);
router.patch("/checkv/khs", checkKHS);
router.patch("/khs/:nim", UpdateKHS);

export default router;
