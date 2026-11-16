import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'chi-cuadrada-inversa-escalada',
  nombre: 'Chi-cuadrada inversa escalada',
  tipo: 'continua',
  materia: 'bayesiana',
  notacion: '\\sigma^{2} \\sim \\text{Inv-}\\chi^{2}(\\nu, s^{2})',
  descripcion:
    'Parametrización bayesiana canónica para la distribución a priori y a posteriori de la varianza $\\sigma^2$ en modelos normales y jerárquicos: equivale a una $\\text{Gamma}^{-1}(\\nu/2,\\, \\nu s^2 / 2)$, donde $\\nu$ representa grados de libertad previos y $s^2$ el estimador cuadrático previo.',
  alias: ['inv chi2 escalada', 'varianza bayesiana'],
  parametros: [
    { id: 'nu', tex: '\\nu', nombre: 'grados de libertad previos', restriccion: '\\nu > 0', min: 2, max: 25, paso: 1, valor: 10 },
    { id: 's2', tex: 's^{2}', nombre: 'escala cuadrática previa', restriccion: 's^{2} > 0', min: 0.25, max: 5, paso: 0.25, valor: 1.5 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\frac{(\\nu s^{2} / 2)^{\\nu / 2}}{\\Gamma(\\nu / 2)}\\,x^{-(\\nu / 2 + 1)}\\,\\exp\\!\\left(-\\frac{\\nu s^{2}}{2x}\\right)',
    media: 'E[X] = \\frac{\\nu}{\\nu - 2}\\,s^{2}, \\quad \\nu > 2',
    varianza: '\\operatorname{Var}(X) = \\frac{2\\,\\nu^{2}}{(\\nu - 2)^{2}(\\nu - 4)}\\,s^{4}, \\quad \\nu > 4',
  },
  extras: [
    {
      etiqueta: 'Construcción a partir de Chi-cuadrada',
      tex: 'V \\sim \\chi^{2}(\\nu) \\implies X = \\frac{\\nu s^{2}}{V} \\sim \\text{Inv-}\\chi^{2}(\\nu, s^{2})',
    },
    {
      etiqueta: 'Actualización bayesiana de la varianza (media μ conocida)',
      tex: '\\sigma^{2} \\mid \\mathbf{x} \\sim \\text{Inv-}\\chi^{2}\\!\\left(\\nu_0 + n,\\; \\frac{\\nu_0 s_0^{2} + \\sum_{i=1}^{n}(x_i - \\mu)^{2}}{\\nu_0 + n}\\right)',
    },
    {
      etiqueta: 'Moda',
      tex: '\\text{Moda}(X) = \\frac{\\nu}{\\nu + 2}\\,s^{2}',
    },
  ],
  propiedades: [
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{Inv-}\\chi^{2}(\\nu,\\, c\\,s^{2}), \\quad c > 0',
    },
  ],
  notas: [
    'La media posterior de la escala cuadrática $s_n^2 = \\frac{\\nu_0}{\\nu_0 + n}s_0^2 + \\frac{n}{\\nu_0 + n}\\hat{\\sigma}^2$ es un promedio ponderado de credibilidad entre la varianza a priori $s_0^2$ y la varianza muestral $\\hat{\\sigma}^2$.',
  ],
  superficie: { param: 'nu', min: 4, max: 22 },
  calc: {
    densidad: (x, { nu, s2 }) => {
      if (x <= 0) return 0;
      const a = nu / 2;
      const th = (nu * s2) / 2;
      return Math.exp(a * Math.log(th) - lgamma(a) - (a + 1) * Math.log(x) - th / x);
    },
    rango: ({ s2 }) => [0, 22 * s2],
    rangoGrafica: ({ s2 }) => [0, 5 * s2],
    media: ({ nu, s2 }) => (nu > 2 ? (nu * s2) / (nu - 2) : Infinity),
    varianza: ({ nu, s2 }) =>
      nu > 4 ? (2 * nu * nu * s2 * s2) / ((nu - 2) ** 2 * (nu - 4)) : Infinity,
  },
};
