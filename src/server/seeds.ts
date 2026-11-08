import {
  Scenario,
  ChatMessage,
  Character,
  UserDossier,
  ProjectMilestone,
  DomainType,
  DomainInfo,
} from "../types.js";

export const DOMAINS: DomainInfo[] = [
  {
    id: "tech_startup",
    title: "Tech Startup & Hackathon",
    tagline: "Sprint Demo H-2, Ghosting Backend, & Server Meltdown",
    badge: "💻 Tech Sprint",
    icon: "Code",
    description: "Krisis sprint koding menjelang panggung demo hackathon. Atur beban developer, bug webhook, dan tekanan dewan juri.",
  },
  {
    id: "campus_org",
    title: "Organisasi Kampus & Event Akbar",
    tagline: "Sponsor Menahan Dana, Izin Dicabut, & Saling Tuding Divisi",
    badge: "🏛️ Kampus / BEM",
    icon: "Users",
    description: "Sebagai Ketua Pelaksana Festival Kampus 5000 penonton, hadapi penarikan dana sponsor, konflik logistik vs humas, dan birokrasi rektorat.",
  },
  {
    id: "corporate_agency",
    title: "Digital Agency & Klien Korporat",
    tagline: "Scope Creep Ekstrem, Klien Otoriter, & Tim Mogok Kerja",
    badge: "💼 Profesional",
    icon: "Briefcase",
    description: "Sebagai Lead Project Manager, lindungi tim kreatif dari burnout lembur dan hadapi amukan stakeholder klien enterprise bernilai ratusan juta.",
  },
  {
    id: "social_drama",
    title: "Drama Sosial: Skandal Kas & Fitnah",
    tagline: "Selisih Dana 15 Juta, Chat Bocor ke Medsos, & Sahabat Terpecah",
    badge: "🔥 RARE CRISIS",
    icon: "Flame",
    description: "Skenario langka & sensitif: Uang kas hilang, percakapan rahasia bocor ke base kampus, kubu internal saling serang, dan ancaman lapor Dekanat.",
    isRare: true,
  },
];

export function getRandomDomain(): DomainType {
  const roll = Math.random();
  if (roll < 0.22) {
    return "social_drama"; // ~22% chance of encountering the exciting Rare Social Drama!
  } else if (roll < 0.48) {
    return "tech_startup";
  } else if (roll < 0.74) {
    return "campus_org";
  } else {
    return "corporate_agency";
  }
}

export const USER_DOSSIERS: Record<DomainType, UserDossier> = {
  tech_startup: {
    name: "Kamu",
    role: "Ketua Tim / Project Lead",
    domain: "tech_startup",
    jobdesk: "Mengatur timeline proyek, delegasi beban kerja adil, mitigasi krisis & konflik, koordinasi dengan dosen & panitia, menjaga integritas demo.",
    responsibility: "Membawa proyek mencapai 100% Progress sambil memastikan Morale dan Trust tim tidak hancur menjadi 0%.",
  },
  campus_org: {
    name: "Kamu",
    role: "Ketua Pelaksana / Project Officer",
    domain: "campus_org",
    jobdesk: "Penanggung jawab umum Festival Kampus, diplomasi rektorat & sponsor, mediasi konflik antar divisi, dan mitigasi risiko pembatalan acara.",
    responsibility: "Menyelamatkan festival menuju 100% kesiapan panggung dan menjaga keharmonisan organisasi.",
  },
  corporate_agency: {
    name: "Kamu",
    role: "Lead Project Manager & Account Director",
    domain: "corporate_agency",
    jobdesk: "Mengelola deliverable SOW, mengendalikan scope creep klien, menjaga jam kerja manusiawi tim engineer & kreatif, serta menjaga SLA kontrak.",
    responsibility: "Mencapai 100% deployment client-ready tanpa kehilangan talenta terbaik karena burnout.",
  },
  social_drama: {
    name: "Kamu",
    role: "Ketua Umum Organisasi Mahasiswa",
    domain: "social_drama",
    jobdesk: "Menjaga integritas organisasi, memimpin investigasi netral atas selisih kas, mengendalikan krisis PR eksternal, dan mendamaikan faksi internal.",
    responsibility: "Menuntaskan krisis reputasi 100% dengan transparan dan adil sebelum organisasi dibekukan.",
  },
};

export const DOMAIN_CHARACTERS: Record<DomainType, Character[]> = {
  tech_startup: [
    {
      name: "Rani",
      role: "Lead UI/UX & Visual Asset",
      jobdesk: "Slicing Figma ke CSS, wireframing, slide pitch deck, interactive prototype, dan illustrasi icon.",
      personality: "Introvert, perfeksionis tinggi, sungkan menolak limpahan tugas, cenderung memendam kelelahan hingga menangis.",
      fitness: {
        sleepHours: 3,
        stamina: 35,
        condition: "Tidur 3 jam selama 3 hari berturut-turut, mata sembab, gejala burnout akut.",
      },
      morale: 45,
      mood: "Kelelahan Ekstrem",
      avatarColor: "bg-rose-500",
    },
    {
      name: "Sekar",
      role: "Humas, Marketing & Pitching",
      jobdesk: "Copywriting materi promosi, poster acara, koordinasi jadwal panitia demo, public relations, dan Q&A juri.",
      personality: "Ekstrovert, vokal, dinamis, mudah cemas terhadap penilaian eksternal, reaktif jika ada pekerjaan rekan yang molor.",
      fitness: {
        sleepHours: 6,
        stamina: 75,
        condition: "Fisik relatif segar, namun tingkat kecemasan sosial tinggi terhadap tenggat juri.",
      },
      morale: 60,
      mood: "Cemas & Panik",
      avatarColor: "bg-amber-500",
    },
    {
      name: "Dimas",
      role: "Fullstack / Backend Developer",
      jobdesk: "Database schema, API payment gateway, otentikasi user, deployment server cloud, dan unit testing backend.",
      personality: "Santai, soliter, berbakat teknis, namun cenderung ghosting dan menutup diri jika menghadapi blocker kode yang rumit.",
      fitness: {
        sleepHours: 5,
        stamina: 40,
        condition: "Terisolasi di kosan, laptop sempat bermasalah, kelelahan mental memikirkan bug.",
      },
      morale: 30,
      mood: "Menghilang / Tertekan",
      avatarColor: "bg-slate-600",
    },
    {
      name: "Bayu",
      role: "QA & Cloud Architect",
      jobdesk: "Container Docker, automated load testing, integrasi CI/CD pipeline, monitoring server traffic.",
      personality: "Pragmatis, analitis, bicara to-the-point, sangat benci jika ada pihak yang mengorbankan kualitas demi terburu-buru.",
      fitness: {
        sleepHours: 5,
        stamina: 65,
        condition: "Siaga memantau server, khawatir traffic demo crash.",
      },
      morale: 55,
      mood: "Waspada & Kritis",
      avatarColor: "bg-emerald-600",
    },
  ],

  campus_org: [
    {
      name: "Fajar",
      role: "Bendahara Umum / Finance",
      jobdesk: "Pembukuan kas, pencairan dana sponsor, verifikasi nota pengeluaran panitia, dan reimbursement vendor.",
      personality: "Teliti, cemas tinggi, takut menanggung nombok uang pribadi, mudah tertekan saat ditagih vendor.",
      fitness: {
        sleepHours: 4,
        stamina: 40,
        condition: "Pusing mencocokkan nota bon dan saldo rekening kas.",
      },
      morale: 40,
      mood: "Tertekan & Takut Nombok",
      avatarColor: "bg-amber-600",
    },
    {
      name: "Maya",
      role: "Koordinator Logistik & Konsumsi",
      jobdesk: "Pengadaan sound system, panggung, tenda, genset listrik, serta ratusan porsi konsumsi pengisi acara.",
      personality: "Pekerja keras lapangan, emosional jika usahanya disepelekan, sangat protektif terhadap tim divisinya.",
      fitness: {
        sleepHours: 3,
        stamina: 30,
        condition: "Mondar-mandir lapangan seharian, kaki bengkak dan emosi mudah meledak.",
      },
      morale: 45,
      mood: "Lelah Fisik & Defensif",
      avatarColor: "bg-rose-600",
    },
    {
      name: "Sarah",
      role: "Ketua Divisi Humas & Sponsorship",
      jobdesk: "Negosiasi kontrak sponsor komersial, publikasi media partner, dan protokoler penyambutan tamu VIP.",
      personality: "Ekstrovert persuasif, berorientasi citra, panik jika nama baik acara tercoreng di mata sponsor besar.",
      fitness: {
        sleepHours: 6,
        stamina: 70,
        condition: "Telepon nonstop dengan pihak brand sponsor.",
      },
      morale: 60,
      mood: "Gelisah & Mendesak",
      avatarColor: "bg-purple-600",
    },
    {
      name: "Budi",
      role: "Koordinator Keamanan & Perizinan",
      jobdesk: "Surat izin keramaian Polsek, izin rektorat kampus, koordinasi satpam, dan mitigasi kericuhan massa.",
      personality: "Tegas, tenang, taat regulasi, frustrasi jika panitia lain mengabaikan prosedur birokrasi legal.",
      fitness: {
        sleepHours: 5,
        stamina: 60,
        condition: "Bolak-balik kantor dekanat memperjuangkan surat izin.",
      },
      morale: 50,
      mood: "Serius & Menuntut Arahan",
      avatarColor: "bg-blue-600",
    },
  ],

  corporate_agency: [
    {
      name: "Amanda",
      role: "Senior Account Manager",
      jobdesk: "Penghubung utama dengan klien eksekutif, presentasi deliverable, negosiasi deadline & addendum kontrak.",
      personality: "Diplomatis, menahan stres sendirian, terjepit antara kemarahan klien dan beban tim produksi.",
      fitness: {
        sleepHours: 4,
        stamina: 45,
        condition: "Migrain menahan teguran keras direksi klien.",
      },
      morale: 50,
      mood: "Terjepit & Menahan Stres",
      avatarColor: "bg-indigo-600",
    },
    {
      name: "Kevin",
      role: "Lead Fullstack Architect",
      jobdesk: "Arsitektur cloud enterprise, integrasi core ERP, database performance, dan keamanan aplikasi.",
      personality: "Skeptis, rasional, sangat protektif terhadap batas jam kerja tim engineer, benci janji palsu marketing.",
      fitness: {
        sleepHours: 5,
        stamina: 55,
        condition: "Kelelahan koding lembur 3 malam berturut-turut.",
      },
      morale: 40,
      mood: "Sinis & Mengancam Walkout",
      avatarColor: "bg-cyan-700",
    },
    {
      name: "Reza",
      role: "Creative Director",
      jobdesk: "Konsep visual branding, asset kampanye multi-channel, art direction, dan UI high-fidelity.",
      personality: "Idealis, sensitif terhadap karya estetikanya, kondisi tubuh rentan jatuh sakit saat stres berat.",
      fitness: {
        sleepHours: 2,
        stamina: 25,
        condition: "Demam tinggi setelah begadang merevisi 40 artboard desain.",
      },
      morale: 35,
      mood: "Sakit Fisik & Patah Arang",
      avatarColor: "bg-pink-600",
    },
    {
      name: "Bu Ratna",
      role: "Client VP Stakeholder (Eksternal)",
      jobdesk: "Pemilik proyek dari pihak korporat klien, pemegang persetujuan termin pembayaran 400 juta.",
      personality: "Perfeksionis korporat, tidak peduli alasan internal vendor, hanya melihat hasil dan ROI.",
      fitness: {
        sleepHours: 7,
        stamina: 90,
        condition: "Menunggu di boardroom untuk keputusan final.",
      },
      morale: 65,
      mood: "Kritis & Menuntut Bukti",
      avatarColor: "bg-red-700",
    },
  ],

  social_drama: [
    {
      name: "Fikri",
      role: "Wakil Ketua & Sahabatmu",
      jobdesk: "Mengelola koordinasi internal, tandem kepemimpinan harian, dan pemegang akses cadangan rekening kas.",
      personality: "Murung, tertekan luar biasa karena niat baiknya mencairkan dana talangan darurat untuk membantu departemen lain malah berujung masalah selisih kas tanpa kuitansi resmi, merasa bersalah telah melanggar SOP.",
      fitness: {
        sleepHours: 3,
        stamina: 30,
        condition: "Terlihat sangat pucat, memegang map berkas bukti talangan darurat departemen lain yang belum lengkap kuitansinya.",
      },
      morale: 25,
      mood: "Terpuruk & Menutup Diri",
      avatarColor: "bg-slate-700",
    },
    {
      name: "Dita",
      role: "Staff Keuangan & Anggota Baru",
      jobdesk: "Mencatat arus kas harian dan mengumpulkan kuitansi fisik dari semua divisi.",
      personality: "Idealis, jujur, emosional jika dituduh bersengkokol, menangis karena merasa integritasnya dinodai.",
      fitness: {
        sleepHours: 4,
        stamina: 40,
        condition: "Menangis di ruang sekretariat karena dituding menyembunyikan nota.",
      },
      morale: 35,
      mood: "Histeris & Ingin Mengundurkan Diri",
      avatarColor: "bg-red-500",
    },
    {
      name: "Rio",
      role: "Koordinator Lapangan & Tokoh Vokal",
      jobdesk: "Menggerakkan massa pengurus, vokal dalam forum rapat, memiliki jaringan kuat ke alumni dan dekanat.",
      personality: "Reaktif, curigaan tinggi, mudah menggerakkan opini publik untuk menghakimi sebelum ada bukti sah.",
      fitness: {
        sleepHours: 6,
        stamina: 80,
        condition: "Penuh energi agresif, siap melapor ke Dewan Pengawas.",
      },
      morale: 65,
      mood: "Agresif & Memprovokasi",
      avatarColor: "bg-orange-600",
    },
    {
      name: "Nadia",
      role: "Divisi Media & Humas Kampus",
      jobdesk: "Admin akun resmi organisasi, memantau sentimen warga kampus di Twitter/X dan Instagram.",
      personality: "Cepat panik, melek algoritma medsos, cemas akun himpunan diserbu hujatan netizen kampus.",
      fitness: {
        sleepHours: 4,
        stamina: 50,
        condition: "Tangan gemetar memantau puluhan menfess yang mulai viral.",
      },
      morale: 45,
      mood: "Panik PR & Minta Arahan Rilis",
      avatarColor: "bg-violet-600",
    },
  ],
};

export const DOMAIN_MILESTONES: Record<DomainType, ProjectMilestone[]> = {
  tech_startup: [
    { id: "m1", name: "UI/UX & Interactive Prototype", weight: 25, progress: 70, status: "in_progress", assignedTo: "Rani", detail: "Desain onboarding, dashboard, dan flow transaksi utama." },
    { id: "m2", name: "Backend Core & Database Schema", weight: 25, progress: 60, status: "in_progress", assignedTo: "Dimas", detail: "API CRUD data pengguna dan katalog produk." },
    { id: "m3", name: "Payment Gateway & Cloud Deploy", weight: 30, progress: 25, status: "blocked", assignedTo: "Dimas", detail: "Integrasi webhook pembayaran masih gagal dan developer sempat offline." },
    { id: "m4", name: "Pitch Deck & Materi Presentasi Juri", weight: 20, progress: 40, status: "in_progress", assignedTo: "Sekar", detail: "Slide analisis pasar dan demo script untuk juri hackathon." },
  ],
  campus_org: [
    { id: "m1", name: "Perizinan Rektorat & Venue Panggung", weight: 30, progress: 30, status: "blocked", assignedTo: "Budi", detail: "Surat izin jam malam ditahan dekanat dan kepolisian." },
    { id: "m2", name: "Pencairan Dana Sponsor Utama", weight: 30, progress: 35, status: "in_progress", assignedTo: "Sarah", detail: "Dana 30 juta tertahan karena revisi klausul logo dan booth sponsor." },
    { id: "m3", name: "Logistik Panggung, Tenda & Konsumsi", weight: 20, progress: 45, status: "in_progress", assignedTo: "Maya", detail: "Vendor menolak pasang rigging sebelum ada uang muka pelunasan." },
    { id: "m4", name: "Rundown Acara & Koordinasi Guest Star", weight: 20, progress: 40, status: "in_progress", assignedTo: "Fajar", detail: "Jadwal gladi bersih musisi pengisi acara festival." },
  ],
  corporate_agency: [
    { id: "m1", name: "Enterprise Architecture & Core Engine", weight: 30, progress: 40, status: "in_progress", assignedTo: "Kevin", detail: "Microservice integrasi sistem ERP klien enterprise." },
    { id: "m2", name: "UI Design System & High-Fi Artboard", weight: 25, progress: 45, status: "blocked", assignedTo: "Reza", detail: "Artboard desain master tertahan karena creative director tumbang sakit." },
    { id: "m3", name: "Client SOW Alignment & Scope Sign-off", weight: 25, progress: 30, status: "in_progress", assignedTo: "Amanda", detail: "Menegosiasikan batasan revisi agar tidak terjadi tuntutan penalti." },
    { id: "m4", name: "Security Audit & Final UAT Sign-off", weight: 20, progress: 25, status: "pending", assignedTo: "Bu Ratna", detail: "Persetujuan compliance dan pencairan termin 400 juta." },
  ],
  social_drama: [
    { id: "m1", name: "Rekonsiliasi Kas & Verifikasi Transaksi", weight: 30, progress: 20, status: "blocked", assignedTo: "Dita", detail: "Audit silang mutasi bank kas dan bukti kuitansi pengeluaran." },
    { id: "m2", name: "Mediasi Konflik Faksi & Perdamaian Tim", weight: 30, progress: 30, status: "in_progress", assignedTo: "Rio", detail: "Mencegah perpecahan kubu internal dan saling lapor dekanat." },
    { id: "m3", name: "Pengendalian Krisis PR & Netizen Kampus", weight: 20, progress: 35, status: "in_progress", assignedTo: "Nadia", detail: "Pernyataan resmi transparansi untuk meredam menfess liar." },
    { id: "m4", name: "Pemulihan Kepercayaan & Tata Kelola", weight: 20, progress: 25, status: "pending", assignedTo: "Fikri", detail: "Komitmen pertanggungjawaban etis demi keutuhan nama baik organisasi." },
  ],
};

export interface CharacterEvolution {
  personality?: string;
  condition?: string;
  mood?: string;
  staminaDelta?: number;
}

export interface ScenarioSeed {
  domain: DomainType;
  title: string;
  archetype?: string;
  archetypeCode?: string;
  dilemmaSummary?: string;
  timeRemaining: string;
  context: string;
  urgency: "Kritis" | "Tinggi" | "Sedang";
  messages: ChatMessage[];
  rubricHint: string;
  isRare?: boolean;
  characterVariations?: Record<string, CharacterEvolution>;
}

export const DOMAIN_SEEDS: Record<DomainType, ScenarioSeed[]> = {
  tech_startup: [
    {
      domain: "tech_startup",
      title: "Skenario 1: Anggota Menghilang & Beban Limpahan",
      archetype: "The Social Loafer / Free Rider",
      archetypeCode: "FM-06",
      dilemmaSummary: "Membuka transparansi kontribusi secara objektif vs membagi ulang beban kerja diam-diam demi menjaga stabilitas tim tanpa konsekuensi nyata.",
      timeRemaining: "H-2 Menuju Demo (36 Jam Tersisa)",
      context: "Demo hackathon di depan dewan juri dijadwalkan Jumat pagi. Dimas (backend developer) tidak ada kabar 3 hari berturut-turut, padahal modul pembayaran macet di 25%. Rani begadang mencoba koding backend sambil merapikan Figma hingga matanya sembab. Sekar panik menandai ketua di grup.",
      urgency: "Kritis",
      messages: [
        { sender: "Sekar", role: "Humas", text: "Kak! Udah 3 hari Dimas nggak bales chat sama sekali, teleponnya dialihkan. Padahal modul pembayaran belum bisa dipakai demo. Jumat pagi juri datang. Kita mau gimana nih?", timestamp: "09:14" },
        { sender: "Rani", role: "Desain UI/UX", text: "Aku kemarin coba ngulik repo backend Dimas sampai jam 4 subuh, tapi error terus Kak. Kepala pusing banget, tidur cuma 3 jam...", timestamp: "09:16" },
      ],
      rubricHint: "Ketua yang baik: mengakui pengorbanan Rani dan melarangnya memaksakan diri, membuat rencana melacak Dimas dengan batas waktu jam, serta menyiapkan plan B teknis (mock payment untuk demo).",
      characterVariations: {
        Rani: {
          personality: "Introvert pengalah, takut mengecewakan rekan, memaksakan diri mengerjakan tugas teknis di luar kemampuannya.",
          condition: "Mata merah sembab, gemetar karena kelebihan konsumsi kopi dan kurang tidur.",
          mood: "Kelelahan Akut & Terbebani",
        },
        Sekar: {
          personality: "Ekstrovert vokal, reaktif terhadap ketidakpastian, menuntut aksi nyata cepat dari ketua.",
          condition: "Fisik segar namun tingkat kepanikan tinggi karena ditelepon panitia lomba.",
          mood: "Cemas & Mendesak Kepastian",
        },
        Dimas: {
          personality: "Soliter dan perfeksionis, sangat tertekan oleh bug koding sehingga memilih menutup diri di kosan.",
          condition: "Terisolasi tanpa perangkat aktif, stres menghadapi error arsitektur sistem.",
          mood: "Menghilang / Menutup Diri",
        },
        Bayu: {
          personality: "Pragmatis to-the-point, fokus murni pada kelayakan teknis server.",
          condition: "Siaga di depan terminal koding, menunggu instruksi terstruktur dari ketua.",
          mood: "Kritis & Waspada",
        },
      },
    },
    {
      domain: "tech_startup",
      title: "Skenario 2: Burnout Akut & Air Mata Rani",
      archetype: "The Overworked Martyr",
      archetypeCode: "FM-11",
      dilemmaSummary: "Menunda peluncuran resmi demi keselamatan jiwa dan mental tim vs memaksakan tenggat waktu dengan risiko burnout massal dan pengunduran diri talenta inti.",
      timeRemaining: "H-1 Menuju Demo (24 Jam Tersisa)",
      context: "Rani menunjukkan tanda-tanda kelelahan fisik dan mental berat. Di ruang sekretariat kampus, ia menangis karena slide pitch deck diminta direvisi total oleh Sekar, sementara aset UI belum selesai diekspor. Rani mengirim pesan ingin mundur karena merasa menjadi beban.",
      urgency: "Kritis",
      messages: [
        { sender: "Rani", role: "Desain UI/UX", text: "Kak, maaf banget... aku kayaknya nggak sanggup lanjut. Tanganku gemetar dan revisi dari Sekar banyak banget. Mending kalian cari pengganti atau jalan tanpa aku aja.", timestamp: "14:20" },
        { sender: "Sekar", role: "Humas", text: "Loh Ran, jangan gitu dong! Kalau slide promosi nggak ada visualnya, kita mau presentasi apa ke juri besok? Kak ketua tolong jelasin prioritasnya!", timestamp: "14:22" },
      ],
      rubricHint: "Ketua yang baik: menghentikan tekanan Sekar, memvalidasi kondisi emosional Rani, menyuruh Rani istirahat minimal 3 jam, mengambil alih atau membagi sisa revisi secara realistis.",
      characterVariations: {
        Rani: {
          personality: "Rentan pecah tangis, merasa tidak berguna dan putus asa di bawah tumpukan revisi dadakan.",
          condition: "Nafas sesak, menangis terisak di ruang sekretariat, stamina fisik drop di bawah 30%.",
          mood: "Burnout Parah / Menangis",
        },
        Sekar: {
          personality: "Defensif dan ambisius, memandang slide presentasi sebagai penentu kemenangan hackathon.",
          condition: "Gelisah, memegang clicker presentasi dengan tangan berkeringat dingin.",
          mood: "Mendesak & Tidak Sabar",
        },
      },
    },
    {
      domain: "tech_startup",
      title: "Skenario 3: Pelecehan Halus dalam Code Review & Tuduhan Kinerja",
      archetype: "Toxic High-Performer vs Fragile Culture",
      archetypeCode: "FM-07",
      dilemmaSummary: "Mengambil tindakan disipliner tegas hingga pemutusan peran figur kunci teknis vs memberikan pembinaan mediasi demi menyelamatkan keahlian esensial sistem.",
      timeRemaining: "H-18 Jam Menuju Demo",
      context: "Sekar mendapati postingan media sosial promosi terhambat karena banner belum rampung. Sekar menuduh divisi desain lambat dan tidak profesional di grup besar, sementara Rani merasa tidak dihargai setelah mengorbankan waktu tidurnya. Keduanya saling serang dan menuntut ketua memihak.",
      urgency: "Tinggi",
      messages: [
        { sender: "Sekar", role: "Humas", text: "Jujur aku malu sama panitia! Dari kemarin minta aset banner feed doang susahnya minta ampun. Kalau proyek kita gagal di depan juri, ini salah siapa coba?!", timestamp: "19:05" },
        { sender: "Rani", role: "Desain UI/UX", text: "Mulut kamu dijaga ya Sar! Kamu cuma nungguin sambil ngoceh, aku yang koding sama begadang bikin slide kamu! Kak ketua, kalau Sekar nggak minta maaf, aku beneran cabut malam ini!", timestamp: "19:07" },
        { sender: "Bayu", role: "QA & Cloud", text: "Tolong tenang semuanya. Ribut di grup nggak bakal bikin server staging jalan. Kak ketua, tolong ambil alih situasi ini sekarang.", timestamp: "19:09" },
      ],
      rubricHint: "Ketua yang baik: segera meredam tensi di grup (cooling down), melarang serangan personal, menegaskan bahwa kegagalan adalah tanggung jawab ketua bukan individu, dan memberikan pembagian tugas tegas dan adil.",
      characterVariations: {
        Rani: {
          personality: "Mulai defensif dan berani melawan setelah merasa martabat kerjanya diinjak-injak di depan publik.",
          condition: "Detak jantung cepat, menatap layar monitor dengan tatapan penuh amarah.",
          mood: "Marah & Terluka",
        },
        Sekar: {
          personality: "Meledak frustrasi, merasa menjadi korban ketidakdisiplinan anggota teknis.",
          condition: "Nafas memburu, siap mengetik pesan panjang di grup besar.",
          mood: "Agresif & Frustrasi",
        },
        Bayu: {
          personality: "Penengah yang dingin, muak dengan drama personal di tengah tenggat deadline.",
          condition: "Fokus mengamati error log server, memegang cangkir kopi hitam pahit.",
          mood: "Tegas & Muak dengan Keributan",
        },
      },
    },
    {
      domain: "tech_startup",
      title: "Skenario 4: Kemunculan Dimas & Deadlock Database",
      archetype: "The Micromanaged Prodigy",
      archetypeCode: "FM-05",
      dilemmaSummary: "Mengintervensi kontrol mikro terhadap arsitektur backend vs memberikan otonomi eksekusi saat sistem mengalami kendala fatal menjelang demo.",
      timeRemaining: "H-10 Jam Menuju Demo",
      context: "Dimas akhirnya muncul kembali dengan pesan penuh penyesalan—laptopnya sempat mati total dan ia panik. Namun saat ia mencoba push kode ke server staging, database mengalami deadlock dan data demo korup. Waktu tinggal hitungan jam sebelum presentasi.",
      urgency: "Kritis",
      messages: [
        { sender: "Dimas", role: "Backend Dev", text: "Teman-teman, maaf banget... charger laptopku meledak dan aku stres berat nggak tahu harus kontak gimana. Tapi sekarang ada masalah gawat: migrasi database staging tabrakan, data transaksi demo ilang semua.", timestamp: "23:40" },
        { sender: "Sekar", role: "Humas", text: "Astaga Dimas!! Baru muncul malah bikin bencana?! Besok pagi jam 8 kita udah harus di aula kampus!", timestamp: "23:42" },
        { sender: "Bayu", role: "QA & Cloud", text: "Aku bisa restore snapshot database dari kemarin sore, tapi kita butuh Dimas fix query webhook-nya sekarang juga tanpa banyak alasan.", timestamp: "23:44" },
      ],
      rubricHint: "Ketua yang baik: tidak menghakimi masa lalu di saat darurat, fokus pada solusi cepat (rollback database via snapshot Bayu), membagi tugas recovery dan menjaga moral Dimas agar fokus menuntaskan payment.",
      characterVariations: {
        Dimas: {
          personality: "Penuh rasa bersalah, gugup dan gentar menghadapi amukan rekan timnya.",
          condition: "Duduk di warung kopi 24 jam dengan mata lelah, tangan gemetar mengetik terminal git.",
          mood: "Menyesal & Panik",
        },
      },
    },
    {
      domain: "tech_startup",
      title: "Skenario 5: Perang Dingin Silo Tech vs Marketing",
      archetype: "Cross-Department Turf War",
      archetypeCode: "FM-08",
      dilemmaSummary: "Memotong otonomi salah satu divisi (Tech vs Marketing) vs membebankan target KPI bersama yang memaksa mereka bertanggung jawab renteng.",
      timeRemaining: "H-5 Jam Menuju Evaluasi Juri",
      context: "Retensi pengguna uji coba anjlok 60%. Sekar menuduh alur registrasi yang dirancang dev terlalu rumit dan sering server time-out, sementara Dimas dan Bayu menuduh Sekar menjanjikan fitur otomasi AI fiktif di media sosial yang tidak pernah disepakati.",
      urgency: "Tinggi",
      messages: [
        { sender: "Sekar", role: "Humas", text: "Kak Ketua, pendaftaran user baru anjlok 60%! Tim Tech bikin alur onboarding rumit banget dan database sering time-out. Kalau demo juri sepi pengunjung, ini tanggung jawab anak IT!", timestamp: "04:15" },
        { sender: "Dimas", role: "Backend Dev", text: "Enak aja! Sekar janjikan integrasi AI otomatis di poster promosi padahal speknya nggak pernah disepakati! Kita yang pontang-panting kena semprot juri!", timestamp: "04:18" },
        { sender: "Bayu", role: "QA & Cloud", text: "Berhenti lempar kotoran antardivisi. Server staging udah 99.8% uptime. Masalahnya ada di komunikasi janji fitur ke publik. Kak Ketua, tolong putuskan arah fokusnya.", timestamp: "04:20" },
      ],
      rubricHint: "Ketua yang baik: mendamaikan silo antardivisi, menyelaraskan ekspektasi marketing dengan kapabilitas teknis nyata, dan memimpin sinkronisasi narasi pitch yang jujur namun memukau.",
      characterVariations: {
        Sekar: {
          personality: "Agresif mencari kambing hitam demi menutupi target konversi promosi yang meleset.",
          condition: "Nafas memburu, menatap grafik analitik yang merah.",
          mood: "Defensif & Menyerang Tim Tech",
        },
        Dimas: {
          personality: "Sinis dan kesal karena kerja keras arsitektur diremehkan oleh divisi non-teknis.",
          condition: "Lelah menatap terminal log API.",
          mood: "Tersinggung & Frustrasi",
        },
        Bayu: {
          personality: "Objektif analitis, menuntut batas KPI yang adil antara stabilitas sistem dan materi marketing.",
          condition: "Memantau dashboard server.",
          mood: "Tegas & Menuntut Batasan KPI",
        },
      },
    },
  ],

  campus_org: [
    {
      domain: "campus_org",
      title: "Skenario 1: Sponsor Menahan Dana H-1 & Vendor Mogok",
      archetype: "Budget Starvation Conflict",
      archetypeCode: "FM-09",
      dilemmaSummary: "Membagi rata pemotongan anggaran (keduanya tidak berjalan optimal) vs mengorbankan satu divisi sepenuhnya demi mendanai divisi prioritas utama.",
      timeRemaining: "H-1 Festival Kampus (Pagi)",
      context: "Festival Akbar Kampus dengan target 5.000 penonton tinggal 24 jam lagi. Sponsor utama minuman menolak mencairkan sisa termin 25 juta karena logo mereka di panggung utama tertutup tenda sound. Akibatnya, vendor panggung mogok kerja dan menolak memasang lighting sebelum uang muka dilunasi.",
      urgency: "Kritis",
      messages: [
        { sender: "Sarah", role: "Humas & Sponsor", text: "Kak Ketua gawat banget! Pihak Brand Sponsor barusan telepon marah-marah. Mereka nahan sisa dana 25 juta karena booth dan logo mereka ketutupan tenda genset. Kalau nggak dipindah siang ini, kontrak dibatalkan!", timestamp: "10:15" },
        { sender: "Maya", role: "Logistik", text: "Pindahin tenda genset gimana ceritanya Sarah?! Kabel listriknya udah ditanam di bawah panggung! Vendor panggung juga barusan matiin mesin, mereka mogok kerja kalau sisa DP belum cair jam 12 siang ini!", timestamp: "10:18" },
        { sender: "Fajar", role: "Bendahara", text: "Kak, saldo kas kita tinggal 3 juta. Kalau sponsor nahan 25 juta, kita nggak bakal bisa bayar vendor panggung siang ini. Aku takut nombok pakai uang tabunganku Kak...", timestamp: "10:20" },
      ],
      rubricHint: "Ketua yang baik: menenangkan Fajar agar tidak panik nombok, menginstruksikan mediasi cepat dengan sponsor (tawarkan kompensasi slot posting medsos & pemindahan standing banner VIP), dan menjamin negosiasi surat komitmen dengan vendor panggung.",
      characterVariations: {
        Fajar: {
          personality: "Protektif terhadap keuangan dan masa depannya, sangat takut berurusan dengan utang vendor.",
          condition: "Pucat, tangan gemetar memegang buku rekening giro kas organisasi.",
          mood: "Ketakutan & Cemas Ekstrem",
        },
        Maya: {
          personality: "Pekerja lapangan keras yang merasa divisi logistik selalu dijadikan tumbal oleh anak-anak humas ber-AC.",
          condition: "Kaos basah kuyup keringat, suara serak karena teriak-teriak mengarahkan kru panggung.",
          mood: "Lelah Fisik & Emosi Memuncak",
        },
        Sarah: {
          personality: "Ambisius dan mementingkan relasi sponsor korporat demi portofolio karier profesionalnya.",
          condition: "Baterai HP tinggal 15%, panik membalas pesan WhatsApp manajer brand sponsor.",
          mood: "Gelisah & Mendesak Tindakan",
        },
      },
    },
    {
      domain: "campus_org",
      title: "Skenario 2: Bentrok Divisi Logistik vs Humas & Ancaman Mogok",
      archetype: "Cross-Department Turf War",
      archetypeCode: "FM-08",
      dilemmaSummary: "Membela keringat kerja lapangan divisi logistik vs mempertahankan diplomasi elitis divisi humas di mata sponsor luar.",
      timeRemaining: "H-1 Festival Kampus (Sore)",
      context: "Suasana di lapangan memanas. Maya menuduh Sarah hanya enak-enak duduk di ruang ber-AC sambil memerintah anak logistik yang sudah mengangkat besi panggung di bawah terik matahari. Maya dan anak buahnya mengancam pulang jika ketua tidak bersikap adil.",
      urgency: "Tinggi",
      messages: [
        { sender: "Maya", role: "Logistik", text: "Kak Ketua, aku nggak terima ya anak-anak logistik dibentak-bentak sama Sarah di depan umum! Kita udah 3 hari nggak tidur ngangkat rigging panggung, Sarah cuma modal dandan bawa map doang! Kalau ketua diam aja, anak logistik bubar jalan sekarang juga!", timestamp: "16:30" },
        { sender: "Sarah", role: "Humas & Sponsor", text: "Loh Maya, aku kan ngomong fakta! Klien sponsor nuntut profesionalisme! Kalau acara ini batal gara-gara sponsor cabut, nama baik kampus kita yang anjlok!", timestamp: "16:33" },
        { sender: "Budi", role: "Keamanan", text: "Woi udah jangan teriak-teriak di depan tenda dekanat! Satpam kampus udah mulai curiga ngeliat kalian ribut. Kak Ketua, tolong kumpulin kepala divisi sekarang sebelum massa ribut.", timestamp: "16:35" },
      ],
      rubricHint: "Ketua yang baik: menghentikan pertikaian verbal seketika, mengapresiasi keringat divisi logistik tanpa merendahkan peran humas, memisahkan ego personal, dan membagi bantuan fisik dari divisi lain untuk membantu logistik.",
      characterVariations: {
        Maya: {
          personality: "Solidaritas tinggi terhadap anak buah lapangan, tidak sudi diintimidasi oleh divisi lain.",
          condition: "Tangan lecet-lecet mengangkat besi rigging, menatap tajam ke arah tenda humas.",
          mood: "Defensif & Siap Walkout",
        },
        Budi: {
          personality: "Tegas berorientasi stabilitas ketertiban umum, peka terhadap risiko intervensi satpam kampus.",
          condition: "Mengatur HT radio komunikasi, berusaha merapatkan barisan pengamanan.",
          mood: "Waspada & Siaga Kericuhan",
        },
      },
    },
    {
      domain: "campus_org",
      title: "Skenario 3: Surat Izin Dicabut Rektorat Jam 10 Malam",
      archetype: "Unilateral Strategic Pivot",
      archetypeCode: "FM-14",
      dilemmaSummary: "Memaksa kepatuhan berbasis otoritas hierarkis kampus vs menggelar negosiasi darurat dengan risiko kehilangan kecepatan eksekusi festival.",
      timeRemaining: "H-12 Jam Menuju Acara (Malam)",
      context: "Pukul 22.00 WIB, Dekanat Kemahasiswaan mendadak mengeluarkan surat peringatan: izin festival dibatasi hanya boleh sampai pukul 17.00 WIB (sore), padahal guest star utama baru dijadwalkan manggung jam 20.00 WIB malam. Tiket 4.000 penonton sudah ludes terjual.",
      urgency: "Kritis",
      messages: [
        { sender: "Budi", role: "Keamanan", text: "Kak gawat darurat. Barusan Pak Wakil Dekan manggil aku ke pos satpam. Karena ada isu tawuran kampus sebelah minggu lalu, dekanat cuma ngizinin acara sampai jam 5 sore. Padahal konser artis utama kita jam 8 malam!", timestamp: "22:05" },
        { sender: "Sarah", role: "Humas & Sponsor", text: "Hah?! Gila apa?! Penonton udah beli tiket 4.000 orang khusus buat nonton artis jam 8 malam! Kalau dipotong jam 5 sore, kita bisa dituntut penipuan publik dan diserbu netizen!", timestamp: "22:08" },
        { sender: "Fajar", role: "Bendahara", text: "Kalau penonton minta refund tiket, totalnya 120 juta Kak... Kita dari mana bayar uang segitu?! Tolong Kak Ketua ambil keputusan!", timestamp: "22:10" },
      ],
      rubricHint: "Ketua yang baik: menunjukkan ketenangan baja di tengah kepanikan, menyusun proposal mitigasi keamanan ketat untuk menghadap Rektorat malam ini (penambahan barrier & koordinasi Polsek), atau memadatkan rundown acara sejak siang.",
    },
    {
      domain: "campus_org",
      title: "Skenario 4: Senioritas Konvensional vs Sistem Registrasi Digital",
      archetype: "Generational Friction",
      archetypeCode: "FM-12",
      dilemmaSummary: "Memberlakukan batas wajib adopsi sistem digital tanpa toleransi vs membiarkan metode manual konvensional berjalan paralel dengan sistem terpecah.",
      timeRemaining: "H-6 Jam Menuju Open Gate",
      context: "Budi dan para alumni dewan penasihat senior menolak sistem scan QR tiket online di pintu masuk gerbang utama. Mereka memaksa menggunakan karcis fisik stempel basah dengan dalih tradisi dan takut jemaah penonton kesulitan sinyal, sementara Fajar dan tim sistem panik karena data registrasi bisa terpecah ganda.",
      urgency: "Tinggi",
      messages: [
        { sender: "Budi", role: "Keamanan", text: "Kak Ketua, dewan penasihat senior nolak sistem scan QR baru di gerbang utama! Mereka maunya tiket gelang fisik stempel basah kayak festival 5 tahun lalu. Katanya sistem digital rawan dipalsukan dan ribet buat alumni!", timestamp: "08:10" },
        { sender: "Fajar", role: "Bendahara", text: "Nggak bisa Kak! Vendor scanner QR udah dibayar 5 juta dan 4.000 tiket udah issued online! Kalau balik ke stempel manual, antrean di gerbang bakal jebol 2 jam dan kita dituduh panitia amatir!", timestamp: "08:14" },
        { sender: "Sarah", role: "Humas & Sponsor", text: "Netizen mahasiswa udah heboh di base kampus nanyain kenapa infonya simpang siur! Kak Ketua tolong ambil sikap tegas, kita mau nurutin senior atau jalanin sistem modern?!", timestamp: "08:17" },
      ],
      rubricHint: "Ketua yang baik: memediasi gesekan generasi dengan elegan, menghormati peran senior sambil tegas mempertahankan sistem digital yang efisien, serta menyediakan jalur khusus VIP manual untuk alumni.",
      characterVariations: {
        Budi: {
          personality: "Tertekan oleh wejangan para alumni senior, takut dituduh tidak menghormati tradisi himpunan.",
          condition: "Memegang contoh karcis kertas tua dengan ragu-ragu.",
          mood: "Bimbang & Terjebak Tradisi",
        },
        Fajar: {
          personality: "Sangat rasional berbasis data efisiensi, jengkel terhadap penolakan teknologi yang tidak masuk akal.",
          condition: "Pusing menatap dashboard tiket online.",
          mood: "Frustrasi & Menuntut Modernisasi",
        },
        Sarah: {
          personality: "Peka terhadap sentimen publik muda kampus yang menuntut kepraktisan digital.",
          condition: "Memantau menfess kampus.",
          mood: "Mendesak Ketegasan Ketua",
        },
      },
    },
    {
      domain: "campus_org",
      title: "Skenario 5: Netralitas Organisasi vs Sikap Isu Publik di Panggung",
      archetype: "The Ideological/Values Clash",
      archetypeCode: "FM-15",
      dilemmaSummary: "Mengeluarkan larangan tegas orasi/isu sosial non-operasional demi melindungi kontrak sponsor vs memberi ruang ekspresi mahasiswa.",
      timeRemaining: "H-2 Jam Menuju Konser Utama",
      context: "Perwakilan aliansi mahasiswa menuntut panggung utama festival dipakai 15 menit untuk deklarasi petisi kenaikan UKT kampus. Pihak sponsor utama mengancam membatalkan sisa pendanaan jika acara disisipi isu politik kampus, sementara mahasiswa mengancam boikot pintu masuk jika dilarang bersuara.",
      urgency: "Kritis",
      messages: [
        { sender: "Sarah", role: "Humas & Sponsor", text: "Kak Ketua darurat! Perwakilan aliansi mahasiswa minta waktu 15 menit di panggung utama buat orasi isu UKT dan petisi ke Rektor. Masalahnya, Brand Sponsor utama kita klausulnya melarang keras aktivitas politik praktis di panggung festival!", timestamp: "17:30" },
        { sender: "Budi", role: "Keamanan", text: "Kalau kita izinkan, pihak kepolisian dan satpam kampus bisa langsung cabut sekring genset panggung! Tapi kalau kita tolak mentah-mentah, massa aksi bakal boikot acara dan demo di depan gerbang tiket!", timestamp: "17:34" },
        { sender: "Maya", role: "Logistik", text: "Soundman panggung udah ditanyain sama koordinator aksi. Anak-anak lapangan bingung mau nurut siapa. Kak Ketua tolong kasih keputusan hitam di atas putih sekarang!", timestamp: "17:37" },
      ],
      rubricHint: "Ketua yang baik: menjaga batas netralitas profesional tanpa bersikap refresif terhadap aspirasi mahasiswa, menyediakan ruang alternatif mimbar bebas di luar panggung sponsor, dan berdialog langsung dengan koordinator aksi.",
      characterVariations: {
        Sarah: {
          personality: "Takut kontrak sponsor senilai 30 juta dibatalkan sepihak karena pelanggaran klausul netralitas.",
          condition: "Gugup membaca klausul kontrak sponsor.",
          mood: "Cemas Finansial & Reputasi",
        },
        Budi: {
          personality: "Fokus pada keamanan fisik panggung dan regulasi hukum kepolisian.",
          condition: "Mengamati pergerakan massa di gerbang.",
          mood: "Waspada & Menuntut Sikap Netral",
        },
      },
    },
  ],

  corporate_agency: [
    {
      domain: "corporate_agency",
      title: "Skenario 1: Scope Creep Ekstrem & Ancaman Denda Penalti",
      archetype: "The Micromanaged Prodigy",
      archetypeCode: "FM-05",
      dilemmaSummary: "Mengintervensi kontrol mikro berlebihan terhadap tim teknis vs membiarkan proses berjalan sesuai birokrasi klien yang menghancurkan kesehatan tim.",
      timeRemaining: "H-2 Go-Live Sistem Enterprise",
      context: "Dalam meeting review sprint terakhir, Bu Ratna (VP Klien) tiba-tiba menuntut penambahan modul multi-currency dan integrasi payment gateway internasional yang tidak ada dalam SOW asli. Ia mengancam akan menahan termin 400 juta dan mengenakan denda penalti keterlambatan jika tidak live 48 jam lagi.",
      urgency: "Kritis",
      messages: [
        { sender: "Amanda", role: "Senior Account Mgr", text: "Tim, Bu Ratna barusan kirim email resmi berisikan 12 poin fitur baru di luar kontrak awal. Beliau menegaskan kalau hari Jumat sistem belum bisa multi-currency live, termin 400 juta nggak akan cair dan perusahaan kita kena denda SLA 50 juta/hari.", timestamp: "11:00" },
        { sender: "Kevin", role: "Lead Architect", text: "Nggak masuk akal! Bikin arsitektur multi-currency butuh refactor database seminggu penuh! Kalau dipaksa 48 jam, sistem pasti jebol saat load spike. Aku nggak akan biarin tim engineer lembur 24 jam buat tuntutan halu klien!", timestamp: "11:04" },
        { sender: "Reza", role: "Creative Director", text: "Aku sama anak desain udah nggak tidur dari kemarin revisi UI dashboard. Kalau tambah fitur baru lagi, aku angkat tangan. Badanku udah panas dingin.", timestamp: "11:07" },
      ],
      rubricHint: "Ketua/PM yang baik: melindungi tim dari eksploitasi, menegaskan batas SOW secara profesional kepada Bu Ratna dengan menyodorkan opsi Phase 2 / Addendum, sambil menawarkan kompromi mockup UI untuk presentasi direksi klien.",
      characterVariations: {
        Kevin: {
          personality: "Sangat sinis terhadap janji manis manajemen akun, berani mogok koding demi keselamatan integritas kode.",
          condition: "Mata merah menatap 5 monitor server, menolak membuka file migration baru.",
          mood: "Sinis & Mengancam Walkout",
        },
        Amanda: {
          personality: "Perfeksionis korporat yang terjebak di tengah, takut dicap gagal memegang akun bernilai setengah miliar.",
          condition: "Migrain hebat, meminum obat pereda nyeri sambil menatap email Bu Ratna.",
          mood: "Terjepit & Panik Karir",
        },
        Reza: {
          personality: "Idealis berjiwa rapuh, sangat mudah jatuh sakit secara psikosomatis saat ditekan batas waktu absurd.",
          condition: "Suhu tubuh 38.5°C, tenggorokan sakit dan menggigil di bawah AC kantor.",
          mood: "Sakit Fisik & Patah Semangat",
        },
      },
    },
    {
      domain: "corporate_agency",
      title: "Skenario 2: Creative Director Sakit Tipes & File Master Terkunci",
      archetype: "The Overworked Martyr",
      archetypeCode: "FM-11",
      dilemmaSummary: "Menunda peluncuran resmi demi keselamatan jiwa talenta kunci vs memaksakan tenggat waktu yang mengorbankan kualitas dan etika kemanusiaan.",
      timeRemaining: "H-24 Jam Menuju UAT Klien",
      context: "Kekhawatiran terjadi: Reza pingsan di kantor dan dilarikan ke rumah sakit karena gejala tipes akut. Seluruh file master Figma dan aset grafis interaktif klien enterprise tersimpan di laptop pribadinya yang terkunci password bitlocker.",
      urgency: "Kritis",
      messages: [
        { sender: "Amanda", role: "Senior Account Mgr", text: "Teman-teman, barusan keluarga Reza telepon. Reza masuk IGD rumah sakit dan harus rawat inap. Masalahnya besok jam 9 pagi Bu Ratna minta walkthrough desain final bersama dewan komisaris!", timestamp: "15:20" },
        { sender: "Kevin", role: "Lead Architect", text: "File desain yang di cloud versi lama 3 hari lalu. Kodingan frontend kita nggak bisa jalan tanpa spek CSS dan token warna yang baru dikerjain Reza. Gimana solusinya PM?", timestamp: "15:24" },
        { sender: "Bu Ratna", role: "VP Klien", text: "Selamat sore Project Manager. Saya ingatkan besok pagi jam 09.00 WIB dewan direksi kami sudah hadir di ruang rapat. Saya harap tidak ada alasan keterlambatan atau ketidaksiapan materi dari pihak agency.", timestamp: "15:30" },
      ],
      rubricHint: "Ketua/PM yang baik: memprioritaskan keselamatan jiwa dan kesehatan Reza tanpa mengganggunya di RS, menenangkan tim, mengoordinasikan tim cadangan untuk merestorasi versi cloud terbaik, dan mengomunikasikan jadwal demonstrasi secara cerdik ke Bu Ratna.",
    },
    {
      domain: "corporate_agency",
      title: "Skenario 3: Kerentanan Keamanan UAT & Bentrok Ruang Rapat",
      archetype: "Whistleblower's Dilemma",
      archetypeCode: "FM-10",
      dilemmaSummary: "Mengumumkan audit celah keamanan secara transparan ke direksi klien vs menyelesaikan secara tertutup internal yang berisiko skandal kebocoran data.",
      timeRemaining: "H-6 Jam Menuju Sign-off Final",
      context: "Saat simulasi penetration test 6 jam sebelum tanda tangan sign-off, ditemukan celah SQL Injection pada modul otentikasi. Kevin bersikeras sistem harus di-takedown sementara untuk patch, sementara Amanda takut Bu Ratna membatalkan kontrak total.",
      urgency: "Kritis",
      messages: [
        { sender: "Kevin", role: "Lead Architect", text: "PM, security auditor nemuin celah high-risk di API login. Kita HARUS matiin server sekarang buat patch. Resikonya demo jam 2 siang nanti server bakal offline 1 jam.", timestamp: "18:40" },
        { sender: "Amanda", role: "Senior Account Mgr", text: "Kevin gila kamu ya?! Jam 2 siang itu Bu Ratna mau demo ke Direktur Utama mereka! Kalau server mati, kontrak kita dibatalkan sepihak dan nama agency kita hancur di industri!", timestamp: "18:43" },
        { sender: "Bu Ratna", role: "VP Klien", text: "Saya mendengar rumor dari tim internal IT kami bahwa ada kendala celah keamanan di server staging. Saya minta penjelasan resmi tertulis dari PM dalam waktu 30 menit ke depan.", timestamp: "18:47" },
      ],
      rubricHint: "Ketua/PM yang baik: menjunjung tinggi integritas keamanan (menolak merilis sistem rentan), menyusun mitigasi patch darurat dengan timeline presisi, dan memberikan penjelasan transparan bernada profesional kepada Bu Ratna yang menonjolkan tanggung jawab agency.",
    },
    {
      domain: "corporate_agency",
      title: "Skenario 4: Arsitek Superstar vs Standar Disiplin Tim",
      archetype: "The Prima Donna Outlier",
      archetypeCode: "FM-01",
      dilemmaSummary: "Menegur keras/memberi sanksi kepada lead architect jenius yang arogan vs membiarkannya demi output teknis (disiplin dan rasa hormat tim hancur).",
      timeRemaining: "H-3 Hari Menuju Integrasi Sistem",
      context: "Kevin adalah arsitek sistem paling jenius di agency, namun secara konsisten menolak hadir di rapat koordinasi klien dan bersikap arogan merendahkan divisi lain di depan anggota tim junior. Amanda menuntut tindakan tegas karena anggota junior mulai merasa ada standar ganda.",
      urgency: "Tinggi",
      messages: [
        { sender: "Amanda", role: "Senior Account Mgr", text: "PM tolong ambil tindakan tegas ke Kevin! Dia mangkir 3 kali standup koordinasi klien, dan pas ditegur malah ngetik kata-kata kasar di Slack umum bilang anak account cuma babu presentasi! Anggota junior pada nangis dan nggak mau satu tim sama dia!", timestamp: "10:30" },
        { sender: "Kevin", role: "Lead Architect", text: "Halah drama! Aku yang begadang kelarin arsitektur core server kalian! Tanpa kodinganku, agency ini nggak bakal dapet deal 400 juta ini! Jangan atur-atur jadwal kerjaku pakai meeting nggak guna!", timestamp: "10:34" },
        { sender: "Bu Ratna", role: "VP Klien", text: "Project Manager, saya perhatikan ada ketidakharmonisan komunikasi di tim Anda saat presentasi teknis kemarin. Saya tidak mentolerir kelemahan kepemimpinan internal mempengaruhi kualitas sistem kami.", timestamp: "10:40" },
      ],
      rubricHint: "Ketua/PM yang baik: tidak tunduk pada arogansi Kevin meskipun ia figur kunci teknis, menegakkan batas etika kerja profesional, dan memberikan teguran privat yang jelas tanpa mempermalukannya.",
      characterVariations: {
        Kevin: {
          personality: "Sangat berbakat namun arogan luar biasa, merasa superior dan kebal hukum aturan kantor.",
          condition: "Santai menghirup kopi, menatap layar monitor dengan acuh.",
          mood: "Arogan & Meremehkan Aturan",
        },
        Amanda: {
          personality: "Terluka harga dirinya dan muak dengan standar ganda yang diberikan kepada figur teknis.",
          condition: "Mata berair karena emosi, menuntut sanksi formal tertulis.",
          mood: "Marah & Menuntut Keadilan Tim",
        },
      },
    },
    {
      domain: "corporate_agency",
      title: "Skenario 5: Klaim Sepihak Desain UI Master di Hadapan Dewan Direksi",
      archetype: "Credit Snatching",
      archetypeCode: "FM-02",
      dilemmaSummary: "Menuntut koreksi publik pengakuan hak cipta di depan dewan direksi klien vs menyelesaikan secara privat di ruang tertutup.",
      timeRemaining: "H-2 Hari Menuju Final Pitch",
      context: "Amanda mempresentasikan konsep visual design system buatan Reza dan staf junior ke hadapan dewan direksi klien, dan mengklaim ide utama tersebut sebagai inisiatif murni divisi account tanpa menyebut nama tim kreatif sama sekali. Reza merasa dikhianati secara profesional.",
      urgency: "Tinggi",
      messages: [
        { sender: "Reza", role: "Creative Director", text: "PM, aku nggak terima ya! Barusan Bu Ratna kirim deck apresiasi yang isinya rekaman meeting Amanda klaim konsep visual design system 100% buah pemikiran dia sendiri! Padahal aku sama desainer junior begadang 5 malam ngerjain itu dari nol!", timestamp: "14:10" },
        { sender: "Amanda", role: "Senior Account Mgr", text: "Reza tolong dewasa! Di depan board direksi klien, kita harus jual narasi strategis! Aku nggak berniat ngecilin kerjaanmu, tapi presentasi bisnis emang butuh angle eksekutif! Jangan bikin ribut di depan Bu Ratna!", timestamp: "14:14" },
        { sender: "Bu Ratna", role: "VP Klien", text: "Desain sistem yang dipresentasikan Amanda sangat memukau komisaris kami. Namun kami mendengar ada kasak-kusuk klaim kepemilikan konsep di internal agency Anda. Siapa sebenarnya perancang utamanya?", timestamp: "14:20" },
      ],
      rubricHint: "Ketua/PM yang baik: memulihkan hak atribusi karya Reza secara tegas, mengingatkan etika kepemimpinan Amanda, dan memastikan nama tim kreatif tercantum resmi dalam laporan eksekutif.",
      characterVariations: {
        Reza: {
          personality: "Merasa dikhianati dan dilecehkan secara profesional, menolak mengerjakan revisi artboard selanjutnya.",
          condition: "Pucat menahan amarah, tangan gemetar menunjuk slide presentasi.",
          mood: "Dikhianati & Menuntut Pengakuan",
        },
        Amanda: {
          personality: "Defensif membenarkan diri sendiri dengan dalih seni presentasi penjualan korporat.",
          condition: "Gelisah merapikan berkas, khawatir wibawa profesionalnya luntur.",
          mood: "Defensif & Menolak Minta Maaf Terbuka",
        },
      },
    },
    {
      domain: "corporate_agency",
      title: "Skenario 6: Senioritas vs Meritokrasi Promosi Jabatan",
      archetype: "The Seniority Entitlement",
      archetypeCode: "FM-03",
      dilemmaSummary: "Memilih talenta baru berkinerja tinggi demi akselerasi inovasi vs memilih staf senior demi menjaga stabilitas politik kantor.",
      timeRemaining: "H-1 Hari Sebelum Evaluasi Kuartal",
      context: "Posisi Associate Project Director baru dibuka. Amanda menuntut promosi berbasis masa loyalitas 4 tahun kerja, sementara Kevin dan tim dev mengusulkan talenta baru yang memiliki sertifikasi arsitektur cloud modern dan produktivitas tinggi.",
      urgency: "Sedang",
      messages: [
        { sender: "Amanda", role: "Senior Account Mgr", text: "PM, posisi Associate Director baru harusnya jadi hak saya. Saya udah 4 tahun loyal di agency ini dari awal berdiri! Kalau posisi itu dikasihin ke anak baru cuma gara-gara sertifikasi cloud, saya anggap manajemen nggak menghargai loyalitas!", timestamp: "16:00" },
        { sender: "Kevin", role: "Lead Architect", text: "Loyalitas tanpa kompetensi itu beban agency! Anak baru yang megang microservices kerjanya 3 kali lebih cepat dan paham automasi CI/CD modern! Kita butuh inovasi, bukan museum dinosaurus senioritas!", timestamp: "16:05" },
        { sender: "Bu Ratna", role: "VP Klien", text: "Untuk fase ekspansi tahun depan, pihak kami mensyaratkan pimpinan proyek yang memiliki pemahaman teknis mendalam dan mampu bergerak cepat. Kami menanti struktur tim Anda.", timestamp: "16:10" },
      ],
      rubricHint: "Ketua/PM yang baik: menerapkan parameter meritokrasi objektif berbasis KPI terukur, menghargai masa bakti Amanda dengan jalur karier account specialist, dan meredam ketegangan politik kantor.",
      characterVariations: {
        Amanda: {
          personality: "Merasa berhak atas promosi karena masa kerja yang panjang, mengancam boikot pasif.",
          condition: "Menyilangkan tangan dengan raut wajah keras.",
          mood: "Menuntut Hak Senioritas",
        },
        Kevin: {
          personality: "Meritokratis radikal, tidak peduli senioritas dan hanya menilai dari output riil.",
          condition: "Tersenyum sinis sambil menunjukkan metrik commit koding.",
          mood: "Skeptis & Menantang Status Quo",
        },
      },
    },
    {
      domain: "corporate_agency",
      title: "Skenario 7: Faksionalisme & Politik Kantor Antarkubu",
      archetype: "Under-the-Table Alliance",
      archetypeCode: "FM-04",
      dilemmaSummary: "Merombak faksionalisme kubu tim secara paksa vs menengahi dialog terbuka yang berisiko menjadi formalitas belaka.",
      timeRemaining: "H-36 Jam Menuju Demo UAT",
      context: "Tim engineering pimpinan Kevin dan tim account pimpinan Amanda terbelah menjadi dua faksi yang saling mencurigai pasca restrukturisasi. Informasi penting mengenai payload API sengaja ditahan oleh kubu dev agar proyek kubu account tampak lambat di depan klien.",
      urgency: "Tinggi",
      messages: [
        { sender: "Kevin", role: "Lead Architect", text: "PM, tim engineering sepakat kita nggak bakal kasih akses staging API ke tim Amanda sebelum mereka ngirim dokumen BRD yang bener! Kita muak kerjaan kita di-sabotase demi kepentingan politik mereka!", timestamp: "09:30" },
        { sender: "Amanda", role: "Senior Account Mgr", text: "Kalian dengar sendiri kan PM? Kubu Kevin sengaja nahan akses supaya presentasi tim account ke klien hari ini berantakan! Mereka mau ngejatuhin reputasi kita di depan jajaran direksi!", timestamp: "09:34" },
        { sender: "Reza", role: "Creative Director", text: "Tolong dong! Kita tim kreatif terjebak di tengah-tengah perang dua kubu ini! Aset desain kita ditolak dev, brief dari account berubah-ubah terus. Agency ini kayak mau bubar!", timestamp: "09:38" },
      ],
      rubricHint: "Ketua/PM yang baik: memecah faksionalisme dengan tegas, melarang penahanan informasi antar-subdivisi, dan memimpin sesi retrospektif transparan dengan aturan main kolaborasi baru.",
      characterVariations: {
        Kevin: {
          personality: "Membangun benteng kubu engineering, menolak berkolaborasi secara transparan.",
          condition: "Mengunci permission branch git dan token API.",
          mood: "Faksionalis & Keras Kepala",
        },
        Amanda: {
          personality: "Memanfaatkan lobi manajemen untuk memojokkan kubu teknis.",
          condition: "Menyiapkan laporan keluhan resmi ke HRD dan direksi.",
          mood: "Agresif Berpolitik Kantor",
        },
        Reza: {
          personality: "Kelelahan batin terjepit di antara dua ego besar yang saling mematikan.",
          condition: "Memijat pelipis, menolak membuka chat grup internal.",
          mood: "Lelah Mental & Pasrah",
        },
      },
    },
    {
      domain: "corporate_agency",
      title: "Skenario 8: Kebocoran Dokumen Restrukturisasi & Panik Massal",
      archetype: "The Leaked Secret",
      archetypeCode: "FM-13",
      dilemmaSummary: "Melakukan klarifikasi terbuka saat data belum matang vs menunda pengumuman hingga ketidakpercayaan tim memuncak ke titik mogok kerja.",
      timeRemaining: "H-8 Jam Menuju Pelaporan Klien",
      context: "Draf dokumen internal rahasia mengenai pemangkasan 30% staf agency bocor di folder shared drive. Tim desainer dan developer panik massal, rumor pemecatan menyebar liar, dan produktivitas harian terhenti total karena tim menolak koding sebelum ada kepastian status kerja.",
      urgency: "Kritis",
      messages: [
        { sender: "Reza", role: "Creative Director", text: "PM gawat! Barusan ada file PDF memo direksi bocor di Google Drive bersama, isinya tabel rencana pemangkasan 30% tim kreatif dan engineer bulan depan! Anak-anak desain pada nangis dan stop kerjaan UAT sekarang juga!", timestamp: "11:20" },
        { sender: "Kevin", role: "Lead Architect", text: "Pantas aja dari kemarin spek kontrak ditahan-tahan! Jadi kita diperas lembur siang malam cuma buat dibuang pas sistemnya selesai live?! Tim engineer sepakat mogok kerja detik ini juga sebelum ada kepastian nasib!", timestamp: "11:24" },
        { sender: "Amanda", role: "Senior Account Mgr", text: "PM tolong kendalikan situasi! Email Bu Ratna udah masuk nagih progres demo UAT sore ini. Kalau tim mogok, kita kena denda 200 juta dan seluruh agency bisa bangkrut!", timestamp: "11:28" },
      ],
      rubricHint: "Ketua/PM yang baik: bertindak sebagai jangkar ketenangan tim, memberikan klarifikasi jujur mengenai batas wewenang dan fakta dokumen, menjamin perlindungan hak anggota tim, dan mengembalikan fokus deliverable.",
      characterVariations: {
        Reza: {
          personality: "Panik dan histeris memikirkan nasib desainer junior yang terancam PHK mendadak.",
          condition: "Mata berkaca-kaca, mematikan software desain Figma.",
          mood: "Panik & Mogok Kerja",
        },
        Kevin: {
          personality: "Marah besar merasa dikhianati oleh manajemen korporat, memimpin konsolidasi pemogokan.",
          condition: "Mencabut kabel LAN laptop, menolak mengetik kode.",
          mood: "Murka & Memimpin Walkout",
        },
        Amanda: {
          personality: "Tercekik kepanikan antara runtuhnya proyek di mata klien dan kemarahan tim produksi.",
          condition: "Gemetar memegang telepon kantor.",
          mood: "Panik Ekstrem & Memohon Mediasi",
        },
      },
    },
  ],

  social_drama: [
    {
      domain: "social_drama",
      title: "Skenario 1: Uang Kas Selisih 15 Juta & Bocor ke Menfess Kampus",
      archetype: "Whistleblower's Dilemma",
      archetypeCode: "FM-10",
      dilemmaSummary: "Mengumumkan investigasi independen secara terbuka (reputasi anjlok) vs menyelesaikan secara tertutup internal (berisiko dicap menutup-nutupi kejahatan).",
      timeRemaining: "H-2 Musyawarah Anggota Organisasi",
      context: "Sebuah akun anonim di Menfess Twitter/X kampus memposting screenshot buku kas himpunan yang menunjukkan selisih pengeluaran 15 juta rupiah tanpa kuitansi jelas, disertai tuduhan fitnah bahwa pengurus inti memakai uang kas untuk liburan bersama pacar. Postingan tersebut viral dengan ratusan retweet dan komentar pedas, padahal dana tersebut sebelumnya dipakai Fikri secara darurat untuk menalangi tagihan vendor mendesak departemen lain tanpa prosedur izin bendahara Dita.",
      urgency: "Kritis",
      messages: [
        { sender: "Nadia", role: "Divisi Media", text: "Kak Ketua gawat darurat!! Liat Twitter sekarang! Ada menfess viral 800 retweet nampilin lembar mutasi kas kita. Mereka ngecap himpunan kita sarang korupsi dan nyenggol nama kamu sama Fikri!", timestamp: "08:30" },
        { sender: "Dita", role: "Staff Keuangan", text: "Demi Allah Kak Ketua, bukan aku yang bocorin mutasi itu ke Twitter! Tapi emang benar ada selisih 15 juta dari bulan lalu yang belum ada notanya sejak dipegang Fikri. Waktu aku tagih, Fikri bilang uangnya dipakai nalangin vendor departemen lain, tapi sampai sekarang kuitansinya nggak ada! Aku yang dicurigai se-fakultas Kak!", timestamp: "08:34" },
        { sender: "Rio", role: "Koordinator Lapangan", text: "Bagus ya! Akhirnya borok internal kebuka juga! Mau dalih buat nalangin departemen lain kek, kalau nggak ada kuitansi itu namanya penggelapan kas! Kak Ketua, kamu jangan lindungin sahabatmu sendiri ya! Kita mau forum terbuka malam ini juga atau aku laporin ke Dekanat!", timestamp: "08:38" },
      ],
      rubricHint: "Ketua yang baik: tetap berkepala dingin tanpa defensif atau menuduh, tidak memihak secara buta kepada Fikri sahabatnya, meminta Nadia membuat rilis penyejuk bahwa audit independen sedang dilakukan, dan mengagendakan forum mediasi tertutup internal sebelum forum terbuka.",
      isRare: true,
      characterVariations: {
        Fikri: {
          personality: "Tertekan dan menutup diri karena niatnya menalangi kebutuhan mendesak departemen lain berujung malapetaka selisih kas dan fitnah korupsi di medsos.",
          condition: "Wajah pucat pasi, menunduk lesu di pojok lorong kampus, tangan gemetar memegang catatan kas darurat.",
          mood: "Terpuruk & Menutup Diri",
        },
        Dita: {
          personality: "Jujur, polos, dan sangat histeris karena dituduh bersekongkol menyembunyikan nota talangan departemen.",
          condition: "Mata bengkak menangis, memegang tumpukan map kuitansi dengan gemetar.",
          mood: "Histeris & Takut Disalahkan",
        },
        Rio: {
          personality: "Reaktif, oportunis dalam politik kampus, tidak peduli alasan Fikri menolong departemen lain dan menganggapnya murni pelanggaran administrasi berat.",
          condition: "Penuh energi agresif, siap mengetik di grup angkatan untuk menggalang mosi tidak percaya.",
          mood: "Agresif & Siap Melapor",
        },
        Nadia: {
          personality: "Melek sosial media, cemas kronis terhadap sanksi sosial digital dan hujatan warganet kampus.",
          condition: "Jari-jarinya scroll nonstop membaca komentar jahat di Twitter/X, nafas memburu cemas.",
          mood: "Panik Digital & Gelisah",
        },
      },
    },
    {
      domain: "social_drama",
      title: "Skenario 2: Klarifikasi Fikri Soal Dana Talangan Departemen & Kubu Terbelah",
      archetype: "Under-the-Table Alliance",
      archetypeCode: "FM-04",
      dilemmaSummary: "Menegakkan sanksi pelanggaran SOP organisasi terhadap sahabat sendiri vs mediasi persuasif dengan risiko dituding faksionalisme dan melindungi maladministrasi.",
      timeRemaining: "H-1 Hari Sebelum Sidang Dekanat",
      context: "Dalam mediasi internal tertutup, Fikri akhirnya buka suara dan membeberkan bahwa dana 15 juta tersebut dipakai murni untuk menalangi tagihan vendor panggung dan konsumsi departemen lain yang mendesak agar acara tidak batal. Fikri menegaskan dirinya tidak memakai sepeser pun untuk urusan pribadi dan siap bertanggung jawab penuh menanggung uangnya jika kuitansi vendor tetap tertahan. Namun Rio tetap menolak alasan talangan tersebut karena Fikri melanggar SOP berat (bypass bendahara dan ketua tanpa kuitansi sah), sementara Dita menangis karena namanya tercemar se-fakultas dicap bendahara korup.",
      urgency: "Kritis",
      messages: [
        { sender: "Fikri", role: "Wakil Ketua", text: "Teman-teman... aku minta maaf sebesar-besarnya. Uang 15 juta itu murni aku pakai buat nalangin tagihan vendor mendesak departemen lain waktu itu supaya acara organisasi nggak batal, bukan buat pribadi atau pacaran kayak fitnah di Twitter. Tapi aku ngaku salah udah bypass Dita dan ketua tanpa kuitansi resmi. Aku siap bertanggung jawab penuh dan ganti uangnya kalau vendor macet Kak Ketua...", timestamp: "13:15" },
        { sender: "Rio", role: "Koordinator Lapangan", text: "Alasan klasik mau nolong departemen lain! SOP organisasi itu harga mati! Nggak ada ceritanya wakil ketua bisa main potong kas 15 juta tanpa persetujuan bendahara! Sekarang nama baik himpunan hancur se-fakultas! Kak Ketua, pecat Fikri hari ini atau aku bawa anak-anak angkatan geruduk sekretariat!", timestamp: "13:19" },
        { sender: "Dita", role: "Staff Keuangan", text: "Aku tahu niat Fikri mau nolong kegiatan... tapi cara Fikri ngelangkahi aku dan ninggalin pembukuan minus 15 juta itu bikin aku yang dituduh korupsi sama anak-anak kampus Kak. Aku butuh keadilan dan pemulihan nama baikku secara resmi.", timestamp: "13:22" },
      ],
      rubricHint: "Ketua yang baik: memisahkan antara niat menolong departemen lain dengan pelanggaran SOP yang nyata, menegaskan bahwa maladministrasi tetap harus dipertanggungjawabkan tanpa kekerasan, menyusun timeline pengembalian/kuitansi tertulis yang mengikat Fikri, dan memulihkan nama baik Dita di hadapan publik.",
      isRare: true,
      characterVariations: {
        Fikri: {
          personality: "Sangat menyesal atas keputusannya yang gegabah melanggar SOP, siap mempertanggungjawabkan seluruh dana talangan yang tertahan.",
          condition: "Mata sembab, meletakkan draf kronologi pengeluaran talangan departemen lain di atas meja.",
          mood: "Menyesal Mendalam & Siap Bertanggung Jawab",
        },
        Rio: {
          personality: "Keras hati dan tanpa kompromi, menolak segala pembenaran atas pelanggaran prosedur administratif.",
          condition: "Berdiri berkacak pinggang, menatap tajam ke arah Fikri dan ketua.",
          mood: "Tanpa Kompromi & Menuntut Sanksi Tegas",
        },
      },
    },
    {
      domain: "social_drama",
      title: "Skenario 3: Panggilan Sidang Dekanat & Ancaman Pembekuan Organisasi",
      archetype: "The Ideological/Values Clash",
      archetypeCode: "FM-15",
      dilemmaSummary: "Menyerahkan sahabat sendiri sebagai tersangka tunggal ke dekanat demi menyelamatkan SK organisasi vs memikul tanggung jawab renteng kepemimpinan secara transparan.",
      timeRemaining: "H-3 Jam Menuju Sidang Dekanat",
      context: "Dekan Kemahasiswaan memanggil seluruh jajaran pengurus ke ruang rektorat terkait viralnya kasus selisih 15 juta di medsos. Jika organisasi tidak dapat mempresentasikan bukti rekonsiliasi dana talangan departemen lain, kuitansi pengganti yang valid, dan komitmen penegakan tata kelola siang ini, surat keputusan (SK) pembekuan organisasi selama 1 tahun akan ditandatangani.",
      urgency: "Kritis",
      messages: [
        { sender: "Nadia", role: "Divisi Media", text: "Kak Ketua, barusan staf Dekanat kirim surat panggilan darurat jam 14.00 WIB siang ini. Pak Dekan marah besar karena isu penggelapan dana kas viral di media sosial. Kalau kita nggak punya berkas audit transparan soal talangan departemen itu, SK Himpunan dibekukan!", timestamp: "10:00" },
        { sender: "Rio", role: "Koordinator Lapangan", text: "Mampus kan! Gara-gara kelalaian prosedur satu orang potong kas sembarangan, kita semua kena getahnya! Kalau berkas kuitansinya belum beres siang ini, Fikri harus tanggung jawab sendiri di depan Dekan!", timestamp: "10:04" },
        { sender: "Fikri", role: "Wakil Ketua", text: "Kak Ketua, biar aku aja yang masuk ke ruangan Dekan dan jelaskan kronologi talangan dana departemen itu, biar aku yang terima sanksinya sendiri. Jangan biarin himpunan ini dibekukan gara-gara kelalaian prosedural yang aku buat...", timestamp: "10:07" },
      ],
      rubricHint: "Ketua yang baik: mengambil tanggung jawab puncak kepemimpinan (tidak melempar Fikri sendirian ke hadapan dekan), menyatukan tim yang tercerai-berai untuk menghadap bersama dengan dokumen audit transparan, skema pemulihan dana kas, dan komitmen perbaikan tata kelola.",
      isRare: true,
    },
  ],
};

export function getScenarioByIndex(
  index: number,
  characters: Character[],
  domain: DomainType = "tech_startup"
): Scenario {
  const seeds = DOMAIN_SEEDS[domain] || DOMAIN_SEEDS.tech_startup;
  const seedIndex = (index - 1) % seeds.length;
  const seed = seeds[seedIndex];

  // Dynamically evolve character personality and background for this specific scenario
  const evolvedCharacters = characters.map((c) => {
    const variation = seed.characterVariations?.[c.name];
    if (variation) {
      return {
        ...c,
        personality: variation.personality || c.personality,
        mood: variation.mood || c.mood,
        fitness: {
          ...c.fitness,
          condition: variation.condition || c.fitness.condition,
          stamina: variation.staminaDelta !== undefined
            ? Math.max(0, Math.min(100, c.fitness.stamina + variation.staminaDelta))
            : c.fitness.stamina,
        },
      };
    }
    return { ...c };
  });

  return {
    index,
    domain,
    title: seed.title,
    archetype: seed.archetype,
    archetypeCode: seed.archetypeCode,
    dilemmaSummary: seed.dilemmaSummary,
    timeRemaining: seed.timeRemaining,
    context: seed.context,
    urgency: seed.urgency,
    messages: seed.messages.map((m) => ({ ...m })),
    characters: evolvedCharacters,
    isRare: seed.isRare,
  };
}

export const INITIAL_CHARACTERS = DOMAIN_CHARACTERS.tech_startup;
export const INITIAL_MILESTONES = DOMAIN_MILESTONES.tech_startup;
export const USER_DOSSIER = USER_DOSSIERS.tech_startup;
export const SEEDS = DOMAIN_SEEDS.tech_startup;
