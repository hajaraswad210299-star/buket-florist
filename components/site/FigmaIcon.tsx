import type { CSSProperties } from "react";
import { asset } from "@/components/figmaAssets";

const glyphs = {
  globe: [asset.group13, "5.39%"],
  flower: [asset.group14, "4.99% 11.44% 3.42% 9.94%"],
  headset: [asset.group15, "5.39% 9.56%"],
  calendar: [asset.group16, "5.39% 7.47%"],
  bag: [asset.group9, "8.33%"],
  pin: [asset.group10, "7.29% 13.04% 7.29% 13%"],
  users: [asset.group11, "5.29% 7.29%"],
  heart: [asset.group7, "9.44% 8.35% 9.5% 8.33%"],
  store: [asset.pinIcon, "5.21% 6.74% 5.21% 6.53%"],
  star: [asset.starFilled, "9.38% 7.29%"],
  user: [asset.group2, "4.58% 10.46%"],
  cart: [asset.group1, "4.62% 9.79% 4.58% 9.79%"],
  categories: [asset.group4, "15% 8.75%"],
  support: [asset.group6, "4.58%"],
  whatsapp: [asset.group21, "5.2%"],
  previous: [asset.elementsArrowLeft, "26.95% 16.67% 26.96% 12.25%"],
} as const;

/** Original Figma glyphs, preserving their inset within the icon frame. */
export default function FigmaIcon({ name, className = "", style }: {
  name: keyof typeof glyphs;
  className?: string;
  style?: CSSProperties;
}) {
  const [src, inset] = glyphs[name];
  return (
    <span aria-hidden="true" className={`relative inline-block shrink-0 ${className}`} style={style}>
      <span className="absolute" style={{ inset }}>
        {/* Exported SVGs retain the original Figma colors and geometry. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="block size-full" />
      </span>
    </span>
  );
}
