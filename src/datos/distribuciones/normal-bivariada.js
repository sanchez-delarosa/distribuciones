import { fiNormal } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'normal-bivariada',
  nombre: 'Normal bivariada',
  tipo: 'continua',
  materia: 'probabilidad-avanzada',
  notacion: '(X, Y) \\sim N_2(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})',
  descripcion:
    'Distribución conjunta de dos variables normales con medias $\\mu_X, \\mu_Y$, varianzas $\\sigma_X^2, \\sigma_Y^2$ y coeficiente de correlación $\\rho \\in (-1, 1)$. En ella todas las marginales, condicionales y combinaciones lineales son normales. La gráfica muestra la distribución condicional $Y \\mid X = x_0 \\sim N\\big(\\mu_Y + \\rho\\frac{\\sigma_Y}{\\sigma_X}(x_0 - \\mu_X),\\, (1 - \\rho^2)\\sigma_Y^2\\big)$ con variables estandarizadas.',
  alias: ['gaussiana bivariada', 'normal multivariada'],
  parametros: [
    { id: 'rho', tex: '\\rho', nombre: 'coeficiente de correlación', restriccion: '\\rho \\in (-1, 1)', min: -0.9, max: 0.9, paso: 0.05, valor: 0.6 },
    { id: 'x0', tex: 'x_0', nombre: 'valor condicionado de X (estandarizado)', restriccion: 'x_0 \\in \\mathbb{R}', min: -3, max: 3, paso: 0.25, valor: 1 },
  ],
  soporte: '(x, y) \\in \\mathbb{R}^{2}',
  formulas: {
    densidad:
      'f(x, y) = \\frac{1}{2\\pi\\sigma_X\\sigma_Y\\sqrt{1 - \\rho^{2}}}\\,\\exp\\!\\left[-\\frac{z_X^{2} - 2\\rho z_X z_Y + z_Y^{2}}{2(1 - \\rho^{2})}\\right], \\quad z_X = \\frac{x - \\mu_X}{\\sigma_X}',
    media: 'E[Y \\mid X = x] = \\mu_Y + \\rho\\,\\frac{\\sigma_Y}{\\sigma_X}(x - \\mu_X)',
    varianza: '\\operatorname{Var}(Y \\mid X = x) = (1 - \\rho^{2})\\sigma_Y^{2}',
    fgm: 'M_{X,Y}(t_1, t_2) = \\exp\\!\\left(t_1\\mu_X + t_2\\mu_Y + \\frac{1}{2}\\big(t_1^{2}\\sigma_X^{2} + 2\\rho t_1 t_2 \\sigma_X\\sigma_Y + t_2^{2}\\sigma_Y^{2}\\big)\\right)',
  },
  extras: [
    {
      etiqueta: 'Independencia si y sólo si ρ = 0',
      tex: 'X \\perp Y \\iff \\rho = 0 \\quad (\\text{propiedad exclusiva de la normal conjunta})',
    },
    {
      etiqueta: 'Distancia de Mahalanobis (elipses de contorno)',
      tex: 'Q = \\frac{z_X^{2} - 2\\rho z_X z_Y + z_Y^{2}}{1 - \\rho^{2}} \\sim \\chi^2(2) = \\text{Exp}(1/2)',
    },
    {
      etiqueta: 'Construcción con normales estándar independientes',
      tex: 'Z_1, Z_2 \\perp N(0, 1) \\implies \\big(Z_1,\\, \\rho Z_1 + \\sqrt{1 - \\rho^{2}}\\,Z_2\\big) \\sim N_2(0, 0, 1, 1, \\rho)',
    },
  ],
  propiedades: [
    {
      letra: 'L',
      detalle: 'aX + bY \\sim N\\!\\big(a\\mu_X + b\\mu_Y,\\; a^{2}\\sigma_X^{2} + 2ab\\rho\\sigma_X\\sigma_Y + b^{2}\\sigma_Y^{2}\\big)',
    },
  ],
  notas: [
    'La esperanza condicional $E[Y \\mid X = x]$ es exactamente la recta de regresión lineal poblacional de $Y$ sobre $X$, y la varianza condicional $(1 - \\rho^2)\\sigma_Y^2$ es homocedástica (no depende de $x$).',
  ],
  superficie: { param: 'rho', min: -0.85, max: 0.85 },
  calc: {
    densidad: (y, { rho, x0 }) => {
      const m = rho * x0;
      const s = Math.sqrt(1 - rho * rho);
      return fiNormal((y - m) / s) / s;
    },
    rango: ({ rho, x0 }) => {
      const m = rho * x0;
      const s = Math.sqrt(1 - rho * rho);
      return [m - 6 * s, m + 6 * s];
    },
    media: ({ rho, x0 }) => rho * x0,
    varianza: ({ rho }) => 1 - rho * rho,
  },
};
