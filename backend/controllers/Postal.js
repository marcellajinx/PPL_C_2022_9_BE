import Postal from "../models/PostalModel.js";

export const GetPostalByVillage = async (req, res) => {
  try {
    const postal = await Postal.findAll({
      where: {
        kelurahan: req.params.name,
      },
    });
    res.status(200).json(postal);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
