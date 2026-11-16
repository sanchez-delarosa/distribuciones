// Propiedades de cerradura de una familia de distribuciones.
// Se usan las mismas letras que en el diagrama de Leemis y McQueston (2008)
// para que quien conozca el original las reconozca.

/** @type {Record<string, { nombre: string, descripcion: string }>} */
export const PROPIEDADES = {
  C: {
    nombre: 'Convolución',
    descripcion: 'La suma de variables independientes de la familia pertenece a la familia.',
  },
  L: {
    nombre: 'Combinación lineal',
    descripcion: 'Toda combinación lineal de variables independientes de la familia pertenece a la familia.',
  },
  S: {
    nombre: 'Escalamiento',
    descripcion: 'Si X pertenece a la familia, cX también pertenece para toda constante c > 0.',
  },
  F: {
    nombre: 'Falta de memoria',
    descripcion: 'Saber que la variable ya superó un valor no cambia la distribución de lo que falta.',
  },
  M: {
    nombre: 'Mínimo',
    descripcion: 'El mínimo de variables independientes de la familia pertenece a la familia.',
  },
  X: {
    nombre: 'Máximo',
    descripcion: 'El máximo de variables independientes de la familia pertenece a la familia.',
  },
  P: {
    nombre: 'Producto',
    descripcion: 'El producto de variables independientes de la familia pertenece a la familia.',
  },
  I: {
    nombre: 'Inversa',
    descripcion: 'Si X pertenece a la familia, 1/X también pertenece.',
  },
  R: {
    nombre: 'Residual',
    descripcion: 'La variable condicionada a X > a pertenece a la familia.',
  },
  V: {
    nombre: 'Generación de variables',
    descripcion: 'La inversa de la función de distribución tiene forma cerrada, así que se puede simular con X = F⁻¹(U).',
  },
};
