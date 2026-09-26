import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsappFab from "@/components/site/WhatsappFab";
import FeatureStrip from "@/components/site/FeatureStrip";
import ProductCatalog from "@/components/site/ProductCatalog";
import ProductHero from "@/components/site/ProductHero";
import BlogJournal from "@/components/site/BlogJournal";
export default function ProductPage() {
  return <div className="bg-[#f2f3f7] w-full overflow-x-clip"><Navbar /><main><ProductHero /><ProductCatalog /><FeatureStrip /><BlogJournal /></main><Footer /><WhatsappFab /></div>;
}
