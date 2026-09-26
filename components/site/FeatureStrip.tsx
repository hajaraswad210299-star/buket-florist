const items = [
 { title: "Jangkauan Luas", desc: "Kirim Ke Lebih Dari 200+ Kota Di Indonesia", icon: "benefit-8.svg" },
 { title: "Bunga Segar", desc: "Kami Menyediakan 100% Bunga Segar", icon: "benefit-9.svg" },
 { title: "Support 24/7", desc: "Dukungan Customer Services 24 Jam Sehari", icon: "benefit-10.svg" },
 { title: "Occasions", desc: "Buat Segala Moment Menjadi Indah", icon: "benefit-11.svg" },
] as const;
export default function FeatureStrip({ compact = false }: { compact?: boolean }) {
 return <section className="w-full bg-[#7a70ba]"><div className={`mx-auto w-full max-w-[1440px] grid grid-cols-2 lg:grid-cols-4 gap-y-6 px-5 md:px-10 lg:pl-[60px] ${compact ? "lg:pr-[calc(33.82%+14px)] gap-x-0 py-3" : "lg:pr-[60px] gap-x-6 py-[26px]"}`}>
 {items.map(item => <div key={item.title} className="group flex gap-3 items-center"><span className="size-[34px] shrink-0 flex items-center justify-center transition-transform duration-300 motion-reduce:transition-none group-hover:scale-110"><img src={`/figma/product/${item.icon}`} alt="" /></span><div><p className="font-bold leading-[1.35] text-white text-[16px]">{item.title}</p><p className="leading-[1.6] text-[#f0f1f5] text-[14px]">{item.desc}</p></div></div>)}
 </div></section>;
}
