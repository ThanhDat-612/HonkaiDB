"use client";

import { useState } from "react";
import styles from "../app/page.module.css";
import RelicCard, { MOCK_RELICS } from "@/components/RelicCard";

/**
 * @param {Object} props
 * @param {Array} props.relics - Danh sách relics từ DB (nếu có). Nếu không thì dùng mock data.
 */
export default function RelicList({ relics }) {
  const data = relics?.length ? relics : MOCK_RELICS;

  const [typeFilter, setTypeFilter] = useState("all"); // "all" | "cavern" | "planar"
  const [selectedRelic, setSelectedRelic] = useState(null);

  const filtered = data.filter((r) =>
    typeFilter === "all" ? true : r.type === typeFilter
  );

  return (
    <div className={styles.div3}>

      {/* PAGE TITLE */}
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>
          <span className={styles.pageTitleIcon}>💎</span>
          Relics
        </h2>
        <p className={styles.pageSubtitle}>Ancient artifacts that enhance the Trailblazer's power</p>
      </div>

      {/* TYPE FILTER */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <span>TYPE</span>
          {[
            { key: "all", label: "All Sets" },
            { key: "cavern", label: "🏛 Cavern Relics" },
            { key: "planar", label: "🌌 Planar Ornaments" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`${styles.typeFilterBtn} ${typeFilter === key ? styles.typeFilterActive : ""}`}
              onClick={() => setTypeFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <hr className={styles.divider} />

      {/* COUNT */}
      <p className={styles.resultCount}>
        Showing <strong>{filtered.length}</strong> relic sets
      </p>

      {/* GRID */}
      <div className={styles.relicGrid}>
        {filtered.length > 0 ? (
          filtered.map((r) => (
            <RelicCard
              key={r.id || r._id}
              relic={r}
              onClick={() => setSelectedRelic(r)}
            />
          ))
        ) : (
          <p className={styles.noResult}>Không tìm thấy Relic phù hợp.</p>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedRelic && (
        <div className={styles.modal} onClick={() => setSelectedRelic(null)}>
          <div className={styles.relicModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedRelic(null)}>✕</button>

            <div className={styles.relicModalHeader}>
              <span className={`${styles.relicTypeBadge} ${styles.relicTypeBadgeLg}`}>
                {selectedRelic.type === "cavern" ? "🏛 Cavern Relic" : "🌌 Planar Ornament"}
              </span>
              <h2 className={styles.relicModalName}>{selectedRelic.name}</h2>
            </div>

            {/* Pieces grid */}
            <div className={styles.relicPiecesGrid}>
              {selectedRelic.pieces.map((piece) => (
                <div key={piece.slot} className={styles.relicPieceItem}>
                  <img
                    src={`/relics/${selectedRelic.id}_${piece.slot}.webp`}
                    alt={piece.name}
                    className={styles.relicPieceImg}
                    loading="lazy"
                    onError={(e) => { e.target.src = "/placeholder.webp"; }}
                  />
                  <p className={styles.relicPieceName}>{piece.name}</p>
                </div>
              ))}
            </div>

            {/* Set bonuses */}
            <div className={styles.relicModalBonuses}>
              <div className={styles.relicModalBonus}>
                <span className={styles.relicBonusTag}>2-Piece Bonus</span>
                <p>{selectedRelic.set2}</p>
              </div>
              {selectedRelic.set4 && (
                <div className={`${styles.relicModalBonus} ${styles.relicModalBonus4}`}>
                  <span className={`${styles.relicBonusTag} ${styles.relicBonusTag4}`}>4-Piece Bonus</span>
                  <p>{selectedRelic.set4}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}