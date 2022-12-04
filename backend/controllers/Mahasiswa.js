import { Sequelize } from "sequelize";
import Mahasiswa from "../models/MahasiswaModel.js";
import Skripsi from "../models/SkripsiModel.js";
import PKL from "../models/PKLModel.js";
import User from "../models/UserModel.js";
import path from "path";

export const GetDashboardDosen = async (req, res) => {
  try {
    const chartStatus = await Mahasiswa.findOne({
      attributes: [
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM tb_mhs WHERE kode_wali = ${req.params.kode_wali} and angkatan = ${req.params.angkatan} and status_mhs = '1')`
          ),
          "perwalianaktif",
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM tb_mhs WHERE kode_wali = ${req.params.kode_wali} and angkatan = ${req.params.angkatan} and status_mhs = '0')`
          ),
          "perwaliancuti",
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM tb_mhs join tb_pkl WHERE kode_wali = ${req.params.kode_wali} and angkatan = ${req.params.angkatan} and tb_mhs.nim = tb_pkl.nim)`
          ),
          "perwalianpkl",
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM tb_mhs join tb_skripsi WHERE kode_wali = ${req.params.kode_wali} and angkatan = ${req.params.angkatan} and tb_mhs.nim = tb_skripsi.nim)`
          ),
          "perwalianskripsi",
        ],
      ],
    });
    res.status(200).json(chartStatus);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const GetLineChartPerwalian = async (req, res) => {
  try {
    const chartStatus = await Mahasiswa.findAll({
      attributes: [
        "angkatan",
        [Sequelize.fn("COUNT", Sequelize.col("nim")), "jumlah"],
      ],
      where: {
        kode_wali: req.params.kode_wali,
      },
      group: "angkatan",
    });
    res.status(200).json(chartStatus);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetBarChartStatusMhs = async (req, res) => {
  try {
    const chartStatus = await Mahasiswa.findAll({
      attributes: [
        "angkatan",
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal('CASE WHEN status_mhs = "1" THEN 1 ELSE 0 END')
          ),
          "aktif",
        ],

        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal('CASE WHEN status_mhs = "0" THEN 1 ELSE 0 END')
          ),
          "nonaktif",
        ],
      ],
      group: "angkatan",
    });
    res.status(200).json(chartStatus);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetPieChartStatusMhs = async (req, res) => {
  try {
    const chartStatus = await Mahasiswa.findAll({
      attributes: [[Sequelize.fn("COUNT", Sequelize.col("nim")), "jumlah"]],
      group: "status_mhs",
    });
    res.status(200).json(chartStatus);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetBarChartSkripsi = async (req, res) => {
  try {
    const chartSkripsi = await User.findAll({
      attributes: [
        "angkatan",
        [Sequelize.fn("COUNT", Sequelize.col("angkatan")), "sudah"],
      ],
      include: [
        {
          model: Skripsi,
          attributes: [],
          required: true,
        },
      ],
      where: {
        roles: "1",
      },
      group: "angkatan",
      order: [["angkatan", "asc"]],
    });

    const countMhs = await User.findAll({
      attributes: [
        "angkatan",
        [Sequelize.fn("COUNT", Sequelize.col("nim")), "jumlah"],
      ],
      where: {
        roles: "1",
      },
      group: "angkatan",
      order: [["angkatan", "asc"]],
    });

    res.status(200).json([chartSkripsi, countMhs]);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetBarChartPKL = async (req, res) => {
  try {
    const chartPKL = await User.findAll({
      attributes: [
        "angkatan",
        [Sequelize.fn("COUNT", Sequelize.col("angkatan")), "sudah"],
      ],
      include: [
        {
          model: PKL,
          attributes: [],
          required: true,
        },
      ],
      where: {
        roles: "1",
      },
      group: "angkatan",
      order: [["angkatan", "asc"]],
    });

    const countMhs = await User.findAll({
      attributes: [
        "angkatan",
        [Sequelize.fn("COUNT", Sequelize.col("nim")), "jumlah"],
      ],
      where: {
        roles: "1",
      },
      group: "angkatan",
      order: [["angkatan", "asc"]],
    });

    res.status(200).json([chartPKL, countMhs]);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetCountMhs = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findAll();
    if (!mahasiswa) return res.status(200).json({ msg: 0 });
    res.status(200).json({ msg: mahasiswa.length });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const GetMhsByNIM = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findOne({
      where: {
        nim: req.params.nim,
      },
    });
    res.status(200).json(mahasiswa);
  } catch (error) {
    res.status(500).json({ p: "AAAA", msg: error.message });
  }
};

export const GetAllMhs = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findAll();
    res.status(200).json(mahasiswa);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetAllMhsByKeyword = async (req, res) => {
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
    const mahasiswa = await Mahasiswa.findAll({
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
        status_mhs: {
          [Sequelize.Op.like]: Sequelize.literal(`'%${req.params.status}%'`), // dosen
        },
        angkatan: {
          [Sequelize.Op.like]: Sequelize.literal(`'%${req.params.angkatan}%'`), // dosen
        },
      },
    });

    res.status(200).json(mahasiswa);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateDataMhs = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findOne({
      where: {
        nim: req.params.nim,
      },
    });

    // no student found
    if (!mahasiswa) {
      res.statusMessage = "No student data found.";
      res.status(404).json({ msg: "Data tidak ditemukan" }).end();
      return res;
    }

    // no upload image, no previous image
    if (
      req.files === null &&
      mahasiswa.image === null &&
      mahasiswa.url === null
    ) {
      res.statusMessage = "No student data found.";
      res.status(400).json({ msg: "No Images Uploaded" }).end();
      return res;
    }

    // no upload image, has previous image
    if (
      req.files === null &&
      mahasiswa.image !== null &&
      mahasiswa.url !== null
    ) {
      mahasiswa.tempat_lahir = req.body.tempat_lahir;
      mahasiswa.tgl_lahir = req.body.tgl_lahir;
      mahasiswa.kode_wali = req.body.doswal;
      mahasiswa.alamat = req.body.alamat;
      mahasiswa.provinsi = req.body.provinsi;
      mahasiswa.kota = req.body.kota;
      mahasiswa.kecamatan = req.body.kecamatan;
      mahasiswa.kelurahan = req.body.kelurahan;
      mahasiswa.kodepos = req.body.kodepos;
      mahasiswa.jalur_masuk = req.body.jalur_masuk;
      mahasiswa.no_hp = req.body.kontak;
      try {
        mahasiswa.save();
        res.statusMessage = "Data updated successfully";
        return res.status(200).json({ msg: "Data updated successfuly" });
      } catch (error) {
        return error.message;
      }
    }

    // has upload image
    const file = req.files.file;
    const fileSize = file.size;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];
    if (!allowedType.includes(ext.toLowerCase())) {
      res.statusMessage = "File must be .jpg, .jpeg, or .png";
      res.status(422).json({ msg: "File must be .jpg, .jpeg, or .png" }).end();
      return res;
    }
    if (fileSize > 5000000) {
      res.statusMessage = "Maximum image size is 5MB";
      res.status(422).json({ msg: "Maximum image size is 5MB" }).end();
      return res;
    }

    mahasiswa.image = fileName;
    mahasiswa.url = url;
    mahasiswa.tempat_lahir = req.body.tempat_lahir;
    mahasiswa.tgl_lahir = req.body.tgl_lahir;
    mahasiswa.kode_wali = req.body.doswal;
    mahasiswa.alamat = req.body.alamat;
    mahasiswa.provinsi = req.body.provinsi;
    mahasiswa.kota = req.body.kota;
    mahasiswa.kecamatan = req.body.kecamatan;
    mahasiswa.kelurahan = req.body.kelurahan;
    mahasiswa.kodepos = req.body.kodepos;
    mahasiswa.jalur_masuk = req.body.jalur_masuk;
    mahasiswa.no_hp = req.body.kontak;

    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        mahasiswa.save();
        res.status(200).json({ msg: "Data updated successfuly" });
      } catch (error) {
        console.log(error.message);
      }
    });
  } catch (error) {
    console.log(req);
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};
