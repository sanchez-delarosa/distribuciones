import katex from 'katex';

const cache = new Map();

/** Convierte LaTeX a HTML con KaTeX. */
export function tex(s, display = false) {
  const clave = (display ? 'D' : 'I') + s;
  if (!cache.has(clave)) {
    cache.set(clave, katex.renderToString(s, { displayMode: display, throwOnError: false, strict: 'ignore' }));
  }
  return cache.get(clave);
}

export function escaparHTML(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/**
 * Texto con fórmulas entre $…$ y cursivas entre *…*.
 * @param {string} s
 */
export function texto(s) {
  return s
    .split(/(\$[^$]+\$)/g)
    .map((parte) => {
      if (parte.startsWith('$') && parte.endsWith('$') && parte.length > 1) return tex(parte.slice(1, -1));
      return escaparHTML(parte).replace(/\*([^*]+)\*/g, '<em>$1</em>');
    })
    .join('');
}

/** Extrae los fragmentos LaTeX de un texto mixto (para validar). */
export const fragmentosTex = (s) => [...s.matchAll(/\$([^$]+)\$/g)].map((m) => m[1]);
