"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AuthForm } from "@/components/ui/AuthForm";
import styles from "./page.module.css";

export default function IntroPage() {
  const [imageVisible, setImageVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Shop front fades in on load
    const imgTimer = setTimeout(() => setImageVisible(true), 80);
    // After 1.5s, blur background + fade in auth form
    const formTimer = setTimeout(() => setFormVisible(true), 1500);
    return () => {
      clearTimeout(imgTimer);
      clearTimeout(formTimer);
    };
  }, []);

  return (
    <div className={styles.intro}>
      {/* ── Full-screen shop front ── */}
      <div className={`${styles.imageWrap} ${imageVisible ? styles.imageVisible : ""}`}>
        <Image
          src="/shop-front.jpeg"
          alt="Neels Designer Studio — Our Store"
          fill
          priority
          className={`${styles.image} ${formVisible ? styles.imageBlurred : ""}`}
          sizes="100vw"
        />
        {/* Gradient overlay — always present for depth */}
        <div className={`${styles.overlay} ${formVisible ? styles.overlayDark : ""}`} />
      </div>

      {/* ── Auth form — fades in after 1.5s ── */}
      <AnimatePresence>
        {formVisible && (
          <motion.div
            className={styles.formWrap}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <AuthForm />

            {/* Guest link below the card */}
            <button
              type="button"
              className={styles.guestBtn}
              onClick={() => router.push("/home")}
            >
              Continue as Guest →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
