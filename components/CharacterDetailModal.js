"use client";

import { useState, useEffect } from "react";
import styles from "../app/page.module.css";
import SmartImage from "@/components/SmartImage";

export default function CharacterDetailModal({ character, onClose }) {
  const [buffed, setBuffed] = useState(false);
  const [lang, setLang] = useState("vi");
  const [openSection, setOpenSection] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [hasBuffedVersion, setHasBuffedVersion] = useState(false);

  // TAB: "character" hoặc "memosprite"
  const [activeTab, setActiveTab] = useState("character");

  const isRemembrance = character?.path?.toLowerCase() === "remembrance";
  const memosprite = character?.memmosprite || character?.memosprite;

  // Reset về tab character mỗi khi mở modal nhân vật mới
  useEffect(() => {
    setActiveTab("character");
    setOpenSection(null);
  }, [character?._id]);

  useEffect(() => {
    if (character?.kits) {
      const buffedKit = character.kits.find(k => k.type === "buffed");
      setHasBuffedVersion(!!buffedKit);
    }
  }, [character]);

  if (!character) return null;

  const currentKit = character.kits?.find(k =>
    buffed ? k.type === "buffed" : k.type === "original"
  ) || character.kits?.[0];

  const characterVersion = currentKit?.version || "Unknown";
  const skills = currentKit?.skills || {};
  const traces = currentKit?.traces || {};
  const eidolons = currentKit?.eidolons || {};
  const charId = character.id;
  const stats = character.stats || {};

  // ─── Memosprite data ───────────────────────────────────────────────
  const memoName = memosprite?.name?.[lang] || memosprite?.name?.en || "Memosprite";
  const memoStats = memosprite?.stats || {};
  const memoSkill = memosprite?.skill;
  const memoTalent = memosprite?.talent;

  // ─── Helpers ──────────────────────────────────────────────────────
  const formatDescription = (text) => {
    if (!text) return "No description.";
    if (Array.isArray(text)) return text.map((line, i) => <p key={i}>{line}</p>);
    return text.split('\n').map((line, i) => (
      <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
    ));
  };

  const closeEnlargedImage = () => setEnlargedImage(null);

  const renderSkillVariants = (skillKey, skillData, sourceCharId) => {
    if (!skillData?.variants) return null;
    return Object.entries(skillData.variants).map(([variantKey, variant]) => (
      <div key={`${skillKey}-${variantKey}`} className={styles.skillRow}>
        <div className={styles.skillImage}>
          <SmartImage
            basePath={`/skills/${skillKey}/${sourceCharId}`}
            name="default"
            alt={variant.name?.[lang]}
            className={styles.skillIcon}
          />
        </div>
        <div className={styles.skillInfo}>
          <h4>{variant.name?.[lang] || variantKey}</h4>
          {formatDescription(variant.description?.[lang])}
        </div>
      </div>
    ));
  };

  const renderSkillCategory = () => {
    return Object.entries(skills).map(([skillKey, skillData]) => (
      <div key={skillKey}>
        <h3 className={styles.skillCategory}>
          {skillKey.replace(/([A-Z])/g, " $1").toUpperCase()}
        </h3>
        {renderSkillVariants(skillKey, skillData, charId)}
      </div>
    ));
  };

  const renderListSection = (folder, list, labelPrefix) => {
    if (!list || Object.keys(list).length === 0) return null;
    return Object.entries(list).map(([key, data]) => {
      let fileName = buffed ? `${key}_fix` : key;
      return (
        <div key={key} className={styles.skillRow}>
          <div
            className={styles.skillImage}
            onClick={() => folder === "eidolons" && setEnlargedImage({
              src: `/${folder}/${charId}/${fileName}.webp`,
              name: data.name?.[lang] || `${labelPrefix} ${key}`,
              description: data.description?.[lang] || "No description."
            })}
            style={{ cursor: folder === "eidolons" ? 'pointer' : 'default' }}
          >
            <SmartImage
              basePath={`/${folder}/${charId}`}
              name={fileName}
              alt={data.name?.[lang]}
              className={styles.skillIcon}
              fallbackName={!buffed ? undefined : key}
            />
            {folder === "eidolons" && <div className={styles.imageZoomHint}>🔍</div>}
          </div>
          <div className={styles.skillInfo}>
            <h4>{data.name?.[lang] || `${labelPrefix} ${key}`}</h4>
            {formatDescription(data.description?.[lang])}
          </div>
        </div>
      );
    });
  };

  // Render các kỹ năng của memosprite (skill + talent)
  const renderMemoSkillSection = (sectionKey, sectionData, label) => {
    if (!sectionData?.variants) return null;
    return (
      <div>
        <h3 className={styles.skillCategory}>{label}</h3>
        {Object.entries(sectionData.variants).map(([variantKey, variant]) => (
          <div key={`memo-${sectionKey}-${variantKey}`} className={styles.skillRow}>
            <div className={styles.skillImage}>
              <SmartImage
                basePath={`/memosprite/${charId}`}
                name={`memo_${sectionKey}`}
                alt={variant.name?.[lang]}
                className={styles.skillIcon}
                fallback="/placeholder.png"
              />
            </div>
            <div className={styles.skillInfo}>
              <h4>{variant.name?.[lang] || variantKey}</h4>
              {formatDescription(variant.description?.[lang])}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getElementShadowColor = (element) => {
    const elementColors = {
      wind: 'rgba(16, 185, 129, 1)',
      lightning: 'rgba(213, 110, 255, 1)',
      fire: 'rgba(239, 68, 68, 1)',
      ice: 'rgba(59, 130, 246, 1)',
      quantum: 'rgba(145, 145, 255, 1)',
      imaginary: 'rgba(251, 191, 36, 1)',
      physical: 'rgba(255, 255, 255, 1)'
    };
    return elementColors[element?.toLowerCase()] || 'rgba(96, 165, 250, 1)';
  };

  const shadowColor = getElementShadowColor(character.element);

  const renderBuffedWarning = () => {
    if (buffed && !hasBuffedVersion) {
      return (
        <div className={styles.buffedWarning}>
          <p>⚠️ This character doesn't have a buffed version yet.</p>
        </div>
      );
    }
    return null;
  };

  const hasTraces = traces && Object.keys(traces).length > 0;
  const hasEidolons = eidolons && Object.keys(eidolons).length > 0;

  // ─── RENDER MEMOSPRITE TAB CONTENT ────────────────────────────────
  const renderMemosTab = () => {
    if (!memosprite) return (
      <p style={{ color: '#94a3b8', padding: '20px 0' }}>
        Không có dữ liệu memosprite.
      </p>
    );

    return (
      <div className={styles.detailBody}>
        {/* LEFT COLUMN - ảnh + stats memosprite */}
        <div className={styles.leftColumn}>
          <div
            className={styles.imageContainer}
            style={{
              boxShadow: `0 0 0 3px ${shadowColor}, 0 0 30px ${shadowColor}, 0 20px 40px rgba(0,0,0,0.5)`,
              border: 'none'
            }}
          >
            <SmartImage
              basePath={`/memosprite/${charId}`}
              name={`memo_avt`}
              alt={memoName}
              className={styles.detailImageFull}
              fallbackName={`${charId}_memo`}
              fallback={`/memosprite/${charId}/memo_avt.webp`}
            />
          </div>

          {/* MEMO STATS */}
          <div className={styles.basicStatsCard}>
            <h3>Memosprite Stats</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>HP</span>
                <span className={styles.statValue}>{memoStats.hp || "N/A"}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>ATK</span>
                <span className={styles.statValue}>{memoStats.atk || "N/A"}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>DEF</span>
                <span className={styles.statValue}>{memoStats.def || "N/A"}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>SPD</span>
                <span className={styles.statValue}>{memoStats.speed || "N/A"}</span>
              </div>
            </div>

            {/* Badge: element + remembrance path */}
            <div className={styles.badgeContainer}>
              {character.element && (
                <div className={styles.elementBadge} data-element={character.element.toLowerCase()}>
                  <SmartImage
                    basePath="/elements"
                    name={character.element.toLowerCase()}
                    className={styles.elementIcon}
                    alt={character.element}
                  />
                  <span>{character.element}</span>
                </div>
              )}
              <div className={styles.pathBadge}>
                <SmartImage
                  basePath="/paths"
                  name="remembrance"
                  className={styles.pathIcon}
                  alt="Remembrance"
                />
                <span>Remembrance</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - kỹ năng memosprite */}
        <div className={styles.rightColumn}>
          <div className={styles.descriptionCard}>
            <div className={styles.descriptionHeader}>
              <h3>Memosprite — {memoName || character.name + "'s Spirit"}</h3>
            </div>
            <div className={styles.descriptionContent}>
              <div className={styles.descriptionText}>
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                  Linh Hồn Ký Ức của {character.name}.
                </p>
              </div>
            </div>
          </div>

          {/* MEMOSPRITE SKILL */}
          {memoSkill && (
            <div className={styles.section}>
              <div
                className={styles.sectionHeader}
                onClick={() => setOpenSection(openSection === "memo-skill" ? null : "memo-skill")}
              >
                Memosprite Skills
                <span className={styles.arrow}>{openSection === "memo-skill" ? "▼" : "▶"}</span>
              </div>
              {openSection === "memo-skill" && (
                <div className={styles.sectionContent}>
                  {renderMemoSkillSection("skill", memoSkill, "SKILL")}
                </div>
              )}
            </div>
          )}

          {/* MEMOSPRITE TALENT */}
          {memoTalent && (
            <div className={styles.section}>
              <div
                className={styles.sectionHeader}
                onClick={() => setOpenSection(openSection === "memo-talent" ? null : "memo-talent")}
              >
                Memosprite Talent
                <span className={styles.arrow}>{openSection === "memo-talent" ? "▼" : "▶"}</span>
              </div>
              {openSection === "memo-talent" && (
                <div className={styles.sectionContent}>
                  {renderMemoSkillSection("talent", memoTalent, "TALENT")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── RENDER CHARACTER TAB CONTENT ─────────────────────────────────
  const renderCharacterTab = () => (
    <div className={styles.detailBody}>
      {/* LEFT COLUMN */}
      <div className={styles.leftColumn}>
        <div
          className={styles.imageContainer}
          style={{
            boxShadow: `0 0 0 3px ${shadowColor}, 0 0 30px ${shadowColor}, 0 20px 40px rgba(0,0,0,0.5)`,
            border: 'none'
          }}
        >
          <SmartImage
            basePath="/characters"
            name={character.id}
            alt={character.name}
            className={styles.detailImageFull}
          />
        </div>

        <div className={styles.basicStatsCard}>
          <h3>Base Stats</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>HP</span>
              <span className={styles.statValue}>{stats.hp || "N/A"}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>ATK</span>
              <span className={styles.statValue}>{stats.atk || "N/A"}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>DEF</span>
              <span className={styles.statValue}>{stats.def || "N/A"}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>SPD</span>
              <span className={styles.statValue}>{stats.speed || "N/A"}</span>
            </div>
            <div className={`${styles.statItem} ${styles.energyItem}`}>
              <span className={styles.statLabel}>Energy</span>
              <span className={styles.statValue}>{stats.energy || "N/A"}</span>
            </div>
            <div className={`${styles.statItem} ${styles.specialItem}`}>
              <span className={styles.statLabel}>Special</span>
              <span className={styles.statValue}>{stats.special || "N/A"}</span>
            </div>
          </div>

          <div className={styles.badgeContainer}>
            {character.element && (
              <div className={styles.elementBadge} data-element={character.element.toLowerCase()}>
                <SmartImage
                  basePath="/elements"
                  name={character.element.toLowerCase()}
                  className={styles.elementIcon}
                  alt={character.element}
                />
                <span>{character.element}</span>
              </div>
            )}
            {character.path && (
              <div className={styles.pathBadge}>
                <SmartImage
                  basePath="/paths"
                  name={character.path.toLowerCase()}
                  className={styles.pathIcon}
                  alt={character.path}
                />
                <span>{character.path}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className={styles.rightColumn}>
        <div className={styles.descriptionCard}>
          <div className={styles.descriptionHeader}>
            <h3>Character Story</h3>
          </div>
          <div className={styles.descriptionContent}>
            <div className={styles.descriptionText}>
              {formatDescription(character.info?.[lang])}
            </div>
          </div>
          <div className={styles.descriptionFooter}>
            <div className={styles.descriptionTag}>
              <span>📅 Version - {characterVersion}</span>
            </div>
          </div>
        </div>

        {renderBuffedWarning()}

        {/* SKILLS */}
        {skills && Object.keys(skills).length > 0 && (
          <div className={styles.section}>
            <div
              className={styles.sectionHeader}
              onClick={() => setOpenSection(openSection === "skills" ? null : "skills")}
            >
              Skills
              <span className={styles.arrow}>{openSection === "skills" ? "▼" : "▶"}</span>
            </div>
            {openSection === "skills" && (
              <div className={styles.sectionContent}>
                {renderSkillCategory()}
              </div>
            )}
          </div>
        )}

        {/* TRACES */}
        {hasTraces && (
          <div className={styles.section}>
            <div
              className={styles.sectionHeader}
              onClick={() => setOpenSection(openSection === "traces" ? null : "traces")}
            >
              Traces
              <span className={styles.arrow}>{openSection === "traces" ? "▼" : "▶"}</span>
            </div>
            {openSection === "traces" && (
              <div className={styles.sectionContent}>
                {renderListSection("traces", traces, "Trace")}
              </div>
            )}
          </div>
        )}

        {/* EIDOLONS */}
        {hasEidolons && (
          <div className={styles.section}>
            <div
              className={styles.sectionHeader}
              onClick={() => setOpenSection(openSection === "eidolons" ? null : "eidolons")}
            >
              Eidolons
              <span className={styles.arrow}>{openSection === "eidolons" ? "▼" : "▶"}</span>
            </div>
            {openSection === "eidolons" && (
              <div className={styles.sectionContent}>
                {renderListSection("eidolons", eidolons, "Eidolon")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ─── MAIN RENDER ──────────────────────────────────────────────────
  return (
    <div className={styles.modal} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: `0 20px 40px ${shadowColor}40` }}
      >

        {/* HEADER */}
        <div className={styles.detailHeaderSticky}>
          <div className={styles.headerLeft}>
            <h2>{character.name}</h2>

            {/* TAB SWITCHER: chỉ hiện nếu là Remembrance */}
            {isRemembrance && memosprite && (
              <div className={styles.memoTabSwitcher}>
                {/* Tab nhân vật chính */}
                <button
                  className={`${styles.memoTabBtn} ${activeTab === "character" ? styles.memoTabActive : ""}`}
                  onClick={() => { setActiveTab("character"); setOpenSection(null); }}
                  title={character.name}
                >
                  <SmartImage
                    basePath="/characters"
                    name={`${charId}_icon`}
                    alt={character.name}
                    className={styles.memoTabAvatar}
                    fallbackName={charId}
                    fallback="/placeholder.png"
                  />
                </button>

                {/* Tab memosprite */}
                <button
                  className={`${styles.memoTabBtn} ${activeTab === "memosprite" ? styles.memoTabActive : ""}`}
                  onClick={() => { setActiveTab("memosprite"); setOpenSection(null); }}
                  title={memoName || "Memosprite"}
                >
                  <SmartImage
                    basePath={`/memosprite/${charId}`} // Thay đổi từ /characters sang /memosprite
                    name={`memo_avt`} // Hoặc đặt là `memo_icon` tùy theo file của bạn
                    alt={memoName}
                    className={styles.memoTabAvatar}
                    fallbackName={`${charId}_memosprite`}
                    fallback="/placeholder.png"
                  />
                  <span className={styles.memoTabLabel}>✦</span>
                </button>
              </div>
            )}
          </div>

          <div className={styles.headerControls}>
            <button
              className={styles.langBtn}
              onClick={() => setLang(lang === "en" ? "vi" : "en")}
            >
              {lang.toUpperCase()}
            </button>

            {hasBuffedVersion && activeTab === "character" && (
              <div className={styles.buffToggle}>
                <label htmlFor="buff-toggle">Buffed</label>
                <label className={styles.switch}>
                  <input
                    id="buff-toggle"
                    type="checkbox"
                    checked={buffed}
                    onChange={() => setBuffed(!buffed)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            )}

            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* BODY */}
        {activeTab === "character" ? renderCharacterTab() : renderMemosTab()}

        {/* ENLARGED IMAGE MODAL */}
        {enlargedImage && (
          <div className={styles.enlargedImageModal} onClick={closeEnlargedImage}>
            <div className={styles.enlargedImageContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeEnlargedBtn} onClick={closeEnlargedImage}>✕</button>
              <img src={enlargedImage.src} alt={enlargedImage.name} />
              <div className={styles.enlargedImageInfo}>
                <h3>{enlargedImage.name}</h3>
                <div className={styles.enlargedImageDescription}>
                  {formatDescription(enlargedImage.description)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}