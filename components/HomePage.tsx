import {
  asset,
  favorites,
  favoriteTabs,
} from "@/components/figmaAssets";
import Navbar from "@/components/site/Navbar";
import Reveal from "@/components/site/Reveal";
import Footer from "@/components/site/Footer";
import WhatsappFab from "@/components/site/WhatsappFab";
import FigmaIcon from "@/components/site/FigmaIcon";
import CountUp from "@/components/site/CountUp";
import TestimonialCarousel from "@/components/site/TestimonialCarousel";
import StoreLocations from "@/components/site/StoreLocations";
import BrandMarquee from "@/components/site/BrandMarquee";
import type { ComponentProps, ReactNode } from "react";

type IconName = ComponentProps<typeof FigmaIcon>["name"];

/* ------------------------------------------------------------------ */
/*  Layout helpers                                                     */
/* ------------------------------------------------------------------ */

/** Centres content to the 1440 design width while the section background
 *  around it stays full-bleed. */
function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] ${className}`}>{children}</div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature strip                                                      */
/* ------------------------------------------------------------------ */

const featureItems: { title: string; desc: string; icon: IconName }[] = [
  {
    title: "Jangkauan Luas",
    desc: "Kirim ke lebih dari 200+ kota di indonesia",
    icon: "globe",
  },
  {
    title: "Bunga Segar",
    desc: "Kami menyediakan 100% bunga segar",
    icon: "flower",
  },
  {
    title: "Support 24/7",
    desc: "Dukungan customer services 24 jam sehari",
    icon: "headset",
  },
  {
    title: "Occasions",
    desc: "Buat segala moment menjadi indah",
    icon: "calendar",
  },
];

function FeatureItem({ title, desc, icon }: (typeof featureItems)[number]) {
  return (
    <div className="flex flex-1 gap-[12px] items-center min-w-px">
      <FigmaIcon name={icon} className="size-[34px]" />
      <div className="flex flex-1 flex-col items-start min-w-px">
        <p className="font-bold leading-[1.35] text-[#3f425a] text-[16px]">{title}</p>
        <p className="capitalize font-medium leading-[1.6] text-[#7a70ba] text-[14px]">{desc}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero pieces                                                        */
/* ------------------------------------------------------------------ */

const statCards: { num: string; label: string; icon: IconName }[] = [
  { num: "9.000+", label: "Order/bulan", icon: "bag" },
  { num: "118+", label: "Wilayah", icon: "pin" },
  { num: "9.170+", label: "Klien Puas", icon: "users" },
];

function StatCard({ num, label, icon }: (typeof statCards)[number]) {
  return (
    <div className="flex gap-[16px] items-center">
      <div className="bg-[#e1e2ea] flex items-center justify-center shrink-0 size-[60px]">
        <FigmaIcon name={icon} className="size-[32px]" />
      </div>
      <div className="flex flex-col font-medium items-start text-[#3f425a]">
        <p className="leading-[1.2] text-[28px] tracking-[-0.56px] whitespace-nowrap"><CountUp value={Number(num.replace(/\D/g, ""))} /></p>
        <p className="leading-[1.35] text-[12px] tracking-[-0.12px] whitespace-nowrap">{label}</p>
      </div>
    </div>
  );
}

function MiniStats() {
  return (
    <div className="flex flex-wrap gap-[30px] items-center">
      <div className="flex gap-[12px] items-center">
        <div className="flex items-center">
          <img alt="" className="mr-[-16px] size-[44px]" height={44} width={44} src={asset.ellipse1} />
          <img alt="" className="mr-[-16px] size-[44px]" height={44} width={44} src={asset.ellipse2} />
          <img alt="" className="size-[44px]" height={44} width={44} src={asset.ellipse3} />
        </div>
        <div className="flex flex-col items-start">
          <p className="font-semibold leading-[1.35] text-[#3f425a] text-[20px] whitespace-nowrap"><CountUp value={200} suffix="rb+" /></p>
          <div className="flex gap-[4px] items-center">
            <img alt="" className="size-[14px]" src={asset.star} />
            <p className="font-medium leading-[1.35] text-[#3f425a] text-[12px] whitespace-nowrap">4.9 Rating</p>
          </div>
        </div>
      </div>
      <div className="flex gap-[12px] items-center">
        <div className="bg-[#928ac7] flex items-center justify-center rounded-[22px] size-[44px]">
          <FigmaIcon name="heart" className="size-[20px]" />
        </div>
        <div className="flex flex-col items-start leading-[1.35] text-[#3f425a] whitespace-nowrap">
          <p className="font-semibold text-[20px]"><CountUp value={940} /></p>
          <p className="font-medium text-[12px]">Happy customer</p>
        </div>
      </div>
    </div>
  );
}

function HeroButtons() {
  return (
    <div className="flex flex-wrap gap-[16px] lg:gap-[20px] items-center">
      <a href="/product" className="group bg-[#544997] flex gap-[12px] h-[52px] items-center justify-center px-[24px] py-[14px] transition-colors hover:bg-[#443a86]">
        <span className="font-medium leading-[1.35] text-[16px] text-white whitespace-nowrap">Kirim Bunga</span>
        <span className="flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
          <span className="-scale-y-100 flex-none rotate-180">
            <span className="block h-[12px] w-[19.555px]"><img alt="" className="block max-w-none size-full" src={asset.arrowRight} /></span>
          </span>
        </span>
      </a>
      <a href="/product" className="group border border-[#483f83] flex gap-[10px] h-[52px] items-center justify-center px-[32px] transition-colors hover:bg-[#483f83]/5">
        <span className="font-medium leading-[1.4] text-[#483f83] text-[16px] whitespace-nowrap">Explore Produk</span>
        <span className="flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
          <span className="-scale-y-100 flex-none rotate-180">
            <span className="block h-[18.475px] w-[30.106px]"><img alt="" className="block max-w-none size-full" src={asset.arrowRight1} /></span>
          </span>
        </span>
      </a>
    </div>
  );
}

function HeroText() {
  return (
    <div className="flex flex-col gap-[40px] items-start">
      <div className="flex flex-col gap-[24px] items-start">
        <h1 className="font-ivy font-semibold text-[#3f425a] text-[36px] sm:text-[44px] lg:text-[48px] xl:text-[64px] leading-[1.1]">
          Pesan Bunga
          <br />
          Mudah dan Cepat
        </h1>
        <p className="font-normal text-[#696f96] text-[15px] sm:text-[16px] leading-[1.35]">
          Kirim karangan bunga &amp; gift ke seluruh Indonesia. Garansi kualitas
          <br className="hidden xl:block" />
          {" "}&amp; pengiriman tepat waktu.
        </p>
      </div>
      <HeroButtons />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <div className="home-page bg-[#f3f2f7] relative w-full overflow-x-clip">
      <Navbar />

      {/* ============================ HERO ============================ */}
      <section className="relative w-full bg-[#f3f2f7] overflow-hidden">
        {/* ---------- Desktop composition (lg+) ---------- */}
        <div className="hidden xl:block mx-auto max-w-[1440px] relative h-[832px]">
          <img alt="" className="absolute left-[27.2%] top-0 h-[761px] w-[72.8%] max-w-none" src={asset.vector} />
          <div className="absolute flex h-[185px] items-center justify-center left-0 top-0 w-[330px]">
            <div className="-scale-y-100 flex-none">
              <div className="h-[185px] opacity-86 relative w-[330px]">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="" className="absolute h-[189.94%] left-[-17.42%] max-w-none top-[-78.15%] w-[189.51%]" src={asset.desainFlower} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute left-[27.2%] top-0 h-[728px] w-[72.8%]" style={{ backgroundImage: "linear-gradient(225.85579637166063deg, rgba(242, 243, 247, 0.1) 33.91%, rgb(242, 243, 247) 71.597%)" }} />

          <img alt="" className="absolute left-[41.875%] top-[176px] h-[752px] w-[29.375%] object-cover pointer-events-none" src={asset.image17} />
          <img alt="" className="absolute left-[58.125%] top-[176px] h-[658px] w-[26.4%] object-cover pointer-events-none" src={asset.image15} />

          <div className="absolute flex flex-col gap-[80px] items-start left-[60px] top-[136px] w-[608px] max-w-[42.2%] z-10">
            <HeroText />
            <MiniStats />
          </div>

          <div className="absolute flex flex-col gap-[34px] items-start left-[84.5%] top-[106px] z-10">
            {statCards.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* ---------- Desktop feature strip (full-bleed) ---------- */}
        <div className="hidden xl:block absolute left-0 top-[728px] w-full bg-[#dfddee]">
          <Container className="flex gap-[60px] items-center px-[60px] py-[22px]">
            {featureItems.map((f) => (
              <FeatureItem key={f.title} {...f} />
            ))}
          </Container>
        </div>

        {/* ---------- Mobile / tablet hero (<lg) ---------- */}
        <div className="xl:hidden relative w-full overflow-hidden">
          <img alt="" className="absolute -right-10 top-0 h-[420px] w-[520px] max-w-none opacity-70 pointer-events-none" src={asset.vector} />
          <Container className="relative px-5 md:px-10 pt-8 pb-10 flex flex-col gap-8">
            <HeroText />
            <div className="relative mx-auto w-full max-w-[600px] h-[340px] sm:h-[480px] overflow-hidden">
              <img alt="Rangkaian bunga ungu Sekar Wangi" className="absolute left-0 top-0 h-auto w-[64%]" src={asset.image17} />
              <img alt="Rangkaian bunga mawar Sekar Wangi" className="absolute left-[38%] top-0 h-auto w-[58%]" src={asset.image15} />
            </div>
            <MiniStats />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {statCards.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          </Container>
        </div>

        {/* ---------- Mobile feature strip (full-bleed) ---------- */}
        <div className="xl:hidden bg-[#dfddee] w-full">
          <Container className="grid grid-cols-1 sm:grid-cols-2 gap-x-[40px] gap-y-[22px] px-5 md:px-10 py-[22px]">
            {featureItems.map((f) => (
              <FeatureItem key={f.title} {...f} />
            ))}
          </Container>
        </div>
      </section>

      {/* ======================= FAVORITES ======================= */}
      <section id="favorites" className="w-full bg-[#f3f2f7]">
        <Container className="flex flex-col gap-[40px] lg:gap-[60px] items-center px-5 md:px-10 lg:px-[60px] py-[56px] lg:py-[80px]">
          <Reveal className="flex flex-col gap-[8px] items-center w-full">
            <h2 className="font-ivy font-semibold leading-[1.2] text-[#3f425a] text-[30px] sm:text-[36px] lg:text-[40px] text-center">
              Pilihan Favorit Saat Ini
            </h2>
            <div className="flex flex-wrap gap-[12px] sm:gap-[20px] items-center justify-center">
              {favoriteTabs.map((tab, i) => (
                <button
                  key={tab}
                  className={`flex items-center justify-center py-[10px] border-b-2 leading-[1.6] text-[14px] text-center whitespace-nowrap transition-colors ${
                    i === 0
                      ? "border-[#7a70ba] text-[#3f425a] font-medium"
                      : "border-transparent capitalize text-[#a5a8c0] hover:text-[#7a70ba]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] lg:gap-[20px] w-full">
            {favorites.map((p, i) => (
              <Reveal key={p.name} delay={i * 70} className="h-full">
                <a href="/product/detail" className="group flex flex-col gap-[14px] bg-[#f2f3f7] border border-[#e1e2ea] p-[16px] h-full lg:h-[367px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_-18px_rgba(84,73,151,0.5)] hover:border-[#c9c4e6]">
                  <div className="relative w-full overflow-hidden h-[220px] sm:h-[240px] lg:flex-1 lg:min-h-0">
                    <img alt={p.name} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" src={p.img} />
                  </div>
                  <div className="flex flex-col gap-[6px] items-start leading-[1.35] text-[#3f425a] w-full">
                    <p className="font-medium text-[15px] lg:text-[16px]">{p.name}</p>
                    <p className="font-bold text-[18px] lg:text-[20px] whitespace-nowrap">{p.price}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================== SPEAK / COLLECTION ==================== */}
      <section className="w-full bg-[#e9e7f3]">
        <Container className="relative flex flex-col lg:flex-row lg:h-[400px] items-center justify-between px-5 md:px-10 lg:px-[60px] py-[40px] gap-8 overflow-hidden">
          <Reveal className="flex flex-col gap-[20px] lg:h-full items-start justify-center relative z-10 max-w-[608px]">
            <h2 className="font-ivy font-semibold leading-[1.2] text-[#3f425a] text-[28px] sm:text-[34px] lg:text-[40px]">
              Biarkan bunga yang berbicara
            </h2>
            <p className="font-normal leading-[1.5] text-[#696f96] text-[15px] sm:text-[16px]">
              Temukan rangkaian bunga segar yang dirancang untuk menyampaikan perasaan Anda.
            </p>
            <a href="/product" className="group flex gap-[12px] items-center">
              <span className="font-medium leading-[1.35] text-[#483f83] text-[16px] whitespace-nowrap">Lihat koleksi</span>
              <span className="flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                <span className="-scale-y-100 flex-none rotate-180">
                  <span className="block h-[12px] w-[19.555px]"><img alt="" className="block max-w-none size-full" src={asset.arrowRight2} /></span>
                </span>
              </span>
            </a>
          </Reveal>
          <div className="relative lg:absolute lg:h-[401px] lg:left-[46.8056%] lg:top-[-1px] w-full lg:w-[711px] h-[220px] sm:h-[300px]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 top-0 size-full object-cover lg:max-w-none lg:h-[100.1%] lg:left-[-61.49%] lg:top-[-0.05%] lg:w-[168.8%]" src={asset.chatgpt} />
            </div>
          </div>
        </Container>
      </section>

      {/* ====================== TESTIMONIALS ====================== */}
      <section id="testimonials" className="w-full bg-[#f3f2f7] overflow-hidden">
        <Container className="flex flex-col gap-[36px] lg:gap-[60px] items-start px-5 md:px-10 lg:px-[40px] py-[56px] lg:py-[80px]">
          {/* heading — left aligned to match design */}
          <Reveal className="flex flex-col gap-[8px] lg:gap-[14px] items-start">
            <p className="font-normal leading-[1.35] text-[#696f96] text-[16px] lg:text-[20px]">Testimonial</p>
            <h2 className="font-ivy font-semibold leading-[1.2] text-[#3f425a] text-[30px] sm:text-[36px] lg:text-[40px]">Cerita Mereka</h2>
          </Reveal>

          <TestimonialCarousel />
        </Container>
      </section>

      {/* ======================== STORES ======================== */}
      <StoreLocations />

      {/* ======================= TRUSTED BY ======================= */}
      <section className="w-full bg-[#f3f2f7]">
        <Container className="flex flex-col gap-[24px] items-start justify-center px-5 md:px-10 lg:px-[60px] py-[40px]">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between w-full">
            <p className="font-medium leading-[1.2] text-[#3f425a] text-[16px] lg:text-[18px] tracking-[-0.36px]">
              Trusted by 70,000+ global companies
            </p>
            <div className="flex flex-wrap gap-[16px] items-center">
              <div className="flex gap-[8px] items-center">
                {[0, 1, 2, 3, 4].map((i) => (
                  <FigmaIcon key={i} name="star" className="size-[24px]" />
                ))}
              </div>
              <p className="font-medium leading-[1.2] text-[#939397] text-[20px] tracking-[-0.8px] whitespace-nowrap">4.9 / 5.0</p>
              <span className="hidden sm:block h-[24px] w-px bg-[#d9d9dd]" />
              <div className="flex gap-[6px] items-center">
                <span className="bg-[#cbcbcd] flex items-center justify-center p-[4px] rounded-[90px]">
                  <img alt="" className="size-[16px]" src={asset.googleLogo} />
                </span>
                <span className="bg-[#cbcbcd] flex items-center justify-center p-[4px] rounded-[90px]">
                  <img alt="" className="size-[16px]" src={asset.frame30} />
                </span>
              </div>
            </div>
          </div>
          <BrandMarquee />
        </Container>
      </section>

      {/* ========================= FOOTER ========================= */}
      <Footer />

      <WhatsappFab />
    </div>
  );
}
