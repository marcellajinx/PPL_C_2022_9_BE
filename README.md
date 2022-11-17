## Usage

- Clone atau download repositori
- Install dependency dengan eksekusi perintah `npm i` pada command line
- Install dependency nodemon dengan `npm i -g nodemon` pada direktori /backend
- Pastikan server MySQL sudah berjalan dan ketiga database sudah terkoneksi
- Jalankan script `nodemon index` pada direktori /backend
- End point dapat diakses pada http://localhost:5000 

## Database Config
- Terdapat tiga db (tappl, db_wilayah, db_kodepos)
- Pada ketiga file dalam direktori /backend/config, sesuaikan konfigurasi username dan password
- Menggunakan versi MySQL80

## Port Config
- Jika port `localhost:5000` tidak dapat dipakai, ganti pada ./backend/.env
- Sesuaikan port pada semua file dalam repositori Frontend
