"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowLeft, MailCheck } from "lucide-react";
import styles from "./AuthForm.module.css";

// ── Schemas ──────────────────────────────────────────────────
const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;
type ForgotData = z.infer<typeof forgotSchema>;

type View = "signin" | "signup" | "forgot" | "success";

// ── Main Auth Form ────────────────────────────────────────────
export function AuthForm() {
  const [view, setView] = React.useState<View>("signin");

  return (
    <div className={styles.card}>
      <AnimatePresence mode="wait" initial={false}>
        {view === "signin" && (
          <SignInView
            key="signin"
            onForgot={() => setView("forgot")}
            onSignUp={() => setView("signup")}
          />
        )}
        {view === "signup" && (
          <SignUpView key="signup" onSignIn={() => setView("signin")} />
        )}
        {view === "forgot" && (
          <ForgotView
            key="forgot"
            onBack={() => setView("signin")}
            onSuccess={() => setView("success")}
          />
        )}
        {view === "success" && (
          <ResetSuccessView key="success" onBack={() => setView("signin")} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Shared slide animation ────────────────────────────────────
const slide = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

// ── Error message ────────────────────────────────────────────
function ErrorMsg({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return <p className={styles.errorMsg}>{msg}</p>;
}

// ── Field wrapper ─────────────────────────────────────────────
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {children}
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}

// ── Sign In ───────────────────────────────────────────────────
function SignInView({
  onForgot,
  onSignUp,
}: {
  onForgot: () => void;
  onSignUp: () => void;
}) {
  const router = useRouter();
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({ resolver: zodResolver(signInSchema) });

  const onSubmit = async (data: SignInData) => {
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 1200));
    if (typeof window !== "undefined") {
      localStorage.setItem("neelsh_visited", "true");
      localStorage.setItem("neelsh_user", JSON.stringify({ email: data.email, loggedIn: true }));
    }
    setLoading(false);
    router.push("/");
  };

  return (
    <motion.div {...slide} className={styles.view}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to Neels Designer Studio</p>
      </div>

      <ErrorMsg msg={error} />

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            placeholder="your@email.com"
            className={styles.input}
            disabled={loading}
            {...register("email")}
          />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className={styles.pwWrap}>
            <input
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              className={styles.input}
              disabled={loading}
              {...register("password")}
            />
            <button
              type="button"
              className={styles.pwToggle}
              onClick={() => setShowPw((v) => !v)}
              tabIndex={-1}
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>

        <button
          type="button"
          className={styles.linkBtn}
          onClick={onForgot}
          disabled={loading}
        >
          Forgot password?
        </button>

        <button type="submit" className={styles.primaryBtn} disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={14} className={styles.spin} />
              Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className={styles.dividerRow}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>or</span>
        <span className={styles.dividerLine} />
      </div>

      {/* Google */}
      <button className={styles.googleBtn} type="button" disabled={loading}>
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <p className={styles.switchRow}>
        No account?{" "}
        <button type="button" className={styles.switchBtn} onClick={onSignUp} disabled={loading}>
          Create one
        </button>
      </p>
    </motion.div>
  );
}

// ── Sign Up ───────────────────────────────────────────────────
function SignUpView({ onSignIn }: { onSignIn: () => void }) {
  const router = useRouter();
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = async (data: SignUpData) => {
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 1200));
    if (typeof window !== "undefined") {
      localStorage.setItem("neelsh_visited", "true");
      localStorage.setItem("neelsh_user", JSON.stringify({ email: data.email, name: data.name, loggedIn: true }));
    }
    setLoading(false);
    router.push("/");
  };

  return (
    <motion.div {...slide} className={styles.view}>
      <button type="button" className={styles.backBtn} onClick={onSignIn}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className={styles.heading}>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Join Neels Designer Studio</p>
      </div>

      <ErrorMsg msg={error} />

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
        <Field label="Full Name" error={errors.name?.message}>
          <input type="text" placeholder="Your Name" className={styles.input} disabled={loading} {...register("name")} />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <input type="email" placeholder="your@email.com" className={styles.input} disabled={loading} {...register("email")} />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className={styles.pwWrap}>
            <input
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              className={styles.input}
              disabled={loading}
              {...register("password")}
            />
            <button type="button" className={styles.pwToggle} onClick={() => setShowPw((v) => !v)} tabIndex={-1}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>

        <button type="submit" className={styles.primaryBtn} disabled={loading}>
          {loading ? <><Loader2 size={14} className={styles.spin} /> Creating…</> : "Create Account"}
        </button>
      </form>

      <p className={styles.switchRow}>
        Already have an account?{" "}
        <button type="button" className={styles.switchBtn} onClick={onSignIn} disabled={loading}>Sign in</button>
      </p>
    </motion.div>
  );
}

// ── Forgot Password ───────────────────────────────────────────
function ForgotView({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotData>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async (_data: ForgotData) => {
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onSuccess();
  };

  return (
    <motion.div {...slide} className={styles.view}>
      <button type="button" className={styles.backBtn} onClick={onBack}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className={styles.heading}>
        <h1 className={styles.title}>Reset password</h1>
        <p className={styles.subtitle}>We'll send a reset link to your email</p>
      </div>

      <ErrorMsg msg={error} />

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" placeholder="your@email.com" className={styles.input} disabled={loading} {...register("email")} />
        </Field>

        <button type="submit" className={styles.primaryBtn} disabled={loading}>
          {loading ? <><Loader2 size={14} className={styles.spin} /> Sending…</> : "Send Reset Link"}
        </button>
      </form>
    </motion.div>
  );
}

// ── Reset Success ─────────────────────────────────────────────
function ResetSuccessView({ onBack }: { onBack: () => void }) {
  return (
    <motion.div {...slide} className={`${styles.view} ${styles.centeredView}`}>
      <div className={styles.successIcon}>
        <MailCheck size={36} strokeWidth={1.5} />
      </div>
      <h1 className={styles.title}>Check your email</h1>
      <p className={styles.subtitle}>
        A password reset link has been sent. Check your inbox.
      </p>
      <button type="button" className={styles.outlineBtn} onClick={onBack}>
        Back to Sign In
      </button>
    </motion.div>
  );
}

export default AuthForm;
