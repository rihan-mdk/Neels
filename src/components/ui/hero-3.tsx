"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  images: string[];
  className?: string;
}

const FADE_UP = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 18 },
  },
};

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  ctaHref = "/collections",
  secondaryCtaText,
  secondaryCtaHref = "/jewellery",
  images,
  className,
}) => {
  const duplicatedImages = [...images, ...images];

  return (
    <section
  className={cn(
    "relative w-screen overflow-hidden flex flex-col items-center justify-start text-center min-h-0 h-auto",
    className
  )}
  style={{
    backgroundColor: "#F7E9E7",
    marginLeft: "calc(-50vw + 50%)",
    marginRight: "calc(-50vw + 50%)",
    paddingTop: "96px",
    paddingBottom: "24px",
    minHeight: "auto",
    height: "auto",
    boxSizing: "border-box",
  }}
>
      {/* Ambient gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 15% 55%, rgba(210,160,150,0.38) 0%, transparent 55%)," +
            "radial-gradient(ellipse at 85% 10%, rgba(195,140,130,0.28) 0%, transparent 50%)",
        }}
      />

      {/* ── TOP TEXT BLOCK ── */}
      <div className="relative z-10 flex flex-col items-center px-8 md:px-16 lg:px-24 w-full">

        {/* 1. Tagline */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_UP}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#A0685F",
            marginBottom: "16px",
          }}
        >
          {tagline}
        </motion.p>

        {/* 2. Headline - Reduced font size */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={STAGGER}
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontSize: "clamp(1.8rem, 3.5vw, 3.2rem)",
            fontWeight: 700,
            color: "#1A0F0D",
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            marginBottom: "18px",
            maxWidth: "800px",
          }}
        >
          {typeof title === "string"
            ? title.split(" ").map((word, i) => (
                <motion.span key={i} variants={FADE_UP} className="inline-block mr-[0.18em]">
                  {word}
                </motion.span>
              ))
            : title}
        </motion.h1>

        {/* 3. Description */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_UP}
          transition={{ delay: 0.35 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.82rem, 1.2vw, 1rem)",
            color: "#7A4E49",
            lineHeight: 1.65,
            maxWidth: "500px",
            marginBottom: "24px",
          }}
        >
          {description}
        </motion.p>
      </div>

      {/* 4. Marquee — middle of the page */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.8 }}
        aria-hidden="true"
        className="relative w-full"
        style={{
          height: "clamp(150px, 20vw, 260px)",
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          overflowX: "hidden",
          flexShrink: 0,
        }}
      >
        <motion.div
          className="flex gap-4 absolute top-0 left-0 h-full"
          style={{ willChange: "transform" }}
          animate={{ x: [0, "-50%"] }}
          transition={{ ease: "linear", duration: 38, repeat: Infinity }}
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="flex-shrink-0 overflow-hidden shadow-md"
              style={{
                width: "clamp(100px, 13vw, 185px)",
                height: "clamp(150px, 20vw, 260px)",
                borderRadius: "14px",
                transform: `rotate(${index % 4 === 0 ? -2.5 : index % 4 === 1 ? 1.8 : index % 4 === 2 ? -1.2 : 2.2}deg)`,
              }}
            >
              <img
                src={src}
                alt={`Fashion showcase ${(index % images.length) + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* 5. CTA Buttons — directly below marquee with reduced width */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={FADE_UP}
        transition={{ delay: 0.55 }}
        className="relative z-10 flex items-center justify-center gap-3 w-full"
        style={{ paddingTop: "24px", paddingBottom: "0px" }}
      >
        <Link
          href={ctaHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            backgroundColor: "#1A0F0D",
            color: "#F7E9E7",
            paddingTop: "12px",
            paddingBottom: "12px",
            paddingLeft: "16px",
            paddingRight: "16px",
            borderRadius: "8px 3px 3px 8px",
            whiteSpace: "nowrap",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          {ctaText}
        </Link>

        {secondaryCtaText && (
          <Link
            href={secondaryCtaHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              backgroundColor: "transparent",
              color: "#1A0F0D",
              paddingTop: "11px",
              paddingBottom: "11px",
              paddingLeft: "16px",
              paddingRight: "16px",
              border: "1.5px solid #1A0F0D",
              borderRadius: "8px 3px 3px 8px",
              whiteSpace: "nowrap",
              transition: "background-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "#1A0F0D";
              e.currentTarget.style.color = "#F7E9E7";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#1A0F0D";
            }}
          >
            {secondaryCtaText}
          </Link>
        )}
      </motion.div>
    </section>
  );
};

export default AnimatedMarqueeHero;
