/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'logaritmica',
  nombre: 'Logarítmica',
  tipo: 'discreta',
  materia: 'teoria-del-riesgo',
  notacion: 'X \\sim \\text{Log}(p)',
  descripcion:
    'Distribución discreta en $\\{1, 2, \\dots\\}$ obtenida como el límite en cero de la binomial negativa truncada en cero cuando $r \\to 0$. Es miembro de la clase $(a, b, 1)$ de Panjer y modela el número de reclamaciones por evento en la representación de la binomial negativa como una distribución Poisson compuesta.',
  alias: ['series logaritmicas', 'fisher logaritmica'],
  parametros: [
    { id: 'p', tex: 'p', nombre: 'parámetro de escala/cola', restriccion: 'p \\in (0, 1)', min: 0.1, max: 0.9, paso: 0.05, valor: 0.5 },
  ],
  soporte: 'x \\in \\{1, 2, 3, \\dots\\}',
  formulas: {
    densidad: 'P(X = k) = \\frac{-1}{\\ln(1 - p)}\\,\\frac{p^{k}}{k}, \\quad k = 1, 2, \\dots',
    media: 'E[X] = \\frac{-1}{\\ln(1 - p)}\\,\\frac{p}{1 - p}',
    varianza: '\\operatorname{Var}(X) = \\frac{-p\\,\\big[p + \\ln(1 - p)\\big]}{(1 - p)^{2}\\,\\big[\\ln(1 - p)\\big]^{2}}',
    fgm: 'M_X(t) = \\frac{\\ln(1 - p\\,e^{t})}{\\ln(1 - p)}, \\quad t < -\\ln p',
    fgp: 'G_X(s) = \\frac{\\ln(1 - ps)}{\\ln(1 - p)}, \\quad |s| \\le \\frac{1}{p}',
  },
  claseAB: {
    clase: '(a, b, 1)',
    a: 'p',
    b: '-p',
    p0: '0 \\quad \\Big(p_1 = \\frac{-p}{\\ln(1 - p)}\\Big)',
  },
  extras: [
    {
      etiqueta: 'Teorema de Quenouille (Poisson compuesta)',
      tex: 'N \\sim \\text{Poisson}\\!\\big(-r\\ln(1 - p)\\big),\\; X_i \\perp \\text{Log}(p) \\implies \\sum_{i=1}^{N} X_i \\sim \\text{BN}_F(r,\\, 1 - p)',
    },
  ],
  propiedades: [],
  notas: [
    'Pertenece a la subclase cero-truncada de la familia $(a, b, 1)$ de Panjer con $a = p$ y $b = -p$, por lo que $p_k = p\\left(1 - \\frac{1}{k}\\right)p_{k-1}$ para $k \\ge 2$.',
  ],
  superficie: { param: 'p', min: 0.1, max: 0.85 },
  calc: {
    densidad: (x, { p }) => {
      if (!Number.isInteger(x) || x < 1) return 0;
      return (-Math.pow(p, x)) / (x * Math.log(1 - p));
    },
    rango: ({ p }) => [1, Math.min(2000, Math.ceil(32 / (1 - p)))],
    media: ({ p }) => -p / ((1 - p) * Math.log(1 - p)),
    varianza: ({ p }) => {
      const ln = Math.log(1 - p);
      return (-p * (p + ln)) / ((1 - p) ** 2 * ln * ln);
    },
  },
};
