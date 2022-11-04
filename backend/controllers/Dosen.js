import { Sequelize } from "sequelize";
import Dosen from "../models/DosenModel.js";

export const GetCountDosen = async (req, res) => {
  try {
    const dosen = await Dosen.findAll({
      where: {
        nip: {
          [Sequelize.Op.like]: Sequelize.literal("'99%'"), // dosen
        },
      },
    });
    if (!dosen) return res.status(200).json({ msg: 0 });
    res.status(200).json({ msg: dosen.length });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetCountAdm = async (req, res) => {
  try {
    const dosen = await Dosen.findAll({
      where: {
        nip: {
          [Sequelize.Op.like]: Sequelize.literal("'88%'"), // admin
        },
      },
    });
    if (!dosen) return res.status(200).json({ msg: 0 });
    res.status(200).json({ msg: dosen.length });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetCountDept = async (req, res) => {
  try {
    const dosen = await Dosen.findAll({
      where: {
        nip: "0",
      },
    });
    if (!dosen) return res.status(200).json({ msg: 0 });
    res.status(200).json({ msg: dosen.length });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetAllDoswal = async (req, res) => {
  try {
    const doswal = await Dosen.findAll({
      where: {
        nip: {
          [Sequelize.Op.like]: Sequelize.literal("'99%'"), // dosen
        },
      },
    });
    // const doswal = await Dosen.findAll();
    res.status(200).json(doswal);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetAllAdm = async (req, res) => {
  try {
    const dosen = await Dosen.findAll({
      where: {
        nip: {
          [Sequelize.Op.like]: Sequelize.literal("'88%'"), // admin
        },
      },
    });
    res.status(200).json(dosen);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetAllDoswalByKeyword = async (req, res) => {
  try {
    const dosen = await Dosen.findAll({
      where: {
        nip: {
          [Sequelize.Op.like]: Sequelize.literal("'99%'"), // dosen
        },
        [Sequelize.Op.or]: [
          {
            nip: {
              [Sequelize.Op.like]: Sequelize.literal(`'%${req.keyword}%'`), // dosen
            },
          },
          {
            nama: {
              [Sequelize.Op.like]: Sequelize.literal(`'%${req.keyword}%'`), // dosen
            },
          },
        ],
      },
    });
    res.status(200).json(dosen);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetDoswal = async (req, res) => {
  try {
    console.log(req.params);
    const doswal = await Dosen.findOne({
      where: {
        kode_wali: req.params.kode,
      },
    });
    res.status(200).json(doswal);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateDataDsn = async (req, res) => {
  try {
    const dosen = await Dosen.findOne({
      where: {
        nip: req.params.nip,
      },
    });
    if (!dosen) return res.status(404).json({ msg: "Data tidak ditemukan" });

    dosen.email = req.body.email;
    dosen.no_hp = req.body.kontak;
    dosen.save();
    res.status(200).json({ msg: "Data updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
