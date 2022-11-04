import express from "express";

import { GetAllProvinces } from "../controllers/Provinsi.js";

import { GetRegenciesByProvince } from "../controllers/Kota.js";

import { GetDistrictsByRegency } from "../controllers/Kecamatan.js";

import { GetVillagesByDistrict } from "../controllers/Desa.js";

import { GetPostalByVillage } from "../controllers/Postal.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/provinces", GetAllProvinces);
router.get("/regencies/:id", GetRegenciesByProvince);
router.get("/districts/:id", GetDistrictsByRegency);
router.get("/villages/:id", GetVillagesByDistrict);
router.get("/postal/:name", GetPostalByVillage);

export default router;
