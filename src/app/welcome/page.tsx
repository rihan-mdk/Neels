"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PathDrawingPortfolioHero from "@/components/ui/path-drawing-portfolio-hero";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function WelcomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showBtn, setShowBtn] = useState(false);

  // If already authenticated, skip straight to home
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // Reveal GET STARTED button after the animation settles (~1.2s)
  useEffect(() => {
    const t = setTimeout(() => setShowBtn(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleGetStarted = useCallback(() => {
    // Mark as visited so root page won't redirect back to welcome
    if (typeof window !== "undefined") {
      localStorage.setItem("neelsh_visited", "1");
    }
    router.push("/login");
  }, [router]);

  return (
    <div className={styles.page}>
      {/* ── Decorative ambient glow ── */}
      <div className={styles.glow} aria-hidden />

      {/* ── Content ── */}
      <div className={styles.content}>

        {/* Brand eyebrow */}
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Neel&rsquo;s Designer Studio
        </motion.p>

        {/* ── Path-drawing hero animation ── */}
        <div className={styles.heroWrap}>
          <PathDrawingPortfolioHero
            brand="NEEL'S"
            tagline="Contemporary Indian Couture"
          />
        </div>

        {/* ── GET STARTED ── */}
        <AnimatePresence>
          {showBtn && (
            <motion.div
              className={styles.btnWrap}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                className={styles.btn}
                onClick={handleGetStarted}
                aria-label="Get Started — enter Neel's Designer Studio"
              >
                <span className={styles.btnText}>Get Started</span>
                <span className={styles.btnArrow} aria-hidden>→</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom subtle rule ── */}
      <motion.div
        className={styles.bottomRule}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />
    </div>
  );
}
