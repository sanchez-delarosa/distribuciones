/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'bernoulli',
  nombre: 'Bernoulli',
  tipo: 'discreta',
  notacion: 'X \\sim \\text{Bernoulli}(p)',
  descripcion:
    'Resultado de un solo ensayo con dos resultados posibles: éxito ($X = 1$) con probabilidad $p$ o fracaso ($X = 0$).',
  parametros: [
    { id: 'p', tex: 'p', nombre: 'probabilidad de éxito', restriccion: '0 < p < 1', min: 0.01, max: 0.99, paso: 0.01, valor: 0.3 },
  ],
  soporte: 'x \\in \\{0, 1\\}',
  formulas: {
    densidad: 'P(X = x) = p^{x}(1-p)^{1-x}',
    fda: 'F(x) = \\begin{cases} 0 & x < 0 \\\\ 1-p & 0 \\le x < 1 \\\\ 1 & x \\ge 1 \\end{cases}',
    media: 'E[X] = p',
    varianza: '\\operatorname{Var}(X) = p(1-p)',
    fgm: 'M_X(t) = 1 - p + p\\,e^{t}',
    fgp: 'P_X(z) = 1 - p + p\\,z',
  },
  extras: [{ etiqueta: 'Momentos', tex: 'E[X^{k}] = p, \\quad k = 1, 2, \\dots' }],
  propiedades: [
    { letra: 'P', detalle: 'X_i \\sim \\text{Bernoulli}(p_i) \\Rightarrow \\prod_i X_i \\sim \\text{Bernoulli}\\Big(\\prod_i p_i\\Big)' },
    { letra: 'M', detalle: '\\min_i X_i \\sim \\text{Bernoulli}\\Big(\\prod_i p_i\\Big)' },
    { letra: 'X', detalle: '\\max_i X_i \\sim \\text{Bernoulli}\\Big(1 - \\prod_i (1-p_i)\\Big)' },
  ],
  notas: ['La varianza $p(1-p)$ es máxima cuando $p = 0.5$.'],
  superficie: { param: 'p', min: 0.02, max: 0.98 },
  calc: {
    densidad: (x, { p }) => (x === 0 ? 1 - p : x === 1 ? p : 0),
    rango: () => [0, 1],
    media: ({ p }) => p,
    varianza: ({ p }) => p * (1 - p),
  },
};
