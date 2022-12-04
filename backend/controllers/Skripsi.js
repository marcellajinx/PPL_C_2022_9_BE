import { Sequelize } from "sequelize";
import Dosen from "../models/DosenModel.js";
import Mahasiswa from "../models/MahasiswaModel.js";
import Skripsi from "../models/SkripsiModel.js";
import User from "../models/UserModel.js";

import path from "path";
import fs from "fs";

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

export const UpdateSkripsi = async (req, res) => {
  try {
    const skripsi = await Skripsi.findOne({
      where: {
        nim: req.params.nim,
      },
    });
    if (!skripsi) return res.status(404).json({ msg: "Data tidak ditemukan" });

    let fileName = "";
    if (req.files === null) {
      fileName = skripsi.file_skripsi;
    } else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = [".pdf"];

      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "File must be .pdf" });
      if (fileSize > 5000000)
        return res.status(422).json({ msg: "File must be less than 5 MB" });

      const filepath = `./public/skripsi/${skripsi.file_skripsi}`;
      fs.unlinkSync(filepath);

      file.mv(`./public/skripsi/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }

    try {
      await Skripsi.update(
        {
          nim: req.params.nim,
          nilai_skripsi: req.body.nilai_skripsi,
          lama_studi: req.body.lama_studi,
          tgl_sidang: req.body.tgl_sidang,
          status_mhs: req.body.status_mhs,
          status_skripsi: req.body.status_skripsi,
          status_verifikasi: "0",
          file_skripsi: fileName,
          url: `${req.protocol}://${req.get("host")}/skripsi/${fileName}`,
        },
        {
          where: {
            nim: req.params.nim,
          },
        }
      );
      res.status(200).json({ msg: "Skripsi updated successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    console.log(req.body);
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

export const CreateSkripsi = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });
  const {
    status_mhs,
    status_skripsi,
    nilai_skripsi,
    lama_studi,
    tgl_sidang,
    status_verifikasi,
    nim,
    smt_skripsi,
  } = req.body;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/skripsi/${fileName}`;
  const allowedType = [".pdf"];
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "File must be .pdf" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "File must be less than 5 MB" });

  file.mv(`./public/skripsi/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Skripsi.create({
        status_mhs,
        status_skripsi,
        smt_skripsi,
        nilai_skripsi,
        lama_studi,
        tgl_sidang,
        status_verifikasi,
        nim,
        file_skripsi: fileName,
        url: url,
      });
      res.status(201).json({ msg: "Skripsi Created Successfuly" });
    } catch (error) {
      console.log(error);
    }
  });
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

export const checkSkripsi = async (req, res) => {
  // check verif skripsi
  try {
    const skripsi = await Skripsi.findOne({
      where: {
        nim: req.body.nim,
      },
    });
    if (!skripsi) return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (skripsi.status_verifikasi === "1") {
      skripsi.status_verifikasi = "0";
    } else {
      skripsi.status_verifikasi = "1";
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
    res.status(200).json(skripsi);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
