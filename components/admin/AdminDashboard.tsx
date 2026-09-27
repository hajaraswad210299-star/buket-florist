"use client";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { chartMonths, chartBuket, chartKado } from "./adminData";
import styles from "./Dashboard.module.css";
const asset = (name: string) => `/figma/admin/${name}.svg`;
function Icon({ name }: { name: string }) { return <span className={styles.icon}><img src={asset(name)} alt="" /></span>; }
function More({ children, label }: { children: React.ReactNode; label: string }) {
 const ref = useRef<HTMLDetailsElement>(null);
 useEffect(() => { function close(e: PointerEvent) { if (!ref.current?.contains(e.target as Node)) ref.current?.removeAttribute("open"); } document.addEventListener("pointerdown", close); return () => document.removeEventListener("pointerdown", close); }, []);
 return <details ref={ref} className={styles.menuWrap} onKeyDown={e => {if(e.key === "Escape") {ref.current?.removeAttribute("open");ref.current?.querySelector("summary")?.focus();}}}><summary aria-label={label} className={`${styles.iconButton} ${styles.borderButton} list-none`}><Icon name="imgElements12" /></summary><div className={styles.popup}>{children}</div></details>;
}
function Chart() {
 const ref = useRef<HTMLDivElement>(null);
 const [width, setWidth] = useState(1046);
 const [active, setActive] = useState<number | null>(null);
 useEffect(() => { const element = ref.current; if (!element) return; const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width)); observer.observe(element); return () => observer.disconnect(); }, []);
 return <section className={styles.chart} aria-label="Grafik contoh Revenue dan Order"><div className={styles.panelHeading}><h2>Revenue &amp; Order Cadence</h2><More label="Informasi grafik">Grafik ini memakai data contoh desain. Transaksi belum dicatat di database.</More></div><div className={styles.chartCanvas}>
 <div className={styles.chartSummary}><strong>487</strong><span>Total Order</span><div className={styles.legend}><span><img src={asset("imgEllipse24")} alt="" />Buket</span><span><img src={asset("imgEllipse25")} alt="" />kado</span></div></div>
 <div className={styles.graph}><div className={styles.axis}>{[10,9.5,9,8.5,8,7.5,7].map(v => <span key={v}>{v}</span>)}</div><div ref={ref} className={styles.plot} onPointerMove={e => {const rect=e.currentTarget.getBoundingClientRect();setActive(Math.min(8,Math.max(0,Math.round((e.clientX-rect.left)/rect.width*8))));}} onPointerLeave={() => setActive(null)}>{[0,1,2,3,4,5,6].map(n => <img key={n} src={asset("imgLine269")} alt="" className={styles.gridLine} style={{transform:`scaleX(${width/1048})`}} />)}<img src={asset("imgLineGroup")} alt="Grafik contoh tren buket dan kado" className={styles.lineAsset} style={{transform:`scaleX(${width/1046})`}} />{active !== null && <div className={styles.tooltip}>{chartMonths[active]} · Buket {chartBuket[active]} · Kado {chartKado[active]}</div>}</div></div>
 <div className={styles.months}>{chartMonths.map((month,i) => <button key={month} onFocus={() => setActive(i)} onBlur={() => setActive(null)} onClick={() => setActive(active === i ? null : i)} aria-label={`Lihat contoh statistik ${month}`}>{month}</button>)}</div></div></section>;
}
export default function AdminDashboard({ products }: { products: Product[] }) {
 const [date, setDate] = useState("2026-08-13");
 const [dateOpen, setDateOpen] = useState(false);
 const [notice, setNotice] = useState("");
 const formattedDate = new Intl.DateTimeFormat("en-GB", {weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(`${date}T12:00:00Z`));
 const stats = [{title:"Total Order",value:"5.480",delta:"+20%",icon:"imgAnalyticsUp",spark:"imgGroup11"},{title:"Bouquets Sold",value:"1.200",delta:"-34%",icon:"imgElements13",spark:"imgGroup12"},{title:"Today’s Revenue",value:"120",delta:"+20%",icon:"imgElements14",spark:"imgGroup11"}];
 return <main className={styles.dashboard}>
 <div className={styles.topbar}><div className={styles.crumbs}><span className={styles.crumbIcon}><Icon name="imgElements6" /></span><span className={styles.overview}>Overview</span><Icon name="imgElements7" /><span>Dashboard</span></div><div className={styles.tools}><button className={styles.iconButton} aria-label="Preferensi tampilan" onClick={() => setNotice(notice ? "" : "Dashboard menggunakan tema terang sesuai desain.")}><Icon name="imgElements8" /></button><button className={styles.iconButton} aria-label="Notifikasi" onClick={() => setNotice(notice ? "" : "Belum ada notifikasi baru.")}><Icon name="imgElements9" /></button></div></div>
 <div className={styles.body}><header className={styles.greeting}><div><h1>Good Morning, Yuna</h1><p>Here’s your latest performance, insights, and growth overview.</p></div><div className={styles.tools}><div className={styles.dateWrap}><button className={styles.date} aria-expanded={dateOpen} onClick={() => setDateOpen(!dateOpen)}><Icon name="imgElements10" />{formattedDate}<Icon name="imgElements11" /></button>{dateOpen && <div className={styles.datePanel}><label className="text-sm">Tanggal tampilan<input aria-label="Tanggal dashboard" type="date" value={date} onChange={e => { if(e.target.value) {setDate(e.target.value);setDateOpen(false);setNotice("Tanggal dipilih. Statistik masih menggunakan data contoh desain.");} }} /></label></div>}</div><More label="Menu dashboard"><p>Statistik dan pesanan adalah data contoh Figma.</p><a href="/admin/products">Kelola {products.length} produk dari database</a></More></div></header>
 {notice && <p className={styles.notice} role="status">{notice}</p>}
 <div className={styles.sections}><section className={styles.cards} aria-label="Statistik contoh">{stats.map(s => <article className={styles.card} key={s.title}><div className={styles.cardHeading}><h2>{s.title}</h2><span className={styles.cardIcon}><Icon name={s.icon} /></span></div><div className={styles.cardValue}><div><p className={styles.number}>{s.value}</p><p className={styles.change}><b className={s.delta.startsWith("-") ? styles.negative : ""}>{s.delta}</b><span>This Week</span></p></div><span className={styles.spark}><img src={asset(s.spark)} alt="" /></span></div></article>)}</section>
 <Chart />
 <section className={styles.orders}><div className={styles.ordersHeading}><h2>Recent Floral Orders</h2><button onClick={() => setNotice("Tiga pesanan ini adalah contoh desain. Daftar transaksi asli belum tersedia.")}>View All (38 orders)</button></div><div className={styles.tableWrap}><table className={styles.table}><caption className="sr-only">Pesanan contoh dari desain Figma</caption><thead><tr><th>ID Order</th><th>Bouquet Composition</th><th>Tanggal Order</th><th>Total Order</th></tr></thead><tbody>{["Lavender Romance","Purple Garden","Violet Classic"].map((name,i) => <tr key={name}><td>#ORD-213</td><td><div className={styles.bouquet}><img src={`/figma/admin/imgRectangle${30+i}.png`} alt="" />{name}</div></td><td>12 June 2025</td><td className={styles.mono}>02 PCS</td></tr>)}</tbody></table></div></section>
 </div></div></main>;
}
