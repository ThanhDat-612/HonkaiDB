import styles from "../app/page.module.css";

// Mock data để preview giao diện
const MOCK_RELICS = [
  {
    id: "rutilant_arena",
    name: "Rutilant Arena",
    type: "planar",
    slots: ["planar_sphere", "link_rope"],
    set2: "Increases the wearer's CRIT Rate by 8%.",
    set4: null,
    pieces: [
      { slot: "planar_sphere", name: "Moment of the Meteor Shower" },
      { slot: "link_rope", name: "Interstellar Travel Evidence" },
    ]
  },
  {
    id: "space_sealing_station",
    name: "Space Sealing Station",
    type: "planar",
    slots: ["planar_sphere", "link_rope"],
    set2: "Increases the wearer's ATK by 12%.",
    set4: null,
    pieces: [
      { slot: "planar_sphere", name: "Herta's Space Station" },
      { slot: "link_rope", name: "Herta's Handle" },
    ]
  },
  {
    id: "hunter_of_glacial_forest",
    name: "Hunter of Glacial Forest",
    type: "cavern",
    slots: ["head", "hands", "body", "feet"],
    set2: "Increases Ice DMG by 10%.",
    set4: "After the wearer uses their Ultimate, their CRIT DMG increases by 25% for 2 turns.",
    pieces: [
      { slot: "head", name: "Hunter's Artaius Hood" },
      { slot: "hands", name: "Hunter's Lizard Gloves" },
      { slot: "body", name: "Hunter's Ice Dragon Cloak" },
      { slot: "feet", name: "Hunter's Soft Elkskin Boots" },
    ]
  },
  {
    id: "pioneer_diver",
    name: "Pioneer Diver of Dead Waters",
    type: "cavern",
    slots: ["head", "hands", "body", "feet"],
    set2: "Increases DMG dealt to enemies with debuffs by 12%.",
    set4: "Increases CRIT Rate by 4%. For each debuff on the enemy, increases CRIT DMG by 8%.",
    pieces: [
      { slot: "head", name: "Pioneer's Heatproof Shell" },
      { slot: "hands", name: "Pioneer's Lacuna Compass" },
      { slot: "body", name: "Pioneer's Starfaring Outfit" },
      { slot: "feet", name: "Pioneer's Starfaring Shoes" },
    ]
  },
  {
    id: "messenger_traversing_hackerspace",
    name: "Messenger Traversing Hackerspace",
    type: "cavern",
    slots: ["head", "hands", "body", "feet"],
    set2: "Increases SPD by 6%.",
    set4: "When the wearer uses their Ultimate on an ally, SPD for all allies increases by 12% for 1 turn(s).",
    pieces: [
      { slot: "head", name: "Messenger's Holovisor" },
      { slot: "hands", name: "Messenger's Transformative Arm" },
      { slot: "body", name: "Messenger's Secret Satchel" },
      { slot: "feet", name: "Messenger's Par-kool Sneakers" },
    ]
  },
  {
    id: "inert_salsotto",
    name: "Inert Salsotto",
    type: "planar",
    slots: ["planar_sphere", "link_rope"],
    set2: "Increases the wearer's CRIT Rate by 8%.",
    set4: null,
    pieces: [
      { slot: "planar_sphere", name: "Salsotto's Moving City" },
      { slot: "link_rope", name: "Salsotto's Terminator Line" },
    ]
  },
  {
    id: "the_wind_soaring_valorous",
    name: "The Wind-Soaring Valorous",
    type: "cavern",
    slots: ["head", "hands", "body", "feet"],
    set2: "Increases the wearer's ATK by 12%.",
    set4: "Increases CRIT Rate by 6%. When the wearer uses their Follow-up attack, increases DMG by 36% for 1 turn.",
    pieces: [
      { slot: "head", name: "Valorous Mask of Northern Duke" },
      { slot: "hands", name: "Valorous Bracers of Northern Duke" },
      { slot: "body", name: "Valorous Armor of Northern Duke" },
      { slot: "feet", name: "Valorous Greaves of Northern Duke" },
    ]
  },
  {
    id: "sigonia_the_unclaimed_desolation",
    name: "Sigonia, the Unclaimed Desolation",
    type: "planar",
    slots: ["planar_sphere", "link_rope"],
    set2: "Increases the wearer's CRIT Rate by 4%.",
    set4: null,
    pieces: [
      { slot: "planar_sphere", name: "Sigonia's Knot of Cyclicality" },
      { slot: "link_rope", name: "Sigonia's Oath of Steel" },
    ]
  },
];

const SLOT_ICONS = {
  head: "🪖",
  hands: "🧤",
  body: "🥋",
  feet: "👟",
  planar_sphere: "🔮",
  link_rope: "🔗",
};

export default function RelicCard({ relic, onClick }) {
  const isCavern = relic.type === "cavern";

  return (
    <div
      className={`${styles.relicCard} ${isCavern ? styles.relicCavern : styles.relicPlanar}`}
      onClick={onClick}
    >
      {/* Type badge */}
      <div className={styles.relicTypeBadge}>
        {isCavern ? "🏛 Cavern" : "🌌 Planar"}
      </div>

      {/* Relic set image (main piece) */}
      <div className={styles.relicImageWrapper}>
        <img
          src={`/relics/${relic.id}_head.webp`}
          alt={relic.name}
          className={styles.relicImage}
          loading="lazy"
          decoding="async"
          onError={(e) => { e.target.src = "/placeholder.webp"; }}
        />
        <div className={styles.relicGlow} />
      </div>

      {/* Set name */}
      <h4 className={styles.relicName}>{relic.name}</h4>

      {/* 2-piece bonus */}
      <div className={styles.relicBonus}>
        <span className={styles.relicBonusTag}>2-PC</span>
        <p>{relic.set2}</p>
      </div>

      {/* 4-piece bonus (cavern only) */}
      {relic.set4 && (
        <div className={`${styles.relicBonus} ${styles.relicBonus4}`}>
          <span className={`${styles.relicBonusTag} ${styles.relicBonusTag4}`}>4-PC</span>
          <p>{relic.set4}</p>
        </div>
      )}

      {/* Slots */}
      <div className={styles.relicSlots}>
        {relic.pieces.map((p) => (
          <span key={p.slot} title={p.name} className={styles.relicSlotIcon}>
            {SLOT_ICONS[p.slot]}
          </span>
        ))}
      </div>
    </div>
  );
}

export { MOCK_RELICS };