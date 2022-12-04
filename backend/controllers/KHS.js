import { Sequelize } from "sequelize";
import Dosen from "../models/DosenModel.js";
import KHS from "../models/KHSModel.js";
import Mahasiswa from "../models/MahasiswaModel.js";

import path from "path";

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

export const UpdateKHS = async (req, res) => {
  try {
    const khs = await KHS.findOne({
      where: {
        nim: req.params.nim,
        smt_khs: req.body.smt_khs,
      },
    });
    if (!khs) return res.status(404).json({ msg: "Data tidak ditemukan" });

    let fileName = "";
    if (req.files === null) {
      fileName = khs.file_khs;
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

      const filepath = `./public/khs/${khs.file_khs}`;
      fs.unlinkSync(filepath);

      file.mv(`./public/khs/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }

    try {
      await KHS.update(
        {
          nim: req.params.nim,
          smt_khs: req.body.smt_khs,
          jml_sks: req.body.jml_sks,
          jml_sksk: req.body.jml_sksk,
          ips: req.body.ips,
          ipk: req.body.ipk,
          status_khs: "0",
          file_khs: fileName,
          url: `${req.protocol}://${req.get("host")}/khs/${fileName}`,
        },
        {
          where: {
            nim: req.params.nim,
            smt_khs: req.body.smt_khs,
          },
        }
      );
      res.status(200).json({ msg: "KHS updated successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    console.log(req.body);
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

export const CreateKHS = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });
  const { smt_khs, status_khs, jml_sks, jml_sksk, ips, ipk, nim } = req.body;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/khs/${fileName}`;
  const allowedType = [".pdf"];
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "File must be .pdf" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "File must be less than 5 MB" });

  file.mv(`./public/khs/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await KHS.create({
        smt_khs,
        status_khs,
        jml_sks,
        jml_sksk,
        ips,
        ipk,
        file_khs: fileName,
        url: url,
        nim,
      });
      res.status(201).json({ msg: "IRS Created Successfuly" });
    } catch (error) {
      console.log(error);
    }
  });
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
