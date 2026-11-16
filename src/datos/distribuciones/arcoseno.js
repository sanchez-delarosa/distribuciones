/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'arcoseno',
  nombre: 'Arcoseno',
  tipo: 'continua',
  materia: 'procesos-estocasticos',
  notacion: 'X \\sim \\text{Arcoseno}(a, b)',
  descripcion:
    'Distribución en forma de U sobre $(a, b)$ cuya masa se concentra cerca de los extremos. En el caso estándar $(0, 1)$ protagoniza las tres **leyes del arcoseno de Paul Lévy** para el movimiento browniano $(B_t)_{t \\in [0, 1]}$: la fracción de tiempo que $B_t > 0$, el último instante en que $B_t = 0$ y el instante en que $B_t$ alcanza su máximo tienen esta distribución.',
  alias: ['levy arcoseno', 'caminata aleatoria'],
  parametros: [
    { id: 'a', tex: 'a', nombre: 'extremo inferior', restriccion: 'a < b', min: -5, max: 2, paso: 0.5, valor: 0 },
    { id: 'b', tex: 'b', nombre: 'extremo superior', restriccion: 'b > a', min: 0.5, max: 10, paso: 0.5, valor: 1 },
  ],
  soporte: 'x \\in (a, b)',
  formulas: {
    densidad: 'f(x) = \\frac{1}{\\pi\\sqrt{(x - a)(b - x)}}, \\quad a < x < b',
    fda: 'F(x) = \\frac{2}{\\pi}\\,\\arcsin\\!\\left(\\sqrt{\\frac{x - a}{b - a}}\\right), \\quad a \\le x \\le b',
    media: 'E[X] = \\frac{a + b}{2}',
    varianza: '\\operatorname{Var}(X) = \\frac{(b - a)^{2}}{8}',
  },
  extras: [
    {
      etiqueta: 'Leyes del arcoseno de Lévy en [0, 1]',
      tex: '\\int_{0}^{1} \\mathbf{1}_{\\{B_t > 0\\}}\\,dt \\;\\stackrel{d}{=}\\; \\sup\\{t \\in [0, 1] : B_t = 0\\} \\;\\stackrel{d}{=}\\; \\operatorname{arg\\,max}_{t \\in [0, 1]} B_t \\;\\sim\\; \\text{Arcoseno}(0, 1)',
    },
    {
      etiqueta: 'Cuantiles (inversa de F)',
      tex: 'F^{-1}(p) = a + (b - a)\\,\\sin^{2}\\!\\left(\\frac{\\pi}{2}\\,p\\right)',
    },
    {
      etiqueta: 'Momentos en (0, 1)',
      tex: 'E[X^{k}] = \\frac{1}{2^{2k}}\\binom{2k}{k}, \\quad a = 0,\\ b = 1',
    },
  ],
  propiedades: [
    {
      letra: 'L',
      detalle: 'cX + d \\sim \\text{Arcoseno}(ca + d,\\, cb + d), \\quad c > 0',
    },
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{Arcoseno}(ca,\\, cb), \\quad c > 0',
    },
    {
      letra: 'V',
      detalle: 'X = a + (b - a)\\,\\sin^{2}\\!\\left(\\frac{\\pi}{2}\\,U\\right), \\quad U \\sim \\text{Uniforme}(0, 1)',
    },
  ],
  notas: [
    'Resulta contraintuitivo que en un juego justo o movimiento browniano la trayectoria pase la mayor parte del tiempo de un solo lado del origen (cerca de $0$ o de $1$), siendo $1/2$ el valor *menos* verosímil de la densidad.',
    'En $(0, 1)$ coincide exactamente con el caso especial $\\text{Beta}(1/2,\\, 1/2)$.',
  ],
  superficie: { param: 'b', min: 1, max: 6 },
  calc: {
    ajustar: (p) => (p.b <= p.a ? { ...p, b: p.a + 0.5 } : p),
    densidad: (x, { a, b }) => {
      if (x <= a || x >= b) return 0;
      return 1 / (Math.PI * Math.sqrt((x - a) * (b - x)));
    },
    rango: ({ a, b }) => [a, b],
    media: ({ a, b }) => (a + b) / 2,
    varianza: ({ a, b }) => ((b - a) * (b - a)) / 8,
  },
};
