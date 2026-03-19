"use client";

import { useState } from "react";
import styles from "../app/page.module.css";
import LightConeCard, { MOCK_LIGHT_CONES } from "@/components/LightConeCard";

const paths = ["destruction", "hunt", "erudition", "harmony", "nihility", "preservation", "abundance", "remembrance", "elation"];
const rarities = [5, 4, 3];

/**
 * @param {Object} props
 * @param {Array} props.lightcones - Danh sách light cones từ DB (nếu có). Nếu không có thì dùng mock data.
 */
export default function LightConeList({ lightcones }) {
  const data = lightcones?.length ? lightcones : MOCK_LIGHT_CONES;

  const [pathFilter, setPathFilter] = useState("all");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [selectedLC, setSelectedLC] = useState(null);

  const filtered = data.filter((lc) => {
    const pathMatch = pathFilter === "all" || lc.path.toLowerCase() === pathFilter;
    const rarityMatch = rarityFilter === "all" || lc.rarity === rarityFilter;
    return pathMatch && rarityMatch;
  });

  return (
    <div className={styles.div3}>

      {/* PAGE TITLE */}
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>
          <span className={styles.pageTitleIcon}>🌟</span>
          Light Cones
        </h2>
        <p className={styles.pageSubtitle}>Equipment that augments the Trailblazer's combat abilities</p>
      </div>

      {/* FILTERS */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <span>PATH</span>
          {paths.map((p) => (
            <img
              key={p}
              src={`/paths/${p}.webp`}
              alt={p}
              className={`${styles.filterIcon} ${pathFilter === p ? styles.active : ""}`}
              onClick={() => setPathFilter(p === pathFilter ? "all" : p)}
              loading="lazy"
            />
          ))}
        </div>

        <div className={styles.filterGroup}>
          <span>RARITY</span>
          {rarities.map((r) => (
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

      {/* GRID */}
      <div className={styles.lcGrid}>
        {filtered.length > 0 ? (
          filtered.map((lc) => (
            <LightConeCard
              key={lc.id || lc._id}
              lightcone={lc}
              onClick={() => setSelectedLC(lc)}
            />
          ))
        ) : (
          <p className={styles.noResult}>Không tìm thấy Light Cone phù hợp.</p>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedLC && (
        <div className={styles.modal} onClick={() => setSelectedLC(null)}>
          <div className={styles.lcModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedLC(null)}>✕</button>
            <div className={styles.lcModalBody}>
              <img
                src={`/lightcones/${selectedLC.id || selectedLC._id}.webp`}
                alt={selectedLC.name}
                className={styles.lcModalImage}
                loading="lazy"
                onError={(e) => { e.target.src = "/placeholder.webp"; }}
              />
              <div className={styles.lcModalInfo}>
                <h2 className={styles.lcModalName}>{selectedLC.name}</h2>
                <p className={styles.lcModalRarity}>{"⭐".repeat(selectedLC.rarity)}</p>
                <div className={styles.lcModalPath}>
                  <img src={`/paths/${selectedLC.path}.webp`} alt={selectedLC.path} loading="lazy" />
                  <span>{selectedLC.path.charAt(0).toUpperCase() + selectedLC.path.slice(1)}</span>
                </div>
                <div className={styles.lcModalStats}>
                  <div className={styles.lcModalStat}><span>ATK</span><strong>{selectedLC.atk}</strong></div>
                  <div className={styles.lcModalStat}><span>HP</span><strong>{selectedLC.hp}</strong></div>
                  <div className={styles.lcModalStat}><span>DEF</span><strong>{selectedLC.def}</strong></div>
                </div>
                <div className={styles.lcModalDesc}>
                  <h4>Superimposition Effect</h4>
                  <p>{selectedLC.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}