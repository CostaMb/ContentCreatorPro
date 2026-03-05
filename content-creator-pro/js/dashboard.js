// dashboard.js - VERSIUNE FINALĂ CU DARK MODE

// Inițializare dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserName();
    updateUsageStats();
    resetDailyUsage();
    initTheme();
});

// Inițializare temă dark/light
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) {
        console.log('Theme toggle button not found');
        return;
    }
    
    const icon = themeToggle.querySelector('i');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    console.log('Saved theme:', savedTheme);
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        toggleTheme();
    });
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    
    if (currentTheme === 'dark') {
        // Switch to light
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
        console.log('Theme switched to light');
    } else {
        // Switch to dark
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
        console.log('Theme switched to dark');
    }
}

// Încarcă numele utilizatorului
function loadUserName() {
    const currentUser = getCurrentUser();
    const userNameElement = document.getElementById('userName');
    
    if (currentUser && currentUser.name && userNameElement) {
        userNameElement.textContent = currentUser.name;
    } else if (userNameElement) {
        userNameElement.textContent = 'Utilizator';
    }
}

// Toggle meniu utilizator
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Închide dropdown la click outside
window.addEventListener('click', function(e) {
    if (!e.target.closest('.user-menu')) {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }
});

// Navigare
function showDashboard() {
    const quickActions = document.querySelector('.quick-actions');
    const recentActivity = document.querySelector('.recent-activity');
    const generator = document.getElementById('contentGenerator');
    
    if (quickActions) quickActions.style.display = 'block';
    if (recentActivity) recentActivity.style.display = 'block';
    if (generator) generator.style.display = 'none';
    
    updateActiveMenu('dashboard');
}

function showGenerator() {
    const quickActions = document.querySelector('.quick-actions');
    const recentActivity = document.querySelector('.recent-activity');
    const generator = document.getElementById('contentGenerator');
    
    if (quickActions) quickActions.style.display = 'none';
    if (recentActivity) recentActivity.style.display = 'none';
    if (generator) generator.style.display = 'block';
    
    updateActiveMenu('generator');
}

function showHashtags() {
    showNotification('Hashtag Generator - În curând!', 'info');
}

function showPlanner() {
    showNotification('Content Planner - În curând!', 'info');
}

function showAnalytics() {
    showNotification('Analytics - În curând!', 'info');
}

function showHistory() {
    showNotification('Istoric - În curând!', 'info');
}

function showSaved() {
    showNotification('Conținut salvat - În curând!', 'info');
}

function showProfile() {
    showNotification('Profil - În curând!', 'info');
}

function showSettings() {
    showNotification('Setări - În curând!', 'info');
}

function showBilling() {
    showNotification('Facturare - În curând!', 'info');
}

// Update menu active
function updateActiveMenu(section) {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const menuItems = document.querySelectorAll('.menu-item');
    if (section === 'dashboard' && menuItems[0]) menuItems[0].classList.add('active');
    if (section === 'generator' && menuItems[1]) menuItems[1].classList.add('active');
}

// Platform selection
function selectPlatform(platform) {
    document.querySelectorAll('.platform-option').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.platform-option').classList.add('active');
}

// Generate content
function generateContent() {
    const topic = document.getElementById('topicInput')?.value;
    
    if (!topic) {
        showNotification('Te rog introdu un subiect!', 'error');
        return;
    }
    
    // Check daily limit
    let usage = parseInt(localStorage.getItem('dailyUsage') || '0');
    if (usage >= 2) {
        showNotification('Ai ajuns la limita zilnică! Fă upgrade pentru mai mult.', 'error');
        return;
    }
    
    // Simulate generation
    const loadingBtn = event.target;
    const originalText = loadingBtn.innerHTML;
    loadingBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Se generează...';
    loadingBtn.disabled = true;
    
    setTimeout(() => {
        const platformBtn = document.querySelector('.platform-option.active i');
        let content = '';
        let hashtags = '';
        
        if (platformBtn.classList.contains('fa-youtube')) {
            content = `📹 ${topic.toUpperCase()} - Tutorial Complet\n\nBun venit la un nou video! Astăzi vom învăța cum să ${topic.toLowerCase()}.\n\n📌 Ce vei învăța:\n• Tehnici de bază pentru ${topic.toLowerCase()}\n• Sfaturi profesionale de la experți\n• Greșeli comune de evitat\n\n🔔 Nu uita să te abonezi pentru mai mult conținut!`;
            hashtags = '#youtube #tutorial #invata #online #educatie';
        } else if (platformBtn.classList.contains('fa-instagram')) {
            content = `✨ ${topic.toUpperCase()} - Ghid complet ✨\n\nSalvează acest post pentru mai târziu! 📌\n\n📍 Sfaturi utile:\n1. Începe cu bazele\n2. Practică în fiecare zi\n3. Nu te grăbi\n\nCe părere aveți? Scrieți în comentarii! 👇`;
            hashtags = '#instagram #tips #inspiratie #viral #follow';
        } else if (platformBtn.classList.contains('fa-tiktok')) {
            content = `🎵 POV: Înveți să ${topic.toLowerCase()} în 60 de secunde 🎵\n\n(Provocarea zilei)\n\nFollow for more! 🔥`;
            hashtags = '#tiktok #viral #fyp #challenge #trending';
        } else {
            content = `${topic.toUpperCase()} - Tot ce trebuie să știi! 🚀\n\nVrei să ${topic.toLowerCase()}? Iată cum:\n\n✅ Pasul 1: Documentează-te\n✅ Pasul 2: Practică zilnic\n✅ Pasul 3: Împărtășește cu alții\n\nTag prietenul care trebuie să vadă asta! 👇`;
            hashtags = '#facebook #sfaturi #dezvoltare #learning #tips';
        }
        
        const tone = document.getElementById('toneSelect')?.value;
        if (tone === 'funny') {
            content += '\n\n😂 P.S.: Dacă nu funcționează, dă vina pe AI!';
        } else if (tone === 'inspirational') {
            content += '\n\n✨ Nu uita: Fiecare expert a fost odată începător!';
        }
        
        const keywords = document.getElementById('keywordsInput')?.value;
        if (keywords) {
            content += `\n\nCuvinte cheie: ${keywords}`;
        }
        
        const generatedText = document.getElementById('generatedText');
        const hashtagsPreview = document.getElementById('hashtagsPreview');
        const generatedContent = document.getElementById('generatedContent');
        
        if (generatedText) {
            generatedText.textContent = content;
        }
        
        if (hashtagsPreview) {
            hashtagsPreview.innerHTML = hashtags.split(' ').map(tag => 
                `<span class="hashtag">${tag}</span>`
            ).join('');
        }
        
        if (generatedContent) {
            generatedContent.style.display = 'block';
        }
        
        // Update usage
        updateUsageStats(true);
        
        loadingBtn.innerHTML = originalText;
        loadingBtn.disabled = false;
    }, 2000);
}

// Copy content
function copyContent() {
    const text = document.getElementById('generatedText')?.textContent;
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Conținut copiat în clipboard!', 'success');
        });
    }
}

// Save content
function saveContent() {
    const content = document.getElementById('generatedText')?.textContent;
    if (content) {
        const saved = JSON.parse(localStorage.getItem('savedContent') || '[]');
        saved.push({
            content: content,
            date: new Date().toISOString(),
            platform: document.querySelector('.platform-option.active i').classList[1]
        });
        localStorage.setItem('savedContent', JSON.stringify(saved));
        showNotification('Conținut salvat în colecția ta!', 'success');
    }
}

// Share content
function shareContent() {
    showNotification('Funcția de sharing va fi disponibilă curând!', 'info');
}

// Update usage stats
function updateUsageStats(increment = false) {
    let usage = parseInt(localStorage.getItem('dailyUsage') || '0');
    
    if (increment) {
        usage++;
        localStorage.setItem('dailyUsage', usage);
    }
    
    const usageCount = document.querySelector('.usage-count');
    if (usageCount) {
        usageCount.textContent = `${usage}/2`;
    }
    
    const progressBar = document.querySelector('.progress');
    if (progressBar) {
        const percentage = (usage / 2) * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

// Reset daily usage
function resetDailyUsage() {
    const lastReset = localStorage.getItem('lastReset');
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
        localStorage.setItem('dailyUsage', '0');
        localStorage.setItem('lastReset', today);
    }
}


// Upgrade plan
function upgradePlan() {
    showNotification('Upgrade la planul Pro - În curând!', 'info');
}

// Export functions
window.toggleUserMenu = toggleUserMenu;
window.showDashboard = showDashboard;
window.showGenerator = showGenerator;
window.showHashtags = showHashtags;
window.showPlanner = showPlanner;
window.showAnalytics = showAnalytics;
window.showHistory = showHistory;
window.showSaved = showSaved;
window.showProfile = showProfile;
window.showSettings = showSettings;
window.showBilling = showBilling;
window.selectPlatform = selectPlatform;
window.generateContent = generateContent;
window.copyContent = copyContent;
window.saveContent = saveContent;
window.shareContent = shareContent;
window.upgradePlan = upgradePlan;
window.toggleTheme = toggleTheme;