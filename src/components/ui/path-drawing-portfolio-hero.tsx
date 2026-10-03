"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "motion/react";

// ── Utility ──────────────────────────────────────────────────────────────────
function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

// ── Types ─────────────────────────────────────────────────────────────────────
type SvgPathDrawingProps = {
  text: string;
  fromColor?: string;
  toColor?: string;
  strokeWidth?: number;
  durationSec?: number;
  loop?: boolean;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  fontSize?: number;
  fontFamily?: string;
  letterSpacing?: string;
  className?: string;
};

// ── Canvas helpers ────────────────────────────────────────────────────────────
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("svg raster failed"));
    img.src = url;
  });
}

function countOpaque(ctx: CanvasRenderingContext2D, w: number, h: number): number {
  const data = ctx.getImageData(0, 0, w, h).data;
  let n = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 12) n += 1;
  }
  return n;
}

async function rasterInk(
  source: SVGSVGElement,
  apply: (text: SVGTextElement) => void,
): Promise<number> {
  const clone = source.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const text = clone.querySelector("text");
  if (!text) return 0;
  apply(text as SVGTextElement);
  text.setAttribute("stroke", "#ffffff");
  (text as SVGTextElement).style.stroke = "#ffffff";

  const vb = source.viewBox.baseVal;
  const w = Math.max(1, Math.round(vb.width || 800));
  const h = Math.max(1, Math.round(vb.height || 160));
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  clone.style.visibility = "visible";

  const xml = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const cw = Math.max(1, Math.round(w * 0.45));
    const ch = Math.max(1, Math.round(h * 0.45));
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return 0;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, cw, ch);
    return countOpaque(ctx, cw, ch);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function measureExactDashLength(svg: SVGSVGElement): Promise<number> {
  const full = await rasterInk(svg, (text) => {
    text.style.strokeDasharray = "none";
    text.style.strokeDashoffset = "0";
  });
  if (full <= 0) throw new Error("empty ink");

  const covered = async (dash: number) => {
    const ink = await rasterInk(svg, (text) => {
      text.style.strokeDasharray = `${dash} 100000`;
      text.style.strokeDashoffset = "0";
    });
    return ink >= full * 0.994;
  };

  let hi = 64;
  while (hi < 24000 && !(await covered(hi))) hi *= 2;

  let lo = 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (await covered(mid)) hi = mid;
    else lo = mid + 1;
  }

  return Math.max(1, lo);
}

// ── Core SVG path-drawing animation ──────────────────────────────────────────
function SvgPathDrawingText({
  text,
  fromColor = "#D9A7A7",
  toColor = "#B57A7A",
  strokeWidth = 1.8,
  durationSec = 5,
  loop = true,
  viewBoxWidth = 440,
  viewBoxHeight = 130,
  fontSize = 92,
  fontFamily = "'Cormorant Garamond', Georgia, serif",
  letterSpacing = "0.08em",
  className,
}: SvgPathDrawingProps) {
  const reactId = useId().replace(/:/g, "");
  const gradientId = `neelsGrad-${reactId}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const [dashLength, setDashLength] = useState(0);
  const reduceMotion = useReducedMotion();
  const display = text.trim();

  useEffect(() => {
    if (!display || reduceMotion) return;
    if (!svgRef.current) return;
    let cancelled = false;

    const run = async () => {
      try {
        await document.fonts.ready;
        if (cancelled || !svgRef.current) return;
        const dash = await measureExactDashLength(svgRef.current);
        if (!cancelled) setDashLength(dash);
      } catch {
        const el = textRef.current;
        if (!el || cancelled) return;
        const width =
          el.getComputedTextLength() || display.length * fontSize * 0.62;
        setDashLength(Math.max(1, Math.ceil(width * 1.15)));
      }
    };
    void run();
    return () => { cancelled = true; };
  }, [display, fontSize, viewBoxWidth, strokeWidth, reduceMotion]);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    if (reduceMotion || dashLength <= 0) {
      el.style.strokeDashoffset = "0";
      el.style.strokeDasharray = "none";
      return;
    }

    el.style.strokeDasharray = `${dashLength} ${dashLength}`;
    el.style.strokeDashoffset = String(dashLength);

    const drawMs = Math.max(0.8, durationSec) * 1000;
    const unitsPerMs = dashLength / drawMs;
    let offset = dashLength;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      offset -= unitsPerMs * dt;
      if (offset <= 0) {
        if (!loop) {
          el.style.strokeDashoffset = "0";
          return;
        }
        offset = dashLength;
      }
      el.style.strokeDashoffset = String(offset);
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [dashLength, durationSec, loop, reduceMotion]);

  if (!display) return null;

  const ready = dashLength > 0 || Boolean(reduceMotion);

  return (
    <div className={cn("w-full flex items-center justify-center", className)}>
      <svg
        ref={svgRef}
        width="1000"
        height="380"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "100%",
          visibility: ready ? "visible" : "hidden",
          display: "block",
        }}
        role="img"
        aria-label={display}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={fromColor} />
            <stop offset="100%" stopColor={toColor} />
          </linearGradient>
        </defs>
        <text
          ref={textRef}
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          fontSize={fontSize}
          fontWeight="300"
          fontFamily={fontFamily}
          letterSpacing={letterSpacing}
        >
          {display}
        </text>
      </svg>
    </div>
  );
}

// ── Public export ─────────────────────────────────────────────────────────────
export type PathDrawingPortfolioHeroProps = {
  brand: string;
  tagline?: string;
  eyebrow?: string;
  fromColor?: string;
  toColor?: string;
  className?: string;
};

export default function PathDrawingPortfolioHero({
  brand,
  tagline,
  eyebrow,
  fromColor = "#D9A7A7",
  toColor = "#B57A7A",
  className,
}: PathDrawingPortfolioHeroProps) {
  const name = brand.trim();
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  if (!name) return null;

  const instant = Boolean(reduceMotion) || !ready;

  // Calibrate viewBox for "NEEL'S" (6 chars, serif, wide letterSpacing)
  const charCount = name.length;
  const vbWidth = charCount <= 6 ? 440 : charCount <= 10 ? 640 : 860;
  const vbHeight = 130;
  const fSize = charCount <= 6 ? 92 : charCount <= 10 ? 80 : 68;

  return (
    <div
      className={cn("w-full flex flex-col items-center", className)}
      aria-label={name}
    >
      {eyebrow && (
        <motion.p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "10px",
            fontWeight: 400,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(217,167,167,0.65)",
            marginBottom: "20px",
          }}
          initial={instant ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {eyebrow}
        </motion.p>
      )}

      <motion.div
        style={{ width: "100%" }}
        initial={instant ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <SvgPathDrawingText
          text={name}
          fromColor={fromColor}
          toColor={toColor}
          viewBoxWidth={vbWidth}
          viewBoxHeight={vbHeight}
          fontSize={fSize}
          durationSec={5}
          loop
        />
      </motion.div>

      {tagline && (
        <motion.p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(13px, 2vw, 16px)",
            fontWeight: 300,
            letterSpacing: "0.22em",
            color: "rgba(255,253,252,0.45)",
            marginTop: "8px",
            textTransform: "uppercase",
            textAlign: "center",
          }}
          initial={instant ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {tagline}
        </motion.p>
      )}
    </div>
  );
}
