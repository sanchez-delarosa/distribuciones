/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'uniforme-discreta',
  nombre: 'Uniforme discreta',
  tipo: 'discreta',
  notacion: 'X \\sim \\text{Unif}_{D}(a, b)',
  descripcion:
    'Asigna la misma probabilidad a cada uno de los $b - a + 1$ enteros consecutivos desde $a$ hasta $b$. Modela sorteos equiprobables como el lanzamiento de un dado.',
  alias: ['dado', 'equiprobable'],
  parametros: [
    { id: 'a', tex: 'a', nombre: 'entero mínimo', restriccion: 'a \\in \\mathbb{Z}', min: -5, max: 10, paso: 1, valor: 1 },
    { id: 'b', tex: 'b', nombre: 'entero máximo', restriccion: 'b \\in \\mathbb{Z},\\ b \\ge a', min: -4, max: 20, paso: 1, valor: 6 },
  ],
  soporte: 'x \\in \\{a, a + 1, \\dots, b\\}',
  formulas: {
    densidad: 'P(X = x) = \\frac{1}{b - a + 1}',
    fda: 'F(x) = \\frac{\\lfloor x \\rfloor - a + 1}{b - a + 1}, \\quad a \\le x \\le b',
    media: 'E[X] = \\frac{a + b}{2}',
    varianza: '\\operatorname{Var}(X) = \\frac{(b - a + 1)^{2} - 1}{12}',
    fgm: 'M_X(t) = \\frac{e^{at}\\big(1 - e^{(b - a + 1)t}\\big)}{(b - a + 1)(1 - e^{t})}, \\quad t \\ne 0',
    fgp: 'P_X(z) = \\frac{z^{a}\\big(1 - z^{b - a + 1}\\big)}{(b - a + 1)(1 - z)}, \\quad z \\ne 1',
  },
  propiedades: [
    { letra: 'R', detalle: 'X \\mid X > k \\sim \\text{Unif}_{D}(k + 1,\\, b), \\quad a \\le k < b' },
    { letra: 'V', detalle: 'X = a + \\lfloor (b - a + 1)U \\rfloor, \\quad U \\sim \\text{Uniforme}(0, 1)' },
  ],
  notas: [
    'Para el caso particular $x \\in \\{1, 2, \\dots, n\\}$, la media es $\\frac{n+1}{2}$ y la varianza es $\\frac{n^2 - 1}{12}$.',
  ],
  superficie: { param: 'b', min: (p) => p.a + 1, max: 16 },
  calc: {
    densidad: (x, { a, b }) => (x >= a && x <= b && Number.isInteger(x) ? 1 / (b - a + 1) : 0),
    rango: ({ a, b }) => [a, b],
    media: ({ a, b }) => (a + b) / 2,
    varianza: ({ a, b }) => ((b - a + 1) * (b - a + 1) - 1) / 12,
    ajustar: (p) => ({ ...p, b: Math.max(p.b, p.a + 1) }),
  },
};
