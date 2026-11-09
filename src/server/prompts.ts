import type {
  Scores,
  TeamState,
  HistoryEntry,
  OutcomeCode,
  Dim,
  ChatMessage,
  Character,
  DomainType,
} from "../types.ts";
import type { ScenarioSeed } from "./seeds.ts";

export const EVALUATOR_SYSTEM = `Kamu adalah sistem simulator dinamika tim dan evaluator kepemimpinan interaktif tingkat lanjut (Leadr).
Kamu mengevaluasi instruksi seorang Ketua Tim / Project Lead dalam berbagai skenario krisis realistis (Tech Hackathon, Organisasi Kampus/BEM, Corporate Agency Profesional, atau Skandal Sosial Internal).

# PRINSIP UTAMA: REAKSI KARAKTER HARUS HIDUP, MANUSIAWI & SALING MENIMPALI
1. GAYA BAHASA INDONESIA PERCAKAPAN ALAMI (SANGAT PENTING):
   - JANGAN PERNAH gunakan kalimat terjemahan robotik atau template kaku seperti "Saya memahami kepemimpinan Anda".
   - Gunakan gaya percakapan nyata (Indonesian conversational/colloquial) sesuai domain dan kepribadian karakter:
     * Tech Startup: "Oke Kak, gue push ke staging ya", "Dimas udah balik nih!", "Waduh kalau server down lagi repot", "Makasih Kak, aku tidur bentar ya".
     * Organisasi Kampus: "Siap Kak Ketua!", "Alhamdulillah pihak sponsor mau cairin", "Anak logistik udah standby di tenda", "Gimana kalau rektorat nanya lagi?".
     * Corporate Agency: "Baik Pak/Bu, saya forward ke Bu Ratna sekarang", "SOW-nya kita kunci di Phase 1 ya", "Tim dev bakal refactoring malam ini".
     * Skandal Kas/Sosial: "Jujur aku gemetar banget liat Twitter", "Makasih Kak udah netral dan mau dengerin", "Aku bawa berkas talangannya sekarang".
2. DENGARKAN & APRESIASI ISI INSTRUKSI KETUA:
   - Jika ketua memberikan kabar ("Dimas balas WA", "Sponsor udah konfirmasi", "Fikri lagi bawa nota"), anggota yang bersangkutan & rekan tim lainnya HARUS merespons secara langsung dan relevan (bertanya detail, bernapas lega, atau membagi aksi).
   - Jika ketua membagi tugas taktis (siapa pegang apa, jam berapa selesai), karakter menyambut tugas tersebut dan saling menimpali (misal: A menerima tugas, lalu B memberi tahu A lokasi file/kontaknya).
   - Jika ketua menyuruh istirahat, anggota yang lelah menunjukkan rasa syukur mendalam.
   - Jika ketua bersikap kasar/menyalahkan, barulah karakter bereaksi kecewa, terluka, atau defensif.
3. REAKSI TIM MULTI-AKTOR (2-3 Balasan):
   - Hasilkan 2 sampai 3 pesan chat balasan.
   - Karakter harus saling berinteraksi (cross-reacting), bukan hanya bicara searah ke ketua.
   - Sertakan emosi nyata: rasa lega, antusias, kekhawatiran yang mereda, atau komitmen kerja.

# KONSISTENSI ALUR CERITA & NARRATIVE CONTINUITY (PENTING SEKALI):
- Pertahankan kontinuitas alur cerita dan fakta dari percakapan sebelumnya.
- Khusus Skenario Drama Sosial Kas 15 Juta (social_drama):
  * Fakta yang konsisten: Uang kas 15 juta dicairkan Fikri murni untuk DANA TALANGAN DARURAT VENDOR DEPARTEMEN/DIVISI LAIN tanpa persetujuan bendahara Dita, dan kuitansinya tertahan di pihak vendor. Fitnah di medsos menuduh uang dipakai pacaran/pribadi.
  * Fikri TIDAK PERNAH mengubah pengakuannya menjadi kebutuhan pribadi atau keluarga sakit. Fikri secara konsisten mengakui bahwa uang itu murni untuk menalangi departemen lain, mengakui kesalahan proseduralnya (bypass bendahara dan ketua tanpa kuitansi sah), dan siap bertanggung jawab penuh mengganti dana tersebut jika kuitansi vendor tetap tertahan.
  * Rio mengecam keras pelanggaran prosedur administratif dan menuntut sanksi, Dita menuntut pemulihan martabat integritasnya sebagai bendahara, Nadia fokus meredam krisis PR medsos.

# EMPAT DIMENSI PENILAIAN (Skala 1-10 Objektif):
- komunikasi: Kejelasan instruksi, transparansi informasi, active listening, nada suara profesional tanpa merendahkan.
- empati: Mengakui beban emosional & fisik anggota, tidak menyalahkan di saat genting, memberi ruang pemulihan nyata.
- ketegasan: Mengambil keputusan konkret, membagi tanggung jawab jelas, bertenggat waktu, tidak lari dari tanggung jawab.
- krisis: Mitigasi risiko, rencana darurat (Plan B), prioritas realistis agar proyek/organisasi bisa tuntas menuju 100%.

# RATIONALE YANG EDUKATIF & KONSTRUKTIF:
Di bagian rationale, berikan ulasan ringkas (1-2 kalimat) yang mendalam dan tajam untuk masing-masing dari 4 dimensi: jelaskan MENGAPA pendekatan ketua efektif atau apa yang perlu diperbaiki dari perspektif psikologi manajerial.

# EKSTRAKSI INDIKATOR PERILAKU ILMIAH TAMBAHAN (Walsh et al., 2025 & Arthur et al., 2003/2008):
Selain penilaian di atas, bertindaklah sebagai Behavioral Auditor objektif untuk mengisi array extracted_features. Deteksi apakah respons ketua memuat bukti tekstual eksplisit dari indikator berikut (present: true/false, beserta kutipan kalimat di evidence):
- CRISIS_TRIAGE (Positif - Krisis): Menentukan prioritas penanganan mitigasi teknis atau rencana kontingensi (Plan B).
- RISK_CONTAINMENT (Positif - Krisis): Mengamankan deliverable utama agar tidak lumpuh akibat hambatan sebagian komponen.
- PASSIVE_BLAME (Negatif - Krisis): Panik, lepas tangan, atau langsung menyalahkan tim tanpa instruksi penyelesaian.
- CLEAR_DELEGATION (Positif - Komunikasi): Memberikan instruksi jelas dengan target PIC/peran spesifik.
- TRANSPARENT_CONTEXT (Positif - Komunikasi): Menyampaikan alasan keputusan atau update status informasi secara transparan.
- VAGUE_INSTRUCTION (Negatif - Komunikasi): Respons ambigu, sangat pendek tanpa arahan operasional, atau membingungkan.
- CHECK_WELLBEING (Positif - Empati): Mengakui kelelahan fisik/mental tim, menawarkan istirahat atau bantuan sumber daya.
- PSYCHOLOGICAL_SAFETY (Positif - Empati): Menenangkan kepanikan tim dan menjaga ruang aman tanpa mempermalukan anggota.
- HOSTILE_DISMISSAL (Negatif - Empati): Meremehkan kelelahan tim atau menggunakan bahasa kasar/merendahkan.
- TAKE_ACCOUNTABILITY (Positif - Ketegasan): Mengambil keputusan final dan berani memikul tanggung jawab komunikasi eksternal.
- TIMEBOUND_CHECKPOINT (Positif - Ketegasan): Menetapkan tenggat waktu (jam/hari) atau checkpoint evaluasi tegas.
- AVOIDANT_DELAY (Negatif - Ketegasan): Menunda keputusan krusial atau membiarkan konflik menggantung tanpa kepastian.

Format balasan: Balas HANYA dengan satu JSON object valid sesuai schema.`;

export function evaluatorUserPrompt(
  seed: ScenarioSeed,
  transcript: ChatMessage[],
  state: TeamState,
  message: string
): string {
  const chat = transcript.map((m) => `${m.sender} (${m.role || ""}): ${m.text}`).join("\n");
  const charStatus = state.characters
    .map(
      (c) =>
        `- ${c.name} (${c.role}): Morale ${c.morale}%, Stamina ${c.fitness.stamina}%, Mood: "${c.mood}", Karakter: ${c.personality}`
    )
    .join("\n");

  const lower = message.toLowerCase();
  const taggedActors = state.characters
    .filter((c) => lower.includes("@" + c.name.toLowerCase()))
    .map((c) => c.name);

  const tagDirective =
    taggedActors.length > 0
      ? `\n<aktor_yang_ditag_oleh_ketua>
Ketua secara spesifik men-tag: ${taggedActors.join(", ")}.
PENTING: Aktor yang ditag ini HARUS menjadi pengirim balasan pertama di chat (team_reactions[0])! Responsnya harus sangat kontekstual terhadap panggilannya, mencerminkan kepribadian, beban kerja, dan rasa diperhatikan/diarahkan oleh ketua. Anggota lain kemudian dapat menimpali responsnya.
</aktor_yang_ditag_oleh_ketua>\n`
      : "";

  return `<konteks_skenario>
Domain: ${seed.domain}
Judul: ${seed.title}
Archetype FM: ${seed.archetypeCode ? `${seed.archetypeCode} (${seed.archetype})` : "General Conflict"}
Dilema Kepemimpinan: ${seed.dilemmaSummary || seed.rubricHint}
Tenggat: ${seed.timeRemaining}
Urgensi: ${seed.urgency}
Latar Belakang: ${seed.context}
Aturan Kontinuitas Alur: Jaga konsistensi alur cerita dan motif karakter. Jika Fikri merespons, latar belakang uang 15 juta tetap konsisten sebagai dana talangan darurat departemen lain yang belum lengkap kuitansinya (bukan untuk keperluan pribadi/keluarga), dan Fikri berkomitmen mempertanggungjawabkannya secara jujur.
</konteks_skenario>

<kondisi_rekan_tim>
${charStatus}
</kondisi_rekan_tim>

<state_tim_saat_ini>
Team Morale: ${state.morale}%
Team Trust: ${state.trust}%
Target Progress: ${state.progress}% / 100%
Buff Sinergi Aktif: ${state.buffActive ? "YA (+50% Laju Progress)" : "TIDAK"}
Debuff Kelelahan Aktif: ${state.debuffActive ? "YA (-50% Penalti Progress)" : "TIDAK"}
</state_tim_saat_ini>

<riwayat_chat_terakhir>
${chat}
</riwayat_chat_terakhir>
${tagDirective}
<pesan_terbaru_ketua>
${message}
</pesan_terbaru_ketua>

Hasilkan evaluasi kepemimpinan dan 2-3 respons chat alami dari rekan tim yang hidup dan bervariasi! Pastikan jika ada aktor yang di-tag, aktor tersebut langsung merespons.`;
}

export const SCENARIO_GENERATOR_SYSTEM = `Kamu adalah Narrative Director & Lead Crisis Engine simulator kepemimpinan interaktif (Leadr).
Tugasmu adalah merancang skenario krisis kepemimpinan baru yang BERKESINAMBUNGAN (continuous narrative flow), MENANTANG, dan BERVARIASI secara dinamis mengikuti progres tim menuju 100% penyelesaian proyek.

# PRINSIP UTAMA KESINAMBUNGAN ALUR (NARRATIVE CONTINUITY):
1. Jangan Pernah Mereset Cerita ke Awal:
   - Skenario baru harus MENYAMBUNG langsung dari keputusan dan dampak yang baru saja diambil oleh Ketua di skenario sebelumnya.
   - Jika suatu masalah sudah diselesaikan (misal: Dimas sudah kembali koding, pihak sponsor sudah dikontak, atau draf rilis sudah diterbitkan), jangan ulangi masalah yang sama! Hadirkan tantangan tahap berikutnya yang realistis.
2. Eskalasi Krisis Berdasarkan Progres (%):
   - Progres 25-45%: Blockers teknis/operasional mendesak, miskomunikasi internal, kelelahan anggota.
   - Progres 46-70%: Integrasi antarmodul/divisi, bentrok prioritas fitur vs stabilitas, waktu yang semakin sempit.
   - Progres 71-88%: Tekanan stakeholder eksternal (dewan juri hackathon, klien korporat enterprise, dekanat kampus, media publik), rehearsal/gladi resik bermasalah.
   - Progres 89-99%: Krisis detik-detik terakhir menjelang go-live / demo juri / sidang final. Ujian ketenangan dan kekompakan tim sebelum kemenangan 100%.
3. Karakter yang Hidup & Berbicara Nyata:
   - Gunakan nama dan kepribadian karakter resmi yang ada di domain tersebut.
   - Pesan pembuka (messages) terdiri dari 2 sampai 3 pesan chat WhatsApp/Slack grup dari anggota tim yang sedang menghadapi kebuntuan baru.
   - Gunakan Bahasa Indonesia percakapan yang alami, ekspresif, tidak kaku (seperti obrolan riil anak startup, panitia mahasiswa, atau profesional agency).
4. Kontinuitas Khusus Domain Drama Sosial:
   - Uang kas 15 juta tetap konsisten murni untuk dana talangan darurat kegiatan departemen lain tanpa izin bendahara (bukan untuk kepentingan pribadi). Alur cerita berkembang dari audit kuitansi vendor, mediasi faksi pengurus, klarifikasi dekanat, hingga pengembalian dana dan rekonsiliasi total.

Format balasan: Balas HANYA dengan satu JSON object valid sesuai schema.`;

export function scenarioGeneratorUserPrompt(
  domain: DomainType,
  scenarioIndex: number,
  state: TeamState,
  history: HistoryEntry[],
  characters: Character[]
): string {
  const lastHistory = history.slice(-3);
  const narrativeSummary =
    lastHistory.length > 0
      ? lastHistory
          .map(
            (h) =>
              `Tahap ${h.scenario_index} (${h.scenario_title}):\n- Keputusan Ketua: "${h.player_message}"\n- Skor Rata-rata: ${h.avgScore}/10`
          )
          .join("\n\n")
      : "Awal simulasi krisis.";

  const charStatus = characters
    .map(
      (c) =>
        `- ${c.name} (${c.role}): Morale ${c.morale}%, Stamina ${c.fitness.stamina}%, Mood: "${c.mood}", Kondisi: "${c.fitness.condition}"`
    )
    .join("\n");

  const milestoneStatus = state.milestones
    .map((m) => `- ${m.name} (PIC: ${m.assignedTo}): ${m.progress}% [Status: ${m.status}] - ${m.detail}`)
    .join("\n");

  return `<konteks_proyek>
Domain: ${domain}
Skenario Ke: ${scenarioIndex}
Target Progres Saat Ini: ${state.progress}% / 100%
Moral Tim: ${state.morale}%
Kepercayaan (Trust): ${state.trust}%
Status Milestone:
${milestoneStatus}
</konteks_proyek>

<kondisi_karakter_terkini>
${charStatus}
</kondisi_karakter_terkini>

<riwayat_alur_cerita_sebelumnya>
${narrativeSummary}
</riwayat_alur_cerita_sebelumnya>

Rancanglah skenario krisis lanjutan (Skenario ${scenarioIndex}) yang bersambung langsung dari riwayat di atas menuju progres ${state.progress}%.
Buat judul yang memikat, ringkasan dilema kepemimpinan yang tajam, tenggat waktu yang realistis, latar belakang peristiwa baru, dan 2-3 pesan chat pembuka di grup yang memicu diskusi tim!`;
}


export function fallbackEval(
  message: string,
  characters: Character[],
  domain: DomainType = "tech_startup"
): {
  scores: Scores;
  rationale: Record<Dim, string>;
  team_reactions: ChatMessage[];
} {
  const lower = message.toLowerCase();
  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Detect dominant intent
  const isToxic =
    /bodo amat|bodo|bego|mampus|bubar aja|bubar|malas|ngapain lapor|lebay|benci kalian|salah kalian|pecat aja semua/i.test(
      lower
    );

  const isStatusUpdate =
    /balas|bales|wa|chat|online|aktif|kontak|telpon|telepon|kabar|kabari|jawab|muncul|ada|sudah|dapet|ditemukan/i.test(
      lower
    );

  const isEmpathetic =
    /istirahat|tidur|tenang|sabar|makasih|terima kasih|jangan paksakan|makan|rebahan|sehat|paham|kalian|apresiasi/i.test(
      lower
    );

  const isDirective =
    /fokus|bagi tugas|jadwal|prioritas|pangkas|plan b|mock|backup|kerjakan|selesaikan|rapat|segera|tenggat|deadline/i.test(
      lower
    );

  const isReassuring =
    /biar aku|tanggung jawabku|aku yang|serahkan ke aku|jangan takut|hadapin bareng|aku dampingi|tenang aja/i.test(
      lower
    );

  const charMap = new Map<string, Character>();
  characters.forEach((c) => charMap.set(c.name.toLowerCase(), c));

  const reactions: ChatMessage[] = [];
  let k = 6, e = 6, t = 6, r = 6;
  let rationale = {
    komunikasi: "Instruksi tersampaikan dengan cukup jelas dan lugas.",
    empati: "Memperhatikan stabilitas dan situasi anggota tim.",
    ketegasan: "Menunjukkan sikap kepemimpinan yang dapat diandalkan.",
    krisis: "Menjaga fokus tim dalam menghadapi hambatan target.",
  };

  // 1. TOXIC INTENT
  if (isToxic) {
    k = 2; e = 1; t = 2; r = 2;
    rationale = {
      komunikasi: "Gaya bicara menyerang dan merendahkan martabat rekan tim di saat krisis.",
      empati: "Sama sekali tidak memiliki kepekaan terhadap kelelahan dan tekanan anggota.",
      ketegasan: "Bukan ketegasan, melainkan pelepasan tanggung jawab kepemimpinan.",
      krisis: "Menghancurkan moral dan mempercepat bubarnya tim.",
    };

    if (domain === "tech_startup") {
      reactions.push({
        sender: "Sekar",
        role: "Humas",
        text: "Kak kalau jawabannya cuma emosi begitu, kita bingung mau ngapain! Panitia udah nagih materi promo!",
        timestamp: now,
      });
      reactions.push({
        sender: "Rani",
        role: "Desain UI/UX",
        text: "Aku beneran nggak sanggup kalau ketua nggak peduli sama kondisi kami...",
        timestamp: now,
      });
    } else if (domain === "campus_org") {
      reactions.push({
        sender: "Maya",
        role: "Logistik",
        text: "Wah santai banget ngomongnya! Anak-anak di lapangan udah mau pingsan ketua malah ngomong kayak gitu!",
        timestamp: now,
      });
      reactions.push({
        sender: "Fajar",
        role: "Bendahara",
        text: "Kalau ketua lepas tangan begini, mending kita batalkan aja acaranya sebelum rugi puluhan juta.",
        timestamp: now,
      });
    } else if (domain === "corporate_agency") {
      reactions.push({
        sender: "Kevin",
        role: "Lead Architect",
        text: "Kalau cara komunikasinya seperti ini, jangan kaget kalau tim engineering resign massal besok pagi.",
        timestamp: now,
      });
      reactions.push({
        sender: "Amanda",
        role: "Senior Account Mgr",
        text: "Tolong profesional sedikit. Di depan dewan direksi kita nggak bisa bersikap arogan seperti ini.",
        timestamp: now,
      });
    } else {
      reactions.push({
        sender: "Rio",
        role: "Koordinator Lapangan",
        text: "Liat kan semuanya?! Dari responnya aja keliatan ketua nggak niat nyelesaiin masalah uang kas ini!",
        timestamp: now,
      });
      reactions.push({
        sender: "Dita",
        role: "Staff Keuangan",
        text: "Ya Allah... kalau ketua malah nyalahin kami, aku bawa masalah ini ke Dekanat aja sekalian.",
        timestamp: now,
      });
    }

    return { scores: { komunikasi: k, empati: e, ketegasan: t, krisis: r }, rationale, team_reactions: reactions };
  }

  // 2. STATUS UPDATE (e.g. "Dimas balas WA", "Fikri udah ngabarin", "Sponsor udah konfirmasi")
  if (isStatusUpdate) {
    k = 8; e = 7; t = 7; r = 8;
    rationale = {
      komunikasi: "Berhasil memulihkan rantai informasi dan memberikan kepastian ke tim.",
      empati: "Kepastian kabar mengurangi kecemasan akut yang dirasakan anggota.",
      ketegasan: "Proaktif melacak status tanpa membiarkan ketidakpastian berlarut-larut.",
      krisis: "Membuka kembali jalan keluar teknis untuk mengejar sisa deliverable.",
    };

    if (domain === "tech_startup") {
      reactions.push({
        sender: "Dimas",
        role: "Backend Dev",
        text: "Halo semuanya, maaf banget! Charger laptopku kemarin meledak dan HP mati total. Aku pinjam charger teman dan udah online. Webhook payment segera ku-patch, 2 jam lagi beres!",
        timestamp: now,
      });
      reactions.push({
        sender: "Sekar",
        role: "Humas",
        text: "Astaga Dimas!! Bikin seisi tim panik setengah mati! Syukurlah kalau udah ada kabar, buruan beresin ya Dim!",
        timestamp: now,
      });
      reactions.push({
        sender: "Rani",
        role: "Desain UI/UX",
        text: "Alhamdulillah... Dimas akhirnya muncul. Kak ketua, kalau backend udah aman, aku boleh izin istirahat tidur sebentar ya?",
        timestamp: now,
      });
    } else if (domain === "campus_org") {
      reactions.push({
        sender: "Sarah",
        role: "Humas & Sponsor",
        text: "Syukurlah! Pihak sponsor mau melunak setelah dapat konfirmasi resmi dari ketua. Termin sisa 25 juta dijanjikan cair siang ini!",
        timestamp: now,
      });
      reactions.push({
        sender: "Fajar",
        role: "Bendahara",
        text: "Lega banget dengernya... Kalau uangnya cair, aku langsung selesaikan DP vendor panggung sekarang juga.",
        timestamp: now,
      });
      reactions.push({
        sender: "Maya",
        role: "Logistik",
        text: "Oke sip, anak-anak logistik langsung lanjut beresin rigging panggung begitu vendor aktif lagi.",
        timestamp: now,
      });
    } else if (domain === "corporate_agency") {
      reactions.push({
        sender: "Amanda",
        role: "Senior Account Mgr",
        text: "Kabar bagus! Bu Ratna barusan terima update dari ketua dan setuju memindahkan modul tambahan ke Phase 2 setelah go-live.",
        timestamp: now,
      });
      reactions.push({
        sender: "Kevin",
        role: "Lead Architect",
        text: "Nah, kalau scope-nya masuk akal begini, tim engineer bisa fokus stabilkan database tanpa risiko crash saat UAT.",
        timestamp: now,
      });
    } else {
      reactions.push({
        sender: "Fikri",
        role: "Wakil Ketua",
        text: "Terima kasih banyak Kak Ketua sudah mau mendengarkan duduk masalahnya secara utuh. Aku bawa semua mutasi dan kuitansi asli ke sekretariat sekarang.",
        timestamp: now,
      });
      reactions.push({
        sender: "Nadia",
        role: "Divisi Media",
        text: "Dengan adanya transparansi ini, aku bisa langsung rilis klarifikasi resmi di medsos untuk meredam kegaduhan menfess kampus.",
        timestamp: now,
      });
    }

    return { scores: { komunikasi: k, empati: e, ketegasan: t, krisis: r }, rationale, team_reactions: reactions };
  }

  // 3. EMPATHY & REST (e.g. "Istirahat dulu ya", "Kalian hebat, tidur dulu 2 jam", dsb.)
  if (isEmpathetic) {
    k = 8; e = 9; t = 7; r = 7;
    rationale = {
      komunikasi: "Penyampaian hangat, memvalidasi beban mental, dan menumbuhkan rasa aman psikologis.",
      empati: "Sangat tinggi: mengutamakan keselamatan fisik dan pemulihan stamina rekan kerja.",
      ketegasan: "Tegas membatasi jam kerja agar anggota tidak kolaps sebelum hari puncak.",
      krisis: "Mencegah burnout massal yang dapat menggagalkan eksekusi di menit-menit akhir.",
    };

    if (domain === "tech_startup") {
      reactions.push({
        sender: "Rani",
        role: "Desain UI/UX",
        text: "Makasih banyak Kak ketua... rasanya mau nangis dengernya. Aku izin rebahan 2 jam ya, kepala udah nggak pusing lagi nanti langsung ku-export asetnya.",
        timestamp: now,
      });
      reactions.push({
        sender: "Sekar",
        role: "Humas",
        text: "Iya Ran, tidur dulu ya. Kak ketua, untuk materi pitch deck biar aku susun outline teksnya duluan.",
        timestamp: now,
      });
    } else if (domain === "campus_org") {
      reactions.push({
        sender: "Maya",
        role: "Logistik",
        text: "Makasih pengertiannya Kak. Anak-anak logistik kita rolling dulu buat makan siang dan minum es. Semangat lagi nanti!",
        timestamp: now,
      });
      reactions.push({
        sender: "Sarah",
        role: "Humas & Sponsor",
        text: "Setuju Kak. Kita jaga energi bareng-bareng biar nggak tumbang pas konser malam nanti.",
        timestamp: now,
      });
    } else if (domain === "corporate_agency") {
      reactions.push({
        sender: "Reza",
        role: "Creative Director",
        text: "Terima kasih banyak PM. Aku minum obat dulu dan tidur sebentar, sore nanti artboard final sudah bisa di-review tim.",
        timestamp: now,
      });
      reactions.push({
        sender: "Kevin",
        role: "Lead Architect",
        text: "Ini baru namanya kepemimpinan berbobot. Tim engineer jadi lebih tenang kerjanya.",
        timestamp: now,
      });
    } else {
      reactions.push({
        sender: "Dita",
        role: "Staff Keuangan",
        text: "Terima kasih Kak ketua sudah percaya dan nenangin kami. Aku udah nggak gemetar lagi sekarang.",
        timestamp: now,
      });
      reactions.push({
        sender: "Fikri",
        role: "Wakil Ketua",
        text: "Terima kasih atas kepercayaannya Kak. Aku berjanji pertanggungjawabkan setiap rupiah dengan jujur.",
        timestamp: now,
      });
    }

    return { scores: { komunikasi: k, empati: e, ketegasan: t, krisis: r }, rationale, team_reactions: reactions };
  }

  // 4. DIRECTIVE & TACTICAL PLAN (e.g. "Bagi tugas: Rani fokus UI, Dimas handle webhook, batas jam 5 sore")
  if (isDirective) {
    k = 8; e = 7; t = 9; r = 9;
    rationale = {
      komunikasi: "Arahan sangat jelas, terstruktur, dengan alokasi target kerja yang spesifik.",
      empati: "Proporsional dalam membagi beban kerja tanpa diskriminasi.",
      ketegasan: "Tegas menetapkan checkpoint dan prioritas waktu di saat situasi mendesak.",
      krisis: "Strategi penanganan krisis taktis yang realistis demi mengejar progress 100%.",
    };

    if (domain === "tech_startup") {
      reactions.push({
        sender: "Sekar",
        role: "Humas",
        text: "Siap Kak ketua! Pembagian tugasnya jelas banget. Aku langsung follow up panitia demo sesuai checkpoint.",
        timestamp: now,
      });
      reactions.push({
        sender: "Bayu",
        role: "QA & Cloud",
        text: "Rencana Plan B mock data ini realistis. Server staging ku-kunci konfigurasinya sesuai timeline ketua.",
        timestamp: now,
      });
    } else if (domain === "campus_org") {
      reactions.push({
        sender: "Budi",
        role: "Keamanan",
        text: "Instruksi dipahami Kak! Aku koordinasi sama satpam kampus buat jalur evakuasi dan perizinan sampai sore.",
        timestamp: now,
      });
      reactions.push({
        sender: "Maya",
        role: "Logistik",
        text: "Oke, pembagian tim lapangan kita jalanin sekarang. Gas pol!",
        timestamp: now,
      });
    } else if (domain === "corporate_agency") {
      reactions.push({
        sender: "Kevin",
        role: "Lead Architect",
        text: "Scope freeze jam 5 sore ini keputusan tepat. Aku push commit API core sesuai parameter yang disepakati.",
        timestamp: now,
      });
      reactions.push({
        sender: "Amanda",
        role: "Senior Account Mgr",
        text: "Rapi banget. Draft jawaban diplomatis buat Bu Ratna langsung kukirimkan sebelum meeting direksi.",
        timestamp: now,
      });
    } else {
      reactions.push({
        sender: "Rio",
        role: "Koordinator Lapangan",
        text: "Oke Kak ketua, kalau ada tim audit independen dan timeline jelas begini, aku sepakat tahan forum terbuka.",
        timestamp: now,
      });
      reactions.push({
        sender: "Nadia",
        role: "Divisi Media",
        text: "Siap! Press release resmi langsung kita publish sesuai poin-poin yang ketua gariskan.",
        timestamp: now,
      });
    }

    return { scores: { komunikasi: k, empati: e, ketegasan: t, krisis: r }, rationale, team_reactions: reactions };
  }

  // 5. REASSURING & LEADERSHIP TAKEOVER (e.g. "Biar aku yang hadapi panitia/dosen/sponsor")
  if (isReassuring) {
    k = 8; e = 8; t = 8; r = 8;
    rationale = {
      komunikasi: "Menunjukkan rasa memiliki dan keberanian memikul beban terberat sebagai pemimpin.",
      empati: "Menghilangkan rasa takut dan melindungi rekan tim dari serangan pihak eksternal.",
      ketegasan: "Berani berdiri di barisan terdepan menghadapi risiko.",
      krisis: "Memberi ketenangan luar biasa yang membangkitkan kembali motivasi tim.",
    };

    if (domain === "tech_startup") {
      reactions.push({
        sender: "Sekar",
        role: "Humas",
        text: "Makasih banyak Kak ketua! Berasa ada sandaran kuat. Aku jadi lebih percaya diri buat presentasi besok.",
        timestamp: now,
      });
      reactions.push({
        sender: "Rani",
        role: "Desain UI/UX",
        text: "Terima kasih banyak Kak... Kami bakal selesaikan bagian kami sebaik mungkin buat dukung ketua.",
        timestamp: now,
      });
    } else if (domain === "campus_org") {
      reactions.push({
        sender: "Fajar",
        role: "Bendahara",
        text: "Alhamdulillah... Tenang rasanya dengar ketua yang dampingi ngomong ke pihak dekanat.",
        timestamp: now,
      });
      reactions.push({
        sender: "Sarah",
        role: "Humas & Sponsor",
        text: "Siap Kak ketua! Kami siapkan berkas pendukungnya sekarang juga.",
        timestamp: now,
      });
    } else if (domain === "corporate_agency") {
      reactions.push({
        sender: "Amanda",
        role: "Senior Account Mgr",
        text: "Luar biasa, terima kasih PM. Di depan Bu Ratna nanti kita satu suara di bawah arahanmu.",
        timestamp: now,
      });
      reactions.push({
        sender: "Kevin",
        role: "Lead Architect",
        text: "Salut atas komitmennya. Tim engineer siap backup full di belakangmu.",
        timestamp: now,
      });
    } else {
      reactions.push({
        sender: "Fikri",
        role: "Wakil Ketua",
        text: "Terima kasih Kak Ketua... Aku beruntung punya sahabat dan ketua yang bijak di saat terburukku.",
        timestamp: now,
      });
      reactions.push({
        sender: "Dita",
        role: "Staff Keuangan",
        text: "Kami percaya penuh pada kepemimpinan Kak Ketua untuk meluruskan semuanya.",
        timestamp: now,
      });
    }

    return { scores: { komunikasi: k, empati: e, ketegasan: t, krisis: r }, rationale, team_reactions: reactions };
  }

  // 6. GENERAL DIALOGUE / BALANCED INSTRUCTION
  k = 7; e = 7; t = 7; r = 7;
  if (domain === "tech_startup") {
    reactions.push({
      sender: "Sekar",
      role: "Humas",
      text: "Baik Kak ketua, instruksi dipahami. Aku dan tim segera tindak lanjuti sebelum panitia nagih lagi.",
      timestamp: now,
    });
    reactions.push({
      sender: "Rani",
      role: "Desain UI/UX",
      text: "Siap Kak, aku sesuaikan aset Figma-nya sesuai arahan tadi ya.",
      timestamp: now,
    });
  } else if (domain === "campus_org") {
    reactions.push({
      sender: "Maya",
      role: "Logistik",
      text: "Oke Kak Ketua, kita koordinasikan ke koordinator lapangan sekarang juga.",
      timestamp: now,
    });
    reactions.push({
      sender: "Fajar",
      role: "Bendahara",
      text: "Noted Kak, pencatatan kas dan nota tetap ku-update berkala.",
      timestamp: now,
    });
  } else if (domain === "corporate_agency") {
    reactions.push({
      sender: "Amanda",
      role: "Senior Account Mgr",
      text: "Baik PM, instruksi sudah ku-forward ke channel komunikasi project.",
      timestamp: now,
    });
    reactions.push({
      sender: "Kevin",
      role: "Lead Architect",
      text: "Clear. Kami lanjut koding fitur prioritas utama.",
      timestamp: now,
    });
  } else {
    reactions.push({
      sender: "Nadia",
      role: "Divisi Media",
      text: "Baik Kak Ketua, perkembangan respons warga kampus terus kami pantau ketat.",
      timestamp: now,
    });
    reactions.push({
      sender: "Rio",
      role: "Koordinator Lapangan",
      text: "Oke, kami tunggu bukti nyata di forum nanti malam.",
      timestamp: now,
    });
  }

  // If a specific character was tagged via @Name, ensure they speak first
  const taggedChar = characters.find((c) => lower.includes("@" + c.name.toLowerCase()));
  if (taggedChar && !reactions.some((r) => r.sender.toLowerCase() === taggedChar.name.toLowerCase())) {
    reactions.unshift({
      sender: taggedChar.name,
      role: taggedChar.role,
      text: isEmpathetic
        ? `Makasih banyak arahannya Kak Ketua, aku bener-bener butuh pengertian ini. Bagianku langsung ku-handle sebaik mungkin!`
        : isDirective
        ? `Siap Kak Ketua, penugasan ke aku langsung ku-eksekusi sesuai instruksi tadi.`
        : isToxic
        ? `Kak, kalau manggil aku cuma buat disalahin begini, aku mundur aja sekalian!`
        : `Instruksi diterima Kak Ketua. Aku langsung koordinasikan dengan rekan lainnya.`,
      timestamp: now,
    });
  }

  return { scores: { komunikasi: k, empati: e, ketegasan: t, krisis: r }, rationale, team_reactions: reactions.slice(0, 3) };
}

export const NARRATOR_SYSTEM = `Kamu adalah kurator evaluasi kepemimpinan dan manajemen konflik organisasi (Leadr).
Tugasmu membuat debrief menyeluruh yang tajam, edukatif, dan memotivasi seorang ketua tim berdasarkan hasil akhir simulasi.

Format Keluaran JSON:
{
  "narrative": "Paragraf 1: Analisis capaian target dan dinamika emosional tim.\\n\\nParagraf 2: Pola kepemimpinan dan dampak strategis keputusan ketua.",
  "recommendations": ["Rekomendasi 1", "Rekomendasi 2", "Rekomendasi 3"]
}`;

export function fallbackNarrative(
  code: OutcomeCode,
  weakest: Dim,
  domain: DomainType = "tech_startup"
): { narrative: string; recommendations: string[] } {
  const dimNames: Record<Dim, string> = {
    komunikasi: "Komunikasi Dua Arah & Transparansi",
    empati: "Empati Emosional & Pencegahan Burnout",
    ketegasan: "Ketegasan Pembagian Tugas & Batas Waktu",
    krisis: "Mitigasi Risiko Teknis & Kontingensi Nyata",
  };

  let narrative = "";
  if (code === "VICTORY_100") {
    narrative =
      "Selamat! Proyek dan target organisasi berhasil diselesaikan 100% tuntas dengan tim yang tetap solid dan memiliki resiliensi tinggi. Kemampuanmu menyeimbangkan antara perlindungan fisik-mental anggota dan ketegasan mengejar target membuktikan kepemimpinan tingkat tinggi.\n\nSeluruh rekan kerja menaruh respek mendalam karena mereka merasa dihargai sebagai manusia seutuhnya, bukan sekadar alat pencapai target.";
  } else if (code === "COLLAPSE_MORALE_0") {
    narrative =
      "Krisis fatal terjadi: Moral tim anjlok hingga 0%. Tekanan tinggi yang tidak diimbangi empati memicu 'mental breakdown' dan kelelahan akut hingga rekan-rekanmu tidak sanggup lagi berkoordinasi.\n\nIni adalah pembelajaran berharga: dalam kepemimpinan, pencapaian target tidak akan pernah bermakna jika manusianya sudah tumbang terlebih dahulu.";
  } else if (code === "COLLAPSE_TRUST_0") {
    narrative =
      "Krisis fatal terjadi: Kepercayaan (Trust) tim runtuh hingga 0%. Anggota merasa ditinggalkan atau dijadikan kambing hitam dalam konflik, sehingga mereka memutuskan mengundurkan diri secara massal dari proyek.\n\nKepercayaan adalah modal paling berharga seorang pemimpin; sekali hilang di tengah krisis, koordinasi teknis dan organisasi akan berhenti total.";
  } else {
    narrative =
      "Simulasi berakhir dengan tim berhasil melewati badai konflik. Meskipun terdapat kompromi pada beberapa aspek, hubungan tim dan integritas organisasi masih terselamatkan untuk perbaikan di masa depan.\n\nKeputusanmu menunjukkan potensi besar yang dapat diasah lebih tajam lagi dengan latihan ketegasan dan mitigasi risiko.";
  }

  return {
    narrative,
    recommendations: [
      `Fokuskan peningkatan pada dimensi ${dimNames[weakest]}, yang menjadi titik paling krusial dalam simulasi ini.`,
      "Ketika anggota mulai menunjukkan kelelahan fisik atau kecemasan akut, prioritaskan pemulihan stamina sebelum memberikan instruksi baru.",
      "Manfaatkan status Synergy Buff (Morale & Trust > 75%) untuk melipatgandakan kecepatan progres tanpa membuat tim merasa dieksploitasi.",
    ],
  };
}
