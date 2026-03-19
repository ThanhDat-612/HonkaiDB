import styles from "../page.module.css";
import LightConeList from "@/components/LightconesList";

export const metadata = {
  title: "Light Cones — HonkaiDB",
};

export default async function LightConesPage() {
  // TODO: Kết nối DB sau
  // await connectDB();
  // const rawLC = await LightCone.find({});
  // const lightcones = JSON.parse(JSON.stringify(rawLC));

  return (
    <div className={styles.parent}>
      {/* NAVBAR */}
      <div className={styles.div1}>
        <div className={styles.logo}>HonkaiDB</div>
        <div className={styles.menu}>
          <a href="/">Home</a>
          <a href="/">Characters</a>
          <a href="/lightcones" style={{ color: "#60a5fa" }}>Light Cones</a>
          <a href="/relics">Relics</a>
        </div>
        <div className={styles.actions}>
          <input type="text" placeholder="Search light cone..." />
          <button>Login</button>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className={styles.div2}>
        <h3>Sidebar</h3>
        <h3>Coming soon!</h3>
      </div>

      {/* MAIN CONTENT — dùng mock data nên không cần truyền props */}
      {/* <LightConeList /> */}
    </div>
  );
}
