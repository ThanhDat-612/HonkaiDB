// "use client";

// import { useState, useEffect } from "react";
// import styles from "../app/page.module.css";
// import SmartImage from "@/components/SmartImage";

// export default function CharacterDetailModal({ character, onClose }) {
//   const [buffed, setBuffed] = useState(false);
//   const [lang, setLang] = useState("vi");
//   const [openSection, setOpenSection] = useState(null);
//   const [enlargedImage, setEnlargedImage] = useState(null);
//   const [hasBuffedVersion, setHasBuffedVersion] = useState(false);

//   // Kiểm tra xem nhân vật có phiên bản buffed không
//   useEffect(() => {
//     if (character?.kits) {
//       const buffedKit = character.kits.find(k => k.type === "buffed");
//       setHasBuffedVersion(!!buffedKit);
//     }
//   }, [character]);

//   if (!character) return null;

//   // Lấy kit hiện tại dựa vào trạng thái buffed
//   const currentKit = character.kits?.find(k =>
//     buffed ? k.type === "buffed" : k.type === "original"
//   ) || character.kits?.[0];

//   const characterVersion = currentKit?.version || "Unknown";
  
//   // Lấy skills, traces, eidolons từ currentKit
//   const skills = currentKit?.skills || {};
//   const traces = currentKit?.traces || {};
//   const eidolons = currentKit?.eidolons || {};
  
//   const charId = character.id;
//   const stats = character.stats || {};

//   // Hàm xử lý xuống dòng cho text
//   const formatDescription = (text) => {
//     if (!text) return "No description.";
//     if (Array.isArray(text)) {
//       return text.map((line, i) => <p key={i}>{line}</p>);
//     }
//     return text.split('\n').map((line, i) => (
//       <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
//     ));
//   };

//   const closeEnlargedImage = () => {
//     setEnlargedImage(null);
//   };

//   const renderSkillVariants = (skillKey, skillData) => {
//     if (!skillData?.variants) return null;

//     return Object.entries(skillData.variants).map(([variantKey, variant]) => {
//       return (
//         <div key={`${skillKey}-${variantKey}`} className={styles.skillRow}>
          
//           <div className={styles.skillImage}>
//             <SmartImage
//               basePath={`/skills/${skillKey}/${charId}`}
//               name="default"
//               alt={variant.name?.[lang]}
//               className={styles.skillIcon}
//             />
//           </div>

//           <div className={styles.skillInfo}>
//             <h4>{variant.name?.[lang] || variantKey}</h4>
//             {formatDescription(variant.description?.[lang])}
//           </div>

//         </div>
//       );
//     });
//   };

//   const renderSkillCategory = () => {
//     return Object.entries(skills).map(([skillKey, skillData]) => {
//       return (
//         <div key={skillKey}>
//           <h3 className={styles.skillCategory}>
//             {skillKey.replace(/([A-Z])/g, " $1").toUpperCase()}
//           </h3>
//           {renderSkillVariants(skillKey, skillData)}
//         </div>
//       );
//     });
//   };

//   // SỬA HÀM NÀY - Logic đúng: khi buffed = true thì dùng ảnh _fixed
//   const renderListSection = (folder, list, labelPrefix) => {
//     if (!list || Object.keys(list).length === 0) return null;

//     return Object.entries(list).map(([key, data]) => {
//       // Xác định tên file ảnh dựa vào trạng thái buffed
//       let fileName = key;
      
//       // Nếu đang ở chế độ buffed, dùng file có tên key_fixed
//       if (buffed) {
//         fileName = `${key}_fix`;
//       }
//       // console.log('Buffed state:', buffed, 'Key:', key, 'Filename:', fileName);
//       // Nếu không ở chế độ buffed, vẫn dùng file gốc là key
      
//       return (
//         <div key={key} className={styles.skillRow}>
//           <div 
//             className={styles.skillImage}
//             onClick={() => folder === "eidolons" && setEnlargedImage({
//               src: `/${folder}/${charId}/${fileName}.png`,
//               name: data.name?.[lang] || `${labelPrefix} ${key}`,
//               description: data.description?.[lang] || "No description."
//             })}
//             style={{ cursor: folder === "eidolons" ? 'pointer' : 'default' }}
//           >
//             <SmartImage
//               basePath={`/${folder}/${charId}`}
//               name={fileName}
//               alt={data.name?.[lang]}
//               className={styles.skillIcon}
//               // Thêm fallback để nếu không tìm thấy file _fixed thì dùng file gốc
//               fallbackName={!buffed ? undefined : key}
//             />
//             {folder === "eidolons" && (
//               <div className={styles.imageZoomHint}>🔍</div>
//             )}
//           </div>

//           <div className={styles.skillInfo}>
//             <h4>{data.name?.[lang] || `${labelPrefix} ${key}`}</h4>
//             {formatDescription(data.description?.[lang])}
//           </div>
//         </div>
//       );
//     });
//   };

//   const getElementShadowColor = (element) => {
//     const elementColors = {
//       wind: 'rgba(16, 185, 129, 1)',
//       lightning: 'rgba(213, 110, 255, 1)',
//       fire: 'rgba(239, 68, 68, 1)',
//       ice: 'rgba(59, 130, 246, 1)',
//       quantum: 'rgba(145, 145, 255, 1)',
//       imaginary: 'rgba(251, 191, 36, 1)',
//       physical: 'rgba(255, 255, 255, 1)'
//     };
//     return elementColors[element?.toLowerCase()] || 'rgba(96, 165, 250, 1)';
//   };

//   const shadowColor = getElementShadowColor(character.element);

//   // Hiển thị thông báo nếu bật buffed nhưng không có
//   const renderBuffedWarning = () => {
//     if (buffed && !hasBuffedVersion) {
//       return (
//         <div className={styles.buffedWarning}>
//           <p>⚠️ This character doesn't have a buffed version yet.</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Kiểm tra xem có traces/eidolons trong kit hiện tại không
//   const hasTraces = traces && Object.keys(traces).length > 0;
//   const hasEidolons = eidolons && Object.keys(eidolons).length > 0;

//   return (
//     <div className={styles.modal} onClick={onClose}>
//       <div 
//         className={styles.modalContent} 
//         onClick={(e) => e.stopPropagation()}
//         style={{ 
//           boxShadow: `0 20px 40px ${shadowColor}40`
//         }}
//       >

//         {/* HEADER */}
//         <div className={styles.detailHeaderSticky}>
//           <h2>{character.name}</h2>
          
//           <div className={styles.headerControls}>
//             <button 
//               className={styles.langBtn}
//               onClick={() => setLang(lang === "en" ? "vi" : "en")}
//             >
//               {lang.toUpperCase()}
//             </button>

//             {hasBuffedVersion && (
//               <div className={styles.buffToggle}>
//                 <label htmlFor="buff-toggle">Buffed</label>
//                 <label className={styles.switch}>
//                   <input
//                     id="buff-toggle"
//                     type="checkbox"
//                     checked={buffed}
//                     onChange={() => setBuffed(!buffed)}
//                   />
//                   <span className={styles.slider}></span>
//                 </label>
//               </div>
//             )}

//             <button className={styles.closeBtn} onClick={onClose}>✕</button>
//           </div>
//         </div>

//         {/* BODY - TWO COLUMNS */}
//         <div className={styles.detailBody}>
          
//           {/* LEFT COLUMN */}
//           <div className={styles.leftColumn}>
//             <div 
//               className={styles.imageContainer}
//               style={{ 
//                 boxShadow: `0 0 0 3px ${shadowColor}, 0 0 30px ${shadowColor}, 0 20px 40px rgba(0,0,0,0.5)`,
//                 border: 'none'
//               }}
//             >
//               <img
//                 src={character.image}
//                 className={styles.detailImageFull}
//                 alt={character.name}
//               />
//             </div>
            
//             {/* BASIC STATS */}
//             <div className={styles.basicStatsCard}>
//               <h3>Base Stats</h3>
//               <div className={styles.statsGrid}>
//                 <div className={styles.statItem}>
//                   <span className={styles.statLabel}>HP</span>
//                   <span className={styles.statValue}>{stats.hp || "N/A"}</span>
//                 </div>
//                 <div className={styles.statItem}>
//                   <span className={styles.statLabel}>ATK</span>
//                   <span className={styles.statValue}>{stats.atk || "N/A"}</span>
//                 </div>
//                 <div className={styles.statItem}>
//                   <span className={styles.statLabel}>DEF</span>
//                   <span className={styles.statValue}>{stats.def || "N/A"}</span>
//                 </div>
//                 <div className={styles.statItem}>
//                   <span className={styles.statLabel}>SPD</span>
//                   <span className={styles.statValue}>{stats.speed || "N/A"}</span>
//                 </div>
//                 <div className={`${styles.statItem} ${styles.energyItem}`}>
//                   <span className={styles.statLabel}>Energy</span>
//                   <span className={styles.statValue}>{stats.energy || "N/A"}</span>
//                 </div>
//                 <div className={`${styles.statItem} ${styles.specialItem}`}>
//                   <span className={styles.statLabel}>Special</span>
//                   <span className={styles.statValue}>{stats.special || "N/A"}</span>
//                 </div>
//               </div>
              
//               {/* ELEMENT & PATH BADGES */}
//               <div className={styles.badgeContainer}>
//                 {character.element && (
//                   <div 
//                     className={styles.elementBadge}
//                     data-element={character.element.toLowerCase()}
//                   >
//                     <img 
//                       src={`/elements/${character.element.toLowerCase()}.png`} 
//                       className={styles.elementIcon} 
//                       alt={character.element} 
//                     />
//                     <span>{character.element}</span>
//                   </div>
//                 )}
//                 {character.path && (
//                   <div className={styles.pathBadge}>
//                     <img 
//                       src={`/paths/${character.path.toLowerCase()}.png`} 
//                       className={styles.pathIcon} 
//                       alt={character.path} 
//                     />
//                     <span>{character.path}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className={styles.rightColumn}>
            
//             {/* DESCRIPTION */}
//             <div className={styles.descriptionCard}>
//               <div className={styles.descriptionHeader}>
//                 <h3>Character Story</h3>
//               </div>
              
//               <div className={styles.descriptionContent}>
//                 <div className={styles.descriptionText}>
//                   {formatDescription(character.info?.[lang])}
//                 </div>
//               </div>
              
//               <div className={styles.descriptionFooter}>
//                 <div className={styles.descriptionTag}>
//                   <span>📅 Version - {characterVersion}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Buffed Warning */}
//             {renderBuffedWarning()}

//             {/* SKILLS */}
//             {skills && Object.keys(skills).length > 0 && (
//               <div className={styles.section}>
//                 <div
//                   className={styles.sectionHeader}
//                   onClick={() =>
//                     setOpenSection(openSection === "skills" ? null : "skills")
//                   }
//                 >
//                   Skills
//                   <span className={styles.arrow}>{openSection === "skills" ? "▼" : "▶"}</span>
//                 </div>

//                 {openSection === "skills" && (
//                   <div className={styles.sectionContent}>
//                     {renderSkillCategory()}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* TRACES */}
//             {hasTraces && (
//               <div className={styles.section}>
//                 <div
//                   className={styles.sectionHeader}
//                   onClick={() =>
//                     setOpenSection(openSection === "traces" ? null : "traces")
//                   }
//                 >
//                   Traces
//                   <span className={styles.arrow}>{openSection === "traces" ? "▼" : "▶"}</span>
//                 </div>

//                 {openSection === "traces" && (
//                   <div className={styles.sectionContent}>
//                     {renderListSection("traces", traces, "Trace")}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* EIDOLONS */}
//             {hasEidolons && (
//               <div className={styles.section}>
//                 <div
//                   className={styles.sectionHeader}
//                   onClick={() =>
//                     setOpenSection(openSection === "eidolons" ? null : "eidolons")
//                   }
//                 >
//                   Eidolons
//                   <span className={styles.arrow}>{openSection === "eidolons" ? "▼" : "▶"}</span>
//                 </div>

//                 {openSection === "eidolons" && (
//                   <div className={styles.sectionContent}>
//                     {renderListSection("eidolons", eidolons, "Eidolon")}
//                   </div>
//                 )}
//               </div>
//             )}

//           </div>
//         </div>

//         {/* ENLARGED IMAGE MODAL */}
//         {enlargedImage && (
//           <div className={styles.enlargedImageModal} onClick={closeEnlargedImage}>
//             <div className={styles.enlargedImageContent} onClick={(e) => e.stopPropagation()}>
//               <button className={styles.closeEnlargedBtn} onClick={closeEnlargedImage}>✕</button>
//               <img src={enlargedImage.src} alt={enlargedImage.name} />
//               <div className={styles.enlargedImageInfo}>
//                 <h3>{enlargedImage.name}</h3>
//                 <div className={styles.enlargedImageDescription}>
//                   {formatDescription(enlargedImage.description)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }
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

  // Kiểm tra xem nhân vật có phiên bản buffed không
  useEffect(() => {
    if (character?.kits) {
      const buffedKit = character.kits.find(k => k.type === "buffed");
      setHasBuffedVersion(!!buffedKit);
    }
  }, [character]);

  if (!character) return null;

  // Lấy kit hiện tại dựa vào trạng thái buffed
  const currentKit = character.kits?.find(k =>
    buffed ? k.type === "buffed" : k.type === "original"
  ) || character.kits?.[0];

  const characterVersion = currentKit?.version || "Unknown";
  
  // Lấy skills, traces, eidolons từ currentKit
  const skills = currentKit?.skills || {};
  const traces = currentKit?.traces || {};
  const eidolons = currentKit?.eidolons || {};
  
  const charId = character.id;
  const stats = character.stats || {};

  // Hàm xử lý xuống dòng cho text
  const formatDescription = (text) => {
    if (!text) return "No description.";
    if (Array.isArray(text)) {
      return text.map((line, i) => <p key={i}>{line}</p>);
    }
    return text.split('\n').map((line, i) => (
      <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
    ));
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  const renderSkillVariants = (skillKey, skillData) => {
    if (!skillData?.variants) return null;

    return Object.entries(skillData.variants).map(([variantKey, variant]) => {
      return (
        <div key={`${skillKey}-${variantKey}`} className={styles.skillRow}>
          
          <div className={styles.skillImage}>
            <SmartImage
              basePath={`/skills/${skillKey}/${charId}`}
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
      );
    });
  };

  const renderSkillCategory = () => {
    return Object.entries(skills).map(([skillKey, skillData]) => {
      return (
        <div key={skillKey}>
          <h3 className={styles.skillCategory}>
            {skillKey.replace(/([A-Z])/g, " $1").toUpperCase()}
          </h3>
          {renderSkillVariants(skillKey, skillData)}
        </div>
      );
    });
  };

  // SỬA HÀM NÀY - Logic đúng: khi buffed = true thì dùng ảnh _fixed
  const renderListSection = (folder, list, labelPrefix) => {
    if (!list || Object.keys(list).length === 0) return null;

    return Object.entries(list).map(([key, data]) => {
      // Xác định tên file ảnh dựa vào trạng thái buffed
      let fileName = key;
      
      // Nếu đang ở chế độ buffed, dùng file có tên key_fixed
      if (buffed) {
        fileName = `${key}_fix`;
      }
      
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
            {folder === "eidolons" && (
              <div className={styles.imageZoomHint}>🔍</div>
            )}
          </div>

          <div className={styles.skillInfo}>
            <h4>{data.name?.[lang] || `${labelPrefix} ${key}`}</h4>
            {formatDescription(data.description?.[lang])}
          </div>
        </div>
      );
    });
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

  // Hiển thị thông báo nếu bật buffed nhưng không có
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

  // Kiểm tra xem có traces/eidolons trong kit hiện tại không
  const hasTraces = traces && Object.keys(traces).length > 0;
  const hasEidolons = eidolons && Object.keys(eidolons).length > 0;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          boxShadow: `0 20px 40px ${shadowColor}40`
        }}
      >

        {/* HEADER */}
        <div className={styles.detailHeaderSticky}>
          <h2>{character.name}</h2>
          
          <div className={styles.headerControls}>
            <button 
              className={styles.langBtn}
              onClick={() => setLang(lang === "en" ? "vi" : "en")}
            >
              {lang.toUpperCase()}
            </button>

            {hasBuffedVersion && (
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

        {/* BODY - TWO COLUMNS */}
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
              {/* SỬA: Dùng SmartImage cho ảnh nhân vật chính */}
              <SmartImage
                basePath="/characters"
                name={character.id}
                alt={character.name}
                className={styles.detailImageFull}

              />
            </div>
            
            {/* BASIC STATS */}
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
              
              {/* ELEMENT & PATH BADGES - SỬA: Dùng SmartImage */}
              <div className={styles.badgeContainer}>
                {character.element && (
                  <div 
                    className={styles.elementBadge}
                    data-element={character.element.toLowerCase()}
                  >
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
            
            {/* DESCRIPTION */}
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

            {/* Buffed Warning */}
            {renderBuffedWarning()}

            {/* SKILLS */}
            {skills && Object.keys(skills).length > 0 && (
              <div className={styles.section}>
                <div
                  className={styles.sectionHeader}
                  onClick={() =>
                    setOpenSection(openSection === "skills" ? null : "skills")
                  }
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
                  onClick={() =>
                    setOpenSection(openSection === "traces" ? null : "traces")
                  }
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
                  onClick={() =>
                    setOpenSection(openSection === "eidolons" ? null : "eidolons")
                  }
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