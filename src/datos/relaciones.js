// Relaciones entre distribuciones.
// Cada entrada es una flecha `de` → `a`. Puede haber varias flechas entre el mismo
// par si son de tipos distintos; si se repite el tipo, hay que darles un `id` propio.

/** @type {import('./tipos.js').Relacion[]} */
export const RELACIONES = [
  // ── Bernoulli y binomial ─────────────────────────────────────────────
  {
    de: 'binomial', a: 'bernoulli', tipo: 'caso-especial',
    condicion: 'n = 1',
    explicacion: 'Una binomial con un solo ensayo es una Bernoulli: $\\text{Bin}(1, p) = \\text{Bernoulli}(p)$.',
  },
  {
    de: 'bernoulli', a: 'binomial', tipo: 'suma',
    condicion: '\\sum_{i=1}^{n} X_i',
    explicacion:
      'Si $X_1, \\dots, X_n$ son independientes y $X_i \\sim \\text{Bernoulli}(p)$, entonces $\\sum_{i=1}^{n} X_i \\sim \\text{Bin}(n, p)$. La suma cuenta los éxitos de los $n$ ensayos.',
  },
  {
    de: 'hipergeometrica', a: 'bernoulli', tipo: 'caso-especial',
    condicion: 'n = 1',
    explicacion: 'Extraer un solo elemento de la población es un ensayo Bernoulli: $\\text{Hiper}(N, K, 1) = \\text{Bernoulli}(K/N)$.',
  },

  // ── Binomial, Poisson e hipergeométrica ─────────────────────────────
  {
    de: 'binomial', a: 'poisson', tipo: 'limite',
    condicion: 'n \\to \\infty,\\ np \\to \\lambda',
    explicacion:
      'Si $n \\to \\infty$ y $p \\to 0$ de modo que $np \\to \\lambda$, entonces $\\text{Bin}(n, p)$ converge a $\\text{Poisson}(\\lambda)$. Es la ley de los eventos raros. Una regla práctica común: la aproximación es buena si $n \\ge 20$ y $p \\le 0.05$.',
  },
  {
    de: 'binomial', a: 'poisson', tipo: 'mezcla',
    condicion: 'n \\sim \\text{Poisson}(\\lambda)',
    explicacion:
      'Si $N \\sim \\text{Poisson}(\\lambda)$ y, dado $N = n$, $X \\sim \\text{Bin}(n, p)$, entonces $X \\sim \\text{Poisson}(\\lambda p)$. Se llama adelgazamiento (*thinning*) de la Poisson: si cada siniestro se reporta con probabilidad $p$, el número de siniestros reportados también es Poisson.',
  },
  {
    de: 'poisson', a: 'binomial', tipo: 'condicional',
    condicion: 'X_1 \\mid X_1 + X_2 = n',
    explicacion:
      'Si $X_1 \\sim \\text{Poisson}(\\lambda_1)$ y $X_2 \\sim \\text{Poisson}(\\lambda_2)$ son independientes, entonces $X_1 \\mid X_1 + X_2 = n \\sim \\text{Bin}\\left(n, \\frac{\\lambda_1}{\\lambda_1 + \\lambda_2}\\right)$.',
  },
  {
    de: 'hipergeometrica', a: 'binomial', tipo: 'limite',
    condicion: 'N \\to \\infty,\\ K/N \\to p',
    explicacion:
      'Si el tamaño de la población $N$ crece con $K/N \\to p$ y $n$ fijo, muestrear sin reemplazo se parece cada vez más a muestrear con reemplazo, y $\\text{Hiper}(N, K, n)$ converge a $\\text{Bin}(n, p)$. Una regla práctica común: la aproximación es buena si $n/N \\le 0.05$.',
  },
  {
    de: 'binomial', a: 'hipergeometrica', tipo: 'condicional',
    condicion: 'X_1 \\mid X_1 + X_2 = m',
    explicacion:
      'Si $X_1 \\sim \\text{Bin}(n_1, p)$ y $X_2 \\sim \\text{Bin}(n_2, p)$ son independientes, entonces $X_1 \\mid X_1 + X_2 = m$ es hipergeométrica con $N = n_1 + n_2$, $K = n_1$ y tamaño de muestra $m$. El resultado no depende de $p$.',
  },

  // ── Aproximaciones normales ─────────────────────────────────────────
  {
    de: 'binomial', a: 'normal', tipo: 'limite',
    condicion: 'n \\to \\infty',
    explicacion:
      'Teorema de De Moivre-Laplace, caso particular del teorema del límite central: $\\frac{X - np}{\\sqrt{np(1-p)}}$ converge a $N(0, 1)$, así que para $n$ grande $X \\approx N\\big(np,\\ np(1-p)\\big)$. Regla práctica: $np \\ge 5$ y $n(1-p) \\ge 5$. Conviene usar la corrección por continuidad: $P(X \\le k) \\approx \\Phi\\left(\\frac{k + 0.5 - np}{\\sqrt{np(1-p)}}\\right)$.',
  },
  {
    de: 'poisson', a: 'normal', tipo: 'limite',
    condicion: '\\lambda \\to \\infty',
    explicacion:
      'Si $\\lambda \\to \\infty$, $\\frac{X - \\lambda}{\\sqrt{\\lambda}}$ converge a $N(0, 1)$; es decir, $X \\approx N(\\lambda, \\lambda)$ para $\\lambda$ grande. También aquí conviene la corrección por continuidad.',
  },
  {
    de: 'binomial-negativa-fracasos', a: 'normal', tipo: 'limite',
    condicion: 'r \\to \\infty',
    explicacion:
      'Para $r$ grande, $X \\approx N\\left(\\frac{r(1-p)}{p},\\ \\frac{r(1-p)}{p^2}\\right)$. Con $r$ entero se sigue del teorema del límite central, porque $X$ es suma de $r$ geométricas independientes.',
  },

  // ── Binomial negativa y Poisson ─────────────────────────────────────
  {
    de: 'binomial-negativa-fracasos', a: 'poisson', tipo: 'limite',
    condicion: 'r \\to \\infty,\\ \\tfrac{r(1-p)}{p} \\to \\lambda',
    explicacion:
      'Si $r \\to \\infty$ y $p \\to 1$ de modo que la media $r(1-p)/p \\to \\lambda$, entonces $\\text{BN}_F(r, p)$ converge a $\\text{Poisson}(\\lambda)$. La varianza $r(1-p)/p^2$ también tiende a $\\lambda$: la sobredispersión desaparece.',
  },

  // ── Geométricas y binomiales negativas ──────────────────────────────
  {
    de: 'geometrica-fracasos', a: 'binomial-negativa-fracasos', tipo: 'suma',
    condicion: '\\sum_{i=1}^{r} X_i',
    explicacion:
      'Si $X_1, \\dots, X_r$ son independientes y $X_i \\sim \\text{Geo}_F(p)$, entonces $\\sum_{i=1}^{r} X_i \\sim \\text{BN}_F(r, p)$: los fracasos antes del $r$-ésimo éxito son la suma de los fracasos que hay antes de cada éxito.',
  },
  {
    de: 'binomial-negativa-fracasos', a: 'geometrica-fracasos', tipo: 'caso-especial',
    condicion: 'r = 1',
    explicacion: 'Con un solo éxito, $\\text{BN}_F(1, p) = \\text{Geo}_F(p)$.',
  },
  {
    de: 'geometrica-ensayos', a: 'binomial-negativa-ensayos', tipo: 'suma',
    condicion: '\\sum_{i=1}^{r} Y_i',
    explicacion:
      'Si $Y_1, \\dots, Y_r$ son independientes y $Y_i \\sim \\text{Geo}_E(p)$, entonces $\\sum_{i=1}^{r} Y_i \\sim \\text{BN}_E(r, p)$: los ensayos hasta el $r$-ésimo éxito son la suma de los ensayos entre éxitos consecutivos.',
  },
  {
    de: 'binomial-negativa-ensayos', a: 'geometrica-ensayos', tipo: 'caso-especial',
    condicion: 'r = 1',
    explicacion: 'Con un solo éxito, $\\text{BN}_E(1, p) = \\text{Geo}_E(p)$.',
  },

  // ── Cambio de parametrización: fracasos ↔ ensayos ───────────────────
  {
    de: 'geometrica-fracasos', a: 'geometrica-ensayos', tipo: 'transformacion',
    condicion: 'X + 1',
    explicacion:
      'Si $X \\sim \\text{Geo}_F(p)$, entonces $Y = X + 1 \\sim \\text{Geo}_E(p)$: los ensayos son los fracasos más el ensayo del éxito.',
  },
  {
    de: 'geometrica-ensayos', a: 'geometrica-fracasos', tipo: 'transformacion',
    condicion: 'Y - 1',
    explicacion: 'Si $Y \\sim \\text{Geo}_E(p)$, entonces $X = Y - 1 \\sim \\text{Geo}_F(p)$.',
  },
  {
    de: 'geometrica-fracasos', a: 'geometrica-ensayos', tipo: 'truncamiento',
    condicion: 'X \\mid X \\ge 1',
    explicacion:
      'La geométrica de fracasos truncada en cero es la de ensayos: $P(X = k \\mid X \\ge 1) = \\frac{p(1-p)^k}{1-p} = p(1-p)^{k-1}$ para $k \\ge 1$. Es un ejemplo de la falta de memoria y explica por qué $\\text{Geo}_E$ pertenece a la clase $(a, b, 1)$.',
  },
  {
    de: 'binomial-negativa-fracasos', a: 'binomial-negativa-ensayos', tipo: 'transformacion',
    condicion: 'X + r',
    explicacion:
      'Si $X \\sim \\text{BN}_F(r, p)$ con $r$ entero, entonces $Y = X + r \\sim \\text{BN}_E(r, p)$: los ensayos son los fracasos más los $r$ éxitos.',
  },
  {
    de: 'binomial-negativa-ensayos', a: 'binomial-negativa-fracasos', tipo: 'transformacion',
    condicion: 'Y - r',
    explicacion: 'Si $Y \\sim \\text{BN}_E(r, p)$, entonces $X = Y - r \\sim \\text{BN}_F(r, p)$.',
  },

  // ── Construcción a partir de ensayos Bernoulli ──────────────────────
  {
    de: 'bernoulli', a: 'geometrica-ensayos', tipo: 'construccion',
    condicion: '\\min\\{n : X_n = 1\\}',
    explicacion:
      'Si $X_1, X_2, \\dots$ son independientes y $X_i \\sim \\text{Bernoulli}(p)$, el número de ensayos hasta el primer éxito, $\\min\\{n : X_n = 1\\}$, sigue una $\\text{Geo}_E(p)$.',
  },
  {
    de: 'bernoulli', a: 'binomial-negativa-ensayos', tipo: 'construccion',
    condicion: '\\min\\{n : \\textstyle\\sum_{i \\le n} X_i = r\\}',
    explicacion:
      'Si $X_1, X_2, \\dots$ son independientes y $X_i \\sim \\text{Bernoulli}(p)$, el número de ensayos hasta acumular $r$ éxitos, $\\min\\{n : \\sum_{i \\le n} X_i = r\\}$, sigue una $\\text{BN}_E(r, p)$.',
  },

  // ── Normal y normal estándar ────────────────────────────────────────
  {
    de: 'normal', a: 'normal-estandar', tipo: 'transformacion',
    condicion: '\\frac{X - \\mu}{\\sigma}',
    explicacion:
      'Estandarización: si $X \\sim N(\\mu, \\sigma^2)$, entonces $Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)$. Así se calcula $P(X \\le x) = \\Phi\\left(\\frac{x - \\mu}{\\sigma}\\right)$ con la tabla de la normal estándar.',
  },
  {
    de: 'normal-estandar', a: 'normal', tipo: 'transformacion',
    condicion: '\\mu + \\sigma Z',
    explicacion: 'Si $Z \\sim N(0, 1)$, entonces $X = \\mu + \\sigma Z \\sim N(\\mu, \\sigma^2)$. Así se simulan normales a partir de normales estándar.',
  },
  {
    de: 'normal', a: 'normal-estandar', tipo: 'caso-especial',
    condicion: '\\mu = 0,\\ \\sigma^2 = 1',
    explicacion: 'La normal estándar es la normal con $\\mu = 0$ y $\\sigma^2 = 1$.',
  },

  // ── Exponencial, Gamma y Uniforme ───────────────────────────────────
  {
    de: 'gamma', a: 'exponencial', tipo: 'caso-especial',
    condicion: '\\alpha = 1',
    explicacion: 'Una distribución Gamma con parámetro de forma $\\alpha = 1$ es una exponencial: $\\text{Gamma}(1, \\lambda) = \\text{Exp}(\\lambda)$.',
  },
  {
    de: 'exponencial', a: 'gamma', tipo: 'suma',
    condicion: '\\sum_{i=1}^{\\alpha} X_i',
    explicacion:
      'Si $X_1, \\dots, X_\\alpha$ son independientes y $X_i \\sim \\text{Exp}(\\lambda)$, entonces $\\sum_{i=1}^{\\alpha} X_i \\sim \\text{Gamma}(\\alpha, \\lambda)$. Con $\\alpha$ entero se conoce como distribución de Erlang.',
  },
  {
    de: 'uniforme', a: 'exponencial', tipo: 'transformacion',
    condicion: '-\\frac{\\ln U}{\\lambda}\\ (a{=}0, b{=}1)',
    explicacion:
      'Método de la transformada inversa: si $U \\sim \\text{Uniforme}(0, 1)$, entonces $X = -\\frac{1}{\\lambda}\\ln U \\sim \\text{Exp}(\\lambda)$.',
  },
  {
    de: 'exponencial', a: 'uniforme', tipo: 'transformacion',
    condicion: 'e^{-\\lambda X}',
    explicacion:
      'Transformación integral de probabilidad: si $X \\sim \\text{Exp}(\\lambda)$, entonces $U = e^{-\\lambda X} = S(X)$ y $1 - e^{-\\lambda X} = F(X)$ siguen una $\\text{Uniforme}(0, 1)$.',
  },
  {
    de: 'geometrica-fracasos', a: 'exponencial', tipo: 'limite',
    condicion: 'p = \\lambda\\Delta t \\to 0',
    explicacion:
      'Si realizamos ensayos cada $\\Delta t$ unidades de tiempo con probabilidad de éxito $p = \\lambda\\Delta t$ y hacemos $\\Delta t \\to 0$, el tiempo de espera $\\Delta t \\cdot X$ converge en distribución a $\\text{Exp}(\\lambda)$.',
  },
  {
    de: 'exponencial', a: 'geometrica-fracasos', tipo: 'transformacion',
    condicion: '\\lfloor X \\rfloor',
    explicacion:
      'Si $X \\sim \\text{Exp}(\\lambda)$, su parte entera $\\lfloor X \\rfloor$ sigue una $\\text{Geo}_F(p)$ con $p = 1 - e^{-\\lambda}$.',
  },
  {
    de: 'binomial-negativa-fracasos', a: 'gamma', tipo: 'limite',
    condicion: 'p = \\lambda\\Delta t \\to 0',
    explicacion:
      'Análogo continuo: si cada ensayo dura $\\Delta t \\to 0$ con probabilidad de éxito $p = \\lambda\\Delta t$, el tiempo $\\Delta t \\cdot X$ hasta acumular $r = \\alpha$ éxitos converge en distribución a $\\text{Gamma}(\\alpha, \\lambda)$.',
  },
  {
    de: 'exponencial', a: 'poisson', tipo: 'construccion',
    condicion: 'N(t) = \\max\\{n : \\textstyle\\sum_{i \\le n} X_i \\le t\\}',
    explicacion:
      'En un proceso de Poisson homogéneo de tasa $\\lambda$, los tiempos entre eventos consecutivos son independientes $\\text{Exp}(\\lambda)$ y el número de eventos en un intervalo de longitud $1$ sigue una $\\text{Poisson}(\\lambda)$.',
  },
  {
    de: 'poisson', a: 'gamma', tipo: 'construccion',
    condicion: 'P(T_\\alpha \\le x) = P(N(x) \\ge \\alpha)',
    explicacion:
      'Dualidad entre conteo y tiempo de espera en un proceso de Poisson de tasa $\\lambda$: el tiempo $T_\\alpha$ hasta el $\\alpha$-ésimo evento ($\\alpha \\in \\mathbb{N}$) es a lo más $x$ si y solo si en $[0, x]$ ocurrieron al menos $\\alpha$ eventos, por lo que $T_\\alpha \\sim \\text{Gamma}(\\alpha, \\lambda)$.',
  },
  {
    de: 'poisson', a: 'binomial-negativa-fracasos', tipo: 'mezcla',
    condicion: '\\lambda \\sim \\text{Gamma}\\big(r,\\, \\tfrac{p}{1-p}\\big)',
    explicacion:
      'Mezcla Poisson-Gamma: si $X \\mid \\Lambda \\sim \\text{Poisson}(\\Lambda)$ y la tasa heterogénea sigue $\\Lambda \\sim \\text{Gamma}(\\alpha, \\beta)$, entonces la distribución marginal de $X$ es $\\text{BN}_F\\left(\\alpha, \\frac{\\beta}{\\beta + 1}\\right)$. Es el modelo clásico de credibilidad para carteras con riesgo heterogéneo.',
  },
  {
    de: 'gamma', a: 'normal', tipo: 'limite',
    condicion: '\\alpha \\to \\infty',
    explicacion:
      'Por el teorema del límite central (al ser suma de exponenciales independientes), cuando $\\alpha \\to \\infty$, $\\frac{X - \\alpha/\\lambda}{\\sqrt{\\alpha}/\\lambda} \\Rightarrow N(0, 1)$, es decir, $\\text{Gamma}(\\alpha, \\lambda) \\approx N(\\alpha/\\lambda,\\ \\alpha/\\lambda^2)$.',
  },
  {
    de: 'poisson', a: 'uniforme', tipo: 'condicional',
    condicion: 'T_1 \\mid N(b) - N(a) = 1',
    explicacion:
      'En un proceso de Poisson homogéneo, condicionado a que ocurrió exactamente $1$ evento en el intervalo $[a, b]$, el instante en que ocurrió ese evento se distribuye $\\text{Uniforme}(a, b)$.',
  },

  // ── Chi-cuadrada ────────────────────────────────────────────────────
  {
    de: 'normal-estandar', a: 'chi-cuadrada', tipo: 'transformacion',
    condicion: 'Z^{2}',
    explicacion:
      'El cuadrado de una normal estándar sigue una chi-cuadrada con $1$ grado de libertad: si $Z \\sim N(0, 1)$, entonces $Z^2 \\sim \\chi^2(1)$.',
  },
  {
    de: 'normal-estandar', a: 'chi-cuadrada', tipo: 'suma',
    condicion: '\\sum_{i=1}^{\\nu} Z_i^{2}',
    explicacion:
      'Si $Z_1, \\dots, Z_\\nu$ son independientes con $Z_i \\sim N(0, 1)$, la suma de sus cuadrados sigue $\\sum_{i=1}^{\\nu} Z_i^2 \\sim \\chi^2(\\nu)$.',
  },
  {
    de: 'normal', a: 'chi-cuadrada', tipo: 'transformacion',
    condicion: '\\sum_{i=1}^{\\nu} \\left(\\frac{X_i - \\mu}{\\sigma}\\right)^{2}',
    explicacion:
      'Si $X_1, \\dots, X_\\nu$ son independientes con $X_i \\sim N(\\mu, \\sigma^2)$, entonces $\\sum_{i=1}^{\\nu} \\left(\\frac{X_i - \\mu}{\\sigma}\\right)^2 \\sim \\chi^2(\\nu)$. Si se sustituye $\\mu$ por $\\bar{X}$, se pierde un grado de libertad: $\\frac{(\\nu - 1)S^2}{\\sigma^2} \\sim \\chi^2(\\nu - 1)$.',
  },
  {
    de: 'gamma', a: 'chi-cuadrada', tipo: 'caso-especial',
    condicion: '\\alpha = \\nu/2,\\ \\lambda = 1/2',
    explicacion:
      'La distribución $\\chi^2(\\nu)$ es el caso particular de $\\text{Gamma}(\\alpha, \\lambda)$ con parámetro de forma $\\alpha = \\nu/2$ y tasa $\\lambda = 1/2$.',
  },
  {
    de: 'chi-cuadrada', a: 'gamma', tipo: 'transformacion',
    condicion: '\\frac{X}{2\\lambda}',
    explicacion:
      'Por la propiedad de escalamiento de la Gamma, si $X \\sim \\chi^2(\\nu) = \\text{Gamma}(\\nu/2, 1/2)$, entonces $\\frac{X}{2\\lambda} \\sim \\text{Gamma}(\\nu/2, \\lambda)$.',
  },
  {
    de: 'chi-cuadrada', a: 'exponencial', tipo: 'caso-especial',
    condicion: '\\nu = 2',
    explicacion:
      'Con $\\nu = 2$ grados de libertad, $\\chi^2(2) = \\text{Gamma}(1, 1/2) = \\text{Exp}(1/2)$.',
  },
  {
    de: 'exponencial', a: 'chi-cuadrada', tipo: 'transformacion',
    condicion: '2\\lambda X',
    explicacion:
      'Si $X \\sim \\text{Exp}(\\lambda)$, entonces $2\\lambda X \\sim \\chi^2(2)$. Al sumar $k$ variables independientes de esta forma, $2\\lambda \\sum_{i=1}^{k} X_i \\sim \\chi^2(2k)$.',
  },
  {
    de: 'chi-cuadrada', a: 'normal', tipo: 'limite',
    condicion: '\\nu \\to \\infty',
    explicacion:
      'Por el teorema del límite central, cuando $\\nu \\to \\infty$, $\\frac{X - \\nu}{\\sqrt{2\\nu}} \\Rightarrow N(0, 1)$, es decir, $\\chi^2(\\nu) \\approx N(\\nu, 2\\nu)$.',
  },
  {
    de: 'uniforme', a: 'chi-cuadrada', tipo: 'transformacion',
    condicion: '-2\\sum_{i=1}^{k} \\ln U_i',
    explicacion:
      'Si $U_1, \\dots, U_k$ son independientes con $U_i \\sim \\text{Uniforme}(0, 1)$, entonces $-2\\ln U_i \\sim \\chi^2(2)$ y por convolución $-2\\sum_{i=1}^{k} \\ln U_i \\sim \\chi^2(2k)$ (método de Fisher).',
  },

  // ── Uniforme discreta ───────────────────────────────────────────────
  {
    de: 'uniforme-discreta', a: 'bernoulli', tipo: 'caso-especial',
    condicion: 'a = 0,\\ b = 1',
    explicacion:
      'Una uniforme discreta en $\\{0, 1\\}$ es una Bernoulli simétrica: $\\text{Unif}_D(0, 1) = \\text{Bernoulli}(1/2)$.',
  },
  {
    de: 'uniforme', a: 'uniforme-discreta', tipo: 'transformacion',
    condicion: 'a + \\lfloor(b - a + 1)U\\rfloor',
    explicacion:
      'Si $U \\sim \\text{Uniforme}(0, 1)$, entonces $X = a + \\lfloor(b - a + 1)U\\rfloor \\sim \\text{Unif}_D(a, b)$. Así se simulan enteros equiprobables.',
  },
  {
    de: 'uniforme-discreta', a: 'uniforme', tipo: 'limite',
    condicion: 'b \\to \\infty,\\ X/b',
    explicacion:
      'Si $X \\sim \\text{Unif}_D(1, b)$, entonces $X/b$ converge en distribución a $\\text{Uniforme}(0, 1)$ cuando $b \\to \\infty$.',
  },
  {
    de: 'geometrica-fracasos', a: 'uniforme-discreta', tipo: 'condicional',
    condicion: 'X_1 \\mid X_1 + X_2 = n',
    explicacion:
      'Si $X_1, X_2 \\sim \\text{Geo}_F(p)$ son independientes, la distribución de $X_1$ condicionada a que la suma $X_1 + X_2 = n$ es uniforme discreta en $\\{0, 1, \\dots, n\\}$ (no depende de $p$).',
  },

  // ── Weibull ─────────────────────────────────────────────────────────
  {
    de: 'weibull', a: 'exponencial', tipo: 'caso-especial',
    condicion: '\\tau = 1',
    explicacion:
      'Con parámetro de forma $\\tau = 1$, la tasa de riesgo es constante y $\\text{Weibull}(1, \\lambda) = \\text{Exp}(\\lambda)$.',
  },
  {
    de: 'exponencial', a: 'weibull', tipo: 'transformacion',
    condicion: '\\frac{X^{1/\\tau}}{\\lambda}\\ (\\lambda_0{=}1)',
    explicacion:
      'Si $X \\sim \\text{Exp}(1)$, entonces $Y = \\frac{X^{1/\\tau}}{\\lambda} \\sim \\text{Weibull}(\\tau, \\lambda)$.',
  },
  {
    de: 'weibull', a: 'exponencial', tipo: 'transformacion',
    condicion: '(\\lambda X)^{\\tau}',
    explicacion:
      'Transformación de potencia: si $X \\sim \\text{Weibull}(\\tau, \\lambda)$, entonces $(\\lambda X)^\\tau \\sim \\text{Exp}(1)$ y $\\lambda^\\tau X^\\tau \\sim \\text{Exp}(1)$.',
  },
  {
    de: 'uniforme', a: 'weibull', tipo: 'transformacion',
    condicion: '\\frac{(-\\ln U)^{1/\\tau}}{\\lambda}',
    explicacion:
      'Método de la transformada inversa: si $U \\sim \\text{Uniforme}(0, 1)$, entonces $X = \\frac{(-\\ln U)^{1/\\tau}}{\\lambda} \\sim \\text{Weibull}(\\tau, \\lambda)$.',
  },

  // ── Lognormal ───────────────────────────────────────────────────────
  {
    de: 'normal', a: 'lognormal', tipo: 'transformacion',
    condicion: 'e^{X}',
    explicacion:
      'Si $X \\sim N(\\mu, \\sigma^2)$, entonces $Y = e^X \\sim \\text{Lognormal}(\\mu, \\sigma^2)$.',
  },
  {
    de: 'lognormal', a: 'normal', tipo: 'transformacion',
    condicion: '\\ln X',
    explicacion:
      'Por definición, si $X \\sim \\text{Lognormal}(\\mu, \\sigma^2)$, su logaritmo natural sigue $\\ln X \\sim N(\\mu, \\sigma^2)$.',
  },
  {
    de: 'normal-estandar', a: 'lognormal', tipo: 'transformacion',
    condicion: 'e^{\\mu + \\sigma Z}',
    explicacion:
      'Si $Z \\sim N(0, 1)$, entonces $X = e^{\\mu + \\sigma Z} \\sim \\text{Lognormal}(\\mu, \\sigma^2)$.',
  },
  {
    de: 'lognormal', a: 'normal-estandar', tipo: 'transformacion',
    condicion: '\\frac{\\ln X - \\mu}{\\sigma}',
    explicacion:
      'Estandarización logarítmica: si $X \\sim \\text{Lognormal}(\\mu, \\sigma^2)$, entonces $\\frac{\\ln X - \\mu}{\\sigma} \\sim N(0, 1)$.',
  },

  // ── Pareto I y Pareto II (Lomax) ────────────────────────────────────
  {
    de: 'pareto-1', a: 'pareto-2', tipo: 'transformacion',
    condicion: 'X - \\theta',
    explicacion:
      'Si $X \\sim \\text{Pareto}_I(\\alpha, \\theta)$, al restar el umbral mínimo se traslada el soporte a $[0, \\infty)$ y se obtiene $Y = X - \\theta \\sim \\text{Pareto}_{II}(\\alpha, \\theta)$.',
  },
  {
    de: 'pareto-2', a: 'pareto-1', tipo: 'transformacion',
    condicion: 'X + \\theta',
    explicacion:
      'Si $X \\sim \\text{Pareto}_{II}(\\alpha, \\theta)$, entonces $Y = X + \\theta \\sim \\text{Pareto}_I(\\alpha, \\theta)$.',
  },
  {
    de: 'exponencial', a: 'pareto-1', tipo: 'transformacion',
    condicion: '\\theta\\,e^{X}\\ (\\lambda{=}\\alpha)',
    explicacion:
      'Si $X \\sim \\text{Exp}(\\alpha)$, entonces $Y = \\theta\\,e^{X} \\sim \\text{Pareto}_I(\\alpha, \\theta)$.',
  },
  {
    de: 'pareto-1', a: 'exponencial', tipo: 'transformacion',
    condicion: '\\ln(X / \\theta)',
    explicacion:
      'Si $X \\sim \\text{Pareto}_I(\\alpha, \\theta)$, el logaritmo del cociente sobre el umbral sigue una exponencial: $\\ln(X/\\theta) \\sim \\text{Exp}(\\alpha)$.',
  },
  {
    de: 'exponencial', a: 'pareto-2', tipo: 'mezcla',
    condicion: '\\lambda \\sim \\text{Gamma}(\\alpha, \\theta)',
    explicacion:
      'Mezcla Exponencial-Gamma: si $X \\mid \\Lambda \\sim \\text{Exp}(\\Lambda)$ y la tasa sigue $\\Lambda \\sim \\text{Gamma}(\\alpha, \\theta)$, la distribución marginal de $X$ es $\\text{Pareto}_{II}(\\alpha, \\theta)$. Es el análogo continuo de la mezcla Poisson-Gamma que produce la binomial negativa.',
  },
  {
    de: 'pareto-2', a: 'exponencial', tipo: 'limite',
    condicion: '\\alpha, \\theta \\to \\infty,\\ \\alpha/\\theta \\to \\lambda',
    explicacion:
      'Si $\\alpha \\to \\infty$ y $\\theta \\to \\infty$ con $\\alpha/\\theta \\to \\lambda$, la supervivencia $\\big(1 + \\frac{x}{\\theta}\\big)^{-\\alpha} \\to e^{-\\lambda x}$ y $\\text{Pareto}_{II}(\\alpha, \\theta)$ converge en distribución a $\\text{Exp}(\\lambda)$.',
  },
  {
    de: 'uniforme', a: 'pareto-1', tipo: 'transformacion',
    condicion: '\\theta\\,U^{-1/\\alpha}',
    explicacion:
      'Método de la transformada inversa: si $U \\sim \\text{Uniforme}(0, 1)$, entonces $X = \\theta\\,U^{-1/\\alpha} \\sim \\text{Pareto}_I(\\alpha, \\theta)$.',
  },
  {
    de: 'uniforme', a: 'pareto-2', tipo: 'transformacion',
    condicion: '\\theta\\,(U^{-1/\\alpha} - 1)',
    explicacion:
      'Método de la transformada inversa: si $U \\sim \\text{Uniforme}(0, 1)$, entonces $X = \\theta\\,(U^{-1/\\alpha} - 1) \\sim \\text{Pareto}_{II}(\\alpha, \\theta)$.',
  },

  // ── Beta ────────────────────────────────────────────────────────────
  {
    de: 'beta', a: 'uniforme', tipo: 'caso-especial',
    condicion: '\\alpha = 1,\\ \\beta = 1',
    explicacion:
      'Con $\\alpha = 1$ y $\\beta = 1$, la densidad es constante en $(0, 1)$ y $\\text{Beta}(1, 1) = \\text{Uniforme}(0, 1)$.',
  },
  {
    de: 'uniforme', a: 'beta', tipo: 'construccion',
    condicion: 'U_{(k)}\\ (a{=}0, b{=}1)',
    explicacion:
      'Si $U_1, \\dots, U_n$ son independientes con $U_i \\sim \\text{Uniforme}(0, 1)$, el $k$-ésimo estadístico de orden sigue $U_{(k)} \\sim \\text{Beta}(k,\\, n - k + 1)$. En particular, $\\min_i U_i \\sim \\text{Beta}(1, n)$ y $\\max_i U_i \\sim \\text{Beta}(n, 1)$.',
  },
  {
    de: 'uniforme', a: 'beta', tipo: 'transformacion',
    condicion: 'U^{1/\\alpha}\\ (\\beta{=}1)',
    explicacion:
      'Si $U \\sim \\text{Uniforme}(0, 1)$, entonces $U^{1/\\alpha} \\sim \\text{Beta}(\\alpha, 1)$ y $1 - U^{1/\\beta} \\sim \\text{Beta}(1, \\beta)$.',
  },
  {
    de: 'beta', a: 'exponencial', tipo: 'transformacion',
    condicion: '-\\ln X\\ (\\beta{=}1)',
    explicacion:
      'Si $X \\sim \\text{Beta}(\\alpha, 1)$, entonces $-\\ln X \\sim \\text{Exp}(\\alpha)$. De forma simétrica, si $X \\sim \\text{Beta}(1, \\beta)$, entonces $-\\ln(1 - X) \\sim \\text{Exp}(\\beta)$.',
  },
  {
    de: 'gamma', a: 'beta', tipo: 'transformacion',
    condicion: '\\frac{X_1}{X_1 + X_2}',
    explicacion:
      'Si $X_1 \\sim \\text{Gamma}(\\alpha, \\lambda)$ y $X_2 \\sim \\text{Gamma}(\\beta, \\lambda)$ son independientes con la misma tasa $\\lambda$, la proporción $Y = \\frac{X_1}{X_1 + X_2} \\sim \\text{Beta}(\\alpha, \\beta)$ y es independiente de la suma $X_1 + X_2 \\sim \\text{Gamma}(\\alpha + \\beta, \\lambda)$.',
  },
  {
    de: 'chi-cuadrada', a: 'beta', tipo: 'transformacion',
    condicion: '\\frac{X_1}{X_1 + X_2}',
    explicacion:
      'Si $X_1 \\sim \\chi^2(\\nu_1)$ y $X_2 \\sim \\chi^2(\\nu_2)$ son independientes, entonces $\\frac{X_1}{X_1 + X_2} \\sim \\text{Beta}\\left(\\frac{\\nu_1}{2},\\, \\frac{\\nu_2}{2}\\right)$.',
  },
  {
    de: 'beta', a: 'gamma', tipo: 'limite',
    condicion: '\\beta \\to \\infty,\\ \\beta X',
    explicacion:
      'Si $X \\sim \\text{Beta}(\\alpha, \\beta)$ y $\\beta \\to \\infty$, la variable reescalada $\\beta X$ converge en distribución a $\\text{Gamma}(\\alpha, 1)$.',
  },
  {
    de: 'beta', a: 'normal', tipo: 'limite',
    condicion: '\\alpha, \\beta \\to \\infty',
    explicacion:
      'Cuando $\\alpha \\to \\infty$ y $\\beta \\to \\infty$ con $\\frac{\\alpha}{\\alpha + \\beta} \\to p \\in (0, 1)$, la distribución $\\text{Beta}(\\alpha, \\beta)$ se aproxima a $N(\\mu, \\sigma^2)$ con $\\mu = \\frac{\\alpha}{\\alpha + \\beta}$ y $\\sigma^2 = \\frac{\\alpha\\beta}{(\\alpha+\\beta)^2(\\alpha+\\beta+1)}$.',
  },
  {
    de: 'beta', a: 'pareto-2', tipo: 'transformacion',
    condicion: '\\theta\\,\\frac{X}{1 - X}\\ (\\alpha{=}1)',
    explicacion:
      'Si $X \\sim \\text{Beta}(1, \\alpha)$, la razón de momios escalada $Y = \\theta\\,\\frac{X}{1 - X}$ sigue una $\\text{Pareto}_{II}(\\alpha, \\theta)$ (en general, si $X \\sim \\text{Beta}(\\alpha, \\beta)$, $\\frac{X}{1-X}$ sigue una distribución Beta prima).',
  },
  {
    de: 'pareto-2', a: 'beta', tipo: 'transformacion',
    condicion: '\\frac{X}{X + \\theta}',
    explicacion:
      'Si $X \\sim \\text{Pareto}_{II}(\\alpha, \\theta)$, entonces $\\frac{X}{X + \\theta} \\sim \\text{Beta}(1, \\alpha)$ y $\\frac{\\theta}{X + \\theta} \\sim \\text{Beta}(\\alpha, 1)$.',
  },
  {
    de: 'binomial', a: 'beta', tipo: 'construccion',
    condicion: 'P(X \\ge k) = P(Y \\le p)',
    explicacion:
      'Dualidad entre la suma binomial y la integral beta incompleta: si $X \\sim \\text{Bin}(n, p)$ y $Y \\sim \\text{Beta}(k,\\, n - k + 1)$, entonces $P(X \\ge k) = I_p(k, n - k + 1) = P(Y \\le p)$ porque ambas expresan el evento $\\{U_{(k)} \\le p\\}$ en $n$ variables $\\text{Uniforme}(0, 1)$.',
  },

  // ── Multinomial (Probabilidad Avanzada) ─────────────────────────────
  {
    de: 'multinomial', a: 'binomial', tipo: 'caso-especial',
    condicion: 'k = 2\\ \\text{o marginal } X_i',
    explicacion:
      'Con $k = 2$ categorías ($p_1 = p, p_2 = 1 - p$), la multinomial se reduce a la binomial. Además, toda componente marginal $X_i$ de un vector $\\mathbf{X} \\sim \\text{Mult}(n, \\mathbf{p})$ sigue $X_i \\sim \\text{Bin}(n, p_i)$.',
  },
  {
    de: 'multinomial', a: 'binomial', tipo: 'condicional',
    condicion: 'X_i \\mid X_j = x_j',
    explicacion:
      'Si $\\mathbf{X} \\sim \\text{Mult}(n, \\mathbf{p})$, la distribución de $X_i$ condicionada a que en la categoría $j$ ocurrieron $x_j$ resultados es $\\text{Bin}\\!\\left(n - x_j,\\; \\frac{p_i}{1 - p_j}\\right)$.',
  },
  {
    de: 'poisson', a: 'multinomial', tipo: 'condicional',
    condicion: '(X_1,\\dots,X_k) \\mid \\textstyle\\sum X_i = n',
    explicacion:
      'Si $X_1, \\dots, X_k$ son independientes con $X_i \\sim \\text{Poisson}(\\lambda_i)$, entonces condicionado al total $\\sum_{i=1}^k X_i = n$, el vector sigue $\\text{Mult}(n;\\, p_1, \\dots, p_k)$ con $p_i = \\frac{\\lambda_i}{\\sum_{j=1}^k \\lambda_j}$.',
  },
  {
    de: 'multinomial', a: 'chi-cuadrada', tipo: 'limite',
    condicion: 'n \\to \\infty,\\ \\sum_{i=1}^k \\frac{(X_i - np_i)^2}{np_i}',
    explicacion:
      'Teorema de Pearson: si $\\mathbf{X} \\sim \\text{Mult}(n, \\mathbf{p})$, cuando $n \\to \\infty$ el estadístico de bondad de ajuste $Q = \\sum_{i=1}^k \\frac{(X_i - np_i)^2}{np_i}$ converge en distribución a $\\chi^2(k - 1)$.',
  },

  // ── t de Student (Probabilidad Avanzada) ────────────────────────────
  {
    de: 'normal-estandar', a: 't-student', tipo: 'construccion',
    condicion: '\\frac{Z}{\\sqrt{V / \\nu}}',
    explicacion:
      'Si $Z \\sim N(0, 1)$ y $V \\sim \\chi^2(\\nu)$ son independientes, el cociente $T = \\frac{Z}{\\sqrt{V/\\nu}}$ sigue una distribución $t(\\nu)$. En muestreo normal, $\\frac{\\bar{X} - \\mu}{S / \\sqrt{n}} \\sim t(n - 1)$ por el teorema de Cochran.',
  },
  {
    de: 'chi-cuadrada', a: 't-student', tipo: 'construccion',
    condicion: '\\frac{Z}{\\sqrt{V / \\nu}}',
    explicacion:
      'La variable $V \\sim \\chi^2(\\nu)$ en el denominador aporta la estimación de la varianza con $\\nu$ grados de libertad: $T = \\frac{Z}{\\sqrt{V/\\nu}} \\sim t(\\nu)$.',
  },
  {
    de: 't-student', a: 'normal-estandar', tipo: 'limite',
    condicion: '\\nu \\to \\infty',
    explicacion:
      'Cuando $\\nu \\to \\infty$, por la ley de los grandes números $V/\\nu \\xrightarrow{P} 1$ y la distribución $t(\\nu)$ converge en distribución a $N(0, 1)$.',
  },
  {
    de: 'normal', a: 't-student', tipo: 'mezcla',
    condicion: '\\sigma^2 \\sim \\text{Gamma}^{-1}(\\nu/2, \\nu/2)',
    explicacion:
      'Representación como mezcla de escala normal: si $X \\mid \\Sigma^2 \\sim N(0, \\Sigma^2)$ y la precisión sigue $1/\\Sigma^2 \\sim \\text{Gamma}(\\nu/2, \\nu/2)$, entonces la distribución marginal de $X$ es $t(\\nu)$.',
  },
  {
    de: 't-student', a: 'f-fisher', tipo: 'transformacion',
    condicion: 'T^{2}',
    explicacion:
      'Si $T \\sim t(\\nu)$, su cuadrado es el cociente $\\frac{Z^2 / 1}{V / \\nu}$ de dos chi-cuadrada independientes divididas entre sus grados de libertad, por lo que $T^2 \\sim F(1, \\nu)$.',
  },
  {
    de: 't-student', a: 'beta', tipo: 'transformacion',
    condicion: '\\frac{\\nu}{\\nu + T^{2}}',
    explicacion:
      'Si $T \\sim t(\\nu)$, entonces $\\frac{\\nu}{\\nu + T^2} \\sim \\text{Beta}\\!\\left(\\frac{\\nu}{2},\\, \\frac{1}{2}\\right)$.',
  },

  // ── F de Fisher (Probabilidad Avanzada) ─────────────────────────────
  {
    de: 'chi-cuadrada', a: 'f-fisher', tipo: 'transformacion',
    condicion: '\\frac{U_1 / \\nu_1}{U_2 / \\nu_2}',
    explicacion:
      'Si $U_1 \\sim \\chi^2(\\nu_1)$ y $U_2 \\sim \\chi^2(\\nu_2)$ son independientes, el cociente escalado $X = \\frac{U_1/\\nu_1}{U_2/\\nu_2}$ sigue una distribución $F(\\nu_1, \\nu_2)$.',
  },
  {
    de: 'f-fisher', a: 'chi-cuadrada', tipo: 'limite',
    condicion: '\\nu_2 \\to \\infty,\\ \\nu_1 X',
    explicacion:
      'Si $X \\sim F(\\nu_1, \\nu_2)$ y $\\nu_2 \\to \\infty$, el denominador $U_2/\\nu_2 \\xrightarrow{P} 1$, por lo que $\\nu_1 X$ converge en distribución a $\\chi^2(\\nu_1)$.',
  },
  {
    de: 'f-fisher', a: 'beta', tipo: 'transformacion',
    condicion: '\\frac{(\\nu_1/\\nu_2)X}{1 + (\\nu_1/\\nu_2)X}',
    explicacion:
      'Si $X \\sim F(\\nu_1, \\nu_2)$, entonces $Y = \\frac{(\\nu_1/\\nu_2)X}{1 + (\\nu_1/\\nu_2)X} \\sim \\text{Beta}\\!\\left(\\frac{\\nu_1}{2},\\, \\frac{\\nu_2}{2}\\right)$.',
  },
  {
    de: 'beta', a: 'f-fisher', tipo: 'transformacion',
    condicion: '\\frac{\\nu_2}{\\nu_1}\\,\\frac{X}{1 - X}',
    explicacion:
      'Si $X \\sim \\text{Beta}\\!\\left(\\frac{\\nu_1}{2},\\, \\frac{\\nu_2}{2}\\right)$, entonces $Y = \\frac{\\nu_2}{\\nu_1}\\,\\frac{X}{1 - X} \\sim F(\\nu_1, \\nu_2)$.',
  },
  {
    de: 'gamma', a: 'f-fisher', tipo: 'transformacion',
    condicion: '\\frac{\\alpha_2 X_1}{\\alpha_1 X_2}',
    explicacion:
      'Si $X_1 \\sim \\text{Gamma}(\\alpha_1, \\lambda)$ y $X_2 \\sim \\text{Gamma}(\\alpha_2, \\lambda)$ son independientes, entonces $\\frac{\\alpha_2 X_1}{\\alpha_1 X_2} \\sim F(2\\alpha_1, 2\\alpha_2)$.',
  },
  {
    de: 'exponencial', a: 'f-fisher', tipo: 'transformacion',
    condicion: 'X_1 / X_2',
    explicacion:
      'Si $X_1, X_2 \\sim \\text{Exp}(\\lambda)$ son independientes, su cociente $X_1 / X_2$ sigue una $F(2, 2)$.',
  },
  {
    de: 'f-fisher', a: 'pareto-2', tipo: 'caso-especial',
    condicion: '\\nu_1 = 2\\ (\\alpha{=}\\theta{=}\\nu_2/2)',
    explicacion:
      'Con $\\nu_1 = 2$ grados de libertad en el numerador, $F(2, \\nu_2)$ tiene densidad $\\left(1 + \\frac{2}{\\nu_2}x\\right)^{-(\\nu_2/2 + 1)}$, que es una $\\text{Pareto}_{II}(\\nu_2/2,\\, \\nu_2/2)$. Más en general, $\\frac{\\theta}{\\alpha} F(2, 2\\alpha) \\sim \\text{Pareto}_{II}(\\alpha, \\theta)$.',
  },

  // ── Cauchy, Laplace, Logística, Dirichlet, Normal bivariada y Beta prima ──
  {
    de: 't-student', a: 'cauchy', tipo: 'caso-especial',
    condicion: '\\nu = 1',
    explicacion:
      'Con $\\nu = 1$ grado de libertad, la distribución $t(1)$ coincide con la distribución $\\text{Cauchy}(0, 1)$ estándar.',
  },
  {
    de: 'normal-estandar', a: 'cauchy', tipo: 'transformacion',
    condicion: 'Z_1 / Z_2',
    explicacion:
      'Si $Z_1, Z_2 \\sim N(0, 1)$ son independientes, su cociente $Z_1 / Z_2$ sigue una distribución $\\text{Cauchy}(0, 1)$.',
  },
  {
    de: 'uniforme', a: 'cauchy', tipo: 'transformacion',
    condicion: 'x_0 + \\gamma\\tan\\!\\big(\\pi(U - \\tfrac{1}{2})\\big)',
    explicacion:
      'Método de la transformada inversa: si $U \\sim \\text{Uniforme}(0, 1)$, entonces $X = x_0 + \\gamma\\tan\\!\\big(\\pi(U - 1/2)\\big) \\sim \\text{Cauchy}(x_0, \\gamma)$.',
  },
  {
    de: 'exponencial', a: 'laplace', tipo: 'transformacion',
    condicion: 'X_1 - X_2',
    explicacion:
      'Si $X_1, X_2 \\sim \\text{Exp}(\\lambda)$ son independientes, su diferencia $X_1 - X_2$ sigue una distribución $\\text{Laplace}(0, 1/\\lambda)$.',
  },
  {
    de: 'laplace', a: 'exponencial', tipo: 'transformacion',
    condicion: '|X - \\mu|',
    explicacion:
      'Si $X \\sim \\text{Laplace}(\\mu, b)$, la desviación absoluta $|X - \\mu|$ sigue una distribución $\\text{Exp}(1/b)$.',
  },
  {
    de: 'normal', a: 'laplace', tipo: 'mezcla',
    condicion: '\\sigma^2 \\sim \\text{Exp}\\!\\big(\\tfrac{1}{2b^2}\\big)',
    explicacion:
      'Mezcla Normal-Exponencial: si $X \\mid V \\sim N(\\mu, V)$ y la varianza aleatoria sigue $V \\sim \\text{Exp}\\!\\big(\\frac{1}{2b^2}\\big)$, la marginal de $X$ es $\\text{Laplace}(\\mu, b)$.',
  },
  {
    de: 'uniforme', a: 'logistica', tipo: 'transformacion',
    condicion: '\\mu + s\\ln\\!\\left(\\frac{U}{1 - U}\\right)',
    explicacion:
      'Transformación *logit*: si $U \\sim \\text{Uniforme}(0, 1)$, entonces $X = \\mu + s\\ln\\!\\left(\\frac{U}{1 - U}\\right) \\sim \\text{Logística}(\\mu, s)$.',
  },
  {
    de: 'logistica', a: 'uniforme', tipo: 'transformacion',
    condicion: '\\frac{1}{1 + e^{-(X - \\mu)/s}}',
    explicacion:
      'Transformación integral de probabilidad: al evaluar la función sigmoide en $X \\sim \\text{Logística}(\\mu, s)$ se obtiene $\\text{Uniforme}(0, 1)$.',
  },
  {
    de: 'exponencial', a: 'logistica', tipo: 'transformacion',
    condicion: '-\\ln(X_1 / X_2)',
    explicacion:
      'Si $X_1, X_2 \\sim \\text{Exp}(\\lambda)$ son independientes, el logaritmo de su cociente sigue $-\\ln(X_1 / X_2) \\sim \\text{Logística}(0, 1)$.',
  },
  {
    de: 'pareto-2', a: 'logistica', tipo: 'transformacion',
    condicion: '\\ln(X / \\theta)\\ (\\alpha{=}1)',
    explicacion:
      'Si $X \\sim \\text{Pareto}_{II}(1, \\theta)$, entonces $\\ln(X / \\theta) \\sim \\text{Logística}(0, 1)$.',
  },
  {
    de: 'dirichlet', a: 'beta', tipo: 'caso-especial',
    condicion: 'k = 2\\ \\text{o marginal } X_i',
    explicacion:
      'Con $k = 2$, $\\text{Dir}(\\alpha_1, \\alpha_2)$ se reduce a $\\text{Beta}(\\alpha_1, \\alpha_2)$. Además, cada componente marginal de $\\mathbf{X} \\sim \\text{Dir}(\\alpha_1, \\dots, \\alpha_k)$ sigue $X_i \\sim \\text{Beta}(\\alpha_i, \\alpha_0 - \\alpha_i)$.',
  },
  {
    de: 'gamma', a: 'dirichlet', tipo: 'transformacion',
    condicion: 'Y_i \\big/ \\textstyle\\sum_{j=1}^k Y_j',
    explicacion:
      'Si $Y_1, \\dots, Y_k$ son independientes con $Y_i \\sim \\text{Gamma}(\\alpha_i, \\lambda)$, el vector de proporciones $(Y_1/S, \\dots, Y_k/S)$ con $S = \\sum_{j=1}^k Y_j$ sigue $\\text{Dir}(\\alpha_1, \\dots, \\alpha_k)$ y es independiente de $S$.',
  },
  {
    de: 'normal-bivariada', a: 'normal', tipo: 'caso-especial',
    condicion: 'X,\\ Y\\ \\text{o } aX + bY',
    explicacion:
      'Si $(X, Y) \\sim N_2(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})$, tanto las marginales $X \\sim N(\\mu_X, \\sigma_X^2)$ y $Y \\sim N(\\mu_Y, \\sigma_Y^2)$ como toda combinación lineal $aX + bY$ son normales.',
  },
  {
    de: 'normal-bivariada', a: 'normal', tipo: 'condicional',
    condicion: 'Y \\mid X = x',
    explicacion:
      'En una normal bivariada, la distribución condicional es normal: $Y \\mid X = x \\sim N\\!\\left(\\mu_Y + \\rho\\frac{\\sigma_Y}{\\sigma_X}(x - \\mu_X),\\; (1 - \\rho^2)\\sigma_Y^2\\right)$.',
  },
  {
    de: 'normal-estandar', a: 'normal-bivariada', tipo: 'construccion',
    condicion: '(Z_1,\\, \\rho Z_1 + \\sqrt{1-\\rho^2}\\,Z_2)',
    explicacion:
      'Factorización de Cholesky: a partir de $Z_1, Z_2 \\perp N(0, 1)$ se construye $(X, Y)$ con correlación $\\rho$ haciendo $X = \\mu_X + \\sigma_X Z_1$ y $Y = \\mu_Y + \\sigma_Y(\\rho Z_1 + \\sqrt{1 - \\rho^2}\\,Z_2)$.',
  },
  {
    de: 'normal-bivariada', a: 'chi-cuadrada', tipo: 'transformacion',
    condicion: '\\frac{z_X^2 - 2\\rho z_X z_Y + z_Y^2}{1 - \\rho^2}',
    explicacion:
      'La distancia de Mahalanobis al cuadrado $(\\mathbf{X} - \\boldsymbol{\\mu})^\\top \\boldsymbol{\\Sigma}^{-1}(\\mathbf{X} - \\boldsymbol{\\mu})$ de una normal bivariada sigue una distribución $\\chi^2(2)$.',
  },
  {
    de: 'beta', a: 'beta-prima', tipo: 'transformacion',
    condicion: '\\frac{X}{1 - X}',
    explicacion:
      'Si $X \\sim \\text{Beta}(\\alpha, \\beta)$, la razón de momios $Y = \\frac{X}{1 - X}$ sigue una distribución $\\text{Beta}^{\\prime}(\\alpha, \\beta)$ en $(0, \\infty)$.',
  },
  {
    de: 'beta-prima', a: 'beta', tipo: 'transformacion',
    condicion: '\\frac{X}{1 + X}',
    explicacion:
      'Si $X \\sim \\text{Beta}^{\\prime}(\\alpha, \\beta)$, entonces $\\frac{X}{1 + X} \\sim \\text{Beta}(\\alpha, \\beta)$.',
  },
  {
    de: 'gamma', a: 'beta-prima', tipo: 'transformacion',
    condicion: 'X_1 / X_2',
    explicacion:
      'Si $X_1 \\sim \\text{Gamma}(\\alpha, \\lambda)$ y $X_2 \\sim \\text{Gamma}(\\beta, \\lambda)$ son independientes con la misma escala, su cociente $X_1 / X_2$ sigue $\\text{Beta}^{\\prime}(\\alpha, \\beta)$.',
  },
  {
    de: 'beta-prima', a: 'f-fisher', tipo: 'transformacion',
    condicion: '\\frac{\\beta}{\\alpha}\\,X',
    explicacion:
      'Si $X \\sim \\text{Beta}^{\\prime}(\\alpha, \\beta)$, al escalar por $\\beta/\\alpha$ se obtiene $\\frac{\\beta}{\\alpha}X \\sim F(2\\alpha, 2\\beta)$.',
  },
  {
    de: 'f-fisher', a: 'beta-prima', tipo: 'transformacion',
    condicion: '\\frac{\\nu_1}{\\nu_2}\\,X',
    explicacion:
      'Si $X \\sim F(\\nu_1, \\nu_2)$, entonces $\\frac{\\nu_1}{\\nu_2}X \\sim \\text{Beta}^{\\prime}(\\nu_1/2,\\, \\nu_2/2)$.',
  },
  {
    de: 'beta-prima', a: 'pareto-2', tipo: 'caso-especial',
    condicion: '\\alpha = 1\\ (\\theta{=}1)',
    explicacion:
      'Con $\\alpha = 1$, $\\text{Beta}^{\\prime}(1, \\beta)$ coincide con $\\text{Pareto}_{II}(\\beta, 1)$.',
  },

  // ── Inferencia Estadística: no centrales, hipergeométrica negativa y potencia ──
  {
    de: 'chi-cuadrada-no-central', a: 'chi-cuadrada', tipo: 'caso-especial',
    condicion: '\\delta = 0',
    explicacion:
      'Cuando el parámetro de no centralidad es $\\delta = 0$, la distribución $\\chi^2(\\nu, 0)$ coincide con la $\\chi^2(\\nu)$ central.',
  },
  {
    de: 'normal', a: 'chi-cuadrada-no-central', tipo: 'suma',
    condicion: '\\sum_{i=1}^{\\nu} (X_i / \\sigma)^{2}',
    explicacion:
      'Si $X_1, \\dots, X_\\nu$ son independientes con $X_i \\sim N(\\mu_i, \\sigma^2)$, entonces $\\sum_{i=1}^\\nu (X_i/\\sigma)^2 \\sim \\chi^2(\\nu, \\delta)$ con $\\delta = \\sum_{i=1}^\\nu (\\mu_i/\\sigma)^2$.',
  },
  {
    de: 'chi-cuadrada', a: 'chi-cuadrada-no-central', tipo: 'mezcla',
    condicion: '\\nu + 2K,\\ K \\sim \\text{Poisson}(\\delta/2)',
    explicacion:
      'Si $K \\sim \\text{Poisson}(\\delta/2)$ y $X \\mid K = k \\sim \\chi^2(\\nu + 2k)$, la distribución marginal de $X$ es $\\chi^2(\\nu, \\delta)$.',
  },
  {
    de: 'chi-cuadrada-no-central', a: 'normal', tipo: 'limite',
    condicion: '\\nu \\to \\infty\\ \\text{o } \\delta \\to \\infty',
    explicacion:
      'Cuando $\\nu \\to \\infty$ o $\\delta \\to \\infty$, la variable estandarizada $\\frac{X - (\\nu + \\delta)}{\\sqrt{2(\\nu + 2\\delta)}}$ converge en distribución a $N(0, 1)$.',
  },
  {
    de: 't-no-central', a: 't-student', tipo: 'caso-especial',
    condicion: '\\delta = 0',
    explicacion:
      'Bajo la hipótesis nula ($\\delta = 0$), la distribución $t(\\nu, 0)$ se reduce a la $t(\\nu)$ de Student central.',
  },
  {
    de: 'normal', a: 't-no-central', tipo: 'construccion',
    condicion: '\\frac{X}{\\sqrt{V / \\nu}}\\ (X \\sim N(\\delta, 1))',
    explicacion:
      'Si $X \\sim N(\\delta, 1)$ y $V \\sim \\chi^2(\\nu)$ son independientes, el cociente $\\frac{X}{\\sqrt{V/\\nu}}$ sigue una distribución $t(\\nu, \\delta)$.',
  },
  {
    de: 'chi-cuadrada', a: 't-no-central', tipo: 'construccion',
    condicion: '\\frac{Z + \\delta}{\\sqrt{V / \\nu}}',
    explicacion:
      'La variable $V \\sim \\chi^2(\\nu)$ independiente de $Z \\sim N(0, 1)$ forma el denominador de $T = \\frac{Z + \\delta}{\\sqrt{V/\\nu}} \\sim t(\\nu, \\delta)$.',
  },
  {
    de: 't-no-central', a: 'f-no-central', tipo: 'transformacion',
    condicion: 'X^{2}',
    explicacion:
      'Si $X \\sim t(\\nu, \\delta)$, su cuadrado sigue una distribución $F$ no central con $1$ y $\\nu$ grados de libertad y parámetro de no centralidad $\\delta^2$: $X^2 \\sim F(1, \\nu, \\delta^2)$.',
  },
  {
    de: 't-no-central', a: 'normal', tipo: 'limite',
    condicion: '\\nu \\to \\infty',
    explicacion:
      'Cuando $\\nu \\to \\infty$, el denominador $\\sqrt{V/\\nu} \\xrightarrow{P} 1$ y $t(\\nu, \\delta)$ converge en distribución a $N(\\delta, 1)$.',
  },
  {
    de: 'f-no-central', a: 'f-fisher', tipo: 'caso-especial',
    condicion: '\\delta = 0',
    explicacion:
      'Bajo la hipótesis nula ($\\delta = 0$), la distribución $F(\\nu_1, \\nu_2, 0)$ coincide con la $F(\\nu_1, \\nu_2)$ de Fisher central.',
  },
  {
    de: 'chi-cuadrada-no-central', a: 'f-no-central', tipo: 'transformacion',
    condicion: '\\frac{U_1 / \\nu_1}{U_2 / \\nu_2}',
    explicacion:
      'Si $U_1 \\sim \\chi^2(\\nu_1, \\delta)$ y $U_2 \\sim \\chi^2(\\nu_2)$ son independientes, el cociente $\\frac{U_1/\\nu_1}{U_2/\\nu_2}$ sigue una distribución $F(\\nu_1, \\nu_2, \\delta)$.',
  },
  {
    de: 'f-no-central', a: 'chi-cuadrada-no-central', tipo: 'limite',
    condicion: '\\nu_2 \\to \\infty,\\ \\nu_1 X',
    explicacion:
      'Si $X \\sim F(\\nu_1, \\nu_2, \\delta)$ y $\\nu_2 \\to \\infty$, entonces $\\nu_1 X$ converge en distribución a $\\chi^2(\\nu_1, \\delta)$.',
  },
  {
    de: 'hipergeometrica-negativa', a: 'binomial-negativa-fracasos', tipo: 'limite',
    condicion: 'N, K \\to \\infty,\\ K/N \\to p',
    explicacion:
      'Cuando el tamaño poblacional $N \\to \\infty$ con proporción de éxitos $K/N \\to p$, el muestreo inverso sin reemplazo converge a $\\text{BN}_F(r, p)$.',
  },
  {
    de: 'hipergeometrica-negativa', a: 'uniforme-discreta', tipo: 'caso-especial',
    condicion: 'r = 1,\\ K = 1',
    explicacion:
      'Si sólo hay $K = 1$ éxito en la población de tamaño $N$, el número de fracasos antes de encontrarlo es equiprobable en $\\{0, 1, \\dots, N - 1\\}$.',
  },
  {
    de: 'uniforme', a: 'potencia', tipo: 'construccion',
    condicion: '\\max_{1 \\le i \\le n} X_i\\ (a{=}0, b{=}\\theta)',
    explicacion:
      'Si $X_1, \\dots, X_n$ son independientes con $X_i \\sim \\text{Uniforme}(0, \\theta)$, el máximo muestral (estadístico suficiente para $\\theta$) sigue $X_{(n)} \\sim \\text{Pot}(n, \\theta)$.',
  },
  {
    de: 'potencia', a: 'uniforme', tipo: 'caso-especial',
    condicion: '\\alpha = 1',
    explicacion:
      'Con $\\alpha = 1$, la densidad es constante en $(0, \\theta)$ y $\\text{Pot}(1, \\theta) = \\text{Uniforme}(0, \\theta)$.',
  },
  {
    de: 'potencia', a: 'beta', tipo: 'caso-especial',
    condicion: '\\theta = 1',
    explicacion:
      'Con cota superior unitaria $\\theta = 1$, $\\text{Pot}(\\alpha, 1) = \\text{Beta}(\\alpha, 1)$.',
  },
  {
    de: 'potencia', a: 'pareto-1', tipo: 'transformacion',
    condicion: '\\theta^{2} / X',
    explicacion:
      'Si $X \\sim \\text{Pot}(\\alpha, \\theta)$ en $(0, \\theta)$, entonces $1/X \\sim \\text{Pareto}_I(\\alpha, 1/\\theta)$ y $\\theta^2 / X \\sim \\text{Pareto}_I(\\alpha, \\theta)$.',
  },
  {
    de: 'pareto-1', a: 'potencia', tipo: 'transformacion',
    condicion: '\\theta^{2} / X',
    explicacion:
      'Si $X \\sim \\text{Pareto}_I(\\alpha, \\theta)$ en $[\\theta, \\infty)$, entonces $\\theta^2 / X \\sim \\text{Pot}(\\alpha, \\theta)$ en $(0, \\theta]$.',
  },
  {
    de: 'potencia', a: 'exponencial', tipo: 'transformacion',
    condicion: '-\\ln(X / \\theta)',
    explicacion:
      'Si $X \\sim \\text{Pot}(\\alpha, \\theta)$, entonces $-\\ln(X/\\theta) \\sim \\text{Exp}(\\alpha)$.',
  },

  // ── Teoría del Riesgo / Modelos Actuariales ─────────────────────────
  {
    de: 'burr', a: 'pareto-2', tipo: 'caso-especial',
    condicion: '\\gamma = 1',
    explicacion:
      'Con $\\gamma = 1$, la distribución $\\text{Burr}(\\alpha, 1, \\theta)$ coincide con la $\\text{Pareto}_{II}(\\alpha, \\theta)$ (Lomax).',
  },
  {
    de: 'burr', a: 'log-logistica', tipo: 'caso-especial',
    condicion: '\\alpha = 1',
    explicacion:
      'Con $\\alpha = 1$, la distribución $\\text{Burr}(1, \\gamma, \\theta)$ se reduce a la distribución $\\text{LogLog}(\\gamma, \\theta)$ de Fisk.',
  },
  {
    de: 'pareto-2', a: 'burr', tipo: 'transformacion',
    condicion: '\\theta\\,(X / \\theta)^{1/\\gamma}',
    explicacion:
      'Si $X \\sim \\text{Pareto}_{II}(\\alpha, \\theta)$, al aplicar una transformación de potencia se obtiene $Y = \\theta\\,(X/\\theta)^{1/\\gamma} \\sim \\text{Burr}(\\alpha, \\gamma, \\theta)$.',
  },
  {
    de: 'burr', a: 'pareto-2', tipo: 'transformacion',
    condicion: '(X / \\theta)^{\\gamma}',
    explicacion:
      'Si $X \\sim \\text{Burr}(\\alpha, \\gamma, \\theta)$, entonces $(X/\\theta)^\\gamma \\sim \\text{Pareto}_{II}(\\alpha, 1)$.',
  },
  {
    de: 'weibull', a: 'burr', tipo: 'mezcla',
    condicion: '\\lambda^{\\tau} \\sim \\text{Gamma}(\\alpha, \\theta^{\\tau})',
    explicacion:
      'Mezcla Weibull-Gamma: si $X \\mid \\Lambda \\sim \\text{Weibull}(\\gamma, \\Lambda)$ donde $\\Lambda^{\\gamma} \\sim \\text{Gamma}(\\alpha, \\theta^{\\gamma})$, la distribución marginal de la severidad es $\\text{Burr}(\\alpha, \\gamma, \\theta)$.',
  },
  {
    de: 'burr', a: 'weibull', tipo: 'limite',
    condicion: '\\alpha \\to \\infty,\\ \\theta = \\alpha^{1/\\gamma}/\\lambda',
    explicacion:
      'Cuando $\\alpha \\to \\infty$ reescalando $\\theta = \\alpha^{1/\\gamma}/\\lambda$, la supervivencia $\\big(1 + (\\lambda x)^\\gamma / \\alpha\\big)^{-\\alpha} \\to e^{-(\\lambda x)^\\gamma}$ y $\\text{Burr}(\\alpha, \\gamma, \\theta) \\xrightarrow{d} \\text{Weibull}(\\gamma, \\lambda)$.',
  },
  {
    de: 'logistica', a: 'log-logistica', tipo: 'transformacion',
    condicion: 'e^{X}',
    explicacion:
      'Si $X \\sim \\text{Logística}(\\mu, s)$, su exponencial sigue $Y = e^X \\sim \\text{LogLog}(1/s,\\, e^\\mu)$.',
  },
  {
    de: 'log-logistica', a: 'logistica', tipo: 'transformacion',
    condicion: '\\ln X',
    explicacion:
      'Por definición, si $X \\sim \\text{LogLog}(\\gamma, \\theta)$, entonces $\\ln X \\sim \\text{Logística}(\\ln\\theta,\\, 1/\\gamma)$.',
  },
  {
    de: 'pareto-2', a: 'log-logistica', tipo: 'transformacion',
    condicion: '\\theta\\,(X / \\theta)^{1/\\gamma}\\ (\\alpha{=}1)',
    explicacion:
      'Si $X \\sim \\text{Pareto}_{II}(1, \\theta)$, entonces $\\theta\\,(X/\\theta)^{1/\\gamma} \\sim \\text{LogLog}(\\gamma, \\theta)$.',
  },
  {
    de: 'gamma', a: 'gamma-inversa', tipo: 'transformacion',
    condicion: '1 / X',
    explicacion:
      'Si $X \\sim \\text{Gamma}(\\alpha, \\theta)$, su recíproca $Y = 1 / X$ sigue una distribución $\\text{Gamma}^{-1}(\\alpha, \\theta)$.',
  },
  {
    de: 'gamma-inversa', a: 'gamma', tipo: 'transformacion',
    condicion: '1 / X',
    explicacion:
      'Si $X \\sim \\text{Gamma}^{-1}(\\alpha, \\theta)$, entonces $1 / X \\sim \\text{Gamma}(\\alpha, \\theta)$.',
  },
  {
    de: 'gamma-inversa', a: 'pareto-2', tipo: 'mezcla',
    condicion: 'X \\mid \\Theta \\sim \\text{Exp}(1/\\Theta)',
    explicacion:
      'Si la media condicional de una pérdida exponencial varía según $\\Theta \\sim \\text{Gamma}^{-1}(\\alpha, \\theta)$, la distribución marginal de la pérdida es $\\text{Pareto}_{II}(\\alpha, \\theta)$.',
  },
  {
    de: 'gamma-inversa', a: 't-student', tipo: 'mezcla',
    condicion: 'X \\mid \\Sigma^2 \\sim N(0, \\Sigma^2)',
    explicacion:
      'Si $X \\mid \\Sigma^2 \\sim N(0, \\Sigma^2)$ y la varianza sigue $\\Sigma^2 \\sim \\text{Gamma}^{-1}(\\nu/2, \\nu/2)$, la distribución marginal es $t(\\nu)$.',
  },
  {
    de: 'weibull', a: 'weibull-inversa', tipo: 'transformacion',
    condicion: '1 / X',
    explicacion:
      'Si $X \\sim \\text{Weibull}(\\tau, \\theta)$, su recíproca $1 / X$ sigue una distribución $\\text{Weibull}^{-1}(\\tau, \\theta)$ (Fréchet).',
  },
  {
    de: 'weibull-inversa', a: 'weibull', tipo: 'transformacion',
    condicion: '1 / X',
    explicacion:
      'Si $X \\sim \\text{Weibull}^{-1}(\\tau, \\theta)$, entonces $1 / X \\sim \\text{Weibull}(\\tau, \\theta)$.',
  },
  {
    de: 'exponencial', a: 'weibull-inversa', tipo: 'transformacion',
    condicion: '\\theta\\,X^{-1/\\tau}\\ (\\lambda{=}1)',
    explicacion:
      'Si $X \\sim \\text{Exp}(1)$, entonces $Y = \\theta\\,X^{-1/\\tau} \\sim \\text{Weibull}^{-1}(\\tau, \\theta)$.',
  },
  {
    de: 'pareto-1', a: 'weibull-inversa', tipo: 'limite',
    condicion: 'n \\to \\infty,\\ n^{-1/\\alpha}\\max_{i \\le n} X_i',
    explicacion:
      'Teorema de Fisher–Tippett–Gnedenko: el máximo reescalado $n^{-1/\\alpha}\\max_{1 \\le i \\le n} X_i$ de variables independientes $\\text{Pareto}_I(\\alpha, \\theta)$ converge en distribución a $\\text{Weibull}^{-1}(\\alpha, \\theta)$ (dominio de atracción de Fréchet).',
  },
  {
    de: 'pareto-generalizada', a: 'pareto-2', tipo: 'caso-especial',
    condicion: '\\xi > 0\\ (\\alpha{=}1/\\xi,\\ \\theta{=}\\beta/\\xi)',
    explicacion:
      'Para $\\xi > 0$, la distribución $\\text{GPD}(\\xi, \\beta)$ es una reparametrización directa de $\\text{Pareto}_{II}(\\alpha = 1/\\xi,\\, \\theta = \\beta/\\xi)$.',
  },
  {
    de: 'pareto-2', a: 'pareto-generalizada', tipo: 'caso-especial',
    condicion: '\\xi = 1/\\alpha,\\ \\beta = \\theta/\\alpha',
    explicacion:
      'Toda $\\text{Pareto}_{II}(\\alpha, \\theta)$ se escribe como $\\text{GPD}(\\xi = 1/\\alpha,\\, \\beta = \\theta/\\alpha)$.',
  },
  {
    de: 'pareto-generalizada', a: 'exponencial', tipo: 'limite',
    condicion: '\\xi \\to 0',
    explicacion:
      'Cuando el índice de cola $\\xi \\to 0$, $(1 + \\xi x/\\beta)^{-1/\\xi} \\to e^{-x/\\beta}$ y $\\text{GPD}(\\xi, \\beta)$ converge a $\\text{Exp}(1/\\beta)$.',
  },
  {
    de: 'pareto-generalizada', a: 'uniforme', tipo: 'caso-especial',
    condicion: '\\xi = -1',
    explicacion:
      'Con $\\xi = -1$, la densidad es constante $1/\\beta$ en $[0, \\beta]$ y $\\text{GPD}(-1, \\beta) = \\text{Uniforme}(0, \\beta)$.',
  },
  {
    de: 'burr', a: 'pareto-generalizada', tipo: 'limite',
    condicion: 'd \\to \\infty,\\ X - d \\mid X > d',
    explicacion:
      'Teorema de Pickands–Balkema–de Haan: para toda distribución en el dominio de atracción de cola pesada (como Burr con índice $\\xi = 1/(\\alpha\\gamma)$), el exceso sobre un umbral alto $X - d \\mid X > d$ converge a una $\\text{GPD}(\\xi, \\beta(d))$.',
  },
  {
    de: 'binomial-negativa-fracasos', a: 'logaritmica', tipo: 'limite',
    condicion: 'X \\mid X \\ge 1,\\ r \\to 0^{+}',
    explicacion:
      'Si se trunca en cero una $\\text{BN}_F(r, 1 - p)$ y se hace $r \\to 0^{+}$, la distribución condicional $X \\mid X \\ge 1$ converge a $\\text{Log}(p)$.',
  },
  {
    de: 'logaritmica', a: 'binomial-negativa-fracasos', tipo: 'suma',
    condicion: '\\sum_{i=1}^{N} X_i,\\ N \\sim \\text{Poisson}(-r\\ln(1-p))',
    explicacion:
      'Teorema de Quenouille: la suma compuesta $\\sum_{i=1}^N X_i$ de un número $N \\sim \\text{Poisson}(-r\\ln(1-p))$ de racimos independientes $X_i \\sim \\text{Log}(p)$ sigue exactamente una $\\text{BN}_F(r, 1 - p)$.',
  },
  {
    de: 'poisson-cero-inflada', a: 'poisson', tipo: 'caso-especial',
    condicion: '\\pi_0 = 0',
    explicacion:
      'Sin inflación estructural en cero ($\\pi_0 = 0$), $\\text{ZIP}(\\lambda, 0) = \\text{Poisson}(\\lambda)$.',
  },
  {
    de: 'poisson', a: 'poisson-cero-inflada', tipo: 'mezcla',
    condicion: 'I \\cdot N,\\ I \\sim \\text{Bernoulli}(1 - \\pi_0)',
    explicacion:
      'Si $I \\sim \\text{Bernoulli}(1 - \\pi_0)$ indica si la póliza es susceptible de reclamar y $N \\sim \\text{Poisson}(\\lambda)$ es independiente, entonces $X = I \\cdot N \\sim \\text{ZIP}(\\lambda, \\pi_0)$.',
  },
  {
    de: 'poisson-cero-inflada', a: 'poisson', tipo: 'truncamiento',
    condicion: 'X \\mid X \\ge 1',
    explicacion:
      'Condicionada a que hubo al menos una reclamación ($X \\ge 1$), una $\\text{ZIP}(\\lambda, \\pi_0)$ tiene exactamente la misma distribución cero-truncada que una $\\text{Poisson}(\\lambda)$ truncada en cero.',
  },
  {
    de: 'poisson', a: 'poisson-compuesta', tipo: 'construccion',
    condicion: 'S = \\sum_{i=1}^{N} X_i\\ (N \\sim \\text{Poisson}(\\lambda))',
    explicacion:
      'La distribución $\\text{Poisson}(\\lambda)$ modela la frecuencia de siniestros $N$ en el monto agregado $S = \\sum_{i=1}^N X_i$ del modelo colectivo de Cramér–Lundberg.',
  },
  {
    de: 'gamma', a: 'poisson-compuesta', tipo: 'suma',
    condicion: 'S = \\sum_{i=1}^{N} X_i\\ (X_i \\sim \\text{Gamma}(\\alpha, \\beta))',
    explicacion:
      'Al sumar un número aleatorio $N \\sim \\text{Poisson}(\\lambda)$ de severidades independientes $X_i \\sim \\text{Gamma}(\\alpha, \\beta)$, dado $N = n$ la suma es $\\text{Gamma}(n\\alpha, \\beta)$ y marginalmente sigue $\\text{CompPoisson}(\\lambda, \\alpha, \\beta)$.',
  },
  {
    de: 'exponencial', a: 'poisson-compuesta', tipo: 'suma',
    condicion: 'S = \\sum_{i=1}^{N} X_i\\ (\\alpha{=}1)',
    explicacion:
      'Caso clásico con severidades individuales exponenciales $X_i \\sim \\text{Exp}(\\beta)$, cuya densidad para $s > 0$ se expresa con la función de Bessel modificada $I_1(2\\sqrt{\\lambda\\beta s})$.',
  },
  {
    de: 'poisson-compuesta', a: 'normal', tipo: 'limite',
    condicion: '\\lambda \\to \\infty',
    explicacion:
      'Aproximación normal del riesgo colectivo: cuando el número esperado de reclamaciones $\\lambda \\to \\infty$, $\\frac{S - \\lambda E[X]}{\\sqrt{\\lambda E[X^2]}} \\xrightarrow{d} N(0, 1)$.',
  },

  // ── Procesos Estocásticos / Simulación ──────────────────────────────
  {
    de: 'gaussiana-inversa', a: 'chi-cuadrada', tipo: 'transformacion',
    condicion: '\\frac{\\lambda(X - \\mu)^{2}}{\\mu^{2} X}',
    explicacion:
      'Teorema de Shuster: si $X \\sim \\text{IG}(\\mu, \\lambda)$, entonces la transformación cuadrática $\\frac{\\lambda(X - \\mu)^2}{\\mu^2 X}$ sigue exactamente una distribución $\\chi^2(1)$.',
  },
  {
    de: 'gaussiana-inversa', a: 'normal', tipo: 'limite',
    condicion: '\\lambda / \\mu \\to \\infty',
    explicacion:
      'Cuando la precisión $\\lambda / \\mu \\to \\infty$, la asimetría $3\\sqrt{\\mu/\\lambda} \\to 0$ y $\\text{IG}(\\mu, \\lambda)$ se aproxima a $N\\!\\left(\\mu,\\, \\frac{\\mu^3}{\\lambda}\\right)$.',
  },
  {
    de: 'gaussiana-inversa', a: 'levy', tipo: 'limite',
    condicion: '\\mu \\to \\infty\\ (\\nu \\to 0)',
    explicacion:
      'Cuando la deriva del movimiento browniano tiende a cero ($\\mu = a/\\nu \\to \\infty$ con $\\lambda = a^2$ fijo), el tiempo de primer paso $\\text{IG}(\\mu, \\lambda)$ converge a $\\text{Lévy}(0, \\lambda)$.',
  },
  {
    de: 'normal-estandar', a: 'levy', tipo: 'transformacion',
    condicion: '\\mu + \\frac{c}{Z^{2}}',
    explicacion:
      'Si $Z \\sim N(0, 1)$, entonces $X = \\mu + \\frac{c}{Z^2}$ sigue una distribución $\\text{Lévy}(\\mu, c)$.',
  },
  {
    de: 'chi-cuadrada', a: 'levy', tipo: 'transformacion',
    condicion: '\\mu + \\frac{c}{V}\\ (\\nu{=}1)',
    explicacion:
      'Si $V \\sim \\chi^2(1)$, su recíproca escalada $\\mu + c/V$ sigue una distribución $\\text{Lévy}(\\mu, c)$.',
  },
  {
    de: 'gamma-inversa', a: 'levy', tipo: 'caso-especial',
    condicion: '\\alpha = 1/2,\\ \\theta = c/2\\ (\\mu{=}0)',
    explicacion:
      'Con $\\alpha = 1/2$ y escala $\\theta = c/2$, $\\text{Gamma}^{-1}(1/2, c/2) = \\text{Lévy}(0, c)$.',
  },
  {
    de: 'beta', a: 'arcoseno', tipo: 'caso-especial',
    condicion: '\\alpha = 1/2,\\ \\beta = 1/2',
    explicacion:
      'Con parámetros simétricos $\\alpha = 1/2$ y $\\beta = 1/2$, $\\text{Beta}(1/2, 1/2) = \\text{Arcoseno}(0, 1)$.',
  },
  {
    de: 'uniforme', a: 'arcoseno', tipo: 'transformacion',
    condicion: 'a + (b - a)\\sin^{2}\\!\\big(\\tfrac{\\pi}{2}U\\big)',
    explicacion:
      'Método de la transformada inversa: si $U \\sim \\text{Uniforme}(0, 1)$, entonces $a + (b - a)\\sin^2\\!\\big(\\frac{\\pi}{2}U\\big) \\sim \\text{Arcoseno}(a, b)$.',
  },
  {
    de: 'normal-estandar', a: 'arcoseno', tipo: 'transformacion',
    condicion: '\\frac{Z_1^{2}}{Z_1^{2} + Z_2^{2}}',
    explicacion:
      'Si $Z_1, Z_2 \\sim N(0, 1)$ son independientes, la proporción $\\frac{Z_1^2}{Z_1^2 + Z_2^2} = \\cos^2\\Theta$ sigue una distribución $\\text{Arcoseno}(0, 1)$.',
  },
  {
    de: 'normal', a: 'rayleigh', tipo: 'transformacion',
    condicion: '\\sqrt{X_1^{2} + X_2^{2}}\\ (\\mu{=}0)',
    explicacion:
      'Si $X_1, X_2 \\sim N(0, \\sigma^2)$ son independientes, la norma radial $\\sqrt{X_1^2 + X_2^2}$ sigue una distribución $\\text{Rayleigh}(\\sigma)$.',
  },
  {
    de: 'weibull', a: 'rayleigh', tipo: 'caso-especial',
    condicion: '\\tau = 2,\\ \\lambda = \\frac{1}{\\sqrt{2}\\,\\sigma}',
    explicacion:
      'Una distribución $\\text{Weibull}(2, \\lambda)$ con forma $\\tau = 2$ es una $\\text{Rayleigh}\\!\\left(\\frac{1}{\\sqrt{2}\\,\\lambda}\\right)$.',
  },
  {
    de: 'exponencial', a: 'rayleigh', tipo: 'transformacion',
    condicion: '\\sqrt{2\\sigma^{2}\\lambda X}',
    explicacion:
      'Si $X \\sim \\text{Exp}(\\lambda)$, entonces $\\sqrt{2\\sigma^2\\lambda X} \\sim \\text{Rayleigh}(\\sigma)$. Inversamente, si $R \\sim \\text{Rayleigh}(\\sigma)$, $R^2 \\sim \\text{Exp}\\!\\left(\\frac{1}{2\\sigma^2}\\right)$.',
  },
  {
    de: 'rayleigh', a: 'exponencial', tipo: 'transformacion',
    condicion: 'X^{2}',
    explicacion:
      'Si $X \\sim \\text{Rayleigh}(\\sigma)$, su cuadrado sigue $X^2 \\sim \\text{Exp}\\!\\left(\\frac{1}{2\\sigma^2}\\right)$.',
  },
  {
    de: 'chi-cuadrada', a: 'rayleigh', tipo: 'transformacion',
    condicion: '\\sigma\\sqrt{X}\\ (\\nu{=}2)',
    explicacion:
      'Si $X \\sim \\chi^2(2)$, entonces $\\sigma\\sqrt{X} \\sim \\text{Rayleigh}(\\sigma)$.',
  },
  {
    de: 'exponencial', a: 'hipoexponencial', tipo: 'suma',
    condicion: 'X_1 + X_2\\ (\\lambda_1 \\ne \\lambda_2)',
    explicacion:
      'Si $X_1 \\sim \\text{Exp}(\\lambda_1)$ y $X_2 \\sim \\text{Exp}(\\lambda_2)$ son independientes con tasas distintas, su suma $X_1 + X_2$ sigue $\\text{Hipoexp}(\\lambda_1, \\lambda_2)$.',
  },
  {
    de: 'hipoexponencial', a: 'gamma', tipo: 'limite',
    condicion: '\\lambda_2 \\to \\lambda_1 = \\lambda\\ (\\alpha{=}2)',
    explicacion:
      'Cuando las tasas de las dos etapas se igualan ($\\lambda_2 \\to \\lambda_1 = \\lambda$), $\\text{Hipoexp}(\\lambda_1, \\lambda_2)$ converge a $\\text{Gamma}(2, \\lambda)$ (Erlang de orden $2$).',
  },
  {
    de: 'exponencial', a: 'hiperexponencial', tipo: 'mezcla',
    condicion: 'p\\,\\text{Exp}(\\lambda_1) + (1-p)\\,\\text{Exp}(\\lambda_2)',
    explicacion:
      'Mezcla finita en paralelo: si con probabilidad $p$ se toma $X \\sim \\text{Exp}(\\lambda_1)$ y con probabilidad $1 - p$ se toma $X \\sim \\text{Exp}(\\lambda_2)$, la distribución resultante es $\\text{Hiperexp}(p, \\lambda_1, \\lambda_2)$.',
  },
  {
    de: 'hiperexponencial', a: 'exponencial', tipo: 'caso-especial',
    condicion: '\\lambda_1 = \\lambda_2 = \\lambda',
    explicacion:
      'Si ambas ramas tienen la misma tasa $\\lambda_1 = \\lambda_2 = \\lambda$ (o si $p \\in \\{0, 1\\}$), $\\text{Hiperexp}(p, \\lambda, \\lambda) = \\text{Exp}(\\lambda)$.',
  },
  {
    de: 'exponencial', a: 'gumbel', tipo: 'transformacion',
    condicion: '\\mu - \\beta\\ln(\\lambda X)',
    explicacion:
      'Si $X \\sim \\text{Exp}(\\lambda)$, entonces $\\mu - \\beta\\ln(\\lambda X) \\sim \\text{Gumbel}(\\mu, \\beta)$.',
  },
  {
    de: 'gumbel', a: 'exponencial', tipo: 'transformacion',
    condicion: 'e^{-(X - \\mu)/\\beta}',
    explicacion:
      'Si $X \\sim \\text{Gumbel}(\\mu, \\beta)$, entonces $e^{-(X - \\mu)/\\beta} \\sim \\text{Exp}(1)$.',
  },
  {
    de: 'exponencial', a: 'gumbel', tipo: 'limite',
    condicion: 'n \\to \\infty,\\ \\max_{i \\le n} X_i - \\tfrac{\\ln n}{\\lambda}',
    explicacion:
      'Si $X_1, \\dots, X_n$ son independientes con $X_i \\sim \\text{Exp}(\\lambda)$, el máximo centrado $\\max_{1 \\le i \\le n} X_i - \\frac{\\ln n}{\\lambda}$ converge en distribución a $\\text{Gumbel}(0, 1/\\lambda)$.',
  },
  {
    de: 'weibull', a: 'gumbel', tipo: 'transformacion',
    condicion: '-\\ln X',
    explicacion:
      'Si $X \\sim \\text{Weibull}(\\tau, \\lambda)$, entonces $-\\ln X \\sim \\text{Gumbel}(\\ln\\lambda,\\, 1/\\tau)$.',
  },
  {
    de: 'gumbel', a: 'logistica', tipo: 'transformacion',
    condicion: 'X_1 - X_2',
    explicacion:
      'Si $X_1, X_2 \\sim \\text{Gumbel}(\\mu, \\beta)$ son independientes, su diferencia $X_1 - X_2$ sigue exactamente una distribución $\\text{Logística}(0, \\beta)$.',
  },

  // ── Matemáticas Actuariales: Gompertz y Makeham ─────────────────────
  {
    de: 'makeham', a: 'gompertz', tipo: 'caso-especial',
    condicion: 'A = 0',
    explicacion:
      'Sin el término constante de riesgo accidental ($A = 0$), la fuerza de mortalidad $\\mu_{x+t} = A + B\\,c^t$ se reduce a la ley de Gompertz $\\mu_{x+t} = B\\,c^t$.',
  },
  {
    de: 'makeham', a: 'exponencial', tipo: 'limite',
    condicion: 'B \\to 0\\ (\\text{fuerza constante } A)',
    explicacion:
      'Si desaparece el término de envejecimiento ($B \\to 0$), la fuerza de mortalidad queda constante $\\mu_{x+t} = A$ y el tiempo de vida futuro sigue una $\\text{Exp}(A)$.',
  },
  {
    de: 'gompertz', a: 'exponencial', tipo: 'limite',
    condicion: 'c \\to 1^{+}\\ (\\gamma \\to 0^{+})',
    explicacion:
      'Cuando la tasa de envejecimiento $\\gamma = \\ln c \\to 0^{+}$, la fuerza de mortalidad $\\mu_{x+t} = B\\,c^t \\to B$ se vuelve constante y $\\text{Gompertz}(B, c) \\xrightarrow{d} \\text{Exp}(B)$.',
  },
  {
    de: 'exponencial', a: 'gompertz', tipo: 'transformacion',
    condicion: '\\frac{1}{\\ln c}\\,\\ln\\!\\left(1 + \\frac{\\ln c}{B}\\,X\\right)\\ (\\lambda{=}1)',
    explicacion:
      'Si $X \\sim \\text{Exp}(1)$, entonces $T = \\frac{1}{\\ln c}\\ln\\!\\left(1 + \\frac{\\ln c}{B}\\,X\\right) \\sim \\text{Gompertz}(B, c)$.',
  },
  {
    de: 'gompertz', a: 'exponencial', tipo: 'transformacion',
    condicion: '\\frac{B}{\\ln c}(c^{T} - 1)',
    explicacion:
      'Transformación de riesgo acumulado: si $T \\sim \\text{Gompertz}(B, c)$, la fuerza de mortalidad integrada $H(T) = \\frac{B}{\\ln c}(c^T - 1)$ sigue una distribución $\\text{Exp}(1)$.',
  },
  {
    de: 'exponencial', a: 'makeham', tipo: 'construccion',
    condicion: '\\min(T_{\\text{acc}},\\, T_{\\text{env}})',
    explicacion:
      'Si el tiempo hasta fallecer por accidente sigue $T_{\\text{acc}} \\sim \\text{Exp}(A)$ (fuerza constante) y es independiente del envejecimiento $T_{\\text{env}} \\sim \\text{Gompertz}(B, c)$, entonces $\\min(T_{\\text{acc}}, T_{\\text{env}}) \\sim \\text{Makeham}(A, B, c)$.',
  },
  {
    de: 'gompertz', a: 'makeham', tipo: 'construccion',
    condicion: '\\min(T_{\\text{acc}},\\, T_{\\text{env}})',
    explicacion:
      'Al superponer un riesgo accidental independiente $T_{\\text{acc}} \\sim \\text{Exp}(A)$ a una vida $T_{\\text{env}} \\sim \\text{Gompertz}(B, c)$, las fuerzas de mortalidad se suman ($\\mu_{x+t} = A + B\\,c^t$) y el mínimo sigue $\\text{Makeham}(A, B, c)$.',
  },
  {
    de: 'uniforme', a: 'gompertz', tipo: 'transformacion',
    condicion: '\\frac{1}{\\ln c}\\,\\ln\\!\\left(1 - \\frac{\\ln c}{B}\\ln U\\right)',
    explicacion:
      'Método de la transformada inversa: si $U \\sim \\text{Uniforme}(0, 1)$, entonces $T = \\frac{1}{\\ln c}\\ln\\!\\left(1 - \\frac{\\ln c}{B}\\ln U\\right) \\sim \\text{Gompertz}(B, c)$.',
  },

  // ── Estadística Bayesiana / Credibilidad ────────────────────────────
  {
    de: 'binomial', a: 'beta-binomial', tipo: 'mezcla',
    condicion: 'p \\sim \\text{Beta}(\\alpha, \\beta)',
    explicacion:
      'Si $X \\mid p \\sim \\text{Bin}(n, p)$ y la probabilidad de éxito tiene priori conjugada $p \\sim \\text{Beta}(\\alpha, \\beta)$, la distribución marginal y predictiva de $X$ es $\\text{BetaBin}(n, \\alpha, \\beta)$.',
  },
  {
    de: 'beta', a: 'beta-binomial', tipo: 'mezcla',
    condicion: 'X \\mid p \\sim \\text{Bin}(n, p)',
    explicacion:
      'La distribución $\\text{Beta}(\\alpha, \\beta)$ actúa como distribución de mezcla (priori conjugada) para el parámetro $p$ de la binomial.',
  },
  {
    de: 'beta-binomial', a: 'uniforme-discreta', tipo: 'caso-especial',
    condicion: '\\alpha = 1,\\ \\beta = 1',
    explicacion:
      'Con priori uniforme $\\text{Beta}(1, 1)$, la distribución predictiva asigna probabilidad $\\frac{1}{n + 1}$ a cada valor $x \\in \\{0, 1, \\dots, n\\}$: $\\text{BetaBin}(n, 1, 1) = \\text{Unif}_D(0, n)$.',
  },
  {
    de: 'beta-binomial', a: 'bernoulli', tipo: 'caso-especial',
    condicion: 'n = 1',
    explicacion:
      'En un solo ensayo ($n = 1$), $\\text{BetaBin}(1, \\alpha, \\beta) = \\text{Bernoulli}\\!\\left(\\frac{\\alpha}{\\alpha + \\beta}\\right)$.',
  },
  {
    de: 'beta-binomial', a: 'binomial', tipo: 'limite',
    condicion: '\\alpha, \\beta \\to \\infty,\\ \\frac{\\alpha}{\\alpha + \\beta} \\to p',
    explicacion:
      'Cuando la priori se concentra alrededor de $p$ ($\\alpha + \\beta \\to \\infty$ con $\\frac{\\alpha}{\\alpha + \\beta} \\to p$), la heterogeneidad desaparece y $\\text{BetaBin}(n, \\alpha, \\beta) \\xrightarrow{d} \\text{Bin}(n, p)$.',
  },
  {
    de: 'binomial-negativa-fracasos', a: 'beta-binomial-negativa', tipo: 'mezcla',
    condicion: 'p \\sim \\text{Beta}(\\alpha, \\beta)',
    explicacion:
      'Si $X \\mid p \\sim \\text{BN}_F(r, p)$ y $p \\sim \\text{Beta}(\\alpha, \\beta)$, la distribución marginal de $X$ es $\\text{BetaBN}(r, \\alpha, \\beta)$.',
  },
  {
    de: 'beta', a: 'beta-binomial-negativa', tipo: 'mezcla',
    condicion: 'X \\mid p \\sim \\text{BN}_F(r, p)',
    explicacion:
      'La distribución $\\text{Beta}(\\alpha, \\beta)$ mezcla la probabilidad de éxito $p$ de la binomial negativa produciendo colas discretas de ley de potencias.',
  },
  {
    de: 'beta-binomial-negativa', a: 'binomial-negativa-fracasos', tipo: 'limite',
    condicion: '\\alpha, \\beta \\to \\infty,\\ \\frac{\\alpha}{\\alpha + \\beta} \\to p',
    explicacion:
      'Cuando $\\alpha, \\beta \\to \\infty$ con $\\frac{\\alpha}{\\alpha + \\beta} \\to p$, $\\text{BetaBN}(r, \\alpha, \\beta)$ converge a $\\text{BN}_F(r, p)$.',
  },
  {
    de: 'multinomial', a: 'dirichlet-multinomial', tipo: 'mezcla',
    condicion: '\\mathbf{p} \\sim \\text{Dir}(\\boldsymbol{\\alpha})',
    explicacion:
      'Si $\\mathbf{X} \\mid \\mathbf{p} \\sim \\text{Mult}(n, \\mathbf{p})$ y $\\mathbf{p} \\sim \\text{Dir}(\\boldsymbol{\\alpha})$, la distribución marginal/predictiva es $\\text{DirMult}(n, \\boldsymbol{\\alpha})$.',
  },
  {
    de: 'dirichlet', a: 'dirichlet-multinomial', tipo: 'mezcla',
    condicion: '\\mathbf{X} \\mid \\mathbf{p} \\sim \\text{Mult}(n, \\mathbf{p})',
    explicacion:
      'La distribución $\\text{Dir}(\\boldsymbol{\\alpha})$ es la priori conjugada del vector de probabilidades multinomial.',
  },
  {
    de: 'dirichlet-multinomial', a: 'beta-binomial', tipo: 'caso-especial',
    condicion: 'k = 2\\ \\text{o marginal } X_i',
    explicacion:
      'Con $k = 2$ categorías o al tomar cualquier componente marginal $X_i$, $\\text{DirMult}(n, \\boldsymbol{\\alpha})$ se reduce a $\\text{BetaBin}(n, \\alpha_i, \\alpha_0 - \\alpha_i)$.',
  },
  {
    de: 'dirichlet-multinomial', a: 'multinomial', tipo: 'limite',
    condicion: '\\alpha_0 \\to \\infty,\\ \\alpha_i / \\alpha_0 \\to p_i',
    explicacion:
      'Cuando la concentración total $\\alpha_0 \\to \\infty$ con $\\alpha_i / \\alpha_0 \\to p_i$, la distribución $\\text{DirMult}(n, \\boldsymbol{\\alpha})$ converge a $\\text{Mult}(n, \\mathbf{p})$.',
  },
  {
    de: 't-student', a: 't-localizacion-escala', tipo: 'transformacion',
    condicion: '\\mu + \\sigma T',
    explicacion:
      'Si $T \\sim t(\\nu)$, la transformación afín $X = \\mu + \\sigma T$ sigue una distribución $t_\\nu(\\mu, \\sigma^2)$.',
  },
  {
    de: 't-localizacion-escala', a: 't-student', tipo: 'caso-especial',
    condicion: '\\mu = 0,\\ \\sigma = 1',
    explicacion:
      'Con $\\mu = 0$ y $\\sigma = 1$, $t_\\nu(0, 1) = t(\\nu)$.',
  },
  {
    de: 't-localizacion-escala', a: 'cauchy', tipo: 'caso-especial',
    condicion: '\\nu = 1',
    explicacion:
      'Con $\\nu = 1$ grado de libertad, $t_1(\\mu, \\sigma^2) = \\text{Cauchy}(\\mu, \\sigma)$.',
  },
  {
    de: 't-localizacion-escala', a: 'normal', tipo: 'limite',
    condicion: '\\nu \\to \\infty',
    explicacion:
      'Cuando los grados de libertad $\\nu \\to \\infty$, $t_\\nu(\\mu, \\sigma^2) \\xrightarrow{d} N(\\mu, \\sigma^2)$.',
  },
  {
    de: 'chi-cuadrada', a: 'chi-cuadrada-inversa-escalada', tipo: 'transformacion',
    condicion: '\\frac{\\nu s^{2}}{X}',
    explicacion:
      'Si $X \\sim \\chi^2(\\nu)$, entonces $\\frac{\\nu s^2}{X} \\sim \\text{Inv-}\\chi^2(\\nu, s^2)$.',
  },
  {
    de: 'gamma-inversa', a: 'chi-cuadrada-inversa-escalada', tipo: 'caso-especial',
    condicion: '\\alpha = \\nu/2,\\ \\theta = \\nu s^{2}/2',
    explicacion:
      'La distribución $\\text{Inv-}\\chi^2(\\nu, s^2)$ es la reparametrización bayesiana de $\\text{Gamma}^{-1}\\!\\left(\\frac{\\nu}{2},\\, \\frac{\\nu s^2}{2}\\right)$.',
  },
  {
    de: 'chi-cuadrada-inversa-escalada', a: 't-localizacion-escala', tipo: 'mezcla',
    condicion: 'X \\mid V \\sim N(\\mu, V)',
    explicacion:
      'Si $X \\mid V \\sim N(\\mu, V)$ y la varianza sigue $V \\sim \\text{Inv-}\\chi^2(\\nu, \\sigma^2)$, la distribución marginal de $X$ es $t_\\nu(\\mu, \\sigma^2)$.',
  },
  {
    de: 'normal', a: 'normal-gamma', tipo: 'construccion',
    condicion: '\\mu \\mid \\tau \\sim N\\big(\\mu_0, (\\kappa_0\\tau)^{-1}\\big)',
    explicacion:
      'En la familia conjugada Normal-Gamma, la media condicionada a la precisión $\\tau$ sigue una distribución normal con varianza inversamente proporcional a $\\kappa_0\\tau$.',
  },
  {
    de: 'gamma', a: 'normal-gamma', tipo: 'construccion',
    condicion: '\\tau \\sim \\text{Gamma}(\\alpha, \\beta)',
    explicacion:
      'En la familia Normal-Gamma, la precisión $\\tau = 1/\\sigma^2$ sigue marginalmente una distribución $\\text{Gamma}(\\alpha, \\beta)$.',
  },
  {
    de: 'normal-gamma', a: 't-localizacion-escala', tipo: 'mezcla',
    condicion: '\\int f(\\mu, \\tau)\\,d\\tau',
    explicacion:
      'Al integrar la precisión $\\tau \\sim \\text{Gamma}(\\alpha, \\beta)$ en $(\\mu, \\tau) \\sim \\text{NG}(\\mu_0, \\kappa_0, \\alpha, \\beta)$, la distribución marginal de $\\mu$ es $t_{2\\alpha}\\!\\left(\\mu_0,\\, \\frac{\\beta}{\\alpha\\kappa_0}\\right)$.',
  },
];
