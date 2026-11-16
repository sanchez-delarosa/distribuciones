// Cuadratura de Darboux (esperanza completa de vida e_x = ∫ S(t) dt y Var(T) = 2∫ t S(t) dt - e_x^2).
function momentosSupervivencia(S, tMax) {
  const N = 1000;
  const h = tMax / N;
  let m1 = 0;
  let m2 = 0;
  for (let i = 0; i <= N; i++) {
    const t = i * h;
    const st = S(t);
    const w = i === 0 || i === N ? 0.5 * h : h;
    m1 += st * w;
    m2 += 2 * t * st * w;
  }
  return { media: m1, varianza: m2 - m1 * m1 };
}

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'gompertz',
  nombre: 'Gompertz',
  tipo: 'continua',
  materia: 'matematicas-actuariales',
  notacion: 'T_x \\sim \\text{Gompertz}(B, c)',
  descripcion:
    'Ley de mortalidad de Benjamin Gompertz (1825): postula que la **fuerza de mortalidad** crece exponencialmente con la edad según $\\mu_{x+t} = B\\,c^{t} = B\\,e^{\\gamma t}$ ($\\gamma = \\ln c > 0$), reflejando el deterioro fisiológico por envejecimiento. Es la base de las tablas de mortalidad para edades adultas y de rentas vitalicias.',
  alias: ['ley de gompertz', 'fuerza exponencial de mortalidad', 'vida futura'],
  parametros: [
    { id: 'B', tex: 'B', nombre: 'fuerza inicial de mortalidad (B_x = B c^x)', restriccion: 'B > 0', min: 0.01, max: 0.5, paso: 0.01, valor: 0.05 },
    { id: 'gamma', tex: '\\gamma = \\ln c', nombre: 'tasa de envejecimiento', restriccion: '\\gamma = \\ln c > 0\\ (c > 1)', min: 0.03, max: 0.25, paso: 0.01, valor: 0.08 },
  ],
  soporte: 't \\in [0, \\infty)',
  formulas: {
    densidad:
      'f_{T_x}(t) = {}_{t}p_x\\,\\mu_{x+t} = B\\,c^{t}\\,\\exp\\!\\left[-\\frac{B}{\\ln c}\\big(c^{t} - 1\\big)\\right], \\quad c = e^{\\gamma}',
    fda: 'F_{T_x}(t) = {}_{t}q_x = 1 - \\exp\\!\\left[-\\frac{B}{\\ln c}\\big(c^{t} - 1\\big)\\right]',
    supervivencia:
      'S_{T_x}(t) = {}_{t}p_x = g^{c^{t} - 1} = \\exp\\!\\left[-\\frac{B}{\\ln c}\\big(c^{t} - 1\\big)\\right], \\quad g = e^{-B/\\ln c}',
    riesgo: '\\mu_{x+t} = B\\,c^{t} = B\\,e^{\\gamma t}',
    media:
      '\\mathring{e}_x = E[T_x] = \\int_{0}^{\\infty} {}_{t}p_x\\,dt = \\frac{e^{B/\\gamma}}{\\gamma}\\,E_1\\!\\left(\\frac{B}{\\gamma}\\right)',
    varianza:
      '\\operatorname{Var}(T_x) = 2\\int_{0}^{\\infty} t\\,{}_{t}p_x\\,dt - \\big(\\mathring{e}_x\\big)^{2}',
  },
  extras: [
    {
      etiqueta: 'Cuantiles (edad mediana al fallecer)',
      tex: 'F^{-1}(u) = \\frac{1}{\\ln c}\\,\\ln\\!\\left(1 - \\frac{\\ln c}{B}\\ln(1 - u)\\right)',
    },
    {
      etiqueta: 'Moda de la edad al fallecer (pico de muertes)',
      tex: 't_{\\text{moda}} = \\frac{1}{\\ln c}\\,\\ln\\!\\left(\\frac{\\ln c}{B}\\right), \\quad B < \\ln c',
    },
    {
      etiqueta: 'Vida conjunta de m vidas Gompertz (edad equivalente w)',
      tex: '{}_{t}p_{x_1 : \\dots : x_m} = {}_{t}p_w, \\quad c^{w} = \\sum_{i=1}^{m} c^{x_i} \\quad (\\text{ley de envejecimiento uniforme})',
    },
  ],
  propiedades: [
    {
      letra: 'M',
      detalle: 'T_i \\perp \\text{Gompertz}(B_i, c) \\Rightarrow \\min_i T_i \\sim \\text{Gompertz}\\!\\Big(\\sum_i B_i,\\, c\\Big)',
    },
    {
      letra: 'R',
      detalle: 'T_0 - x \\mid T_0 > x \\sim \\text{Gompertz}(B\\,c^{x},\\, c)',
    },
    {
      letra: 'V',
      detalle: 'T = \\frac{1}{\\ln c}\\,\\ln\\!\\left(1 - \\frac{\\ln c}{B}\\ln U\\right), \\quad U \\sim \\text{Uniforme}(0, 1)',
    },
  ],
  notas: [
    'Gracias a la propiedad del mínimo ($M$) con la misma base $c$, el estatus de **vida conjunta** $T_{x_1:\\dots:x_m} = \\min(T_{x_1}, \\dots, T_{x_m})$ de $m$ vidas independientes que siguen la ley de Gompertz equivale exactamente a una sola vida de edad $w$ tal que $c^w = c^{x_1} + \\dots + c^{x_m}$.',
    'Si $T \\sim \\text{Gompertz}(B, c)$, la transformación $\\frac{B}{\\ln c}(c^T - 1)$ sigue una distribución $\\text{Exp}(1)$.',
  ],
  superficie: { param: 'gamma', min: 0.04, max: 0.2 },
  calc: {
    densidad: (t, { B, gamma }) => {
      if (t < 0) return 0;
      const eg = Math.exp(gamma * t);
      return B * eg * Math.exp((-B / gamma) * (eg - 1));
    },
    rango: ({ B, gamma }) => [0, Math.log(1 + (28 * gamma) / B) / gamma],
    media: ({ B, gamma }) => {
      const tMax = Math.log(1 + (28 * gamma) / B) / gamma;
      return momentosSupervivencia((t) => Math.exp((-B / gamma) * (Math.exp(gamma * t) - 1)), tMax).media;
    },
    varianza: ({ B, gamma }) => {
      const tMax = Math.log(1 + (28 * gamma) / B) / gamma;
      return momentosSupervivencia((t) => Math.exp((-B / gamma) * (Math.exp(gamma * t) - 1)), tMax).varianza;
    },
  },
};
