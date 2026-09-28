// ============================================================
// PÁGINA NOSOTROS — interacciones
// ============================================================
(function () {
  'use strict';

  // ----------------------------------------------------------
  // 1. Pestañas: Misión / Visión / Valores
  // ----------------------------------------------------------
  const tabs = Array.from(document.querySelectorAll('.mvv-tab'));

  function mostrarPanel(indice, moverFoco) {
    tabs.forEach((tab, i) => {
      const activo = i === indice;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));

      tab.classList.toggle('is-activo', activo);
      tab.setAttribute('aria-selected', String(activo));
      tab.tabIndex = activo ? 0 : -1;
      if (panel) panel.hidden = !activo;
    });
    if (moverFoco) tabs[indice].focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => mostrarPanel(i, false));
    tab.addEventListener('keydown', (e) => {
      const teclas = {
        ArrowRight: i + 1,
        ArrowLeft: i - 1,
        Home: 0,
        End: tabs.length - 1
      };
      if (!(e.key in teclas)) return;
      e.preventDefault();
      const destino = (teclas[e.key] + tabs.length) % tabs.length;
      mostrarPanel(destino, true);
    });
  });

  // ----------------------------------------------------------
  // 2. Tarjetas de valores: tocar para revelar el significado
  // ----------------------------------------------------------
  const chips = Array.from(document.querySelectorAll('.valor-chip'));
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const yaAbierto = chip.classList.contains('is-abierto');
      chips.forEach((c) => c.classList.remove('is-abierto'));
      if (!yaAbierto) chip.classList.add('is-abierto');
    });
  });
})();
