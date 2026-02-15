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

// Fonction pour fermer la bannière prototype
function closeBanner() {
    const banner = document.querySelector('.prototype-banner');
    if (banner) {
        banner.style.display = 'none';
        document.body.style.paddingTop = '0';
        navbar.style.top = '0';
    }
}

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

// Système de filtrage des véhicules avec badge "Disponible"
const searchForm = document.querySelector('.search-form');
const vehicleTypeSelect = searchForm ? searchForm.querySelector('select') : null;
const vehicleCards = document.querySelectorAll('.vehicle-card');

if (vehicleTypeSelect) {
    vehicleTypeSelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        
        vehicleCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            // Supprimer les anciens badges "Disponible"
            const existingBadge = card.querySelector('.available-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            if (selectedCategory === 'Tous les véhicules') {
                // Afficher toutes les voitures
                card.style.display = 'block';
                card.style.opacity = '1';
            } else if (cardCategory === selectedCategory) {
                // Afficher et ajouter le badge "Disponible"
                card.style.display = 'block';
                card.style.opacity = '1';
                
                // Créer et ajouter le badge "Disponible"
                const availableBadge = document.createElement('div');
                availableBadge.className = 'available-badge';
                availableBadge.innerHTML = '<i class="fas fa-check-circle"></i> Disponible';
                card.appendChild(availableBadge);
            } else {
                // Masquer les voitures non correspondantes
                card.style.opacity = '0.3';
                card.style.transform = 'scale(0.95)';
            }
        });
    });
}

// Animation du formulaire de recherche
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = searchForm.querySelector('.btn-search');
        const selectedCategory = vehicleTypeSelect ? vehicleTypeSelect.value : 'Tous les véhicules';
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recherche...';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Résultats trouvés !';
            
            // Ajouter le badge "Disponible" sur TOUTES les voitures après la recherche
            vehicleCards.forEach(card => {
                // Supprimer les anciens badges "Disponible"
                const existingBadge = card.querySelector('.available-badge');
                if (existingBadge) {
                    existingBadge.remove();
                }
                
                // Ajouter le badge "Disponible" sur toutes les voitures
                const availableBadge = document.createElement('div');
                availableBadge.className = 'available-badge';
                availableBadge.innerHTML = '<i class="fas fa-check-circle"></i> Disponible';
                card.appendChild(availableBadge);
                
                // S'assurer que la voiture est visible
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
            
            // Scroll vers la section véhicules
            const vehiclesSection = document.querySelector('#vehicules');
            if (vehiclesSection) {
                vehiclesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-search"></i> Rechercher';
            }, 2000);
        }, 1500);
    });
}

// Redirection WhatsApp pour les boutons de réservation
document.querySelectorAll('.btn-reserve').forEach(btn => {
    btn.addEventListener('click', function() {
        // Récupérer les informations du véhicule
        const vehicleCard = this.closest('.vehicle-card');
        const vehicleName = vehicleCard.getAttribute('data-vehicle-name');
        const vehiclePrice = vehicleCard.getAttribute('data-price');
        const vehicleCategory = vehicleCard.getAttribute('data-category');
        
        // Numéro WhatsApp (format international pour le Maroc)
        const phoneNumber = '212663730766'; // +212 663730766
        
        // Message pré-formaté
        const message = `Bonjour,\n\nJe suis intéressé(e) par le véhicule suivant :\n\n🚗 Modèle : ${vehicleName}\n📁 Catégorie : ${vehicleCategory}\n💰 Prix : ${vehiclePrice * 10} MAD/jour\n\nEst-il disponible pour une location ?\nJ'aimerais faire une réservation.\n\nMerci !`;
        
        // Encoder le message pour l'URL
        const encodedMessage = encodeURIComponent(message);
        
        // Créer l'URL WhatsApp
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Animation du bouton avant redirection
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirection...';
        this.style.background = '#25D366'; // Couleur WhatsApp
        
        // Rediriger vers WhatsApp après une courte animation
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
            
            // Réinitialiser le bouton
            setTimeout(() => {
                this.innerHTML = 'Réserver';
                this.style.background = '';
            }, 1000);
        }, 500);
    });
});

// Effet de parallaxe sur le hero (désactivé sur mobile)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    // Vérifier si on est sur mobile
    const isMobile = window.innerWidth <= 768;
    
    if (hero && !isMobile) {
        // Appliquer l'effet parallaxe uniquement sur desktop
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    } else if (hero && isMobile) {
        // S'assurer que le transform est réinitialisé sur mobile
        hero.style.transform = 'none';
    }
});

// Réinitialiser le parallaxe lors du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    const hero = document.querySelector('.hero');
    const isMobile = window.innerWidth <= 768;
    
    if (hero && isMobile) {
        hero.style.transform = 'none';
    }
});
