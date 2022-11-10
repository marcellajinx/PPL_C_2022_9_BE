import express from "express";

import {
  CreatePKL,
  GetPieChartVerifPKL,
  GetAllPKL,
  GetAllPKLByKeyword,
  GetPKLByDoswal,
  checkPKL,
  GetPKLByNIM,
  UpdatePKL,
} from "../controllers/PKL.js";
import { mhsOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/pkl", GetAllPKL);
router.get("/pkl/:nim", GetPKLByNIM);
router.post("/pkl", mhsOnly, CreatePKL);
router.get("/pkld/:doswal/:keyword/:status", GetPKLByDoswal);
router.get("/chart/pieverifpkl", GetPieChartVerifPKL);
router.get("/mahasiswapkl/:keyword/:status/:angkatan", GetAllPKLByKeyword);
router.patch("/checkv/pkl", checkPKL);
router.patch("/pkl/:nim", UpdatePKL);

export default router;
