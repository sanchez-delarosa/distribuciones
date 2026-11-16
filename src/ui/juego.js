// Modo Juego (Quiz interactivo de opción múltiple con fórmulas en KaTeX).
// Permite elegir qué materias entran al quiz, genera preguntas aleatorias de 7 tipos
// y permite como máximo 1 intento erróneo por partida.

import { DISTRIBUCIONES, RELS, MATERIAS, TIPOS_RELACION, PROPIEDADES, porId, materiaDe } from '../datos/index.js';
import { tex, texto, escaparHTML } from './tex.js';
import { notacionCorta } from '../grafo/mapa.js';

const CLAVE_RECORD = 'udr-record-juego';

/** Quita el miembro izquierdo de una fórmula (por ejemplo "E[X] = \\frac{1}{\\lambda}" → "\\frac{1}{\\lambda}"). */
function ladoDerecho(formula) {
  if (!formula) return '';
  const idx = formula.indexOf('=');
  if (idx < 0 || idx > 38) return formula;
  return formula.slice(idx + 1).trim();
}

/** Mezcla un arreglo con Fisher–Yates y devuelve una copia. */
function barajar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Elige `k` elementos distintos al azar de `lista` cuyo valor transformado por `fn` no esté en `prohibidos`. */
function elegirDistractores(lista, k, fnValor, prohibidos) {
  const candidatos = barajar(lista);
  const res = [];
  const vistos = new Set(prohibidos);
  for (const item of candidatos) {
    const val = fnValor(item);
    if (!val || vistos.has(val)) continue;
    vistos.add(val);
    res.push(val);
    if (res.length >= k) break;
  }
  return res;
}

export class JuegoQuiz {
  /**
   * @param {HTMLElement} modal
   * @param {{ alVerNodo: (id: string) => void }} op
   */
  constructor(modal, op) {
    this.modal = modal;
    this.op = op;
    this.materiasSeleccionadas = new Set(Object.keys(MATERIAS));
    this.aciertos = 0;
    this.errores = 0; // máximo 1 error permitido; al 2.º error termina la partida
    this.maxErrores = 1;
    this.record = Number(localStorage.getItem(CLAVE_RECORD) || 0);
    this.historial = [];
    this.preguntaActual = null;
    this.respondida = false;

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.cerrar();
    });
  }

  abrir() {
    this.modal.hidden = false;
    this.mostrarConfiguracion();
  }

  cerrar() {
    this.modal.hidden = true;
  }

  distribucionesActivas() {
    return DISTRIBUCIONES.filter((d) => this.materiasSeleccionadas.has(d.materia));
  }

  // ── Pantalla 1: Configuración de materias ─────────────────────────────
  mostrarConfiguracion() {
    const listaMaterias = Object.values(MATERIAS).sort((a, b) => a.orden - b.orden);
    const conteo = new Map(listaMaterias.map((m) => [m.id, 0]));
    for (const d of DISTRIBUCIONES) conteo.set(d.materia, (conteo.get(d.materia) ?? 0) + 1);
    const totalDist = this.distribucionesActivas().length;

    this.modal.innerHTML = `
      <div class="juego-caja tarjeta">
        <div class="juego-cabecera">
          <div>
            <span class="insignia continua">Modo Juego · Quiz</span>
            <h2>Pon a prueba tus conocimientos</h2>
          </div>
          <button class="panel-cerrar" id="juego-cerrar" aria-label="Cerrar juego">×</button>
        </div>

        <p class="juego-intro">
          Preguntas aleatorias sobre densidades, medias, varianzas, generadoras, tasas de riesgo y relaciones entre distribuciones.
          <strong>Regla:</strong> tienes permitido como máximo <strong>1 intento erróneo</strong> (al segundo error termina la partida).
        </p>

        <div class="juego-record-barra">
          <div><span>Mejor racha</span><strong>🏆 ${this.record} aciertos</strong></div>
          <div><span>Errores permitidos</span><strong>❤️ Máximo 1 error</strong></div>
          <div><span>Distribuciones activas</span><strong id="juego-total-dist">${totalDist}</strong></div>
        </div>

        <div class="juego-seccion-materias">
          <div class="juego-materias-arriba">
            <h3>Elige qué materias entran en el quiz</h3>
            <div class="juego-acciones-mat">
              <button type="button" class="boton secundario btn-mini" id="juego-mat-todas">Todas</button>
              <button type="button" class="boton secundario btn-mini" id="juego-mat-prob1">Solo Prob. I</button>
            </div>
          </div>
          <div class="juego-rejilla-materias" id="juego-materias">
            ${listaMaterias
              .map((m) => {
                const activa = this.materiasSeleccionadas.has(m.id);
                return `
                  <button type="button" class="chip-juego-materia ${activa ? 'activa' : ''}" data-mat="${m.id}" style="--color-materia:${m.color}">
                    <span class="punto punto-materia"></span>
                    <span class="cjm-nombre">${escaparHTML(m.nombre)}</span>
                    <span class="cjm-conteo">${conteo.get(m.id)}</span>
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>

        <div class="juego-pie">
          <span class="juego-aviso" id="juego-aviso" hidden>Selecciona al menos una materia para comenzar.</span>
          <button type="button" class="boton boton-jugar-grande" id="juego-iniciar">▶ Comenzar partida</button>
        </div>
      </div>
    `;

    this.modal.querySelector('#juego-cerrar').addEventListener('click', () => this.cerrar());
    const btnIniciar = this.modal.querySelector('#juego-iniciar');
    const aviso = this.modal.querySelector('#juego-aviso');
    const lblTotal = this.modal.querySelector('#juego-total-dist');

    const actualizarEstadoMaterias = () => {
      for (const b of this.modal.querySelectorAll('.chip-juego-materia')) {
        b.classList.toggle('activa', this.materiasSeleccionadas.has(b.dataset.mat));
      }
      const n = this.distribucionesActivas().length;
      lblTotal.textContent = String(n);
      const ok = n >= 4;
      btnIniciar.disabled = !ok;
      aviso.hidden = ok;
    };

    for (const b of this.modal.querySelectorAll('.chip-juego-materia')) {
      b.addEventListener('click', () => {
        const id = b.dataset.mat;
        if (this.materiasSeleccionadas.has(id)) this.materiasSeleccionadas.delete(id);
        else this.materiasSeleccionadas.add(id);
        actualizarEstadoMaterias();
      });
    }

    this.modal.querySelector('#juego-mat-todas').addEventListener('click', () => {
      this.materiasSeleccionadas = new Set(Object.keys(MATERIAS));
      actualizarEstadoMaterias();
    });

    this.modal.querySelector('#juego-mat-prob1').addEventListener('click', () => {
      this.materiasSeleccionadas = new Set(['probabilidad']);
      actualizarEstadoMaterias();
    });

    btnIniciar.addEventListener('click', () => {
      if (this.distribucionesActivas().length < 4) return;
      this.iniciarPartida();
    });
  }

  iniciarPartida() {
    this.aciertos = 0;
    this.errores = 0;
    this.historial = [];
    this.siguientePregunta();
  }

  // ── Generador aleatorio de preguntas ──────────────────────────────────
  generarPregunta() {
    const activas = this.distribucionesActivas();
    const idsActivos = new Set(activas.map((d) => d.id));
    const relsActivas = RELS.filter((r) => idsActivos.has(r.de) && idsActivos.has(r.a));

    // Tipos posibles de pregunta con pesos equilibrados
    const generadores = [
      () => this.pregFormulaDirecta(activas, 'media', '¿Cuál es la esperanza matemática $E[X]$ de la distribución'),
      () => this.pregFormulaDirecta(activas, 'varianza', '¿Cuál es la varianza $\\operatorname{Var}(X)$ de la distribución'),
      () => this.pregFormulaDirecta(activas, 'densidad', '¿Cuál es la función de masa o densidad de la distribución'),
      () => this.pregInversaDensidad(activas),
      () => this.pregInversaMediaVarianza(activas),
      () => this.pregExtraOGeneradora(activas),
      () => (relsActivas.length >= 4 ? this.pregRelacionDestino(activas, relsActivas) : null),
      () => (relsActivas.length >= 4 ? this.pregRelacionCondicion(relsActivas) : null),
    ];

    for (const gen of barajar(generadores)) {
      const p = gen();
      if (p) return p;
    }
    return this.pregFormulaDirecta(activas, 'media', '¿Cuál es la esperanza matemática $E[X]$ de la distribución');
  }

  pregFormulaDirecta(activas, campo, prefijo) {
    const conCampo = activas.filter((d) => {
      const f = d.formulas[campo];
      return f && !f.includes('No existe') && !f.includes('\\infty');
    });
    if (conCampo.length < 4) return null;
    const d = conCampo[Math.floor(Math.random() * conCampo.length)];
    const correcta = ladoDerecho(d.formulas[campo]);
    // Preferimos distractores del mismo tipo (discreta/continua)
    const mismoTipo = conCampo.filter((x) => x.tipo === d.tipo && x.id !== d.id);
    const pool = mismoTipo.length >= 3 ? [...mismoTipo, ...conCampo] : conCampo;
    const distractores = elegirDistractores(pool, 3, (x) => ladoDerecho(x.formulas[campo]), [correcta]);
    if (distractores.length < 3) return null;

    const mat = materiaDe(d);
    return {
      nodoId: d.id,
      materia: mat,
      categoria: campo === 'media' ? 'Esperanza E[X]' : campo === 'varianza' ? 'Varianza Var(X)' : 'Densidad / Masa',
      enunciado: `${texto(prefijo)} <strong>${escaparHTML(d.nombre)}</strong> (${tex(notacionCorta(d))})?`,
      formulaDestacada: null,
      correcta,
      opciones: barajar([correcta, ...distractores]),
      esTex: true,
      explicacion: `Para ${tex(d.notacion)}, se cumple ${tex(d.formulas[campo])}.`,
    };
  }

  pregInversaDensidad(activas) {
    const d = activas[Math.floor(Math.random() * activas.length)];
    const correcta = `${escaparHTML(d.nombre)} · ${tex(notacionCorta(d))}`;
    const mismoTipo = activas.filter((x) => x.tipo === d.tipo && x.id !== d.id);
    const pool = mismoTipo.length >= 3 ? [...mismoTipo, ...activas] : activas;
    const distractores = elegirDistractores(
      pool,
      3,
      (x) => `${escaparHTML(x.nombre)} · ${tex(notacionCorta(x))}`,
      [correcta],
    );
    if (distractores.length < 3) return null;

    return {
      nodoId: d.id,
      materia: materiaDe(d),
      categoria: 'Identificar distribución',
      enunciado: `¿A qué distribución (${d.tipo}) con soporte ${tex(d.soporte)} corresponde la siguiente función de ${d.tipo === 'discreta' ? 'masa' : 'densidad'}?`,
      formulaDestacada: d.formulas.densidad,
      correcta,
      opciones: barajar([correcta, ...distractores]),
      esTex: false,
      explicacion: `La fórmula corresponde a <strong>${escaparHTML(d.nombre)}</strong> (${tex(d.notacion)}).`,
    };
  }

  pregInversaMediaVarianza(activas) {
    const validas = activas.filter(
      (d) =>
        d.formulas.media &&
        d.formulas.varianza &&
        !d.formulas.media.includes('No existe') &&
        !d.formulas.varianza.includes('No existe') &&
        !d.formulas.media.includes('\\infty') &&
        !d.formulas.varianza.includes('\\infty'),
    );
    if (validas.length < 4) return null;
    const d = validas[Math.floor(Math.random() * validas.length)];
    const correcta = `${escaparHTML(d.nombre)} · ${tex(notacionCorta(d))}`;
    const distractores = elegirDistractores(
      validas,
      3,
      (x) => `${escaparHTML(x.nombre)} · ${tex(notacionCorta(x))}`,
      [correcta],
    );
    if (distractores.length < 3) return null;

    return {
      nodoId: d.id,
      materia: materiaDe(d),
      categoria: 'Momentos característicos',
      enunciado: `¿Qué distribución (${d.tipo}) en ${tex(d.soporte)} tiene los siguientes momentos?`,
      formulaDestacada: `${d.formulas.media}, \\qquad ${d.formulas.varianza}`,
      correcta,
      opciones: barajar([correcta, ...distractores]),
      esTex: false,
      explicacion: `Esos momentos caracterizan a <strong>${escaparHTML(d.nombre)}</strong> (${tex(d.notacion)}).`,
    };
  }

  pregExtraOGeneradora(activas) {
    const conFgm = activas.filter((d) => d.formulas.fgm && !d.formulas.fgm.includes('No existe'));
    if (conFgm.length < 4) return null;
    const d = conFgm[Math.floor(Math.random() * conFgm.length)];
    const correcta = ladoDerecho(d.formulas.fgm);
    const distractores = elegirDistractores(conFgm, 3, (x) => ladoDerecho(x.formulas.fgm), [correcta]);
    if (distractores.length < 3) return null;

    return {
      nodoId: d.id,
      materia: materiaDe(d),
      categoria: 'Función generadora',
      enunciado: `${texto('¿Cuál es la función generadora de momentos $M_X(t)$ de')} <strong>${escaparHTML(d.nombre)}</strong> (${tex(notacionCorta(d))})?`,
      formulaDestacada: null,
      correcta,
      opciones: barajar([correcta, ...distractores]),
      esTex: true,
      explicacion: `Para ${tex(d.notacion)}, ${tex(d.formulas.fgm)}.`,
    };
  }

  pregRelacionDestino(activas, relsActivas) {
    const r = relsActivas[Math.floor(Math.random() * relsActivas.length)];
    const de = porId.get(r.de);
    const a = porId.get(r.a);
    const infoTipo = TIPOS_RELACION[r.tipo];
    const correcta = `${escaparHTML(a.nombre)} · ${tex(notacionCorta(a))}`;
    const distractores = elegirDistractores(
      activas.filter((x) => x.id !== de.id),
      3,
      (x) => `${escaparHTML(x.nombre)} · ${tex(notacionCorta(x))}`,
      [correcta],
    );
    if (distractores.length < 3) return null;

    return {
      nodoId: a.id,
      materia: materiaDe(a),
      categoria: `Relación · ${infoTipo.nombre}`,
      enunciado: `Si partimos de <strong>${escaparHTML(de.nombre)}</strong> (${tex(notacionCorta(de))}) y aplicamos la relación de <em>${escaparHTML(infoTipo.nombre.toLowerCase())}</em> dada por:`,
      formulaDestacada: r.condicion,
      correcta,
      opciones: barajar([correcta, ...distractores]),
      esTex: false,
      explicacion: texto(r.explicacion),
    };
  }

  pregRelacionCondicion(relsActivas) {
    const r = relsActivas[Math.floor(Math.random() * relsActivas.length)];
    const de = porId.get(r.de);
    const a = porId.get(r.a);
    const infoTipo = TIPOS_RELACION[r.tipo];
    const correcta = r.condicion;
    const distractores = elegirDistractores(relsActivas, 3, (x) => x.condicion, [correcta]);
    if (distractores.length < 3) return null;

    return {
      nodoId: de.id,
      materia: materiaDe(de),
      categoria: `Condición · ${infoTipo.nombre}`,
      enunciado: `¿Qué transformación, condición o límite conecta a <strong>${escaparHTML(de.nombre)}</strong> con <strong>${escaparHTML(a.nombre)}</strong> mediante <em>${escaparHTML(infoTipo.nombre.toLowerCase())}</em>?`,
      formulaDestacada: null,
      correcta,
      opciones: barajar([correcta, ...distractores]),
      esTex: true,
      explicacion: texto(r.explicacion),
    };
  }

  // ── Pantalla 2: Pregunta activa ───────────────────────────────────────
  siguientePregunta() {
    this.respondida = false;
    this.preguntaActual = this.generarPregunta();
    const p = this.preguntaActual;
    const letras = ['A', 'B', 'C', 'D'];
    const vidasHTML =
      this.errores === 0
        ? '<span class="vidas-ok">❤️ ❤️</span> <small>(1 error permitido)</small>'
        : '<span class="vidas-alerta">❤️ 🖤</span> <small>(¡Sin margen de error!)</small>';

    this.modal.innerHTML = `
      <div class="juego-caja tarjeta">
        <div class="juego-barra-estado">
          <div class="jbe-item"><span>Aciertos</span><strong>${this.aciertos}</strong></div>
          <div class="jbe-item"><span>Récord</span><strong>🏆 ${this.record}</strong></div>
          <div class="jbe-item"><span>Vidas</span><strong>${vidasHTML}</strong></div>
          <button type="button" class="boton secundario btn-mini" id="juego-cambiar-mat" title="Cambiar materias">⚙ Materias</button>
          <button type="button" class="panel-cerrar" id="juego-cerrar" aria-label="Cerrar juego">×</button>
        </div>

        <div class="juego-meta-pregunta">
          <span class="insignia insignia-materia" style="--color-materia:${p.materia.color}">${escaparHTML(p.materia.nombre)}</span>
          <span class="insignia continua">${escaparHTML(p.categoria)}</span>
        </div>

        <div class="juego-enunciado">${p.enunciado}</div>
        ${p.formulaDestacada ? `<div class="juego-formula-destacada">${tex(p.formulaDestacada, true)}</div>` : ''}

        <div class="juego-opciones" role="radiogroup">
          ${p.opciones
            .map(
              (op, i) => `
            <button type="button" class="juego-opcion" data-indice="${i}">
              <span class="jo-letra">${letras[i]}</span>
              <span class="jo-contenido">${p.esTex ? tex(op) : op}</span>
            </button>
          `,
            )
            .join('')}
        </div>

        <div id="juego-retro" class="juego-retro" hidden></div>
      </div>
    `;

    this.modal.querySelector('#juego-cerrar').addEventListener('click', () => this.cerrar());
    this.modal.querySelector('#juego-cambiar-mat').addEventListener('click', () => this.mostrarConfiguracion());

    for (const btn of this.modal.querySelectorAll('.juego-opcion')) {
      btn.addEventListener('click', () => this.responder(Number(btn.dataset.indice)));
    }
  }

  responder(indice) {
    if (this.respondida) return;
    this.respondida = true;
    const p = this.preguntaActual;
    const elegida = p.opciones[indice];
    const esCorrecta = elegida === p.correcta;

    if (esCorrecta) {
      this.aciertos++;
      if (this.aciertos > this.record) {
        this.record = this.aciertos;
        localStorage.setItem(CLAVE_RECORD, String(this.record));
      }
    } else {
      this.errores++;
    }

    this.historial.push({
      enunciado: p.enunciado,
      correcta: p.esTex ? tex(p.correcta) : p.correcta,
      acierto: esCorrecta,
      nodoId: p.nodoId,
    });

    for (const btn of this.modal.querySelectorAll('.juego-opcion')) {
      const i = Number(btn.dataset.indice);
      const op = p.opciones[i];
      btn.disabled = true;
      if (op === p.correcta) btn.classList.add('correcta');
      else if (i === indice && !esCorrecta) btn.classList.add('incorrecta');
    }

    const finDeJuego = this.errores > this.maxErrores;
    const retro = this.modal.querySelector('#juego-retro');
    retro.hidden = false;
    retro.className = `juego-retro ${esCorrecta ? 'ok' : 'err'}`;
    retro.innerHTML = `
      <div class="jr-titulo">
        ${
          esCorrecta
            ? '✓ ¡Respuesta correcta!'
            : finDeJuego
              ? '✕ Respuesta incorrecta · Se agotó tu límite de 1 error'
              : '⚠ Respuesta incorrecta · Te queda 0 margen de error (1/1 error usado)'
        }
      </div>
      <p class="jr-exp">${p.explicacion}</p>
      <div class="jr-acciones">
        <button type="button" class="boton secundario" id="juego-ver-mapa">🔍 Ver en el mapa</button>
        <button type="button" class="boton" id="juego-continuar">
          ${finDeJuego ? 'Ver resumen final →' : 'Siguiente pregunta →'}
        </button>
      </div>
    `;

    retro.querySelector('#juego-ver-mapa').addEventListener('click', () => {
      this.cerrar();
      this.op.alVerNodo(p.nodoId);
    });
    retro.querySelector('#juego-continuar').addEventListener('click', () => {
      if (finDeJuego) this.mostrarResumen();
      else this.siguientePregunta();
    });
  }

  // ── Pantalla 3: Resumen de fin de partida ─────────────────────────────
  mostrarResumen() {
    const total = this.historial.length;
    const pct = total ? Math.round((this.aciertos / total) * 100) : 0;

    this.modal.innerHTML = `
      <div class="juego-caja tarjeta">
        <div class="juego-cabecera">
          <div>
            <span class="insignia discreta">Fin de la partida</span>
            <h2>Obtuviste ${this.aciertos} ${this.aciertos === 1 ? 'acierto' : 'aciertos'}</h2>
          </div>
          <button type="button" class="panel-cerrar" id="juego-cerrar" aria-label="Cerrar juego">×</button>
        </div>

        <div class="juego-record-barra">
          <div><span>Aciertos</span><strong>${this.aciertos} / ${total} (${pct}%)</strong></div>
          <div><span>Mejor racha</span><strong>🏆 ${this.record}</strong></div>
          <div><span>Errores cometidos</span><strong>${this.errores} (máx. 1 permitido)</strong></div>
        </div>

        <h3 class="juego-subtitulo-repaso">Repaso de preguntas de esta ronda</h3>
        <ul class="juego-lista-repaso">
          ${this.historial
            .map(
              (h) => `
            <li class="${h.acierto ? 'repaso-ok' : 'repaso-err'}">
              <span class="repaso-icono">${h.acierto ? '✓' : '✕'}</span>
              <div class="repaso-cuerpo">
                <div class="repaso-preg">${h.enunciado}</div>
                <div class="repaso-resp">Respuesta correcta: <strong>${h.correcta}</strong></div>
              </div>
              <button type="button" class="boton secundario btn-mini" data-ir="${h.nodoId}">Mapa</button>
            </li>
          `,
            )
            .join('')}
        </ul>

        <div class="juego-pie">
          <button type="button" class="boton secundario" id="juego-config">⚙ Cambiar materias</button>
          <button type="button" class="boton boton-jugar-grande" id="juego-reintentar">↻ Jugar de nuevo</button>
        </div>
      </div>
    `;

    this.modal.querySelector('#juego-cerrar').addEventListener('click', () => this.cerrar());
    this.modal.querySelector('#juego-config').addEventListener('click', () => this.mostrarConfiguracion());
    this.modal.querySelector('#juego-reintentar').addEventListener('click', () => this.iniciarPartida());
    for (const b of this.modal.querySelectorAll('[data-ir]')) {
      b.addEventListener('click', () => {
        this.cerrar();
        this.op.alVerNodo(b.dataset.ir);
      });
    }
  }
}
