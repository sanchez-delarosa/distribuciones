// Registro de distribuciones.
// Para agregar una nueva: crea su archivo en esta carpeta e impórtalo aquí.

import bernoulli from './bernoulli.js';
import binomial from './binomial.js';
import poisson from './poisson.js';
import geometricaFracasos from './geometrica-fracasos.js';
import geometricaEnsayos from './geometrica-ensayos.js';
import hipergeometrica from './hipergeometrica.js';
import binomialNegativaFracasos from './binomial-negativa-fracasos.js';
import binomialNegativaEnsayos from './binomial-negativa-ensayos.js';
import normal from './normal.js';
import normalEstandar from './normal-estandar.js';
import exponencial from './exponencial.js';
import uniforme from './uniforme.js';
import gamma from './gamma.js';
import chiCuadrada from './chi-cuadrada.js';
import uniformeDiscreta from './uniforme-discreta.js';
import weibull from './weibull.js';
import lognormal from './lognormal.js';
import pareto1 from './pareto-1.js';
import pareto2 from './pareto-2.js';
import beta from './beta.js';
import multinomial from './multinomial.js';
import tStudent from './t-student.js';
import fFisher from './f-fisher.js';
import cauchy from './cauchy.js';
import laplace from './laplace.js';
import logistica from './logistica.js';
import dirichlet from './dirichlet.js';
import normalBivariada from './normal-bivariada.js';
import betaPrima from './beta-prima.js';
import chiCuadradaNoCentral from './chi-cuadrada-no-central.js';
import tNoCentral from './t-no-central.js';
import fNoCentral from './f-no-central.js';
import hipergeometricaNegativa from './hipergeometrica-negativa.js';
import potencia from './potencia.js';
import burr from './burr.js';
import logLogistica from './log-logistica.js';
import gammaInversa from './gamma-inversa.js';
import weibullInversa from './weibull-inversa.js';
import paretoGeneralizada from './pareto-generalizada.js';
import logaritmica from './logaritmica.js';
import poissonCeroInflada from './poisson-cero-inflada.js';
import poissonCompuesta from './poisson-compuesta.js';
import gaussianaInversa from './gaussiana-inversa.js';
import levy from './levy.js';
import arcoseno from './arcoseno.js';
import rayleigh from './rayleigh.js';
import hipoexponencial from './hipoexponencial.js';
import hiperexponencial from './hiperexponencial.js';
import gumbel from './gumbel.js';
import gompertz from './gompertz.js';
import makeham from './makeham.js';
import betaBinomial from './beta-binomial.js';
import betaBinomialNegativa from './beta-binomial-negativa.js';
import dirichletMultinomial from './dirichlet-multinomial.js';
import tLocalizacionEscala from './t-localizacion-escala.js';
import chiCuadradaInversaEscalada from './chi-cuadrada-inversa-escalada.js';
import normalGamma from './normal-gamma.js';

/** @type {import('../tipos.js').Distribucion[]} */
export const DISTRIBUCIONES = [
  bernoulli,
  binomial,
  poisson,
  geometricaFracasos,
  geometricaEnsayos,
  hipergeometrica,
  binomialNegativaFracasos,
  binomialNegativaEnsayos,
  uniformeDiscreta,
  multinomial,
  hipergeometricaNegativa,
  logaritmica,
  poissonCeroInflada,
  betaBinomial,
  betaBinomialNegativa,
  dirichletMultinomial,
  normal,
  normalEstandar,
  exponencial,
  uniforme,
  gamma,
  chiCuadrada,
  weibull,
  lognormal,
  pareto1,
  pareto2,
  beta,
  tStudent,
  fFisher,
  cauchy,
  laplace,
  logistica,
  dirichlet,
  normalBivariada,
  betaPrima,
  chiCuadradaNoCentral,
  tNoCentral,
  fNoCentral,
  potencia,
  gompertz,
  makeham,
  burr,
  logLogistica,
  gammaInversa,
  weibullInversa,
  paretoGeneralizada,
  poissonCompuesta,
  gaussianaInversa,
  levy,
  arcoseno,
  rayleigh,
  hipoexponencial,
  hiperexponencial,
  gumbel,
  tLocalizacionEscala,
  chiCuadradaInversaEscalada,
  normalGamma,
];
