import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'poisson-cero-inflada',
  nombre: 'Poisson cero-inflada',
  tipo: 'discreta',
  materia: 'teoria-del-riesgo',
  notacion: 'X \\sim \\text{ZIP}(\\lambda, \\pi_0)',
  descripcion:
    'Representante prototípico de las distribuciones cero-modificadas de la clase $(a, b, 1)$ de Panjer. Modela el número de reclamaciones por póliza cuando existe una proporción estructural $\\pi_0$ de asegurados que no reclaman (por deducibles, sistemas bonus-malus o inmunidad al riesgo) y el resto presenta siniestros $\\text{Poisson}(\\lambda)$.',
  alias: ['zip', 'cero modificada', 'clase a b 1'],
  parametros: [
    { id: 'lambda', tex: '\\lambda', nombre: 'tasa media del grupo activo', restriccion: '\\lambda > 0', min: 0.5, max: 15, paso: 0.5, valor: 4 },
    { id: 'pi0', tex: '\\pi_0', nombre: 'probabilidad estructural de cero', restriccion: '\\pi_0 \\in [0, 1)', min: 0, max: 0.85, paso: 0.05, valor: 0.3 },
  ],
  soporte: 'x \\in \\{0, 1, 2, \\dots\\}',
  formulas: {
    densidad:
      'P(X = k) = \\begin{cases} \\pi_0 + (1 - \\pi_0)e^{-\\lambda}, & k = 0 \\\\[4pt] (1 - \\pi_0)\\,\\dfrac{e^{-\\lambda}\\lambda^{k}}{k!}, & k = 1, 2, \\dots \\end{cases}',
    media: 'E[X] = (1 - \\pi_0)\\lambda',
    varianza: '\\operatorname{Var}(X) = (1 - \\pi_0)\\lambda\\,(1 + \\pi_0\\lambda)',
    fgm: 'M_X(t) = \\pi_0 + (1 - \\pi_0)\\,\\exp\\!\\big(\\lambda(e^{t} - 1)\\big)',
    fgp: 'G_X(s) = \\pi_0 + (1 - \\pi_0)\\,\\exp\\!\\big(\\lambda(s - 1)\\big)',
  },
  claseAB: {
    clase: '(a, b, 1)',
    a: '0',
    b: '\\lambda',
    p0: '\\pi_0 + (1 - \\pi_0)e^{-\\lambda}',
  },
  extras: [
    {
      etiqueta: 'Índice de dispersión (sobredispersión)',
      tex: '\\frac{\\operatorname{Var}(X)}{E[X]} = 1 + \\pi_0\\lambda > 1 \\quad (\\pi_0 > 0)',
    },
    {
      etiqueta: 'Representación como mezcla Bernoulli-Poisson',
      tex: 'I \\sim \\text{Bernoulli}(1 - \\pi_0),\\; N \\sim \\text{Poisson}(\\lambda) \\implies X = I \\cdot N \\sim \\text{ZIP}(\\lambda, \\pi_0)',
    },
  ],
  propiedades: [],
  notas: [
    'Satisface la recursión de Panjer a partir de $k \\ge 2$: $p_k = \\left(a + \\frac{b}{k}\\right)p_{k-1} = \\frac{\\lambda}{k}\\,p_{k-1}$, permitiendo evaluar la distribución agregada de siniestros con la recursión de Panjer para la clase $(a, b, 1)$.',
  ],
  superficie: { param: 'pi0', min: 0, max: 0.8 },
  calc: {
    densidad: (x, { lambda, pi0 }) => {
      if (!Number.isInteger(x) || x < 0) return 0;
      if (x === 0) return pi0 + (1 - pi0) * Math.exp(-lambda);
      return (1 - pi0) * Math.exp(-lambda + x * Math.log(lambda) - lgamma(x + 1));
    },
    rango: ({ lambda }) => [0, Math.ceil(lambda + 10 * Math.sqrt(lambda) + 12)],
    media: ({ lambda, pi0 }) => (1 - pi0) * lambda,
    varianza: ({ lambda, pi0 }) => (1 - pi0) * lambda * (1 + pi0 * lambda),
  },
};
