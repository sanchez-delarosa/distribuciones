// Búsqueda en anchura (BFS) del camino dirigido más corto entre dos distribuciones.

/**
 * @param {string} origen
 * @param {string} destino
 * @param {import('../datos/tipos.js').Relacion[]} relaciones
 * @returns {import('../datos/tipos.js').Relacion[] | null}
 */
export function buscarCamino(origen, destino, relaciones) {
  if (origen === destino) return [];
  const cola = [origen];
  const visitados = new Set([origen]);
  /** @type {Map<string, import('../datos/tipos.js').Relacion>} */
  const previo = new Map();

  while (cola.length) {
    const u = cola.shift();
    for (const r of relaciones) {
      if (r.de !== u || visitados.has(r.a)) continue;
      visitados.add(r.a);
      previo.set(r.a, r);
      if (r.a === destino) {
        const camino = [];
        let actual = destino;
        while (actual !== origen) {
          const arista = previo.get(actual);
          camino.unshift(arista);
          actual = arista.de;
        }
        return camino;
      }
      cola.push(r.a);
    }
  }
  return null;
}
