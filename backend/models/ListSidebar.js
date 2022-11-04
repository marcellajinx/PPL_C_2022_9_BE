const listAdm = [
  {
    title: "Dashboard",
    src: "https://iili.io/DgAwl4.png",
    url: "/dashboard",
  },
  {
    title: "Data Mahasiswa",
    src: "https://iili.io/DgAvO7.png",
    url: "/adm/data-mhs",
  },
  {
    title: "Data Dosen",
    src: "https://iili.io/DgAjff.png",
    url: "/adm/data-dsn",
  },
  {
    title: "Profile",
    src: "https://iili.io/DgAWVs.png",
    url: "/adm/profile",
  },
  {
    title: "Tambah User",
    src: "https://iili.io/DgA6fj.png",
    url: "/user/add",
  },
];
const listDsn = [
  {
    title: "Dashboard",
    src: "https://iili.io/DgAwl4.png",
    url: "/dashboard",
  },
  {
    title: "Data Mahasiswa",
    src: "https://iili.io/DgAvO7.png",
    url: "/dosen/data-mhs",
  },
  {
    title: "PKL",
    src: "https://iili.io/DgA8b9.png",
    url: "/dosen/pkl",
  },
  {
    title: "Skripsi",
    src: "https://iili.io/DgAP0x.png",
    url: "/dosen/skripsi",
  },
  {
    title: "Verifikasi Data",
    src: "https://iili.io/DgA6fj.png",
    url: "#",
    child: [
      {
        title: "Verifikasi IRS",
        url: "/dosen/verifikasi/irs",
      },
      {
        title: "Verifikasi KHS",
        url: "/dosen/verifikasi/khs",
      },
      {
        title: "Verifikasi PKL",
        url: "/dosen/verifikasi/pkl",
      },
      {
        title: "Verifikasi Skripsi",
        url: "/dosen/verifikasi/skripsi",
      },
    ],
  },
];
const listMhs = [
  {
    title: "Dashboard",
    src: "https://iili.io/DgAwl4.png",
    url: "/dashboard",
  },
  {
    title: "Data",
    src: "https://iili.io/DgAWVs.png",
    url: "/data",
  },
  {
    title: "IRS",
    src: "https://iili.io/DgAXiG.png",
    url: "/irs",
  },
  {
    title: "KHS",
    src: "https://iili.io/DgANUl.png",
    url: "/khs",
  },
  {
    title: "PKL",
    src: "https://iili.io/DgA8b9.png",
    url: "/pkl",
  },
  {
    title: "Skripsi",
    src: "https://iili.io/DgAP0x.png",
    url: "/skripsi",
  },
];

const listDept = [
  {
    title: "Dashboard",
    src: "https://iili.io/DgAwl4.png",
    url: "/dashboard",
  },
  {
    title: "Data Mahasiswa",
    src: "https://iili.io/DgAWVs.png",
    url: "/dept/data-mhs",
  },
  {
    title: "Data Dosen",
    src: "https://iili.io/DgAjff.png",
    url: "/dept/data-dsn",
  },
];

export { listDsn, listMhs, listAdm, listDept };
