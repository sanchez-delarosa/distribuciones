import { lgamma, lfact, techo } from '../../mate/especiales.js';

const media = ({ r, p }) => (r * (1 - p)) / p;
const varianza = ({ r, p }) => (r * (1 - p)) / (p * p);

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'binomial-negativa-fracasos',
  nombre: 'Binomial negativa (fracasos)',
  tipo: 'discreta',
  notacion: 'X \\sim \\text{BN}_{F}(r, p)',
  descripcion:
    'Número de fracasos antes del $r$-ésimo éxito en ensayos Bernoulli independientes con probabilidad de éxito $p$. El soporte empieza en $0$.',
  alias: ['binomial negativa', 'pascal', 'polya'],
  parametros: [
    { id: 'r', tex: 'r', nombre: 'número de éxitos', restriccion: 'r > 0', min: 0.5, max: 30, paso: 0.5, valor: 3 },
    { id: 'p', tex: 'p', nombre: 'probabilidad de éxito', restriccion: '0 < p < 1', min: 0.05, max: 0.95, paso: 0.01, valor: 0.4 },
  ],
  soporte: 'x \\in \\{0, 1, 2, \\dots\\}',
  formulas: {
    densidad: 'P(X = x) = \\binom{x + r - 1}{x} p^{r} (1-p)^{x}',
    fda: 'F(x) = \\sum_{k=0}^{\\lfloor x \\rfloor} \\binom{k + r - 1}{k} p^{r} (1-p)^{k}',
    media: 'E[X] = \\frac{r(1-p)}{p}',
    varianza: '\\operatorname{Var}(X) = \\frac{r(1-p)}{p^{2}}',
    fgm: 'M_X(t) = \\left(\\frac{p}{1 - (1-p)\\,e^{t}}\\right)^{r}, \\quad t < -\\ln(1-p)',
    fgp: 'P_X(z) = \\left(\\frac{p}{1 - (1-p)\\,z}\\right)^{r}, \\quad |z| < \\frac{1}{1-p}',
  },
  claseAB: { clase: '(a, b, 0)', a: '1-p', b: '(r-1)(1-p)', p0: 'p^{r}' },
  propiedades: [
    { letra: 'C', detalle: 'X_i \\sim \\text{BN}_{F}(r_i, p) \\Rightarrow \\sum_i X_i \\sim \\text{BN}_{F}\\Big(\\sum_i r_i,\\, p\\Big)' },
  ],
  notas: [
    'Con esta parametrización $r$ puede ser cualquier real positivo; en ese caso, $\\binom{x + r - 1}{x} = \\frac{\\Gamma(x + r)}{\\Gamma(r)\\, x!}$.',
    'Su varianza siempre es mayor que su media (sobredispersión), por eso se usa para modelar frecuencias de siniestros más variables que una Poisson.',
    'En *Loss Models* se parametriza con $\\beta = (1-p)/p$: $E[X] = r\\beta$ y $\\operatorname{Var}(X) = r\\beta(1 + \\beta)$.',
  ],
  superficie: { param: 'p', min: 0.15, max: 0.9 },
  calc: {
    densidad: (x, { r, p }) =>
      Math.exp(lgamma(x + r) - lgamma(r) - lfact(x) + r * Math.log(p) + x * Math.log1p(-p)),
    rango: (q) => [0, techo(media(q) + 15 * Math.sqrt(varianza(q)) + 20)],
    media,
    varianza,
  },
};
