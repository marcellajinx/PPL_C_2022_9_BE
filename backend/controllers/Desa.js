import Desa from "../models/DesaModel.js";

export const GetVillagesByDistrict = async (req, res) => {
  try {
    const desa = await Desa.findAll({
      where: {
        district_id: req.params.id,
      },
    });
    res.status(200).json(desa);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getVillageName = async (req, res) => {
  try {
    const desa = await Desa.findAll({
      attributes: ["name"],
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(desa);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
