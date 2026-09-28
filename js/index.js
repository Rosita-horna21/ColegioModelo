const slides = document.querySelectorAll('#carruselFondo .slide');
const indicadores = document.getElementById('indicadoresCarrusel');
let indiceActual = 0;
let temporizador;

if (slides.length && indicadores) {
    slides.forEach((_, i) => {
        const punto = document.createElement('span');
        if (i === 0) punto.classList.add('activo');
        punto.addEventListener('click', () => irASlide(i));
        indicadores.appendChild(punto);
    });

    function irASlide(indice) {
        slides[indiceActual].classList.remove('active');
        indicadores.children[indiceActual].classList.remove('activo');
        indiceActual = indice;
        slides[indiceActual].classList.add('active');
        indicadores.children[indiceActual].classList.add('activo');
    }

    function siguienteSlide() {
        irASlide((indiceActual + 1) % slides.length);
    }

    function iniciarCarrusel() {
        clearInterval(temporizador);
        temporizador = setInterval(siguienteSlide, 6000);
    }

    iniciarCarrusel();
}

// Contador animado para las estadísticas del hero
const numerosEstadistica = document.querySelectorAll('.tarjeta-flip-front h3');

if (numerosEstadistica.length) {
    const animarNumero = (el) => {
        const texto = el.textContent.trim();
        const meta = parseInt(texto.replace(/\D/g, ''), 10);
        const sufijo = texto.replace(/[0-9]/g, '');
        if (isNaN(meta)) return;
        let inicio = 0;
        const duracion = 1400;
        const t0 = performance.now();
        const paso = (ahora) => {
            const progreso = Math.min((ahora - t0) / duracion, 1);
            const valor = Math.floor(progreso * meta);
            el.textContent = valor + sufijo;
            if (progreso < 1) requestAnimationFrame(paso);
            else el.textContent = meta + sufijo;
        };
        requestAnimationFrame(paso);
    };

    if ('IntersectionObserver' in window) {
        const observadorNumeros = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    animarNumero(entrada.target);
                    observadorNumeros.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.6 });
        numerosEstadistica.forEach(el => observadorNumeros.observe(el));
    }
}
