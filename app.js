// El principal objetivo de este desafío es fortalecer tus habilidades en lógica de 
// programación. Aquí deberás desarrollar la lógica para resolver el problema.


// Array que almacenará los nombres añadidos por el usuario (cada elemento es una cadena).
let listaAmigos = []; // Mantiene el estado de los nombres actuales en memoria mientras la página esté abierta.

// Referencia al input donde el usuario escribe el nombre; la usamos para leer/limpiar/focar.
const inputAmigo = document.getElementById('amigo'); // busca en el HTML un elemento que tenga el atributo id="amigo".

// Referencia al elemento <ul> donde mostraremos la lista de amigos añadidos.
const ulLista = document.getElementById('listaAmigos'); // Aquí añadiremos <li> por cada nombre agregado.
                                                        // busca en el HTML un elemento que tenga el atributo id="listaAmigos".

// Referencia al elemento <ul> (o contenedor) donde mostraremos mensajes de resultado o error.
const ulResultado = document.getElementById('resultado'); // Área destinada a mensajes (sorteo, errores, avisos).

// Referencia al botón de "Sortear amigo" usando su clase; sirve para habilitar/deshabilitarlo.
const botonSortear = document.querySelector('.button-draw'); // Selecciona el botón principal de sorteo.
                                                             // busca el primer elemento en el DOM que tenga la clase "button-draw" 
                                                             // El . delante del nombre indica que es una clase (igual que en CSS).

// Función auxiliar: muestra un mensaje en el área de resultado; si esError=true lo marca visualmente.
function setResultadoMessage(mensaje, esError = false) { // Encapsula la lógica de mostrar mensajes al usuario.
    ulResultado.innerHTML = ''; // Limpia cualquier mensaje previo del contenedor de resultados.
    const li = document.createElement('li'); // Crea un nuevo elemento de lista para contener el mensaje.
    li.textContent = mensaje; // Asigna el texto del mensaje dentro del <li>.
    // Si es un error, cambiamos el estilo de color para destacarlo; si no, usamos color de éxito.
    if (esError) li.style.color = '#FF3333'; else li.style.color = '#05DF05'; // Estilos inline simples para visibilidad.
    ulResultado.appendChild(li); // Inserta el <li> con el mensaje dentro del contenedor de resultados.
}

// Función que actualiza el estado habilitado/deshabilitado del botón de sorteo según la cantidad de nombres.
function actualizarEstadoBotones() { // Mantiene la UI coherente con la lista de nombres.
    // Si no hay nombres, deshabilitamos el botón de sorteo para evitar sortear vacío.
    botonSortear.disabled = (listaAmigos.length === 0); // true si lista vacía -> botón deshabilitado.
}

// Función que renderiza la lista de amigos en el DOM (actualiza <ul id="listaAmigos">).
function mostrarLista() { // Refresca la lista visible cada vez que se añade o elimina un nombre.
    ulLista.innerHTML = ''; // Limpia la lista actual en pantalla para re-renderizar desde cero.
    // Recorremos los nombres almacenados y creamos un <li> por cada uno.
    listaAmigos.forEach(function(nombre, index) { // Iteración que proporciona nombre e índice en la lista.
        const li = document.createElement('li'); // Creamos un elemento de lista para este nombre.
        li.textContent = `${index + 1}. ${nombre}`; // Escribimos "1. Nombre" para mejor lectura.
        li.setAttribute('role', 'listitem'); // Mejora accesibilidad indicando que es un item de lista.
        ulLista.appendChild(li); // Insertamos el <li> en la lista visible del DOM.
    });
}



// Función para validar el texto ingresado: no vacío y sin dígitos
function validarNombre(nombre) { // Comprueba condiciones básicas de entrada y devuelve mensaje de error.
    if (nombre === '') { // Primera validación: campo vacío después de trim.
        return 'Por favor, escribe un nombre antes de añadir.'; // Mensaje que indica campo obligatorio.
    }
    // Segunda validación: si el nombre contiene cualquier dígito (0-9) lo consideramos inválido.
    if (/\d/.test(nombre)) { // Expresión regular que detecta cualquier carácter numérico en la cadena.
        return 'No se permiten números en el nombre. Por favor escribe solo letras y espacios.'; // Mensaje de error.
    }
    // Tercera validación: evitar duplicados (ignorando mayúsculas/minúsculas) para una mejor UX.
    const existe = listaAmigos.some(function(n) { // Chequea si ya hay un nombre equivalente en la lista.
        return n.toLowerCase() === nombre.toLowerCase(); // Comparación case-insensitive.
    });
    if (existe) { // Si ya existe un nombre igual, retornamos un texto de error.
        return 'Ese nombre ya fue añadido. Evita duplicados.'; // Mensaje para prevenir entradas repetidas.
    }
    return null; // Si todo está correcto, retornamos null indicando "sin error".
}

// Función que agrega un amigo a la lista (se llama desde el botón Añadir o al presionar Enter).
function agregarAmigo() { // Punto de entrada para añadir nombres desde la UI.
    const nombreRaw = inputAmigo.value; // Leemos exactamente lo que el usuario escribió (sin trim aún).
    const nombre = nombreRaw.trim(); // Eliminamos espacios al inicio y final para normalizar la entrada.
    const error = validarNombre(nombre); // Validamos la entrada y capturamos posible mensaje de error.
    if (error) { // Si la validación devolvió un mensaje, mostramos el error y retornamos sin añadir.
        setResultadoMessage('Error: ' + error, true); // Mostramos el error en el área de resultado.
        inputAmigo.focus(); // Volvemos a poner el foco en el input para que el usuario corrija rápidamente.
        return; // Salimos de la función para no añadir el nombre inválido.
    }
    // Si llegamos aquí, el nombre es válido: lo añadimos al array que lleva el estado.
    listaAmigos.push(nombre); // Insertamos el nombre al final de la lista en memoria.
    mostrarLista(); // Actualizamos la lista visible en pantalla para reflejar el nuevo nombre.
    setResultadoMessage(`Nombre "${nombre}" añadido correctamente.`); // Mensaje de confirmación al usuario.
    inputAmigo.value = ''; // Limpiamos el campo de entrada para facilitar la adición del siguiente nombre.
    inputAmigo.focus(); // Dejamos el foco en el input para una UX más fluida.
    actualizarEstadoBotones(); // Habilitamos o deshabilitamos botones según el nuevo estado de la lista.
}

// Función que realiza el sorteo y muestra un nombre aleatorio de la lista.
function sortearAmigo() { // Ejecuta la lógica de selección aleatoria cuando el usuario presiona "Sortear amigo".
    if (listaAmigos.length === 0) { // Verificación preventiva: si no hay nombres, no hay nada que sortear.
        setResultadoMessage('Error: Añade al menos un nombre antes de sortear.', true); // Indicamos el error.
        return; // Salimos sin intentar sortear.
    }
    // Calculamos un índice aleatorio entre 0 y listaAmigos.length-1 para seleccionar un nombre.
    const indiceAleatorio = Math.floor(Math.random() * listaAmigos.length); // Math.random()*n -> [0,n)
    const elegido = listaAmigos[indiceAleatorio]; // Recuperamos el nombre en esa posición aleatoria.
    // Mostramos el resultado del sorteo con formato claro y destacado.
    setResultadoMessage(`🎉 ¡El amigo secreto es: ${elegido}! 🎉`); // Mensaje final con el nombre seleccionado.
    // (Opcional) Si deseas remover al elegido para que no se repita en futuros sorteos, podrías hacerlo aquí.
    // Por ahora mantenemos la lista intacta para permitir sorteos repetidos con la misma población.
}

// Permitir añadir con la tecla Enter: escuchamos el evento 'keydown' en el input principal.
inputAmigo.addEventListener('keydown', function(event) { // Listener para detectar la tecla presionada.
    if (event.key === 'Enter') { // Si la tecla es Enter, ejecutamos la función de añadir.
        event.preventDefault(); // Evitamos el comportamiento por defecto (por si hay formularios).
        agregarAmigo(); // Llamamos a la misma función que el botón 'Añadir' para mantener la lógica centralizada.
    }
});

// Inicialización: dejamos todo en su estado correcto cuando se carga el script.
(function inicializar() { // Agrupar la inicialización.
    mostrarLista(); // Mostramos la lista (vacía inicialmente) para garantizar estructura en el DOM.
    actualizarEstadoBotones(); // Actualizamos el estado del botón de sorteo al cargar la página.
    ulResultado.innerHTML = ''; // Aseguramos que no haya mensajes previos al inicio.
    // Opcional: enfocar el input para que el usuario pueda empezar a escribir inmediatamente.
    inputAmigo.focus(); // Mejora la experiencia poniendo el cursor listo en el campo de nombre.
})();


