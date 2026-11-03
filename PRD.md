# PRD: Demo Dashboard Sistem Administrasi — Nalar Solusi Digital

> Dokumen ini adalah brief lengkap untuk membangun DEMO DASHBOARD Sistem Administrasi dalam SATU sesi Antigravity.
> Paste seluruh isi dokumen ini sebagai prompt. Jangan tambahkan konteks repo lain.

## 1. Tujuan

Membangun dashboard demo interaktif yang menunjukkan ke calon klien seperti apa **Sistem Administrasi** buatan Nalar Solusi Digital: pencatatan order, data pelanggan, dan status pembayaran dalam satu tempat. Demo ini dipakai tim sales saat presentasi dan di-link dari website utama Nalar.

**Bukan** sistem beneran — semua data fiktif dan wajib diberi label DEMO yang jelas.

## 2. Bisnis Fiktif Demo

- **Nama:** Berkah Jaya Konveksi (fiktif)
- **Alasan:** konveksi = order banyak, pelanggan berulang, DP/pelunasan — kasus paling pas untuk menunjukkan nilai sistem administrasi.
- **Aturan keras:** TIDAK boleh ada testimoni palsu, TIDAK boleh ada klaim kinerja ("naik 200%" dsb). Semua angka = data contoh.

## 3. Tech Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS.
- Data: file JSON statis di `data/demo.json` + state di localStorage untuk aksi tambah/ubah (cukup untuk demo; TIDAK perlu database).
- Mode demo: SATU tombol "Masuk sebagai Demo" di halaman login — tanpa username/password beneran. TIDAK ada auth asli.
- Deploy: Vercel.

## 4. Struktur & Fitur (MVP Demo)

### 4a. Banner DEMO (wajib, sticky, semua halaman)
"Ini adalah DEMO oleh Nalar Solusi Digital — data fiktif." + tombol "Mau sistem seperti ini?" → link WA Nalar (`https://wa.me/6281529964902?text=...`).

### 4b. Halaman Login (`/login`)
- Kartu sederhana: logo/nama fiktif + tombol besar "Masuk sebagai Demo". Keterangan kecil: "Tidak perlu akun — ini mode demo."

### 4c. Dashboard (`/`)
Kartu ringkasan (angka dari data dummy):
1. Total order bulan ini
2. Order belum bayar (butuh follow-up!) — highlight
3. Total pemasukan bulan ini
4. Pelanggan aktif
- Tabel "Order terbaru" (5 baris): tanggal, pelanggan, item, total, status bayar (badge warna: Lunas hijau / DP kuning / Belum Bayar merah).

### 4d. Data Order (`/orders`)
- Tabel lengkap: tanggal, no. order, pelanggan, item + jumlah, total, status bayar, status produksi (Baru/Diproses/Selesai).
- Filter: by status bayar + search nama pelanggan (client-side).
- Tombol "Tambah Order" → form modal (pelanggan, item, jumlah, harga, DP) → tersimpan di localStorage, muncul di tabel + dashboard.
- Aksi per baris: ubah status bayar (Belum → DP → Lunas), ubah status produksi.

### 4e. Data Pelanggan (`/customers`)
- Tabel: nama, kontak (WA), total order, total belanja, order terakhir.
- Klik baris → drawer detail: riwayat order pelanggan itu.

### 4f. Laporan Sederhana (`/reports`)
- Ringkasan bulanan: total order, pemasukan, piutang (belum bayar) — kartu + satu bar chart sederhana (boleh pakai recharts atau CSS bar manual).
- Daftar "yang perlu difollow-up": order dengan status Belum Bayar / DP, urut dari yang terlama.

## 5. Data Dummy (`data/demo.json`)

- 8 pelanggan fiktif (nama Indonesia realistis, nomor WA fiktif format 08xx).
- 20 order fiktif tersebar 2 bulan terakhir, campuran status (Lunas/DP/Belum Bayar) dan status produksi.
- Item: jenis konveksi (Kemeja, Kaos Sablon, Jaket, Seragam) + jumlah + harga realistis.

## 6. Desain

- **Identitas visual = dashboard netral profesional** (putih + abu + aksen navy Nalar `#1E2B4B`; badge status berwarna). Ini tools internal, bukan etalase — jadi fungsional > dekoratif.
- Banner DEMO + CTA Nalar boleh pakai teal/navy Nalar.
- Sidebar navigasi: Dashboard, Order, Pelanggan, Laporan. Responsif (sidebar jadi bottom-nav atau hamburger di HP).
- Bahasa Indonesia, ejaan benar.

## 7. Non-Goals (JANGAN dikerjakan)

- Tidak ada auth beneran / multi-user / roles.
- Tidak ada backend/database (localStorage cukup).
- Tidak ada invoice PDF / cetak (boleh jadi backlog, bukan MVP).
- Tidak ada testimoni / klaim palsu.
- Tidak ada harga jasa Nalar di mana pun.

## 8. Acceptance Criteria

- [ ] Banner DEMO selalu terlihat di semua halaman (termasuk login).
- [ ] "Masuk sebagai Demo" langsung masuk tanpa kredensial.
- [ ] Dashboard: 4 kartu angka konsisten dengan data dummy; tabel 5 order terbaru benar.
- [ ] Tambah order via modal → muncul di tabel orders + angka dashboard berubah.
- [ ] Ubah status bayar/produksi per baris → tersimpan (refresh tidak hilang via localStorage).
- [ ] Filter + search di halaman orders berfungsi.
- [ ] Halaman reports: piutang = jumlah order Belum Bayar + DP yang belum lunas; daftar follow-up urut terlama.
- [ ] Responsif penuh di 360px (HP) dan desktop.
- [ ] Tidak ada teks "lorem ipsum" tersisa.

## 9. Env / Config

- Tulis HANYA NAMA variabel bila butuh (contoh: `NEXT_PUBLIC_WA_NUMBER`), JANGAN tulis nilainya di kode/dokumen.
