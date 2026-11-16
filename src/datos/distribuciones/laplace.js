/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'laplace',
  nombre: 'Laplace',
  tipo: 'continua',
  materia: 'probabilidad-avanzada',
  notacion: 'X \\sim \\text{Laplace}(\\mu, b)',
  descripcion:
    'Distribución doble exponencial simétrica alrededor de $\\mu$ con parámetro de escala $b > 0$. Surge como la diferencia de dos variables exponenciales independientes idénticamente distribuidas y tiene pico agudo en $\\mu$ y colas más pesadas que la normal.',
  alias: ['doble exponencial', 'laplaciana'],
  parametros: [
    { id: 'mu', tex: '\\mu', nombre: 'localización', restriccion: '\\mu \\in \\mathbb{R}', min: -5, max: 5, paso: 0.25, valor: 0 },
    { id: 'b', tex: 'b', nombre: 'escala', restriccion: 'b > 0', min: 0.25, max: 5, paso: 0.25, valor: 1 },
  ],
  soporte: 'x \\in (-\\infty, \\infty)',
  formulas: {
    densidad: 'f(x) = \\frac{1}{2b}\\,\\exp\\!\\left(-\\frac{|x - \\mu|}{b}\\right)',
    fda: 'F(x) = \\begin{cases} \\frac{1}{2}\\exp\\!\\left(\\frac{x - \\mu}{b}\\right), & x < \\mu \\\\[4pt] 1 - \\frac{1}{2}\\exp\\!\\left(-\\frac{x - \\mu}{b}\\right), & x \\ge \\mu \\end{cases}',
    media: 'E[X] = \\mu',
    varianza: '\\operatorname{Var}(X) = 2b^{2}',
    fgm: 'M_X(t) = \\frac{e^{\\mu t}}{1 - b^{2}t^{2}}, \\quad |t| < \\frac{1}{b}',
  },
  extras: [
    {
      etiqueta: 'Desviación media absoluta',
      tex: 'E\\big[|X - \\mu|\\big] = b',
    },
    {
      etiqueta: 'Cuantiles (inversa de F)',
      tex: 'F^{-1}(p) = \\mu - b\\,\\operatorname{sgn}(p - 0.5)\\,\\ln\\!\\big(1 - 2|p - 0.5|\\big)',
    },
    {
      etiqueta: 'Exceso de curtosis',
      tex: '\\gamma_2 = 3 \\quad (\\text{leptocúrtica})',
    },
  ],
  propiedades: [
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{Laplace}(c\\mu,\\, cb), \\quad c > 0',
    },
    {
      letra: 'V',
      detalle: 'X = F^{-1}(U) = \\mu - b\\,\\operatorname{sgn}(U - 0.5)\\,\\ln(1 - 2|U - 0.5|)',
    },
  ],
  notas: [
    'Si $X_1, X_2 \\sim \\text{Exp}(\\lambda)$ son independientes, entonces $X_1 - X_2 \\sim \\text{Laplace}(0, 1/\\lambda)$ y $|X - \\mu| \\sim \\text{Exp}(1/b)$.',
    'El estimador de máxima verosimilitud del parámetro $\\mu$ en una muestra Laplace es la mediana muestral.',
  ],
  superficie: { param: 'b', min: 0.5, max: 3.5 },
  calc: {
    densidad: (x, { mu, b }) => Math.exp(-Math.abs(x - mu) / b) / (2 * b),
    rango: ({ mu, b }) => [mu - 14 * b, mu + 14 * b],
    media: ({ mu }) => mu,
    varianza: ({ b }) => 2 * b * b,
  },
};
