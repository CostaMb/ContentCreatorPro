// translator.js - Sistem de traduceri RO/EN - VERSIUNE FINALĂ

// Traduceri
const translations = {
    ro: {
        'login': 'Login',
        'register': 'Register',
        'hero_title': 'Transformă-ți ideile în',
        'hero_title_span': 'conținut viral',
        'hero_subtitle': 'Platforma all-in-one pentru creatori de conținut. Generează text, hashtag-uri, optimizare SEO și multe altele pentru toate platformele sociale.',
        'active_creators': 'Creatori activi',
        'posts_generated': 'Postări generate',
        'satisfaction': 'Satisfacție',
        'start_free': 'Începe gratuit',
        'learn_more': 'Află mai multe'
    },
    en: {
        'login': 'Login',
        'register': 'Register',
        'hero_title': 'Turn your ideas into',
        'hero_title_span': 'viral content',
        'hero_subtitle': 'All-in-one platform for content creators. Generate text, hashtags, SEO optimization and more for all social platforms.',
        'active_creators': 'Active creators',
        'posts_generated': 'Posts generated',
        'satisfaction': 'Satisfaction',
        'start_free': 'Start free',
        'learn_more': 'Learn more'
    }
};

// Current language
let currentLang = 'ro';

// Switch language function
function switchLanguage(lang) {
    currentLang = lang;
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick')?.includes(lang)) {
            btn.classList.add('active');
        }
    });
    
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Simple translation for now - just update some elements
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const span = heroTitle.querySelector('.gradient-text');
        if (span) {
            span.textContent = translations[lang]['hero_title_span'];
        }
        heroTitle.childNodes[0].textContent = translations[lang]['hero_title'] + ' ';
    }
    
    const heroSubtitle = document.querySelector('.hero p');
    if (heroSubtitle) {
        heroSubtitle.textContent = translations[lang]['hero_subtitle'];
    }
    
    // Update buttons
    const loginBtn = document.querySelector('.btn-outline span');
    const registerBtn = document.querySelector('.btn-primary span');
    if (loginBtn) loginBtn.textContent = translations[lang]['login'];
    if (registerBtn) registerBtn.textContent = translations[lang]['register'];
}

// Initialize translations
function initTranslations() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'ro';
    switchLanguage(savedLang);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initTranslations);

// Export functions
window.switchLanguage = switchLanguage;