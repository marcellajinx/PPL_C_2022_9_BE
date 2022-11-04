import Kecamatan from "../models/KecamatanModel.js";

export const GetDistrictsByRegency = async (req, res) => {
  try {
    const kecamatan = await Kecamatan.findAll({
      where: {
        regency_id: req.params.id,
      },
    });
    res.status(200).json(kecamatan);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
