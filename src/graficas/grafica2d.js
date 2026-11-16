// Gráfica 2D en Canvas: muestra la fmp/fdp o la FDA y responde al ratón.

import { muestrear, marcas, fmt } from '../mate/muestreo.js';
import { COLOR_TIPO } from '../grafo/mapa.js';
import { temaActual } from '../ui/temas.js';

export class Grafica2D {
  /** @param {HTMLElement} contenedor */
  constructor(contenedor) {
    this.c = contenedor;
    this.modo = 'densidad'; // 'densidad' | 'fda'
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'lienzo-2d';
    this.lectura = document.createElement('div');
    this.lectura.className = 'lectura-2d';
    contenedor.append(this.canvas, this.lectura);

    this.cursorX = null;
    this.canvas.addEventListener('pointermove', (e) => {
      const r = this.canvas.getBoundingClientRect();
      this.cursorX = e.clientX - r.left;
      this.dibujar();
    });
    this.canvas.addEventListener('pointerleave', () => {
      this.cursorX = null;
      this.lectura.textContent = '';
      this.dibujar();
    });

    this.alTema = () => this.dibujar();
    window.addEventListener('cambio-tema', this.alTema);
    this.ro = new ResizeObserver(() => this.dibujar());
    this.ro.observe(contenedor);
  }

  actualizar(d, p, modo = this.modo) {
    this.d = d;
    this.p = p;
    this.modo = modo;
    this.muestra = muestrear(d, p);
    this.dibujar();
  }

  dibujar() {
    if (!this.muestra) return;
    const w = this.c.clientWidth || 320;
    const h = 210;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.height = h + 'px';
    const g = this.canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);

    const { xs, ys, fda, discreta } = this.muestra;
    const serie = this.modo === 'fda' ? fda : ys;
    const pad = { izq: 44, der: 14, arr: 14, aba: 28 };
    const pw = w - pad.izq - pad.der;
    const ph = h - pad.arr - pad.aba;

    let xmin = xs[0];
    let xmax = xs[xs.length - 1];
    if (xmin === xmax) {
      xmin -= 1;
      xmax += 1;
    } else if (discreta) {
      xmin -= 0.6;
      xmax += 0.6;
    }
    const ymax = this.modo === 'fda' ? 1 : Math.max(...serie, 1e-6) * 1.12;

    const ax = (x) => pad.izq + ((x - xmin) / (xmax - xmin)) * pw;
    const ay = (y) => pad.arr + ph - (y / ymax) * ph;

    // Retícula y marcas.
    const tema = temaActual();
    g.font = '11px system-ui, sans-serif';
    g.strokeStyle = tema.graficaReticula;
    g.fillStyle = tema.graficaTexto;
    g.lineWidth = 1;
    for (const v of marcas(0, ymax, 4)) {
      const y = ay(v);
      g.beginPath();
      g.moveTo(pad.izq, y);
      g.lineTo(w - pad.der, y);
      g.stroke();
      g.textAlign = 'right';
      g.textBaseline = 'middle';
      g.fillText(fmt(v, 3), pad.izq - 6, y);
    }
    for (const v of marcas(Math.ceil(xmin), Math.floor(xmax), 6)) {
      if (v < xmin || v > xmax) continue;
      const x = ax(v);
      g.beginPath();
      g.moveTo(x, pad.arr);
      g.lineTo(x, pad.arr + ph);
      g.stroke();
      g.textAlign = 'center';
      g.textBaseline = 'top';
      g.fillText(fmt(v, 2), x, pad.arr + ph + 6);
    }

    const color = COLOR_TIPO[this.d.tipo];
    const baseY = ay(0);

    if (discreta && this.modo === 'densidad') {
      // Bastones (lollipop) para la función de masa de probabilidad.
      g.strokeStyle = color;
      g.fillStyle = color;
      g.lineWidth = xs.length > 40 ? 1.5 : 2.2;
      const r = xs.length > 45 ? 2.2 : 3.6;
      for (let i = 0; i < xs.length; i++) {
        const x = ax(xs[i]);
        const y = ay(serie[i]);
        g.beginPath();
        g.moveTo(x, baseY);
        g.lineTo(x, y);
        g.stroke();
        g.beginPath();
        g.arc(x, y, r, 0, Math.PI * 2);
        g.fill();
      }
    } else if (discreta && this.modo === 'fda') {
      // Escalones para la FDA discreta.
      g.strokeStyle = color;
      g.fillStyle = color;
      g.lineWidth = 2;
      let yAnt = ay(0);
      let xAnt = ax(xmin);
      for (let i = 0; i < xs.length; i++) {
        const x = ax(xs[i]);
        const y = ay(serie[i]);
        g.beginPath();
        g.moveTo(xAnt, yAnt);
        g.lineTo(x, yAnt);
        g.stroke();
        g.beginPath();
        g.arc(x, y, 2.8, 0, Math.PI * 2);
        g.fill();
        xAnt = x;
        yAnt = y;
      }
      g.beginPath();
      g.moveTo(xAnt, yAnt);
      g.lineTo(ax(xmax), yAnt);
      g.stroke();
    } else {
      // Curva continua con relleno degradado.
      const grad = g.createLinearGradient(0, pad.arr, 0, baseY);
      grad.addColorStop(0, color + '55');
      grad.addColorStop(1, color + '05');
      g.beginPath();
      g.moveTo(ax(xs[0]), baseY);
      for (let i = 0; i < xs.length; i++) g.lineTo(ax(xs[i]), ay(serie[i]));
      g.lineTo(ax(xs[xs.length - 1]), baseY);
      g.closePath();
      g.fillStyle = grad;
      g.fill();

      g.beginPath();
      for (let i = 0; i < xs.length; i++) {
        const x = ax(xs[i]);
        const y = ay(serie[i]);
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.strokeStyle = color;
      g.lineWidth = 2.2;
      g.stroke();
    }

    // Línea vertical en la media (en modo densidad).
    const media = this.d.calc.media(this.p);
    if (this.modo === 'densidad' && media >= xmin && media <= xmax) {
      const xm = ax(media);
      g.save();
      g.setLineDash([4, 4]);
      g.strokeStyle = tema.graficaMedia;
      g.beginPath();
      g.moveTo(xm, pad.arr);
      g.lineTo(xm, baseY);
      g.stroke();
      g.restore();
    }

    // Lectura bajo el cursor.
    if (this.cursorX !== null && this.cursorX >= pad.izq && this.cursorX <= w - pad.der) {
      const xMundo = xmin + ((this.cursorX - pad.izq) / pw) * (xmax - xmin);
      let mejor = 0;
      for (let i = 1; i < xs.length; i++) {
        if (Math.abs(xs[i] - xMundo) < Math.abs(xs[mejor] - xMundo)) mejor = i;
      }
      const x = xs[mejor];
      const y = serie[mejor];
      const px = ax(x);
      const py = ay(y);
      g.fillStyle = tema.graficaPunto;
      g.beginPath();
      g.arc(px, py, 4.2, 0, Math.PI * 2);
      g.fill();
      const etq = this.modo === 'fda' ? `F(${fmt(x, 2)}) = ${fmt(y, 4)}` : discreta ? `P(X = ${x}) = ${fmt(y, 4)}` : `f(${fmt(x, 2)}) = ${fmt(y, 4)}`;
      this.lectura.textContent = etq;
    }
  }

  desmontar() {
    window.removeEventListener('cambio-tema', this.alTema);
    this.ro.disconnect();
  }
}
