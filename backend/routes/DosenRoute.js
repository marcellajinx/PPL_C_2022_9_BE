import express from "express";

import {
  GetAllAdm,
  GetAllDoswal,
  GetAllDoswalByKeyword,
  GetCountAdm,
  GetCountDept,
  GetCountDosen,
  GetDoswal,
  updateDataDsn,
} from "../controllers/Dosen.js";
import {
  verifyUser,
  adminDeptOnly,
  deptOnly,
  dosenOnly,
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/doswal", GetAllDoswal);
router.get("/doswals/:keyword", GetAllDoswalByKeyword);
router.get("/admin", GetAllAdm);
router.get("/doswal/:kode", GetDoswal);
router.get("/count/dosen", GetCountDosen);
router.get("/count/dept", GetCountDept);
router.get("/count/adm", GetCountAdm);
router.patch("/dosen/:nip", dosenOnly, updateDataDsn);

export default router;
