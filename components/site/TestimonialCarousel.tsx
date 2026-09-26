"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { asset } from "@/components/figmaAssets";
import { testimonials } from "./testimonials";
import FigmaIcon from "./FigmaIcon";
import styles from "./HomeMotion.module.css";

export default function TestimonialCarousel() {
  const [slide, setSlide] = useState({ index: 1, direction: 1, revision: 0 });
  const touch = useRef<{ x: number; y: number } | null>(null);
  const wrap = (index: number) => (index + testimonials.length) % testimonials.length;
  const move = (direction: number) => setSlide(s => ({ index: wrap(s.index + direction), direction, revision: s.revision + 1 }));
  const select = (index: number) => setSlide(s => index === s.index ? s : ({ index, direction: index > s.index ? 1 : -1, revision: s.revision + 1 }));
  const active = testimonials[slide.index];
  const preview = (offset: number) => {
    const index = wrap(slide.index + offset);
    const item = testimonials[index];
    return <button type="button" key={offset} className={`${styles.preview} shrink-0 h-[152px] w-[204px] relative`} onClick={() => select(index)} aria-label={`Lihat testimoni ${item.name}`}>
      <Image src={item.image} alt="" fill sizes="204px" className="object-cover" />
    </button>;
  };

  return <div role="region" aria-roledescription="carousel" aria-label="Cerita pelanggan" className="flex flex-col gap-[46px] w-full"
    onKeyDown={event => {
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    }}>
    <div className="flex gap-[24px] items-end justify-center w-full" style={{ touchAction: "pan-y" }}
      onTouchStart={event => { const point = event.touches[0]; touch.current = { x: point.clientX, y: point.clientY }; }}
      onTouchEnd={event => {
        if (!touch.current) return;
        const dx = event.changedTouches[0].clientX - touch.current.x;
        const dy = event.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
        touch.current = null;
      }} onTouchCancel={() => { touch.current = null; }}>
      <div className="hidden xl:flex gap-[24px] self-start">{preview(-2)}{preview(-1)}</div>
      <div key={slide.revision} id="testimonial-slide" role="group" aria-roledescription="slide" aria-label={`${slide.index + 1} dari ${testimonials.length}`}
        style={{ "--slide-from": `${slide.direction * 24}px` } as CSSProperties}
        className={`${styles.slide} flex flex-col md:flex-row gap-[24px] md:gap-[40px] w-full xl:w-[800px] shrink-0`}>
        <div className="relative w-full md:w-[296px] h-[320px] md:h-[351px] shrink-0 overflow-hidden">
          <Image src={active.image} alt={active.name} fill sizes="(min-width: 768px) 296px, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-1 flex-col justify-between min-w-0 gap-6 min-h-[290px] md:h-[351px]">
          <blockquote className="font-normal leading-[1.5] text-[#3c3e3e] text-[20px] sm:text-[22px] xl:text-[28px] tracking-[-0.03em]">{active.quote}</blockquote>
          <div className="flex flex-col gap-[6px] leading-[1.2] min-h-[60px] justify-center">
            <p className="font-medium text-[#1d211d] text-[20px] tracking-[-0.6px]">{active.name}</p>
            <p className="text-[#879687] text-[16px] tracking-[-0.48px]">{active.role}</p>
          </div>
        </div>
      </div>
      <div className="hidden xl:flex gap-[24px]">{preview(1)}{preview(2)}</div>
    </div>
    <div className="flex gap-[12px] items-center w-full">
      <button type="button" onClick={() => move(-1)} aria-label="Testimoni sebelumnya" aria-controls="testimonial-slide" className={`${styles.control} flex items-center gap-[10px] min-h-11 text-[#8d9091]`}>
        <FigmaIcon name="previous" className="size-[24px]" /><span className="font-medium text-[16px]">Prev</span>
      </button>
      <div className="flex flex-1 items-center justify-center gap-0 sm:gap-1">
        {testimonials.map((item, index) => <button key={item.name} type="button" aria-label={`Testimoni ${index + 1}: ${item.name}`} aria-current={index === slide.index ? "true" : undefined}
          aria-controls="testimonial-slide" onClick={() => select(index)} className={`${styles.control} flex items-center justify-center min-h-11 px-1`}>
          <span className={`h-[12px] rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${index === slide.index ? "w-[30px] bg-[#7a70ba]" : "w-[12px] bg-[#d8d5ea]"}`} />
        </button>)}
      </div>
      <button type="button" onClick={() => move(1)} aria-label="Testimoni berikutnya" aria-controls="testimonial-slide" className={`${styles.control} flex items-center gap-[10px] min-h-11 text-[#8d9091]`}>
        <span className="font-medium text-[16px]">Next</span><Image alt="" src={asset.arrowRight3} width={20} height={12} className="-scale-x-100" />
      </button>
    </div>
    <p className="sr-only" aria-live="polite" aria-atomic="true">{slide.index + 1} dari {testimonials.length}: {active.name}. {active.quote}</p>
  </div>;
}
