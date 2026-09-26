"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductDetail.module.css";
const prices = ["Rp 90.000", "Rp 75.000", "Rp 82.500", "Rp 82.500", "Rp 82.500"];
export default function RelatedProducts() {
 const track = useRef<HTMLDivElement>(null);
 const [edges, setEdges] = useState({ start:true, end:false });
 function scroll(direction:number) {
  const element = track.current; if (!element) return;
  const card = element.firstElementChild as HTMLElement;
  const gap = Number.parseFloat(getComputedStyle(element).gap);
  element.scrollBy({left:direction*(card.offsetWidth+gap),behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
 }
 return <section className={styles.related} aria-labelledby="related-title"><div className={styles.relatedInner}>
  <div className={styles.relatedHeader}><h2 id="related-title">Anda mungkin juga menyukai</h2><div className={styles.arrows}><img src="/figma/detail/arrows.svg" alt="" /><button type="button" aria-label="Produk terkait sebelumnya" disabled={edges.start} onClick={()=>scroll(-1)} /><button type="button" aria-label="Produk terkait berikutnya" disabled={edges.end} onClick={()=>scroll(1)} /></div></div>
  <div className={styles.track} ref={track} onScroll={event=>{const el=event.currentTarget;setEdges({start:el.scrollLeft<=1,end:el.scrollLeft+el.clientWidth>=el.scrollWidth-1});}}>
   {prices.map((price,index)=><Link className={styles.relatedCard} href="/product" key={index}><div className={styles.relatedImage}><Image src={`/figma/detail/related-${index+1}.png`} alt="Pesona Lavender Mewah" fill sizes="(max-width:767px) 240px, 305px" /></div><h3>Pesona Lavender Mewah</h3><p>{price}</p></Link>)}
  </div>
  <div className={styles.explore}><Link href="/product">Jelajahi Produk<img src="/figma/detail/arrow.svg" alt="" /></Link></div>
 </div></section>;
}
