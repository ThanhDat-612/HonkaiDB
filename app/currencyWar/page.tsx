"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

// ── i18n ────────────────────────────────────────────────────────
type Lang = "en" | "vi";
const T: Record<string, Record<Lang, string>> = {
  title:    { en: "CURRENCY WAR",        vi: "CHIẾN TRANH TIỀN TỆ" },
  synergy:  { en: "SYNERGY",             vi: "CỘNG HƯỞNG" },
  relicInv: { en: "RELIC INVENTORY",     vi: "KHO THÁNH TÍCH" },
  charPool: { en: "CHARACTER POOL",      vi: "HỒ NHÂN VẬT" },
  clearAll: { en: "CLEAR ALL",           vi: "XÓA TẤT CẢ" },
  team:     { en: "TEAM",               vi: "ĐỘI CHÍNH" },
  reserve:  { en: "RESERVE",            vi: "DỰ BỊ" },
  loading:  { en: "Loading...",          vi: "Đang tải..." },
  analyse:  { en: "ANALYSE",            vi: "PHÂN TÍCH" },
  import:   { en: "IMPORT",             vi: "NHẬP" },
  save:     { en: "SAVE",               vi: "LƯU" },
};
const t = (key: string, lang: Lang) => T[key]?.[lang] ?? key;

// ── TYPES (mirrors MongoDB currencyWar collection document) ───────
type Character = {
  _id: string;
  cost: number;
  icon: string;           // e.g. "/currencyWar/char/asta.webp"
  field: string;
  bond: { en: string[]; vi: string[] };
};

// ── STATIC DATA (synergy/relics — not from currencyWar char collection) ──
const MOCK_RELICS = [
  { _id: "r1", name: { en: "Musketeer of Wild Wheat",          vi: "Xạ Thủ Lúa Mì Hoang" } },
  { _id: "r2", name: { en: "Messenger Traversing Hackerspace", vi: "Sứ Giả Không Gian Hack" } },
  { _id: "r3", name: { en: "Longevous Disciple",               vi: "Học Đồ Trường Thọ" } },
  { _id: "r4", name: { en: "Rutilant Arena",                   vi: "Đấu Trường Rực Rỡ" } },
];

const MOCK_SYNERGY = [
  { _id: "s1", name: { en: "Hypercarry Core",  vi: "Nòng Cốt Siêu Mạnh" }, count: "2/4", active: false },
  { _id: "s2", name: { en: "DoT Resonance",    vi: "Cộng Hưởng DoT" },     count: "3/3", active: true },
  { _id: "s3", name: { en: "Break Effect",     vi: "Hiệu Ứng Phá Vỡ" },   count: "1/2", active: false },
];

// ── LAYOUT: 4 top + 9 bottom ─────────────────────────────────────
const TOP_SLOTS = 4;
const BOT_SLOTS = 9;
const TOTAL_SLOTS = TOP_SLOTS + BOT_SLOTS;

// ── COST COLOR HELPER ─────────────────────────────────────────────
const costColor = (cost: number) =>
  cost === 3 ? "#f59e0b" : cost === 2 ? "#60a5fa" : "#22c55e";

// ── CHAR AVATAR — uses icon URL from MongoDB, fallback to initials ─
function CharAvatar({ char, size = 48 }: { char: Character; size?: number }) {
  const [imgErr, setImgErr] = useState(false);
  const color = costColor(char.cost);

  if (char.icon && !imgErr) {
    return (
      <img
        src={char.icon}
        alt={char._id}
        width={size}
        height={size}
        onError={() => setImgErr(true)}
        style={{
          objectFit: "cover",
          borderRadius: 4,
          border: `2px solid ${color}88`,
          flexShrink: 0,
          display: "block",
        }}
      />
    );
  }
  // Fallback initials
  return (
    <div
      style={{
        width: size, height: size, borderRadius: 4,
        background: `${color}22`, border: `2px solid ${color}88`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.3, fontWeight: 700, color, flexShrink: 0,
      }}
    >
      {char._id.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ── SLOT COMPONENT ────────────────────────────────────────────────
function Slot({
  data, onDrop, onDragStart, isTop,
}: {
  data: Character | null;
  onDrop: () => void;
  onDragStart: (e: React.DragEvent) => void;
  isTop: boolean;
}) {
  const [over, setOver] = useState(false);
  const accent = isTop ? "#f59e0b" : "#60a5fa";
  return (
    <div
      className={styles.teamSlot}
      style={{
        border: over ? `2px solid ${accent}` : undefined,
        boxShadow: over ? `0 0 18px ${accent}44` : undefined,
        background: data ? "rgba(30,41,59,0.85)" : over ? `${accent}11` : undefined,
      }}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={() => { setOver(false); onDrop(); }}
      draggable={!!data}
      onDragStart={onDragStart}
    >
      {data ? (
        <>
          <div
            className={styles.costBadge}
            style={{ background: costColor(data.cost) }}
          >
            {data.cost}
          </div>
          <CharAvatar char={data} size={isTop ? 48 : 38} />
          <div className={styles.slotName}>{data._id.replace(/_/g, " ")}</div>
        </>
      ) : (
        <span className={styles.slotEmpty}>+</span>
      )}
    </div>
  );
}

// ── PAGE COMPONENT ────────────────────────────────────────────────
export default function Page() {
  const [lang, setLang]         = useState<Lang>("vi");
  const [activeNav, setActiveNav] = useState("team");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading]   = useState(true);
  const [slots, setSlots]       = useState<(Character | null)[]>(Array(TOTAL_SLOTS).fill(null));
  const dragRef = useRef<{ data: Character; fromIndex?: number } | null>(null);

  // ── Fetch characters từ MongoDB qua API route ─────────────────
  useEffect(() => {
    fetch("/api/currency-war/characters")
      .then((r) => r.json())
      .then((data: Character[]) => { setCharacters(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // ── Drag handlers ─────────────────────────────────────────────
  const onDragStartChar = (e: React.DragEvent, c: Character, fromIndex?: number) => {
    dragRef.current = { data: c, fromIndex };
  };

  const onDropToSlot = (toIndex: number) => {
    if (!dragRef.current) return;
    const next = [...slots];
    if (dragRef.current.fromIndex !== undefined) next[dragRef.current.fromIndex] = null;
    next[toIndex] = dragRef.current.data;
    setSlots(next);
    dragRef.current = null;
  };

  // Kéo nhân vật ra khỏi sân → xóa
  const onDropToRemove = () => {
    if (dragRef.current?.fromIndex !== undefined) {
      const next = [...slots];
      next[dragRef.current.fromIndex] = null;
      setSlots(next);
    }
    dragRef.current = null;
  };

  const clearAll = () => setSlots(Array(TOTAL_SLOTS).fill(null));

  const navItems: { key: string; label: Record<Lang, string> }[] = [
    { key: "team",    label: { en: "TEAM",    vi: "ĐỘI" } },
    { key: "analyse", label: { en: "ANALYSE", vi: "PHÂN TÍCH" } },
    { key: "import",  label: { en: "IMPORT",  vi: "NHẬP" } },
    { key: "save",    label: { en: "SAVE",    vi: "LƯU" } },
  ];

  return (
    <div className={styles.parent}>
      {/* ── NAVBAR ── */}
      <div className={styles.div1}>
        <div className={styles.logo}>{t("title", lang)}</div>

        <nav className={styles.navMenu}>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`${styles.navBtn} ${activeNav === item.key ? styles.navBtnActive : ""}`}
              onClick={() => setActiveNav(item.key)}
            >
              {item.label[lang]}
            </button>
          ))}
        </nav>

        <div className={styles.langToggle}>
          <button className={`${styles.langBtn} ${lang === "vi" ? styles.langBtnActive : ""}`} onClick={() => setLang("vi")}>VI</button>
          <span className={styles.langDivider}>|</span>
          <button className={`${styles.langBtn} ${lang === "en" ? styles.langBtnActive : ""}`} onClick={() => setLang("en")}>EN</button>
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      <div className={styles.div2}>
        <h3 className={styles.panelTitle}>{t("synergy", lang)}</h3>
        {MOCK_SYNERGY.map((s) => (
          <div key={s._id} className={styles.synergyItem}
            style={{ borderLeftColor: s.active ? "#f59e0b" : "#334155" }}>
            <span>{s.name[lang]}</span>
            <span className={styles.synergyCount} style={{ color: s.active ? "#f59e0b" : "#475569" }}>
              {s.count}
            </span>
          </div>
        ))}
        <button className={styles.clearBtn} onClick={clearAll}>
          {t("clearAll", lang)}
        </button>
      </div>

      {/* ── MAIN TEAM AREA ── */}
      <div
        className={styles.warMain}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDropToRemove}
      >
        {/* ROW 1 — 4 slots (đội chính) */}
        <div className={styles.rowLabel}>
          <span className={styles.rowLabelBadge} style={{ background: "#f59e0b22", color: "#f59e0b", borderColor: "#f59e0b44" }}>
            {t("team", lang)}
          </span>
        </div>
        <div className={styles.teamRow} style={{ gridTemplateColumns: `repeat(${TOP_SLOTS}, 85px)` }}>
          {Array.from({ length: TOP_SLOTS }).map((_, i) => (
            <Slot key={i} data={slots[i]} isTop
              onDrop={() => onDropToSlot(i)}
              onDragStart={(e) => onDragStartChar(e, slots[i]!, i)}
            />
          ))}
        </div>

        {/* ROW 2 — 9 slots (dự bị) */}
        <div className={styles.rowLabel}>
          <span className={styles.rowLabelBadge} style={{ background: "#60a5fa22", color: "#60a5fa", borderColor: "#60a5fa44" }}>
            {t("reserve", lang)}
          </span>
        </div>
        <div className={styles.teamRow} style={{ gridTemplateColumns: `repeat(${BOT_SLOTS}, 70px)` }}>
          {Array.from({ length: BOT_SLOTS }).map((_, i) => {
            const idx = i + TOP_SLOTS;
            return (
              <Slot key={idx} data={slots[idx]} isTop={false}
                onDrop={() => onDropToSlot(idx)}
                onDragStart={(e) => onDragStartChar(e, slots[idx]!, idx)}
              />
            );
          })}
        </div>
      </div>

      {/* ── CHARACTER POOL ── */}
      <div className={styles.charPool} onDragOver={(e) => e.preventDefault()} onDrop={onDropToRemove}>
        <div className={styles.charPoolLabel}>{t("charPool", lang)}</div>
        <div className={styles.charPoolList}>
          {loading ? (
            <span style={{ color: "#475569", fontSize: 12 }}>{t("loading", lang)}</span>
          ) : (
            characters.map((c) => (
              <div key={c._id} className={styles.charChip} draggable onDragStart={(e) => onDragStartChar(e, c)}>
                <CharAvatar char={c} size={42} />
                <div className={styles.charChipName}>{c._id.replace(/_/g, " ")}</div>
                <div className={styles.charChipBond}>{c.bond[lang].join(" · ")}</div>
                <div className={styles.costDots}>
                  {Array.from({ length: c.cost }).map((_, i) => (
                    <span key={i} className={styles.costDot} style={{ background: costColor(c.cost) }} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── RELIC PANEL ── */}
      <div className={styles.relicPanel}>
        <h3 className={styles.panelTitle}>{t("relicInv", lang)}</h3>
        {MOCK_RELICS.map((r) => (
          <div key={r._id} className={styles.relicChip}>
            <div className={styles.relicIcon}>R</div>
            <span>{r.name[lang]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}