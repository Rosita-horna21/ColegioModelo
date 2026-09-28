const formulario = document.getElementById("formularioContacto");
const mensaje = document.getElementById("mensajeFormulario");

formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const asunto = document.getElementById("asunto").value.trim();
    const texto = document.getElementById("mensaje").value.trim();

    mensaje.textContent = "";
    mensaje.className = "mensaje-formulario";

    if (nombre === "" || correo === "" || telefono === "" || asunto === "" || texto === "") {
        mostrarError("Completa todos los campos.");
        return;
    }
    if (nombre.length < 5) {
        mostrarError("Ingresa un nombre válido.");
        return;
    }
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoValido.test(correo)) {
        mostrarError("Ingresa un correo válido.");
        return;
    }
    if (!/^[0-9]{9}$/.test(telefono)) {
        mostrarError("El teléfono debe tener 9 dígitos.");
        return;
    }
    if (asunto.length < 5) {
        mostrarError("El asunto debe tener mínimo 5 caracteres.");
        return;
    }
    if (texto.length < 10 || texto.length > 600) {
        mostrarError("El mensaje debe tener entre 10 y 600 caracteres.");
        return;
    }

    const boton = formulario.querySelector("button");
    boton.disabled = true;
    boton.innerHTML = 'Enviando <i class="fas fa-spinner fa-spin"></i>';

    try {
        const respuesta = await fetch(formulario.action, {
            method: "POST",
            body: new FormData(formulario)
        });

        if (respuesta.ok) {
            mostrarExito("Mensaje enviado correctamente.");
            formulario.reset();
        } else {
            mostrarError("No se pudo enviar el mensaje.");
        }
    } catch {
        mostrarError("Error al conectar. Inténtalo nuevamente.");
    }

    boton.disabled = false;
    boton.innerHTML = 'Enviar mensaje <i class="fas fa-paper-plane"></i>';
});

function mostrarError(texto) {
    mensaje.className = "mensaje-formulario error";
    mensaje.textContent = texto;
}

function mostrarExito(texto) {
    mensaje.className = "mensaje-formulario exito";
    mensaje.textContent = texto;
}
