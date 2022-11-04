import { Sequelize } from "sequelize";
import Dosen from "../models/DosenModel.js";
import IRS from "../models/IRSModel.js";
import Mahasiswa from "../models/MahasiswaModel.js";

export const GetAllIRS = async (req, res) => {
  try {
    const irs = await IRS.findAll({
      include: [
        {
          model: Mahasiswa,
          required: true,
        },
      ],
    });
    res.status(200).json(irs);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetPieChartVerifIRS = async (req, res) => {
  try {
    let chartIRS = await IRS.findAll({
      attributes: [
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM tb_irs WHERE status_irs = '1')`
          ),
          "sudah",
        ],
      ],
    });

    if (chartIRS.length == 0) {
      chartIRS = [{ sudah: 0 }];
    }

    const countIRS = await IRS.findAll({
      attributes: [[Sequelize.fn("COUNT", Sequelize.col("nim")), "jumlah"]],
    });

    res.status(200).json([chartIRS, countIRS]);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetSemesterByNIM = async (req, res) => {
  try {
    const irs = await IRS.findAll({
      where: {
        nim: req.params.nim,
      },
    });
    if (!irs) return res.status(200).json({ msg: 0 });
    res.status(200).json({ msg: irs.length });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetIRSByNIM = async (req, res) => {
  try {
    const irs = await IRS.findAll({
      where: {
        nim: req.params.nim,
      },
    });
    res.status(200).json(irs);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetIRSByDoswal = async (req, res) => {
  if (req.params.status == " ") {
    req.params.status = "";
  }
  if (req.params.keyword == " ") {
    req.params.keyword = "";
  }
  try {
    const irs = await IRS.findAll({
      where: {
        status_irs: {
          [Sequelize.Op.like]: Sequelize.literal(`'%${req.params.status}%'`),
        },
      },
      include: [
        {
          model: Mahasiswa,
          required: true,
          attributes: ["nama", "angkatan", "status_mhs"],
          where: {
            [Sequelize.Op.or]: [
              {
                nim: {
                  [Sequelize.Op.like]: Sequelize.literal(
                    `'%${req.params.keyword}%'`
                  ),
                },
              },
              {
                nama: {
                  [Sequelize.Op.like]: Sequelize.literal(
                    `'%${req.params.keyword}%'`
                  ),
                },
              },
            ],
          },
          include: [
            {
              model: Dosen,
              required: true,
              attributes: [],
              where: {
                nip: req.params.doswal,
              },
            },
          ],
        },
      ],
    });
    res.status(200).json(irs);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const CreateIRS = async (req, res) => {
  const { smt_irs, status_irs, jml_sks, file_irs, nim } = req.body;
  try {
    await IRS.create({
      smt_irs,
      status_irs,
      jml_sks,
      file_irs,
      nim,
    });
    res.json({
      message: "IRS Created",
    });
  } catch (error) {
    console.log(error);
  }
};

export const checkIRS = async (req, res) => {
  // check verif irs
  try {
    console.log(req.body);
    const irs = await IRS.findOne({
      where: {
        nim: req.body.nim,
        smt_irs: req.body.smt_irs,
      },
    });
    if (!irs) return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (irs.status_irs === "1") {
      irs.status_irs = "0";
    } else {
      irs.status_irs = "1";
    }
    console.log("aa");
    irs.save();
    res.status(200).json({ msg: "Data updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
