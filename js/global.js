// ============================================================
// I.E. MODELO — interacciones globales
// ============================================================

// Menú móvil
const botonMenu = document.getElementById('boton-menu');
const menuEnlaces = document.getElementById('menu-enlaces');

if (botonMenu && menuEnlaces) {
    botonMenu.addEventListener('click', () => {
        menuEnlaces.classList.toggle('abierto');
    });

    menuEnlaces.querySelectorAll('a').forEach(enlace => {
        enlace.addEventListener('click', () => menuEnlaces.classList.remove('abierto'));
    });
}

// Header: sombra dinámica al hacer scroll
const barraNav = document.querySelector('.barra-navegacion');
if (barraNav) {
    const alScrollear = () => {
        barraNav.classList.toggle('con-sombra', window.scrollY > 12);
    };
    alScrollear();
    window.addEventListener('scroll', alScrollear, { passive: true });
}

// Animación de aparición al hacer scroll (scroll-reveal)
const elementosAnimables = document.querySelectorAll(
    '.tarjeta, .titulo-contenedor, .caja-mv, .texto-nosotros, .mision-vision, ' +
    '.foto-caja, .noticia, .grado-item, .tarjeta-contacto, .paso, .pregunta, ' +
    '.secu-area, .valor-chip, .nosotros-dato'
);

if (elementosAnimables.length) {
    elementosAnimables.forEach(el => el.classList.add('al-aparecer'));

    if ('IntersectionObserver' in window) {
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada, i) => {
                if (entrada.isIntersecting) {
                    setTimeout(() => entrada.target.classList.add('visible'), (i % 4) * 70);
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        elementosAnimables.forEach(el => observador.observe(el));
    } else {
        elementosAnimables.forEach(el => el.classList.add('visible'));
    }
}

// Botón "Volver arriba"
const botonArriba = document.createElement('button');
botonArriba.className = 'boton-arriba';
botonArriba.setAttribute('aria-label', 'Volver arriba');
botonArriba.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(botonArriba);

const alScrollearArriba = () => {
    botonArriba.classList.toggle('visible', window.scrollY > 480);
};
alScrollearArriba();
window.addEventListener('scroll', alScrollearArriba, { passive: true });
botonArriba.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
