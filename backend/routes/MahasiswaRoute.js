import express from "express";

import {
  GetAllMhs,
  GetAllMhsByKeyword,
  GetBarChartPKL,
  GetBarChartSkripsi,
  GetBarChartStatusMhs,
  GetCountMhs,
  GetDashboardDosen,
  GetLineChartPerwalian,
  GetMhsByNIM,
  GetPieChartStatusMhs,
  updateDataMhs,
} from "../controllers/Mahasiswa.js";
import {
  verifyUser,
  restrictMhs,
  mhsOnly,
  deptOnly,
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/mahasiswa/:nim", restrictMhs, GetMhsByNIM);
router.patch("/mahasiswa/:nim", mhsOnly, updateDataMhs);
router.get("/mahasiswa", GetAllMhs);
router.get("/mahasiswas/:keyword/:status/:angkatan", GetAllMhsByKeyword);
router.get("/count/mhs", GetCountMhs);
router.get("/chart/barstatus", GetBarChartStatusMhs);
router.get("/chart/piestatus", GetPieChartStatusMhs);
router.get("/chart/barpkl", GetBarChartPKL);
router.get("/chart/barskripsi", GetBarChartSkripsi);
router.get("/chart/lineperwalian/:kode_wali", GetLineChartPerwalian);
router.get("/chart/dashdosen/:kode_wali/:angkatan", GetDashboardDosen);

export default router;
