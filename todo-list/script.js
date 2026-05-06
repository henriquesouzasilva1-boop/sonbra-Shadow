// ===== CONFIGURAÇÃO =====
const STORAGE_KEY = 'todoList';
const DEFAULT_TASKS = [];

// ===== VARIÁVEIS GLOBAIS =====
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_TASKS;
let currentFilter = 'all';
let currentCategory = 'all';
let currentSort = 'recent';
let currentEditId = null;
let isDarkMode = localStorage.getItem('isDarkMode') === 'true';

// ===== ELEMENTOS DO DOM =====
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const themeToggle = document.getElementById('themeToggle');
const prioritySelect = document.getElementById('prioritySelect');
const categorySelect = document.getElementById('categorySelect');
const dueDateInput = document.getElementById('dueDateInput');
const sortSelect = document.getElementById('sortSelect');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupEventListeners();
    renderTasks();
    updateStats();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Adicionar tarefa
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Tema
    themeToggle.addEventListener('click', toggleTheme);

    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTasks();
        });
    });

    // Categorias
    document.querySelectorAll('.category-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-tab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            renderTasks();
        });
    });

    // Ordenação
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderTasks();
    });

    // Botões de ação
    clearCompletedBtn.addEventListener('click', clearCompleted);
    exportBtn.addEventListener('click', exportTasks);
    importBtn.addEventListener('click', importTasks);

    // Modal
    document.querySelector('.modal-close').addEventListener('click', closeEditModal);
    document.getElementById('cancelEditBtn').addEventListener('click', closeEditModal);
    document.getElementById('saveEditBtn').addEventListener('click', saveEdit);
}

// ===== ADICIONAR TAREFA =====
function addTask() {
    const text = taskInput.value.trim();
    const priority = prioritySelect.value;
    const category = categorySelect.value;
    const dueDate = dueDateInput.value;

    if (!text) {
        alert('Digite uma tarefa!');
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: priority,
        category: category,
        dueDate: dueDate,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(task);
    saveTasks();
    renderTasks();
    updateStats();

    // Limpar inputs
    taskInput.value = '';
    prioritySelect.value = 'medium';
    categorySelect.value = 'work';
    dueDateInput.value = '';
    taskInput.focus();
}

// ===== RENDERIZAR TAREFAS =====
function renderTasks() {
    let filteredTasks = filterTasks();
    filteredTasks = sortTasks(filteredTasks);

    tasksList.innerHTML = '';

    if (filteredTasks.length === 0) {
        emptyState.classList.add('show');
        return;
    }

    emptyState.classList.remove('show');

    filteredTasks.forEach(task => {
        const taskEl = createTaskElement(task);
        tasksList.appendChild(taskEl);
    });
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `task-item priority-${task.priority}${task.completed ? ' completed' : ''}`;
    div.dataset.id = task.id;

    const categoryEmoji = {
        'work': '📋',
        'personal': '👤',
        'shopping': '🛍',
        'health': '📚',
        'study': '📚',
        'other': '📌'
    };

    const priorityLabel = {
        'high': '🔴 Alta',
        'medium': '🟼 Média',
        'low': '🟍 Baixa'
    };

    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : '';
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

    div.innerHTML = `
        <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? 'checked' : ''}
        >
        <div class="task-content">
            <div class="task-text">${escapeHtml(task.text)}</div>
            <div class="task-meta">
                <span class="task-category">${categoryEmoji[task.category]} ${task.category}</span>
                <span class="task-priority priority-${task.priority}">${priorityLabel[task.priority]}</span>
                ${dueDate ? `<span class="task-date">${isOverdue ? '⚠️ ' : '📅 '}${dueDate}</span>` : ''}
            </div>
        </div>
        <div class="task-actions">
            <button class="task-btn edit-btn">✏️ Editar</button>
            <button class="task-btn delete-btn">🗑 Deletar</button>
        </div>
    `;

    // Event listeners
    const checkbox = div.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => {
        toggleComplete(task.id);
    });

    const editBtn = div.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
        openEditModal(task.id);
    });

    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
            deleteTask(task.id);
        }
    });

    return div;
}

// ===== FILTRAR TAREFAS =====
function filterTasks() {
    let filtered = tasks;

    // Filtro de status
    if (currentFilter === 'active') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    } else if (currentFilter === 'high') {
        filtered = filtered.filter(t => t.priority === 'high');
    } else if (currentFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(t => t.dueDate === today);
    }

    // Filtro de categoria
    if (currentCategory !== 'all') {
        filtered = filtered.filter(t => t.category === currentCategory);
    }

    return filtered;
}

// ===== ORDENAR TAREFAS =====
function sortTasks(tasksToSort) {
    const sorted = [...tasksToSort];

    if (currentSort === 'priority') {
        const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
        sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (currentSort === 'dueDate') {
        sorted.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    } else if (currentSort === 'alphabetic') {
        sorted.sort((a, b) => a.text.localeCompare(b.text, 'pt-BR'));
    } else {
        // 'recent' (padrão)
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return sorted;
}

// ===== COMPLETAR/DESCOMPLETAR TAREFA =====
function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// ===== DELETAR TAREFA =====
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

// ===== LIMPAR CONCLUÍDAS =====
function clearCompleted() {
    if (confirm('Deletar todas as tarefas concluídas?')) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// ===== EDITAR TAREFA (MODAL) =====
function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    currentEditId = id;
    document.getElementById('editTaskInput').value = task.text;
    document.getElementById('editPrioritySelect').value = task.priority;
    document.getElementById('editDueDateInput').value = task.dueDate || '';

    document.getElementById('editModal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    currentEditId = null;
}

function saveEdit() {
    if (!currentEditId) return;

    const task = tasks.find(t => t.id === currentEditId);
    if (!task) return;

    task.text = document.getElementById('editTaskInput').value.trim();
    task.priority = document.getElementById('editPrioritySelect').value;
    task.dueDate = document.getElementById('editDueDateInput').value;

    if (!task.text) {
        alert('Texto da tarefa não pode estar vazio!');
        return;
    }

    saveTasks();
    renderTasks();
    updateStats();
    closeEditModal();
}

// ===== EXPORTAR TAREFAS =====
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// ===== IMPORTAR TAREFAS =====
function importTasks() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedTasks = JSON.parse(event.target.result);
                if (Array.isArray(importedTasks)) {
                    tasks = importedTasks;
                    saveTasks();
                    renderTasks();
                    updateStats();
                    alert('Tarefas importadas com sucesso!');
                } else {
                    alert('Formato de arquivo inválido!');
                }
            } catch (error) {
                alert('Erro ao importar: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// ===== ATUALIZAR ESTATÍSTICAS =====
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('completionRate').textContent = completionRate + '%';
}

// ===== SALVAR TAREFAS =====
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ===== TEMA =====
function initTheme() {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    updateThemeIcon();
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('isDarkMode', isDarkMode);
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    updateThemeIcon();
}

function updateThemeIcon() {
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
}

// ===== UTILITÁRIOS =====
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}