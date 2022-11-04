import Provinsi from "../models/ProvinsiModel.js";

export const GetAllProvinces = async (req, res) => {
  try {
    const provinsi = await Provinsi.findAll();
    res.status(200).json(provinsi);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
