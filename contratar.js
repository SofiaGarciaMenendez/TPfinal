// ===== FUNCIONES DE LOCALSTORAGE =====
function obtenerSolicitudes() {
  const solicitudesGuardadas = localStorage.getItem('solicitudesCecilia');
  return solicitudesGuardadas ? JSON.parse(solicitudesGuardadas) : [];
}

function guardarSolicitudes(solicitudes) {
  localStorage.setItem('solicitudesCecilia', JSON.stringify(solicitudes));
}

function obtenerFecha() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const año = hoy.getFullYear();
  return dia + "/" + mes + "/" + año;
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
    texto += "No hay solicitudes";
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
  imprimirLista("TODAS TUS SOLICITUDES", solicitudes, lista);
  actualizarEstadisticas();
  console.log("Estado actual:", solicitudes);
}

function corregirIndices() {
  solicitudes.forEach(function(s, i) {
    return s.id = i;
  });
  guardarSolicitudes(solicitudes);
}

// ===== CREAR SOLICITUD (CREATE) =====
const contratarForm = document.getElementById('contratarForm');

if (contratarForm) {
  const fechaInput = document.getElementById('fecha');
  const hoy = new Date().toISOString().split('T')[0];
  fechaInput.setAttribute('min', hoy);

  contratarForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const tipoServicio = document.getElementById('tipoServicio').value;
    const fecha = document.getElementById('fecha').value;
    const detalles = document.getElementById('detalles').value;
    
    if (!nombre || !email || !telefono || !tipoServicio || !fecha) {
      alert("⚠️ Por favor completa todos los campos obligatorios");
      return;
    }
    
    solicitudes = obtenerSolicitudes();
    
    const nuevoId = solicitudes.length > 0 
      ? Math.max(...solicitudes.map(s => s.id)) + 1 
      : 0;
    
    const fechaParts = fecha.split('-');
    const fechaFormateada = fechaParts[2] + '/' + fechaParts[1] + '/' + fechaParts[0];
    
    const nuevaSolicitud = {
      id: nuevoId,
      nombre: nombre,
      email: email,
      telefono: telefono,
      tipoServicio: tipoServicio,
      fechaEvento: fechaFormateada,
      detalles: detalles || 'Sin detalles adicionales',
      fechaSolicitud: obtenerFecha(),
      estado: 'Pendiente'
    };
    
    solicitudes.push(nuevaSolicitud);
    guardarSolicitudes(solicitudes);
    
    alert(`✅ ¡Gracias ${nombre}!\n\nTu solicitud ha sido enviada correctamente.\n\nServicio: ${tipoServicio}\nFecha: ${fechaFormateada}`);
    
    contratarForm.reset();
    render();
    
    console.log("Solicitud guardada:", nuevaSolicitud);
  });
}

// ===== CAMBIAR ESTADO (UPDATE) =====
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

// ===== ELIMINAR SOLICITUD (DELETE) =====
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

// ===== FILTRAR SOLICITUDES (READ CON FILTRO) =====
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

  imprimirLista("SOLICITUDES FILTRADAS", solicitudesFiltradas, filtradas);
}

// ===== BUSCAR POR NOMBRE O EMAIL (READ CON BÚSQUEDA) =====
function buscarSolicitudes() {
  const termino = document.getElementById("buscar").value.toLowerCase();
  
  if (termino === "") {
    alert("⚠️ Por favor ingresa un término de búsqueda");
    return;
  }

  const regex = new RegExp("\\b" + termino + "\\b", "i");

  const solicitudesBuscadas = solicitudes.filter(function(s) {
    return regex.test(s.nombre) || regex.test(s.email);
  });

  imprimirLista("RESULTADOS DE BÚSQUEDA", solicitudesBuscadas, buscadas);
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
console.log("Sistema de contratación con CRUD cargado correctamente");
console.log("Solicitudes cargadas desde localStorage:", solicitudes.length);
render();