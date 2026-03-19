import styles from "../app/page.module.css";

// Mock data để preview giao diện
const MOCK_LIGHT_CONES = [
  { id: "night_on_the_milky_way", name: "Night on the Milky Way", rarity: 5, path: "erudition", atk: 582, hp: 1058, def: 396, desc: "Increases the wearer's ATK by 12% for every current on-field ally with the same Path." },
  { id: "in_the_name_of_the_world", name: "In the Name of the World", rarity: 5, path: "nihility", atk: 529, hp: 1058, def: 463, desc: "Increases the wearer's Effect Hit Rate against debuffed enemies by 24%." },
  { id: "moment_of_victory", name: "Moment of Victory", rarity: 5, path: "preservation", atk: 476, hp: 1058, def: 529, desc: "Increases the wearer's DEF by 24% and Effect Hit Rate by 24%." },
  { id: "sleep_like_the_dead", name: "Sleep Like the Dead", rarity: 5, path: "hunt", atk: 582, hp: 952, def: 396, desc: "Increases the wearer's CRIT DMG by 30%. After the wearer or their Memosprite's Basic ATK or Skill misses..." },
  { id: "time_waits_for_no_one", name: "Time Waits for No One", rarity: 5, path: "abundance", atk: 476, hp: 1164, def: 396, desc: "Increases the wearer's Max HP by 18% and Outgoing Healing by 12%." },
  { id: "flames_afar", name: "Flames Afar", rarity: 4, path: "destruction", atk: 423, hp: 952, def: 330, desc: "Increases DMG dealt by the wearer by 12% per every 100 Energy difference..." },
  { id: "swordplay", name: "Swordplay", rarity: 4, path: "hunt", atk: 476, hp: 793, def: 330, desc: "For each time the wearer hits the same target, DMG dealt increases by 8%, stacking up to 5 times." },
  { id: "quid_pro_quo", name: "Quid Pro Quo", rarity: 4, path: "abundance", atk: 317, hp: 952, def: 396, desc: "At the beginning of the wearer's turn, regenerates 8 Energy for a random ally." },
  { id: "planetary_rendezvous", name: "Planetary Rendezvous", rarity: 4, path: "harmony", atk: 370, hp: 952, def: 330, desc: "After the wearer uses their Skill, all allies with the same element gain 12% DMG." },
  { id: "we_are_wildfire", name: "We Are Wildfire", rarity: 4, path: "preservation", atk: 317, hp: 1058, def: 396, desc: "At the start of the battle, reduces all allies' DMG taken by 8% for 5 turns." },
  { id: "subscribe_for_more", name: "Subscribe for More!", rarity: 4, path: "hunt", atk: 423, hp: 793, def: 330, desc: "Increases the wearer's ATK by 12%. When the wearer's current Energy reaches its max, increases DMG by 12%." },
  { id: "the_birth_of_the_self", name: "The Birth of the Self", rarity: 4, path: "erudition", atk: 423, hp: 952, def: 330, desc: "Increases DMG dealt by Followers by 24%." },
];

const PATH_COLORS = {
  erudition: "#60a5fa",
  nihility: "#a78bfa",
  preservation: "#34d399",
  hunt: "#f59e0b",
  abundance: "#6ee7b7",
  destruction: "#f87171",
  harmony: "#c084fc",
  remembrance: "#67e8f9",
  elation: "#fb923c",
};

export default function LightConeCard({ lightcone, onClick }) {
  const pathColor = PATH_COLORS[lightcone.path] || "#60a5fa";

  return (
    <div
      className={styles.lcCard}
      onClick={onClick}
      style={{ "--path-color": pathColor }}
    >
      {/* Rarity badge */}
      <div className={styles.lcRarityBadge}>
        {"⭐".repeat(lightcone.rarity)}
      </div>

      {/* Image */}
      <div className={styles.lcImageWrapper}>
        <img
          src={`/lightcones/${lightcone.id}.webp`}
          alt={lightcone.name}
          className={styles.lcImage}
          loading="lazy"
          decoding="async"
          onError={(e) => { e.target.src = "/placeholder.webp"; }}
        />
        <div className={styles.lcImageOverlay} />
      </div>

      {/* Bottom info */}
      <div className={styles.lcInfo}>
        <img
          src={`/paths/${lightcone.path}.webp`}
          alt={lightcone.path}
          className={styles.lcPathIcon}
          loading="lazy"
        />
        <div className={styles.lcText}>
          <h4 className={styles.lcName}>{lightcone.name}</h4>
          <p className={styles.lcDesc}>{lightcone.desc}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.lcStats}>
        <span>ATK <strong>{lightcone.atk}</strong></span>
        <span>HP <strong>{lightcone.hp}</strong></span>
        <span>DEF <strong>{lightcone.def}</strong></span>
      </div>
    </div>
  );
}

export { MOCK_LIGHT_CONES };