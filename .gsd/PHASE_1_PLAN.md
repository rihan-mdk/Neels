# Phase 1 Plan: Real Supabase Authentication Integration

> **Objective**: Replace simulated `localStorage` authentication with real Supabase Authentication, persistent session management, protected routes, and centralized `AuthContext` while preserving all existing luxury UI/UX, animations, guest experience, cart, and wishlist behaviors.

---

## 📋 Task Breakdown

### Task 1: Package Installation & Environment Configuration
- Install `@supabase/supabase-js` and `@supabase/ssr`.
- Create `.env.local` and `.env.example` with:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Provide safe fallback initialization so build commands and local development run without crashing even if env keys are pending.

### Task 2: Supabase Client & Centralized Auth Context
- Create `src/lib/supabase/client.ts` to instantiate browser-side Supabase client.
- Create `src/context/AuthContext.tsx` providing:
  - `user`: `User | null`
  - `session`: `Session | null`
  - `loading`: `boolean`
  - `signIn(email, password)`
  - `signUp(email, password, fullName)`
  - `resetPassword(email)`
  - `signInWithGoogle()`
  - `signOut()`
- Wrap application layout in `src/app/layout.tsx` with `<AuthProvider>`.

### Task 3: Real Authentication in `AuthForm.tsx`
- Replace simulated `setTimeout` mocks in `AuthForm.tsx` with real Supabase authentication methods.
- Support Sign In, Sign Up (saving user full name metadata), Forgot Password, and Google OAuth.
- Render real error messages from Supabase (e.g., invalid password, email taken).
- Maintain 100% of existing luxury styling, CSS modules, and Framer Motion view transitions.

### Task 4: Route Protection & Session Synchronization
- **`/profile`**: Protect route — redirect unauthenticated users to `/login`. Display active user email, full name, initials, and wire real `signOut()`.
- **`/login` & `/intro`**: Auto-redirect active authenticated users to `/` or `/profile`. Maintain guest entrance (`neelsh_visited` in `localStorage`).
- **`page.tsx`**: Check first-time visit via `useAuth()` / `neelsh_visited` flag before rendering storefront.
- **`CartNotification.tsx`**: Consume `useAuth()` to dynamically toggle guest sign-in prompt vs. member notification.

### Task 5: Build & Empirical Verification
- Run `npx next build` to ensure 0 TypeScript or compilation errors across all 54+ routes.

---

## 🛡️ Verification Proofs
1. **Dependency Installation**: `package.json` updated with Supabase dependencies.
2. **TypeScript Compilation**: `npx next build` exited with Code 0.
3. **Session Persistence & Route Protection**: Verified user state across page reloads and protected route navigation.
