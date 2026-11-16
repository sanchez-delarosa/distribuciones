// Definiciones de tipos (JSDoc) para los datos del mapa.
// No exporta código: sirve como referencia y para el autocompletado del editor.

/**
 * @typedef {Object} Parametro
 * @property {string} id            Nombre de la variable en `calc` (por ejemplo, 'p').
 * @property {string} tex           Símbolo en LaTeX (por ejemplo, '\\lambda').
 * @property {string} nombre        Descripción breve en español.
 * @property {string} restriccion   Espacio de parámetros en LaTeX.
 * @property {number} min           Mínimo del control deslizante.
 * @property {number | ((p: Record<string, number>) => number)} max  Máximo (puede depender de otros parámetros).
 * @property {number} paso          Incremento del control deslizante.
 * @property {number} valor         Valor inicial.
 */

/**
 * @typedef {Object} Formulas
 * @property {string} densidad        fmp o fdp.
 * @property {string} [fda]           Función de distribución.
 * @property {string} [supervivencia] S(x) = P(X > x).
 * @property {string} [riesgo]        Función de riesgo (hazard).
 * @property {string} media
 * @property {string} varianza
 * @property {string} [fgm]           Función generadora de momentos.
 * @property {string} [fgp]           Función generadora de probabilidades.
 */

/**
 * @typedef {Object} Distribucion
 * @property {string} id
 * @property {string} nombre
 * @property {'discreta' | 'continua'} tipo
 * @property {string} [materia]          Clave de MATERIAS (por defecto 'probabilidad').
 * @property {string} notacion         LaTeX, por ejemplo 'X \\sim \\text{Bin}(n, p)'.
 * @property {string} descripcion      Texto; admite LaTeX entre $…$.
 * @property {string[]} [alias]        Otros nombres, para la búsqueda.
 * @property {Parametro[]} parametros
 * @property {string} soporte          LaTeX.
 * @property {Formulas} formulas
 * @property {{ etiqueta: string, tex: string }[]} [extras]  Fórmulas adicionales (VaR, TVaR, momentos…).
 * @property {{ clase: string, a: string, b: string, p0: string }} [claseAB]
 * @property {{ letra: string, detalle: string }[]} [propiedades]  Letras de PROPIEDADES; detalle en LaTeX.
 * @property {string[]} [notas]        Texto; admite LaTeX entre $…$.
 * @property {{ param: string, min: number, max: number | ((p: Record<string, number>) => number) }} [superficie]
 * @property {Calc} calc
 */

/**
 * @typedef {Object} Calc
 * @property {(x: number, p: Record<string, number>) => number} densidad
 * @property {(p: Record<string, number>) => [number, number]} rango  Intervalo que contiene prácticamente toda la masa.
 * @property {(p: Record<string, number>) => number} media
 * @property {(p: Record<string, number>) => number} varianza
 * @property {(p: Record<string, number>) => Record<string, number>} [ajustar]  Corrige combinaciones inválidas.
 */

/**
 * @typedef {Object} Relacion
 * @property {string} [id]           Opcional; se genera como `de__tipo__a`.
 * @property {string} de             id de la distribución de origen.
 * @property {string} a              id de la distribución de destino.
 * @property {string} tipo           Clave de TIPOS_RELACION.
 * @property {string} condicion      LaTeX corto que se muestra sobre la flecha.
 * @property {string} explicacion    Texto; admite LaTeX entre $…$.
 */

export {};
