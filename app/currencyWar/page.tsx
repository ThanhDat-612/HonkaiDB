"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import styles from "./page.module.css";


// ── CONFIG & i18n ────────────────────────────────────────────────
type Lang = "en" | "vi";

const T: Record<string, Record<Lang, string>> = {
  title:    { en: "CURRENCY WAR",        vi: "CHIẾN TRANH TIỀN TỆ" },
  synergy:  { en: "SYNERGY",             vi: "LIÊN KẾT" },
  relicInv: { en: "RELIC INVENTORY",     vi: "KHO THÁNH TÍCH" },
  charPool: { en: "CHARACTER POOL",      vi: "HỒ NHÂN VẬT" },
  clearAll: { en: "CLEAR ALL",           vi: "XÓA TẤT CẢ" },
  team:     { en: "TEAM",               vi: "ĐỘI CHÍNH" },
  reserve:  { en: "RESERVE",            vi: "DỰ BỊ" },
  loading:  { en: "LOADING...",          vi: "ĐANG TẢI..." },
};

// Định nghĩa mốc kích hoạt cho từng Bond (Dựa trên data của bạn)
const BOND_THRESHOLDS: Record<string, number[]> = {
  "Cosmic Scholar": [2, 4, 6],
  "DoT": [2, 4, 6],
  "Follow-up Attack": [3, 5, 7],
  "Break": [2, 4, 6, 8,10],
  "Stellaron Hunters": [2, 3,4]
};

const t = (key: string, lang: Lang) => T[key]?.[lang] ?? key;

// ── TYPES ────────────────────────────────────────────────────────
type Character = {
  _id: string;
  cost: number;
  icon: string;
  field: string;
  bond: { en: string[]; vi: string[] };
};
const normalizeField = (field: string | undefined) => {
  const value = String(field || "").trim().toLowerCase();
  if (value === "all" || value === "both" || value === "any") return "all";
  if (value === "on" || value === "on field" || value === "on_field" || value === "onfield") return "on";
  if (value === "off" || value === "off field" || value === "off_field" || value === "offfield") return "off";
  return "all";
};

const canPlaceFieldInSlot = (field: string | undefined, isTop: boolean) => {
  const normalized = normalizeField(field);
  if (normalized === "all") return true;
  if (normalized === "on") return isTop;
  if (normalized === "off") return !isTop;
  return true;
};

const normalizeBondArray = (bonds: string[] | undefined) =>
  (bonds || [])
    .flatMap((bond) => bond.split(","))
    .map((bond) => bond.trim())
    .filter(Boolean);

// ── CONSTANTS ────────────────────────────────────────────────────
const TOP_SLOTS = 4;
const BOT_SLOTS = 9;
const TOTAL_SLOTS = TOP_SLOTS + BOT_SLOTS;

const costColor = (cost: number) =>
   cost === 5 ? "#edfd0d" : cost === 4 ? "#aa2bf3" : cost === 3 ? "#06c0f8" : cost === 2 ? "#05ee37" : "#727272";

const getBondThresholds = (name: string, bondNameMap?: Map<string, string>) => {
  const normalizedName = name.trim().toLowerCase();
  const mappedName = bondNameMap?.get(name) ?? bondNameMap?.get(normalizedName) ?? name;

  if (BOND_THRESHOLDS[mappedName]) return BOND_THRESHOLDS[mappedName];
  for (const key of Object.keys(BOND_THRESHOLDS)) {
    if (key.trim().toLowerCase() === normalizedName) return BOND_THRESHOLDS[key];
  }

  return [2, 4]; // Mặc định nếu không có data cụ thể
};

const SPECIAL_SYNERGIES = new Set<string>([]);

const getSynergyBgTier = (count: number, thresholds: number[]) => {
  if (count < thresholds[0]) return "";
  const sorted = [...thresholds].sort((a, b) => a - b);
  if (sorted.length >= 3 && count >= sorted[2]) return "gold.webp";
  if (sorted.length >= 2 && count >= sorted[1]) return "silver.webp";
  return "bronze.webp";
};

const getSynergyBgImage = (name: string, count: number, thresholds: number[]) => {
  if (SPECIAL_SYNERGIES.has(name)) return "special.webp";
  const tierImage = getSynergyBgTier(count, thresholds);
  return tierImage ? `/currencyWar/synergy/bg/${tierImage}` : "";
};

const getSynergyIconImage = (name: string) => {
  return `/currencyWar/synergy/${encodeURIComponent(name)}.webp`;
};

const getSynergyIconName = (name: string, map: Map<string, string>) => {
  const mapped = map.get(name);
  if (mapped) return mapped;
  const normalized = name.trim().toLowerCase();
  for (const [key, value] of map.entries()) {
    if (key.trim().toLowerCase() === normalized) return value;
  }
  return name;
};

function CharAvatar({ char, size = 48, full = false }: { char: Character; size?: number; full?: boolean }) {
  const [imgErr, setImgErr] = useState(false);
  const color = costColor(char.cost);
  const baseStyle = {
    objectFit: "cover",
    borderRadius: 8,
    border: `2px solid ${color}`,
    display: "block",
  } as const;

  if (char.icon && !imgErr) {
    return (
      <img
        src={char.icon}
        alt={char._id}
        width={full ? "100%" : size}
        height={full ? "100%" : size}
        onError={() => setImgErr(true)}
        style={full ? { ...baseStyle, width: "100%", height: "100%" } : { ...baseStyle, width: size, height: size }}
      />
    );
  }
  return (
    <div style={full ? {
      ...baseStyle,
      width: "100%",
      height: "100%",
      minHeight: 0,
      background: undefined,
    } : {
      ...baseStyle,
      width: size,
      height: size,
      background: undefined,
    }}>
      <span style={{
        display: "inline-flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.3,
        fontWeight: 700,
        color,
      }}>{char._id.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

function Slot({ data, onDrop, onDragStart, onDragEnd, isTop, dragField, invalid }: any) {
  const [over, setOver] = useState(false);
  const accent = data ? costColor(data.cost) : isTop ? "#f59e0b" : "#60a5fa";
  const isValidDrop = !dragField || canPlaceFieldInSlot(dragField, isTop);

  return (
    <div
      className={styles.teamSlot}
      style={{
        border: over
          ? `3px solid ${isValidDrop ? accent : "#ef4444"}`
          : invalid
            ? "3px solid #ef4444"
            : undefined,
        boxShadow: over
          ? `0 0 22px ${isValidDrop ? `${accent}44` : "rgba(239, 68, 68, 0.55)"}`
          : invalid
            ? "inset 0 0 0 4px rgba(239, 68, 68, 0.35)"
            : undefined,
      }}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragEnter={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOver(false);
        onDrop();
      }}
      onDragEnd={() => { setOver(false); onDragEnd?.(); }}
      draggable={!!data}
      onDragStart={onDragStart}
    >
      {data ? (
        <div className={styles.slotContent}>
          <CharAvatar char={data} full />
          <div className={styles.costBadge} style={{ background: accent }}>{data.cost}</div>
        </div>
      ) : <span className={styles.slotEmpty}>+</span>}
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────
export default function Page() {
  const [lang, setLang] = useState<Lang>("vi");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<(Character | null)[]>(Array(TOTAL_SLOTS).fill(null));
  const [searchTerm, setSearchTerm] = useState("");
  const [dragField, setDragField] = useState<string | null>(null);
  const [invalidSlots, setInvalidSlots] = useState<Set<number>>(new Set());
  const dragRef = useRef<{ data: Character; fromIndex?: number } | null>(null);

  const bondNameMap = useMemo(() => {
    const map = new Map<string, string>();
    characters.forEach((char) => {
      const viNames = normalizeBondArray(char.bond.vi);
      const enNames = normalizeBondArray(char.bond.en);
      // Map: tên EN -> tên EN (để lookup)
      enNames.forEach((enName) => map.set(enName, enName));
      // Map: tên VI -> tên EN tương ứng theo index
      viNames.forEach((viName, idx) => {
        if (enNames[idx]) map.set(viName, enNames[idx]);
      });
    });
    return map;
  }, [characters]);

  useEffect(() => {
    // Đường dẫn này khớp với thư mục app/api/currency-war/character chúng ta vừa tạo
    fetch("/api/currency-war/character")
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching characters:", err));
  }, []);

  // Logic lọc nhân vật trong Pool
  const filteredChars = useMemo(() => {
    return characters.filter(c => {
      const normalizedBonds = normalizeBondArray(c.bond[lang]);
      return (
        c._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        normalizedBonds.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }, [characters, searchTerm, lang]);

  // Logic tính toán Synergy
  const activeSynergies = useMemo(() => {
    const charMap = new Map<string, Character>();
    slots.forEach((s) => { if (s) charMap.set(s._id, s); });
    const uniqueChars = Array.from(charMap.values());

    const counts: Record<string, number> = {};
    uniqueChars.forEach((c) => {
      normalizeBondArray(c.bond[lang]).forEach((b) => { counts[b] = (counts[b] || 0) + 1; });
    });

    return Object.entries(counts).map(([name, count]) => {
      const thresholds = getBondThresholds(name, bondNameMap);
      const maxTier = thresholds[thresholds.length - 1];
      const activeTier = [...thresholds].reverse().find((t) => count >= t) || 0;
      return { name, count, activeTier, maxTier, isActive: count >= thresholds[0] };
    }).sort((a, b) => (a.isActive === b.isActive ? b.count - a.count : a.isActive ? -1 : 1));
  }, [slots, lang]);

  const onDragStartChar = (e: any, c: Character, fromIndex?: number) => {
    e.dataTransfer.effectAllowed = "move";
    if (!e.dataTransfer.getData("text/plain")) {
      e.dataTransfer.setData("text/plain", c._id);
    }
    dragRef.current = { data: c, fromIndex };
    setDragField(c.field);
  };

  const onDragEndChar = () => {
    dragRef.current = null;
    setDragField(null);
  };

  const onDropToSlot = (toIndex: number) => {
    if (!dragRef.current) return;
    const fromField = dragRef.current.data.field;
    const isTopSlot = toIndex < TOP_SLOTS;
    const isValid = canPlaceFieldInSlot(fromField, isTopSlot);

    const alreadyInSlot = slots.some((s, i) => s?._id === dragRef.current!.data._id && i !== dragRef.current!.fromIndex);
    if (alreadyInSlot) {
      dragRef.current = null;
      setDragField(null);
      return;
    }

    const next = [...slots];
    const nextInvalid = new Set(invalidSlots);
    if (dragRef.current.fromIndex !== undefined) {
      next[dragRef.current.fromIndex] = null;
      nextInvalid.delete(dragRef.current.fromIndex);
    }
    next[toIndex] = dragRef.current.data;
    if (!isValid) {
      nextInvalid.add(toIndex);
    } else {
      nextInvalid.delete(toIndex);
    }

    setSlots(next);
    setInvalidSlots(nextInvalid);
    dragRef.current = null;
    setDragField(null);
  };

  const onDropToRemove = () => {
    if (dragRef.current?.fromIndex !== undefined) {
      const next = [...slots];
      next[dragRef.current.fromIndex] = null;
      const nextInvalid = new Set(invalidSlots);
      nextInvalid.delete(dragRef.current.fromIndex);
      setSlots(next);
      setInvalidSlots(nextInvalid);
    }
    dragRef.current = null;
    setDragField(null);
  };

  return (
    <div className={styles.parent}>
      <div className={styles.div1}>
        <div className={styles.logo}>{t("title", lang)}</div>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Search characters or bonds..." 
            className={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.langToggle}>
          <button className={`${styles.langBtn} ${lang === "vi" ? styles.langBtnActive : ""}`} onClick={() => setLang("vi")}>VI</button>
          <button className={`${styles.langBtn} ${lang === "en" ? styles.langBtnActive : ""}`} onClick={() => setLang("en")}>EN</button>
        </div>
      </div>

      <div className={styles.div2}>
        <h3 className={styles.panelTitle}>{t("synergy", lang)}</h3>
        <div className={styles.synergyList}>
          {activeSynergies.map((s) => {
            const thresholds = getBondThresholds(s.name, bondNameMap);
            const synergyBgImage = getSynergyBgImage(s.name, s.count, thresholds);
            const synergyIconName = getSynergyIconName(s.name, bondNameMap);
            return (
              <div key={s.name} className={styles.synergyItem}>
                {/* Icon với ảnh bg tier làm nền phía sau */}
                <div className={styles.synergyIconWrap}>
                  {synergyBgImage && (
                    <img
                      src={synergyBgImage}
                      alt=""
                      className={styles.synergyIconBg}
                    />
                  )}
                  <img src={getSynergyIconImage(synergyIconName)} alt={s.name} className={styles.synergyIcon} />
                </div>

                {/* Tên + các pip threshold cộng dồn */}
                <div className={styles.synergyInfo}>
                  <span className={styles.synergyName}>{s.name}</span>
                  <div className={styles.synergyPips}>
                    {thresholds.map((threshold, idx) => {
                      const isReached = s.count >= threshold;
                      const tierLabel = idx === 0 ? "bronze" : idx === 1 ? "silver" : "gold";
                      return (
                        <div
                          key={threshold}
                          className={`${styles.synergyPip} ${isReached ? styles[`pip_${tierLabel}`] : styles.pipInactive}`}
                          title={`${threshold} nhân vật`}
                        >
                          {threshold}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <span className={styles.synergyCount}>{s.count}/{s.maxTier}</span>
              </div>
            );
          })}
        </div>
        <button className={styles.clearBtn} onClick={() => { setSlots(Array(TOTAL_SLOTS).fill(null)); setInvalidSlots(new Set()); }}>{t("clearAll", lang)}</button>
      </div>

      <div className={styles.warMain} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onDropToRemove(); }}>
        <div className={styles.teamRow} style={{ gridTemplateColumns: `repeat(${TOP_SLOTS}, 85px)` }}>
          {slots.slice(0, TOP_SLOTS).map((s, i) => (
            <Slot
              key={i}
              data={s}
              isTop
              invalid={invalidSlots.has(i)}
              dragField={dragField}
              onDrop={() => onDropToSlot(i)}
              onDragStart={(e: any) => onDragStartChar(e, s!, i)}
              onDragEnd={onDragEndChar}
            />
          ))}
        </div>
        <div className={styles.teamRow} style={{ gridTemplateColumns: `repeat(${BOT_SLOTS}, 70px)` }}>
          {slots.slice(TOP_SLOTS).map((s, i) => (
            <Slot
              key={i + TOP_SLOTS}
              data={s}
              isTop={false}
              invalid={invalidSlots.has(i + TOP_SLOTS)}
              dragField={dragField}
              onDrop={() => onDropToSlot(i+TOP_SLOTS)}
              onDragStart={(e: any) => onDragStartChar(e, s!, i+TOP_SLOTS)}
              onDragEnd={onDragEndChar}
            />
          ))}
        </div>
      </div>

      <div className={styles.charPool}>
        <div className={styles.charPoolList}>
          {loading ? <span>{t("loading", lang)}</span> : filteredChars.map((c) => (
            <div
              key={c._id}
              className={styles.charChip}
              draggable
              onDragStart={(e) => onDragStartChar(e, c)}
              onDragEnd={onDragEndChar}
              style={{ borderColor: `${costColor(c.cost)}33` }}
            >
              <CharAvatar char={c} size={40} />
              <div className={styles.charChipName}>{c._id.replace(/_/g, " ")}</div>
              <div className={styles.charChipBond}>
                {normalizeBondArray(c.bond[lang]).map((bond) => (
                  <span key={bond}>{bond}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}