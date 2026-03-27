"use client";

import { useState } from "react";
import styles from "../app/page.module.css";
import RelicCard, { relicImg, formatBonus } from "@/components/RelicCard";

const CAVERN_SLOTS = ["head", "hands", "body", "feet"];
const PLANAR_SLOTS = ["planar_sphere", "link_rope"];
const SLOT_LABELS  = {
  head: "Head", hands: "Hands", body: "Body", feet: "Feet",
  planar_sphere: "Planar Sphere", link_rope: "Link Rope",
};

export default function RelicList({ relics }) {
  const data = relics ?? [];

  const [lang, setLang]                   = useState("vi");
  const [selectedRelic, setSelectedRelic] = useState(null);

  const cavernRelics = data.filter((r) => r.type === "cavern");
  const planarRelics = data.filter((r) => r.type === "planar");

  return (
    <div className={styles.div3}>

      {/* HEADER */}
      <div className={styles.pageHeader}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 className={styles.pageTitle}>
              <span className={styles.pageTitleIcon}>💎</span>Relics
            </h2>
            <p className={styles.pageSubtitle}>Ancient artifacts that enhance the Trailblazer's power</p>
          </div>
          <button
            className={styles.langBtn}
            onClick={() => setLang((l) => (l === "vi" ? "en" : "vi"))}
          >
            {lang.toUpperCase()}
          </button>
        </div>
      </div>

      <hr className={styles.divider} />

      <p className={styles.resultCount}>
        Showing <strong>{cavernRelics.length}</strong> Cavern sets &amp;{" "}
        <strong>{planarRelics.length}</strong> Planar sets
      </p>

      {/* CAVERN SECTION */}
      <div className={styles.relicSection}>
        <div className={styles.relicSectionHeader}>
          <span className={styles.relicColumnBadgeCavern}>🏛 Cavern Relics</span>
          <span className={styles.relicColumnCount}>{cavernRelics.length} sets · 4-piece &amp; 2-piece bonuses</span>
        </div>
        <div className={styles.relicGrid}>
          {cavernRelics.length > 0 ? (
            cavernRelics.map((r) => (
              <RelicCard key={r.id} relic={r} lang={lang} onClick={() => setSelectedRelic(r)} />
            ))
          ) : (
            <p className={styles.noResult}>No Cavern Relics found.</p>
          )}
        </div>
      </div>

      <hr className={styles.divider} style={{ margin: "24px 0" }} />

      {/* PLANAR SECTION */}
      <div className={styles.relicSection}>
        <div className={styles.relicSectionHeader}>
          <span className={styles.relicColumnBadgePlanar}>🌌 Planar Ornaments</span>
          <span className={styles.relicColumnCount}>{planarRelics.length} sets · 2-piece bonuses only</span>
        </div>
        <div className={styles.relicGrid}>
          {planarRelics.length > 0 ? (
            planarRelics.map((r) => (
              <RelicCard key={r.id} relic={r} lang={lang} onClick={() => setSelectedRelic(r)} />
            ))
          ) : (
            <p className={styles.noResult}>No Planar Ornaments found.</p>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedRelic && (() => {
        const isCavern = selectedRelic.type === "cavern";
        const slots    = isCavern ? CAVERN_SLOTS : PLANAR_SLOTS;
        const nameStr  = selectedRelic.name?.[lang] || selectedRelic.name?.en || selectedRelic._id;
        const bonus2   = selectedRelic["2-piece"]?.[lang] || selectedRelic["2-piece"]?.en;
        const bonus4   = selectedRelic["4-piece"]?.[lang] || selectedRelic["4-piece"]?.en;

        return (
          <div className={styles.modal} onClick={() => setSelectedRelic(null)}>
            <div className={styles.relicModal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={() => setSelectedRelic(null)}>✕</button>

              <div className={styles.relicModalHeader}>
                <span className={`${styles.relicTypeBadge} ${styles.relicTypeBadgeLg}`}>
                  {isCavern ? "🏛 Cavern Relic" : "🌌 Planar Ornament"}
                </span>
                <h2 className={styles.relicModalName}>{nameStr}</h2>
              </div>

              <div className={styles.relicModalImageRow}>
                <img
                  src={relicImg(selectedRelic)}
                  alt={nameStr}
                  className={styles.relicModalImage}
                  loading="lazy"
                  onError={(e) => { e.target.src = "/placeholder.webp"; }}
                />
              </div>

              <div className={styles.relicModalBonuses}>
                <div className={styles.relicModalBonus}>
                  <span className={styles.relicBonusTag}>2-Piece Bonus</span>
                  <p>{formatBonus(bonus2)}</p>
                </div>
                {bonus4 && (
                  <div className={`${styles.relicModalBonus} ${styles.relicModalBonus4}`}>
                    <span className={`${styles.relicBonusTag} ${styles.relicBonusTag4}`}>4-Piece Bonus</span>
                    <p>{formatBonus(bonus4)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}