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

// ===== FORMULARIO DE CONTRATACIÓN =====
const contratarForm = document.getElementById('contratarForm');

if (contratarForm) {
  // Establecer fecha mínima (hoy)
  const fechaInput = document.getElementById('fecha');
  const hoy = new Date().toISOString().split('T')[0];
  fechaInput.setAttribute('min', hoy);

  contratarForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const tipoServicio = document.getElementById('tipoServicio').value;
    const fecha = document.getElementById('fecha').value;
    const detalles = document.getElementById('detalles').value;
    
    // Validación
    if (!nombre || !email || !telefono || !tipoServicio || !fecha) {
      alert("⚠️ Por favor completa todos los campos obligatorios");
      return;
    }
    
    // Obtener solicitudes existentes
    const solicitudes = obtenerSolicitudes();
    
    // Calcular nuevo ID
    const nuevoId = solicitudes.length > 0 
      ? Math.max(...solicitudes.map(s => s.id)) + 1 
      : 0;
    
    // Formatear fecha de evento
    const fechaParts = fecha.split('-');
    const fechaFormateada = fechaParts[2] + '/' + fechaParts[1] + '/' + fechaParts[0];
    
    // Crear nueva solicitud
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
    
    // Agregar y guardar
    solicitudes.push(nuevaSolicitud);
    guardarSolicitudes(solicitudes);
    
    // Mostrar confirmación
    alert(`✅ ¡Gracias ${nombre}!\n\nTu solicitud ha sido enviada correctamente.\nTe contactaré a la brevedad para coordinar los detalles.\n\nServicio: ${tipoServicio}\nFecha: ${fechaFormateada}`);
    
    // Limpiar formulario
    contratarForm.reset();
    
    console.log("Solicitud guardada:", nuevaSolicitud);
  });
}

console.log("Sistema de contratación cargado correctamente");