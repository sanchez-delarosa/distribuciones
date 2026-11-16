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
  id: 'makeham',
  nombre: 'Makeham',
  tipo: 'continua',
  materia: 'matematicas-actuariales',
  notacion: 'T_x \\sim \\text{Makeham}(A, B, c)',
  descripcion:
    'Ley de mortalidad de William Makeham (1860): extiende la ley de Gompertz añadiendo un término constante $A \\ge 0$ a la fuerza de mortalidad, $\\mu_{x+t} = A + B\\,c^{t}$, para capturar riesgos accidentales o infecciosos independientes de la edad junto con el envejecimiento biológico $B\\,c^{t}$.',
  alias: ['gompertz-makeham', 'ley de makeham'],
  parametros: [
    { id: 'A', tex: 'A', nombre: 'riesgo accidental constante', restriccion: 'A \\ge 0', min: 0, max: 0.2, paso: 0.01, valor: 0.03 },
    { id: 'B', tex: 'B', nombre: 'fuerza inicial de envejecimiento', restriccion: 'B > 0', min: 0.01, max: 0.4, paso: 0.01, valor: 0.04 },
    { id: 'gamma', tex: '\\gamma = \\ln c', nombre: 'tasa de envejecimiento', restriccion: '\\gamma = \\ln c > 0', min: 0.03, max: 0.25, paso: 0.01, valor: 0.08 },
  ],
  soporte: 't \\in [0, \\infty)',
  formulas: {
    densidad:
      'f_{T_x}(t) = {}_{t}p_x\\,\\mu_{x+t} = \\big(A + B\\,c^{t}\\big)\\,\\exp\\!\\left[-A\\,t - \\frac{B}{\\ln c}\\big(c^{t} - 1\\big)\\right]',
    fda: 'F_{T_x}(t) = {}_{t}q_x = 1 - s^{t}\\,g^{c^{t} - 1}',
    supervivencia:
      'S_{T_x}(t) = {}_{t}p_x = s^{t}\\,g^{c^{t} - 1} = \\exp\\!\\left[-A\\,t - \\frac{B}{\\ln c}\\big(c^{t} - 1\\big)\\right], \\quad s = e^{-A},\\ g = e^{-B/\\ln c}',
    riesgo: '\\mu_{x+t} = A + B\\,c^{t} = A + B\\,e^{\\gamma t}',
    media:
      '\\mathring{e}_x = E[T_x] = \\int_{0}^{\\infty} s^{t}\\,g^{c^{t} - 1}\\,dt',
    varianza:
      '\\operatorname{Var}(T_x) = 2\\int_{0}^{\\infty} t\\,s^{t}\\,g^{c^{t} - 1}\\,dt - \\big(\\mathring{e}_x\\big)^{2}',
  },
  extras: [
    {
      etiqueta: 'Representación por riesgos competitivos (mínimo)',
      tex: 'T_x = \\min\\big(T_{\\text{acc}},\\, T_{\\text{env}}\\big), \\quad T_{\\text{acc}} \\sim \\text{Exp}(A) \\;\\perp\\; T_{\\text{env}} \\sim \\text{Gompertz}(B, c)',
    },
    {
      etiqueta: 'Vida conjunta de m vidas Makeham (ley de envejecimiento uniforme)',
      tex: '{}_{t}p_{x_1 : \\dots : x_m} = s^{(m-1)t}\\,{}_{t}p_{w:\\dots:w}, \\quad m\\,c^{w} = \\sum_{i=1}^{m} c^{x_i}',
    },
  ],
  propiedades: [
    {
      letra: 'M',
      detalle: 'T_i \\perp \\text{Makeham}(A_i, B_i, c) \\Rightarrow \\min_i T_i \\sim \\text{Makeham}\\!\\Big(\\sum_i A_i,\\, \\sum_i B_i,\\, c\\Big)',
    },
    {
      letra: 'R',
      detalle: 'T_0 - x \\mid T_0 > x \\sim \\text{Makeham}(A,\\, B\\,c^{x},\\, c)',
    },
  ],
  notas: [
    'Interpretación probabilística directa: fallecer bajo la ley de Makeham equivale al primer evento entre una causa accidental de fuerza constante $T_{\\text{acc}} \\sim \\text{Exp}(A)$ y el envejecimiento fisiológico $T_{\\text{env}} \\sim \\text{Gompertz}(B, c)$ independientes.',
    'Con $A = 0$ se recupera la ley de **Gompertz**, y cuando $B \\to 0$ (o $c \\to 1$) se recupera la ley de **fuerza constante de mortalidad** ($\\text{Exp}(A)$).',
  ],
  superficie: { param: 'A', min: 0, max: 0.16 },
  calc: {
    densidad: (t, { A, B, gamma }) => {
      if (t < 0) return 0;
      const eg = Math.exp(gamma * t);
      return (A + B * eg) * Math.exp(-A * t - (B / gamma) * (eg - 1));
    },
    rango: ({ B, gamma }) => [0, Math.log(1 + (28 * gamma) / B) / gamma],
    media: ({ A, B, gamma }) => {
      const tMax = Math.log(1 + (28 * gamma) / B) / gamma;
      return momentosSupervivencia((t) => Math.exp(-A * t - (B / gamma) * (Math.exp(gamma * t) - 1)), tMax).media;
    },
    varianza: ({ A, B, gamma }) => {
      const tMax = Math.log(1 + (28 * gamma) / B) / gamma;
      return momentosSupervivencia((t) => Math.exp(-A * t - (B / gamma) * (Math.exp(gamma * t) - 1)), tMax).varianza;
    },
  },
};
