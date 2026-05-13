export interface ODEState {
  t: number;
  y: number[];
}

export type ODEFunction = (t: number, y: number[]) => number[];

export function solveRK4(
  f: ODEFunction,
  y0: number[],
  t0: number,
  tEnd: number,
  dt: number
): ODEState[] {
  const results: ODEState[] = [{ t: t0, y: [...y0] }];
  let t = t0;
  let y = [...y0];

  while (t < tEnd - 1e-10) {
    const h = Math.min(dt, tEnd - t);
    const k1 = f(t, y);
    const k2 = f(t + h / 2, y.map((yi, i) => yi + (h / 2) * k1[i]));
    const k3 = f(t + h / 2, y.map((yi, i) => yi + (h / 2) * k2[i]));
    const k4 = f(t + h, y.map((yi, i) => yi + h * k3[i]));

    y = y.map((yi, i) => yi + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    t += h;
    results.push({ t, y: [...y] });
  }

  return results;
}
