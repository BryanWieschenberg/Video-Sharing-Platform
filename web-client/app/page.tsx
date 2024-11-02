import styles from "./page.module.css";
import { getVideos } from "./firebase/functions";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const videos = await getVideos();

  return (
    <main className={styles.main}> {
      videos.map((video) => (
      <Link href={`/watch?v=${video.filename}`}>
        <Image src={'/thumbnail.png'} alt='video' width={160} height={90} className={styles.thumbnail} />
      </Link>
      ))
    }
    </main>
)}
