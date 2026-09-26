"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { detailProduct } from "@/components/figmaAssets";
import CheckoutModal from "./CheckoutModal";
import styles from "./ProductDetail.module.css";

const photos = Array.from({ length: 5 }, (_, index) => `/figma/detail/thumb-${index + 1}.png`);
const previews = ["/figma/detail/main.png", ...photos.slice(1)];
const icon = (name: string) => `/figma/detail/${name}.svg`;

export default function ProductDetail() {
 const p = detailProduct;
 const [active, setActive] = useState(0);
 const [qty, setQty] = useState(1);
 const [tab, setTab] = useState(0);
 const [checkoutOpen, setCheckoutOpen] = useState(false);
 const [cartNotice, setCartNotice] = useState("");
 const touch = useRef<{ x: number; y: number } | null>(null);

 function addToCart() {
  try {
   const raw: unknown = JSON.parse(localStorage.getItem("sekar-wangi-cart") ?? "[]");
   const items: { id: string; name: string; price: string; image: string; qty: number }[] = Array.isArray(raw) ? raw.filter(item => item && typeof item.id === "string" && Number.isInteger(item.qty) && item.qty > 0) : [];
   const previous = items.find(item => item.id === "velvet-orchid-rose");
   const total = Math.min(p.stock, (previous?.qty ?? 0) + qty);
   const item = { id: "velvet-orchid-rose", name: p.name, price: p.price, image: previews[0], qty: total };
   localStorage.setItem("sekar-wangi-cart", JSON.stringify([...items.filter(entry => entry.id !== item.id), item]));
   window.dispatchEvent(new Event("cart-change"));
   setCartNotice(`${total} buket tersimpan di keranjang.`);
  } catch { setCartNotice("Keranjang belum bisa disimpan. Gunakan Checkout Sekarang untuk melanjutkan."); }
 }
 function changePhoto(index: number) { setActive((index + photos.length) % photos.length); }

 return <section className={styles.detail} aria-labelledby="detail-title">
  <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><img src={icon("chevron")} alt="" /><Link href="/product">Product</Link><img src={icon("chevron")} alt="" /><span aria-current="page">{p.name}</span></nav>
  <div className={styles.columns}>
   <div className={styles.gallery}>
    <div className={styles.preview} style={{ touchAction: "pan-y" }} onTouchStart={event => { const point = event.touches[0]; touch.current = { x: point.clientX, y: point.clientY }; }} onTouchEnd={event => {
     if (!touch.current) return;
     const point = event.changedTouches[0]; const dx = point.clientX - touch.current.x; const dy = point.clientY - touch.current.y;
     if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) changePhoto(active + (dx < 0 ? 1 : -1));
     touch.current = null;
    }} onTouchCancel={() => { touch.current = null; }}>
     <div className={styles.imageFrame}><Image key={active} src={previews[active]} alt={`${p.name}, tampilan ${active + 1}`} fill sizes="(max-width: 767px) 90vw, (max-width: 1199px) 45vw, 552px" priority={active === 0} className={styles.mainImage} /></div>
    </div>
    <div className={styles.thumbnails} role="group" aria-label="Pilih foto produk">{photos.map((src, index) => <button key={src} type="button" aria-label={`Foto ${index + 1}`} aria-pressed={active === index} onClick={() => changePhoto(index)} onKeyDown={event => {
     let next = index;
     if (event.key === "ArrowRight") next = (index + 1) % photos.length;
     else if (event.key === "ArrowLeft") next = (index + photos.length - 1) % photos.length;
     else return;
     event.preventDefault(); changePhoto(next); event.currentTarget.parentElement?.querySelectorAll("button")[next]?.focus();
    }}><Image src={src} alt="" fill sizes="(max-width: 767px) 17vw, 107px" /></button>)}</div>
    <p className="sr-only" aria-live="polite">Foto {active + 1} dari {photos.length}</p>
   </div>
   <div className={styles.info}>
    <div className={styles.headline}>
     <div className={styles.titleRow}><h1 id="detail-title">{p.name}</h1><span className={styles.badge}>{p.badge}</span></div>
     <div className={styles.meta}><span>{p.category}</span><span className={styles.divider} /><span>{p.size}</span><span className={styles.divider} /><div className={styles.rating} aria-label={`Rating ${p.ratingValue} dari 5`}><span className={styles.stars}>{Array.from({ length: 5 }, (_, index) => <img key={index} src={icon(index < p.rating ? "star-filled" : "star")} alt="" />)}</span><span>{p.ratingValue}</span></div></div>
     <div className={styles.priceRow}><p className={styles.price}>{p.price}</p><p className={styles.installment}>{p.installment}</p></div>
     <div className={styles.sold}><img src={icon("tag")} alt="" /><span>{p.sold}</span></div>
    </div>
    <div className={styles.quantitySection}><p>Jumlah Pembelian</p><div className={styles.quantityRow}><div className={styles.quantity}>
     <button type="button" aria-label="Kurangi jumlah" disabled={qty <= 1} onClick={() => { setQty(q => Math.max(1, q - 1)); setCartNotice(""); }}><img src={icon("minus")} alt="" /></button>
     <output aria-live="polite" aria-label="Jumlah pembelian">{qty}</output>
     <button type="button" aria-label="Tambah jumlah" disabled={qty >= p.stock} onClick={() => { setQty(q => Math.min(p.stock, q + 1)); setCartNotice(""); }}><img src={icon("plus")} alt="" /></button>
    </div><span className={styles.stock}>Stok saat ini: {p.stock}</span></div></div>
    <div className={styles.actions}><button type="button" className={styles.checkout} onClick={() => setCheckoutOpen(true)}>Checkout Sekarang</button><button type="button" className={styles.cart} onClick={addToCart}>Cart<img src={icon("cart")} alt="" /></button>{cartNotice && <p className={styles.cartNotice} role="status">{cartNotice}</p>}</div>
    <div className={styles.description}><div className={styles.tabs} role="tablist" aria-label="Informasi produk">{p.tabs.map((item, index) => <button key={item.label} id={`detail-tab-${index}`} type="button" role="tab" aria-selected={tab === index} tabIndex={tab === index ? 0 : -1} aria-controls="detail-description" onClick={() => setTab(index)} onKeyDown={event => {
     let next = index;
     if (event.key === "ArrowRight") next = (index + 1) % p.tabs.length;
     else if (event.key === "ArrowLeft") next = (index + p.tabs.length - 1) % p.tabs.length;
     else if (event.key === "Home") next = 0;
     else if (event.key === "End") next = p.tabs.length - 1;
     else return;
     event.preventDefault(); setTab(next); document.getElementById(`detail-tab-${next}`)?.focus();
    }}>{item.label}</button>)}</div><div id="detail-description" role="tabpanel" aria-labelledby={`detail-tab-${tab}`} tabIndex={0} key={tab} className={styles.tabBody}>{p.tabs[tab].body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div>
   </div>
  </div>
  <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} product={{ name: p.name, price: p.price, image: previews[active] }} qty={qty} />
 </section>;
}
