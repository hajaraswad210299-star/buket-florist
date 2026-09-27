import { notFound } from "next/navigation";
import { getProducts } from "@/lib/supabase-products";
import ProductDetailPage from "@/components/ProductDetailPage";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const product = (await getProducts()).find(p => p.slug === slug);
 return { title: product ? `${product.name} — Sekar Wangi` : "Produk tidak ditemukan" };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const products = await getProducts();
 const product = products.find(p => p.slug === slug);
 if (!product) notFound();
 return <ProductDetailPage product={product} related={products.filter(p => p.id !== product.id).slice(0, 5)} />;
}
