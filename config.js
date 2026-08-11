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
  logoUrl:   "",                 // kosong = pakai ikon merek bawaan

  /* --- Tampilan --- */
  theme:        "dark",          // "dark" atau "light"

  /* --- Warna resmi Fluens (jangan diubah tanpa alasan) ---
     Alir   #0E7A6E   hijau utama
     Riak   #1FA898   hijau terang
     Rumpun #0B5F57   hijau tergelap
     Bara   #D9713F   oranye aksen
     Pasir  #FAF6F0   latar terang
     Tinta  #16130F   teks gelap                                    */
  accentColor:  "#1FA898",       // Riak — untuk latar gelap
  accent2Color: "#D9713F",       // Bara
  bgColor:      "#0C0F0E",       // latar gelap. Untuk theme light pakai #FAF6F0

  /* --- Custom GPT (WAJIB diisi) --- */
  gptUrlWajah:      "https://chatgpt.com/g/g-6a6da57b7f1481918f990d51dfa75f14-fluens-arsitek-wajah",
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
