import { Sequelize } from "sequelize";
import Dosen from "../models/DosenModel.js";
import KHS from "../models/KHSModel.js";
import Mahasiswa from "../models/MahasiswaModel.js";

export const GetAllKHS = async (req, res) => {
  try {
    const khs = await KHS.findAll();
    res.status(200).json(khs);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetPieChartVerifKHS = async (req, res) => {
  try {
    let chartKHS = await KHS.findAll({
      attributes: [
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM tb_khs WHERE status_khs = '1')`
          ),
          "sudah",
        ],
      ],
    });

    if (chartKHS.length == 0) {
      chartKHS = [{ sudah: 0 }];
    }

    const countKHS = await KHS.findAll({
      attributes: [[Sequelize.fn("COUNT", Sequelize.col("nim")), "jumlah"]],
    });

    res.status(200).json([chartKHS, countKHS]);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const GetSemesterByNIM = async (req, res) => {
  try {
    const khs = await KHS.findAll({
      where: {
        nim: req.params.nim,
      },
    });
    if (!khs) return res.status(200).json({ msg: 0 });
    res.status(200).json({ msg: khs.length });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetKHSByNIM = async (req, res) => {
  try {
    const khs = await KHS.findAll({
      where: {
        nim: req.params.nim,
      },
    });
    res.status(200).json(khs);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const CreateKHS = async (req, res) => {
  const { smt_khs, status_khs, jml_sks, jml_sksk, ips, ipk, file_khs, nim } =
    req.body;
  try {
    await KHS.create({
      smt_khs,
      status_khs,
      jml_sks,
      jml_sksk,
      ips,
      ipk,
      file_khs,
      nim,
    });
    res.json({
      message: "KHS Created",
    });
  } catch (error) {
    console.log(error);
  }
};

export const checkKHS = async (req, res) => {
  // check verif khs
  try {
    console.log(req.body);
    const khs = await KHS.findOne({
      where: {
        nim: req.body.nim,
        smt_khs: req.body.smt_khs,
      },
    });
    if (!khs) return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (khs.status_khs === "1") {
      khs.status_khs = "0";
    } else {
      khs.status_khs = "1";
    }
    console.log("aa");
    khs.save();
    res.status(200).json({ msg: "Data updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetKHSByDoswal = async (req, res) => {
  if (req.params.status == " ") {
    req.params.status = "";
  }
  if (req.params.keyword == " ") {
    req.params.keyword = "";
  }
  try {
    const khs = await KHS.findAll({
      where: {
        status_khs: {
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
    res.status(200).json(khs);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
