import { Sequelize } from "sequelize";
import User from "../models/UserModel.js";
import PKL from "../models/PKLModel.js";
import Mahasiswa from "../models/MahasiswaModel.js";
import Dosen from "../models/DosenModel.js";

export const GetAllPKL = async (req, res) => {
  try {
    const pkl = await PKL.findAll();
    res.status(200).json(pkl);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetPKLByNIM = async (req, res) => {
  try {
    const pkl = await PKL.findAll({
      where: {
        nim: req.params.nim,
      },
    });
    res.status(200).json(pkl);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const CreatePKL = async (req, res) => {
  const {
    status_mhs,
    status_pkl,
    nilai_pkl,
    file_pkl,
    status_verifikasi,
    nim,
  } = req.body;
  try {
    await PKL.create({
      status_mhs,
      status_pkl,
      nilai_pkl,
      file_pkl,
      status_verifikasi,
      nim,
    });
    res.json({
      message: "PKL Created",
    });
  } catch (error) {
    console.log(error);
  }
};

export const GetPieChartVerifPKL = async (req, res) => {
  try {
    let chartPKL = await PKL.findAll({
      attributes: [
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM tb_pkl WHERE status_verifikasi = '1')`
          ),
          "sudah",
        ],
      ],
    });

    if (chartPKL.length == 0) {
      chartPKL = [{ sudah: 0 }];
    }

    const countPKL = await PKL.findAll({
      attributes: [[Sequelize.fn("COUNT", Sequelize.col("nim")), "jumlah"]],
    });

    // countMhs.map((data, idx) => {
    //   chartPKL.push(chartPKL[idx]);
    //   chartPKL[0].c = 12;
    // });

    res.status(200).json([chartPKL, countPKL]);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetAllPKLByKeyword = async (req, res) => {
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
          model: PKL,
          where: {
            status_pkl: {
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

export const checkPKL = async (req, res) => {
  // check verif pkl
  try {
    console.log(req.body);
    const pkl = await PKL.findOne({
      where: {
        nim: req.body.nim,
        smt_pkl: req.body.smt_pkl,
      },
    });
    if (!pkl) return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (pkl.status_pkl === "1") {
      pkl.status_pkl = "0";
    } else {
      pkl.status_pkl = "1";
    }
    console.log("aa");
    pkl.save();
    res.status(200).json({ msg: "Data updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetPKLByDoswal = async (req, res) => {
  if (req.params.status == " ") {
    req.params.status = "";
  }
  if (req.params.keyword == " ") {
    req.params.keyword = "";
  }
  try {
    const pkl = await PKL.findAll({
      where: {
        status_pkl: {
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
    res.status(200).json(pkl);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
