import { Sequelize } from "sequelize";
import User from "../models/UserModel.js";
import PKL from "../models/PKLModel.js";
import Mahasiswa from "../models/MahasiswaModel.js";
import Dosen from "../models/DosenModel.js";

import path from "path";
import fs from "fs";

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

export const UpdatePKL = async (req, res) => {
  try {
    const pkl = await PKL.findOne({
      where: {
        nim: req.params.nim,
      },
    });
    if (!pkl) return res.status(404).json({ msg: "Data tidak ditemukan" });

    let fileName = "";
    if (req.files === null) {
      fileName = pkl.file_pkl;
    } else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = [".pdf"];

      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid Files" });
      if (fileSize > 5000000)
        return res.status(422).json({ msg: "File must be less than 5 MB" });

      const filepath = `./public/pkl/${pkl.file_pkl}`;
      fs.unlinkSync(filepath);

      file.mv(`./public/pkl/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }

    try {
      await PKL.update(
        {
          nim: req.params.nim,
          nilai_pkl: req.body.nilai_pkl,
          status_mhs: req.body.status_mhs,
          status_pkl: req.body.status_pkl,
          status_verifikasi: "0",
          file_pkl: fileName,
          url: `${req.protocol}://${req.get("host")}/pkl/${fileName}`,
        },
        {
          where: {
            nim: req.params.nim,
          },
        }
      );
      res.status(200).json({ msg: "PKL updated successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    console.log(req.body);
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

export const CreatePKL = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });
  const { status_mhs, status_pkl, nilai_pkl, status_verifikasi, nim } =
    req.body;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/pkl/${fileName}`;
  const allowedType = [".pdf"];
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Files" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "File must be less than 5 MB" });

  file.mv(`./public/pkl/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await PKL.create({
        status_mhs,
        status_pkl,
        nilai_pkl,
        status_verifikasi,
        nim,
        file_pkl: fileName,
        url: url,
      });
      res.status(201).json({ msg: "PKL Created Successfuly" });
    } catch (error) {
      console.log(error);
    }
  });
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
            status_verifikasi: {
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
    const pkl = await PKL.findOne({
      where: {
        nim: req.body.nim,
      },
    });
    if (!pkl) return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (pkl.status_verifikasi === "1") {
      pkl.status_verifikasi = "0";
    } else {
      pkl.status_verifikasi = "1";
    }
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
        status_verifikasi: {
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
