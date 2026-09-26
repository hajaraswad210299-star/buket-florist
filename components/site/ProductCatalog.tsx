"use client";

import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { productTabs, productsByTab, filterKategori, filterRegions } from "@/components/figmaAssets";
import { IconChevronDown, IconHeart, IconArrowLeft, IconArrowRight } from "./icons";
import styles from "./Product.module.css";

const MIN = 34000;
const PAGE_SIZE = 9;
let sessionSaved = "[]";
function writeSaved(values: string[]) {
 sessionSaved = JSON.stringify(values);
 try { localStorage.setItem("sekar-wangi-saved-products", sessionSaved); } catch { /* Keep the selection for the current session. */ }
 window.dispatchEvent(new Event("saved-products-change"));
}
function readSaved() { try { return localStorage.getItem("sekar-wangi-saved-products") ?? sessionSaved; } catch { return sessionSaved; } }
function subscribeSaved(notify: () => void) {
 window.addEventListener("storage", notify); window.addEventListener("saved-products-change", notify);
 return () => { window.removeEventListener("storage", notify); window.removeEventListener("saved-products-change", notify); };
}
function parseSaved(raw: string): string[] { try { const data: unknown = JSON.parse(raw); return Array.isArray(data) ? data.filter((v): v is string => typeof v === "string") : []; } catch { return []; } }
function subscribeHash(notify: () => void) { window.addEventListener("hashchange", notify); return () => window.removeEventListener("hashchange", notify); }
const fmt = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;
const amount = (value: string) => Number(value.replace(/\D/g, ""));
const toggle = (values: string[], value: string) => values.includes(value) ? values.filter(v => v !== value) : [...values, value];

function Section({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
 return <details open className={`${styles.section} ${id ? styles.regionSection : ""}`} id={id}><summary>{title}<IconChevronDown /></summary><div className={styles.sectionBody}>{children}</div></details>;
}
function Search({ value, setValue, label }: { value: string; setValue: (value: string) => void; label: string }) {
 return <label className={styles.search}><img src="/figma/product/search.svg" width="20" height="20" alt="" /><input aria-label={label} placeholder={label} value={value} onChange={e => setValue(e.target.value)} /></label>;
}
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
 return <label className={styles.check}><input type="checkbox" checked={checked} onChange={onChange} /><span>{label}</span></label>;
}

export default function ProductCatalog() {
 const [tab, setTab] = useState<string>(productTabs[0]);
 const [categories, setCategories] = useState<string[]>([]);
 const [cities, setCities] = useState<string[]>([]);
 const [categorySearch, setCategorySearch] = useState("");
 const [citySearch, setCitySearch] = useState("");
 const [lo, setLo] = useState(MIN);
 const [hi, setHi] = useState(120000);
 const [page, setPage] = useState(1);
 const [mobileOpen, setMobileOpen] = useState(false);
 const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => "");
 const filterOpen = mobileOpen || hash === "#delivery-filter";
 const saved = parseSaved(useSyncExternalStore(subscribeSaved, readSaved, () => "[]"));
 const [notice, setNotice] = useState("");
 const resultsRef = useRef<HTMLDivElement>(null);
 const max = Math.max(120000, ...productsByTab[tab].map(p => amount(p.price)));
 // This local catalog has no per-city inventory feed. Region selects the
 // delivery destination; stock availability must be confirmed with the shop.
 const category = tab === "Bunga" ? "Buket Fresh Flower" : tab === "Karangan Papan Bunga" ? "Bunga Papan" : "Kado & Cakes";
 const categoryOptions: string[] = tab === "kado dan Cakes" ? ["Kado & Cakes"] : [...filterKategori];
 const filtered = productsByTab[tab].filter(p => (!categories.length || categories.includes(category)) && amount(p.price) >= lo && amount(p.price) <= hi);
 const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
 const currentPage = Math.min(page, pageCount);
 const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
 const activeCount = categories.length + cities.length + Number(lo !== MIN || hi !== max);
 function save(key: string, name: string) {
  const next = toggle(saved, key);
  setNotice(next.includes(key) ? `${name} disimpan.` : `${name} dihapus dari favorit.`);
  writeSaved(next);
 }
 function reset() { setCategories([]); setCities([]); setLo(MIN); setHi(max); setPage(1); setCategorySearch(""); setCitySearch(""); }
 function changeTab(value: string) { setTab(value); setCategories([]); setLo(MIN); setHi(Math.max(120000, ...productsByTab[value].map(p => amount(p.price)))); setPage(1); }
 function changePage(value: number) { setPage(Math.max(1, Math.min(pageCount, value))); resultsRef.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }
 return <section className={styles.catalog} aria-label="Katalog produk">
  <button type="button" className={styles.mobileToggle} aria-expanded={filterOpen} aria-controls="product-filters" onClick={() => { setMobileOpen(!filterOpen); if (location.hash === "#delivery-filter") { history.replaceState(null, "", location.pathname + location.search); window.dispatchEvent(new HashChangeEvent("hashchange")); } }}>Filter Produk{activeCount ? ` (${activeCount})` : ""}<IconChevronDown /></button>
  <aside id="product-filters" aria-label="Filter produk" className={styles.sidebar} data-open={filterOpen}>
   <div className={styles.filterTitle}><h2>Filter Produk</h2><button type="button" className={styles.reset} onClick={reset}>Reset Filter</button></div>
   <Section title="Kategori">
    <Search value={categorySearch} setValue={setCategorySearch} label="Cari Koleksi Acara.." />
    <div className={styles.list}>{categoryOptions.filter(k => k.toLowerCase().includes(categorySearch.toLowerCase())).map(k => <Check key={k} label={k} checked={categories.includes(k)} onChange={() => { setCategories(toggle(categories, k)); setPage(1); }} />)}{!categoryOptions.some(k => k.toLowerCase().includes(categorySearch.toLowerCase())) && <p className={styles.status}>Kategori tidak ditemukan.</p>}</div>
   </Section>
   <Section title="Region" id="delivery-filter">
    <Search value={citySearch} setValue={setCitySearch} label="Cari Kota..." />
    <div className={styles.list}>{filterRegions.map(group => {
     const matches = group.items.filter(city => city.toLowerCase().includes(citySearch.toLowerCase()));
     return matches.length ? <details key={`${group.group}-${!!citySearch}`} open={group.group === "Jabodetabek" || !!citySearch} className={styles.cityGroup}><summary>{group.group}<IconChevronDown /></summary>{matches.map(city => <Check key={city} label={city} checked={cities.includes(city)} onChange={() => setCities(toggle(cities, city))} />)}</details> : null;
    })}{!filterRegions.some(group => group.items.some(city => city.toLowerCase().includes(citySearch.toLowerCase()))) && <p className={styles.status}>Kota tidak ditemukan.</p>}</div>
   </Section>
   <Section title="Harga">
    <p className={styles.price}>{fmt(lo)} – {fmt(hi)}</p>
    <div className={styles.range}><div className={styles.rangeTrack} /><div className={styles.rangeFill} style={{ left: `${(lo - MIN) / (max - MIN) * 100}%`, right: `${(max - hi) / (max - MIN) * 100}%` }} />
     <input type="range" className="price-range" aria-label="Harga minimum" aria-valuetext={fmt(lo)} min={MIN} max={max} step={500} value={lo} onChange={e => { setLo(Math.min(Number(e.target.value), hi - 500)); setPage(1); }} />
     <input type="range" className="price-range" aria-label="Harga maksimum" aria-valuetext={fmt(hi)} min={MIN} max={max} step={500} value={hi} onChange={e => { setHi(Math.max(Number(e.target.value), lo + 500)); setPage(1); }} />
    </div>
   </Section>
  </aside>
  <div className={styles.main} ref={resultsRef}>
   <div role="tablist" aria-label="Jenis produk" className={styles.tabs}>{productTabs.map((value, index) => <button type="button" role="tab" key={value} id={`product-tab-${index}`} aria-controls="product-results" aria-selected={tab === value} tabIndex={tab === value ? 0 : -1} onClick={() => changeTab(value)} onKeyDown={event => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % productTabs.length;
    else if (event.key === "ArrowLeft") next = (index + productTabs.length - 1) % productTabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = productTabs.length - 1;
    else return;
    event.preventDefault(); changeTab(productTabs[next]); document.getElementById(`product-tab-${next}`)?.focus();
   }}>{value}</button>)}</div>
   {!!activeCount && <div className={styles.chips}>{categories.map(c => <button type="button" key={c} aria-label={`Hapus kategori ${c}`} onClick={() => setCategories(toggle(categories, c))}>{c} ×</button>)}{cities.map(c => <button type="button" key={c} aria-label={`Hapus kota ${c}`} onClick={() => setCities(toggle(cities, c))}>{c} ×</button>)}</div>}
   {!!cities.length && <p className={styles.status}>Tujuan: {cities.join(", ")}. Konfirmasi ketersediaan pengiriman dengan toko.</p>}
   <p className="sr-only" role="status">{filtered.length} produk ditemukan.</p>
   <div role="tabpanel" id="product-results" aria-labelledby={`product-tab-${productTabs.indexOf(tab as typeof productTabs[number])}`} tabIndex={0}>
    {visible.length ? <div key={`${tab}-${currentPage}-${lo}-${hi}-${categories.join()}`} className={styles.grid}>{visible.map(p => {
     const key = `${tab}:${p.img}`;
     return <article key={key} className={styles.card}>
      <Link href="/product/detail" className={styles.productImage} aria-label={`Lihat ${p.name}, ${p.price}`}><Image src={p.img} alt={p.name} fill sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, (max-width: 1199px) 40vw, 315px" /></Link>
      <button type="button" className={styles.save} aria-label={`${saved.includes(key) ? "Hapus" : "Simpan"} ${p.name} ${p.price}`} aria-pressed={saved.includes(key)} onClick={() => save(key, p.name)}><IconHeart /></button>
      <Link href="/product/detail" className={styles.productText}><h3>{p.name}</h3><p>{p.price}</p></Link>
     </article>;
    })}</div> : <div className={styles.empty}><h3>Produk belum ditemukan</h3><p>Coba kategori lain atau perluas rentang harga.</p><button type="button" onClick={reset}>Reset Filter</button></div>}
   </div>
   {!!visible.length && <nav className={styles.pagination} aria-label="Halaman produk"><button type="button" aria-label="Halaman sebelumnya" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}><IconArrowLeft /></button>{Array.from({ length: pageCount }, (_, i) => i + 1).map(n => <button type="button" key={n} aria-label={`Halaman ${n}`} aria-current={n === currentPage ? "page" : undefined} onClick={() => changePage(n)}>{n}</button>)}<button type="button" aria-label="Halaman berikutnya" disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)}><IconArrowRight /></button></nav>}
   <p className="sr-only" role="status">{notice}</p>
  </div>
 </section>;
}
