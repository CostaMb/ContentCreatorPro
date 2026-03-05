// ===== HASHTAGS PAGE LOGIC =====

// Inițializare generator
const generator = new HashtagGenerator();
let currentPlatform = 'instagram';
let currentHashtags = [];

// Încărcare inițială
document.addEventListener('DOMContentLoaded', () => {
    loadRecentSearches();
    loadSavedSets();
    updateCount(15);
});

// Selectare platformă
function selectPlatform(platform) {
    currentPlatform = platform;
    document.querySelectorAll('.platform-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-platform="${platform}"]`).classList.add('active');
    document.getElementById('platformName').textContent = 
        platform.charAt(0).toUpperCase() + platform.slice(1);
}

// Update count
function updateCount(value) {
    document.getElementById('countValue').textContent = value;
}

// Clear input
function clearInput() {
    document.getElementById('topicInput').value = '';
}

// Generare hashtag-uri
async function generateHashtags() {
    const topic = document.getElementById('topicInput').value.trim();
    
    if (!topic) {
        showNotification('Te rugăm să introduci un subiect!', 'error');
        return;
    }

    // Arată loading
    showLoading(true);
    hideResults();
    hideEmpty();

    try {
        const count = parseInt(document.getElementById('hashtagCount').value);
        const hashtags = await generator.generateHashtags(topic, count, currentPlatform);
        
        currentHashtags = hashtags;
        displayHashtags(hashtags);
        updateAnalysis(hashtags);
        updatePreview(hashtags);
        
        showResults();
        loadRecentSearches();
        
        showNotification(`✅ ${hashtags.length} hashtag-uri generate cu succes!`);
    } catch (error) {
        console.error('Eroare:', error);
        showNotification('A apărut o eroare. Încercăm cu hashtag-uri de rezervă...', 'error');
        
        // Folosește fallback
        const fallback = generator.getFallbackHashtags(topic, 15);
        displayHashtags(fallback);
        showResults();
    } finally {
        showLoading(false);
    }
}

// Afișare hashtag-uri pe categorii
function displayHashtags(hashtags) {
    // Împarte hashtag-urile în categorii
    const viral = [];
    const popular = [];
    const niche = [];

    hashtags.forEach(tag => {
        if (tag.includes('viral') || tag.includes('trending') || tag.includes('fyp')) {
            viral.push(tag);
        } else if (tag.length > 15 || tag.includes('tips') || tag.includes('ideas')) {
            niche.push(tag);
        } else {
            popular.push(tag);
        }
    });

    // Afișează în container-e
    displayHashtagCloud('viralHashtags', viral);
    displayHashtagCloud('popularHashtags', popular);
    displayHashtagCloud('nicheHashtags', niche);
}

// Afișează un cloud de hashtag-uri
function displayHashtagCloud(containerId, hashtags) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    hashtags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'hashtag-item';
        span.textContent = tag;
        span.onclick = () => copyToClipboard(tag);
        span.style.fontSize = `${Math.random() * 0.3 + 0.8}rem`; // Random size for visual interest
        container.appendChild(span);
    });
}

// Actualizează analiza
function updateAnalysis(hashtags) {
    const analysis = generator.analyzeHashtags(hashtags);
    
    document.getElementById('totalCount').textContent = analysis.total;
    document.getElementById('estimatedReach').textContent = analysis.reach;
    
    // Determină competiția
    if (analysis.categories.viral > analysis.total * 0.5) {
        document.getElementById('competition').textContent = 'Ridicată';
    } else if (analysis.categories.niche > analysis.total * 0.5) {
        document.getElementById('competition').textContent = 'Scăzută';
    } else {
        document.getElementById('competition').textContent = 'Medie';
    }
}

// Actualizează previzualizarea
function updatePreview(hashtags) {
    const preview = document.getElementById('previewText');
    preview.innerHTML = hashtags.map(tag => 
        `<span class="preview-hashtag" onclick="copyToClipboard('${tag}')">${tag}</span>`
    ).join(' ');
}

// Copiază toate hashtag-urile
function copyAllHashtags() {
    const text = currentHashtags.join(' ');
    copyToClipboard(text);
    showNotification('📋 Toate hashtag-urile au fost copiate!');
}

// Copiază preview-ul
function copyPreview() {
    const text = currentHashtags.join(' ');
    copyToClipboard(text);
    showNotification('📋 Previzualizarea a fost copiată!');
}

// Copiază text în clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✅ Copiat în clipboard!');
    }).catch(() => {
        showNotification('❌ Eroare la copiere', 'error');
    });
}

// Salvează setul de hashtag-uri
function saveHashtagSet() {
    const topic = document.getElementById('topicInput').value.trim();
    if (!topic || currentHashtags.length === 0) {
        showNotification('Nu există hashtag-uri de salvat!', 'error');
        return;
    }

    const name = prompt('Introdu un nume pentru acest set:', `${topic} - ${new Date().toLocaleDateString()}`);
    if (name) {
        generator.saveHashtagSet(name, currentHashtags);
        loadSavedSets();
        showNotification(`✅ Setul "${name}" a fost salvat!`);
    }
}

// Exportă ca CSV
function exportAsCSV() {
    if (currentHashtags.length === 0) return;

    const csv = currentHashtags.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hashtags-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Încarcă căutările recente
function loadRecentSearches() {
    const recentList = document.getElementById('recentList');
    const searches = generator.recentSearches;

    recentList.innerHTML = '';
    if (searches.length === 0) {
        recentList.innerHTML = '<p class="empty-message">Nicio căutare recentă</p>';
        return;
    }

    searches.forEach(search => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        item.onclick = () => {
            document.getElementById('topicInput').value = search.topic;
            displayHashtags(search.hashtags);
            currentHashtags = search.hashtags;
            showResults();
        };
        item.innerHTML = `
            <i class="fas fa-search"></i>
            <div class="recent-info">
                <strong>${search.topic}</strong>
                <small>${new Date(search.timestamp).toLocaleDateString()}</small>
            </div>
        `;
        recentList.appendChild(item);
    });
}

// Încarcă seturile salvate
function loadSavedSets() {
    const savedList = document.getElementById('savedList');
    const sets = generator.getSavedSets();

    savedList.innerHTML = '';
    if (sets.length === 0) {
        savedList.innerHTML = '<p class="empty-message">Niciun set salvat</p>';
        return;
    }

    sets.slice(0, 5).forEach(set => {
        const item = document.createElement('div');
        item.className = 'saved-item';
        item.innerHTML = `
            <i class="fas fa-bookmark"></i>
            <div class="saved-info">
                <strong>${set.name}</strong>
                <small>${new Date(set.created).toLocaleDateString()}</small>
            </div>
            <button class="btn-use" onclick="useSavedSet(${set.id})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        savedList.appendChild(item);
    });
}

// Folosește un set salvat
function useSavedSet(id) {
    const sets = generator.getSavedSets();
    const set = sets.find(s => s.id === id);
    if (set) {
        currentHashtags = set.hashtags;
        displayHashtags(set.hashtags);
        updateAnalysis(set.hashtags);
        updatePreview(set.hashtags);
        showResults();
    }
}

// UI Helpers
function showLoading(show) {
    document.getElementById('loadingState').style.display = show ? 'flex' : 'none';
}

function showResults() {
    document.getElementById('resultsArea').style.display = 'block';
    document.getElementById('emptyState').style.display = 'none';
}

function hideResults() {
    document.getElementById('resultsArea').style.display = 'none';
}

function hideEmpty() {
    document.getElementById('emptyState').style.display = 'none';
}

// Notificare
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00b894' : '#d63031'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}