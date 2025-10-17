// ===== FUNCIONES DE LOCALSTORAGE =====
function obtenerSolicitudes() {
  const solicitudesGuardadas = localStorage.getItem('solicitudesCecilia');
  return solicitudesGuardadas ? JSON.parse(solicitudesGuardadas) : [];
}

function guardarSolicitudes(solicitudesArray) {
  localStorage.setItem('solicitudesCecilia', JSON.stringify(solicitudesArray));
}

// ===== VARIABLES GLOBALES =====
let solicitudes = obtenerSolicitudes();

const lista = document.getElementById("lista");
const filtradas = document.getElementById("filtradas");
const buscadas = document.getElementById("buscadas");

// ===== FUNCIONES AUXILIARES =====

function linea(s) {
  return s.id + " | " + s.nombre + " | " + s.email + " | " + s.telefono + " | " + s.tipoServicio + " | " + s.fechaEvento + " | " + s.estado;
}

function imprimirLista(titulo, arr, salida) {
  let texto = titulo + "\n\n";
  if (arr.length === 0) {
    texto += "📭 No hay solicitudes";
  } else {
    texto += "ID | NOMBRE | EMAIL | TELÉFONO | SERVICIO | FECHA EVENTO | ESTADO\n";
    texto += "─".repeat(100) + "\n";
    for (let i = 0; i < arr.length; i++) {
      texto += linea(arr[i]) + "\n";
    }
  }
  salida.textContent = texto;
}

function actualizarEstadisticas() {
  const total = solicitudes.length;
  const pendientes = solicitudes.filter(s => s.estado === 'Pendiente').length;
  const confirmadas = solicitudes.filter(s => s.estado === 'Confirmada').length;
  const rechazadas = solicitudes.filter(s => s.estado === 'Rechazada').length;
  
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statPendientes').textContent = pendientes;
  document.getElementById('statConfirmadas').textContent = confirmadas;
  document.getElementById('statRechazadas').textContent = rechazadas;
}

function render() {
  imprimirLista("📬 TODAS LAS SOLICITUDES", solicitudes, lista);
  actualizarEstadisticas();
  console.log("Estado actual:", solicitudes);
}

function corregirIndices() {
  solicitudes.forEach(function(s, i) {
    return s.id = i;
  });
  guardarSolicitudes(solicitudes);
}

// ===== FUNCIONES CRUD =====

// CAMBIAR ESTADO
function cambiarEstado() {
  const idSolicitud = document.getElementById("idEstado").value;
  const nuevoEstado = document.getElementById("nuevoEstado").value;
  
  if (idSolicitud === "") {
    alert("⚠️ Por favor ingresa un ID");
    return;
  }

  let i = solicitudes.findIndex(function(s) {
    return String(s.id) === idSolicitud;
  });

  if (i === -1) {
    alert("❌ No existe una solicitud con ese ID");
    return;
  }

  solicitudes[i].estado = nuevoEstado;
  guardarSolicitudes(solicitudes);
  render();
  document.getElementById("idEstado").value = "";
  alert(`✅ Estado cambiado a: ${nuevoEstado}`);
}

// ELIMINAR SOLICITUD
function eliminarSolicitud() {
  const idAEliminar = document.getElementById("eliminar").value;
  
  if (idAEliminar === "") {
    alert("⚠️ Por favor ingresa un ID");
    return;
  }

  let i = solicitudes.findIndex(function(s) {
    return String(s.id) === idAEliminar;
  });

  if (i === -1) {
    alert("❌ No existe una solicitud con ese ID");
    return;
  }

  if (confirm("¿Estás segura de que querés eliminar esta solicitud?")) {
    solicitudes.splice(i, 1);
    corregirIndices();
    guardarSolicitudes(solicitudes);
    render();
    document.getElementById("eliminar").value = "";
    alert("✅ Solicitud eliminada correctamente");
  }
}

// FILTRAR SOLICITUDES
function filtrarSolicitudes() {
  let filtro = document.getElementById("filtrar").value;
  let solicitudesFiltradas = [];

  if (filtro === "todos") {
    solicitudesFiltradas = solicitudes;
  } else {
    solicitudesFiltradas = solicitudes.filter(function(s) {
      return s.estado === filtro;
    });
  }

  imprimirLista("🔍 SOLICITUDES FILTRADAS", solicitudesFiltradas, filtradas);
}

// BUSCAR POR NOMBRE O EMAIL
function buscarSolicitudes() {
  const termino = document.getElementById("buscar").value.toLowerCase();
  
  if (termino === "") {
    alert("⚠️ Por favor ingresa un término de búsqueda");
    return;
  }

  const solicitudesBuscadas = solicitudes.filter(function(s) {
    return s.nombre.toLowerCase().includes(termino) || 
           s.email.toLowerCase().includes(termino);
  });

  imprimirLista("🔎 RESULTADOS DE BÚSQUEDA", solicitudesBuscadas, buscadas);
}

// ===== EVENT LISTENERS =====

const botonEstado = document.getElementById("botonEstado");
botonEstado.addEventListener("click", cambiarEstado);

const botonEliminar = document.getElementById("botonEliminar");
botonEliminar.addEventListener("click", eliminarSolicitud);

const botonFiltrar = document.getElementById("botonFiltrar");
botonFiltrar.addEventListener("click", filtrarSolicitudes);

const botonBuscar = document.getElementById("botonBuscar");
botonBuscar.addEventListener("click", buscarSolicitudes);

// ===== INICIALIZACIÓN =====
console.log("Sistema de administración cargado correctamente");
console.log("Solicitudes cargadas desde localStorage:", solicitudes.length);
render();