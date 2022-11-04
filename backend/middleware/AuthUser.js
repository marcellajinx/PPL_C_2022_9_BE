import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  console.log(999991);
  console.log(req.session);
  if (!req.session.userId) {
    console.log("401 err mohon");
    return res.status(401).json({ msg: "Mohon login ke akun Andas!" });
  }
  const user = await User.findOne({
    where: {
      id_user: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  req.userId = user.id_user;
  req.role = user.roles;
  next();
};

export const dosenOnly = async (req, res, next) => {
  console.log("dosenonly");
  const user = await User.findOne({
    where: {
      id_user: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  if (user.roles !== "2")
    return res.status(403).json({ msg: "Akses terlarang" });
  next();
};

export const mhsOnly = async (req, res, next) => {
  console.log("mhsonly");
  const user = await User.findOne({
    where: {
      id_user: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  if (user.roles !== "1")
    return res.status(403).json({ msg: "Akses terlarang" });
  next();
};

export const adminOnly = async (req, res, next) => {
  console.log("admonly");
  console.log(999);
  console.log(req.session);
  const user = await User.findOne({
    where: {
      id_user: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  if (user.roles !== "4")
    return res.status(403).json({ msg: "Akses terlarang" });
  next();
};

export const deptOnly = async (req, res, next) => {
  console.log("deptonly");
  const user = await User.findOne({
    where: {
      id_user: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  if (user.roles !== "3")
    return res.status(403).json({ msg: "Akses terlarang" });
  next();
};

export const adminDeptOnly = async (req, res, next) => {
  console.log("admdptonly");
  console.log(req.session);
  const user = await User.findOne({
    where: {
      id_user: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  if (user.roles !== "3" && user.roles !== "4")
    return res.status(403).json({ msg: "Akses terlarang" });
  next();
};

export const restrictMhs = async (req, res, next) => {
  console.log("rstrmhs");
  const user = await User.findOne({
    where: {
      id_user: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  if (user.roles === "1")
    if (user.nim !== req.session.nim) {
      return res.status(403).json({ msg: "Akses terlarang" });
    }
  next();
};

// export const mhsUpdatedDataOnly = asycnc(req, res, next) => {
//     const user = await User.findOne({
//         where: {
//             nim: req.session.nim
//         }
//     });
//     if(!user) return res.status(403).json({msg: "Akses terlarang"});
//     next();
// }
