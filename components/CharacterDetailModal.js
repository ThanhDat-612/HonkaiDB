import { useState } from "react";
import styles from "../app/page.module.css";

export default function CharacterDetailModal({ character, onClose }) {
  const [buffed, setBuffed] = useState(false);

  // Lấy dữ liệu từ database (nếu có), nếu không có thì dùng giá trị mặc định
  const data = buffed
    ? character.versions?.buffed
    : character.versions?.normal;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className={styles.detailHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <h2>{character.name}</h2>
             <span className={styles.rarity}>{"⭐".repeat(character.rarity)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>Buff Mode</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={buffed}
                onChange={() => setBuffed(!buffed)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        <hr style={{ border: '0.5px solid #1e293b', margin: '20px 0' }} />

        {/* BODY */}
        <div className={styles.detailBody} style={{ display: 'flex', gap: '30px' }}>
          <div className={styles.detailImageContainer}>
            <img src={character.image} className={styles.detailImage} style={{ width: '200px', borderRadius: '8px' }} />
          </div>

          <div className={styles.stats} style={{ flex: 1 }}>
            <h3>Thông tin cơ bản</h3>
            <p><strong>Vận mệnh:</strong> {character.path}</p>
            <p><strong>Thuộc tính:</strong> {character.element}</p>
            
            <h3 style={{ marginTop: '20px' }}>Chỉ số {buffed ? "(Đã Buff)" : "(Gốc)"}</h3>
            <p>HP: {data?.hp || "1200"}</p>
            <p>ATK: {data?.atk || "600"}</p>
            <p>DEF: {data?.def || "450"}</p>

            <h3 style={{ marginTop: '20px' }}>Giới thiệu</h3>
            <p>{data?.description || "Đây là nội dung mô tả nhân vật tạm thời. Bạn có thể kết nối database sau này để hiển thị tiểu sử chi tiết của nhân vật tại đây."}</p>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: '30px', textAlign: 'right' }}>
          <button className={styles.closeBtn} onClick={onClose} style={{ padding: '10px 25px', cursor: 'pointer' }}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}