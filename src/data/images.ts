// ============================================================
// Neels Designer Studio — Centralized Image Configuration
// Replace these URLs with real Neels photography when available
// ============================================================

// Helper to build a reliable Unsplash URL
const u = (id: string, w = 900, q = 85) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const IMAGES = {
  // ── HERO ──────────────────────────────────────────────────
  hero: {
    homepage: u('1610030469983-98e550d6193c', 1800, 90),
    couture: u('1609357605129-26f69add5d6e', 1800, 90),
    collections: u('1594938298603-c8148c4dae35', 1800, 90),
  },

  // ── FEATURED STORY GRID ───────────────────────────────────
  featuredStory: {
    main: u('1617627143750-d86bc21e42bb'),
    secondary: u('1509631179647-0177331693ae', 700),
    accent: u('1558618666-fcd25c85cd64', 700),
  },

  // ── CATEGORIES ────────────────────────────────────────────
  categories: {
    lehengas: u('1610030469983-98e550d6193c', 900),
    sarees: u('1594938298603-c8148c4dae35', 900),
    suitsAndDresses: u('1583391733956-3750e0ff4e8b', 900),
    accessories: u('1599643478518-a784e5dc4c8f', 900),
  },

  // ── COLLECTIONS ───────────────────────────────────────────
  collections: {
    heritageEdit: u('1583391733956-3750e0ff4e8b', 900),
    signatureEdit: u('1617627143750-d86bc21e42bb', 900),
    artisanSeries: u('1558618666-fcd25c85cd64', 900),
    bridalCouture: u('1610030469983-98e550d6193c', 900),
    nocturneSoiree: u('1469334031218-e382a71b716b', 900),
    royalResham: u('1502716119720-b23a93e5fe1b', 900),
    ivoryAtelier: u('1490481651871-ab68de25d43d', 900),
  },

  // ── COUTURE PROCESS ───────────────────────────────────────
  coutureProcess: {
    overview: u('1558618666-fcd25c85cd64', 900),
    consultation: u('1571019613454-1cb2f99b2d8b', 900),
    measurement: u('1594938298603-c8148c4dae35', 900),
    design: u('1617627143750-d86bc21e42bb', 900),
    crafting: u('1509631179647-0177331693ae', 900),
    fitting: u('1583391733956-3750e0ff4e8b', 900),
    finalCreation: u('1610030469983-98e550d6193c', 900),
  },

  // ── VISUAL JOURNAL / INSTAGRAM ────────────────────────────
  journal: [
    u('1610030469983-98e550d6193c', 600, 80),
    u('1617627143750-d86bc21e42bb', 600, 80),
    u('1509631179647-0177331693ae', 600, 80),
    u('1583391733956-3750e0ff4e8b', 600, 80),
    u('1594938298603-c8148c4dae35', 600, 80),
    u('1558618666-fcd25c85cd64', 600, 80),
  ],

  // ── PRODUCTS — LEHENGAS ───────────────────────────────────
  lehengas: {
    heritageIvory: {
      primary: u('1610030469983-98e550d6193c', 700),
      hover: u('1583391733956-3750e0ff4e8b', 700),
      gallery: [
        u('1610030469983-98e550d6193c', 900, 90),
        u('1583391733956-3750e0ff4e8b', 900, 90),
        u('1594938298603-c8148c4dae35', 900, 90),
      ],
    },
    crimsonHeirloom: {
      primary: u('1617627143750-d86bc21e42bb', 700),
      hover: u('1509631179647-0177331693ae', 700),
      gallery: [
        u('1617627143750-d86bc21e42bb', 900, 90),
        u('1509631179647-0177331693ae', 900, 90),
      ],
    },
    antiqueGoldMarodi: {
      primary: u('1594938298603-c8148c4dae35', 700),
      hover: u('1558618666-fcd25c85cd64', 700),
      gallery: [
        u('1594938298603-c8148c4dae35', 900, 90),
        u('1610030469983-98e550d6193c', 900, 90),
      ],
    },
    gardenRose: {
      primary: u('1509631179647-0177331693ae', 700),
      hover: u('1617627143750-d86bc21e42bb', 700),
      gallery: [
        u('1509631179647-0177331693ae', 900, 90),
        u('1583391733956-3750e0ff4e8b', 900, 90),
      ],
    },
    midnightVelvet: {
      primary: u('1583391733956-3750e0ff4e8b', 700),
      hover: u('1558618666-fcd25c85cd64', 700),
      gallery: [
        u('1583391733956-3750e0ff4e8b', 900, 90),
        u('1571019613454-1cb2f99b2d8b', 900, 90),
      ],
    },
    burntSiennaTissue: {
      primary: u('1558618666-fcd25c85cd64', 700),
      hover: u('1594938298603-c8148c4dae35', 700),
      gallery: [
        u('1558618666-fcd25c85cd64', 900, 90),
      ],
    },
  },

  // ── PRODUCTS — SAREES ─────────────────────────────────────
  sarees: {
    heritageSilk: {
      primary: u('1617627143750-d86bc21e42bb', 700),
      hover: u('1610030469983-98e550d6193c', 700),
      gallery: [
        u('1617627143750-d86bc21e42bb', 900, 90),
        u('1610030469983-98e550d6193c', 900, 90),
      ],
    },
    mandalaTissue: {
      primary: u('1594938298603-c8148c4dae35', 700),
      hover: u('1509631179647-0177331693ae', 700),
      gallery: [
        u('1594938298603-c8148c4dae35', 900, 90),
      ],
    },
    chocolateDraped: {
      primary: u('1509631179647-0177331693ae', 700),
      hover: u('1583391733956-3750e0ff4e8b', 700),
      gallery: [
        u('1509631179647-0177331693ae', 900, 90),
      ],
    },
    antiqueGoldSaree: {
      primary: u('1610030469983-98e550d6193c', 700),
      hover: u('1617627143750-d86bc21e42bb', 700),
      gallery: [
        u('1610030469983-98e550d6193c', 900, 90),
      ],
    },
    crimsonHandwoven: {
      primary: u('1583391733956-3750e0ff4e8b', 700),
      hover: u('1558618666-fcd25c85cd64', 700),
      gallery: [
        u('1583391733956-3750e0ff4e8b', 900, 90),
      ],
    },
  },

  // ── PRODUCTS — SUITS & DRESSES ─────────────────────────────
  suits: {
    signatureVelvet: {
      primary: u('1558618666-fcd25c85cd64', 700),
      hover: u('1571019613454-1cb2f99b2d8b', 700),
      gallery: [
        u('1558618666-fcd25c85cd64', 900, 90),
        u('1571019613454-1cb2f99b2d8b', 900, 90),
      ],
    },
    ivoryEmbroidered: {
      primary: u('1610030469983-98e550d6193c', 700),
      hover: u('1509631179647-0177331693ae', 700),
      gallery: [
        u('1610030469983-98e550d6193c', 900, 90),
      ],
    },
    gardenBloom: {
      primary: u('1509631179647-0177331693ae', 700),
      hover: u('1617627143750-d86bc21e42bb', 700),
      gallery: [
        u('1509631179647-0177331693ae', 900, 90),
      ],
    },
    roseSilkAnarkali: {
      primary: u('1617627143750-d86bc21e42bb', 700),
      hover: u('1594938298603-c8148c4dae35', 700),
      gallery: [
        u('1617627143750-d86bc21e42bb', 900, 90),
      ],
    },
    contemporaryDraped: {
      primary: u('1594938298603-c8148c4dae35', 700),
      hover: u('1610030469983-98e550d6193c', 700),
      gallery: [
        u('1594938298603-c8148c4dae35', 900, 90),
      ],
    },
  },

  // ── STORES ────────────────────────────────────────────────
  stores: {
    mumbai: u('1524230572899-a752b3835840', 900),
    delhi: u('1517248135467-4c7edcad34c4', 900),
  },
};
