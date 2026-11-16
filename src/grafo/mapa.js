// Mapa principal en three.js: escena 2.5D con tarjetas de distribuciones (nombre + notación),
// flechas curvas con partículas y etiquetas HTML nítidas (CSS2DRenderer).

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { tex, escaparHTML } from '../ui/tex.js';
import { temaActual } from '../ui/temas.js';
import { materiaDe } from '../datos/index.js';

const HW_BASE = 98; // semiancho base de una tarjeta (unidades del mundo)
const HH_BASE = 34; // semialto base de una tarjeta (unidades del mundo)
const FLECHA = 11; // largo de la punta de flecha
const SEPARACION = 34; // separación entre flechas paralelas del mismo par
const PARTICULAS_POR_ARISTA = 2;
const reducirMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const COLOR_TIPO = { discreta: '#f5b942', continua: '#4fd1c5' };

/** Extrae la expresión corta de la distribución (p. ej. "X \\sim \\text{Exp}(\\lambda)" → "\\text{Exp}(\\lambda)"). */
export function notacionCorta(d) {
  return d.notacion.replace(/^.*?\\sim\s*/, '');
}

function texturaRadial(paradas, centro = [0.5, 0.5], tam = 128) {
  const c = document.createElement('canvas');
  c.width = c.height = tam;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(tam * centro[0], tam * centro[1], 0, tam / 2, tam / 2, tam / 2);
  for (const [o, col] of paradas) grad.addColorStop(o, col);
  g.fillStyle = grad;
  g.fillRect(0, 0, tam, tam);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const TEX_BRILLO = texturaRadial([
  [0, 'rgba(255,255,255,1)'],
  [0.18, 'rgba(255,255,255,0.55)'],
  [0.45, 'rgba(255,255,255,0.12)'],
  [1, 'rgba(255,255,255,0)'],
]);

const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Comprueba si el punto `q` está dentro del rectángulo centrado en `P` con semiancho `hw` y semialto `hh`. */
function dentroCaja(q, P, hw, hh) {
  return Math.abs(q.x - P.x) <= hw && Math.abs(q.y - P.y) <= hh;
}

export class Mapa {
  /**
   * @param {HTMLElement} contenedor
   * @param {{
   *   tipos: Record<string, {nombre: string, color: string, estilo: string}>,
   *   porId: Map<string, any>,
   *   alNodo: (id: string) => void,
   *   alArista: (id: string) => void,
   *   alFondo: () => void,
   *   margenDerecho: () => number,
   *   tooltip: HTMLElement,
   * }} op
   */
  constructor(contenedor, op) {
    this.c = contenedor;
    this.op = op;
    this.nodos = new Map();
    this.aristas = new Map();
    this.seleccion = null;
    this.hover = null;
    this.tiposOcultos = new Set();
    this.materiasOcultas = new Set();
    this.mostrarCondiciones = false;
    this.vuelo = null;

    const renderer = (this.renderer = new THREE.WebGLRenderer({ antialias: true }));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x070b14);
    contenedor.appendChild(renderer.domElement);

    this.css = new CSS2DRenderer();
    this.css.domElement.className = 'capa-etiquetas';
    contenedor.appendChild(this.css.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 1, 8000);
    this.camera.position.set(0, 0, 1000);

    const ctl = (this.controls = new OrbitControls(this.camera, renderer.domElement));
    ctl.enableRotate = false;
    ctl.screenSpacePanning = true;
    ctl.zoomToCursor = true;
    ctl.enableDamping = true;
    ctl.dampingFactor = 0.12;
    ctl.minDistance = 140;
    ctl.maxDistance = 5000;
    ctl.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
    ctl.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN };

    this.grupoGrafo = new THREE.Group();
    this.scene.add(this.grupoGrafo);
    this.crearFondo();

    this.raycaster = new THREE.Raycaster();
    this.instalarEventos();

    new ResizeObserver(() => this.redimensionar()).observe(contenedor);
    this.redimensionar();
    this.aplicarTema(temaActual());
    window.addEventListener('cambio-tema', (e) => this.aplicarTema(e.detail));

    this.reloj = new THREE.Clock();
    renderer.setAnimationLoop(() => this.cuadro());
  }

  // ── Fondo: estrellas con paralaje y una retícula tenue ────────────────
  crearFondo() {
    const n = 1800;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 7000;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4500;
      pos[i * 3 + 2] = -200 - Math.random() * 1600;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const estrellas = (this.estrellas = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 5, map: TEX_BRILLO, color: 0x7088c0, transparent: true, opacity: 0.6,
        depthWrite: false, blending: THREE.AdditiveBlending,
      }),
    ));
    estrellas.renderOrder = -2;
    this.scene.add(estrellas);
    this.recrearReticula(temaActual());
  }

  recrearReticula(tema) {
    if (this.reticula) {
      this.reticula.geometry.dispose();
      this.reticula.material.dispose();
      this.scene.remove(this.reticula);
    }
    const reticula = (this.reticula = new THREE.GridHelper(6000, 120, tema.reticula1, tema.reticula2));
    reticula.rotation.x = Math.PI / 2;
    reticula.position.z = -6;
    reticula.material.transparent = true;
    reticula.material.opacity = tema.reticulaOpacidad;
    reticula.material.depthWrite = false;
    reticula.renderOrder = -1;
    this.scene.add(reticula);
  }

  aplicarTema(tema) {
    this.tema = tema;
    COLOR_TIPO.discreta = tema.css['--discreta'];
    COLOR_TIPO.continua = tema.css['--continua'];
    this.renderer.setClearColor(tema.escenaFondo);
    if (this.estrellas) {
      this.estrellas.material.color.setHex(tema.estrellasColor);
      this.estrellas.material.opacity = tema.estrellasOpacidad;
      this.estrellas.material.blending = tema.esClaro ? THREE.NormalBlending : THREE.AdditiveBlending;
    }
    this.recrearReticula(tema);
    if (this.matDivisor) this.matDivisor.color.setHex(tema.divisorColor);
    for (const n of this.nodos.values()) {
      const mat = materiaDe(n.d);
      n.brillo.material.color.set(mat.color);
      n.brillo.material.blending = tema.esClaro ? THREE.NormalBlending : THREE.AdditiveBlending;
      n.tarjeta?.style.setProperty('--color-materia', mat.color);
    }
    if (this.particulas) {
      this.particulas.material.blending = tema.esClaro ? THREE.NormalBlending : THREE.AdditiveBlending;
    }
  }

  // ── Construcción del grafo (se puede llamar de nuevo al cambiar datos) ─
  construir(distribuciones, relaciones, layout) {
    this.grupoGrafo.clear();
    for (const n of this.nodos.values()) n.etiqueta.element.remove();
    for (const a of this.aristas.values()) a.etiqueta.element.remove();
    for (const el of this.etiquetasZona ?? []) el.remove();
    this.nodos.clear();
    this.aristas.clear();
    this.etiquetasZona = [];
    const posiciones = layout instanceof Map ? layout : layout.posiciones;
    this.posiciones = posiciones;

    // Línea divisoria horizontal entre la zona discreta (arriba) y la continua (abajo).
    if (!(layout instanceof Map) && typeof layout.yDivisor === 'number') {
      const w = (layout.ancho ?? 2200) / 2;
      const y = layout.yDivisor;
      const geoDiv = new LineGeometry();
      geoDiv.setPositions([-w, y, -2, w, y, -2]);
      const matDiv = new LineMaterial({
        color: 0x475569, linewidth: 1.4, transparent: true, opacity: 0.45,
        dashed: true, dashSize: 12, gapSize: 8, worldUnits: false, depthTest: false,
      });
      matDiv.resolution.set(this.c.clientWidth || 1, this.c.clientHeight || 1);
      const lineaDiv = new Line2(geoDiv, matDiv);
      lineaDiv.computeLineDistances();
      lineaDiv.renderOrder = 0;
      this.matDivisor = matDiv;
      this.grupoGrafo.add(lineaDiv);

      for (const [textoZona, dy, clase] of [
        ['DISCRETAS', 22, 'discreta'],
        ['CONTINUAS', -22, 'continua'],
      ]) {
        const divZ = document.createElement('div');
        divZ.className = `etiqueta-zona ${clase}`;
        divZ.textContent = textoZona;
        const objZ = new CSS2DObject(divZ);
        objZ.position.set(-w + 70, y + dy, 0);
        objZ.center.set(0, 0.5);
        this.grupoGrafo.add(objZ);
        this.etiquetasZona.push(divZ);
      }
    }

    for (const d of distribuciones) {
      const p = posiciones.get(d.id);
      const mat = materiaDe(d);
      const color = new THREE.Color(mat.color);
      const g = new THREE.Group();
      g.position.set(p.x, p.y, 0);

      // Resplandor suave detrás de la tarjeta con el color de su materia.
      const brillo = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: TEX_BRILLO, color, transparent: true, opacity: 0.38,
          blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false,
        }),
      );
      brillo.scale.set(260, 140, 1);
      brillo.renderOrder = 1;

      // Tarjeta HTML en CSS2D (con nombre, materia, chips de propiedades y notación en KaTeX).
      const ancla = document.createElement('div');
      ancla.className = 'nodo-ancla';
      const tarjeta = document.createElement('div');
      tarjeta.className = `nodo-tarjeta ${d.tipo}`;
      tarjeta.style.setProperty('--color-materia', mat.color);
      const letras = (d.propiedades ?? [])
        .map((q) => `<span class="chip-prop" title="${escaparHTML(q.letra)}">${q.letra}</span>`)
        .join('');
      tarjeta.innerHTML = `
        <div class="nt-arriba">
          <span class="punto punto-materia"></span>
          <span class="nt-nombre">${escaparHTML(d.nombre)}</span>
          ${letras ? `<span class="chips">${letras}</span>` : ''}
        </div>
        <div class="nt-formula">${tex(notacionCorta(d))}</div>
        <div class="nt-abajo">
          <span class="nt-materia">${escaparHTML(mat.corto)}</span>
        </div>
      `;
      ancla.appendChild(tarjeta);

      const etiqueta = new CSS2DObject(ancla);
      etiqueta.position.set(0, 0, 0);
      etiqueta.center.set(0.5, 0.5);

      // Medimos el tamaño natural de la tarjeta para recortar las flechas en su borde exacto.
      this.css.domElement.appendChild(ancla);
      const hw = Math.ceil(tarjeta.offsetWidth / 2) + 3;
      const hh = Math.ceil(tarjeta.offsetHeight / 2) + 3;

      const golpe = new THREE.Mesh(
        new THREE.PlaneGeometry(hw * 2 + 10, hh * 2 + 10),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, depthTest: false }),
      );
      golpe.userData = { nodo: d.id };

      tarjeta.addEventListener('click', (e) => {
        e.stopPropagation();
        this.op.alNodo(d.id);
      });
      tarjeta.addEventListener('pointerenter', () => this.ponerHover({ nodo: d.id }));
      tarjeta.addEventListener('pointerleave', () => this.ponerHover(null));
      tarjeta.addEventListener('wheel', (e) => this.reenviarRueda(e), { passive: false });

      g.add(brillo, golpe, etiqueta);
      this.grupoGrafo.add(g);
      this.nodos.set(d.id, { d, g, brillo, golpe, etiqueta, tarjeta, hw, hh, alfa: 1, alfaEtiqueta: 1 });
    }

    // Agrupa las relaciones por par no ordenado para separar flechas paralelas.
    const grupos = new Map();
    for (const r of relaciones) {
      const clave = [r.de, r.a].sort().join('|');
      if (!grupos.has(clave)) grupos.set(clave, []);
      grupos.get(clave).push(r);
    }

    const ancho = this.c.clientWidth || 1;
    const alto = this.c.clientHeight || 1;
    for (const [clave, lista] of grupos) {
      const [u, v] = clave.split('|');
      const pu = posiciones.get(u);
      const pv = posiciones.get(v);
      const dir = new THREE.Vector2(pv.x - pu.x, pv.y - pu.y).normalize();
      const normal = new THREE.Vector2(-dir.y, dir.x);
      lista.forEach((r, k) => {
        const desplaz = (k - (lista.length - 1) / 2) * SEPARACION;
        this.crearArista(r, desplaz, normal, ancho, alto);
      });
    }

    // Partículas que recorren las flechas.
    const total = this.aristas.size * PARTICULAS_POR_ARISTA;
    const geoP = new THREE.BufferGeometry();
    geoP.setAttribute('position', new THREE.BufferAttribute(new Float32Array(total * 3), 3));
    geoP.setAttribute('color', new THREE.BufferAttribute(new Float32Array(total * 3), 3));
    this.particulas = new THREE.Points(
      geoP,
      new THREE.PointsMaterial({
        size: 9, map: TEX_BRILLO, vertexColors: true, transparent: true,
        depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
      }),
    );
    this.particulas.renderOrder = 4;
    this.particulas.visible = !reducirMovimiento;
    this.grupoGrafo.add(this.particulas);
    this.fases = Array.from({ length: total }, (_, i) => (i % PARTICULAS_POR_ARISTA) / PARTICULAS_POR_ARISTA + Math.random() * 0.2);

    this.aplicarTema(temaActual());
    this.aplicarFoco();
  }

  crearArista(r, desplaz, normal, ancho, alto) {
    const tipo = this.op.tipos[r.tipo];
    const color = new THREE.Color(tipo.color);
    const nodoDe = this.nodos.get(r.de);
    const nodoA = this.nodos.get(r.a);
    const p0 = this.posiciones.get(r.de);
    const p2 = this.posiciones.get(r.a);
    const P0 = new THREE.Vector3(p0.x, p0.y, 0);
    const P2 = new THREE.Vector3(p2.x, p2.y, 0);
    const medio = P0.clone().add(P2).multiplyScalar(0.5);
    const ctrl = medio.clone().add(new THREE.Vector3(normal.x, normal.y, 0).multiplyScalar(desplaz * 2));
    const curva = new THREE.QuadraticBezierCurve3(P0, ctrl, P2);
    const pts = curva.getPoints(160);

    let ini = pts.findIndex((q) => !dentroCaja(q, P0, nodoDe.hw + 3, nodoDe.hh + 3));
    let punta = pts.length - 1;
    while (punta > 0 && dentroCaja(pts[punta], P2, nodoA.hw + 2, nodoA.hh + 2)) punta--;
    let base = punta;
    while (base > 0 && pts[base].distanceTo(pts[punta]) < FLECHA) base--;
    if (ini < 0 || base <= ini) {
      ini = 0;
      base = Math.max(1, punta - 1);
    }
    const trazo = pts.slice(ini, base + 1);

    const geo = new LineGeometry();
    geo.setPositions(trazo.flatMap((q) => [q.x, q.y, 0]));
    const mat = new LineMaterial({
      color, linewidth: 2.2, transparent: true, opacity: 0.85, depthTest: false,
      dashed: tipo.estilo === 'punteado', dashSize: 7, gapSize: 5, worldUnits: false,
    });
    mat.resolution.set(ancho, alto);
    const linea = new Line2(geo, mat);
    linea.computeLineDistances();
    linea.renderOrder = 3;

    const forma = new THREE.Shape();
    forma.moveTo(0, 0);
    forma.lineTo(-FLECHA, FLECHA * 0.45);
    forma.lineTo(-FLECHA * 0.75, 0);
    forma.lineTo(-FLECHA, -FLECHA * 0.45);
    forma.closePath();
    const flecha = new THREE.Mesh(new THREE.ShapeGeometry(forma), new THREE.MeshBasicMaterial({ color, transparent: true, depthTest: false }));
    const qPunta = pts[punta];
    const qBase = pts[base];
    flecha.position.copy(qPunta);
    flecha.rotation.z = Math.atan2(qPunta.y - qBase.y, qPunta.x - qBase.x);
    flecha.renderOrder = 3;

    const muestras = trazo.filter((_, i) => i % 6 === 0).concat([trazo[trazo.length - 1]]);
    const golpe = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(muestras), 40, 7, 5, false),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, depthTest: false }),
    );
    golpe.userData = { arista: r.id };

    const div = document.createElement('div');
    div.className = 'arista-etiqueta';
    div.style.setProperty('--c', tipo.color);
    div.innerHTML = tex(r.condicion);
    div.addEventListener('click', (e) => {
      e.stopPropagation();
      this.op.alArista(r.id);
    });
    div.addEventListener('wheel', (e) => this.reenviarRueda(e), { passive: false });
    const etiqueta = new CSS2DObject(div);
    etiqueta.position.copy(curva.getPoint(0.5));
    etiqueta.visible = false;

    this.grupoGrafo.add(linea, flecha, golpe, etiqueta);
    const recorrido = pts.slice(ini, punta + 1);
    let largo = 0;
    for (let i = 1; i < recorrido.length; i++) largo += recorrido[i].distanceTo(recorrido[i - 1]);
    this.aristas.set(r.id, { r, linea, mat, flecha, golpe, etiqueta, color, recorrido, largo, alfa: 1 });
  }

  // ── Foco: qué se resalta y qué se atenúa ──────────────────────────────
  foco() {
    return this.seleccion ?? this.hover;
  }

  focoDeNodo(id) {
    const nodos = new Set([id]);
    const aristas = new Set();
    for (const a of this.aristas.values()) {
      if (this.tiposOcultos.has(a.r.tipo)) continue;
      const nDe = this.nodos.get(a.r.de);
      const nA = this.nodos.get(a.r.a);
      if (this.materiasOcultas.has(nDe.d.materia) || this.materiasOcultas.has(nA.d.materia)) continue;
      if (a.r.de === id || a.r.a === id) {
        aristas.add(a.r.id);
        nodos.add(a.r.de);
        nodos.add(a.r.a);
      }
    }
    return { nodos, aristas };
  }

  focoDeArista(id) {
    const a = this.aristas.get(id);
    return { nodos: new Set([a.r.de, a.r.a]), aristas: new Set([id]) };
  }

  ponerHover(h) {
    if (!h) this.hover = null;
    else if (h.nodo) this.hover = { ...this.focoDeNodo(h.nodo), clave: 'n' + h.nodo };
    else if (h.arista) this.hover = { ...this.focoDeArista(h.arista), clave: 'a' + h.arista };
    this.renderer.domElement.style.cursor = h ? 'pointer' : '';
    this.aplicarFoco();
  }

  seleccionarNodo(id, volar = true) {
    if (!this.nodos.has(id)) return;
    this.seleccion = { ...this.focoDeNodo(id), nodoPrincipal: id };
    this.aplicarFoco();
    if (volar) this.volarANodo(id);
  }

  seleccionarArista(id, volar = true) {
    if (!this.aristas.has(id)) return;
    this.seleccion = this.focoDeArista(id);
    this.aplicarFoco();
    if (volar) this.encuadrarNodos([...this.seleccion.nodos]);
  }

  mostrarCamino(idsAristas) {
    const nodos = new Set();
    for (const id of idsAristas) {
      const a = this.aristas.get(id);
      nodos.add(a.r.de);
      nodos.add(a.r.a);
    }
    this.seleccion = { nodos, aristas: new Set(idsAristas) };
    this.aplicarFoco();
    this.encuadrarNodos([...nodos]);
  }

  limpiarSeleccion() {
    this.seleccion = null;
    this.aplicarFoco();
  }

  setTiposOcultos(conjunto) {
    this.tiposOcultos = new Set(conjunto);
    if (this.seleccion?.nodoPrincipal) this.seleccion = { ...this.focoDeNodo(this.seleccion.nodoPrincipal), nodoPrincipal: this.seleccion.nodoPrincipal };
    this.aplicarFoco();
  }

  setMateriasOcultas(conjunto) {
    this.materiasOcultas = new Set(conjunto);
    if (this.seleccion?.nodoPrincipal) this.seleccion = { ...this.focoDeNodo(this.seleccion.nodoPrincipal), nodoPrincipal: this.seleccion.nodoPrincipal };
    this.aplicarFoco();
  }

  setMostrarCondiciones(v) {
    this.mostrarCondiciones = v;
    this.aplicarFoco();
  }

  aplicarFoco() {
    const f = this.foco();
    for (const n of this.nodos.values()) {
      const ocultaMateria = this.materiasOcultas.has(n.d.materia);
      n.ocultaMateria = ocultaMateria;
      n.tarjeta.classList.toggle('materia-oculta', ocultaMateria);
      const enFoco = !ocultaMateria && (!f || f.nodos.has(n.d.id));
      n.objetivo = ocultaMateria ? 0.04 : enFoco ? 1 : 0.18;
      n.tarjeta.classList.toggle('seleccionada', this.seleccion?.nodoPrincipal === n.d.id);
    }
    for (const a of this.aristas.values()) {
      const nDe = this.nodos.get(a.r.de);
      const nA = this.nodos.get(a.r.a);
      const oculta =
        this.tiposOcultos.has(a.r.tipo) ||
        this.materiasOcultas.has(nDe.d.materia) ||
        this.materiasOcultas.has(nA.d.materia);
      a.oculta = oculta;
      a.objetivo = oculta ? 0 : !f || f.aristas.has(a.r.id) ? 1 : 0.07;
      a.enFoco = !oculta && !!f && f.aristas.has(a.r.id);
    }
  }

  // ── Cámara ────────────────────────────────────────────────────────────
  porPixel(dist) {
    return (2 * dist * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))) / (this.c.clientHeight || 1);
  }

  encuadrarNodos(ids, animado = true) {
    if (!ids.length) return;
    const ps = ids.map((id) => this.posiciones.get(id));
    const xs = ps.map((p) => p.x);
    const ys = ps.map((p) => p.y);
    const minX = Math.min(...xs) - 220;
    const maxX = Math.max(...xs) + 220;
    const minY = Math.min(...ys) - 130;
    const maxY = Math.max(...ys) + 130;
    const W = this.c.clientWidth || 1;
    const H = this.c.clientHeight || 1;
    const izq = W > 820 ? 300 : 0;
    const der = this.op.margenDerecho();
    const libre = Math.max(240, W - izq - der);
    const t = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    let dist = Math.max((maxY - minY) / (2 * t), (maxX - minX) / (2 * t * (libre / H)));
    dist = THREE.MathUtils.clamp(dist, 350, this.controls.maxDistance);
    const cx = (minX + maxX) / 2 + ((der - izq) / 2) * this.porPixel(dist);
    const cy = (minY + maxY) / 2;
    this.volar(new THREE.Vector3(cx, cy, 0), dist, animado);
  }

  encuadrar(animado = true) {
    this.encuadrarNodos([...this.nodos.keys()], animado);
  }

  volarANodo(id) {
    const p = this.posiciones.get(id);
    const actual = this.camera.position.z - this.controls.target.z;
    const dist = Math.min(actual, 950);
    const izq = (this.c.clientWidth || 1) > 820 ? 300 : 0;
    const der = this.op.margenDerecho();
    const cx = p.x + ((der - izq) / 2) * this.porPixel(dist);
    this.volar(new THREE.Vector3(cx, p.y, 0), dist);
  }

  volar(objetivo, dist, animado = true) {
    const destinoCam = objetivo.clone().add(new THREE.Vector3(0, 0, dist));
    if (!animado || reducirMovimiento) {
      this.controls.target.copy(objetivo);
      this.camera.position.copy(destinoCam);
      this.controls.update();
      return;
    }
    this.vuelo = {
      t0: performance.now(),
      dur: 750,
      desdeT: this.controls.target.clone(),
      desdeC: this.camera.position.clone(),
      hastaT: objetivo,
      hastaC: destinoCam,
    };
  }

  // ── Eventos ───────────────────────────────────────────────────────────
  instalarEventos() {
    const el = this.renderer.domElement;
    let abajo = null;
    let pendiente = null;
    el.addEventListener('pointerdown', (e) => {
      abajo = { x: e.clientX, y: e.clientY };
      this.vuelo = null;
    });
    el.addEventListener('pointerup', (e) => {
      if (!abajo) return;
      const movio = Math.hypot(e.clientX - abajo.x, e.clientY - abajo.y) > 5;
      abajo = null;
      if (movio) return;
      const h = this.elegir(e.clientX, e.clientY);
      if (h?.nodo) this.op.alNodo(h.nodo);
      else if (h?.arista) this.op.alArista(h.arista);
      else this.op.alFondo();
    });
    el.addEventListener('pointermove', (e) => {
      if (e.buttons) {
        this.ocultarTooltip();
        return;
      }
      pendiente = e;
      requestAnimationFrame(() => {
        if (!pendiente) return;
        const ev = pendiente;
        pendiente = null;
        const h = this.elegir(ev.clientX, ev.clientY);
        const clave = h?.nodo ? 'n' + h.nodo : h?.arista ? 'a' + h.arista : null;
        if (clave !== (this.hover?.clave ?? null)) this.ponerHover(h);
        if (h?.arista) this.mostrarTooltip(h.arista, ev.clientX, ev.clientY);
        else this.ocultarTooltip();
      });
    });
    el.addEventListener('pointerleave', () => {
      this.ponerHover(null);
      this.ocultarTooltip();
    });
  }

  reenviarRueda(e) {
    e.preventDefault();
    this.renderer.domElement.dispatchEvent(new WheelEvent('wheel', e));
  }

  elegir(cx, cy) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const nodosVisibles = [...this.nodos.values()].filter((n) => !n.ocultaMateria).map((n) => n.golpe);
    const golpesN = this.raycaster.intersectObjects(nodosVisibles, false);
    if (golpesN.length) return { nodo: golpesN[0].object.userData.nodo };
    const visibles = [...this.aristas.values()].filter((a) => !a.oculta).map((a) => a.golpe);
    const golpesA = this.raycaster.intersectObjects(visibles, false);
    if (golpesA.length) return { arista: golpesA[0].object.userData.arista };
    return null;
  }

  mostrarTooltip(id, x, y) {
    const a = this.aristas.get(id);
    const tipo = this.op.tipos[a.r.tipo];
    const de = this.op.porId.get(a.r.de).nombre;
    const hacia = this.op.porId.get(a.r.a).nombre;
    const t = this.op.tooltip;
    t.innerHTML = `<div class="tt-tipo" style="color:${tipo.color}">${escaparHTML(tipo.nombre)}</div>
      <div class="tt-ruta">${escaparHTML(de)} → ${escaparHTML(hacia)}</div>
      <div class="tt-cond">${tex(a.r.condicion)}</div>`;
    t.hidden = false;
    const w = t.offsetWidth;
    t.style.left = Math.min(x + 16, window.innerWidth - w - 8) + 'px';
    t.style.top = y + 16 + 'px';
  }

  ocultarTooltip() {
    this.op.tooltip.hidden = true;
  }

  redimensionar() {
    const w = this.c.clientWidth || 1;
    const h = this.c.clientHeight || 1;
    this.renderer.setSize(w, h);
    this.css.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.matDivisor?.resolution.set(w, h);
    for (const a of this.aristas.values()) a.mat.resolution.set(w, h);
  }

  // ── Bucle de animación ────────────────────────────────────────────────
  cuadro() {
    const t = this.reloj.getElapsedTime();

    if (this.vuelo) {
      const v = this.vuelo;
      const u = Math.min(1, (performance.now() - v.t0) / v.dur);
      const k = suave(u);
      this.controls.target.lerpVectors(v.desdeT, v.hastaT, k);
      this.camera.position.lerpVectors(v.desdeC, v.hastaC, k);
      if (u >= 1) this.vuelo = null;
    }
    this.controls.update();

    const dist = this.camera.position.z - this.controls.target.z;
    const escalaMundo = THREE.MathUtils.clamp(1 / this.porPixel(dist), 0.35, 2.5);
    this.css.domElement.style.setProperty('--escala-mundo', escalaMundo.toFixed(4));

    const cerca = dist < 750;
    const f = this.foco();

    for (const n of this.nodos.values()) {
      n.alfa += (n.objetivo - n.alfa) * 0.18;
      const maxBrillo = this.tema?.esClaro ? 0.14 : 0.38;
      n.brillo.material.opacity = maxBrillo * n.alfa;
      const ae = n.ocultaMateria ? 0.08 * (n.alfa / 0.04) : 0.22 + 0.78 * n.alfa;
      if (Math.abs(ae - n.alfaEtiqueta) > 0.01) {
        n.alfaEtiqueta = ae;
        n.etiqueta.element.style.opacity = ae.toFixed(2);
      }
    }

    for (const a of this.aristas.values()) {
      a.alfa += (a.objetivo - a.alfa) * 0.18;
      a.mat.opacity = 0.9 * a.alfa;
      a.flecha.material.opacity = 0.95 * a.alfa;
      a.linea.visible = a.flecha.visible = a.alfa > 0.01;
      a.etiqueta.visible = !a.oculta && (a.enFoco || (!f && (this.mostrarCondiciones || cerca)));
    }

    if (this.particulas?.visible) {
      const pos = this.particulas.geometry.attributes.position;
      const col = this.particulas.geometry.attributes.color;
      let i = 0;
      for (const a of this.aristas.values()) {
        for (let j = 0; j < PARTICULAS_POR_ARISTA; j++, i++) {
          const u = ((t * 55) / Math.max(a.largo, 1) + this.fases[i]) % 1;
          const idx = u * (a.recorrido.length - 1);
          const i0 = Math.floor(idx);
          const i1 = Math.min(i0 + 1, a.recorrido.length - 1);
          const q0 = a.recorrido[i0];
          const q1 = a.recorrido[i1];
          const fr = idx - i0;
          pos.setXYZ(i, q0.x + (q1.x - q0.x) * fr, q0.y + (q1.y - q0.y) * fr, 0);
          const brillo = a.alfa * Math.sin(Math.PI * u) * 0.9;
          col.setXYZ(i, a.color.r * brillo, a.color.g * brillo, a.color.b * brillo);
        }
      }
      pos.needsUpdate = true;
      col.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
    this.css.render(this.scene, this.camera);
  }
}
