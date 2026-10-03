"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AuthForm } from "@/components/ui/AuthForm";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function IntroPage() {
  const router = useRouter();
  const { user, loading, continueAsGuest } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  const handleGuestClick = () => {
    continueAsGuest();
    router.push("/");
  };

  return (
    <div className={styles.intro}>
      <motion.div
        className={styles.formWrap}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <AuthForm />

        {/* Guest link below the card */}
        <button
          type="button"
          className={styles.guestBtn}
          onClick={handleGuestClick}
        >
          Continue as Guest →
        </button>
      </motion.div>
    </div>
  );
}
