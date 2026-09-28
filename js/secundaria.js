// ============================================================
// NIVEL SECUNDARIA — interacciones de la página
// ============================================================
(function () {
  'use strict';

  // ----------------------------------------------------------
  // 1. Ruta de 1° a 5°  (pestañas accesibles con teclado)
  // ----------------------------------------------------------
  const hitos = Array.from(document.querySelectorAll('.secu-hito'));
  const avance = document.getElementById('pista-avance');

  function mostrarGrado(indice, moverFoco) {
    hitos.forEach((hito, i) => {
      const activo = i === indice;
      const panel = document.getElementById(hito.getAttribute('aria-controls'));

      hito.classList.toggle('is-activo', activo);
      hito.setAttribute('aria-selected', String(activo));
      hito.tabIndex = activo ? 0 : -1;
      if (panel) panel.hidden = !activo;
    });

    if (avance) {
      // La línea avanza en proporción al grado elegido.
      avance.style.width = ((indice + 1) / hitos.length) * 100 + '%';
    }

    if (moverFoco) hitos[indice].focus();
  }

  hitos.forEach((hito, i) => {
    hito.addEventListener('click', () => mostrarGrado(i, false));

    hito.addEventListener('keydown', (e) => {
      const teclas = {
        ArrowRight: i + 1,
        ArrowLeft: i - 1,
        Home: 0,
        End: hitos.length - 1
      };
      if (!(e.key in teclas)) return;
      e.preventDefault();
      const destino = (teclas[e.key] + hitos.length) % hitos.length;
      mostrarGrado(destino, true);
    });
  });

  if (hitos.length) mostrarGrado(0, false);

  // ----------------------------------------------------------
  // 2. Áreas curriculares: filtro por campo + búsqueda
  // ----------------------------------------------------------
  const chips = Array.from(document.querySelectorAll('.secu-chip'));
  const areas = Array.from(document.querySelectorAll('.secu-area'));
  const buscador = document.getElementById('buscar-area');
  const conteo = document.getElementById('conteo-areas');
  const vacio = document.getElementById('areas-vacio');
  let filtroActual = 'todas';

  const sinTildes = (texto) =>
    texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function aplicarFiltros() {
    const termino = sinTildes(buscador ? buscador.value.trim() : '');
    let visibles = 0;

    areas.forEach((area) => {
      const campoOk = filtroActual === 'todas' || area.dataset.campo === filtroActual;
      const texto = sinTildes(
        (area.dataset.nombre || '') + ' ' + (area.querySelector('h3')?.textContent || '')
      );
      const textoOk = termino === '' || texto.includes(termino);
      const mostrar = campoOk && textoOk;

      if (mostrar) {
        visibles++;
        if (area.hidden) {
          area.hidden = false;
          // Fuerza el reflow para que la transición de entrada se note.
          void area.offsetWidth;
        }
        area.classList.remove('secu-area--oculta');
      } else if (!area.classList.contains('secu-area--oculta')) {
        area.classList.add('secu-area--oculta');
        setTimeout(() => {
          if (area.classList.contains('secu-area--oculta')) area.hidden = true;
        }, 220);
      }
    });

    if (conteo) {
      conteo.textContent =
        visibles === 0
          ? ''
          : visibles === areas.length
          ? `Mostrando las ${areas.length} áreas del plan de estudios.`
          : `Mostrando ${visibles} de ${areas.length} áreas.`;
    }
    if (vacio) vacio.hidden = visibles !== 0;
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => {
        c.classList.remove('is-activo');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-activo');
      chip.setAttribute('aria-pressed', 'true');
      filtroActual = chip.dataset.filtro;
      aplicarFiltros();
    });
  });

  if (buscador) buscador.addEventListener('input', aplicarFiltros);
  if (areas.length) aplicarFiltros();

  // ----------------------------------------------------------
  // 3. Testimonios
  // ----------------------------------------------------------
  const voces = Array.from(document.querySelectorAll('.secu-voz'));
  const puntos = document.getElementById('voz-puntos');
  const anterior = document.getElementById('voz-anterior');
  const siguiente = document.getElementById('voz-siguiente');
  let vozActual = 0;

  function mostrarVoz(indice) {
    vozActual = (indice + voces.length) % voces.length;
    voces.forEach((voz, i) => {
      voz.hidden = i !== vozActual;
      voz.classList.toggle('is-activa', i === vozActual);
    });
    if (puntos) {
      Array.from(puntos.children).forEach((p, i) =>
        p.classList.toggle('is-activo', i === vozActual)
      );
    }
  }

  if (voces.length && puntos) {
    voces.forEach((_, i) => {
      const punto = document.createElement('button');
      punto.type = 'button';
      punto.setAttribute('aria-label', `Ver testimonio ${i + 1}`);
      punto.addEventListener('click', () => mostrarVoz(i));
      puntos.appendChild(punto);
    });
    if (anterior) anterior.addEventListener('click', () => mostrarVoz(vozActual - 1));
    if (siguiente) siguiente.addEventListener('click', () => mostrarVoz(vozActual + 1));
    mostrarVoz(0);
  }

  // ----------------------------------------------------------
  // 4. Acordeón: solo una pregunta abierta a la vez
  // ----------------------------------------------------------
  const preguntas = Array.from(document.querySelectorAll('.secu-pregunta'));
  preguntas.forEach((pregunta) => {
    pregunta.addEventListener('toggle', () => {
      if (!pregunta.open) return;
      preguntas.forEach((otra) => {
        if (otra !== pregunta) otra.open = false;
      });
    });
  });
})();
