// auth.js - VERSIUNE FINALĂ

// Inițializare baza de date utilizatori
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

// Adaugă utilizator demo
const users = JSON.parse(localStorage.getItem('users'));
const demoExists = users.some(u => u.email === 'demo@test.com');
if (!demoExists) {
    users.push({
        name: 'Demo User',
        email: 'demo@test.com',
        password: '123456'
    });
    localStorage.setItem('users', JSON.stringify(users));
}

// Funcție pentru înregistrare
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Te rog completează toate câmpurile!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Parolele nu coincid!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Parola trebuie să aibă minim 6 caractere!', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users'));
    if (users.some(u => u.email === email)) {
        showNotification('Există deja un cont cu acest email!', 'error');
        return;
    }
    
    users.push({
        name: name,
        email: email,
        password: password
    });
    localStorage.setItem('users', JSON.stringify(users));
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify({
        name: name,
        email: email
    }));
    localStorage.setItem('dailyUsage', '0');
    
    closeModal('registerModal');
    showNotification('Cont creat cu succes! Redirecționare...', 'success');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Funcție pentru autentificare
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Te rog completează toate câmpurile!', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            name: user.name,
            email: user.email
        }));
        
        closeModal('loginModal');
        showNotification('Autentificare reușită! Redirecționare...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showNotification('Email sau parolă incorectă!', 'error');
    }
}

// Funcție pentru verificare autentificare
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn && window.location.pathname.includes('dashboard')) {
        window.location.href = 'index.html';
    }
}

// Funcție pentru delogare
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    showNotification('Te-ai deconectat cu succes!', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Sistem de notificări
function showNotification(message, type) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    notification.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '10px';
    notification.style.backgroundColor = type === 'success' ? '#00b894' : type === 'error' ? '#d63031' : '#0984e3';
    notification.style.color = 'white';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '0.5rem';
    notification.style.zIndex = '9999';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    notification.style.fontWeight = '500';
    notification.style.animation = 'slideIn 0.3s ease';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Funcții pentru modaluri
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function showRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Închide modalul la click în afara lui
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// Export funcții
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.checkAuth = checkAuth;
window.showNotification = showNotification;
window.closeModal = closeModal;
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;