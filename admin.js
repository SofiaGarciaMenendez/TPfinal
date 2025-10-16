// ===== FUNCIONES DE LOCALSTORAGE =====
function obtenerMensajes() {
  const mensajesGuardados = localStorage.getItem('mensajesCecilia');
  return mensajesGuardados ? JSON.parse(mensajesGuardados) : [];
}

function guardarMensajes(mensajesArray) {
  localStorage.setItem('mensajesCecilia', JSON.stringify(mensajesArray));
}

// ===== VARIABLES GLOBALES =====
let id = 0;
let mensajes = obtenerMensajes(); // Cargar desde localStorage

const lista = document.getElementById("lista");
const filtrados = document.getElementById("filtrados");
const buscados = document.getElementById("buscados");

// ===== FUNCIONES AUXILIARES =====

function linea(m) {
  return m.id + " | " + m.nombre + " | " + m.email + " | " + m.mensaje.substring(0, 50) + "... | " + m.fecha + " | " + (m.leido ? "LEÍDO" : "NO LEÍDO");
}


function imprimirLista(titulo, arr, salida) {
  let texto = titulo + "\n\n";
  if (arr.length === 0) {
    texto += "📭 No hay mensajes";
  } else {
    texto += "ID | NOMBRE | EMAIL | MENSAJE | FECHA | ESTADO\n";
    texto += "─".repeat(80) + "\n";
    for (let i = 0; i < arr.length; i++) {
      texto += linea(arr[i]) + "\n";
    }
  }
  salida.textContent = texto;
}

function render() {
  imprimirLista("📬 TODOS LOS MENSAJES", mensajes, lista);
  console.log("Estado actual:", mensajes);
}

function corregirIndices() {
  mensajes.forEach(function(m, i) {
    return m.id = i;
  });
  id = mensajes.length;
  guardarMensajes(mensajes); // Guardar en localStorage
}


function obtenerFecha() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const año = hoy.getFullYear();
  return dia + "/" + mes + "/" + año;
}

// ===== FUNCIONES CRUD =====

// AGREGAR MENSAJE
function agregarMensaje() {
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const mensaje = document.getElementById("mensaje").value;
  const leido = document.getElementById("leido").checked;

  // Validación
  if (!nombre || !email || !mensaje) {
    alert("⚠️ Por favor completa todos los campos");
    return;
  }


  const nuevoId = mensajes.length > 0 
    ? Math.max(...mensajes.map(m => m.id)) + 1 
    : 0;

  let objeto = {
    id: nuevoId,
    nombre: nombre,
    email: email,
    mensaje: mensaje,
    fecha: obtenerFecha(),
    leido: leido
  };

  mensajes.push(objeto);
  guardarMensajes(mensajes); // Guardar en localStorage
  render();

  // Limpiar formulario
  document.getElementById("nombre").value = "";
  document.getElementById("email").value = "";
  document.getElementById("mensaje").value = "";
  document.getElementById("leido").checked = false;

  alert("✅ Mensaje agregado correctamente");
}

// ELIMINAR MENSAJE
function eliminarMensaje() {
  const idAEliminar = document.getElementById("eliminar").value;
  
  if (idAEliminar === "") {
    alert("⚠️ Por favor ingresa un ID");
    return;
  }

  let i = mensajes.findIndex(function(m) {
    return String(m.id) === idAEliminar;
  });

  if (i === -1) {
    alert("❌ No existe un mensaje con ese ID");
    return;
  }

  mensajes.splice(i, 1);
  corregirIndices();
  guardarMensajes(mensajes); // Guardar en localStorage
  render();
  document.getElementById("eliminar").value = "";
  alert("✅ Mensaje eliminado correctamente");
}

// MARCAR COMO LEÍDO
function marcarLeido() {
  let idAMarcar = document.getElementById("marcado").value;
  
  if (idAMarcar === "") {
    alert("⚠️ Por favor ingresa un ID");
    return;
  }

  let i = mensajes.findIndex(function(m) {
    return String(m.id) === idAMarcar;
  });

  if (i === -1) {
    alert("❌ No existe un mensaje con ese ID");
    return;
  }

  mensajes[i].leido = true;
  guardarMensajes(mensajes); // Guardar en localStorage
  render();
  document.getElementById("marcado").value = "";
  alert("✅ Mensaje marcado como leído");
}

// FILTRAR MENSAJES
function filtrarMensajes() {
  let filtro = document.getElementById("filtrar").value;
  let mensajesFiltrados = [];

  if (filtro === "todos") {
    mensajesFiltrados = mensajes;
  } else if (filtro === "leidos") {
    mensajesFiltrados = mensajes.filter(function(m) {
      return m.leido === true;
    });
  } else if (filtro === "no-leidos") {
    mensajesFiltrados = mensajes.filter(function(m) {
      return m.leido === false;
    });
  }

  imprimirLista("🔍 MENSAJES FILTRADOS", mensajesFiltrados, filtrados);
}

// BUSCAR POR NOMBRE O EMAIL
function buscarMensajes() {
  const termino = document.getElementById("buscar").value.toLowerCase();
  
  if (termino === "") {
    alert("⚠️ Por favor ingresa un término de búsqueda");
    return;
  }

  const mensajesBuscados = mensajes.filter(function(m) {
    return m.nombre.toLowerCase().includes(termino) || 
           m.email.toLowerCase().includes(termino);
  });

  imprimirLista("🔎 RESULTADOS DE BÚSQUEDA", mensajesBuscados, buscados);
}

// ===== EVENT LISTENERS =====

const botonAgregar = document.getElementById("botonAgregar");
botonAgregar.addEventListener("click", agregarMensaje);

const botonEliminar = document.getElementById("botonEliminar");
botonEliminar.addEventListener("click", eliminarMensaje);

const botonMarcar = document.getElementById("botonMarcado");
botonMarcar.addEventListener("click", marcarLeido);

const botonFiltrar = document.getElementById("botonFiltrar");
botonFiltrar.addEventListener("click", filtrarMensajes);

const botonBuscar = document.getElementById("botonBuscar");
botonBuscar.addEventListener("click", buscarMensajes);

// ===== INICIALIZACIÓN =====
console.log("Sistema de mensajes cargado correctamente");
console.log("Mensajes cargados desde localStorage:", mensajes.length);
render();