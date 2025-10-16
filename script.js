console.log("Cecilia Petersen Photography - Sitio cargado correctamente");

// ===== MENÚ MÓVIL =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const overlay = document.getElementById('overlay');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
  });
}

if (overlay) {
  overlay.addEventListener('click', () => {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
  });
}

const navLinksItems = document.querySelectorAll('.nav-links a');
navLinksItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== FUNCIONES DE LOCALSTORAGE =====
function obtenerMensajes() {
  const mensajesGuardados = localStorage.getItem('mensajesCecilia');
  return mensajesGuardados ? JSON.parse(mensajesGuardados) : [];
}

function guardarMensajes(mensajes) {
  localStorage.setItem('mensajesCecilia', JSON.stringify(mensajes));
}

function obtenerFecha() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const año = hoy.getFullYear();
  return dia + "/" + mes + "/" + año;
}

// ===== FORMULARIO DE CONTACTO =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = contactForm.querySelector('input[name="nombre"]').value;
    const email = contactForm.querySelector('input[name="email"]').value;
    const mensaje = contactForm.querySelector('textarea[name="mensaje"]').value;
    
    if (!nombre || !email || !mensaje) {
      alert("⚠️ Por favor completa todos los campos");
      return;
    }
    
    const mensajes = obtenerMensajes();
    
    const nuevoId = mensajes.length > 0 
      ? Math.max(...mensajes.map(m => m.id)) + 1 
      : 0;
    
    const nuevoMensaje = {
      id: nuevoId,
      nombre: nombre,
      email: email,
      mensaje: mensaje,
      fecha: obtenerFecha(),
      leido: false
    };
    
    mensajes.push(nuevoMensaje);
    guardarMensajes(mensajes);
    
    alert(`✅ ¡Gracias ${nombre}! Tu mensaje ha sido enviado correctamente.\n\nPodrás verlo en el panel de administración.`);
    
    contactForm.reset();
    
    console.log("Mensaje guardado:", nuevoMensaje);
  });
}