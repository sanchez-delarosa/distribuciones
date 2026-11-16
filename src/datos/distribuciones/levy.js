/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'levy',
  nombre: 'Lévy',
  tipo: 'continua',
  materia: 'procesos-estocasticos',
  notacion: 'X \\sim \\text{Lévy}(\\mu, c)',
  descripcion:
    'Distribución exacta del **tiempo de primera llegada** $T_a = \\inf\\{t > 0 : B_t = a\\}$ de un movimiento browniano estándar sin deriva al nivel $a \\ne 0$ (con $\\mu = 0$ y $c = a^2$). Tiene cola derecha tan pesada ($f(x) \\propto x^{-3/2}$) que su media y su varianza son infinitas: aunque el movimiento browniano cruza el nivel $a$ con probabilidad $1$, el tiempo esperado para lograrlo es infinito.',
  alias: ['tiempo de primera llegada', 'estable 1/2', 'smirnov'],
  parametros: [
    { id: 'mu', tex: '\\mu', nombre: 'umbral de localización', restriccion: '\\mu \\in \\mathbb{R}', min: 0, max: 5, paso: 0.25, valor: 0 },
    { id: 'c', tex: 'c', nombre: 'escala ($a^2$)', restriccion: 'c > 0', min: 0.25, max: 6, paso: 0.25, valor: 1 },
  ],
  soporte: 'x \\in (\\mu, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\sqrt{\\frac{c}{2\\pi}}\\,\\frac{e^{-\\frac{c}{2(x - \\mu)}}}{(x - \\mu)^{3/2}}, \\quad x > \\mu',
    fda: 'F(x) = \\operatorname{erfc}\\!\\left(\\sqrt{\\frac{c}{2(x - \\mu)}}\\right) = 2\\left[1 - \\Phi\\!\\left(\\sqrt{\\frac{c}{x - \\mu}}\\right)\\right]',
    media: 'E[X] = \\infty',
    varianza: '\\operatorname{Var}(X) = \\infty',
    fgm: '\\text{Transformada de Laplace: } E\\big[e^{-s(X - \\mu)}\\big] = e^{-\\sqrt{2cs}}, \\quad s \\ge 0',
  },
  extras: [
    {
      etiqueta: 'Principio de reflexión del movimiento browniano',
      tex: 'P(T_a \\le t) = P\\!\\Big(\\max_{0 \\le u \\le t} B_u \\ge a\\Big) = 2\\,P(B_t \\ge a) = 2\\left[1 - \\Phi\\!\\left(\\frac{a}{\\sqrt{t}}\\right)\\right]',
    },
    {
      etiqueta: 'Moda y mediana',
      tex: '\\text{Moda}(X) = \\mu + \\frac{c}{3}, \\qquad \\text{Med}(X) = \\mu + \\frac{c}{\\big[\\Phi^{-1}(3/4)\\big]^{2}} \\approx \\mu + 2.198\\,c',
    },
  ],
  propiedades: [
    {
      letra: 'C',
      detalle: 'X_i \\perp \\text{Lévy}(\\mu_i, c_i) \\Rightarrow \\sum_i X_i \\sim \\text{Lévy}\\!\\left(\\sum_i \\mu_i,\\; \\Big(\\sum_i \\sqrt{c_i}\\Big)^{2}\\right)',
    },
    {
      letra: 'S',
      detalle: 'kX \\sim \\text{Lévy}(k\\mu,\\, kc), \\quad k > 0',
    },
  ],
  notas: [
    'Junto con la normal ($\\alpha = 2$) y la Cauchy ($\\alpha = 1$), la distribución de Lévy ($\\alpha = 1/2, \\beta = 1$) es una de las tres únicas distribuciones $\\alpha$-estables cuya densidad tiene forma cerrada elemental.',
    'Si $Z \\sim N(0, 1)$, entonces $\\mu + c / Z^2 \\sim \\text{Lévy}(\\mu, c)$.',
  ],
  superficie: { param: 'c', min: 0.5, max: 4 },
  calc: {
    densidad: (x, { mu, c }) => {
      if (x <= mu) return 0;
      const d = x - mu;
      return Math.sqrt(c / (2 * Math.PI)) * Math.exp(-c / (2 * d)) * Math.pow(d, -1.5);
    },
    rango: ({ mu, c }) => [mu, mu + 5e5 * c],
    rangoGrafica: ({ mu, c }) => [mu, mu + 12 * c],
    media: () => NaN,
    varianza: () => NaN,
  },
};
