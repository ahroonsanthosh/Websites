import { useEffect, useState } from "react";

// Opening minutes-from-midnight per weekday (0 = Sunday)
const HOURS: Record<number, [number, number]> = {
  0: [10 * 60 + 30, 18 * 60],
  1: [8 * 60 + 30, 18 * 60],
  2: [8 * 60 + 30, 18 * 60],
  3: [8 * 60 + 30, 18 * 60],
  4: [8 * 60 + 30, 18 * 60],
  5: [8 * 60 + 30, 18 * 60],
  6: [9 * 60 + 30, 18 * 60],
};

export function useOpenNow() {
  const [openNow, setOpenNow] = useState(() => check());

  useEffect(() => {
    const id = setInterval(() => setOpenNow(check()), 60_000);
    return () => clearInterval(id);
  }, []);

  return openNow;
}

function check(): boolean {
  const now = new Date();
  const [open, close] = HOURS[now.getDay()];
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= open && mins < close;
}
