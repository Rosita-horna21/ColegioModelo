document.addEventListener('DOMContentLoaded', () => {
    const cajas = Array.from(document.querySelectorAll('.foto-caja'));
    if (!cajas.length) return;

    /* ---------------------------------------------------------
       1) Animación de entrada al hacer scroll (aparición escalonada)
       --------------------------------------------------------- */
    const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ('IntersectionObserver' in window && !prefiereMenosMovimiento) {
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('visible');
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.15 });

        cajas.forEach((caja, indice) => {
            caja.style.transitionDelay = `${(indice % 3) * 100}ms`;
            observador.observe(caja);
        });
    } else {
        cajas.forEach((caja) => caja.classList.add('visible'));
    }

    /* ---------------------------------------------------------
       2) Lightbox: visor de foto ampliada con navegación
       --------------------------------------------------------- */
    const fotos = cajas.map((caja) => {
        const img = caja.querySelector('img');
        return { src: img.src, alt: img.alt || '' };
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImagen = document.getElementById('lightboxImagen');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const btnCerrar = document.getElementById('lightboxCerrar');
    const btnAnterior = document.getElementById('lightboxAnterior');
    const btnSiguiente = document.getElementById('lightboxSiguiente');

    let indiceActual = 0;
    let ultimoFocoElemento = null;

    function actualizarLightbox() {
        const foto = fotos[indiceActual];
        lightboxImagen.src = foto.src;
        lightboxImagen.alt = foto.alt;
        lightboxCaption.textContent = foto.alt;
    }

    function abrirLightbox(indice, elementoOrigen) {
        indiceActual = indice;
        ultimoFocoElemento = elementoOrigen;
        actualizarLightbox();
        lightbox.classList.add('activo');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        btnCerrar.focus();
    }

    function cerrarLightbox() {
        lightbox.classList.remove('activo');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (ultimoFocoElemento) ultimoFocoElemento.focus();
    }

    function irASiguiente() {
        indiceActual = (indiceActual + 1) % fotos.length;
        actualizarLightbox();
    }

    function irAAnterior() {
        indiceActual = (indiceActual - 1 + fotos.length) % fotos.length;
        actualizarLightbox();
    }

    cajas.forEach((caja, indice) => {
        caja.setAttribute('tabindex', '0');
        caja.setAttribute('role', 'button');
        caja.setAttribute('aria-label', `Ver imagen ampliada: ${fotos[indice].alt}`);

        caja.addEventListener('click', () => abrirLightbox(indice, caja));
        caja.addEventListener('keydown', (evento) => {
            if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                abrirLightbox(indice, caja);
            }
        });
    });

    btnCerrar.addEventListener('click', cerrarLightbox);
    btnSiguiente.addEventListener('click', irASiguiente);
    btnAnterior.addEventListener('click', irAAnterior);

    lightbox.addEventListener('click', (evento) => {
        if (evento.target === lightbox) cerrarLightbox();
    });

    document.addEventListener('keydown', (evento) => {
        if (!lightbox.classList.contains('activo')) return;
        if (evento.key === 'Escape') cerrarLightbox();
        if (evento.key === 'ArrowRight') irASiguiente();
        if (evento.key === 'ArrowLeft') irAAnterior();
    });
});
