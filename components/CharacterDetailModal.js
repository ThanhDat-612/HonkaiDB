import { useState } from "react";
import styles from "../app/page.module.css";

export default function CharacterDetailModal({ character, onClose }) {
  const [buffed, setBuffed] = useState(false);

  const data = buffed
    ? character.versions?.buffed
    : character.versions?.normal;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER CỐ ĐỊNH (STICKY) */}
        <div className={styles.detailHeaderSticky}>
          <div className={styles.headerLeft}>
            <h2>{character.name}</h2>
            <span className={styles.rarity}>{"⭐".repeat(character.rarity)}</span>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.buffToggle}>
              <span>Buff</span>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={buffed}
                  onChange={() => setBuffed(!buffed)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            
            {/* NÚT ĐÓNG NẰM KẾ BÊN NÚT BUFF */}
            <button className={styles.closeBtnSmall} onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* PHẦN NỘI DUNG CHIA 2 CỘT */}
        <div className={styles.detailBodyTwoColumns}>
          
          {/* CỘT TRÁI: ẢNH NHÂN VẬT */}
          <div className={styles.leftColumn}>
            <img src={character.image} className={styles.detailImageFull} alt={character.name} />
          </div>

          {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
          <div className={styles.rightColumn}>
            <div className={styles.infoSection}>
              <h3>Stats {buffed ? "(Buffed)" : "(Normal)"}</h3>
              <div className={styles.statsGrid}>
                <p><strong>HP:</strong> {data?.hp || "1200"}</p>
                <p><strong>ATK:</strong> {data?.atk || "600"}</p>
                <p><strong>DEF:</strong> {data?.def || "450"}</p>
              </div>
            </div>

            <div className={styles.infoSection}>
              <h3>Description</h3>
              <p className={styles.descText}>
                {data?.description || "Thông tin mô tả chi tiết của nhân vật sẽ hiển thị ở đây. Khi bạn thêm nhiều nội dung, phần này sẽ dài ra và bạn có thể cuộn chuột để đọc mà Header vẫn hiện ở trên."}
              </p>
              {/* Thêm văn bản giả để thử nghiệm thanh cuộn */}
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
              <p className={styles.descText}>Dữ liệu mẫu bổ sung để kiểm tra tính năng cuộn dọc của Modal...</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}