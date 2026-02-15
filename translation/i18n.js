// i18n.js - Internationalization System for AutoLoca
// Supports English (EN), Arabic (AR), and French (FR)

class I18n {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.translations = {};
        this.rtlLanguages = ['ar'];
        this.init();
    }

    // Detect user's preferred language
    detectLanguage() {
        // Check localStorage first
        const savedLang = localStorage.getItem('autolocaLang');
        if (savedLang && ['en', 'ar', 'fr'].includes(savedLang)) {
            return savedLang;
        }

        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        
        // Map browser language to supported languages
        if (langCode === 'ar') return 'ar';
        if (langCode === 'en') return 'en';
        
        // Default to French
        return 'fr';
    }

    // Initialize the i18n system
    init() {
        // Load translations if available
        if (typeof translations !== 'undefined') {
            this.translations = translations;
        }

        // Apply initial language
        this.applyLanguage(this.currentLang);
        
        // Set up language selector listeners
        this.setupLanguageSelector();
    }

    // Apply language to the page
    applyLanguage(lang) {
        this.currentLang = lang;
        
        // Save to localStorage
        localStorage.setItem('autolocaLang', lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Handle RTL/LTR direction
        if (this.rtlLanguages.includes(lang)) {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl');
        } else {
            document.documentElement.dir = 'ltr';
            document.body.classList.remove('rtl');
        }
        
        // Translate all elements with data-i18n attribute
        this.translatePage();
        
        // Update language selector UI
        this.updateLanguageSelector();
    }

    // Translate all elements on the page
    translatePage() {
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (translation) {
                // Check if element has data-i18n-attr for attribute translation
                const attr = element.getAttribute('data-i18n-attr');
                if (attr) {
                    element.setAttribute(attr, translation);
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Translate elements with data-i18n-html (for HTML content)
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = this.getTranslation(key);
            
            if (translation) {
                element.innerHTML = translation;
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getTranslation(key);
            
            if (translation) {
                element.placeholder = translation;
            }
        });
    }

    // Get translation by key
    getTranslation(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                console.warn(`Translation not found: ${key} for language: ${this.currentLang}`);
                return null;
            }
        }
        
        return value;
    }

    // Switch language
    switchLanguage(lang) {
        if (['en', 'ar', 'fr'].includes(lang) && lang !== this.currentLang) {
            // Add transition effect
            document.body.style.opacity = '0.7';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                this.applyLanguage(lang);
                
                // Restore opacity
                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 50);
            }, 150);
        }
    }

    // Setup language selector event listeners
    setupLanguageSelector() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.attachLanguageSelectorListeners();
            });
        } else {
            this.attachLanguageSelectorListeners();
        }
    }

    // Attach event listeners to language selector
    attachLanguageSelectorListeners() {
        const dropdownBtn = document.getElementById('langDropdownBtn');
        const dropdownMenu = document.getElementById('langDropdownMenu');
        const langOptions = document.querySelectorAll('.lang-option');
        
        if (!dropdownBtn || !dropdownMenu) return;
        
        // Toggle dropdown on button click
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
            dropdownBtn.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                dropdownBtn.classList.remove('active');
            }
        });
        
        // Handle language selection
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                this.switchLanguage(lang);
                
                // Close dropdown after selection
                dropdownMenu.classList.remove('show');
                dropdownBtn.classList.remove('active');
            });
        });
    }

    // Update language selector UI to show active language
    updateLanguageSelector() {
        const currentLangSpan = document.getElementById('currentLang');
        const langOptions = document.querySelectorAll('.lang-option');
        
        // Update button text
        if (currentLangSpan) {
            currentLangSpan.textContent = this.currentLang.toUpperCase();
        }
        
        // Update active state in dropdown
        langOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === this.currentLang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLang;
    }

    // Check if current language is RTL
    isRTL() {
        return this.rtlLanguages.includes(this.currentLang);
    }
}

// Initialize i18n system
let i18nInstance;

// Wait for translations to be loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        i18nInstance = new I18n();
    });
} else {
    i18nInstance = new I18n();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
