import React, { useEffect, useRef, useState } from "react";
import { ChatMessage, Scenario, DomainType, Character } from "../types";
import {
  Send,
  ArrowRight,
  Clock,
  AlertCircle,
  Info,
  ChevronRight,
  Terminal,
  MessageSquare,
  AtSign,
  Scale,
} from "lucide-react";

interface ChatPanelProps {
  scenario: Scenario | null;
  messages: ChatMessage[];
  phase: "idle" | "evaluating" | "reacted" | "loadingNext";
  isGameOver: boolean;
  error: string | null;
  activeModel?: string;
  fallbackModelUsed?: boolean;
  onSend: (text: string) => void;
  onProceed: () => void;
}

function getQuickResponses(domain?: DomainType) {
  if (domain === "campus_org") {
    return [
      {
        label: "🛡️ Empatis & Solutif",
        text: "Teman-teman tolong tenang. @Maya dan divisi logistik, kalian istirahat dan makan siang dulu. @Fajar dan @Sarah, berkas nota dan surat komitmen biar kita koordinasikan bareng dekanat sekarang.",
      },
      {
        label: "⚡ Tegas & Rencana Kontingensi",
        text: "@Budi dan tim keamanan, pastikan jalur evakuasi aman. Batas waktu negosiasi sponsor jam 2 siang. Jika belum cair, kita pakai dana talangan darurat. Tidak ada yang saling tuding di forum.",
      },
      {
        label: "⚠️ Apatis / Menghindar",
        text: "Urus sendiri-sendiri aja lah, kalian kan udah kepala divisi. Jangan manja lempar masalah ke ketua terus.",
      },
    ];
  }
  if (domain === "corporate_agency") {
    return [
      {
        label: "🛡️ Empatis & Solutif",
        text: "@Reza istirahat dan minum obat dulu, kesehatanmu prioritas utama. @Kevin tim engineer jangan lembur di luar batas. @Amanda, biar aku yang dampingi dan jelaskan batasan SOW secara diplomatis ke Bu Ratna.",
      },
      {
        label: "⚡ Tegas & Rencana Kontingensi",
        text: "Kita tetapkan batas tegas: modul baru di luar SOW kita alihkan ke Phase 2 Addendum. @Kevin jam 5 sore ini kita freeze scope dan fokus stabilkan sistem UAT.",
      },
      {
        label: "⚠️ Apatis / Menghindar",
        text: "Kalian turutin aja semua maunya klien sampai pagi, resiko kerja di agency emang gitu.",
      },
    ];
  }
  if (domain === "social_drama") {
    return [
      {
        label: "🛡️ Empatis & Solutif",
        text: "Teman-teman tahan diri. @Fikri dan @Dita, bawa semua kuitansi ke ruang sekretariat untuk kita verifikasi bersama secara transparan. @Nadia, siapkan draf rilis klarifikasi resmi penyejuk.",
      },
      {
        label: "⚡ Tegas & Rencana Kontingensi",
        text: "Sebagai ketua, aku ambil tanggung jawab penuh. @Rio koordinasikan perwakilan divisi untuk audit internal 24 jam sebelum kita laporkan hasilnya ke Dekanat.",
      },
      {
        label: "⚠️ Apatis / Menghindar",
        text: "Bodo amat lah bubar aja sekalian himpunannya, bikin malu nama baik aja kalian.",
      },
    ];
  }
  return [
    {
      label: "🛡️ Empatis & Solutif",
      text: "@Rani kamu stop koding sekarang dan tidur 2 jam, kesehatanmu prioritas. Aku yang koordinasikan backend. @Sekar panitia urusanku, aku jamin sebelum jam 5 sore ada kejelasan.",
    },
    {
      label: "⚡ Tegas & Rencana Kontingensi",
      text: "@Dimas jika belum aktif sampai jam 2 siang, kita sepakat pangkas modul pembayaran dan pakai mock data untuk presentasi juri. @Bayu kunci konfigurasi server staging.",
    },
    {
      label: "⚠️ Apatis / Menghindar",
      text: "Biarin aja lah nanti juga muncul. Kalian lebay banget baru gitu aja nangis, kerjain sendiri-sendiri dong.",
    },
  ];
}

function renderMessageText(text: string, characters: Character[] = [], isPlayer = false) {
  const parts = text.split(/(@[a-zA-Z0-9_]+)/g);
  const knownNames = characters.map((c) => c.name.toLowerCase());

  return parts.map((part, idx) => {
    if (part.startsWith("@")) {
      const cleanName = part.slice(1).toLowerCase();
      const isKnown = knownNames.includes(cleanName);
      if (isPlayer) {
        return (
          <span
            key={idx}
            className={`inline-block font-semibold px-1 py-0.2 rounded text-[11px] sm:text-xs mx-0.5 ${
              isKnown
                ? "bg-blue-800 text-white border border-blue-400 font-bold"
                : "bg-blue-900/40 text-blue-100"
            }`}
          >
            {part}
          </span>
        );
      }
      return (
        <span
          key={idx}
          className={`inline-block font-semibold px-1 py-0.2 rounded text-[11px] sm:text-xs mx-0.5 ${
            isKnown
              ? "bg-blue-50 text-blue-700 border border-blue-200 font-bold"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function ChatPanel({
  scenario,
  messages,
  phase,
  isGameOver,
  error,
  activeModel,
  fallbackModelUsed,
  onSend,
  onProceed,
}: ChatPanelProps) {
  const [text, setText] = useState("");
  const [showContextDetails, setShowContextDetails] = useState(false);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const characters = scenario?.characters || [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || (phase !== "idle" && phase !== "reacted")) return;
    onSend(trimmed);
    setText("");
    setMentionQuery(null);
  };

  const handleUsePreset = (presetText: string) => {
    setText(presetText);
    textareaRef.current?.focus();
  };

  const handleInsertTag = (actorName: string) => {
    const tag = `@${actorName} `;
    if (!text.toLowerCase().includes(`@${actorName.toLowerCase()}`)) {
      setText((prev) => (prev.trim() ? `${prev.trim()} ${tag}` : tag));
    }
    textareaRef.current?.focus();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setText(newVal);

    // Detect if cursor is immediately after an '@' mention
    const cursorPos = e.target.selectionStart || newVal.length;
    const textBeforeCursor = newVal.slice(0, cursorPos);
    const match = textBeforeCursor.match(/@([a-zA-Z0-9_]*)$/);

    if (match) {
      setMentionQuery(match[1].toLowerCase());
    } else {
      setMentionQuery(null);
    }
  };

  const handleSelectMention = (actorName: string) => {
    if (!textareaRef.current) return;
    const cursorPos = textareaRef.current.selectionStart || text.length;
    const textBeforeCursor = text.slice(0, cursorPos);
    const textAfterCursor = text.slice(cursorPos);

    const replacedBefore = textBeforeCursor.replace(/@([a-zA-Z0-9_]*)$/, `@${actorName} `);
    setText(replacedBefore + textAfterCursor);
    setMentionQuery(null);

    setTimeout(() => {
      textareaRef.current?.focus();
      const newPos = replacedBefore.length;
      textareaRef.current?.setSelectionRange(newPos, newPos);
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionQuery !== null && e.key === "Escape") {
      setMentionQuery(null);
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const matchingCharacters =
    mentionQuery !== null
      ? characters.filter((c) => c.name.toLowerCase().includes(mentionQuery))
      : [];

  const presets = getQuickResponses(scenario?.domain);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs">
      {/* Header bar */}
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white font-mono text-xs font-bold">
              #{scenario?.index || 1}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <h2 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {scenario?.title || "Skenario Krisis"}
                </h2>
                {scenario?.urgency && (
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-semibold uppercase tracking-wide ${
                      scenario.urgency === "Kritis"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {scenario.urgency}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1 font-mono text-[11px] font-medium text-slate-600">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {scenario?.timeRemaining || "Dalam Skenario"}
                </span>
                {scenario?.archetype && (
                  <>
                    <span>·</span>
                    <span className="text-[11px] font-medium text-indigo-700 line-clamp-1">
                      {scenario.archetype}
                    </span>
                  </>
                )}
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setShowContextDetails((v) => !v)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Info className="h-3 w-3" />
                  {showContextDetails ? "Tutup Dilema" : "Lihat Dilema & Latar"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <span className="font-medium text-slate-600">Sesi Aktif</span>
            </div>
          </div>
        </div>

        {/* Collapsible Context & Dilemma Drawer */}
        {showContextDetails && (
          <div className="mt-3 space-y-2.5 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
            {scenario?.context && (
              <div>
                <span className="font-semibold text-slate-900 block mb-1">
                  Situasi Lapangan:
                </span>
                <p>{scenario.context}</p>
              </div>
            )}
            {scenario?.dilemmaSummary && (
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center gap-1.5 font-semibold text-indigo-900 mb-1">
                  <Scale className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Dilema Manajerial ({scenario.archetype || "Dilema Kepemimpinan"}):</span>
                </div>
                <p className="text-slate-700 italic bg-white/80 p-2.5 rounded border border-indigo-100 leading-relaxed">
                  {scenario.dilemmaSummary}
                </p>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Messages Stream */}
      <div className="flex-1 space-y-3.5 overflow-y-auto p-4 bg-slate-50/50">
        {messages.map((m, idx) => {
          const isPlayer = m.sender === "Kamu";

          return (
            <div
              key={idx}
              className={`flex flex-col ${isPlayer ? "items-end" : "items-start"}`}
            >
              <div className="flex items-baseline gap-1.5 mb-1 px-1">
                <span className="text-xs font-bold text-slate-800">
                  {m.sender}
                </span>
                {m.role && (
                  <span className="text-[11px] text-slate-500">
                    · {m.role}
                  </span>
                )}
                {m.timestamp && (
                  <span className="text-[10px] font-mono text-slate-400">
                    {m.timestamp}
                  </span>
                )}
              </div>

              <div
                className={`max-w-[85%] rounded-md px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed border ${
                  isPlayer
                    ? "bg-blue-600 text-white border-blue-700 shadow-2xs"
                    : "bg-white text-slate-900 border-slate-200 shadow-2xs"
                }`}
              >
                {renderMessageText(m.text, characters, isPlayer)}
              </div>
            </div>
          );
        })}

        {/* Phase Loading Indicator */}
        {phase === "evaluating" && (
          <div className="flex items-center gap-2 text-xs text-slate-500 p-2 font-medium">
            <div className="flex space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:0.4s]" />
            </div>
            <span>Anggota tim sedang membaca instruksimu dan merespons...</span>
          </div>
        )}

        {phase === "loadingNext" && (
          <div className="flex items-center gap-2 text-xs text-slate-500 p-2 font-medium">
            <Clock className="h-3.5 w-3.5 animate-spin text-slate-400" />
            <span>Memuat perkembangan skenario selanjutnya...</span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Input / Control Footer */}
      <footer className="border-t border-slate-200 bg-white p-3.5 space-y-3">
        {/* Game Over Banner */}
        {isGameOver ? (
          <div className="space-y-2">
            <div className="rounded-md border border-slate-200 bg-slate-100 p-2.5 text-center text-xs font-semibold text-slate-800">
              Kondisi Selesai Tercapai (Target 100% atau Morale/Trust 0%)
            </div>
            <button
              type="button"
              onClick={onProceed}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <span>Buka Kesimpulan &amp; Skor Akhir</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Advance Crisis button when user has reacted */}
            {phase === "reacted" && (
              <div className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-xs">
                <span className="text-[11px] text-slate-600 font-medium">
                  Respons tim diterima. Kamu dapat membalas lagi atau lanjut ke tahapan berikutnya:
                </span>
                <button
                  type="button"
                  onClick={onProceed}
                  className="flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <span>Lanjut Skenario</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Quick Tag Chips Bar */}
            {characters.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <AtSign className="h-3 w-3 text-blue-600" />
                  Tag Aktor:
                </span>
                {characters.map((c) => {
                  const isTagged = text.toLowerCase().includes(`@${c.name.toLowerCase()}`);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleInsertTag(c.name)}
                      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-semibold transition cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 ${
                        isTagged
                          ? "bg-blue-600 text-white border-blue-700 shadow-2xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-700"
                      }`}
                      title={`Tag @${c.name} (${c.role})`}
                    >
                      <span className={isTagged ? "text-white font-bold" : "text-blue-600 font-bold"}>@</span>
                      <span>{c.name}</span>
                      <span
                        className={`text-[10px] font-normal hidden sm:inline ${
                          isTagged ? "text-blue-100" : "text-slate-400"
                        }`}
                      >
                        · {c.role}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Decision Preset Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pb-1 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Opsi Arah Keputusan:
              </span>
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleUsePreset(preset.text)}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Input Form with Floating @ Mention Autocomplete */}
            <form onSubmit={handleSubmit} className="space-y-1 relative">
              <label htmlFor="leader-response-input" className="sr-only">
                Ketik instruksi atau tanggapanmu sebagai Ketua tim
              </label>

              {/* Floating @ Mention Autocomplete dropdown */}
              {mentionQuery !== null && matchingCharacters.length > 0 && (
                <div className="absolute bottom-full left-0 mb-1 w-64 rounded-md border border-slate-200 bg-white shadow-md z-30 overflow-hidden py-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                    <span>Pilih Aktor untuk Ditag</span>
                    <span className="font-mono text-[9px] text-slate-400">Esc tutup</span>
                  </div>
                  {matchingCharacters.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleSelectMention(c.name)}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-left text-xs text-slate-800 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-blue-600">@{c.name}</span>
                        <span className="text-[11px] text-slate-500">· {c.role}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {c.fitness.stamina}% Stamina
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="relative">
                <textarea
                  id="leader-response-input"
                  ref={textareaRef}
                  value={text}
                  onChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                  disabled={phase === "evaluating" || phase === "loadingNext"}
                  placeholder="Ketik instruksi atau keputusan... Gunakan @Nama untuk men-tag aktor tertentu (Enter kirim, Shift+Enter baris baru)"
                  rows={2}
                  maxLength={1200}
                  className="w-full resize-none rounded-md border border-slate-300 bg-white p-2.5 pr-20 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none transition disabled:opacity-50"
                />

                <div className="absolute bottom-2.5 right-2 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    {text.length}/1200
                  </span>
                  <button
                    type="submit"
                    disabled={!text.trim() || phase === "evaluating" || phase === "loadingNext"}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white shadow-2xs hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 transition cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
                    title="Kirim Instruksi"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
                <span>Tips: Tag aktor dengan <code className="font-bold text-blue-600">@Nama</code> agar instruksi direspons langsung oleh mereka.</span>
              </div>
            </form>
          </div>
        )}
      </footer>
    </div>
  );
}
