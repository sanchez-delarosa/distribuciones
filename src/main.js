// Punto de entrada: conecta el mapa 2.5D, el panel, los filtros, el buscador y las rutas.

import { DISTRIBUCIONES, RELS, TIPOS_RELACION, PROPIEDADES, MATERIAS, materiaDe, porId, relPorId, tiposUsados } from './datos/index.js';
import { validarDatos } from './datos/validar.js';
import { calcularLayout } from './grafo/layout.js';
import { Mapa } from './grafo/mapa.js';
import { buscarCamino } from './grafo/caminos.js';
import { Panel } from './ui/panel.js';
import { JuegoQuiz } from './ui/juego.js';
import { escaparHTML } from './ui/tex.js';
import { TEMAS, temaActual, aplicarTema } from './ui/temas.js';

const normalizar = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

async function iniciar() {
  // 0. Tema visual: desplegable + 10 muestras rápidas en la cabecera.
  aplicarTema(temaActual().id);
  const cajaTemas = document.getElementById('temas');
  const selectTema = document.getElementById('tema-select');
  function cambiarTemaUI(id) {
    const t = aplicarTema(id);
    selectTema.value = t.id;
    for (const b of cajaTemas.querySelectorAll('.btn-tema')) {
      b.classList.toggle('activo', b.dataset.tema === t.id);
    }
  }
  for (const t of Object.values(TEMAS)) {
    selectTema.add(new Option(t.nombre, t.id));
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn-tema ${t.id === temaActual().id ? 'activo' : ''}`;
    btn.dataset.tema = t.id;
    btn.title = t.nombre;
    btn.setAttribute('aria-label', t.nombre);
    btn.style.background = `linear-gradient(135deg, ${t.muestra} 52%, ${t.css['--acento']} 52%)`;
    btn.addEventListener('click', () => cambiarTemaUI(t.id));
    cajaTemas.appendChild(btn);
  }
  selectTema.value = temaActual().id;
  selectTema.addEventListener('change', () => cambiarTemaUI(selectTema.value));
  // 1. Validación automática de datos.
  const val = validarDatos();
  const aviso = document.getElementById('aviso-validacion');
  if (!val.ok) {
    aviso.hidden = false;
    aviso.textContent = `⚠ ${val.errores.length} error(es) en datos`;
    console.warn('Errores de validación:', val.errores);
  }

  // 2. Panel y mapa.
  let mapa;
  const panel = new Panel(document.getElementById('panel'), document.getElementById('panel-contenido'), {
    alNodo: (id) => irANodo(id),
    alArista: (id) => irAArista(id),
    alCerrar: () => limpiarSeleccion(),
  });

  mapa = new Mapa(document.getElementById('escena'), {
    tipos: TIPOS_RELACION,
    porId,
    alNodo: (id) => irANodo(id),
    alArista: (id) => irAArista(id),
    alFondo: () => limpiarSeleccion(),
    margenDerecho: () => panel.ancho,
    tooltip: document.getElementById('tooltip'),
  });

  const layout = await calcularLayout(DISTRIBUCIONES, RELS);
  mapa.construir(DISTRIBUCIONES, RELS, layout);
  mapa.encuadrar(false);

  // 3. Navegación y hash en la URL.
  function irANodo(id, cambiarHash = true) {
    if (!porId.has(id)) return;
    panel.mostrarDistribucion(id);
    mapa.seleccionarNodo(id, true);
    if (cambiarHash) history.replaceState(null, '', `#/${id}`);
  }

  function irAArista(id, cambiarHash = true) {
    const r = relPorId.get(id);
    if (!r) return;
    panel.mostrarRelacion(r);
    mapa.seleccionarArista(id, true);
    if (cambiarHash) history.replaceState(null, '', `#/rel/${id}`);
  }

  function limpiarSeleccion() {
    panel.cerrar();
    mapa.limpiarSeleccion();
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  }

  function leerHash() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    if (!h) return;
    if (h.startsWith('rel/')) irAArista(h.slice(4), false);
    else if (porId.has(h)) irANodo(h, false);
  }
  window.addEventListener('hashchange', leerHash);
  leerHash();

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.abierto) limpiarSeleccion();
  });

  // 4. Leyenda y filtros por materia, por tipo de relación y de propiedades.
  const ulMaterias = document.getElementById('filtros-materia');
  const selHasta = document.getElementById('materia-hasta');
  const materiasOcultas = new Set();
  const listaMaterias = Object.values(MATERIAS).sort((a, b) => a.orden - b.orden);
  const conteoPorMateria = new Map(listaMaterias.map((m) => [m.id, 0]));
  for (const d of DISTRIBUCIONES) {
    conteoPorMateria.set(d.materia, (conteoPorMateria.get(d.materia) ?? 0) + 1);
  }

  selHasta.add(new Option('Todas las materias', 'todas'));
  for (const m of listaMaterias) {
    selHasta.add(new Option(`Hasta ${m.orden}. ${m.corto}`, String(m.orden)));
  }
  const optPers = new Option('Selección manual', 'manual');
  optPers.hidden = true;
  selHasta.add(optPers);

  function sincronizarFiltroMaterias() {
    for (const li of ulMaterias.querySelectorAll('li[data-materia]')) {
      li.classList.toggle('inactivo', materiasOcultas.has(li.dataset.materia));
    }
    mapa.setMateriasOcultas(materiasOcultas);
  }

  for (const m of listaMaterias) {
    const n = conteoPorMateria.get(m.id) ?? 0;
    const li = document.createElement('li');
    li.className = 'item-filtro item-materia';
    li.dataset.materia = m.id;
    li.title = m.descripcion;
    li.style.setProperty('--color-materia', m.color);
    li.innerHTML = `
      <span class="punto punto-materia"></span>
      <span class="nombre-materia">${escaparHTML(m.nombre)}</span>
      <span class="conteo-materia">${n}</span>
    `;
    li.addEventListener('click', () => {
      if (materiasOcultas.has(m.id)) materiasOcultas.delete(m.id);
      else materiasOcultas.add(m.id);
      selHasta.value = materiasOcultas.size === 0 ? 'todas' : 'manual';
      sincronizarFiltroMaterias();
    });
    ulMaterias.appendChild(li);
  }

  selHasta.addEventListener('change', () => {
    materiasOcultas.clear();
    if (selHasta.value !== 'todas' && selHasta.value !== 'manual') {
      const tope = Number(selHasta.value);
      for (const m of listaMaterias) {
        if (m.orden > tope) materiasOcultas.add(m.id);
      }
    }
    sincronizarFiltroMaterias();
  });

  const ulFiltros = document.getElementById('filtros');
  const tiposOcultos = new Set();
  for (const clave of tiposUsados) {
    const t = TIPOS_RELACION[clave];
    const li = document.createElement('li');
    li.className = 'item-filtro';
    li.title = t.descripcion;
    li.innerHTML = `<span class="muestra-linea ${t.estilo}" style="--c:${t.color}"></span><span>${escaparHTML(t.nombre)}</span>`;
    li.addEventListener('click', () => {
      if (tiposOcultos.has(clave)) tiposOcultos.delete(clave);
      else tiposOcultos.add(clave);
      li.classList.toggle('inactivo', tiposOcultos.has(clave));
      mapa.setTiposOcultos(tiposOcultos);
    });
    ulFiltros.appendChild(li);
  }

  const ulProps = document.getElementById('lista-propiedades');
  const letrasUsadas = new Set(DISTRIBUCIONES.flatMap((d) => (d.propiedades ?? []).map((p) => p.letra)));
  for (const [letra, info] of Object.entries(PROPIEDADES)) {
    if (!letrasUsadas.has(letra)) continue;
    const li = document.createElement('li');
    li.title = info.descripcion;
    li.innerHTML = `<span class="chip-prop">${letra}</span><span>${escaparHTML(info.nombre)}</span>`;
    ulProps.appendChild(li);
  }

  // 5. Tarjetas plegables.
  for (const tarjeta of document.querySelectorAll('.plegable')) {
    const btn = tarjeta.querySelector('.plegar');
    btn.addEventListener('click', () => {
      const plegado = tarjeta.classList.toggle('plegado');
      btn.setAttribute('aria-expanded', String(!plegado));
    });
  }

  // 6. Buscador con autocompletado.
  const inputBuscar = document.getElementById('buscar');
  const ulSug = document.getElementById('sugerencias');
  let indiceActivo = -1;

  function actualizarSugerencias() {
    const q = normalizar(inputBuscar.value.trim());
    if (!q) {
      ulSug.hidden = true;
      return;
    }
    const coincidencias = DISTRIBUCIONES.filter((d) => {
      const textos = [d.nombre, d.id, ...(d.alias ?? [])].map(normalizar);
      return textos.some((t) => t.includes(q));
    });
    if (!coincidencias.length) {
      ulSug.hidden = true;
      return;
    }
    indiceActivo = 0;
    ulSug.innerHTML = coincidencias
      .map((d, i) => {
        const mat = materiaDe(d);
        return `<li role="option" data-id="${d.id}" class="${i === 0 ? 'activa' : ''}" style="--color-materia:${mat.color}">
          <span class="punto punto-materia"></span>
          <span>${escaparHTML(d.nombre)}</span>
          <span class="sug-materia">${escaparHTML(mat.corto)}</span>
        </li>`;
      })
      .join('');
    ulSug.hidden = false;
    for (const li of ulSug.querySelectorAll('li')) {
      li.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        elegirSugerencia(li.dataset.id);
      });
    }
  }

  function elegirSugerencia(id) {
    inputBuscar.value = '';
    ulSug.hidden = true;
    irANodo(id);
  }

  inputBuscar.addEventListener('input', actualizarSugerencias);
  inputBuscar.addEventListener('keydown', (e) => {
    const items = [...ulSug.querySelectorAll('li')];
    if (!items.length || ulSug.hidden) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      indiceActivo = (indiceActivo + 1) % items.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      indiceActivo = (indiceActivo - 1 + items.length) % items.length;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      elegirSugerencia(items[indiceActivo].dataset.id);
      return;
    } else if (e.key === 'Escape') {
      ulSug.hidden = true;
      return;
    } else return;
    items.forEach((li, i) => li.classList.toggle('activa', i === indiceActivo));
  });
  inputBuscar.addEventListener('blur', () => setTimeout(() => (ulSug.hidden = true), 120));

  // 7. Buscador de caminos.
  const selDe = document.getElementById('camino-de');
  const selA = document.getElementById('camino-a');
  const ordenadas = [...DISTRIBUCIONES].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  for (const d of ordenadas) {
    selDe.add(new Option(d.nombre, d.id));
    selA.add(new Option(d.nombre, d.id));
  }
  selDe.value = 'hipergeometrica';
  selA.value = 'normal-estandar';

  document.getElementById('camino-buscar').addEventListener('click', () => {
    const de = selDe.value;
    const a = selA.value;
    const activas = RELS.filter(
      (r) =>
        !tiposOcultos.has(r.tipo) &&
        !materiasOcultas.has(porId.get(r.de).materia) &&
        !materiasOcultas.has(porId.get(r.a).materia),
    );
    const camino = buscarCamino(de, a, activas);
    panel.mostrarCamino(de, a, camino);
    if (camino?.length) mapa.mostrarCamino(camino.map((r) => r.id));
  });
  document.getElementById('camino-limpiar').addEventListener('click', limpiarSeleccion);

  // 8. Controles inferiores y Modo Juego.
  const juego = new JuegoQuiz(document.getElementById('modal-juego'), {
    alVerNodo: (id) => irANodo(id),
  });
  document.getElementById('btn-juego').addEventListener('click', () => juego.abrir());
  document.getElementById('btn-juego-cabecera').addEventListener('click', () => juego.abrir());

  document.getElementById('btn-encuadrar').addEventListener('click', () => mapa.encuadrar(true));
  const btnEtiquetas = document.getElementById('btn-etiquetas');
  btnEtiquetas.addEventListener('click', () => {
    const activo = btnEtiquetas.getAttribute('aria-pressed') !== 'true';
    btnEtiquetas.setAttribute('aria-pressed', String(activo));
    btnEtiquetas.classList.toggle('activo', activo);
    mapa.setMostrarCondiciones(activo);
  });
}

iniciar();
