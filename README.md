# Leadr — AI Crisis Decision & Leadership Simulator

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-Multi--Model_Cascade-4285F4?logo=google&logoColor=white)

**Leadr** adalah simulator pengambilan keputusan krisis dan evaluasi kepemimpinan interaktif berbasis kecerdasan buatan (*AI Crisis Decision & Leadership Simulator*). Dirancang menyerupai ruang koordinasi tim nyata (*real-time crisis chatroom*), Leadr menempatkan pengguna sebagai **Ketua Tim / Project Lead** yang harus memimpin anggota tim ber-AI melewati krisis tenggat waktu, konflik internal, kelelahan fisik (*burnout*), hingga krisis kepercayaan.

Berbeda dari kuis kepemimpinan pilihan ganda konvensional, Leadr menggabungkan **percakapan multi-aktor dinamis** dengan **mesin skoring psikometrik ilmiah** berbasis ekstraksi fitur perilaku (**Walsh et al., 2025**) dan matriks 4 dimensi *Behaviorally Anchored Rating Scales* (**Arthur et al., 2003, 2008**).

---

## Daftar Isi

- [Latar Belakang & Masalah yang Diselesaikan](#latar-belakang--masalah-yang-diselesaikan)
- [Fitur Utama](#fitur-utama)
- [4 Domain Krisis & Skenario](#4-domain-krisis--skenario)
- [Metodologi Skoring & Landasan Ilmiah](#metodologi-skoring--landasan-ilmiah)
- [Arsitektur Teknis](#arsitektur-teknis)
- [Struktur Proyek](#struktur-proyek)
- [Panduan Instalasi & Menjalankan Lokal](#panduan-instalasi--menjalankan-lokal)
- [Dokumentasi API](#dokumentasi-api)

---

## Latar Belakang & Masalah yang Diselesaikan

1. **Ketiadaan Ruang Latihan Krisis yang Aman (*Safe Practice Environment*)**  
   Banyak ketua organisasi, mahasiswa, atau *project manager* pemula langsung memimpin tim tanpa pernah berlatih menghadapi krisis nyata (anggota *ghosting*, dana tertahan, konflik faksi). Leadr berfungsi sebagai *"Flight Simulator"* kepemimpinan tanpa risiko merugikan proyek atau tim nyata.
2. **Kelemahan Studi Kasus Pasif & Pilihan Ganda**  
   Kuis kepemimpinan tradisional menyediakan opsi A/B/C/D yang mudah ditebak. Leadr menuntut pengguna menyusun sendiri kalimat instruksi, delegasi, negosiasi, dan empati dari nol di tengah tekanan *chat* yang terus berjalan.
3. **Bias Kosakata & *Prompt Gaming* pada Evaluasi AI Konvensional**  
   Penilaian LLM langsung (*direct scoring*) sering tertipu oleh kalimat panjang atau kosakata formal tanpa solusi konkret. Leadr menerapkan **Feature-Extraction Pipeline (Walsh et al., 2025)** di mana AI bertindak sebagai *Behavioral Auditor* yang memverifikasi bukti kalimat operasional nyata dan kebal terhadap *prompt injection*.
4. **Pencegahan *Dimension Collapse / Halo Effect***  
   Mengacu pada riset **Arthur et al. (2003, 2008)**, Leadr memisahkan penilaian secara tegas ke dalam **4 Klaster Dimensi Inti** (*Komunikasi*, *Empati*, *Ketegasan*, dan *Manajemen Krisis*) agar kekuatan dan kelemahan pemimpin terpetakan secara presisi.

---

## Fitur Utama

- **Randomized Crisis Domains**: Domain krisis diacak secara otomatis di awal sesi agar pengguna selalu diuji pada situasi dan dinamika lingkungan yang berbeda.
- **Live Multi-Actor Team Chat & `@Tag` Mention**: Anggota tim AI memiliki kepribadian, sisa jam tidur, stamina (`0–100%`), *mood*, dan *jobdesk* unik. Pengguna dapat men-tag anggota tertentu (misal `@Dimas`, `@Rani`, `@Fikri`) untuk meminta pertanggungjawaban atau mendelegasikan tugas spesifik.
- **Real-Time Team State & Buff/Debuff Engine**:
  - **Target Progress (`0–100%`)**: Proyek tuntas (**Victory**) saat mencapai `100%`.
  - **Team Morale & Team Trust (`0–100%`)**: Jika salah satu jatuh ke `0%`, tim mengalami *Mental Breakdown* atau *Resign Massal* (**Fatal Collapse**).
  - **Synergy Buff**: Aktif otomatis saat `Morale >= 75%` dan `Trust >= 75%` (memberikan akselerasi **+50% laju progres**).
  - **Burnout Debuff**: Aktif saat `Morale < 40%` (menimbulkan penalti **-50% laju progres**).
- **Dual-Layer Leadership Evaluation**:
  - Evaluasi kontekstual 4 dimensi (`1–10`), Skor Komposit Akhir (`0–100`), dan **Rank Tier (`S`, `A`, `B`, `C`, `D`)**.
  - **Evaluasi Ilmiah Tambahan (BARS & Feature Extraction)** lengkap dengan bukti kutipan kalimat (*verbatim evidence*) dan umpan balik deterministik.
- **Multi-Model Automatic Cascade Failover**:
  - Beralih otomatis dari `gemini-3.8-flash` $\to$ `gemini-flash-latest` $\to$ `gemini-3.1-flash-lite` $\to$ *Contextual Heuristic Engine* apabila kuota API habis (`HTTP 429`) atau tanpa koneksi internet.
- **Leadership History Dashboard**: Menyimpan rekam jejak seluruh sesi simulasi, statistik tingkat kemenangan (*win rate*), rata-rata skor, dan filter per domain.

---

## 4 Domain Krisis & Skenario

| Domain | Konteks Krisis Utama | Aktor Tim AI |
| :--- | :--- | :--- |
| **Tech Startup** (*Hackathon & Sprint*) | H-2 Demo Day, *backend developer* menghilang karena *charger* laptop meledak, desainer UI/UX menangis akibat *burnout* kurang tidur, dan server *staging* bermasalah. | **Dimas** (Backend), **Rani** (UI/UX), **Sekar** (Humas), **Bayu** (QA & Cloud) |
| **Kampus / BEM** (*Event Akbar*) | H-1 konser festival 5.000 penonton, pencairan sponsor Rp25 juta tertahan, vendor panggung mematikan genset, dan izin keamanan terancam dicabut. | **Sarah** (Humas), **Fajar** (Bendahara), **Maya** (Logistik), **Budi** (Keamanan) |
| **Corporate Agency** (*Enterprise UAT*) | Klien perbankan menuntut perubahan *scope* ekstrem beberapa jam sebelum UAT, sementara *lead architect* dan tim *engineer* mengancam mogok kerja. | **Kevin** (Lead Architect), **Amanda** (Account Mgr), **Reza** (Creative), **Tania** (DevOps) |
| **Drama Sosial** (*Rare Crisis*) | Tuduhan viral di media sosial bahwa kas Rp15 juta dipakai pribadi. Fakta konsisten: dipakai wakil ketua untuk dana talangan darurat vendor divisi lain tanpa izin bendahara. | **Fikri** (Wakil Ketua), **Dita** (Bendahara), **Rio** (Koor Lapangan), **Nadia** (Media PR) |

---

## Metodologi Skoring & Landasan Ilmiah

Selain skoring permainan utama, Leadr menyertakan modul **Evaluasi Ilmiah Tambahan** yang menggabungkan:

1. **Walsh et al. (2025) — *Feature-Extraction Pipeline***:  
   LLM bertindak sebagai *Behavioral Auditor* yang mendeteksi kehadiran indikator perilaku spesifik (`present: true/false` beserta kutipan bukti `evidence`) tanpa memberikan angka global yang bias.
2. **Arthur et al. (2003, 2008) — *4-Dimension BARS Matrix***:  
   Skor tiap dimensi dihitung secara deterministik menggunakan rumus:

$$\text{Skor Dimensi } (D) = \text{Base } (60) + \sum (w_i \times I_{\text{pos}}) - \sum (w_j \times I_{\text{neg}})$$

| Dimensi | Indikator Positif (`+w`) | Indikator Negatif (`-w`) |
| :--- | :--- | :--- |
| **Manajemen Krisis** | `CRISIS_TRIAGE` (`+25`), `RISK_CONTAINMENT` (`+15`) | `PASSIVE_BLAME` (`-30`) |
| **Komunikasi** | `CLEAR_DELEGATION` (`+20`), `TRANSPARENT_CONTEXT` (`+20`) | `VAGUE_INSTRUCTION` (`-15`) |
| **Empati / EQ** | `CHECK_WELLBEING` (`+20`), `PSYCHOLOGICAL_SAFETY` (`+20`) | `HOSTILE_DISMISSAL` (`-30`) |
| **Ketegasan** | `TAKE_ACCOUNTABILITY` (`+20`), `TIMEBOUND_CHECKPOINT` (`+20`) | `AVOIDANT_DELAY` (`-20`) |

---

## Arsitektur Teknis

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Vite, Lucide Icons, Web Audio API Synthesizer.
- **Backend**: Node.js, Express, TypeScript ESM.
- **AI Integration**: Google Gen AI SDK (`@google/genai`) dengan JSON Schema terstruktur & *Multi-Model Failover*.

---

## Struktur Proyek

```text
Leadr/
├── server.ts                         # Express API Server & Vite Middleware
├── package.json                      # Konfigurasi dependensi & script
├── .env.example                      # Template variabel environment
├── LAPORAN_PROYEK_LEADR.md           # Dokumentasi teknis & laporan lengkap proyek
└── src/
    ├── App.tsx                       # Root aplikasi, manajemen state & ErrorBoundary
    ├── api.ts                        # Client HTTP wrapper
    ├── types.ts                      # Kontrak tipe data TypeScript
    ├── index.css                     # Design tokens & skala tipografi 4 tingkat
    ├── components/
    │   ├── Landing.tsx               # Layar beranda & pengenalan misi
    │   ├── ChatPanel.tsx             # Ruang chat krisis, @Tagging & input instruksi
    │   ├── StatePanel.tsx            # Monitor Progress, Morale, Trust & Stamina tim
    │   ├── RadarCard.tsx             # Visualisasi SVG Radar 4 Dimensi
    │   ├── ResultScreen.tsx          # Rapor akhir, Skor BARS & rincian putaran
    │   └── DashboardScreen.tsx       # Dashboard analitik & riwayat sesi
    └── server/
        ├── seeds.ts                  # Bank skenario 4 domain & profil karakter
        ├── engine.ts                 # Kalkulasi state, milestone & final score
        ├── scientificScoring.ts      # Engine BARS Walsh et al. & Arthur et al.
        ├── gemini.ts                 # Orkestrator Gemini API & model failover
        ├── prompts.ts                # System prompt & contextual fallback engine
        └── store.ts                  # Penyimpanan sesi & riwayat in-memory
```

---

## Panduan Instalasi & Menjalankan Lokal

### Prasyarat
- **Node.js** versi 20 atau lebih baru (direkomendasikan Node.js LTS).

### Langkah-langkah

1. **Clone repositori**
   ```bash
   git clone https://github.com/Privanxi/Leadr.git
   cd Leadr
   ```

2. **Instal dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable (Opsional)**
   Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Masukkan kunci API Google Gemini Anda pada file `.env`:
   ```env
   GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
   ```
   > **Catatan**: Jika `GEMINI_API_KEY` dikosongkan atau tidak diisi, aplikasi tetap berjalan penuh menggunakan *Contextual Heuristic Engine* dan *Deterministic BARS Scoring Engine*.

4. **Jalankan server pengembangan**
   ```bash
   npm run dev
   ```

5. **Buka aplikasi di browser**  
   Akses **http://localhost:3000**

---

## Dokumentasi API

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Memeriksa status server, mode evaluasi, dan kandidat model aktif. |
| `GET` | `/api/domains` | Mengambil daftar domain krisis beserta metadata. |
| `POST` | `/api/session/start` | Memulai sesi simulasi baru dengan domain acak atau pilihan. |
| `POST` | `/api/session/:id/respond` | Mengirim instruksi ketua, menerima balasan tim, update *state*, dan audit BARS. |
| `POST` | `/api/session/:id/next` | Melanjutkan ke eskalasi skenario berikutnya dalam sesi aktif. |
| `GET` | `/api/session/:id/result` | Mengambil rapor akhir, narasi reflektif, rekomendasi, dan laporan ilmiah BARS. |
| `GET` | `/api/history` | Mengambil seluruh riwayat sesi simulasi yang tersimpan. |
| `DELETE` | `/api/history` | Menghapus daftar riwayat simulasi. |
