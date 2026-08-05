import React from 'react';
import { EN } from '../data/wajah-data.js';

/* ============================================================
   Gambar detail per fitur.
   Hanya bagian yang sedang diatur yang digambar — bukan wajah
   utuh. Satu bagian jauh lebih mudah dibuat meyakinkan, dan
   lebih berguna saat memilih.
   ============================================================ */

const T = 'var(--text)';
const A = 'var(--accent)';
const D = 'var(--text-dim)';
const P = (p) => <path fill="none" stroke={T} strokeLinecap="round" strokeLinejoin="round" {...p} />;
const F = (p) => <path stroke="none" fill={T} {...p} />;

/* ---------------- MATA ---------------- */
function Mata({ s }) {
  const cx = 130, cy = 78;
  const uk = { kecil: 0.86, sedang: 1, besar: 1.16 }[s.umata] || 1;
  const w = 74 * uk;
  const tinggi = { almond: 26, bulat: 36, hooded: 21, monolid: 17, dalam: 24, menonjol: 34, sipit: 12 }[s.bmata] ?? 26;
  const h = tinggi * uk;
  const tilt = Math.tan((s.tilt * Math.PI) / 180) * w;

  const inX = cx - w, outX = cx + w;
  const inY = cy + tilt / 2, outY = cy - tilt / 2;
  const bulat = ['bulat', 'menonjol'].includes(s.bmata);

  const atas = bulat
    ? `M ${inX} ${inY} C ${inX + w * 0.35} ${cy - h * 1.25} ${outX - w * 0.35} ${outY - h * 1.25} ${outX} ${outY}`
    : `M ${inX} ${inY} C ${inX + w * 0.45} ${cy - h * 1.05} ${outX - w * 0.5} ${outY - h * 0.95} ${outX} ${outY}`;
  const bawah = `M ${inX} ${inY} C ${inX + w * 0.5} ${cy + h * 0.72} ${outX - w * 0.5} ${outY + h * 0.66} ${outX} ${outY}`;

  const rIris = Math.min(w * 0.34, h * 0.98);
  const crease = s.bmata === 'monolid' ? null
    : s.bmata === 'hooded'
      ? `M ${inX + 8} ${cy - h * 0.55} C ${cx - 20} ${cy - h * 0.95} ${cx + 24} ${cy - h * 0.85} ${outX - 4} ${outY - h * 0.35}`
      : `M ${inX + 6} ${cy - h * 0.72} C ${cx - 24} ${cy - h * (s.bmata === 'dalam' ? 1.85 : 1.5)} ${cx + 28} ${cy - h * (s.bmata === 'dalam' ? 1.75 : 1.4)} ${outX - 3} ${outY - h * 0.5}`;

  return (
    <svg viewBox="0 0 260 156" className="block h-auto w-full">
      {s.bmata === 'dalam' && (
        <P d={`M ${inX - 4} ${cy - h * 2.1} C ${cx} ${cy - h * 2.6} ${cx} ${cy - h * 2.5} ${outX + 4} ${outY - h * 1.7}`} strokeWidth="8" opacity="0.10" />
      )}
      <clipPath id="mataClip"><path d={`${atas} ${bawah.replace('M', 'L').split('C')[0]} ${bawah} Z`} /></clipPath>
      <g clipPath="url(#mataClip)">
        <circle cx={cx + tilt * 0.05} cy={cy - h * 0.05} r={rIris} fill="none" stroke={T} strokeWidth="2.2" />
        <circle cx={cx + tilt * 0.05} cy={cy - h * 0.05} r={rIris * 0.42} fill={T} />
        <circle cx={cx + tilt * 0.05 - rIris * 0.3} cy={cy - h * 0.35} r={rIris * 0.16} fill="var(--bg-deep)" />
      </g>
      <P d={atas} strokeWidth="3" />
      <P d={bawah} strokeWidth="1.8" />
      {crease && <P d={crease} strokeWidth="1.5" opacity="0.65" />}
      <P d={`M ${inX} ${inY} l -7 3`} strokeWidth="1.4" opacity="0.6" />
      <line x1={inX} y1={inY + h + 22} x2={outX} y2={outY + h + 22} stroke={A} strokeWidth="1" opacity="0.55" />
      <text x={cx} y={outY + h + 38} textAnchor="middle" className="font-mono" fontSize="9" fill={A}>
        canthal tilt {(s.tilt > 0 ? '+' : '') + s.tilt}°
      </text>
    </svg>
  );
}

/* ---------------- ALIS ---------------- */
function Alis({ s }) {
  const cx = 130, cy = 84, w = 86;
  const t = { tipis: 4, sedang: 7, tebal: 11, takrata: 9 }[s.talis] ?? 7;
  const inX = cx - w, outX = cx + w;
  const b = s.balis;
  const jalur = {
    lurus:    [[inX, cy + 2], [cx, cy - 2], [outX, cy - 4]],
    lengkung: [[inX, cy + 4], [cx, cy - 14], [outX, cy - 2]],
    bersudut: [[inX, cy + 4], [cx + w * 0.28, cy - 20], [outX, cy - 2]],
    turun:    [[inX, cy - 8], [cx, cy - 10], [outX, cy + 10]],
    naik:     [[inX, cy + 10], [cx, cy - 6], [outX, cy - 18]],
    s:        [[inX, cy + 2], [cx - w * 0.3, cy - 16], [outX, cy + 4]],
  }[b] || [[inX, cy], [cx, cy - 8], [outX, cy]];

  const [p0, p1, p2] = jalur;
  const tebalDi = (i) => t * [1, 0.95, 0.35][i];
  const atas = `M ${p0[0]} ${p0[1] - tebalDi(0)} Q ${p1[0]} ${p1[1] - tebalDi(1)} ${p2[0]} ${p2[1] - tebalDi(2)}`;
  const bawah = `L ${p2[0]} ${p2[1] + tebalDi(2)} Q ${p1[0]} ${p1[1] + tebalDi(1)} ${p0[0]} ${p0[1] + tebalDi(0)} Z`;

  return (
    <svg viewBox="0 0 260 156" className="block h-auto w-full">
      <F d={`${atas} ${bawah}`} opacity={s.talis === 'takrata' ? 0.9 : 1} />
      {s.talis === 'takrata' && (
        <>
          <F d={`M ${cx + w * 0.42} ${cy - 14} l 10 -3 l 3 12 l -11 2 Z`} fill="var(--bg-deep)" />
          <F d={`M ${cx + w * 0.66} ${cy - 12} l 8 -2 l 2 11 l -9 2 Z`} fill="var(--bg-deep)" />
        </>
      )}
      <ellipse cx={cx} cy={cy + 46} rx={w * 0.78} ry="15" fill="none" stroke={T} strokeWidth="1.6" opacity="0.35" />
      <line x1={cx - w} y1={cy + 8} x2={cx - w} y2={cy + 32} stroke={A} strokeWidth="1" opacity="0.5" />
      <line x1={cx - w} y1={cy + 20} x2={cx - w + 26} y2={cy + 20} stroke={A} strokeWidth="1" opacity="0.5" />
      <text x={cx - w + 30} y={cy + 24} className="font-mono" fontSize="9" fill={A}>
        jarak ke mata: {s.brow < 34 ? 'dekat' : s.brow > 66 ? 'jauh' : 'sedang'}
      </text>
    </svg>
  );
}

/* ---------------- HIDUNG: SAMPING (batang) ---------------- */
function BatangHidung({ s }) {
  const x = 120, yTop = 34, yTip = 108;
  const b = s.hbatang;
  const dorsum = {
    lurus:      `L ${x + 34} ${yTip - 6}`,
    cekung:     `C ${x + 8} ${yTop + 32} ${x + 16} ${yTip - 30} ${x + 34} ${yTip - 6}`,
    punuk:      `C ${x + 26} ${yTop + 22} ${x + 20} ${yTip - 34} ${x + 34} ${yTip - 6}`,
    lebardatar: `C ${x + 10} ${yTop + 34} ${x + 14} ${yTip - 26} ${x + 30} ${yTip - 6}`,
    sempit:     `C ${x + 16} ${yTop + 30} ${x + 26} ${yTip - 30} ${x + 36} ${yTip - 6}`,
  }[b] || `L ${x + 34} ${yTip - 6}`;

  return (
    <svg viewBox="0 0 260 156" className="block h-auto w-full">
      <P d={`M ${x - 26} ${yTop - 18} C ${x - 4} ${yTop - 20} ${x + 4} ${yTop - 8} ${x + 2} ${yTop}`} strokeWidth="2" opacity="0.35" />
      <P d={`M ${x + 2} ${yTop} ${dorsum}`} strokeWidth="3" />
      <P d={`M ${x + 34} ${yTip - 6} C ${x + 44} ${yTip + 2} ${x + 40} ${yTip + 12} ${x + 26} ${yTip + 12}
             C ${x + 16} ${yTip + 12} ${x + 12} ${yTip + 6} ${x + 8} ${yTip + 16}`} strokeWidth="2.4" />
      <P d={`M ${x + 8} ${yTip + 16} C ${x + 2} ${yTip + 30} ${x + 10} ${yTip + 34} ${x + 18} ${yTip + 34}`} strokeWidth="2" opacity="0.4" />
      <line x1={x + 2} y1={yTop} x2={x + 70} y2={yTop} stroke={A} strokeDasharray="2 3" strokeWidth="1" opacity="0.5" />
      <text x={x + 74} y={yTop + 3} className="font-mono" fontSize="9" fill={A}>nasion</text>
      <line x1={x + 34} y1={yTip - 6} x2={x + 70} y2={yTip - 6} stroke={A} strokeDasharray="2 3" strokeWidth="1" opacity="0.5" />
      <text x={x + 74} y={yTip - 3} className="font-mono" fontSize="9" fill={A}>rhinion</text>
      <text x={x - 26} y={yTip + 46} className="font-mono" fontSize="9" fill={D}>tampak samping</text>
    </svg>
  );
}

/* ---------------- HIDUNG: DEPAN (ujung & sayap) ---------------- */
function HidungDepan({ s }) {
  const cx = 130, yTip = 96;
  const w = { sempit: 24, sedang: 34, lebar: 46 }[s.hsayap] ?? 34;
  const u = s.hujung;
  const ujung = {
    bulat:   `M ${cx - w * 0.5} ${yTip - 8} C ${cx - w * 0.5} ${yTip + 10} ${cx + w * 0.5} ${yTip + 10} ${cx + w * 0.5} ${yTip - 8}`,
    tajam:   `M ${cx - w * 0.42} ${yTip - 6} Q ${cx} ${yTip + 12} ${cx + w * 0.42} ${yTip - 6}`,
    bulbous: `M ${cx - w * 0.68} ${yTip - 12} C ${cx - w * 0.8} ${yTip + 16} ${cx + w * 0.8} ${yTip + 16} ${cx + w * 0.68} ${yTip - 12}`,
    naik:    `M ${cx - w * 0.48} ${yTip + 2} Q ${cx} ${yTip - 12} ${cx + w * 0.48} ${yTip + 2}`,
    turun:   `M ${cx - w * 0.48} ${yTip - 14} Q ${cx} ${yTip + 16} ${cx + w * 0.48} ${yTip - 14}`,
  }[u] || '';

  return (
    <svg viewBox="0 0 260 156" className="block h-auto w-full">
      <P d={`M ${cx - 7} 26 C ${cx - 10} 56 ${cx - 8} ${yTip - 26} ${cx - w * 0.38} ${yTip - 6}`} strokeWidth="1.8" opacity="0.45" />
      <P d={`M ${cx + 7} 26 C ${cx + 10} 56 ${cx + 8} ${yTip - 26} ${cx + w * 0.38} ${yTip - 6}`} strokeWidth="1.8" opacity="0.45" />
      <P d={ujung} strokeWidth="2.6" />
      <P d={`M ${cx - w * 0.42} ${yTip + 4} C ${cx - w} ${yTip + 8} ${cx - w * 0.95} ${yTip - 6} ${cx - w * 0.62} ${yTip - 9}`} strokeWidth="2.2" />
      <P d={`M ${cx + w * 0.42} ${yTip + 4} C ${cx + w} ${yTip + 8} ${cx + w * 0.95} ${yTip - 6} ${cx + w * 0.62} ${yTip - 9}`} strokeWidth="2.2" />
      <F d={`M ${cx - w * 0.42} ${yTip + 6} q ${w * 0.2} 6 ${w * 0.34} 0 q ${-w * 0.16} -3 ${-w * 0.34} 0 Z`} opacity="0.75" />
      <F d={`M ${cx + w * 0.42} ${yTip + 6} q ${-w * 0.2} 6 ${-w * 0.34} 0 q ${w * 0.16} -3 ${w * 0.34} 0 Z`} opacity="0.75" />
      <line x1={cx - w} y1={yTip + 26} x2={cx + w} y2={yTip + 26} stroke={A} strokeWidth="1" opacity="0.55" />
      <text x={cx} y={yTip + 42} textAnchor="middle" className="font-mono" fontSize="9" fill={A}>lebar sayap</text>
    </svg>
  );
}

/* ---------------- BIBIR ---------------- */
function Bibir({ s }) {
  const cx = 130, cy = 80;
  const w = { penuh: 68, bawah: 66, atastipis: 66, lebartipis: 84, cupid: 58, rata: 66 }[s.bbibir] ?? 66;
  const ta = { penuh: 20, bawah: 13, atastipis: 8, lebartipis: 10, cupid: 22, rata: 16 }[s.bbibir] ?? 16;
  const tb = { penuh: 24, bawah: 32, atastipis: 21, lebartipis: 12, cupid: 23, rata: 21 }[s.bbibir] ?? 21;
  const c = s.mulut === 'naik' ? -6 : s.mulut === 'turun' ? 6 : 0;

  const atas = s.bbibir === 'rata'
    ? `M ${cx - w} ${cy + c} Q ${cx} ${cy - ta} ${cx + w} ${cy + c} Q ${cx} ${cy + 3} ${cx - w} ${cy + c} Z`
    : `M ${cx - w} ${cy + c}
       Q ${cx - w * 0.52} ${cy - ta} ${cx - w * 0.15} ${cy - ta * 0.68}
       Q ${cx} ${cy - ta * 0.24} ${cx + w * 0.15} ${cy - ta * 0.68}
       Q ${cx + w * 0.52} ${cy - ta} ${cx + w} ${cy + c}
       Q ${cx} ${cy + 3} ${cx - w} ${cy + c} Z`;
  const bawah = `M ${cx - w} ${cy + c} Q ${cx} ${cy + 3} ${cx + w} ${cy + c}
                 C ${cx + w * 0.55} ${cy + tb} ${cx - w * 0.55} ${cy + tb} ${cx - w} ${cy + c} Z`;

  return (
    <svg viewBox="0 0 260 156" className="block h-auto w-full">
      <P d={`M ${cx - 5} 18 L ${cx - 6} ${cy - ta - 4} M ${cx + 5} 18 L ${cx + 6} ${cy - ta - 4}`} strokeWidth="1.4" opacity="0.3" />
      <F d={atas} opacity="0.88" />
      <F d={bawah} opacity="0.72" />
      <P d={`M ${cx - w} ${cy + c} Q ${cx} ${cy + 3} ${cx + w} ${cy + c}`} strokeWidth="1.6" stroke="var(--bg-deep)" opacity="0.9" />
      <P d={`M ${cx - w * 0.45} ${cy + tb + 12} Q ${cx} ${cy + tb + 6} ${cx + w * 0.45} ${cy + tb + 12}`} strokeWidth="1.4" opacity="0.28" />
      <text x={cx} y={cy + tb + 34} textAnchor="middle" className="font-mono" fontSize="9" fill={A}>
        sudut mulut: {s.mulut === 'naik' ? 'naik tipis' : s.mulut === 'turun' ? 'turun tipis' : 'netral datar'}
      </text>
    </svg>
  );
}

/* ---------------- DAGU & RAHANG ---------------- */
function Dagu({ s }) {
  const cx = 130, yTop = 26, yChin = 122;
  const jawF = (s.jaw - 110) / 26;
  const wJaw = 74 * (1 - 0.10 * jawF);
  const wChin = { bulat: 30, persegi: 52, lancip: 14, belah: 50, mundur: 26 }[s.bdagu] ?? 30;
  const yb = s.bdagu === 'mundur' ? yChin - 10 : yChin;

  const sisi = (d) => s.bdagu === 'persegi' || s.bdagu === 'belah'
    ? `M ${cx + d * wJaw} ${yTop} C ${cx + d * wJaw * 0.94} ${yTop + 46} ${cx + d * wChin * 1.06} ${yb - 22} ${cx + d * wChin} ${yb - 8}
       Q ${cx + d * wChin} ${yb} ${cx + d * wChin * 0.6} ${yb} L ${cx} ${yb}`
    : s.bdagu === 'lancip'
      ? `M ${cx + d * wJaw} ${yTop} C ${cx + d * wJaw * 0.8} ${yTop + 48} ${cx + d * wChin * 2.2} ${yb - 16} ${cx} ${yb}`
      : `M ${cx + d * wJaw} ${yTop} C ${cx + d * wJaw * 0.86} ${yTop + 48} ${cx + d * wChin * 1.7} ${yb - 12} ${cx} ${yb}`;

  return (
    <svg viewBox="0 0 260 156" className="block h-auto w-full">
      <P d={`${sisi(-1)} ${sisi(1)}`} strokeWidth="3" />
      {s.bdagu === 'belah' && <P d={`M ${cx} ${yb - 30} L ${cx} ${yb - 14}`} strokeWidth="2" opacity="0.7" />}
      <P d={`M ${cx - 34} ${yTop + 6} Q ${cx} ${yTop + 1} ${cx + 34} ${yTop + 6}`} strokeWidth="1.6" opacity="0.3" />
      <line x1={cx + wJaw} y1={yTop} x2={cx + wJaw + 26} y2={yTop} stroke={A} strokeWidth="1" opacity="0.55" />
      <text x={cx + wJaw + 30} y={yTop + 3} className="font-mono" fontSize="9" fill={A}>gonial {s.jaw}°</text>
      <line x1={cx - wChin} y1={yb + 14} x2={cx + wChin} y2={yb + 14} stroke={A} strokeWidth="1" opacity="0.55" />
      <text x={cx} y={yb + 30} textAnchor="middle" className="font-mono" fontSize="9" fill={A}>lebar dagu</text>
    </svg>
  );
}

/* ---------------- SILUET WAJAH ---------------- */
const SIL = {
  oval:     [0.84, 1.00, 0.78, 0.38, 1.00],
  bulat:    [0.92, 1.00, 0.92, 0.58, 0.88],
  persegi:  [0.96, 1.00, 0.97, 0.80, 0.96],
  hati:     [1.00, 0.96, 0.70, 0.24, 1.00],
  diamond:  [0.72, 1.00, 0.70, 0.32, 1.04],
  panjang:  [0.84, 0.92, 0.78, 0.42, 1.15],
  segitiga: [1.00, 0.95, 0.60, 0.28, 0.99],
};
function Siluet({ s }) {
  const cx = 130, top = 16;
  const [tw, cw, jw, chw, len] = SIL[s.bwajah] || SIL.oval;
  const H = 124 * len;
  const half = 48 * (s.fwhr / 188);
  const yPipi = top + H * (s.bpipi === 'tinggi' ? 0.44 : s.bpipi === 'rendah' ? 0.54 : 0.49);
  const yGon = top + H * 0.74, yChin = top + H;
  const sisi = (d) => `M ${cx} ${top}
    C ${cx + d * half * 0.62} ${top} ${cx + d * half * tw} ${top + H * 0.10} ${cx + d * half * tw} ${top + H * 0.30}
    C ${cx + d * half * cw} ${top + H * 0.38} ${cx + d * half * cw} ${yPipi} ${cx + d * half * jw} ${yGon}
    C ${cx + d * half * jw * 0.82} ${yGon + H * 0.11} ${cx + d * half * chw * 1.5} ${yChin - H * 0.04} ${cx} ${yChin}`;
  return (
    <svg viewBox="0 0 260 156" className="block h-auto w-full">
      <P d={`${sisi(-1)} ${sisi(1)}`} strokeWidth="3" />
      {s.bpipi === 'tinggi' && (
        <>
          <P d={`M ${cx - half * cw * 0.9} ${yPipi - 3} Q ${cx - half * 0.5} ${yPipi + 12} ${cx - half * 0.3} ${yPipi + 15}`} strokeWidth="1.6" opacity="0.45" />
          <P d={`M ${cx + half * cw * 0.9} ${yPipi - 3} Q ${cx + half * 0.5} ${yPipi + 12} ${cx + half * 0.3} ${yPipi + 15}`} strokeWidth="1.6" opacity="0.45" />
        </>
      )}
      <line x1={cx - half * cw} y1={yPipi} x2={cx + half * cw} y2={yPipi} stroke={A} strokeWidth="1" opacity="0.6" />
      <text x={cx} y={yPipi - 6} textAnchor="middle" className="font-mono" fontSize="9" fill={A}>
        FWHR {(s.fwhr / 100).toFixed(2)}
      </text>
    </svg>
  );
}

/* ---------------- PETA FITUR ---------------- */
const FITUR = {
  bwajah:   { judul: 'Bentuk wajah',   sub: 'siluet',        C: Siluet,        en: 'bwajah' },
  bpipi:    { judul: 'Tulang pipi',    sub: 'siluet',        C: Siluet,        en: 'bpipi' },
  fwhr:     { judul: 'Lebar wajah',    sub: 'FWHR',          C: Siluet,        en: null },
  bmata:    { judul: 'Bentuk mata',    sub: 'mata kanan',    C: Mata,          en: 'bmata' },
  umata:    { judul: 'Ukuran mata',    sub: 'mata kanan',    C: Mata,          en: 'umata' },
  tilt:     { judul: 'Canthal tilt',   sub: 'mata kanan',    C: Mata,          en: null },
  balis:    { judul: 'Bentuk alis',    sub: 'alis kanan',    C: Alis,          en: 'balis' },
  talis:    { judul: 'Ketebalan alis', sub: 'alis kanan',    C: Alis,          en: 'talis' },
  brow:     { judul: 'Jarak alis',     sub: 'alis kanan',    C: Alis,          en: null },
  hbatang:  { judul: 'Batang hidung',  sub: 'profil',        C: BatangHidung,  en: 'hbatang' },
  hujung:   { judul: 'Ujung hidung',   sub: 'tampak depan',  C: HidungDepan,   en: 'hujung' },
  hsayap:   { judul: 'Sayap hidung',   sub: 'tampak depan',  C: HidungDepan,   en: 'hsayap' },
  bbibir:   { judul: 'Bentuk bibir',   sub: 'tampak depan',  C: Bibir,         en: 'bbibir' },
  mulut:    { judul: 'Sudut mulut',    sub: 'tampak depan',  C: Bibir,         en: null },
  bdagu:    { judul: 'Bentuk dagu',    sub: 'rahang & dagu', C: Dagu,          en: 'bdagu' },
  jaw:      { judul: 'Sudut gonial',   sub: 'rahang & dagu', C: Dagu,          en: null },
};
export const FITUR_KEYS = Object.keys(FITUR);
export const FITUR_JUDUL = Object.fromEntries(Object.entries(FITUR).map(([k, v]) => [k, v.judul]));

export default function FeatureDetail({ s, fokus }) {
  const f = FITUR[fokus] || FITUR.bmata;
  const Gambar = f.C;
  const nilaiEn = f.en ? EN[f.en]?.[s[f.en]] : null;

  return (
    <div>
      <div className="flex items-baseline justify-between px-4 pt-4">
        <span className="font-display text-[15px] font-semibold">{f.judul}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim">{f.sub}</span>
      </div>
      <div className="px-3 pb-1 pt-2">
        <Gambar s={s} />
      </div>
      {nilaiEn && (
        <p className="border-t border-line px-4 py-3 font-mono text-[11px] leading-relaxed text-text-mut">
          <span className="text-accent">→ </span>{nilaiEn}
        </p>
      )}
    </div>
  );
}
