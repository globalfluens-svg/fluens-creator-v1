import React from 'react';

/* ============================================================
   Skema antropometri.
   Digambar dari proporsi kraniofasial: tinggi kepala dibagi
   menjadi titik-titik acuan (garis rambut, alis, dasar hidung,
   mulut, dagu), lalu setiap fitur diletakkan relatif ke situ.
   Telinga, leher, garis rambut, dan iris disertakan — keempatnya
   yang membuat gambar terbaca sebagai wajah, bukan topeng.
   ============================================================ */

const CX = 160, TOP = 46, BOT = 356;

/* [pelipis, tulang pipi, rahang, dagu, panjang] */
const WAJAH = {
  oval:     [0.86, 1.00, 0.80, 0.40, 1.00],
  bulat:    [0.92, 1.00, 0.92, 0.58, 0.90],
  persegi:  [0.96, 1.00, 0.97, 0.78, 0.97],
  hati:     [1.00, 0.97, 0.72, 0.26, 1.00],
  diamond:  [0.76, 1.00, 0.72, 0.34, 1.03],
  panjang:  [0.86, 0.93, 0.80, 0.44, 1.13],
  segitiga: [1.00, 0.96, 0.64, 0.30, 0.99],
};
const PIPI = { tinggi: [0.455, 1.05], sedang: [0.495, 1.00], rendah: [0.535, 0.98] };

export default function FaceSchematic({ s, pria }) {
  const [tw, cw, jw, chw, len] = WAJAH[s.bwajah] || WAJAH.oval;
  const [pipiY, pipiK] = PIPI[s.bpipi] || PIPI.sedang;

  const chinY = TOP + (BOT - TOP) * len;
  const H = chinY - TOP;                         // tinggi kepala
  const half = (58 + ((s.fwhr - 165) / 50) * 22) * pipiK;
  const jawF = (s.jaw - 110) / 26;               // 0 tajam → 1 lembut

  /* titik acuan vertikal */
  const yRambut = TOP + H * 0.20;
  const yAlis   = TOP + H * 0.415;
  const yMata   = TOP + H * 0.475;
  const yPipi   = TOP + H * pipiY;
  const yHidung = TOP + H * 0.665;
  const yMulut  = TOP + H * 0.775;
  const yGonion = TOP + H * 0.735;

  const W = {
    kepala: half * 0.94,
    pelipis: half * tw,
    pipi:   half * cw,
    rahang: half * jw * (1 - 0.07 * jawF),
    dagu:   half * chw,
  };

  const persegiDagu = ['persegi', 'belah'].includes(s.bdagu);
  const lancipDagu  = s.bdagu === 'lancip';
  const mundurDagu  = s.bdagu === 'mundur';
  const yDagu = mundurDagu ? chinY - H * 0.03 : chinY;

  /* ---------- siluet: satu lintasan menerus per sisi ---------- */
  const sisi = (d) => {
    const dagu = persegiDagu
      ? `C ${CX + d * W.rahang * 0.86} ${yGonion + H * 0.10} ${CX + d * W.dagu * 1.06} ${yDagu - H * 0.045} ${CX + d * W.dagu} ${yDagu - H * 0.015}
         Q ${CX + d * W.dagu} ${yDagu} ${CX + d * W.dagu * 0.62} ${yDagu} L ${CX} ${yDagu}`
      : lancipDagu
        ? `C ${CX + d * W.rahang * 0.72} ${yGonion + H * 0.09} ${CX + d * W.dagu * 1.5} ${yDagu - H * 0.05} ${CX} ${yDagu}`
        : `C ${CX + d * W.rahang * 0.82} ${yGonion + H * 0.10} ${CX + d * W.dagu * 1.45} ${yDagu - H * 0.035} ${CX} ${yDagu}`;
    return `M ${CX} ${TOP}
      C ${CX + d * W.kepala * 0.62} ${TOP} ${CX + d * W.pelipis} ${TOP + H * 0.10} ${CX + d * W.pelipis} ${TOP + H * 0.30}
      C ${CX + d * W.pipi} ${TOP + H * 0.38} ${CX + d * W.pipi} ${yPipi} ${CX + d * W.rahang} ${yGonion}
      ${dagu}`;
  };

  /* ---------- garis rambut ---------- */
  const garisRambut = `M ${CX - W.pelipis * 0.96} ${yRambut + H * 0.05}
    C ${CX - W.pelipis * 0.80} ${yRambut - H * 0.05} ${CX + W.pelipis * 0.80} ${yRambut - H * 0.05} ${CX + W.pelipis * 0.96} ${yRambut + H * 0.05}`;

  /* ---------- telinga ---------- */
  const telinga = (d) => {
    const x = CX + d * W.pipi * 0.99;
    return `M ${x} ${yAlis + H * 0.01}
      C ${x + d * 15} ${yAlis} ${x + d * 16} ${yHidung - H * 0.02} ${x} ${yHidung - H * 0.005}`;
  };

  /* ---------- leher & bahu ---------- */
  const leher = `M ${CX - W.rahang * 0.60} ${yGonion + H * 0.04} L ${CX - W.rahang * 0.52} ${BOT + 26}
                 M ${CX + W.rahang * 0.60} ${yGonion + H * 0.04} L ${CX + W.rahang * 0.52} ${BOT + 26}`;
  const bahu = `M ${CX - W.pipi * 1.7} ${BOT + 42} Q ${CX - W.rahang * 0.6} ${BOT + 24} ${CX - W.rahang * 0.52} ${BOT + 26}
                M ${CX + W.pipi * 1.7} ${BOT + 42} Q ${CX + W.rahang * 0.6} ${BOT + 24} ${CX + W.rahang * 0.52} ${BOT + 26}`;

  /* ---------- mata ---------- */
  const uk = { kecil: 0.85, sedang: 1, besar: 1.18 }[s.umata] || 1;
  const eOff = half * 0.42;
  const eW = half * 0.235 * uk;
  const tinggiTutup = { almond: 0.42, bulat: 0.60, hooded: 0.34, monolid: 0.26, dalam: 0.38, menonjol: 0.56, sipit: 0.20 }[s.bmata] ?? 0.42;
  const hAtas = eW * tinggiTutup;
  const hBawah = eW * tinggiTutup * 0.62;
  const dY = Math.tan((s.tilt * Math.PI) / 180) * eW * 2;

  const mata = (d) => {
    const inX = CX + d * (eOff - eW), outX = CX + d * (eOff + eW);
    const inY = yMata + dY / 2, outY = yMata - dY / 2;
    const mid = CX + d * eOff;
    return `M ${inX} ${inY}
      C ${inX + d * eW * 0.45} ${yMata - hAtas} ${outX - d * eW * 0.45} ${outY - hAtas} ${outX} ${outY}
      C ${outX - d * eW * 0.5} ${yMata + hBawah} ${inX + d * eW * 0.5} ${yMata + hBawah} ${inX} ${inY}`;
  };
  const iris = (d) => ({ cx: CX + d * eOff, cy: yMata + hAtas * 0.05, r: Math.min(eW * 0.40, hAtas * 0.95) });
  const lipatan = (d) => {
    if (s.bmata === 'monolid') return null;
    const inX = CX + d * (eOff - eW * 0.95), outX = CX + d * (eOff + eW * 1.0);
    const naik = s.bmata === 'hooded' ? 0.42 : s.bmata === 'dalam' ? 0.95 : 0.70;
    return `M ${inX} ${yMata - hAtas * 0.35} Q ${CX + d * eOff} ${yMata - hAtas * (1 + naik)} ${outX} ${yMata - hAtas * 0.5}`;
  };

  /* ---------- alis ---------- */
  const jarak = 0.42 + (s.brow / 100) * 0.55;     // 0.42–0.97 dari hAtas
  const tebal = { tipis: 1.6, sedang: 2.6, tebal: 4, takrata: 3.4 }[s.talis] ?? 2.6;
  const alis = (d) => {
    const inX = CX + d * (eOff - eW * 1.02), outX = CX + d * (eOff + eW * 1.28);
    const mid = CX + d * eOff;
    const y0 = yAlis - hAtas * (jarak - 0.42) * 1.6 + dY / 2;
    const b = s.balis;
    if (b === 'lurus')    return `M ${inX} ${y0 + 1} L ${outX} ${y0}`;
    if (b === 'lengkung') return `M ${inX} ${y0 + 2} Q ${mid} ${y0 - 7} ${outX} ${y0 + 1}`;
    if (b === 'bersudut') return `M ${inX} ${y0 + 2} Q ${mid + d * eW * 0.35} ${y0 - 10} ${mid + d * eW * 0.6} ${y0 - 8} L ${outX} ${y0 + 1}`;
    if (b === 'turun')    return `M ${inX} ${y0 - 3} Q ${mid} ${y0 - 5} ${outX} ${y0 + 6}`;
    if (b === 'naik')     return `M ${inX} ${y0 + 5} Q ${mid} ${y0 - 3} ${outX} ${y0 - 8}`;
    return `M ${inX} ${y0 + 1} Q ${mid - d * eW * 0.35} ${y0 - 8} ${mid + d * eW * 0.35} ${y0 - 4} T ${outX} ${y0 + 3}`;
  };

  /* ---------- hidung ---------- */
  const sayapK = { sempit: 0.115, sedang: 0.165, lebar: 0.225 }[s.hsayap] ?? 0.165;
  const nW = half * sayapK;
  const yBridge = yMata + hAtas * 0.2;
  const batang = () => {
    const b = s.hbatang;
    const kiri = CX - nW * 0.34, kanan = CX + nW * 0.34;
    if (b === 'lebardatar')
      return `M ${kiri - 2} ${yBridge} C ${kiri - 3} ${yHidung - H * 0.10} ${kiri - 2} ${yHidung - H * 0.03} ${kiri} ${yHidung - 2}
              M ${kanan + 2} ${yBridge} C ${kanan + 3} ${yHidung - H * 0.10} ${kanan + 2} ${yHidung - H * 0.03} ${kanan} ${yHidung - 2}`;
    if (b === 'sempit')
      return `M ${CX - 1.5} ${yBridge} L ${CX - 2} ${yHidung - 3}`;
    if (b === 'cekung')
      return `M ${CX - 2} ${yBridge} C ${CX - 7} ${(yBridge + yHidung) / 2} ${CX - 5} ${yHidung - H * 0.05} ${CX - 2.5} ${yHidung - 3}`;
    if (b === 'punuk')
      return `M ${CX - 2} ${yBridge} C ${CX - 8} ${yBridge + H * 0.06} ${CX - 3} ${(yBridge + yHidung) / 2} ${CX - 3} ${yHidung - 3}`;
    return `M ${CX - 2} ${yBridge} C ${CX - 4} ${(yBridge + yHidung) / 2} ${CX - 3.5} ${yHidung - H * 0.04} ${CX - 2.5} ${yHidung - 3}`;
  };
  const ujung = () => {
    const u = s.hujung, w = nW * 0.52;
    if (u === 'tajam')   return `M ${CX - w} ${yHidung - 3} Q ${CX} ${yHidung + 5} ${CX + w} ${yHidung - 3}`;
    if (u === 'bulbous') return `M ${CX - w * 1.25} ${yHidung - 5} C ${CX - w * 1.4} ${yHidung + 9} ${CX + w * 1.4} ${yHidung + 9} ${CX + w * 1.25} ${yHidung - 5}`;
    if (u === 'naik')    return `M ${CX - w} ${yHidung + 1} Q ${CX} ${yHidung - 6} ${CX + w} ${yHidung + 1}`;
    if (u === 'turun')   return `M ${CX - w} ${yHidung - 6} Q ${CX} ${yHidung + 9} ${CX + w} ${yHidung - 6}`;
    return `M ${CX - w} ${yHidung - 4} C ${CX - w} ${yHidung + 6} ${CX + w} ${yHidung + 6} ${CX + w} ${yHidung - 4}`;
  };
  const cuping = `M ${CX - nW * 0.45} ${yHidung + 3} C ${CX - nW * 1.05} ${yHidung + 5} ${CX - nW} ${yHidung - 3} ${CX - nW * 0.72} ${yHidung - 4}
                  M ${CX + nW * 0.45} ${yHidung + 3} C ${CX + nW * 1.05} ${yHidung + 5} ${CX + nW} ${yHidung - 3} ${CX + nW * 0.72} ${yHidung - 4}`;
  const lubang = `M ${CX - nW * 0.42} ${yHidung + 2.5} q ${nW * 0.2} ${2.5} ${nW * 0.36} ${0}
                  M ${CX + nW * 0.42} ${yHidung + 2.5} q ${-nW * 0.2} ${2.5} ${-nW * 0.36} ${0}`;
  const filtrum = `M ${CX - 2.5} ${yHidung + 5} L ${CX - 3} ${yMulut - (yMulut - yHidung) * 0.28}
                   M ${CX + 2.5} ${yHidung + 5} L ${CX + 3} ${yMulut - (yMulut - yHidung) * 0.28}`;

  /* ---------- bibir ---------- */
  const mW = half * (s.bbibir === 'lebartipis' ? 0.40 : s.bbibir === 'cupid' ? 0.29 : 0.33);
  const c = s.mulut === 'naik' ? -2.5 : s.mulut === 'turun' ? 2.5 : 0;
  const tAtas  = { penuh: 5, bawah: 3.4, atastipis: 2.2, lebartipis: 2.6, cupid: 5.4, rata: 4 }[s.bbibir] ?? 4;
  const tBawah = { penuh: 6, bawah: 8.4, atastipis: 5.4, lebartipis: 3.2, cupid: 5.8, rata: 5.4 }[s.bbibir] ?? 5.4;
  const bibirAtas = s.bbibir === 'rata'
    ? `M ${CX - mW} ${yMulut + c} Q ${CX} ${yMulut - tAtas} ${CX + mW} ${yMulut + c}`
    : `M ${CX - mW} ${yMulut + c}
       Q ${CX - mW * 0.55} ${yMulut - tAtas} ${CX - mW * 0.16} ${yMulut - tAtas * 0.72}
       Q ${CX} ${yMulut - tAtas * 0.30} ${CX + mW * 0.16} ${yMulut - tAtas * 0.72}
       Q ${CX + mW * 0.55} ${yMulut - tAtas} ${CX + mW} ${yMulut + c}`;
  const bibirBawah = `M ${CX - mW} ${yMulut + c} C ${CX - mW * 0.5} ${yMulut + tBawah} ${CX + mW * 0.5} ${yMulut + tBawah} ${CX + mW} ${yMulut + c}`;
  const garisMulut = `M ${CX - mW * 0.95} ${yMulut + c * 0.8} Q ${CX} ${yMulut + c * 0.8 + 1.2} ${CX + mW * 0.95} ${yMulut + c * 0.8}`;

  /* ---------- dagu & jenggot ---------- */
  const belah = s.bdagu === 'belah' ? `M ${CX} ${yDagu - H * 0.075} L ${CX} ${yDagu - H * 0.035}` : null;
  const lekukDagu = `M ${CX - mW * 0.5} ${yMulut + tBawah + 6} Q ${CX} ${yMulut + tBawah + 3} ${CX + mW * 0.5} ${yMulut + tBawah + 6}`;
  const lvl = { bersih: 0, bayangan: 1, kumis: 1, goatee: 2, 'brewok-pendek': 2, 'brewok-rapi': 3, penuh: 4, panjang: 5 }[s.jenggot] || 0;
  const adaJenggot = pria && lvl > 0;
  const jd = yDagu + lvl * 5;
  const jenggot = `M ${CX - W.rahang * 0.94} ${yGonion - H * 0.02}
    C ${CX - W.rahang * 0.84} ${yGonion + H * 0.11} ${CX - W.dagu * 1.4} ${jd - H * 0.03} ${CX} ${jd}
    C ${CX + W.dagu * 1.4} ${jd - H * 0.03} ${CX + W.rahang * 0.84} ${yGonion + H * 0.11} ${CX + W.rahang * 0.94} ${yGonion - H * 0.02}`;

  const markOn = (s.penanda || []).includes('mole');
  const md = s.sisi === 'kanan' ? 1 : -1;

  const P = (p) => <path fill="none" stroke="var(--text)" strokeLinecap="round" strokeLinejoin="round" {...p} />;

  return (
    <svg viewBox="0 0 320 420" className="block h-auto w-full bg-bg-deep" role="img"
      aria-label="Skema antropometri wajah yang menyesuaikan seluruh pilihan bentuk">

      {/* garis bantu */}
      {[[yAlis, '1/3'], [yHidung, '2/3'], [yDagu, '3/3']].map(([y, t]) => (
        <g key={t}>
          <line x1="34" y1={y} x2="286" y2={y} stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2 5" opacity="0.7" />
          <text x="36" y={y - 4} className="font-mono" fontSize="8" fill="var(--text-dim)">{t}</text>
        </g>
      ))}
      <line x1={CX} y1={TOP - 12} x2={CX} y2={BOT + 40} stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2 5" opacity="0.55" />

      {/* leher, bahu, siluet */}
      <P d={leher} strokeWidth="1.4" opacity="0.75" />
      <P d={bahu} strokeWidth="1.4" opacity="0.55" />
      <P d={`${sisi(-1)} ${sisi(1)}`} strokeWidth="1.9" />
      <P d={telinga(-1)} strokeWidth="1.3" opacity="0.85" />
      <P d={telinga(1)} strokeWidth="1.3" opacity="0.85" />
      <P d={garisRambut} strokeWidth="1.2" opacity="0.6" strokeDasharray="5 4" />

      {s.bpipi === 'tinggi' && (
        <>
          <P d={`M ${CX - W.pipi * 0.9} ${yPipi - 3} Q ${CX - W.pipi * 0.5} ${yPipi + 12} ${CX - eOff * 0.7} ${yPipi + 16}`} strokeWidth="1" opacity="0.45" />
          <P d={`M ${CX + W.pipi * 0.9} ${yPipi - 3} Q ${CX + W.pipi * 0.5} ${yPipi + 12} ${CX + eOff * 0.7} ${yPipi + 16}`} strokeWidth="1" opacity="0.45" />
        </>
      )}

      {/* alis */}
      <P d={alis(-1)} strokeWidth={tebal} strokeDasharray={s.talis === 'takrata' ? '10 3' : undefined} />
      <P d={alis(1)} strokeWidth={tebal} strokeDasharray={s.talis === 'takrata' ? '10 3' : undefined} />

      {/* mata */}
      {[-1, 1].map((d) => (
        <g key={d}>
          <P d={mata(d)} strokeWidth="1.5" />
          <circle {...iris(d)} fill="none" stroke="var(--text)" strokeWidth="1.2" opacity="0.85" />
          <circle cx={iris(d).cx} cy={iris(d).cy} r={iris(d).r * 0.42} fill="var(--text)" opacity="0.75" />
          {lipatan(d) && <P d={lipatan(d)} strokeWidth="1" opacity="0.6" />}
        </g>
      ))}

      {/* hidung */}
      <P d={batang()} strokeWidth="1.2" opacity="0.8" />
      <P d={ujung()} strokeWidth="1.4" />
      <P d={cuping} strokeWidth="1.2" opacity="0.85" />
      <P d={lubang} strokeWidth="1.1" opacity="0.6" />
      <P d={filtrum} strokeWidth="1" opacity="0.45" />

      {/* mulut */}
      <P d={bibirAtas} strokeWidth="1.5" />
      <P d={bibirBawah} strokeWidth="1.5" />
      <P d={garisMulut} strokeWidth="1.1" opacity="0.55" />
      <P d={lekukDagu} strokeWidth="1" opacity="0.35" />
      {belah && <P d={belah} strokeWidth="1.1" opacity="0.65" />}

      {adaJenggot && <P d={jenggot} strokeWidth="1.3" strokeDasharray="3 3" opacity="0.5" />}
      {markOn && <circle cx={CX + md * (eOff + eW * 0.85)} cy={yMata + hAtas * 1.6} r="2.4" fill="var(--accent2)" />}

      {/* anotasi */}
      <line x1={CX - W.pipi} y1={yPipi} x2={CX + W.pipi} y2={yPipi} stroke="var(--accent)" strokeWidth="1" opacity="0.7" />
      <text x={CX - W.pipi - 2} y={yPipi - 5} className="font-mono" fontSize="8" fill="var(--accent)">
        FWHR {(s.fwhr / 100).toFixed(2)}
      </text>
      <line x1={CX + W.rahang} y1={yGonion} x2={CX + W.rahang + 22} y2={yGonion} stroke="var(--accent)" strokeWidth="1" opacity="0.7" />
      <text x={CX + W.rahang + 25} y={yGonion + 3} className="font-mono" fontSize="8" fill="var(--accent)">{s.jaw}°</text>
      <text x={CX + eOff + eW + 10} y={yMata - dY / 2 - 4} className="font-mono" fontSize="8" fill="var(--accent)">
        {(s.tilt > 0 ? '+' : '') + s.tilt}°
      </text>
    </svg>
  );
}
