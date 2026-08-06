import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/* ============================================================
   Mesin form deklaratif.
   Kontrol: radio, multi, text, area, range.
   Gaya kontrol per modul: 'pill' (bawaan) atau 'select'.
   Perilaku bersyarat: show, disable, warn, after.
   ============================================================ */

/* ---------- pilihan tunggal: pill ---------- */
function Pills({ field, value, onChange, state }) {
  const multi = field.t === 'multi';
  const arr = multi ? value || [] : null;

  const toggle = (v, off) => {
    if (off) return;
    if (!multi) return onChange(v);
    const has = arr.includes(v);
    if (has) return onChange(arr.filter((x) => x !== v));
    if (arr.length >= (field.max || 2)) return;
    onChange([...arr, v]);
  };

  return (
    <div className="flex flex-wrap gap-[7px]">
      {field.options.map(([v, label]) => {
        const off = field.disable ? field.disable(state, v) : false;
        const on = multi ? arr.includes(v) : value === v;
        return (
          <button key={v} type="button" disabled={off} aria-pressed={on}
            onClick={() => toggle(v, off)}
            className={['pill', on ? 'pill-on' : '', off ? 'pill-off' : ''].join(' ')}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- pilihan tunggal: dropdown ---------- */
function Select({ field, value, onChange, state }) {
  return (
    <div className="relative">
      <select
        className="inp appearance-none pr-9"
        value={value}
        aria-label={field.label}
        onChange={(e) => onChange(e.target.value)}
      >
        {field.options.map(([v, label]) => (
          <option key={v} value={v} disabled={field.disable ? field.disable(state, v) : false}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-dim" />
    </div>
  );
}

/* ---------- pilihan ganda: dropdown centang ---------- */
function MultiSelect({ field, value, onChange }) {
  const arr = value || [];
  const [buka, setBuka] = useState(false);
  const ref = useRef(null);
  const maks = field.max || 2;

  useEffect(() => {
    if (!buka) return;
    const tutup = (e) => { if (ref.current && !ref.current.contains(e.target)) setBuka(false); };
    document.addEventListener('mousedown', tutup);
    document.addEventListener('keydown', (e) => e.key === 'Escape' && setBuka(false));
    return () => document.removeEventListener('mousedown', tutup);
  }, [buka]);

  const toggle = (v) => {
    if (arr.includes(v)) return onChange(arr.filter((x) => x !== v));
    if (arr.length >= maks) return;
    onChange([...arr, v]);
  };

  const label = arr.length
    ? field.options.filter(([v]) => arr.includes(v)).map(([, l]) => l).join(', ')
    : `Pilih maksimal ${maks}`;

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setBuka(!buka)} aria-expanded={buka}
        className={`inp flex items-center justify-between gap-2 text-left ${arr.length ? '' : 'text-text-dim'}`}>
        <span className="truncate">{label}</span>
        <ChevronDown size={15} className={`shrink-0 text-text-dim transition-transform ${buka ? 'rotate-180' : ''}`} />
      </button>

      {buka && (
        <div className="absolute z-20 mt-1.5 max-h-[260px] w-full overflow-auto rounded-lg border border-line bg-bg-elev py-1 shadow-lg">
          {field.options.map(([v, l]) => {
            const on = arr.includes(v);
            const penuh = !on && arr.length >= maks;
            return (
              <button key={v} type="button" disabled={penuh} onClick={() => toggle(v)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13.5px] transition-colors
                  ${on ? 'text-accent' : penuh ? 'text-text-dim opacity-40' : 'text-text-mut hover:text-text'}`}>
                <span className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${on ? 'border-accent bg-accent-sm' : 'border-line'}`}>
                  {on && <Check size={11} />}
                </span>
                {l}
              </button>
            );
          })}
          <div className="border-t border-line px-3 py-1.5 font-mono text-[10.5px] text-text-dim">
            {arr.length}/{maks} dipilih
          </div>
        </div>
      )}
    </div>
  );
}

function Range({ field, value, onChange }) {
  return (
    <>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-[12.5px] font-semibold leading-[1.35] text-text">{field.label}</span>
        <span className="shrink-0 font-mono text-[12px] text-accent">{field.fmt(value)}</span>
      </div>
      <input type="range" className="rng" min={field.min} max={field.max} value={value}
        aria-label={field.label} onChange={(e) => onChange(Number(e.target.value))} />
      {field.ends && (
        <div className="mt-0.5 flex justify-between gap-3 text-[11px] leading-tight text-text-dim">
          <span>{field.ends[0]}</span><span className="text-right">{field.ends[1]}</span>
        </div>
      )}
    </>
  );
}

function Field({ field, state, set, onTouch, control }) {
  if (field.show && !field.show(state)) return null;
  const value = state[field.k];
  const onChange = (v) => { set(field.k, v); onTouch && onTouch(field.k); };
  const warn = field.warn ? field.warn(state) : '';
  const after = field.after ? field.after(state) : '';
  const pakaiSelect = control === 'select';

  /* lebar kolom: area selalu penuh; pill panjang butuh dua kolom */
  const span = field.t === 'area'
    ? 'md:col-span-2 xl:col-span-3'
    : !pakaiSelect && (field.t === 'range' || (field.options && field.options.length >= 8))
      ? 'md:col-span-2'
      : '';

  return (
    <div className={`flex h-full flex-col ${span}`}>
      {field.t !== 'range' && (
        <div className={pakaiSelect ? 'mb-2 min-h-[40px]' : 'mb-2'}>
          <label className="block text-[12.5px] font-semibold leading-[1.35] text-text">
            {field.label}
          </label>
          {field.note && (
            <span className="mt-0.5 block text-[11.5px] leading-[1.35] text-text-dim">
              {field.note}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto">
        {field.t === 'range' && <Range field={field} value={value} onChange={onChange} />}

        {field.t === 'radio' && (pakaiSelect
          ? <Select field={field} value={value} onChange={onChange} state={state} />
          : <Pills field={field} value={value} onChange={onChange} state={state} />)}

        {field.t === 'multi' && (pakaiSelect
          ? <MultiSelect field={field} value={value} onChange={onChange} />
          : <Pills field={field} value={value} onChange={onChange} state={state} />)}

        {field.t === 'text' && (
          <input type="text" className="inp" value={value || ''} placeholder={field.ph || ''}
            onChange={(e) => onChange(e.target.value)} />
        )}

        {field.t === 'area' && (
          <textarea className="inp resize-y" style={{ minHeight: field.tall ? 150 : 88 }}
            value={value || ''} placeholder={field.ph || ''} onChange={(e) => onChange(e.target.value)} />
        )}
      </div>

      {after && <p className="mt-2 text-[11.5px] leading-[1.45] text-text-dim">{after}</p>}
      {warn && <p className="mt-2 text-[11.5px] leading-[1.45] text-accent2">{warn}</p>}
    </div>
  );
}

const HURUF = 'ABCDEFGHIJKL';

export default function ModuleForm({ spec, state, set, extras, onTouch }) {
  const control = spec.control || 'pill';
  const kolom = control === 'select' ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2';

  return (
    <main className="flex flex-col gap-4">
      {spec.sections.map((sec, i) => (
        <section key={sec.step} className="panel">
          <div className="panel-head">
            <span className="panel-title">
              <span className="panel-badge">{HURUF[i]}</span>
              {sec.title}
            </span>
            <span className="font-mono text-[10.5px] text-text-dim">{sec.step}</span>
          </div>

          <div className="p-4 lg:p-5">
            {sec.hint && (
              <p className="mb-5 max-w-[62ch] rounded-lg border border-line bg-bg-deep px-3.5 py-3 text-[12.5px] leading-relaxed text-text-mut">
                {sec.hint}
              </p>
            )}

            {sec.randomize && extras?.randomize && (
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <button type="button" onClick={extras.randomize} className="btn btn-primary !py-2 !px-3.5">
                  Acak bentuk
                </button>
                {extras.counter && (
                  <span className={`font-mono text-[11.5px] ${extras.counterWarn ? 'text-accent2' : 'text-text-dim'}`}>
                    {extras.counter}
                  </span>
                )}
              </div>
            )}

            <div className={`grid items-stretch gap-x-6 gap-y-6 ${kolom}`}>
              {sec.fields.map((f) => (
                <Field key={f.k} field={f} state={state} set={set} onTouch={onTouch} control={control} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
