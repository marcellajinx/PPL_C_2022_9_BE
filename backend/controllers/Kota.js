import Kota from "../models/KotaModel.js";

export const GetRegenciesByProvince = async (req, res) => {
  try {
    const kota = await Kota.findAll({
      where: {
        province_id: req.params.id,
      },
    });
    res.status(200).json(kota);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
