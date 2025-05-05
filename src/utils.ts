import { Digit, FlipClockTimeDelta, FlipClockTimeDeltaFormatted } from './types';

const alignToSecond = (ms: number) => Math.floor(ms / 1000) * 1000;

export const defaultTimeDelta: FlipClockTimeDelta = {
  total: 0,
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
};

export const pad = (n: number): Digit[] =>
  ('0'.repeat(Math.max(0, 2 - String(n).length)) + String(Math.abs(n))).slice(-2).split('');

export function calcTimeDelta(
  mode: 'down' | 'up',
  reference: Date | number | string,
  nowMs: number
): FlipClockTimeDelta {
  const ref = new Date(reference);
  if (isNaN(ref.getTime())) throw Error('Invalid date');
  const now = new Date(nowMs);

  /* ---------- COUNTDOWN ---------- */
  if (mode === 'down') {
    let diff = Math.floor((ref.getTime() - now.getTime()) / 1000);
    if (diff < 0) diff = 0;
    return {
      total: diff,
      years: 0,
      months: 0,
      days: Math.floor(diff / 86_400),
      hours: Math.floor((diff / 3_600) % 24),
      minutes: Math.floor((diff / 60) % 60),
      seconds: diff % 60
    };
  }

  /* ---------- COUNT‑UP ------------ */
  let total = Math.floor((now.getTime() - ref.getTime()) / 1000);
  if (total < 0) total = 0;

  let years = now.getFullYear() - ref.getFullYear();
  let months = now.getMonth() - ref.getMonth();
  let days = now.getDate() - ref.getDate();
  if (days < 0) {
    const prev = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prev.getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  let hours = now.getHours() - ref.getHours();
  let minutes = now.getMinutes() - ref.getMinutes();
  let seconds = now.getSeconds() - ref.getSeconds();

  const norm = (n: number, base: number): [number, number] => (n >= 0 ? [n, 0] : [n + base, -1]);
  let carry;
  [seconds, carry] = norm(seconds, 60);
  [minutes, carry] = norm(minutes + carry, 60);
  [hours, carry] = norm(hours + carry, 24);
  days += carry;

  if (days < 0) {
    const prev = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prev.getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { total, years, months, days, hours, minutes, seconds };
}

export function buildFormatted(mode: 'down' | 'up', origin: Date | number | string): FlipClockTimeDeltaFormatted {
  const base = alignToSecond(Date.now());
  const cur = calcTimeDelta(mode, origin, base);
  const nxt = calcTimeDelta(mode, origin, base + 1000);

  return {
    years: { current: pad(cur.years % 100), next: pad(nxt.years % 100) },
    months: { current: pad(cur.months), next: pad(nxt.months) },
    days: { current: pad(cur.days), next: pad(nxt.days) },
    hours: { current: pad(cur.hours), next: pad(nxt.hours) },
    minutes: { current: pad(cur.minutes), next: pad(nxt.minutes) },
    seconds: { current: pad(cur.seconds), next: pad(nxt.seconds) }
  };
}

export const convertToPx = (n?: string | number) => (n == null ? undefined : typeof n === 'string' ? n : `${n}px`);

export const isServer = () => typeof window === 'undefined';
export const isClient = () => !isServer();
