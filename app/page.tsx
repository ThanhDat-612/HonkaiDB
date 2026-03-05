import styles from "./page.module.css";
import { connectDB } from "@/lib/mongodb";
import Character from "@/models/Character";

export const metadata = {
  title: "Honkai Starrail DB",
};
export default async function Home() {

  await connectDB();
  const characters = await Character.find({});
  console.log(characters);
  return (
    <div className={styles.parent}>
      {/* NAVBAR */}
      <div className={styles.div1}>
        <div className={styles.logo}>HonkaiDB</div>

        <div className={styles.menu}>
          <a href="#">Home</a>
          <a href="#">Characters</a>
          <a href="#">Light Cones</a>
          <a href="#">Relics</a>
        </div>

        <div className={styles.actions}>
          <input type="text" placeholder="Search character..." />
          <button>Login</button>
        </div>
      </div>

      <div className={styles.div2}>Sidebar</div>
      <div className={styles.div3}>
        {/* FILTER */}
        <div className={styles.filterSection}>
          <select>
            <option>All Elements</option>
            <option>Fire</option>
            <option>Ice</option>
            <option>Lightning</option>
            <option>Wind</option>
            <option>Quantum</option>
            <option>Imaginary</option>
          </select>

          <select>
            <option>All Paths</option>
            <option>Destruction</option>
            <option>Hunt</option>
            <option>Erudition</option>
            <option>Harmony</option>
            <option>Nihility</option>
            <option>Preservation</option>
            <option>Abundance</option>
          </select>
        </div>
        {/* CHARACTER GRID */}
          <div className={styles.characterGrid}>
            {characters.map((c) => (
              <div key={c._id} className={styles.card}>
                
                <div className={styles.cardImage}>
                  <img src={c.image} alt={c.name}/>
                </div>

                <div className={styles.cardInfo}>
                  <h3>{c.name}</h3>

                  <p className={styles.rarity}>
                    {"⭐".repeat(c.rarity)}
                  </p>

                  <div className={styles.iconRow}>
                    <img 
                        src={`/elements/${c.element.toLowerCase()}.png`} 
                        alt={c.element}
                        className={styles.icon}
                    />
                    <img 
                        src={`/paths/${c.path.toLowerCase()}.png`} 
                        alt={c.path}
                        className={styles.icon}
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>
      </div>
    </div>
  );
}