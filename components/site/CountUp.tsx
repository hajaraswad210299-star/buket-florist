"use client";

import { useEffect, useRef } from "react";

/** Animate once when visible; retain the final value for SSR and screen readers. */
export default function CountUp({ value, suffix = "+" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const finalValue = `${value.toLocaleString("id-ID")}${suffix}`;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let started = false;
    const finish = () => {
      cancelAnimationFrame(frame);
      node.textContent = finalValue;
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      observer.disconnect();
      if (motion.matches) return finish();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1800, 1);
        const current = Math.round(value * (1 - Math.pow(1 - progress, 3)));
        node.textContent = `${current.toLocaleString("id-ID")}${suffix}`;
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      node.textContent = `0${suffix}`;
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    const onMotionChange = () => { if (motion.matches) finish(); };
    observer.observe(node);
    motion.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", onMotionChange);
      finish();
    };
  }, [value, suffix, finalValue]);

  return <span className="inline-grid tabular-nums">
    <span className="invisible col-start-1 row-start-1" aria-hidden="true">{finalValue}</span>
    <span ref={ref} aria-hidden="true" className="col-start-1 row-start-1">{finalValue}</span>
    <span className="sr-only">{finalValue}</span>
  </span>;
}
