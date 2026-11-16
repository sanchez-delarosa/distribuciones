/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'exponencial',
  nombre: 'Exponencial',
  tipo: 'continua',
  notacion: 'X \\sim \\text{Exp}(\\lambda)',
  descripcion:
    'Tiempo de espera hasta el primer evento en un proceso de Poisson de tasa constante $\\lambda$. Es el análogo continuo de la distribución geométrica.',
  alias: ['exponential', 'fuerza constante de mortalidad', 'dormoy'],
  parametros: [
    { id: 'lambda', tex: '\\lambda', nombre: 'tasa', restriccion: '\\lambda > 0', min: 0.1, max: 5, paso: 0.05, valor: 1 },
  ],
  soporte: 'x \\in [0, \\infty)',
  formulas: {
    densidad: 'f(x) = \\lambda\\, e^{-\\lambda x}',
    fda: 'F(x) = 1 - e^{-\\lambda x}, \\quad x \\ge 0',
    supervivencia: 'S(x) = e^{-\\lambda x}, \\quad x \\ge 0',
    riesgo: 'h(x) = \\lambda',
    media: 'E[X] = \\frac{1}{\\lambda}',
    varianza: '\\operatorname{Var}(X) = \\frac{1}{\\lambda^{2}}',
    fgm: 'M_X(t) = \\frac{\\lambda}{\\lambda - t}, \\quad t < \\lambda',
  },
  extras: [
    { etiqueta: 'Momentos', tex: 'E[X^{k}] = \\frac{k!}{\\lambda^{k}}, \\quad k = 1, 2, \\dots' },
    { etiqueta: 'Valor en riesgo', tex: '\\operatorname{VaR}_{\\alpha}(X) = -\\frac{\\ln(1 - \\alpha)}{\\lambda}' },
    { etiqueta: 'TVaR', tex: '\\operatorname{TVaR}_{\\alpha}(X) = \\operatorname{VaR}_{\\alpha}(X) + \\frac{1}{\\lambda}' },
    { etiqueta: 'Esperanza limitada', tex: 'E[X \\wedge d] = \\frac{1 - e^{-\\lambda d}}{\\lambda}' },
    {
      etiqueta: 'Ley de fuerza constante de mortalidad (Matemáticas Actuariales)',
      tex: '\\mu_{x+t} = \\mu \\implies {}_{t}p_x = e^{-\\mu t}, \\quad {}_{t}p_x\\,\\mu_{x+t} = \\mu e^{-\\mu t}, \\quad \\mathring{e}_x = \\frac{1}{\\mu}',
    },
  ],
  propiedades: [
    { letra: 'F', detalle: 'P(X > s + t \\mid X > s) = P(X > t) = e^{-\\lambda t}' },
    { letra: 'S', detalle: 'cX \\sim \\text{Exp}(\\lambda / c), \\quad c > 0' },
    { letra: 'M', detalle: 'X_i \\sim \\text{Exp}(\\lambda_i) \\Rightarrow \\min_i X_i \\sim \\text{Exp}\\Big(\\sum_i \\lambda_i\\Big)' },
    { letra: 'R', detalle: 'X - d \\mid X > d \\sim \\text{Exp}(\\lambda)' },
    { letra: 'V', detalle: 'X = -\\frac{\\ln U}{\\lambda}, \\quad U \\sim \\text{Uniforme}(0, 1)' },
  ],
  notas: [
    'Es la única distribución continua con falta de memoria y función de riesgo constante.',
    'En *Loss Models* suele parametrizarse con la media $\\theta = 1/\\lambda$, de modo que $f(x) = \\frac{1}{\\theta}e^{-x/\\theta}$.',
    '**Matemáticas Actuariales (Fuerza constante de mortalidad):** Asumir una **fuerza constante de mortalidad** $\\mu_{x+t} = \\mu$ equivale exactamente a decir que el tiempo de vida futuro sigue $T_x \\sim \\text{Exp}(\\mu)$. Por la falta de memoria ($F$), la vida residual $T_x$ no depende de la edad alcanzada $x$ (no hay envejecimiento) y el seguro de vida entera continuo vale $\\bar{A}_x = \\frac{\\mu}{\\mu + \\delta}$. Aplicada por tramos entre edades enteras $[x, x+1)$ con $\\mu_x = -\\ln p_x$, constituye el **supuesto de fuerza constante de mortalidad** en edades fraccionarias (${}_{t}p_x = (p_x)^t$).',
  ],
  superficie: { param: 'lambda', min: 0.3, max: 3 },
  calc: {
    densidad: (x, { lambda }) => (x < 0 ? 0 : lambda * Math.exp(-lambda * x)),
    rango: ({ lambda }) => [0, 18 / lambda],
    media: ({ lambda }) => 1 / lambda,
    varianza: ({ lambda }) => 1 / (lambda * lambda),
  },
};
