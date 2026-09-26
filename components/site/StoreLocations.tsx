"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { stores } from "@/components/figmaAssets";
import Reveal from "./Reveal";
import FigmaIcon from "./FigmaIcon";
import styles from "./HomeMotion.module.css";

const types = ["Toko Bunga", "Toko Kado"] as const;

export default function StoreLocations() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return <section id="stores" className="w-full bg-[#f3f2f7]">
    <div className="mx-auto w-full max-w-[1440px] flex flex-col gap-[40px] lg:gap-[60px] px-5 md:px-10 lg:px-[60px] py-[56px] lg:py-[100px]">
      <Reveal className="flex flex-col sm:flex-row gap-[16px] sm:items-center justify-between w-full">
        <div className="flex flex-1 flex-col gap-[4px] items-start min-w-0">
          <p className="font-medium leading-[1.35] text-[#696f96] text-[16px] lg:text-[20px]">Toko Kami</p>
          <h2 className="font-ivy font-semibold leading-[1.2] text-[#3f425a] text-[28px] sm:text-[34px] lg:text-[40px]">Cari Berdasarkan Toko Terdekat</h2>
        </div>
        <div role="tablist" aria-label="Jenis toko" className={styles.storeTabs}>
          {types.map((label, index) => <button key={label} ref={node => { tabs.current[index] = node; }} type="button" role="tab" id={`store-tab-${index}`} aria-controls="store-cities" aria-selected={selected === index} tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)} className={styles.storeTab}
            onKeyDown={event => {
              let next: number;
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") next = 1 - index;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = 1;
              else return;
              event.preventDefault();
              setSelected(next);
              tabs.current[next]?.focus();
            }}>{label}</button>)}
        </div>
      </Reveal>
      <div id="store-cities" role="tabpanel" aria-labelledby={`store-tab-${selected}`} tabIndex={0} className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] lg:gap-[20px] w-full focus-visible:outline-2 focus-visible:outline-[#7a70ba] focus-visible:outline-offset-8">
        {stores.map((store, i) => <Link key={`${selected}-${store.name}`} href="/product" aria-label={`${types[selected]} ${store.name}`} className={`${styles.storeCard} group flex flex-col gap-[14px] bg-[#f2f3f7] border border-[#e1e2ea] h-full overflow-hidden transition-[box-shadow,border-color] duration-300 hover:shadow-[0_14px_30px_-18px_rgba(84,73,151,0.5)] hover:border-[#c9c4e6] focus-visible:outline-2 focus-visible:outline-[#7a70ba]`}
          style={{ "--card-delay": `${(i % 4) * 45}ms` } as CSSProperties}>
          <div className="h-[200px] lg:h-[296px] relative w-full overflow-hidden bg-[#f0f1f5]">
            <Image alt={store.name} fill sizes="(min-width: 1024px) 315px, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" src={store.img} />
          </div>
          <div className="flex flex-col gap-[6px] items-start justify-center px-[16px] py-[12px] w-full">
            <div className="flex gap-[6px] items-center w-full">
              {selected === 0 ? <FigmaIcon name="store" className="size-[20px]" /> : <span aria-hidden="true" className={styles.giftIcon} />}
              <p className="leading-[1.6] text-[#696f96] text-[14px]">{types[selected]}</p>
            </div>
            <p className="font-medium leading-[1.5] text-[#3f425a] text-[16px] lg:text-[18px]">{store.name}</p>
          </div>
        </Link>)}
      </div>
      <p className="sr-only" role="status">{types[selected]} tersedia di {stores.length} kota.</p>
    </div>
  </section>;
}
