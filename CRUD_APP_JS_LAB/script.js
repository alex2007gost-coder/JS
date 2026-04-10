// ===== Работа с хранилищем =====
const STORAGE_KEY = 'tasks';

/**
 * Получить все задачи из localStorage
 * @returns {Array} массив задач
 */
function getTasks() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

/**
 * Сохранить массив задач в localStorage
 * @param {Array} tasks – массив задач
 */
function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Переменные состояния
let editingTaskId = null;
let currentFilter = 'all';
let currentSort = 'date-desc';
let currentSearchQuery = '';

// DOM элементы
const form = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-desc');
const prioSelect = document.getElementById('task-priority');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('task-sort');

// ===== Вспомогательные функции =====

/**
 * Защита от XSS
 */
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Получить текст приоритета
 */
function getPriorityText(priority) {
    const map = {
        'low': 'Низкий',
        'medium': 'Средний',
        'high': 'Высокий'
    };
    return map[priority] || priority;
}

/**
 * Форматирование даты
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Обновление статистики
 */
function updateStats(tasks) {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;

    document.getElementById('total-count').textContent = total;
    document.getElementById('active-count').textContent = active;
    document.getElementById('completed-count').textContent = completed;
}

/**
 * Фильтрация задач
 */
function filterTasks(tasks) {
    let filtered = [...tasks];

    // Фильтр по статусу
    if (currentFilter === 'active') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }

    // Фильтр по поиску
    if (currentSearchQuery.trim()) {
        const query = currentSearchQuery.trim().toLowerCase();
        filtered = filtered.filter(t => t.title.toLowerCase().includes(query));
    }

    return filtered;
}

/**
 * Сортировка задач
 */
function sortTasks(tasks) {
    const sorted = [...tasks];

    switch (currentSort) {
        case 'date-desc':
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'date-asc':
            sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'priority':
            const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
            sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            break;
    }

    return sorted;
}

// ===== CRUD операции =====

/**
 * Добавление новой задачи
 */
function addTask(title, description, priority) {
    const tasks = getTasks();
    const newTask = {
        id: Date.now(),
        title: title,
        description: description || '',
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
}

/**
 * Обновление задачи
 */
function updateTask(id, title, description, priority) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.title = title;
        task.description = description || '';
        task.priority = priority;
        saveTasks(tasks);
        return true;
    }
    return false;
}

/**
 * Переключение статуса выполнения задачи
 */
function toggleComplete(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks(tasks);
        renderTasks();
    }
}

/**
 * Удаление задачи с подтверждением
 */
function deleteTask(id) {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
        return;
    }
    let tasks = getTasks();
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);
    renderTasks();
}

/**
 * Начать редактирование задачи – заполнить форму данными
 */
function editTask(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Заполняем форму текущими значениями
    titleInput.value = task.title;
    descInput.value = task.description;
    prioSelect.value = task.priority;

    // Переходим в режим редактирования
    editingTaskId = id;
    submitBtn.textContent = '💾 Сохранить изменения';
    cancelBtn.style.display = 'inline-block';

    // Прокрутка к форме
    form.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Отмена редактирования
 */
function cancelEdit() {
    editingTaskId = null;
    submitBtn.textContent = '➕ Добавить задачу';
    cancelBtn.style.display = 'none';
    form.reset();
}

/**
 * Отрисовка задач
 */
function renderTasks() {
    let tasks = getTasks();
    const filtered = filterTasks(tasks);
    const sorted = sortTasks(filtered);

    updateStats(tasks);

    if (sorted.length === 0) {
        taskList.innerHTML = '<div class="empty">📭 Задач нет. Создайте первую задачу!</div>';
        return;
    }

    taskList.innerHTML = '';

    sorted.forEach(task => {
        const card = document.createElement('div');
        card.className = `task-card ${task.completed ? 'completed' : ''} priority-${task.priority}`;
        card.dataset.id = task.id;

        card.innerHTML = `
            <div class="task-header">
                <h3>${escapeHTML(task.title)}</h3>
                <span class="badge">${getPriorityText(task.priority)}</span>
            </div>
            <p>${escapeHTML(task.description) || '— Без описания —'}</p>
            <div class="task-meta">
                📅 Создана: ${formatDate(task.createdAt)}
            </div>
            <div class="task-actions">
                <button onclick="toggleComplete(${task.id})">
                    ${task.completed ? '🔄 Вернуть' : '✅ Выполнено'}
                </button>
                <button onclick="editTask(${task.id})">✏️ Изменить</button>
                <button onclick="deleteTask(${task.id})">🗑️ Удалить</button>
            </div>
        `;

        taskList.appendChild(card);
    });
}

// ===== Обработчики событий =====

// Обработка отправки формы
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const priority = prioSelect.value;

    // Валидация
    if (!title) {
        alert('Пожалуйста, введите название задачи');
        return;
    }

    if (editingTaskId !== null) {
        // Режим редактирования
        updateTask(editingTaskId, title, description, priority);
        cancelEdit();
    } else {
        // Режим добавления
        addTask(title, description, priority);
        form.reset();
    }

    renderTasks();
});

// Отмена редактирования
cancelBtn.addEventListener('click', cancelEdit);

// Фильтрация
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderTasks();
    });
});

// Поиск
searchInput.addEventListener('input', function (e) {
    currentSearchQuery = e.target.value;
    renderTasks();
});

// Сортировка
sortSelect.addEventListener('change', function (e) {
    currentSort = e.target.value;
    renderTasks();
});

// Первоначальная отрисовка при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем тестовые данные, если задач нет
    const tasks = getTasks();
    if (tasks.length === 0) {
        const sampleTasks = [
            {
                id: 1,
                title: "Выучить JavaScript",
                description: "Пройти главы 1-5 по основам JS",
                priority: "high",
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: "Сделать CRUD приложение",
                description: "Разработать Task Manager",
                priority: "medium",
                completed: false,
                createdAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        saveTasks(sampleTasks);
    }
    renderTasks();
});