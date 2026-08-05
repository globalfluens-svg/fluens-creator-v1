import React from 'react';

/* ============================================================
   Skema antropometri parametrik.
   Membaca SELURUH keputusan bentuk (11 bentuk fitur) plus
   slider proporsi, sudut mulut, penanda, dan rambut wajah.
   ============================================================ */

const CX = 160, TOP = 70, BASE_CHIN = 344;

/* proporsi siluet per bentuk wajah: [pelipis, tulang pipi, rahang, dagu, panjang] */
const WAJAH = {
  oval:     [0.78, 1.00, 0.80, 0.34, 1.00],
  bulat:    [0.86, 1.00, 0.90, 0.52, 0.90],
  persegi:  [0.94, 1.00, 0.96, 0.74, 0.98],
  hati:     [0.98, 0.96, 0.70, 0.20, 1.00],
  diamond:  [0.68, 1.00, 0.70, 0.30, 1.04],
  panjang:  [0.80, 0.92, 0.80, 0.40, 1.14],
  segitiga: [1.00, 0.96, 0.60, 0.26, 1.00],
};
/* ketinggian titik terlebar + tonjolan tulang pipi */
const PIPI = { tinggi: [0.40, 1.06], sedang: [0.46, 1.00], rendah: [0.52, 0.97] };

export default function FaceSchematic({ s, pria }) {
  const [tw, cw, jw, chw, len] = WAJAH[s.bwajah] || WAJAH.oval;
  const [pipiY, pipiK] = PIPI[s.bpipi] || PIPI.sedang;

  const half = (62 + ((s.fwhr - 165) / 50) * 26) * pipiK;
  const chinY = TOP + (BASE_CHIN - TOP) * len;
  const cheekY = TOP + (chinY - TOP) * pipiY;
  const jawF = (s.jaw - 110) / 26;
  const jawY = TOP + (chinY - TOP) * 0.74;

  const W = { temple: half * tw, cheek: half * cw, jaw: half * jw * (1 - 0.08 * jawF), chin: half * chw };
  const persegiDagu = ['persegi', 'belah'].includes(s.bdagu);
  const lancipDagu = s.bdagu === 'lancip';
  const mundurDagu = s.bdagu === 'mundur';

  /* ---------- siluet wajah ---------- */
  const sisi = (d) => {
    const bawahY = mundurDagu ? chinY - 8 : chinY;
    const dagu = persegiDagu
      ? `L ${CX + d * W.chin} ${bawahY - 10} Q ${CX + d * W.chin} ${bawahY} ${CX + d * W.chin * 0.5} ${bawahY} L ${CX} ${bawahY}`
      : lancipDagu
        ? `C ${CX + d * W.jaw * 0.7} ${jawY + 40} ${CX + d * W.chin} ${bawahY - 14} ${CX} ${bawahY}`
        : `C ${CX + d * W.jaw * 0.85} ${jawY + 42} ${CX + d * W.chin * 1.1} ${bawahY - 12} ${CX} ${bawahY}`;
    return `M ${CX + d * W.temple} ${TOP + 22}
      C ${CX + d * W.cheek} ${TOP + 60} ${CX + d * W.cheek} ${cheekY} ${CX + d * W.jaw} ${jawY} ${dagu}`;
  };
  const crown = `M ${CX - W.temple} ${TOP + 22}
    C ${CX - W.temple * 0.78} ${TOP - 18} ${CX + W.temple * 0.78} ${TOP - 18} ${CX + W.temple} ${TOP + 22}`;

  /* ---------- mata ---------- */
  const eyeY = TOP + (chinY - TOP) * 0.47;
  const uk = { kecil: 0.82, sedang: 1, besar: 1.2 }[s.umata] || 1;
  const eOff = half * 0.44;
  const eW = half * 0.26 * uk;
  const eH = { almond: 8, bulat: 12, hooded: 6.5, monolid: 5, dalam: 7, menonjol: 11, sipit: 4 }[s.bmata] ?? 8;
  const dY = Math.tan((s.tilt * Math.PI) / 180) * eW * 2;

  const mata = (d) => {
    const inX = CX + d * (eOff - eW), outX = CX + d * (eOff + eW);
    const inY = eyeY + dY / 2, outY = eyeY - dY / 2;
    const h = eH * uk;
    if (s.bmata === 'bulat' || s.bmata === 'menonjol')
      return `M ${inX} ${inY} C ${CX + d * eOff} ${eyeY - h * 1.5} ${CX + d * eOff} ${eyeY - h * 1.5} ${outX} ${outY}
              C ${CX + d * eOff} ${eyeY + h * 1.5} ${CX + d * eOff} ${eyeY + h * 1.5} ${inX} ${inY} Z`;
    return `M ${inX} ${inY} Q ${CX + d * eOff} ${eyeY - h} ${outX} ${outY} Q ${CX + d * eOff} ${eyeY + h * 0.8} ${inX} ${inY} Z`;
  };
  const kelopak = (d) => {
    if (!['hooded', 'dalam'].includes(s.bmata)) return null;
    const inX = CX + d * (eOff - eW * 1.05), outX = CX + d * (eOff + eW * 1.05);
    const y = eyeY - eH * uk - (s.bmata === 'dalam' ? 5 : 2.5);
    return `M ${inX} ${y + 2} Q ${CX + d * eOff} ${y - 3} ${outX} ${y + 1}`;
  };

  /* ---------- alis ---------- */
  const gap = 14 + (s.brow / 100) * 16;
  const tebal = { tipis: 1.1, sedang: 1.8, tebal: 2.8, takrata: 2.4 }[s.talis] ?? 1.8;
  const alis = (d) => {
    const inX = CX + d * (eOff - eW * 1.15), outX = CX + d * (eOff + eW * 1.3);
    const midX = CX + d * eOff;
    const y0 = eyeY - gap - eH * 0.3 + dY / 2;
    const b = s.balis;
    if (b === 'lurus')    return `M ${inX} ${y0} L ${outX} ${y0 - 1}`;
    if (b === 'lengkung') return `M ${inX} ${y0} Q ${midX} ${y0 - 8} ${outX} ${y0 - 1}`;
    if (b === 'bersudut') return `M ${inX} ${y0} L ${midX + d * eW * 0.5} ${y0 - 11} L ${outX} ${y0 - 2}`;
    if (b === 'turun')    return `M ${inX} ${y0 - 5} Q ${midX} ${y0 - 6} ${outX} ${y0 + 5}`;
    if (b === 'naik')     return `M ${inX} ${y0 + 4} Q ${midX} ${y0 - 4} ${outX} ${y0 - 9}`;
    return `M ${inX} ${y0} Q ${midX - d * eW * 0.4} ${y0 - 9} ${midX + d * eW * 0.4} ${y0 - 4} T ${outX} ${y0 + 2}`;
  };

  /* ---------- hidung ---------- */
  const noseTop = eyeY + eH * 0.4;
  const noseBot = TOP + (chinY - TOP) * 0.72;
  const sayap = { sempit: 0.13, sedang: 0.19, lebar: 0.27 }[s.hsayap] ?? 0.19;
  const nW = half * sayap;
  const batang = () => {
    const b = s.hbatang, x = CX;
    if (b === 'cekung')     return `M ${x} ${noseTop} Q ${x - 5} ${(noseTop + noseBot) / 2} ${x - 1} ${noseBot}`;
    if (b === 'punuk')      return `M ${x} ${noseTop} Q ${x - 6} ${noseTop + (noseBot - noseTop) * 0.35} ${x - 2} ${(noseTop + noseBot) / 2} L ${x - 1} ${noseBot}`;
    if (b === 'lebardatar') return `M ${x - 4} ${noseTop} L ${x - 5} ${noseBot} M ${x + 4} ${noseTop} L ${x + 5} ${noseBot}`;
    if (b === 'sempit')     return `M ${x} ${noseTop} L ${x - 1} ${noseBot}`;
    return `M ${x} ${noseTop} L ${x - 2} ${noseBot}`;
  };
  const ujung = () => {
    const u = s.hujung, y = noseBot;
    if (u === 'tajam')   return `M ${CX - nW * 0.55} ${y + 2} L ${CX} ${y + 7} L ${CX + nW * 0.55} ${y + 2}`;
    if (u === 'bulbous') return `M ${CX - nW * 0.7} ${y + 1} C ${CX - nW * 0.8} ${y + 12} ${CX + nW * 0.8} ${y + 12} ${CX + nW * 0.7} ${y + 1}`;
    if (u === 'naik')    return `M ${CX - nW * 0.6} ${y + 5} Q ${CX} ${y - 2} ${CX + nW * 0.6} ${y + 5}`;
    if (u === 'turun')   return `M ${CX - nW * 0.6} ${y - 1} Q ${CX} ${y + 12} ${CX + nW * 0.6} ${y - 1}`;
    return `M ${CX - nW * 0.6} ${y + 2} Q ${CX} ${y + 9} ${CX + nW * 0.6} ${y + 2}`;
  };
  const alae = `M ${CX - nW * 0.5} ${noseBot + 5} Q ${CX - nW} ${noseBot + 9} ${CX - nW * 0.35} ${noseBot + 7}
                M ${CX + nW * 0.5} ${noseBot + 5} Q ${CX + nW} ${noseBot + 9} ${CX + nW * 0.35} ${noseBot + 7}`;

  /* ---------- bibir ---------- */
  const mY = TOP + (chinY - TOP) * 0.845;
  const lebarMulut = s.bbibir === 'lebartipis' ? 0.50 : s.bbibir === 'cupid' ? 0.36 : 0.40;
  const mW = half * lebarMulut;
  const c = s.mulut === 'naik' ? -4 : s.mulut === 'turun' ? 4 : 0;
  const atas = { penuh: 4, bawah: 2.5, atastipis: 1.5, lebartipis: 2, cupid: 4.5, rata: 3 }[s.bbibir] ?? 3;
  const bawah = { penuh: 5, bawah: 7.5, atastipis: 4.5, lebartipis: 2.5, cupid: 5, rata: 4.5 }[s.bbibir] ?? 4.5;
  const bibirAtas = s.bbibir === 'cupid'
    ? `M ${CX - mW} ${mY + c} Q ${CX - mW * 0.5} ${mY - atas} ${CX} ${mY - atas * 0.35}
       Q ${CX + mW * 0.5} ${mY - atas} ${CX + mW} ${mY + c}`
    : `M ${CX - mW} ${mY + c} Q ${CX} ${mY - atas} ${CX + mW} ${mY + c}`;
  const bibirBawah = `M ${CX - mW} ${mY + c} Q ${CX} ${mY + bawah} ${CX + mW} ${mY + c}`;

  /* ---------- dagu & jenggot ---------- */
  const belah = s.bdagu === 'belah'
    ? `M ${CX} ${chinY - 22} L ${CX} ${chinY - 12}` : null;
  const lvl = { bersih: 0, bayangan: 1, kumis: 1, goatee: 2, 'brewok-pendek': 2, 'brewok-rapi': 3, penuh: 4, panjang: 5 }[s.jenggot] || 0;
  const adaJenggot = pria && lvl > 0;
  const jd = chinY + lvl * 6, bw = W.jaw * (0.9 + lvl * 0.02);

  const markOn = (s.penanda || []).includes('mole');
  const md = s.sisi === 'kanan' ? 1 : -1;

  const P = (props) => <path fill="none" stroke="var(--text)" strokeLinecap="round" strokeLinejoin="round" {...props} />;

  return (
    <svg viewBox="0 0 320 400" className="block h-auto w-full bg-bg-deep" role="img"
      aria-label="Skema antropometri wajah yang menyesuaikan seluruh pilihan bentuk">
      {[TOP + (chinY - TOP) * 0.28, eyeY, TOP + (chinY - TOP) * 0.72].map((y, i) => (
        <g key={i}>
          <line x1="46" y1={y} x2="274" y2={y} stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2 4" />
          <text x="48" y={y - 4} className="font-mono" fontSize="8.5" fill="var(--text-dim)">{['1/3', '2/3', '3/3'][i]}</text>
        </g>
      ))}
      <line x1={CX} y1={TOP - 20} x2={CX} y2={chinY + 16} stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2 4" />

      <P d={`${crown} ${sisi(-1)} ${sisi(1)}`} strokeWidth="1.7" />

      {s.bpipi === 'tinggi' && (
        <>
          <P d={`M ${CX - W.cheek * 0.92} ${cheekY - 4} Q ${CX - W.cheek * 0.5} ${cheekY + 10} ${CX - eOff * 0.6} ${cheekY + 14}`} strokeWidth="1" opacity="0.5" />
          <P d={`M ${CX + W.cheek * 0.92} ${cheekY - 4} Q ${CX + W.cheek * 0.5} ${cheekY + 10} ${CX + eOff * 0.6} ${cheekY + 14}`} strokeWidth="1" opacity="0.5" />
        </>
      )}

      <P d={alis(-1)} strokeWidth={tebal} strokeDasharray={s.talis === 'takrata' ? '9 3' : undefined} />
      <P d={alis(1)} strokeWidth={tebal} strokeDasharray={s.talis === 'takrata' ? '9 3' : undefined} />

      <P d={mata(-1)} strokeWidth="1.4" />
      <P d={mata(1)} strokeWidth="1.4" />
      {kelopak(-1) && <P d={kelopak(-1)} strokeWidth="1" opacity="0.65" />}
      {kelopak(1) && <P d={kelopak(1)} strokeWidth="1" opacity="0.65" />}

      <P d={batang()} strokeWidth="1.3" />
      <P d={ujung()} strokeWidth="1.3" />
      <P d={alae} strokeWidth="1.1" opacity="0.8" />

      <P d={bibirAtas} strokeWidth="1.4" />
      <P d={bibirBawah} strokeWidth="1.4" />

      {belah && <P d={belah} strokeWidth="1.1" opacity="0.7" />}

      {adaJenggot && (
        <P d={`M ${CX - bw} ${jawY + 4}
          C ${CX - bw * 0.9} ${jawY + 44} ${CX - W.chin * 1.5} ${jd - 10} ${CX} ${jd}
          C ${CX + W.chin * 1.5} ${jd - 10} ${CX + bw * 0.9} ${jawY + 44} ${CX + bw} ${jawY + 4}`}
          strokeWidth="1.3" strokeDasharray="3 3" opacity="0.55" />
      )}

      {markOn && <circle cx={CX + md * (eOff + eW * 0.9)} cy={eyeY + 16} r="2.6" fill="var(--accent2)" />}

      <line x1={CX - W.cheek} y1={cheekY} x2={CX + W.cheek} y2={cheekY} stroke="var(--accent)" strokeWidth="1" opacity="0.75" />
      <text x={CX - W.cheek - 2} y={cheekY - 6} className="font-mono" fontSize="8.5" fill="var(--accent)">
        FWHR {(s.fwhr / 100).toFixed(2)}
      </text>
      <line x1={CX + W.jaw} y1={jawY} x2={CX + W.jaw + 26} y2={jawY} stroke="var(--accent)" strokeWidth="1" opacity="0.75" />
      <text x={CX + W.jaw + 29} y={jawY + 3} className="font-mono" fontSize="8.5" fill="var(--accent)">{s.jaw}°</text>
      <text x={CX + eOff + eW + 8} y={eyeY - dY / 2 - 6} className="font-mono" fontSize="8.5" fill="var(--accent)">
        {(s.tilt > 0 ? '+' : '') + s.tilt}°
      </text>
    </svg>
  );
}
