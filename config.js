/* ============================================================
   FLUENS — KONFIGURASI WHITE-LABEL
   Ubah file ini saja. Tidak perlu build ulang.
   File ini di-set no-store di vercel.json, jadi perubahan
   langsung terlihat tanpa menunggu cache.
   ============================================================ */
window.__FLX_CONFIG = {

  /* --- Identitas --- */
  brandName: "Fluens Creator",
  tagline:   "Studio Talenta AI",
  logoUrl:   "",                 // kosong = pakai wordmark teks

  /* --- Warna (diturunkan otomatis jadi shade) --- */
  accentColor:  "#0E7A6E",       // Alir
  accent2Color: "#D9713F",       // Bara
  bgColor:      "#FAF6F0",       // Pasir

  /* --- Custom GPT (WAJIB diisi) --- */
  gptUrlWajah:      "https://chatgpt.com/g/g-XXXXXXXX-fluens-arsitek-wajah",
  gptUrlGaya:       "https://chatgpt.com/g/g-XXXXXXXX-fluens-penata-gaya",
  gptUrlStoryboard: "https://chatgpt.com/g/g-XXXXXXXX-fluens-sutradara-konten",

  /* --- Checkout --- */
  price:       "500.000",
  priceStrike: "1.500.000",
  paymentUrl:  "https://CHECKOUT-KAMU.com",

  showResellerTier:   false,
  resellerPrice:      "1.900.000",
  resellerStrike:     "6.000.000",
  resellerPaymentUrl: "https://CHECKOUT-WHITELABEL-KAMU.com",

  /* --- Akses --- */
  // Ganti hash lewat /hash-tool.html. Password bawaan: fluens
  salt:         "fluens-2026::",
  passwordHash: "ff0414662b3dedb0f6e20c9e916678ebae57e88219ce414f0110f1c74fdf8752",
  sheetCsvUrl:  "",              // kosong = gerbang password saja

  /* --- Sosial --- */
  instagram: "",
  whatsapp:  ""
};
