import styles from "./page.module.css";
import { connectDB } from "@/lib/mongodb";
import Character from "@/models/Character";
import CharacterList from "@/components/CharacterList";

export const metadata = {
  title: "Honkai Starrail DB",
};
export default async function Home() {

  await connectDB();
  const rawCharacters = await Character.find({});
  const characters = JSON.parse(JSON.stringify(rawCharacters));
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

      <div className={styles.div2}>
        <h3>Sidebar</h3>  
        <img src="/1.gif" alt="sidebar_logo" className={styles.sidebarImage} />
        <h3>Coming soon!</h3>
      </div>
      <CharacterList characters={characters} />
      
    </div>
  );
}