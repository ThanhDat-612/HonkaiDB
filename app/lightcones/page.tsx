import styles from "../page.module.css";
import { connectDB } from "@/lib/mongodb";
import LightCone from "@/models/Lightcone";
import LightConeList from "@/components/LightconesList";
import Link from "next/link";

export const metadata = {
  title: "Light Cones — HonkaiDB",
};

export default async function LightConesPage() {
  await connectDB();
  const raw = await LightCone.find({});
  const lightcones = JSON.parse(JSON.stringify(raw));

  return (
    <div className={styles.parent}>
      <div className={styles.div1}>
        <div className={styles.logo}>HonkaiDB</div>
        <div className={styles.menu}>
          <Link href="/">Characters</Link>
          <Link href="/lightcones" style={{ color: "#60a5fa" }}>Light Cones</Link>
          <Link href="/relics">Relics</Link>
          <a href="currentWar">Current War</a>
        </div>
        <div className={styles.actions}>
          <input type="text" placeholder="Search light cone..." />
          <button>Login</button>
        </div>
      </div>

      <div className={styles.div2}>
        <h3>Sidebar</h3>
        <h3>Coming soon!</h3>
      </div>

      <LightConeList lightcones={lightcones} />
    </div>
  );
}