import { Sequelize } from "sequelize";
import Dosen from "../models/DosenModel.js";
import Mahasiswa from "../models/MahasiswaModel.js";
import Skripsi from "../models/SkripsiModel.js";
import User from "../models/UserModel.js";

export const GetAllSkripsi = async (req, res) => {
  try {
    const skripsi = await Skripsi.findAll();
    res.status(200).json(skripsi);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetSkripsiByNIM = async (req, res) => {
  try {
    const skripsi = await Skripsi.findAll({
      where: {
        nim: req.params.nim,
      },
    });
    res.status(200).json(skripsi);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const CreateSkripsi = async (req, res) => {
  const {
    status_mhs,
    status_skripsi,
    nilai_skripsi,
    lama_studi,
    tgl_sidang,
    file_skripsi,
    status_verifikasi,
    nim,
  } = req.body;
  try {
    await Skripsi.create({
      status_mhs,
      status_skripsi,
      nilai_skripsi,
      lama_studi,
      tgl_sidang,
      file_skripsi,
      status_verifikasi,
      nim,
    });
    res.json({
      message: "Skripsi Created",
    });
  } catch (error) {
    console.log(error);
  }
};

export const GetPieChartVerifSkripsi = async (req, res) => {
  try {
    let chartSkripsi = await Skripsi.findAll({
      attributes: [
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM tb_skripsi WHERE status_verifikasi = '1')`
          ),
          "sudah",
        ],
      ],
    });

    if (chartSkripsi.length == 0) {
      chartSkripsi = [{ sudah: 0 }];
    }

    const countSkripsi = await Skripsi.findAll({
      attributes: [[Sequelize.fn("COUNT", Sequelize.col("nim")), "jumlah"]],
    });

    res.status(200).json([chartSkripsi, countSkripsi]);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetAllSkripsiByKeyword = async (req, res) => {
  if (req.params.status == " ") {
    req.params.status = "";
  }
  if (req.params.angkatan == " ") {
    req.params.angkatan = "";
  }
  if (req.params.keyword == " ") {
    req.params.keyword = "";
  }
  try {
    const user = await User.findAll({
      include: [
        {
          model: Skripsi,
          where: {
            status_skripsi: {
              [Sequelize.Op.like]: Sequelize.literal(
                `'%${req.params.status}%'`
              ),
            },
          },
          required: true,
        },
      ],
      where: {
        [Sequelize.Op.or]: [
          {
            nim: {
              [Sequelize.Op.like]: Sequelize.literal(
                `'%${req.params.keyword}%'`
              ), // dosen
            },
          },
          {
            nama: {
              [Sequelize.Op.like]: Sequelize.literal(
                `'%${req.params.keyword}%'`
              ), // dosen
            },
          },
        ],
        angkatan: {
          [Sequelize.Op.like]: Sequelize.literal(`'%${req.params.angkatan}%'`),
        },
      },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const checkSkripsi = async (req, res) => {
  // check verif skripsi
  try {
    console.log(req.body);
    const skripsi = await Skripsi.findOne({
      where: {
        nim: req.body.nim,
        smt_skripsi: req.body.smt_skripsi,
      },
    });
    if (!skripsi) return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (skripsi.status_skripsi === "1") {
      skripsi.status_skripsi = "0";
    } else {
      skripsi.status_skripsi = "1";
    }
    skripsi.save();
    res.status(200).json({ msg: "Data updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetSkripsiByDoswal = async (req, res) => {
  if (req.params.status == " ") {
    req.params.status = "";
  }
  if (req.params.keyword == " ") {
    req.params.keyword = "";
  }
  try {
    const skripsi = await Skripsi.findAll({
      where: {
        status_skripsi: {
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
    res.status(200).json(skripsi);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
