import styles from "../page.module.css";
import RelicList from "@/components/RelicList";

export const metadata = {
  title: "Relics — HonkaiDB",
};

export default async function RelicsPage() {
  // TODO: Kết nối DB sau
  // await connectDB();
  // const rawRelics = await Relic.find({});
  // const relics = JSON.parse(JSON.stringify(rawRelics));

  return (
    <div className={styles.parent}>
      {/* NAVBAR */}
      <div className={styles.div1}>
        <div className={styles.logo}>HonkaiDB</div>
        <div className={styles.menu}>
          <a href="/">Home</a>
          <a href="/">Characters</a>
          <a href="/lightcones">Light Cones</a>
          <a href="/relics" style={{ color: "#60a5fa" }}>Relics</a>
        </div>
        <div className={styles.actions}>
          <input type="text" placeholder="Search relic..." />
          <button>Login</button>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className={styles.div2}>
        <h3>Sidebar</h3>
        <h3>Coming soon!</h3>
      </div>

      {/* MAIN CONTENT — dùng mock data nên không cần truyền props */}
      {/* <RelicList /> */}
    </div>
  );
}
