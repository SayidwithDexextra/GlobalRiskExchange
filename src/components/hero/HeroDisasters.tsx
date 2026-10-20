"use client";
import { useEffect, useRef } from "react";
// @ts-ignore  plain JS module shared with the design source
import { startDisasters } from "./dxDisasters";

/**
 * Drop inside the hero stage (the overflow-hidden wrapper that holds the hero copy, the lightning
 * canvas, the rocks and the dashboard), as a sibling placed BEFORE the lightning canvas.
 * It auto-detects the copy (element containing the h1), the dashboard and the rocks. For certainty,
 * add data-hero-copy / data-hero-dash / data-hero-rock to those elements.
 */
export default function HeroDisasters({ base = "/assets/dx-", top = 84 }: { base?: string; top?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return startDisasters(ref.current, { base, top });
  }, [base, top]);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="dx-disasters"
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}
    />
  );
}
