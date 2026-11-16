// Superficie 3D en three.js: muestra cómo cambia la fmp/fdp al mover un parámetro.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { superficie } from '../mate/muestreo.js';
import { temaActual } from '../ui/temas.js';

export class Superficie3D {
  /** @param {HTMLElement} contenedor */
  constructor(contenedor) {
    this.c = contenedor;
    const renderer = (this.renderer = new THREE.WebGLRenderer({ antialias: true }));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(temaActual().superficieFondo);
    contenedor.appendChild(renderer.domElement);
    this.alTema = (e) => renderer.setClearColor(e.detail.superficieFondo);
    window.addEventListener('cambio-tema', this.alTema);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    this.camera.position.set(2.3, 1.9, 2.5);

    const ctl = (this.controls = new OrbitControls(this.camera, renderer.domElement));
    ctl.enableDamping = true;
    ctl.target.set(0, 0.35, 0);
    ctl.maxPolarAngle = Math.PI * 0.49;
    ctl.minDistance = 1.4;
    ctl.maxDistance = 6;

    const base = new THREE.GridHelper(2, 10, 0x334155, 0x1e293b);
    this.scene.add(base);

    this.grupo = new THREE.Group();
    this.scene.add(this.grupo);

    this.ro = new ResizeObserver(() => this.redimensionar());
    this.ro.observe(contenedor);
    this.redimensionar();

    renderer.setAnimationLoop(() => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    });
  }

  actualizar(d, p) {
    for (const h of [...this.grupo.children]) {
      h.geometry?.dispose();
      h.material?.dispose();
      this.grupo.remove(h);
    }
    if (!d.superficie) return;

    const { xs, valores, z, zmax } = superficie(d, p);
    const filas = valores.length;
    const cols = xs.length;
    if (filas < 2 || cols < 2 || zmax <= 0) return;

    const xmin = xs[0];
    const xmax = xs[cols - 1] || xmin + 1;
    const vmin = valores[0];
    const vmax = valores[filas - 1] || vmin + 1;
    const ax = (x) => (xmax === xmin ? 0 : ((x - xmin) / (xmax - xmin)) * 2 - 1);
    const az = (v) => (vmax === vmin ? 0 : ((v - vmin) / (vmax - vmin)) * 2 - 1);
    const ay = (y) => (y / zmax) * 1.1;

    const pos = new Float32Array(filas * cols * 3);
    const col = new Float32Array(filas * cols * 3);
    const cBajo = new THREE.Color(d.tipo === 'discreta' ? '#1e3a8a' : '#134e4a');
    const cMedio = new THREE.Color(d.tipo === 'discreta' ? '#f59e0b' : '#14b8a6');
    const cAlto = new THREE.Color('#fef3c7');
    const tmp = new THREE.Color();

    let k = 0;
    for (let i = 0; i < filas; i++) {
      for (let j = 0; j < cols; j++, k++) {
        const y = ay(z[i][j]);
        pos[k * 3] = ax(xs[j]);
        pos[k * 3 + 1] = y;
        pos[k * 3 + 2] = az(valores[i]);
        const t = z[i][j] / zmax;
        tmp.copy(t < 0.5 ? cBajo : cMedio).lerp(t < 0.5 ? cMedio : cAlto, t < 0.5 ? t * 2 : (t - 0.5) * 2);
        col[k * 3] = tmp.r;
        col[k * 3 + 1] = tmp.g;
        col[k * 3 + 2] = tmp.b;
      }
    }

    const idx = [];
    for (let i = 0; i < filas - 1; i++) {
      for (let j = 0; j < cols - 1; j++) {
        const a = i * cols + j;
        const b = a + 1;
        const c = a + cols;
        const e = c + 1;
        idx.push(a, c, b, b, c, e);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();

    const malla = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: true, opacity: 0.92 }),
    );
    const alambre = new THREE.LineSegments(
      new THREE.WireframeGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.14 }),
    );
    this.grupo.add(malla, alambre);

    // Resalta la curva correspondiente al valor actual del parámetro.
    const actual = p[d.superficie.param];
    if (actual >= vmin && actual <= vmax) {
      const zActual = az(actual);
      const pts = xs.map((x) => new THREE.Vector3(ax(x), ay(d.calc.densidad(x, p)) + 0.01, zActual));
      const geoC = new THREE.BufferGeometry().setFromPoints(pts);
      const linea = new THREE.Line(geoC, new THREE.LineBasicMaterial({ color: 0xffffff }));
      this.grupo.add(linea);
    }
  }

  redimensionar() {
    const w = this.c.clientWidth || 320;
    const h = 230;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  desmontar() {
    window.removeEventListener('cambio-tema', this.alTema);
    this.ro.disconnect();
    this.renderer.setAnimationLoop(null);
    this.renderer.dispose();
  }
}
