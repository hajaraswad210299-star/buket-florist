"use client";

import { useState } from "react";
import Image from "next/image";
import { brandLogos } from "@/components/figmaAssets";
import styles from "./HomeMotion.module.css";

const names = ["Adobe", "Airbnb", "Google", "Spotify", "Dropbox", "Netflix", "Behance"];

export default function BrandMarquee() {
  const [paused, setPaused] = useState(false);
  return <div className={styles.marquee}>
    <div className={styles.marqueeWindow}>
      <div className={styles.marqueeTrack} data-paused={paused}>
        {[0, 1].map(copy => <div key={copy} className={styles.logoGroup} aria-hidden={copy === 1 ? true : undefined}>
          {brandLogos.map((brand, i) => <Image key={brand.src} src={brand.src} alt={copy === 0 ? names[i] : ""} width={brand.w} height={brand.h} className="shrink-0 object-contain" />)}
        </div>)}
      </div>
    </div>
    <button type="button" className={styles.pauseButton} aria-pressed={paused} onClick={() => setPaused(p => !p)}>
      {paused ? "Lanjutkan animasi logo" : "Jeda animasi logo"}
    </button>
  </div>;
}
