import { lcomb, techo } from '../../mate/especiales.js';

const media = ({ r, p }) => r / p;
const varianza = ({ r, p }) => (r * (1 - p)) / (p * p);

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'binomial-negativa-ensayos',
  nombre: 'Binomial negativa (ensayos)',
  tipo: 'discreta',
  notacion: 'Y \\sim \\text{BN}_{E}(r, p)',
  descripcion:
    'Número de ensayos Bernoulli independientes necesarios para obtener el $r$-ésimo éxito, contando el ensayo del último éxito. El soporte empieza en $r$.',
  alias: ['binomial negativa', 'pascal'],
  parametros: [
    { id: 'r', tex: 'r', nombre: 'número de éxitos', restriccion: 'r \\in \\{1, 2, \\dots\\}', min: 1, max: 30, paso: 1, valor: 3 },
    { id: 'p', tex: 'p', nombre: 'probabilidad de éxito', restriccion: '0 < p < 1', min: 0.05, max: 0.95, paso: 0.01, valor: 0.4 },
  ],
  soporte: 'y \\in \\{r, r + 1, r + 2, \\dots\\}',
  formulas: {
    densidad: 'P(Y = y) = \\binom{y - 1}{r - 1} p^{r} (1-p)^{y-r}',
    fda: 'F(y) = \\sum_{k=r}^{\\lfloor y \\rfloor} \\binom{k - 1}{r - 1} p^{r} (1-p)^{k-r}',
    media: 'E[Y] = \\frac{r}{p}',
    varianza: '\\operatorname{Var}(Y) = \\frac{r(1-p)}{p^{2}}',
    fgm: 'M_Y(t) = \\left(\\frac{p\\,e^{t}}{1 - (1-p)\\,e^{t}}\\right)^{r}, \\quad t < -\\ln(1-p)',
    fgp: 'P_Y(z) = \\left(\\frac{p\\,z}{1 - (1-p)\\,z}\\right)^{r}, \\quad |z| < \\frac{1}{1-p}',
  },
  propiedades: [
    { letra: 'C', detalle: 'Y_i \\sim \\text{BN}_{E}(r_i, p) \\Rightarrow \\sum_i Y_i \\sim \\text{BN}_{E}\\Big(\\sum_i r_i,\\, p\\Big)' },
  ],
  notas: [
    'Relación con la binomial: necesitar a lo más $n$ ensayos para lograr $r$ éxitos equivale a tener al menos $r$ éxitos en $n$ ensayos, es decir, $P(Y \\le n) = P(\\text{Bin}(n, p) \\ge r)$.',
  ],
  superficie: { param: 'p', min: 0.15, max: 0.9 },
  calc: {
    densidad: (y, { r, p }) =>
      y < r ? 0 : Math.exp(lcomb(y - 1, r - 1) + r * Math.log(p) + (y - r) * Math.log1p(-p)),
    rango: (q) => [q.r, techo(media(q) + 15 * Math.sqrt(varianza(q)) + 20)],
    media,
    varianza,
  },
};
