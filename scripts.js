document.addEventListener('DOMContentLoaded', () => {
  const CLAVE_TEMA = 'preferencia-tema';
  const TEMA_OSCURO = 'tema-oscuro';
  const TEMA_CLARO = 'tema-claro';

  const body = document.body;
  const botonTema = document.getElementById('boton-tema');
  const iconoTema = document.getElementById('icono-tema');
  const formulario = document.querySelector('.formulario-contacto');

  /* Tema: usar una sola función setTema*/
  function setTema(tema) {
    body.classList.toggle(TEMA_CLARO, tema === TEMA_CLARO);
    body.classList.toggle(TEMA_OSCURO, tema === TEMA_OSCURO);
    if (iconoTema) iconoTema.textContent = tema === TEMA_CLARO ? '☀️' : '🌙';
    if (botonTema) botonTema.setAttribute('aria-pressed', tema === TEMA_CLARO ? 'true' : 'false');
    localStorage.setItem(CLAVE_TEMA, tema);
  }

  function toggleTema() {
    const actual = body.classList.contains(TEMA_OSCURO) ? TEMA_OSCURO : TEMA_CLARO;
    setTema(actual === TEMA_OSCURO ? TEMA_CLARO : TEMA_OSCURO);
  }

  (function initTema() {
    const guardado = localStorage.getItem(CLAVE_TEMA);
    setTema(guardado === TEMA_CLARO ? TEMA_CLARO : TEMA_OSCURO);
  })();

  botonTema?.addEventListener('click', toggleTema);

  /* Validación: reglas declarativas*/
  const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function limpiarErrores(campo) {
    if (!campo) return;
    campo.classList.remove('input-error');
    const next = campo.nextElementSibling;
    if (next?.classList.contains('error')) next.remove();
  }

  function mostrarError(campo, msg) {
    if (!campo) return;
    campo.classList.add('input-error');
    const div = document.createElement('div');
    div.className = 'error';
    div.textContent = msg;
    campo.insertAdjacentElement('afterend', div);
  }

  function validarConReglas(reglas) {
    const errores = [];
    for (const r of reglas) {
      limpiarErrores(r.el);
      const valor = (r.el?.value ?? '').trim();
      if (!r.test(valor)) errores.push({ el: r.el, msg: r.msg });
    }
    return errores;
  }

  if (formulario) {
    formulario.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombreEl = formulario.querySelector('#nombre');
      const emailEl = formulario.querySelector('#email');
      const comentariosEl = formulario.querySelector('#comentarios');

      const reglas = [
        { el: nombreEl, test: v => v.length > 0, msg: 'Ingrese su nombre completo.' },
        { el: emailEl, test: v => v.length > 0, msg: 'Ingrese su email.' },
        { el: emailEl, test: v => reEmail.test(v), msg: 'Ingrese un email válido.' },
        { el: comentariosEl, test: v => v.length > 0, msg: 'Escriba sus comentarios.' },
      ];

      const errores = validarConReglas(reglas);
      if (errores.length) {
        // mostrar solo el primer error por campo (puede haber >1 regla para un mismo campo)
        const vistos = new Set();
        errores.forEach(err => {
          if (!vistos.has(err.el)) {
            mostrarError(err.el, err.msg);
            vistos.add(err.el);
          }
        });
        errores[0].el.focus();
        return;
      }

      // Envío simulado
      alert('Su comentario fue enviado con exito!');
      formulario.reset();
    });
  }
});
