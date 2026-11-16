/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'logistica',
  nombre: 'Logística',
  tipo: 'continua',
  materia: 'probabilidad-avanzada',
  notacion: 'X \\sim \\text{Logística}(\\mu, s)',
  descripcion:
    'Distribución continua simétrica cuya función de distribución acumulada es la función sigmoide (logística). Tiene forma parecida a la normal pero colas más pesadas, y su función cuantil es la transformación *logit*, base de la regresión logística para probabilidades de siniestro o incumplimiento.',
  alias: ['sigmoide', 'logit'],
  parametros: [
    { id: 'mu', tex: '\\mu', nombre: 'localización (media)', restriccion: '\\mu \\in \\mathbb{R}', min: -5, max: 5, paso: 0.25, valor: 0 },
    { id: 's', tex: 's', nombre: 'escala', restriccion: 's > 0', min: 0.25, max: 4, paso: 0.25, valor: 1 },
  ],
  soporte: 'x \\in (-\\infty, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\frac{e^{-(x - \\mu)/s}}{s\\,\\big(1 + e^{-(x - \\mu)/s}\\big)^{2}} = \\frac{1}{4s}\\,\\operatorname{sech}^{2}\\!\\left(\\frac{x - \\mu}{2s}\\right)',
    fda: 'F(x) = \\frac{1}{1 + e^{-(x - \\mu)/s}}',
    supervivencia: 'S(x) = \\frac{1}{1 + e^{(x - \\mu)/s}}',
    riesgo: 'h(x) = \\frac{1}{s}\\,F(x) = \\frac{1}{s\\big(1 + e^{-(x - \\mu)/s}\\big)}',
    media: 'E[X] = \\mu',
    varianza: '\\operatorname{Var}(X) = \\frac{\\pi^{2} s^{2}}{3}',
    fgm: 'M_X(t) = e^{\\mu t}\\,\\operatorname{B}(1 - st,\\, 1 + st) = \\frac{\\pi s t}{\\sin(\\pi s t)}\\,e^{\\mu t}, \\quad |t| < \\frac{1}{s}',
  },
  extras: [
    {
      etiqueta: 'Cuantiles (función logit)',
      tex: 'F^{-1}(p) = \\mu + s\\,\\ln\\!\\left(\\frac{p}{1 - p}\\right)',
    },
    {
      etiqueta: 'Relación entre f y F',
      tex: 'f(x) = \\frac{1}{s}\\,F(x)\\big(1 - F(x)\\big)',
    },
    {
      etiqueta: 'Exceso de curtosis',
      tex: '\\gamma_2 = \\frac{6}{5} = 1.2',
    },
  ],
  propiedades: [
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{Logística}(c\\mu,\\, cs), \\quad c > 0',
    },
    {
      letra: 'V',
      detalle: 'X = \\mu + s\\,\\ln\\!\\left(\\frac{U}{1 - U}\\right), \\quad U \\sim \\text{Uniforme}(0, 1)',
    },
  ],
  notas: [
    'Si $X \\sim \\text{Logística}(\\mu, s)$, entonces $e^{X}$ sigue una distribución log-logística (caso especial de Burr) muy utilizada en teoría del riesgo.',
  ],
  superficie: { param: 's', min: 0.5, max: 3 },
  calc: {
    densidad: (x, { mu, s }) => {
      const z = Math.abs(x - mu) / s;
      const ez = Math.exp(-z);
      return ez / (s * (1 + ez) * (1 + ez));
    },
    rango: ({ mu, s }) => [mu - 14 * s, mu + 14 * s],
    media: ({ mu }) => mu,
    varianza: ({ s }) => (Math.PI * Math.PI * s * s) / 3,
  },
};
