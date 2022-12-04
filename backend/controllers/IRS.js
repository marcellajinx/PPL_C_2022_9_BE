import { Sequelize } from "sequelize";
import Dosen from "../models/DosenModel.js";
import IRS from "../models/IRSModel.js";
import Mahasiswa from "../models/MahasiswaModel.js";
import path from "path";
import fs from "fs";

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

// export const GetIRSByNIMSem = async (req, res) => {
//   try {
//     const irs = await IRS.findOne({
//       where: {
//         nim: req.params.nim,
//         smt_irs: req.params.sem
//       },
//     });
//     res.status(200).json(irs);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };
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

export const UpdateIRS = async (req, res) => {
  try {
    const irs = await IRS.findOne({
      where: {
        nim: req.params.nim,
        smt_irs: req.body.smt_irs,
      },
    });
    if (!irs) return res.status(404).json({ msg: "Data tidak ditemukan" });

    let fileName = "";
    if (req.files === null) {
      fileName = irs.file_irs;
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

      const filepath = `./public/irs/${irs.file_irs}`;
      fs.unlinkSync(filepath);

      file.mv(`./public/irs/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }

    try {
      await IRS.update(
        {
          nim: req.params.nim,
          smt_irs: req.body.smt_irs,
          jml_sks: req.body.jml_sks,
          status_irs: "0",
          file_irs: fileName,
          url: `${req.protocol}://${req.get("host")}/irs/${fileName}`,
        },
        {
          where: {
            nim: req.params.nim,
            smt_irs: req.body.smt_irs,
          },
        }
      );
      res.status(200).json({ msg: "IRS updated successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    console.log(req.body);
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

export const CreateIRS = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });
  const { smt_irs, status_irs, jml_sks, nim, status_mhs } = req.body;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/irs/${fileName}`;
  const allowedType = [".pdf"];
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "File must be .pdf" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "File must be less than 5 MB" });
  file.mv(`./public/irs/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });

    // if (err) console.log(err);
    try {
      console.log(228);
      console.log(req.body);
      await IRS.create({
        smt_irs,
        status_irs,
        jml_sks,
        file_irs: fileName,
        url: url,
        nim,
        status_mhs,
      });
      res.status(201).json({ msg: "IRS Created Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const checkIRS = async (req, res) => {
  // check verif irs
  try {
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
    irs.save();
    res.status(200).json({ msg: "Data updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
