// Funciones especiales para evaluar densidades numéricamente.

const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
  1.5056327351493116e-7,
];

/** Logaritmo de la función gamma (aproximación de Lanczos, g = 7). */
export function lgamma(x) {
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
  x -= 1;
  let a = LANCZOS[0];
  const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += LANCZOS[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/** ln C(n, k) para n y k reales (vía gamma); −∞ fuera del rango. */
export function lcomb(n, k) {
  if (k < 0 || k > n) return -Infinity;
  return lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1);
}

/** ln x! */
export const lfact = (n) => lgamma(n + 1);

/** Función error (Abramowitz y Stegun 7.1.26, error < 1.5e-7). */
export function erf(x) {
  const s = Math.sign(x);
  x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-x * x);
  return s * y;
}

export const fiNormal = (z) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
export const PhiNormal = (z) => 0.5 * (1 + erf(z / Math.SQRT2));

/** Entero mayor o igual a x, limitado a un máximo razonable para graficar. */
export const techo = (x, max = 5000) => Math.min(Math.ceil(x), max);
