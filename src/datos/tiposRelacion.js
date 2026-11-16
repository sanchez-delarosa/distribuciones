// Catálogo de tipos de relación entre distribuciones.
// Para agregar un tipo nuevo basta con añadir una entrada aquí;
// la leyenda y los filtros solo muestran los tipos que se usan.

/** @typedef {'solido' | 'punteado'} EstiloLinea */

/**
 * @type {Record<string, { nombre: string, color: string, estilo: EstiloLinea, descripcion: string }>}
 */
export const TIPOS_RELACION = {
  'caso-especial': {
    nombre: 'Caso especial',
    color: '#60a5fa',
    estilo: 'solido',
    descripcion: 'El destino se obtiene al fijar uno o más parámetros del origen.',
  },
  transformacion: {
    nombre: 'Transformación',
    color: '#a78bfa',
    estilo: 'solido',
    descripcion: 'El destino es una función de una variable con la distribución de origen.',
  },
  suma: {
    nombre: 'Suma',
    color: '#34d399',
    estilo: 'solido',
    descripcion: 'El destino es la suma de variables independientes con la distribución de origen.',
  },
  limite: {
    nombre: 'Límite',
    color: '#f472b6',
    estilo: 'punteado',
    descripcion: 'El origen converge en distribución al destino cuando sus parámetros tienden a cierto valor.',
  },
  mezcla: {
    nombre: 'Mezcla',
    color: '#fbbf24',
    estilo: 'solido',
    descripcion: 'Un parámetro del origen es a su vez una variable aleatoria.',
  },
  condicional: {
    nombre: 'Condicional',
    color: '#22d3ee',
    estilo: 'solido',
    descripcion: 'El destino es la distribución del origen condicionada a un evento.',
  },
  construccion: {
    nombre: 'Construcción',
    color: '#fb923c',
    estilo: 'solido',
    descripcion: 'El destino se define contando resultados de una sucesión de variables del origen.',
  },
  compuesta: {
    nombre: 'Compuesta',
    color: '#e879f9',
    estilo: 'solido',
    descripcion: 'El destino es una suma aleatoria: el número de sumandos sigue la distribución de origen.',
  },
  truncamiento: {
    nombre: 'Truncamiento o modificación',
    color: '#94a3b8',
    estilo: 'solido',
    descripcion: 'El destino se obtiene al truncar el soporte del origen o modificar la probabilidad en cero.',
  },
  bayesiana: {
    nombre: 'Bayesiana (conjugada)',
    color: '#f87171',
    estilo: 'punteado',
    descripcion: 'El destino es la distribución a posteriori cuando el origen es la a priori conjugada.',
  },
};
