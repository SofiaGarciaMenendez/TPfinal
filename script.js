console.log("Cecilia Petersen Photography - Sitio cargado correctamente");

// ===== MENÚ  =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const overlay = document.getElementById('overlay');

// Abrir/cerrar menú al hacer click en el botón hamburguesa
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
  });
}

// Cerrar menú al hacer click en el overlay (fondo oscuro)
if (overlay) {
  overlay.addEventListener('click', () => {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
  });
}

// Cerrar menú al hacer click en un link (para móvil)
const navLinksItems = document.querySelectorAll('.nav-links a');
navLinksItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
  });
});

// ===== SMOOTH SCROLL =====
// Para que cuando hagas click en los links del menú, se deslice suavemente
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

// ===== FORMULARIO DE CONTACTO =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Obtener los valores del formulario
    const nombre = contactForm.querySelector('input[name="nombre"]').value;
    const email = contactForm.querySelector('input[name="email"]').value;
    const mensaje = contactForm.querySelector('textarea[name="mensaje"]').value;
    
    // Mostrar mensaje de confirmación
    alert(`Gracias ${nombre}! Tu mensaje ha sido enviado correctamente.`);
    
    // Limpiar el formulario
    contactForm.reset();
  });
}