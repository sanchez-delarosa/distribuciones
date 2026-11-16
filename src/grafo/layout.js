// Acomodo automático uniforme por zonas:
// - Zona superior (~1/3 superior): distribuciones discretas en filas con espaciado uniforme.
// - Zona inferior (~2/3 inferiores): distribuciones continuas en filas con el mismo paso vertical.
// Dentro de cada zona, las tarjetas se reparten de forma uniforme a lo ancho y se optimiza el
// orden mediante intercambios para minimizar la longitud total de las flechas.

import { POSICIONES_FIJAS } from '../datos/posiciones.js';

export const ANCHO_NODO = 210;
export const ALTO_NODO = 85;

const PASO_X = 330; // separación horizontal base entre tarjetas vecinas
const PASO_Y = 175; // separación vertical uniforme entre filas
const MARGEN_FRONTERA = 105; // distancia de la primera fila de cada zona a la línea divisoria

/**
 * @returns {Promise<{ posiciones: Map<string, {x: number, y: number}>, yDivisor: number, ancho: number }>}
 */
export async function calcularLayout(distribuciones, relaciones) {
  const ELK = /** @type {any} */ (window).ELK;
  const elk = new ELK();
  const tipoPorId = new Map(distribuciones.map((d) => [d.id, d.tipo]));

  // 1. Obtenemos un orden inicial izquierda→derecha con ELK sobre todo el grafo.
  const res = await elk.layout({
    id: 'raiz',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNode': '90',
      'elk.layered.spacing.nodeNodeBetweenLayers': '110',
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.layered.cycleBreaking.strategy': 'GREEDY',
    },
    children: distribuciones.map((d) => ({ id: d.id, width: ANCHO_NODO, height: ALTO_NODO })),
    edges: relaciones
      .filter((r) => r.de !== r.a)
      .map((r) => ({ id: r.id, sources: [r.de], targets: [r.a] })),
  });
  const elkPos = new Map(res.children.map((n) => [n.id, { x: n.x, y: n.y }]));

  // 2. Contamos cuántas aristas cruzan entre la zona discreta y la continua para acercar
  //    esos nodos a la fila fronteriza de su zona.
  const cruces = new Map(distribuciones.map((d) => [d.id, 0]));
  const grado = new Map(distribuciones.map((d) => [d.id, 0]));
  for (const r of relaciones) {
    if (r.de === r.a) continue;
    grado.set(r.de, grado.get(r.de) + 1);
    grado.set(r.a, grado.get(r.a) + 1);
    if (tipoPorId.get(r.de) !== tipoPorId.get(r.a)) {
      cruces.set(r.de, cruces.get(r.de) + 1);
      cruces.set(r.a, cruces.get(r.a) + 1);
    }
  }

  const disc = distribuciones.filter((d) => d.tipo === 'discreta');
  const cont = distribuciones.filter((d) => d.tipo === 'continua');

  // Número de filas: ~1/3 arriba (discretas) y ~2/3 abajo (continuas), ~4-5 tarjetas por fila.
  const maxPorFila = Math.max(4, Math.round(Math.sqrt(distribuciones.length) * 1.15));
  const nFilasD = Math.max(1, Math.ceil(disc.length / maxPorFila));
  const nFilasC = Math.max(2, Math.ceil(cont.length / Math.max(3, maxPorFila - 1)));

  // Asigna los nodos de una zona a `nFilas` filas con tamaños equilibrados y coordenadas uniformes.
  function armarFilas(lista, nFilas, signoY, anchoZona) {
    // Ordenamos primero por cercanía deseada a la frontera (más cruces → fila 0, junto al divisor).
    const ordenados = [...lista].sort((a, b) => {
      const dc = cruces.get(b.id) - cruces.get(a.id);
      if (dc !== 0) return dc;
      return grado.get(b.id) - grado.get(a.id);
    });

    const filas = [];
    let idx = 0;
    for (let f = 0; f < nFilas; f++) {
      const restantes = ordenados.length - idx;
      const filasRestantes = nFilas - f;
      const tam = Math.ceil(restantes / filasRestantes);
      const grupo = ordenados.slice(idx, idx + tam);
      idx += tam;
      // Orden horizontal inicial según ELK.
      grupo.sort((a, b) => elkPos.get(a.id).x - elkPos.get(b.id).x);
      filas.push(grupo);
    }

    // Calcula las coordenadas uniformes de cada fila.
    const pos = new Map();
    const actualizarCoords = () => {
      for (let f = 0; f < filas.length; f++) {
        const fila = filas[f];
        const k = fila.length;
        const y = signoY * (MARGEN_FRONTERA + f * PASO_Y);
        for (let c = 0; c < k; c++) {
          const x = k === 1 ? 0 : ((c / (k - 1)) - 0.5) * anchoZona;
          pos.set(fila[c].id, { x, y, fila: f, col: c });
        }
      }
    };
    actualizarCoords();
    return { filas, pos, actualizarCoords };
  }

  const maxCols = Math.max(
    Math.ceil(disc.length / nFilasD),
    Math.ceil(cont.length / nFilasC),
  );
  const anchoZona = Math.max(900, (maxCols - 1) * PASO_X);

  const zD = armarFilas(disc, nFilasD, +1, anchoZona);
  const zC = armarFilas(cont, nFilasC, -1, anchoZona);

  const posGlobal = (id) => zD.pos.get(id) ?? zC.pos.get(id);

  // Costo total de longitud de aristas al cuadrado (ponderando más las aristas cortas/directas).
  function costoTotal() {
    let s = 0;
    for (const r of relaciones) {
      if (r.de === r.a) continue;
      const a = posGlobal(r.de);
      const b = posGlobal(r.a);
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      s += dx * dx + dy * dy * 0.65;
    }
    return s;
  }

  // 3. Optimización por intercambios (dentro de cada fila y entre filas de la misma zona)
  //    manteniendo las posiciones de la rejilla 100 % uniformes.
  function optimizarZona(zona) {
    const { filas, actualizarCoords } = zona;
    let mejor = costoTotal();
    for (let pasadas = 0; pasadas < 40; pasadas++) {
      let cambio = false;
      // Intercambios dentro de la misma fila.
      for (const fila of filas) {
        for (let i = 0; i < fila.length; i++) {
          for (let j = i + 1; j < fila.length; j++) {
            [fila[i], fila[j]] = [fila[j], fila[i]];
            actualizarCoords();
            const c = costoTotal();
            if (c < mejor - 1) {
              mejor = c;
              cambio = true;
            } else {
              [fila[i], fila[j]] = [fila[j], fila[i]];
              actualizarCoords();
            }
          }
        }
      }
      // Intercambios entre filas de la misma zona (penalizando alejar de la frontera un nodo con muchos cruces).
      for (let f1 = 0; f1 < filas.length; f1++) {
        for (let f2 = f1 + 1; f2 < filas.length; f2++) {
          for (let i = 0; i < filas[f1].length; i++) {
            for (let j = 0; j < filas[f2].length; j++) {
              const u = filas[f1][i];
              const v = filas[f2][j];
              if (cruces.get(u.id) > 0 && cruces.get(v.id) === 0) continue;
              [filas[f1][i], filas[f2][j]] = [filas[f2][j], filas[f1][i]];
              actualizarCoords();
              const c = costoTotal();
              if (c < mejor - 1) {
                mejor = c;
                cambio = true;
              } else {
                [filas[f1][i], filas[f2][j]] = [filas[f2][j], filas[f1][i]];
                actualizarCoords();
              }
            }
          }
        }
      }
      if (!cambio) break;
    }
  }

  for (let ronda = 0; ronda < 4; ronda++) {
    optimizarZona(zD);
    optimizarZona(zC);
  }

  // 4. Centramos verticalmente el conjunto completo y devolvemos las posiciones.
  const todos = [...zD.pos.entries(), ...zC.pos.entries()];
  const ys = todos.map(([, p]) => p.y);
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const posiciones = new Map();
  for (const [id, p] of todos) {
    posiciones.set(id, { x: p.x, y: p.y - cy });
  }
  for (const [id, p] of Object.entries(POSICIONES_FIJAS)) {
    if (posiciones.has(id)) posiciones.set(id, { ...p });
  }

  return {
    posiciones,
    yDivisor: -cy,
    ancho: anchoZona + 420,
  };
}
