// app.js - Точка входа приложения

import { addRoute, initRouter, navigate } from './router.js';
import { parseMarkdown, generateTOC, calculateReadingTime } from './parser.js';

let posts = [];
let postsCache = new Map(); // Кэш статей

// Загрузка метаданных статей
async function loadMeta() {
    try {
        const response = await fetch('posts/meta.json');
        if (!response.ok) throw new Error('Не удалось загрузить meta.json');
        posts = await response.json();
        // Сортируем по дате (новые сверху)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('Ошибка загрузки метаданных:', error);
        posts = [];
    }
}

// Форматирование даты
function formatDate(dateStr) {
    if (!dateStr) return 'Дата не указана';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Работа с избранным
function getFavorites() {
    const fav = localStorage.getItem('favoritePosts');
    return fav ? JSON.parse(fav) : [];
}

function toggleFavorite(postId) {
    let favorites = getFavorites();
    if (favorites.includes(postId)) {
        favorites = favorites.filter(id => id !== postId);
    } else {
        favorites.push(postId);
    }
    localStorage.setItem('favoritePosts', JSON.stringify(favorites));
    return favorites.includes(postId);
}

function isFavorite(postId) {
    return getFavorites().includes(postId);
}

// Копирование кода
function setupCodeCopyButtons() {
    document.querySelectorAll('pre').forEach(pre => {
        // Добавляем кнопку копирования, если её нет
        if (!pre.querySelector('.copy-btn')) {
            const button = document.createElement('button');
            button.className = 'copy-btn';
            button.textContent = '📋 Копировать';
            button.onclick = async () => {
                const code = pre.querySelector('code');
                if (code) {
                    await navigator.clipboard.writeText(code.textContent);
                    button.textContent = '✅ Скопировано!';
                    setTimeout(() => {
                        button.textContent = '📋 Копировать';
                    }, 2000);
                }
            };
            pre.style.position = 'relative';
            pre.appendChild(button);
        }
    });
}

// Рендер главной страницы
function renderHome(app) {
    const favorites = getFavorites();
    
    const postsHtml = posts.map(post => `
        <article class="card">
            <h2><a href="#/post/${post.id}">${escapeHtml(post.title)}</a></h2>
            <time>${formatDate(post.date)}</time>
            <p>${escapeHtml(post.description)}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <a href="#/post/${post.id}" class="btn">Читать →</a>
                <button class="fav-btn ${favorites.includes(post.id) ? 'favorited' : ''}" 
                        data-id="${post.id}">
                    ${favorites.includes(post.id) ? '❤️' : '🤍'}
                </button>
            </div>
        </article>
    `).join('');
    
    app.innerHTML = `
        <div class="posts-grid">
            ${postsHtml || '<p>Статей пока нет</p>'}
        </div>
    `;
    
    // Добавляем обработчики для кнопок избранного
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = Number(btn.dataset.id);
            const isFav = toggleFavorite(id);
            btn.textContent = isFav ? '❤️' : '🤍';
            btn.classList.toggle('favorited', isFav);
        });
    });
}

// Рендер страницы статьи
async function renderPost(app, id) {
    const postId = Number(id);
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        app.innerHTML = '<div class="not-found"><p>📄 Статья не найдена</p><a href="#/" class="btn">На главную</a></div>';
        return;
    }
    
    // Показываем загрузку
    app.innerHTML = '<div class="loading">📖 Загрузка статьи...</div>';
    
    try {
        // Проверяем кэш
        let md;
        if (postsCache.has(post.file)) {
            md = postsCache.get(post.file);
        } else {
            const response = await fetch(post.file);
            if (!response.ok) throw new Error('Не удалось загрузить статью');
            md = await response.text();
            postsCache.set(post.file, md);
        }
        
        // Парсим Markdown
        let html = parseMarkdown(md);
        
        // Генерируем оглавление
        const { toc, html: htmlWithIds } = generateTOC(html);
        html = htmlWithIds;
        
        // Считаем время чтения
        const readingTime = calculateReadingTime(md);
        
        const isFav = isFavorite(postId);
        
        app.innerHTML = `
            <article class="post">
                <button onclick="window.navigate && window.navigate('#/')" class="back-btn">← Назад к статьям</button>
                <div class="post-header">
                    <h1>${escapeHtml(post.title)}</h1>
                    <div class="post-meta">
                        <span>📅 ${formatDate(post.date)}</span>
                        <span class="reading-time">⏱️ ${readingTime} чтения</span>
                        <button class="fav-btn ${isFav ? 'favorited' : ''}" id="favArticleBtn">
                            ${isFav ? '❤️ В избранном' : '🤍 Добавить в избранное'}
                        </button>
                    </div>
                </div>
                ${toc}
                <div class="post-content">
                    ${html}
                </div>
            </article>
        `;
        
        // Добавляем обработчик для кнопки избранного на странице статьи
        const favBtn = document.getElementById('favArticleBtn');
        if (favBtn) {
            favBtn.addEventListener('click', () => {
                const newFavState = toggleFavorite(postId);
                favBtn.textContent = newFavState ? '❤️ В избранном' : '🤍 Добавить в избранное';
                favBtn.classList.toggle('favorited', newFavState);
            });
        }
        
        // Настраиваем кнопки копирования кода
        setupCodeCopyButtons();
        
    } catch (error) {
        console.error('Ошибка загрузки статьи:', error);
        app.innerHTML = '<div class="not-found"><p>❌ Ошибка загрузки статьи</p><a href="#/" class="btn">На главную</a></div>';
    }
}

// Рендер страницы "О блоге"
function renderAbout(app) {
    const favorites = getFavorites();
    const favoritePosts = posts.filter(p => favorites.includes(p.id));
    
    app.innerHTML = `
        <div class="post">
            <h1>📖 О блоге</h1>
            <p>Этот блог создан в рамках учебного задания по созданию статического сайта на чистом JavaScript.</p>
            
            <h2>✨ Особенности</h2>
            <ul>
                <li>✅ Загрузка статей из Markdown файлов через fetch()</li>
                <li>✅ Собственный парсер Markdown на регулярных выражениях</li>
                <li>✅ Клиентская маршрутизация через hashchange</li>
                <li>✅ Кэширование статей в Map</li>
                <li>✅ Избранные статьи в localStorage</li>
                <li>✅ Автоматическое оглавление из заголовков</li>
                <li>✅ Подсчёт времени чтения</li>
                <li>✅ Копирование кода из блоков</li>
            </ul>
            
            <h2>📚 Технологии</h2>
            <ul>
                <li>HTML5 / CSS3</li>
                <li>JavaScript (ES6+)</li>
                <li>Fetch API + async/await</li>
                <li>History API (hashchange)</li>
                <li>LocalStorage для сохранения настроек</li>
            </ul>
            
            ${favoritePosts.length > 0 ? `
                <h2>⭐ Ваши избранные статьи (${favoritePosts.length})</h2>
                <ul>
                    ${favoritePosts.map(p => `
                        <li><a href="#/post/${p.id}">${escapeHtml(p.title)}</a> — ${formatDate(p.date)}</li>
                    `).join('')}
                </ul>
            ` : '<p>🤍 У вас пока нет избранных статей</p>'}
        </div>
    `;
}

// Вспомогательная функция для экранирования HTML
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Делаем navigate доступной глобально для onclick
window.navigate = navigate;

// Инициализация приложения
async function init() {
    await loadMeta();
    
    addRoute('#/', (app) => renderHome(app));
    addRoute('#/about', (app) => renderAbout(app));
    addRoute('#/post/:id', (app, id) => renderPost(app, id));
    
    initRouter();
}

// Запускаем приложение
init();