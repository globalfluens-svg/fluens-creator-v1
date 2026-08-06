import React from 'react';
import { cfg } from '../lib/config.js';

/* ============================================================
   Aset merek — disalin persis dari berkas resmi:
   07-fluens-ikon-aplikasi.svg dan 03-fluens-wordmark-tinta.svg
   Jangan diubah nilainya tanpa memperbarui berkas sumbernya.
   ============================================================ */

/* gradasi resmi: kiri-bawah → kanan-atas */
export const GRADASI = [
  ['0%', '#0B5F57'],
  ['38%', '#0E7A6E'],
  ['72%', '#1FA898'],
  ['100%', '#D9713F'],
];

let n = 0;
export function BrandIcon({ size = 32, radius = 0.21875, className = '' }) {
  const id = `flxgrad${++n}`;
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" className={className}
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0%" y1="100%" x2="100%" y2="0%">
          {GRADASI.map(([off, c]) => <stop key={off} offset={off} stopColor={c} />)}
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx={512 * radius} fill={`url(#${id})`} />
      <g transform="translate(133,84) scale(4.4)" stroke="#FAF6F0" strokeWidth="4.6" strokeLinecap="round">
        <line x1="14.3" y1="3.8"  x2="31.7" y2="3.8" />
        <line x1="8.3"  y1="11.8" x2="41.7" y2="11.8" />
        <line x1="4.3"  y1="19.3" x2="46.7" y2="19.3" />
        <line x1="2.3"  y1="27.3" x2="46.7" y2="27.3" />
        <line x1="2.3"  y1="35.3" x2="42.7" y2="35.3" />
        <line x1="2.3"  y1="43.3" x2="52.7" y2="43.3" />
        <line x1="2.3"  y1="51.3" x2="38.7" y2="51.3" />
        <line x1="3.3"  y1="59.3" x2="45.7" y2="59.3" />
        <line x1="6.3"  y1="67.3" x2="42.7" y2="67.3" />
        <line x1="11.3" y1="75.3" x2="31.7" y2="75.3" />
      </g>
    </svg>
  );
}

/* Wordmark: Plus Jakarta Sans 400, huruf kecil, letter-spacing -1.5
   pada ukuran 76px → −0.0197em. Nama merek ditulis huruf kecil
   sesuai berkas wordmark resmi. */
export function Wordmark({ size = 21, className = '' }) {
  const [utama, ...sisa] = (cfg.brandName || 'Fluens').split(' ');
  return (
    <span
      className={`select-none font-sans font-normal leading-none ${className}`}
      style={{ fontSize: size, letterSpacing: '-0.0197em' }}
    >
      <span className="text-text">{utama.toLowerCase()}</span>
      {sisa.length > 0 && (
        <span className="text-text-mut"> {sisa.join(' ').toLowerCase()}</span>
      )}
    </span>
  );
}

export function Lockup({ size = 30, className = '' }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <BrandIcon size={size} />
      <Wordmark size={size * 0.72} />
    </span>
  );
}
