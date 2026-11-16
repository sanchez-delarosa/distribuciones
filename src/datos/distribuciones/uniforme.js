/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'uniforme',
  nombre: 'Uniforme continua',
  tipo: 'continua',
  notacion: 'X \\sim \\text{Uniforme}(a, b)',
  descripcion:
    'Asigna la misma densidad a todos los puntos del intervalo $[a, b]$: la probabilidad de caer en un subintervalo solo depende de su longitud.',
  alias: ['uniforme', 'rectangular', 'de moivre', 'ley de de moivre'],
  parametros: [
    { id: 'a', tex: 'a', nombre: 'extremo inferior', restriccion: 'a \\in \\mathbb{R}', min: -5, max: 5, paso: 0.1, valor: 0 },
    { id: 'b', tex: 'b', nombre: 'extremo superior', restriccion: 'b > a', min: -4, max: 10, paso: 0.1, valor: 4 },
  ],
  soporte: 'x \\in [a, b]',
  formulas: {
    densidad: 'f(x) = \\frac{1}{b - a}',
    fda: 'F(x) = \\begin{cases} 0 & x < a \\\\ \\frac{x - a}{b - a} & a \\le x \\le b \\\\ 1 & x > b \\end{cases}',
    supervivencia: 'S(x) = \\frac{b - x}{b - a}, \\quad a \\le x \\le b',
    riesgo: 'h(x) = \\frac{1}{b - x}, \\quad a \\le x < b',
    media: 'E[X] = \\frac{a + b}{2}',
    varianza: '\\operatorname{Var}(X) = \\frac{(b - a)^{2}}{12}',
    fgm: 'M_X(t) = \\begin{cases} \\frac{e^{bt} - e^{at}}{t(b - a)} & t \\ne 0 \\\\ 1 & t = 0 \\end{cases}',
  },
  extras: [
    { etiqueta: 'Valor en riesgo', tex: '\\operatorname{VaR}_{\\alpha}(X) = a + \\alpha(b - a)' },
    { etiqueta: 'TVaR', tex: '\\operatorname{TVaR}_{\\alpha}(X) = a + \\frac{1 + \\alpha}{2}(b - a)' },
    {
      etiqueta: 'Ley de mortalidad de De Moivre (Matemáticas Actuariales)',
      tex: 'T_x \\sim \\text{Uniforme}(0,\\, \\omega - x) \\implies {}_{t}p_x = 1 - \\frac{t}{\\omega - x}, \\quad \\mu_{x+t} = \\frac{1}{\\omega - x - t}, \\quad \\mathring{e}_x = \\frac{\\omega - x}{2}',
    },
  ],
  propiedades: [
    { letra: 'L', detalle: 'cX + d \\sim \\text{Uniforme}(ca + d,\\, cb + d), \\quad c > 0' },
    { letra: 'S', detalle: 'cX \\sim \\text{Uniforme}(ca, cb), \\quad c > 0' },
    { letra: 'R', detalle: 'X \\mid X > d \\sim \\text{Uniforme}(d, b), \\quad a < d < b' },
    { letra: 'V', detalle: 'X = a + (b - a)U, \\quad U \\sim \\text{Uniforme}(0, 1)' },
  ],
  notas: [
    'El caso estándar $\\text{Uniforme}(0, 1)$ es la base de la simulación estocástica: si $X$ tiene FDA continua $F$, entonces $F(X) \\sim \\text{Uniforme}(0, 1)$ y $F^{-1}(U) \\sim F$.',
    '**Matemáticas Actuariales (Ley de De Moivre, 1725):** La **ley de mortalidad de De Moivre** con edad límite $\\omega$ es exactamente la distribución $\\text{Uniforme}(0, \\omega)$ para la edad al fallecer $T_0$. Por su cerradura residual ($R$), el tiempo de vida futuro de una persona de edad $x$, $T_x = T_0 - x \\mid T_0 > x$, también sigue una $\\text{Uniforme}(0, \\omega - x)$, con supervivencia lineal $l_{x+t} = l_0(1 - (x+t)/\\omega)$ y fuerza de mortalidad hiperbólica $\\mu_{x+t} = \\frac{1}{\\omega - x - t}$. Aplicada localmente entre edades enteras $[x, x+1)$, corresponde al supuesto de **distribución uniforme de muertes (DUD / UDD)**: ${}_{t}q_x = t\\,q_x$.',
  ],
  superficie: { param: 'b', min: (p) => p.a + 0.5, max: 10 },
  calc: {
    densidad: (x, { a, b }) => (x >= a && x <= b ? 1 / (b - a) : 0),
    rango: ({ a, b }) => [a, b],
    media: ({ a, b }) => (a + b) / 2,
    varianza: ({ a, b }) => ((b - a) * (b - a)) / 12,
    ajustar: (p) => ({ ...p, b: Math.max(p.b, +(p.a + 0.5).toFixed(2)) }),
  },
};
