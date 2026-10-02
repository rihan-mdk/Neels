"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, KeyRound, FingerprintIcon, ArrowLeft } from "lucide-react";
import styles from "./SignInDrawer.module.css";

interface SignInDrawerProps {
  children?: React.ReactNode;
}

export function SignInDrawer({ children }: SignInDrawerProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<"form" | "loading">("form");
  const [tab, setTab] = React.useState<"email" | "passkey">("email");

  const handleOpen = () => {
    setStep("form");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setStep("form"), 300);
  };

  const handleSignIn = () => {
    setStep("loading");
    setTimeout(() => {
      router.push("/home");
    }, 1400);
  };

  return (
    <>
      {/* Trigger */}
      <span onClick={handleOpen} style={{ display: "contents" }}>
        {children}
      </span>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            className={styles.drawer}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Handle bar */}
            <div className={styles.handle} />

            {/* Header */}
            <div className={styles.header}>
              {step === "loading" && (
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={() => setStep("form")}
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <span className={styles.headerTitle}>
                {step === "form" ? "Sign In" : "Signing in…"}
              </span>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={handleClose}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className={styles.body}>
              <AnimatePresence mode="wait" initial={false}>
                {step === "form" ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Tab switcher */}
                    <div className={styles.tabs}>
                      <button
                        className={`${styles.tabBtn} ${tab === "email" ? styles.tabActive : ""}`}
                        onClick={() => setTab("email")}
                        type="button"
                      >
                        <Mail size={13} />
                        Email
                      </button>
                      <button
                        className={`${styles.tabBtn} ${tab === "passkey" ? styles.tabActive : ""}`}
                        onClick={() => setTab("passkey")}
                        type="button"
                      >
                        <KeyRound size={13} />
                        Passkey
                      </button>
                    </div>

                    {/* Email form */}
                    {tab === "email" && (
                      <motion.div
                        key="email-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className={styles.formFields}
                      >
                        <div className={styles.field}>
                          <label className={styles.fieldLabel}>Email</label>
                          <input
                            type="email"
                            placeholder="your@email.com"
                            className={styles.input}
                          />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.fieldLabel}>Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className={styles.input}
                          />
                        </div>
                        <button
                          type="button"
                          className={styles.primaryBtn}
                          onClick={handleSignIn}
                        >
                          Sign In
                        </button>
                        <button type="button" className={styles.forgotBtn}>
                          Forgot password?
                        </button>
                      </motion.div>
                    )}

                    {/* Passkey form */}
                    {tab === "passkey" && (
                      <motion.div
                        key="passkey-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className={styles.formFields}
                      >
                        <div className={styles.passkeyIcon}>
                          <FingerprintIcon size={48} strokeWidth={1} />
                        </div>
                        <p className={styles.passkeyHint}>
                          Sign in quickly with a passkey
                        </p>
                        <button
                          type="button"
                          className={styles.primaryBtn}
                          onClick={handleSignIn}
                        >
                          Continue with Passkey
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  /* Loading / success state */
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={styles.loadingState}
                  >
                    <div className={styles.spinnerWrap}>
                      <motion.div
                        className={styles.spinnerRing}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <KeyRound size={28} className={styles.spinnerIcon} />
                    </div>
                    <p className={styles.loadingText}>Entering the studio…</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SignInDrawer;
