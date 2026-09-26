import Link from "next/link";
import FeatureStrip from "./FeatureStrip";
import styles from "./Product.module.css";
export default function ProductHero() {
 return <section className={styles.hero} aria-labelledby="product-heading">
  <div className={styles.backdrop}><img src="/figma/product/imgVector.svg" alt="" /><img src="/figma/product/imgVector1.svg" alt="" /></div>
  <div className={styles.heroInner}>
   <div className={styles.decoration}><img src="/figma/product/decoration.png" alt="" /></div>
   <div className={styles.copy}>
    <nav aria-label="Breadcrumb"><img src="/figma/product/home.svg" alt="" width="13" height="13" /><Link href="/">Home</Link><span>/</span><span>Produk</span><span>/</span><strong>Product Collections</strong></nav>
    <h1 id="product-heading">Koleksi untuk Setiap Momen</h1>
    <p>Dari kejutan kecil hingga perayaan yang berarti, temukan bunga yang tepat untuk setiap cerita.</p>
    <a href="#delivery-filter" className={styles.delivery}>Pilih Tujuan Pengiriman<img src="/figma/product/delivery.svg" width="20" height="20" alt="" /></a>
   </div>
   <div className={styles.picture}><div><img src="/figma/product/hero-source.png" alt="Perempuan membawa buket bunga pastel" /></div></div>
  </div>
  <div className={styles.benefits}><FeatureStrip compact /></div>
 </section>;
}
