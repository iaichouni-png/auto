// Animation de scroll fluide
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

// Animation de la navbar au scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 30px rgba(0,0,0,0.2)';
    }
    
    lastScroll = currentScroll;
});

// Animation des éléments au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer tous les éléments animés
document.querySelectorAll('.service-card, .vehicle-card, .pricing-card').forEach(el => {
    observer.observe(el);
});

// Animation du formulaire de contact
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Animation de succès
        const btn = contactForm.querySelector('.btn-submit');
        const originalText = btn.textContent;
        
        btn.textContent = '✓ Message envoyé !';
        btn.style.background = '#27ae60';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

// Animation du formulaire de recherche
const searchForm = document.querySelector('.search-form');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = searchForm.querySelector('.btn-search');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recherche...';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Résultats trouvés !';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-search"></i> Rechercher';
            }, 2000);
        }, 1500);
    });
}

// Animation des boutons de réservation
document.querySelectorAll('.btn-reserve').forEach(btn => {
    btn.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-check"></i> Ajouté !';
        this.style.background = '#27ae60';
        
        setTimeout(() => {
            this.innerHTML = 'Réserver';
            this.style.background = '';
        }, 2000);
    });
});

// Effet de parallaxe sur le hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});