// router.js - Маршрутизация через hashchange

const routes = {};

export function addRoute(pattern, handler) {
    routes[pattern] = handler;
}

export function navigate(hash) {
    window.location.hash = hash;
}

export function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Обрабатываем начальный URL
}

function handleRoute() {
    const hash = window.location.hash || '#/';
    const app = document.getElementById('app');
    
    if (!app) return;
    
    // Точное совпадение
    if (routes[hash]) {
        routes[hash](app);
        updateActiveNav(hash);
        return;
    }
    
    // Динамические маршруты
    for (const pattern in routes) {
        const regex = new RegExp('^' + pattern.replace(/:([\w]+)/g, '([^/]+)') + '$');
        const match = hash.match(regex);
        
        if (match) {
            const params = match.slice(1);
            routes[pattern](app, ...params);
            updateActiveNav(hash);
            return;
        }
    }
    
    // 404 - страница не найдена
    app.innerHTML = `
        <div class="not-found">
            <h2>404</h2>
            <p>😕 Страница не найдена</p>
            <a href="#/" class="btn">Вернуться на главную</a>
        </div>
    `;
    updateActiveNav(hash);
}

function updateActiveNav(hash) {
    document.querySelectorAll('[data-nav]').forEach(function(a) {
        const href = a.getAttribute('href');
        if (href === hash || (hash === '#/' && href === '#/')) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });
}