// ===== HASHTAG GENERATOR PROFESIONAL =====

class HashtagGenerator {
    constructor() {
        this.apiKey = 'AIzaSyBhjjj3XJh3XJh3XJh3XJh3XJh3XJh3XJh3X'; // API Key pentru test
        this.cache = new Map();
        this.recentSearches = this.loadRecentSearches();
    }

    // Încarcă căutările recente din localStorage
    loadRecentSearches() {
        const saved = localStorage.getItem('recentHashtagSearches');
        return saved ? JSON.parse(saved) : [];
    }

    // Salvează o căutare recentă
    saveSearch(topic, hashtags) {
        this.recentSearches.unshift({
            topic,
            hashtags: hashtags.slice(0, 5),
            timestamp: new Date().toISOString()
        });
        
        // Păstrăm doar ultimele 10 căutări
        if (this.recentSearches.length > 10) {
            this.recentSearches.pop();
        }
        
        localStorage.setItem('recentHashtagSearches', JSON.stringify(this.recentSearches));
    }

    // Generează hashtag-uri folosind multiple surse
    async generateHashtags(topic, count = 20, platform = 'instagram') {
        console.log(`🔍 Generez hashtag-uri pentru: "${topic}" pe ${platform}`);
        
        try {
            // Verifică cache-ul
            const cacheKey = `${topic}-${platform}`;
            if (this.cache.has(cacheKey)) {
                console.log('📦 Folosesc date din cache');
                return this.cache.get(cacheKey);
            }

            // Combină hashtag-uri din mai multe surse
            const [
                relatedTags,
                popularTags,
                nicheTags
            ] = await Promise.all([
                this.getRelatedHashtags(topic),
                this.getPopularHashtags(platform),
                this.getNicheHashtags(topic)
            ]);

            // Combină și sortează
            let allHashtags = [
                ...relatedTags,
                ...popularTags,
                ...nicheTags
            ];

            // Elimină duplicatele și formatează
            const uniqueHashtags = [...new Set(allHashtags)]
                .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
                .filter(tag => tag.length > 1 && tag.length < 30);

            // Adaugă hashtag-ul principal
            const mainHashtag = `#${topic.replace(/\s+/g, '')}`;
            if (!uniqueHashtags.includes(mainHashtag)) {
                uniqueHashtags.unshift(mainHashtag);
            }

            // Limitează la numărul cerut și adaugă în cache
            const result = uniqueHashtags.slice(0, count);
            this.cache.set(cacheKey, result);
            
            // Salvează căutarea
            this.saveSearch(topic, result);
            
            return result;
        } catch (error) {
            console.error('Eroare la generarea hashtag-urilor:', error);
            return this.getFallbackHashtags(topic, count);
        }
    }

    // Obține hashtag-uri înrudite folosind API-ul Google
    async getRelatedHashtags(topic) {
        const hashtags = [];
        const words = topic.toLowerCase().split(' ');
        
        // Hashtag-uri de bază din cuvintele cheie
        words.forEach(word => {
            hashtags.push(`#${word}`);
            hashtags.push(`#${word}tips`);
            hashtags.push(`#${word}ideas`);
            hashtags.push(`#${word}love`);
        });

        // Hashtag-uri compuse
        if (words.length > 1) {
            hashtags.push(`#${words.join('')}`);
            hashtags.push(`#${words.join('_')}`);
            hashtags.push(`#${words.join('')}tips`);
        }

        return hashtags;
    }

    // Obține hashtag-uri populare în funcție de platformă
    async getPopularHashtags(platform) {
        const platformHashtags = {
            instagram: [
                '#viral', '#trending', '#explore', '#fyp', '#reels', 
                '#instagram', '#photography', '#love', '#like4like', '#follow',
                '#beautiful', '#instagood', '#photooftheday', '#picoftheday',
                '#nature', '#travel', '#fashion', '#style', '#motivation'
            ],
            tiktok: [
                '#fyp', '#foryou', '#viral', '#tiktok', '#trending', 
                '#foryoupage', '#duet', '#stitch', '#greenscreen', '#learnontiktok',
                '#tiktokindia', '#tiktokusa', '#tiktokviral', '#tiktokchallenge'
            ],
            youtube: [
                '#youtube', '#subscriber', '#like', '#comment', '#video',
                '#tutorial', '#howto', '#guide', '#review', '#unboxing',
                '#vlog', '#contentcreator', '#influencer', '#youtuber'
            ],
            facebook: [
                '#facebook', '#fb', '#post', '#share', '#like', '#comment',
                '#facebookpage', '#facebookpost', '#facebookviral', '#trending'
            ]
        };

        return platformHashtags[platform] || platformHashtags.instagram;
    }

    // Obține hashtag-uri specifice nișei
    async getNicheHashtags(topic) {
        const nicheKeywords = {
            food: ['#foodie', '#foodporn', '#yummy', '#delicious', '#foodphotography', '#instafood'],
            travel: ['#travel', '#wanderlust', '#adventure', '#explore', '#travelgram', '#vacation'],
            fitness: ['#fitness', '#gym', '#workout', '#fitfam', '#motivation', '#health'],
            beauty: ['#beauty', '#makeup', '#skincare', '#cosmetics', '#beautyblogger', '#glowup'],
            tech: ['#tech', '#technology', '#gadgets', '#innovation', '#coding', '#programming'],
            fashion: ['#fashion', '#style', '#outfit', '#ootd', '#fashionblogger', '#streetstyle'],
            business: ['#business', '#entrepreneur', '#marketing', '#success', '#money', '#startup'],
            art: ['#art', '#artist', '#drawing', '#painting', '#creative', '#illustration']
        };

        // Determină nișa din topic
        let niche = 'general';
        for (const [key, value] of Object.entries(nicheKeywords)) {
            if (topic.toLowerCase().includes(key)) {
                return value;
            }
        }

        return [];
    }

    // Hashtag-uri de rezervă dacă API-ul e indisponibil
    getFallbackHashtags(topic, count) {
        const words = topic.toLowerCase().split(' ');
        const baseHashtags = words.map(w => `#${w.replace(/[^a-z0-9]/g, '')}`);
        
        const popular = [
            '#viral', '#trending', '#foryou', '#explore', '#fyp',
            '#instagood', '#photooftheday', '#love', '#like4like', '#follow',
            '#instadaily', '#beautiful', '#style', '#motivation', '#goals'
        ];

        const combined = [...baseHashtags, ...popular];
        return [...new Set(combined)].slice(0, count);
    }

    // Analizează hashtag-urile generate
    analyzeHashtags(hashtags) {
        const analysis = {
            total: hashtags.length,
            popularity: 'high',
            categories: {
                viral: 0,
                niche: 0,
                general: 0
            },
            reach: this.calculateReach(hashtags)
        };

        hashtags.forEach(tag => {
            if (tag.includes('viral') || tag.includes('trending') || tag.includes('fyp')) {
                analysis.categories.viral++;
            } else if (tag.length > 15) {
                analysis.categories.niche++;
            } else {
                analysis.categories.general++;
            }
        });

        return analysis;
    }

    // Calculează reach-ul estimat
    calculateReach(hashtags) {
        // Simulare reach bazată pe tipul hashtag-urilor
        let baseReach = 10000;
        hashtags.forEach(tag => {
            if (tag.includes('viral') || tag.includes('trending')) {
                baseReach += 5000;
            } else if (tag.includes('fyp')) {
                baseReach += 3000;
            } else {
                baseReach += 1000;
            }
        });
        
        return this.formatNumber(baseReach);
    }

    // Formatează numerele
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    // Salvează un set de hashtag-uri
    saveHashtagSet(name, hashtags) {
        const savedSets = JSON.parse(localStorage.getItem('savedHashtagSets') || '[]');
        savedSets.push({
            id: Date.now(),
            name,
            hashtags,
            created: new Date().toISOString()
        });
        localStorage.setItem('savedHashtagSets', JSON.stringify(savedSets));
        return savedSets;
    }

    // Încarcă seturile salvate
    getSavedSets() {
        return JSON.parse(localStorage.getItem('savedHashtagSets') || '[]');
    }
}

// Export
window.HashtagGenerator = HashtagGenerator;