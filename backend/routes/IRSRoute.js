import express from "express";

import {
  GetIRSByNIM,
  CreateIRS,
  GetPieChartVerifIRS,
  GetAllIRS,
  checkIRS,
  GetIRSByDoswal,
} from "../controllers/IRS.js";
import { mhsOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/irs/:nim", GetIRSByNIM);
router.get("/irsd/:doswal/:keyword/:status", GetIRSByDoswal);
router.get("/irs", GetAllIRS);
router.post("/irs", mhsOnly, CreateIRS);
router.get("/chart/pieverifirs", GetPieChartVerifIRS);
router.patch("/checkv/irs", checkIRS);

export default router;
