import type { Product } from "@/lib/products";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsappFab from "@/components/site/WhatsappFab";
import ProductDetail from "@/components/site/ProductDetail";
import RelatedProducts from "@/components/site/RelatedProducts";

export default function ProductDetailPage({ product, related }: { product: Product; related: Product[] }) {
  return (
    <div className="bg-[#efeef7] relative w-full overflow-x-clip">
      <Navbar />
      <main><ProductDetail key={product.id} product={product} /><RelatedProducts products={related} /></main>
      <Footer />
      <WhatsappFab />
    </div>
  );
}
