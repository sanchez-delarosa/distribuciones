// Panel lateral de detalle: ficha de distribución, de relación o de camino.

import { porId, salientes, entrantes, TIPOS_RELACION, PROPIEDADES, materiaDe, parametrosIniciales, resolver } from '../datos/index.js';
import { tex, texto, escaparHTML } from './tex.js';
import { Grafica2D } from '../graficas/grafica2d.js';
import { Superficie3D } from '../graficas/superficie3d.js';
import { fmt } from '../mate/muestreo.js';

export class Panel {
  /**
   * @param {HTMLElement} raiz
   * @param {HTMLElement} cuerpo
   * @param {{ alNodo: (id: string) => void, alArista: (id: string) => void, alCerrar: () => void }} op
   */
  constructor(raiz, cuerpo, op) {
    this.raiz = raiz;
    this.cuerpo = cuerpo;
    this.op = op;
    this.grafica2d = null;
    this.superficie3d = null;
    raiz.querySelector('#panel-cerrar').addEventListener('click', () => op.alCerrar());
  }

  get abierto() {
    return !this.raiz.hidden;
  }

  get ancho() {
    return this.abierto && window.innerWidth > 820 ? this.raiz.offsetWidth : 0;
  }

  limpiarVistas() {
    this.grafica2d?.desmontar();
    this.superficie3d?.desmontar();
    this.grafica2d = null;
    this.superficie3d = null;
  }

  cerrar() {
    this.limpiarVistas();
    this.raiz.hidden = true;
  }

  // ── Ficha de una distribución ─────────────────────────────────────────
  mostrarDistribucion(id) {
    const d = porId.get(id);
    if (!d) return;
    this.limpiarVistas();
    this.raiz.hidden = false;
    this.raiz.scrollTop = 0;

    let params = parametrosIniciales(d);
    const etqDensidad = d.tipo === 'discreta' ? 'fmp P(X = x)' : 'fdp f(x)';
    const f = d.formulas;

    const filasFormulas = [
      ['Soporte', d.soporte],
      [d.tipo === 'discreta' ? 'Función de masa' : 'Función de densidad', f.densidad],
      f.fda && ['Función de distribución', f.fda],
      f.supervivencia && ['Supervivencia', f.supervivencia],
      f.riesgo && ['Función de riesgo', f.riesgo],
      ['Media', f.media],
      ['Varianza', f.varianza],
      f.fgm && ['Generadora de momentos', f.fgm],
      f.fgp && ['Generadora de probabilidades', f.fgp],
      ...(d.extras ?? []).map((e) => [e.etiqueta, e.tex]),
    ].filter(Boolean);

    const sal = salientes.get(d.id) ?? [];
    const ent = entrantes.get(d.id) ?? [];
    const mat = materiaDe(d);

    this.cuerpo.innerHTML = `
      <div class="ficha-cabecera">
        <div class="fila-insignias">
          <span class="insignia insignia-materia" style="--color-materia:${mat.color}" title="${escaparHTML(mat.descripcion)}">${escaparHTML(mat.nombre)}</span>
          <span class="insignia ${d.tipo}">${d.tipo === 'discreta' ? 'Discreta' : 'Continua'}</span>
        </div>
        <h2>${escaparHTML(d.nombre)}</h2>
        <div class="notacion">${tex(d.notacion, true)}</div>
        <p class="descripcion">${texto(d.descripcion)}</p>
      </div>

      <section class="bloque">
        <div class="pestanas" role="tablist">
          <button class="pestana activa" data-vista="densidad" role="tab">${etqDensidad}</button>
          <button class="pestana" data-vista="fda" role="tab">FDA F(x)</button>
          ${d.superficie ? `<button class="pestana" data-vista="3d" role="tab">Superficie 3D</button>` : ''}
        </div>
        <div id="lienzo-2d-caja"></div>
        <div id="lienzo-3d-caja" hidden>
          <div class="ayuda-3d">Arrastra para girar · eje de fondo: ${d.superficie ? tex(d.parametros.find((q) => q.id === d.superficie.param).tex) : ''}</div>
        </div>

        ${
          d.parametros.length
            ? `<div class="controles-parametros">
                ${d.parametros
                  .map(
                    (q) => `
                  <div class="control-param" data-param="${q.id}">
                    <div class="cabecera-param">
                      <span>${tex(q.tex)} · <small>${escaparHTML(q.nombre)}</small></span>
                      <output data-salida="${q.id}">${params[q.id]}</output>
                    </div>
                    <input type="range" data-rango="${q.id}" min="${q.min}" max="${resolver(q.max, params)}" step="${q.paso}" value="${params[q.id]}" />
                  </div>`,
                  )
                  .join('')}
              </div>`
            : ''
        }

        <div class="metricas" id="metricas"></div>
      </section>

      <section class="bloque">
        <h3>Fórmulas</h3>
        ${
          d.parametros.length
            ? `<p class="espacio-parametros">Parámetros: ${d.parametros.map((q) => tex(q.restriccion)).join(', ')}</p>`
            : ''
        }
        <dl class="tabla-formulas">
          ${filasFormulas
            .map(
              ([etq, formula]) => `
            <div class="fila-formula">
              <dt>${escaparHTML(etq)}</dt>
              <dd>${tex(formula, true)}</dd>
            </div>`,
            )
            .join('')}
        </dl>
      </section>

      ${
        d.claseAB
          ? `<section class="bloque">
              <h3>Clase ${tex(d.claseAB.clase)} de Panjer</h3>
              <p class="ayuda">Satisface la recursión ${tex('p_k = \\left(a + \\frac{b}{k}\\right) p_{k-1}')}:</p>
              <div class="rejilla-ab">
                <div><span>${tex('a')}</span><strong>${tex(d.claseAB.a)}</strong></div>
                <div><span>${tex('b')}</span><strong>${tex(d.claseAB.b)}</strong></div>
                <div><span>${tex('p_0')}</span><strong>${tex(d.claseAB.p0)}</strong></div>
              </div>
            </section>`
          : ''
      }

      ${
        d.propiedades?.length
          ? `<section class="bloque">
              <h3>Propiedades</h3>
              <ul class="lista-detalle-prop">
                ${d.propiedades
                  .map((q) => {
                    const info = PROPIEDADES[q.letra];
                    return `<li>
                      <div class="cabecera-prop">
                        <span class="chip-prop grande">${q.letra}</span>
                        <strong>${escaparHTML(info?.nombre ?? q.letra)}</strong>
                      </div>
                      <div class="formula-prop">${tex(q.detalle, true)}</div>
                    </li>`;
                  })
                  .join('')}
              </ul>
            </section>`
          : ''
      }

      ${
        sal.length
          ? `<section class="bloque">
              <h3>De aquí se obtienen (${sal.length})</h3>
              <ul class="lista-relaciones">${sal.map((r) => this.itemRelacion(r, 'saliente')).join('')}</ul>
            </section>`
          : ''
      }

      ${
        ent.length
          ? `<section class="bloque">
              <h3>Se obtiene a partir de (${ent.length})</h3>
              <ul class="lista-relaciones">${ent.map((r) => this.itemRelacion(r, 'entrante')).join('')}</ul>
            </section>`
          : ''
      }

      ${
        d.notas?.length
          ? `<section class="bloque">
              <h3>Notas</h3>
              <ul class="lista-notas">${d.notas.map((n) => `<li>${texto(n)}</li>`).join('')}</ul>
            </section>`
          : ''
      }
    `;

    const caja2d = this.cuerpo.querySelector('#lienzo-2d-caja');
    const caja3d = this.cuerpo.querySelector('#lienzo-3d-caja');
    const metricas = this.cuerpo.querySelector('#metricas');
    this.grafica2d = new Grafica2D(caja2d);

    const actualizarNumeros = () => {
      const m = d.calc.media(params);
      const v = d.calc.varianza(params);
      const de = Math.sqrt(Math.max(0, v));
      const cv = m !== 0 ? de / Math.abs(m) : NaN;
      metricas.innerHTML = `
        <div><span>${tex('E[X]')}</span><strong>${fmt(m, 3)}</strong></div>
        <div><span>${tex('\\operatorname{Var}(X)')}</span><strong>${fmt(v, 3)}</strong></div>
        <div><span>${tex('\\operatorname{DE}(X)')}</span><strong>${fmt(de, 3)}</strong></div>
        <div><span>${tex('\\operatorname{CV}(X)')}</span><strong>${fmt(cv, 3)}</strong></div>
      `;
    };

    const refrescar = () => {
      if (d.calc.ajustar) params = d.calc.ajustar(params);
      for (const q of d.parametros) {
        const input = this.cuerpo.querySelector(`[data-rango="${q.id}"]`);
        const salida = this.cuerpo.querySelector(`[data-salida="${q.id}"]`);
        if (input) {
          input.max = String(resolver(q.max, params));
          input.value = String(params[q.id]);
        }
        if (salida) salida.textContent = fmt(params[q.id], 2);
      }
      actualizarNumeros();
      this.grafica2d.actualizar(d, params);
      this.superficie3d?.actualizar(d, params);
    };

    for (const input of this.cuerpo.querySelectorAll('[data-rango]')) {
      input.addEventListener('input', () => {
        params[input.dataset.rango] = parseFloat(input.value);
        refrescar();
      });
    }

    for (const btn of this.cuerpo.querySelectorAll('.pestana')) {
      btn.addEventListener('click', () => {
        for (const b of this.cuerpo.querySelectorAll('.pestana')) b.classList.toggle('activa', b === btn);
        const vista = btn.dataset.vista;
        if (vista === '3d') {
          caja2d.hidden = true;
          caja3d.hidden = false;
          if (!this.superficie3d) this.superficie3d = new Superficie3D(caja3d);
          this.superficie3d.redimensionar();
          this.superficie3d.actualizar(d, params);
        } else {
          caja3d.hidden = true;
          caja2d.hidden = false;
          this.grafica2d.actualizar(d, params, vista);
        }
      });
    }

    this.enlazarBotonesRelacion();
    refrescar();
  }

  itemRelacion(r, dir) {
    const tipo = TIPOS_RELACION[r.tipo];
    const otra = porId.get(dir === 'saliente' ? r.a : r.de);
    return `<li class="item-rel">
      <div class="item-rel-arriba">
        <span class="punto-rel" style="background:${tipo.color}"></span>
        <button class="enlace-nodo" data-nodo="${otra.id}">${dir === 'saliente' ? '→' : '←'} ${escaparHTML(otra.nombre)}</button>
        <button class="etiqueta-tipo" data-arista="${r.id}" style="color:${tipo.color}">${escaparHTML(tipo.nombre)}</button>
      </div>
      <div class="item-rel-cond">${tex(r.condicion)}</div>
      <p class="item-rel-exp">${texto(r.explicacion)}</p>
    </li>`;
  }

  enlazarBotonesRelacion() {
    for (const b of this.cuerpo.querySelectorAll('[data-nodo]')) {
      b.addEventListener('click', () => this.op.alNodo(b.dataset.nodo));
    }
    for (const b of this.cuerpo.querySelectorAll('[data-arista]')) {
      b.addEventListener('click', () => this.op.alArista(b.dataset.arista));
    }
  }

  // ── Ficha de una relación (flecha) ────────────────────────────────────
  mostrarRelacion(r) {
    if (!r) return;
    this.limpiarVistas();
    this.raiz.hidden = false;
    this.raiz.scrollTop = 0;
    const tipo = TIPOS_RELACION[r.tipo];
    const de = porId.get(r.de);
    const a = porId.get(r.a);

    this.cuerpo.innerHTML = `
      <div class="ficha-cabecera">
        <span class="insignia" style="background:${tipo.color}22;color:${tipo.color};border-color:${tipo.color}55">${escaparHTML(tipo.nombre)}</span>
        <h2>Relación entre distribuciones</h2>
        <div class="ruta-nodos">
          <button class="pastilla-nodo" style="--color-materia:${materiaDe(de).color}" data-nodo="${de.id}">${escaparHTML(de.nombre)}</button>
          <span class="flecha-ruta">→</span>
          <button class="pastilla-nodo" style="--color-materia:${materiaDe(a).color}" data-nodo="${a.id}">${escaparHTML(a.nombre)}</button>
        </div>
      </div>

      <section class="bloque">
        <h3>Condición o transformación</h3>
        <div class="notacion">${tex(r.condicion, true)}</div>
        <p class="descripcion">${texto(r.explicacion)}</p>
      </section>

      <section class="bloque">
        <h3>¿Qué significa «${escaparHTML(tipo.nombre.toLowerCase())}»?</h3>
        <p class="ayuda">${escaparHTML(tipo.descripcion)}</p>
      </section>
    `;
    this.enlazarBotonesRelacion();
  }

  // ── Ficha de un camino entre dos distribuciones ───────────────────────
  mostrarCamino(origen, destino, aristas) {
    this.limpiarVistas();
    this.raiz.hidden = false;
    this.raiz.scrollTop = 0;
    const de = porId.get(origen);
    const a = porId.get(destino);

    if (!aristas) {
      this.cuerpo.innerHTML = `
        <div class="ficha-cabecera">
          <h2>Sin camino dirigido</h2>
          <p class="descripcion">No hay una secuencia de flechas que vaya de <strong>${escaparHTML(de.nombre)}</strong> a <strong>${escaparHTML(a.nombre)}</strong> con las relaciones actuales.</p>
        </div>`;
      return;
    }

    this.cuerpo.innerHTML = `
      <div class="ficha-cabecera">
        <span class="insignia continua">${aristas.length} ${aristas.length === 1 ? 'paso' : 'pasos'}</span>
        <h2>Camino de ${escaparHTML(de.nombre)} a ${escaparHTML(a.nombre)}</h2>
      </div>
      <section class="bloque">
        <ol class="lista-relaciones">
          ${aristas
            .map((r, i) => {
              const tipo = TIPOS_RELACION[r.tipo];
              const u = porId.get(r.de);
              const v = porId.get(r.a);
              return `<li class="item-rel">
                <div class="item-rel-arriba">
                  <span class="paso-num">${i + 1}</span>
                  <button class="enlace-nodo" data-nodo="${u.id}">${escaparHTML(u.nombre)}</button>
                  <span>→</span>
                  <button class="enlace-nodo" data-nodo="${v.id}">${escaparHTML(v.nombre)}</button>
                  <button class="etiqueta-tipo" data-arista="${r.id}" style="color:${tipo.color}">${escaparHTML(tipo.nombre)}</button>
                </div>
                <div class="item-rel-cond">${tex(r.condicion)}</div>
                <p class="item-rel-exp">${texto(r.explicacion)}</p>
              </li>`;
            })
            .join('')}
        </ol>
      </section>
    `;
    this.enlazarBotonesRelacion();
  }
}
