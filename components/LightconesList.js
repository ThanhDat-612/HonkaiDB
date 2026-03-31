"use client";

import { useState } from "react";
import styles from "../app/page.module.css";

// ─── Đổi màu số trong [[...]] ────────────────────────────────
function formatDesc(text, lang) {
  const str = typeof text === "object" ? (text?.[lang] || text?.en || "") : (text || "");
  if (!str) return null;

  return str.split("\n").map((line, li) => {
    const parts = line.split(/(\[\[.*?\]\])/g);
    return (
      <p key={li} style={{ margin: "0 0 8px 0", fontSize: "15px", lineHeight: "1.75" }}>
        {parts.map((part, pi) =>
          part.startsWith("[[") && part.endsWith("]]") ? (
            <span key={pi} className={styles.lcHighlight}>
              {part.slice(2, -2)}
            </span>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

const PATH_COLOR = {
  destruction: "#f87171", hunt: "#f59e0b", erudition: "#60a5fa",
  harmony: "#c084fc", nihility: "#a78bfa", preservation: "#34d399",
  abundance: "#6ee7b7", remembrance: "#67e8f9", elation: "#fb923c",
};

const PATHS = [
  "destruction","hunt","erudition","harmony",
  "nihility","preservation","abundance","remembrance","elation"
];

// ─── Helper: build đường dẫn ảnh ────────────────────────────
// /lightcones/{rarity}/{Path}/{_id}.webp
// vd: /lightcones/5/Elation/yaoguang.webp
function lcImg(lc) {
  return `/lightcones/${lc.rarity}/${lc.path}/${lc._id}.webp`;
}

// ─── CARD ────────────────────────────────────────────────────
function LightConeCard({ lc, lang, onClick }) {
  const pathKey   = lc.path?.toLowerCase();
  const pathColor = PATH_COLOR[pathKey] || "#60a5fa";
  const nameStr   = typeof lc.name === "object" ? (lc.name?.[lang] || lc.name?.en) : lc.name;

  return (
    <div
      className={styles.lcCard}
      style={{ "--path-color": pathColor }}
      onClick={onClick}
    >
      <div className={styles.lcRarityBadge}>{"⭐".repeat(lc.rarity)}</div>

      <div className={styles.lcImageWrapper}>
        <img
          src={lcImg(lc)}
          alt={nameStr}
          className={styles.lcImage}
          loading="lazy"
          decoding="async"
          onError={(e) => { e.target.src = "/placeholder.webp"; }}
        />
        <div className={styles.lcImageOverlay} />
      </div>

      <div className={styles.lcInfo}>
        <img
          src={`/paths/${pathKey}.webp`}
          alt={lc.path}
          className={styles.lcPathIcon}
          loading="lazy"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className={styles.lcText}>
          <h4 className={styles.lcName}>{nameStr}</h4>
          <p className={styles.lcPath}>{lc.path}</p>
        </div>
      </div>

      <div className={styles.lcStats}>
        <span>ATK <strong>{lc.stat?.atk ?? "—"}</strong></span>
        <span>HP  <strong>{lc.stat?.hp  ?? "—"}</strong></span>
        <span>DEF <strong>{lc.stat?.def ?? "—"}</strong></span>
      </div>
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────
function LightConeModal({ lc, lang, onClose }) {
  if (!lc) return null;
  const pathKey   = lc.path?.toLowerCase();
  const pathColor = PATH_COLOR[pathKey] || "#60a5fa";
  const nameStr   = typeof lc.name === "object" ? (lc.name?.[lang] || lc.name?.en) : lc.name;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div
        className={styles.lcModalLarge}
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: `0 0 0 2px ${pathColor}80, 0 24px 60px rgba(0,0,0,0.7)` }}
      >
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <div className={styles.lcModalBodyLarge}>

          {/* Ảnh — to hơn, hiện phần trên */}
          <div className={styles.lcModalImageWrapper}>
            <img
              src={lcImg(lc)}
              alt={nameStr}
              className={styles.lcModalImageLarge}
              loading="lazy"
              decoding="async"
              onError={(e) => { e.target.src = "/placeholder.webp"; }}
            />
            {/* gradient mờ dưới ảnh */}
            <div className={styles.lcModalImageFade}
              style={{ background: `linear-gradient(to top, #0f172a, transparent)` }}
            />
          </div>

          {/* Info bên phải */}
          <div className={styles.lcModalInfoLarge}>
            <p className={styles.lcModalRarity}>{"⭐".repeat(lc.rarity)}</p>
            <h2 className={styles.lcModalNameLarge}>{nameStr}</h2>

            {/* Path */}
            <div className={styles.lcModalPath}>
              <img
                src={`/paths/${pathKey}.webp`}
                alt={lc.path}
                style={{ width: 28, height: 28 }}
                loading="lazy"
                decoding="async"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <span style={{ color: pathColor, fontSize: 15, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
                {lc.path}
              </span>
            </div>

            {/* Stats */}
            <div className={styles.lcModalStats}>
              {[["ATK", lc.stat?.atk], ["HP", lc.stat?.hp], ["DEF", lc.stat?.def]].map(([k, v]) => (
                <div key={k} className={styles.lcModalStat}>
                  <span>{k}</span>
                  <strong>{v ?? "—"}</strong>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className={styles.lcModalDescLarge}>
              <h4>Effect</h4>
              <div>{formatDesc(lc.description, lang)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LIST ─────────────────────────────────────────────────────
export default function LightConeList({ lightcones = [] }) {
  const [lang,         setLang]        = useState("vi");
  const [pathFilter,   setPathFilter]  = useState("all");
  const [rarityFilter, setRarityFilter]= useState("all");
  const [selected,     setSelected]    = useState(null);

  const filtered = lightcones.filter((lc) => {
    const pm = pathFilter   === "all" || lc.path?.toLowerCase() === pathFilter;
    const rm = rarityFilter === "all" || lc.rarity === rarityFilter;
    return pm && rm;
  });

  return (
    <div className={styles.div3}>

      <div className={styles.pageHeader}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <button
            className={styles.langBtn}
            onClick={() => setLang(l => l === "vi" ? "en" : "vi")}
          >
            {lang.toUpperCase()}
          </button>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <span>PATH</span>
          {PATHS.map((p) => (
            <img
              key={p}
              src={`/paths/${p}.webp`}
              alt={p}
              className={`${styles.filterIcon} ${pathFilter === p ? styles.active : ""}`}
              onClick={() => setPathFilter(p === pathFilter ? "all" : p)}
              loading="lazy"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ))}
        </div>

        <div className={styles.filterGroup}>
          <span>RARITY</span>
          {[5, 4, 3].map((r) => (
            <button
              key={r}
              className={`${styles.rarityFilterBtn} ${rarityFilter === r ? styles.rarityActive : ""}`}
              onClick={() => setRarityFilter(r === rarityFilter ? "all" : r)}
            >
              {"⭐".repeat(r)}
            </button>
          ))}
        </div>
      </div>

      <hr className={styles.divider} />

      <p className={styles.resultCount}>
        Showing <strong>{filtered.length}</strong> light cones
      </p>

      {lightcones.length === 0 ? (
        <p className={styles.noResult}>Không có dữ liệu. Hãy thêm Light Cone vào MongoDB.</p>
      ) : filtered.length === 0 ? (
        <p className={styles.noResult}>Không tìm thấy Light Cone phù hợp.</p>
      ) : (
        <div className={styles.lcGrid}>
          {filtered.map((lc) => (
            <LightConeCard
              key={lc._id}
              lc={lc}
              lang={lang}
              onClick={() => setSelected(lc)}
            />
          ))}
        </div>
      )}

      <LightConeModal lc={selected} lang={lang} onClose={() => setSelected(null)} />
    </div>
  );
}