import express from "express";

import {
  checkSkripsi,
  CreateSkripsi,
  GetAllSkripsi,
  GetAllSkripsiByKeyword,
  GetPieChartVerifSkripsi,
  GetSkripsiByDoswal,
  GetSkripsiByNIM,
} from "../controllers/Skripsi.js";
import { mhsOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/skripsi", GetAllSkripsi);
router.get("/skripsi/:nim", GetSkripsiByNIM);
router.post("/skripsi", mhsOnly, CreateSkripsi);
router.get("/skripsid/:doswal/:keyword/:status", GetSkripsiByDoswal);
router.get("/chart/pieverifskripsi", GetPieChartVerifSkripsi);
router.get(
  "/mahasiswaskripsi/:keyword/:status/:angkatan",
  GetAllSkripsiByKeyword
);
router.patch("/checkv/skripsi", checkSkripsi);

export default router;
