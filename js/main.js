
document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        lang: localStorage.getItem('9anoun_lang') || 'en',
        translations: {}
    };

    // DOM Elements
    const elements = {
        langButtons: document.querySelectorAll('.lang-btn'),
        translatable: document.querySelectorAll('[data-i18n]'),
        html: document.documentElement,
        body: document.body,
        scrollIndicator: document.querySelector('.scroll-indicator'),
        sections: document.querySelectorAll('section'),
        navbar: document.querySelector('.navbar')
    };

    // Init
    const init = async () => {
        try {
            await loadTranslations();
            setLanguage(state.lang);
            setupEventListeners();
            setupScrollAnimations();
        } catch (error) {
            console.error('Initialization failed:', error);
        }
    };

    // Load Translations
    const loadTranslations = async () => {
        try {
            const response = await fetch('./translations/i18n.json');
            state.translations = await response.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    };

    // Set Language
    const setLanguage = (lang) => {
        state.lang = lang;
        localStorage.setItem('9anoun_lang', lang);

        // Update styling for RTL/LTR
        elements.html.lang = lang;
        elements.html.dir = lang === 'ar' ? 'rtl' : 'ltr';
        elements.body.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Update Active Button
        elements.langButtons.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Translate Content
        updateContent();
    };

    // Update Content
    const updateContent = () => {
        const t = state.translations[state.lang];
        if (!t) return;

        elements.translatable.forEach(el => {
            const key = el.dataset.i18n;
            const translation = t[key];

            if (translation) {
                if (el.tagName === 'META') {
                    el.content = translation;
                } else if (el.placeholder) {
                    el.placeholder = translation;
                } else {
                    el.innerHTML = translation; // Use innerHTML to support basic HTML like <br>
                }
            }
        });
    };

    // Event Listeners
    const setupEventListeners = () => {
        // Language Switcher
        elements.langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const newLang = btn.dataset.lang;
                if (newLang !== state.lang) {
                    setLanguage(newLang);
                }
            });
        });

        // Navigation Scroll Transparency
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                elements.navbar.style.background = 'rgba(10, 22, 18, 0.85)';
                elements.navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                elements.navbar.style.top = '0'; // Stick to top
                elements.navbar.style.width = '100%'; // Full width
                elements.navbar.style.borderRadius = '0'; // Square corners
            } else {
                elements.navbar.style.background = 'rgba(10, 22, 18, 0.2)';
                elements.navbar.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.15)';
                elements.navbar.style.top = 'var(--spacing-sm)'; // Float again
                elements.navbar.style.width = '90%'; // Float width
                elements.navbar.style.borderRadius = 'var(--radius-md)'; // Round corners
            }
        });

        // Scroll Indicator Click
        if (elements.scrollIndicator) {
            elements.scrollIndicator.addEventListener('click', () => {
                const firstSection = document.querySelector('section:nth-of-type(2)');
                if (firstSection) {
                    firstSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    };

    // Scroll Animations (Intersection Observer)
    const setupScrollAnimations = () => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: stop observing once visible
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Add fade-in class to all major elements
        const animatedElements = document.querySelectorAll('.about-card, .step, .video-card, .contact-card, .section-header');

        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    };

    // Run Init
    init();
});
