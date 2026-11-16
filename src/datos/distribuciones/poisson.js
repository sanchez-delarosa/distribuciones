import { lfact, techo } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'poisson',
  nombre: 'Poisson',
  tipo: 'discreta',
  notacion: 'X \\sim \\text{Poisson}(\\lambda)',
  descripcion:
    'Número de eventos que ocurren en un intervalo fijo cuando suceden de forma independiente y a una tasa promedio constante $\\lambda$.',
  parametros: [
    { id: 'lambda', tex: '\\lambda', nombre: 'tasa (número esperado de eventos)', restriccion: '\\lambda > 0', min: 0.1, max: 30, paso: 0.1, valor: 4 },
  ],
  soporte: 'x \\in \\{0, 1, 2, \\dots\\}',
  formulas: {
    densidad: 'P(X = x) = \\frac{e^{-\\lambda} \\lambda^{x}}{x!}',
    fda: 'F(x) = e^{-\\lambda} \\sum_{k=0}^{\\lfloor x \\rfloor} \\frac{\\lambda^{k}}{k!}',
    media: 'E[X] = \\lambda',
    varianza: '\\operatorname{Var}(X) = \\lambda',
    fgm: 'M_X(t) = e^{\\lambda (e^{t} - 1)}',
    fgp: 'P_X(z) = e^{\\lambda (z - 1)}',
  },
  claseAB: { clase: '(a, b, 0)', a: '0', b: '\\lambda', p0: 'e^{-\\lambda}' },
  propiedades: [
    { letra: 'C', detalle: 'X_i \\sim \\text{Poisson}(\\lambda_i) \\Rightarrow \\sum_i X_i \\sim \\text{Poisson}\\Big(\\sum_i \\lambda_i\\Big)' },
  ],
  notas: [
    'La media y la varianza son iguales (equidispersión). Si en los datos la varianza es claramente mayor que la media, la binomial negativa suele ajustar mejor.',
  ],
  superficie: { param: 'lambda', min: 0.5, max: 15 },
  calc: {
    densidad: (x, { lambda }) => Math.exp(-lambda + x * Math.log(lambda) - lfact(x)),
    rango: ({ lambda }) => [0, techo(lambda + 10 * Math.sqrt(lambda) + 15)],
    media: ({ lambda }) => lambda,
    varianza: ({ lambda }) => lambda,
  },
};
