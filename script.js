/* ============================================
   KEYFRAME STUDIO — Scripts
   Menu mobile, animations au scroll, lazy load vidéos
   ============================================ */

// --- MENU MOBILE ---
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animation burger → croix
  const spans = menuToggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Fermer le menu quand on clique sur un lien
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});


// --- ANIMATIONS AU SCROLL ---
// Les éléments avec la classe "reveal" apparaissent quand ils entrent dans le viewport (la zone visible de l'écran)
function addRevealClasses() {
  const elements = document.querySelectorAll(
    '.section-label, .section-title, .video-wrapper, .problem-card, .step, .contact-sub, .contact-actions'
  );
  elements.forEach(el => el.classList.add('reveal'));
}

function handleScroll() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    // L'élément est visible quand son haut est à moins de 85% de la hauteur de la fenêtre
    if (rect.top < window.innerHeight * 0.85) {
      // Petit délai entre chaque élément pour un effet en cascade
      setTimeout(() => {
        el.classList.add('visible');
      }, index * 60);
    }
  });
}

// Initialisation
addRevealClasses();
// Premier check immédiat (pour les éléments déjà visibles)
handleScroll();
// Puis à chaque scroll
window.addEventListener('scroll', handleScroll, { passive: true });


// --- LAZY LOADING DES VIDÉOS ---
// Les iframes ne chargent que quand elles sont proches du viewport
// Ça accélère le chargement initial de la page
function lazyLoadVideos() {
  const iframes = document.querySelectorAll('iframe[data-src]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        const src = iframe.getAttribute('data-src');
        // Ne charge que si le lien est valide (pas le placeholder)
        if (src && !src.includes('REMPLACE')) {
          iframe.setAttribute('src', src);
          // Cache le placeholder
          const placeholder = iframe.nextElementSibling;
          if (placeholder && placeholder.classList.contains('video-placeholder')) {
            placeholder.style.display = 'none';
          }
        }
        observer.unobserve(iframe);
      }
    });
  }, {
    rootMargin: '200px' // Charge 200px avant que l'iframe soit visible
  });

  iframes.forEach(iframe => observer.observe(iframe));
}

lazyLoadVideos();


// --- NAVBAR : effet au scroll ---
// La barre de navigation devient plus opaque quand on scroll vers le bas
// + le lien de la section visible s'illumine (lueur bleue)
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(10, 10, 15, 0.95)';
  } else {
    navbar.style.background = 'rgba(10, 10, 15, 0.85)';
  }

  // Détecte quelle section est visible et active le bon lien
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
      currentSection = section.getAttribute('id');
    }
  });

  navItems.forEach(link => {
    link.classList.remove('active');
    // Vérifie si le href du lien correspond à la section visible
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}, { passive: true });
