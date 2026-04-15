/**
 * Chato Sano Premium - Core Application Logic
 * Modularizado para escalabilidad y mantenibilidad.
 */

const ChatoSano = (() => {
    // --- State & Config ---
    const state = {
        views: ['home', 'analysis', 'dashboard', 'cafeteria', 'login'],
        currentView: 'home',
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        apiBase: 'http://localhost:5000/api'
    };

    // --- Charts Instances ---
    let progressChart = null;
    let macroChart = null;

    // --- Selectors ---
    const $ = (id) => document.getElementById(id);
    const $$ = (sel) => document.querySelectorAll(sel);

    // --- Core Functions ---
    const init = () => {
        lucide.createIcons();
        registerSW();
        setupNavigation();
        setupAuth();
        setupTheme();
        setupAnalysis();
        setupCafeteria();
        setupChat();
        setupCharts();
        
        // Initial View
        renderAuthUI();
        updateDate();
        
        console.log('🚀 Chato Sano Premium Initialized');
    };

    const registerSW = () => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW Error:', err));
            });
        }
    };

    // --- Navigation System ---
    const setupNavigation = () => {
        $$('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                switchView(link.dataset.view);
            });
        });

        $('nav-logo').addEventListener('click', () => switchView('home'));
    };

    const switchView = (viewId) => {
        if (!state.views.includes(viewId)) return;

        $$('.view').forEach(v => {
            v.classList.add('hidden');
            v.classList.remove('view-enter');
        });

        const nextView = $(`view-${viewId}`);
        nextView.classList.remove('hidden');
        nextView.classList.add('view-enter');

        // Update nav links
        $$('.nav-link').forEach(link => {
            if (link.dataset.view === viewId) {
                link.classList.add('text-wine-700', 'font-bold');
                link.classList.remove('text-stone-600', 'dark:text-stone-400', 'font-medium');
            } else {
                link.classList.remove('text-wine-700', 'font-bold');
                link.classList.add('text-stone-600', 'dark:text-stone-400', 'font-medium');
            }
        });

        state.currentView = viewId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (viewId === 'dashboard') loadDashboardData();
        
        // Trigger reveal animations
        setTimeout(revealOnScroll, 100);
    };

    // --- Auth System ---
    const setupAuth = () => {
        $('login-nav-btn').onclick = () => switchView('login');
        $('register-nav-btn').onclick = () => switchView('login'); // For now same view

        $('login-form').onsubmit = async (e) => {
            e.preventDefault();
            const email = $('login-email').value;
            const password = $('login-password').value;

            try {
                const res = await fetch(`${state.apiBase}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();

                if (data.success) {
                    state.token = data.token;
                    state.user = data.user;
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    showToast(`¡Hola de nuevo, ${data.user.name}!`);
                    renderAuthUI();
                    switchView('dashboard');
                } else {
                    showToast(data.error, 'error');
                }
            } catch (err) {
                showToast('Error de conexión con el servidor', 'error');
            }
        };

        $('logout-btn').onclick = () => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            renderAuthUI();
            showToast('Sesión cerrada correctamente');
            switchView('home');
        };
    };

    const renderAuthUI = () => {
        if (state.token && state.user) {
            $('auth-buttons').classList.add('hidden');
            $('user-profile-nav').classList.remove('hidden');
            $('user-profile-nav').classList.add('flex');
            $('nav-username').textContent = state.user.name;
        } else {
            $('auth-buttons').classList.remove('hidden');
            $('user-profile-nav').classList.add('hidden');
            $('user-profile-nav').classList.remove('flex');
        }
    };

    // --- Analysis System ---
    const setupAnalysis = () => {
        const searchInput = $('food-search-modern');
        const suggestions = $('search-suggestions');

        searchInput.oninput = debounce(async (e) => {
            const query = e.target.value.trim();
            if (query.length < 2) {
                suggestions.classList.add('hidden');
                return;
            }

            try {
                const res = await fetch(`${state.apiBase}/nutrition/search?query=${query}`);
                const result = await res.json();
                
                if (result.success && result.data.results.length > 0) {
                    suggestions.innerHTML = result.data.results.map(item => `
                        <div class="px-6 py-4 hover:bg-stone-50 cursor-pointer border-b border-stone-50 last:border-0 flex items-center gap-3 suggestion-item dark:hover:bg-stone-800 dark:border-stone-800" data-id="${item.id}">
                            <i data-lucide="search" class="w-4 h-4 text-stone-300"></i>
                            <span class="font-bold text-stone-600 dark:text-stone-300 capitalize">${item.name}</span>
                        </div>
                    `).join('');
                    suggestions.classList.remove('hidden');
                    lucide.createIcons();

                    $$('.suggestion-item').forEach(item => {
                        item.onclick = () => {
                            searchInput.value = item.querySelector('span').textContent;
                            suggestions.classList.add('hidden');
                            fetchFoodDetails(item.dataset.id);
                        };
                    });
                }
            } catch (err) {
                console.error('Search error:', err);
            }
        }, 300);

        $('search-action-btn').onclick = () => {
            const query = searchInput.value.trim();
            if (query) fetchFoodDetailsByName(query);
        };

        $$('.category-chip').forEach(chip => {
            chip.onclick = () => {
                searchInput.value = chip.dataset.category;
                fetchFoodDetailsByName(chip.dataset.category);
            };
        });
    };

    const fetchFoodDetails = async (id) => {
        const resultContainer = $('modern-analysis-result');
        resultContainer.innerHTML = `<div class="flex justify-center py-20"><div class="w-12 h-12 border-4 border-wine-100 border-t-wine-700 rounded-full animate-spin"></div></div>`;
        resultContainer.classList.remove('hidden');

        try {
            const res = await fetch(`${state.apiBase}/nutrition/info/${id}`);
            const data = await res.json();
            
            if (data.success) {
                renderAnalysisResult(data.data);
            }
        } catch (err) {
            showToast('Error al obtener detalles', 'error');
        }
    };

    const fetchFoodDetailsByName = async (query) => {
        const btn = $('search-action-btn');
        const originalBtnContent = btn.innerHTML;
        
        try {
            // Estado de carga en el botón
            btn.disabled = true;
            btn.innerHTML = `<div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>`;

            // Mapeo simple de categorías a términos que Spoonacular entiende mejor
            const searchTerms = {
                'Frutas': 'apple',
                'Proteína': 'chicken breast',
                'Vegetales': 'broccoli',
                'Postres': 'cake'
            };

            const searchTerm = searchTerms[query] || query;

            const res = await fetch(`${state.apiBase}/nutrition/search?query=${searchTerm}`);
            const data = await res.json();
            
            if (data.success && data.data.results.length > 0) {
                fetchFoodDetails(data.data.results[0].id);
            } else {
                showToast(`No encontré datos exactos para "${query}". Prueba con un alimento específico.`, 'error');
            }
        } catch (err) {
            showToast('Error de conexión', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalBtnContent;
        }
    };

    const renderAnalysisResult = (food) => {
        const nutrients = food.nutrition.nutrients;
        const getVal = (name) => nutrients.find(n => n.name === name)?.amount || 0;

        const calories = getVal('Calories');
        const protein = getVal('Protein');
        const fat = getVal('Fat');
        const carbs = getVal('Carbohydrates');

        $('modern-analysis-result').innerHTML = `
            <div class="card-premium p-10 max-w-4xl mx-auto overflow-hidden relative">
                <div class="flex flex-col md:flex-row gap-12">
                    <div class="flex-1">
                        <div class="flex items-center gap-6 mb-8">
                            <div class="w-24 h-24 bg-stone-100 rounded-[2rem] overflow-hidden shadow-inner dark:bg-stone-800">
                                <img src="https://spoonacular.com/cdn/ingredients_100x100/${food.image}" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <h3 class="text-4xl font-black text-stone-900 dark:text-white capitalize">${food.name}</h3>
                                <div class="flex gap-2 mt-2">
                                    <span class="macro-tag bg-wine-50 text-wine-700 dark:bg-wine-900/30">Análisis IA</span>
                                    <span class="macro-tag bg-sano-50 text-sano-700 dark:bg-sano-900/30">100g</span>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-6">
                            <div class="p-6 bg-stone-50 rounded-3xl dark:bg-stone-800/50">
                                <p class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Calorías</p>
                                <p class="text-4xl font-black text-wine-700 dark:text-wine-400">${calories.toFixed(0)} <span class="text-sm font-bold text-stone-400">kcal</span></p>
                            </div>
                            <div class="p-6 bg-stone-50 rounded-3xl dark:bg-stone-800/50">
                                <p class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Proteína</p>
                                <p class="text-4xl font-black text-emerald-600 dark:text-emerald-400">${protein.toFixed(1)} <span class="text-sm font-bold text-stone-400">g</span></p>
                            </div>
                        </div>
                    </div>

                    <div class="w-full md:w-80 space-y-6">
                        <div class="p-6 bg-white border border-stone-100 rounded-3xl dark:bg-stone-800 dark:border-stone-700 shadow-sm">
                            <div class="flex justify-between mb-3"><span class="text-xs font-bold text-stone-400 uppercase">Grasas</span><span class="text-sm font-black text-rose-500">${fat.toFixed(1)}g</span></div>
                            <div class="h-2 bg-stone-100 rounded-full overflow-hidden dark:bg-stone-900"><div class="h-full bg-rose-500" style="width: ${Math.min(fat * 5, 100)}%"></div></div>
                        </div>
                        <div class="p-6 bg-white border border-stone-100 rounded-3xl dark:bg-stone-800 dark:border-stone-700 shadow-sm">
                            <div class="flex justify-between mb-3"><span class="text-xs font-bold text-stone-400 uppercase">Carbohidratos</span><span class="text-sm font-black text-amber-500">${carbs.toFixed(1)}g</span></div>
                            <div class="h-2 bg-stone-100 rounded-full overflow-hidden dark:bg-stone-900"><div class="h-full bg-amber-500" style="width: ${Math.min(carbs, 100)}%"></div></div>
                        </div>
                        <button onclick="ChatoSano.registerManualConsumo('${food.name}', ${calories}, ${protein}, ${carbs}, ${fat})" class="btn-primary w-full py-5 flex items-center justify-center gap-3">
                            <i data-lucide="plus-circle" class="w-5 h-5"></i> Registrar Hoy
                        </button>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
        $('modern-analysis-result').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // --- Cafeteria System ---
    const setupCafeteria = async () => {
        const menuContainer = $('cafeteria-menu');
        if (!menuContainer) return;

        try {
            menuContainer.innerHTML = Array(6).fill(0).map(() => `<div class="h-80 bg-stone-100 rounded-[2.5rem] animate-pulse dark:bg-stone-800"></div>`).join('');
            
            const res = await fetch(`${state.apiBase}/products`);
            const data = await res.json();
            
            if (data.success) {
                renderMenu(data.data);
            }
        } catch (err) {
            console.error('Cafeteria error:', err);
        }
    };

    const renderMenu = (items) => {
        const menuContainer = $('cafeteria-menu');
        menuContainer.innerHTML = items.map(item => `
            <div class="card-premium p-8 group cursor-pointer">
                <div class="flex justify-between items-start mb-8">
                    <div class="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform dark:bg-stone-800">
                        ${getFoodIcon(item.category)}
                    </div>
                    <span class="text-2xl font-black text-wine-700 dark:text-wine-400">$${item.price}</span>
                </div>
                <h4 class="text-2xl font-bold text-stone-900 dark:text-white mb-2">${item.name}</h4>
                <p class="text-sm text-stone-500 mb-8 font-medium">${item.description}</p>
                <div class="flex items-center justify-between pt-6 border-t border-stone-100 dark:border-stone-800">
                    <span class="text-xs font-black text-stone-400 uppercase">${item.nutritionalInfo.calories} kcal</span>
                    <button onclick="ChatoSano.registerProductConsumo('${item._id}', ${item.nutritionalInfo.calories})" class="px-6 py-2 bg-sano-50 text-sano-700 rounded-xl text-xs font-bold hover:bg-sano-600 hover:text-white transition-all">
                        Consumir
                    </button>
                </div>
            </div>
        `).join('');
    };

    const getFoodIcon = (cat) => {
        const icons = { 'Bajo en Grasa': '🍗', 'Proteína': '🥩', 'Tradicional': '🥘', 'Completo': '🍲', 'Omega 3': '🐟', 'Fibra': '🥗' };
        return icons[cat] || '🍎';
    };

    // --- Dashboard & Charts ---
    const setupCharts = () => {
        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#a1a1aa' : '#78716c';

        const ctxProgress = $('progressChart').getContext('2d');
        progressChart = new Chart(ctxProgress, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Calorías',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#722f37',
                    backgroundColor: 'rgba(114, 47, 55, 0.05)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#722f37',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { display: false }, ticks: { color: textColor, font: { weight: 'bold' } } },
                    x: { grid: { display: false }, ticks: { color: textColor, font: { weight: 'bold' } } }
                }
            }
        });

        const ctxMacro = $('macroChart').getContext('2d');
        macroChart = new Chart(ctxMacro, {
            type: 'doughnut',
            data: {
                labels: ['Proteína', 'Carbos', 'Grasas'],
                datasets: [{
                    data: [33, 33, 33],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 0,
                    cutout: '85%',
                    borderRadius: 20
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    };

    const loadDashboardData = async () => {
        if (!state.token) return;

        try {
            const res = await fetch(`${state.apiBase}/orders`, {
                headers: { 'Authorization': `Bearer ${state.token}` }
            });
            const data = await res.json();

            if (data.success) {
                const orders = data.data;
                
                // Process Weekly Data
                const weeklyKcal = [0, 0, 0, 0, 0, 0, 0];
                orders.forEach(order => {
                    const day = (new Date(order.createdAt).getDay() + 6) % 7;
                    weeklyKcal[day] += order.totalCalories;
                });
                
                progressChart.data.datasets[0].data = weeklyKcal;
                progressChart.update();

                // Process Today's Macros
                const now = new Date();
                const todayOrders = orders.filter(o => {
                    const orderDate = new Date(o.createdAt);
                    return orderDate.getDate() === now.getDate() &&
                           orderDate.getMonth() === now.getMonth() &&
                           orderDate.getFullYear() === now.getFullYear();
                });
                
                let p = 0, c = 0, f = 0;
                todayOrders.forEach(o => {
                    // Sumar de productos de cafetería
                    o.products.forEach(prod => {
                        if (prod.product?.nutritionalInfo) {
                            p += prod.product.nutritionalInfo.protein || 0;
                            c += prod.product.nutritionalInfo.carbs || 0;
                            f += prod.product.nutritionalInfo.fat || 0;
                        }
                    });
                    // Sumar de registros manuales del analizador
                    if (o.manualMacros) {
                        p += o.manualMacros.protein || 0;
                        c += o.manualMacros.carbs || 0;
                        f += o.manualMacros.fat || 0;
                    }
                });

                macroChart.data.datasets[0].data = p + c + f > 0 ? [p, c, f] : [33, 33, 33];
                macroChart.update();

                const macroLabels = $$('.macro-val');
                if (macroLabels.length >= 3) {
                    macroLabels[0].textContent = `${p.toFixed(0)}g`;
                    macroLabels[1].textContent = `${c.toFixed(0)}g`;
                    macroLabels[2].textContent = `${f.toFixed(0)}g`;
                }
            }
        } catch (err) {
            console.error('Dashboard error:', err);
        }
    };

    // --- Chat System ---
    const setupChat = () => {
        const toggle = $('chatbot-toggle');
        const window = $('chat-window');
        const close = $('close-chat');
        const input = $('chat-input');
        const send = $('send-chat');

        toggle.onclick = () => window.classList.toggle('hidden');
        close.onclick = () => window.classList.add('hidden');

        const sendMessage = async () => {
            const text = input.value.trim();
            if (!text) return;

            addChatMessage(text, 'user');
            input.value = '';

            try {
                const res = await fetch(`${state.apiBase}/chat/message`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text })
                });
                const data = await res.json();
                if (data.success) {
                    addChatMessage(data.response, 'bot');
                }
            } catch (err) {
                addChatMessage('Error de conexión con el asistente', 'bot');
            }
        };

        send.onclick = sendMessage;
        input.onkeypress = (e) => e.key === 'Enter' && sendMessage();
    };

    const addChatMessage = (text, type) => {
        const container = $('chat-messages');
        const msg = document.createElement('div');
        const isBot = type === 'bot';
        
        msg.className = `flex gap-3 ${isBot ? '' : 'flex-row-reverse'} animate-slide-up`;
        msg.innerHTML = `
            <div class="w-8 h-8 ${isBot ? 'bg-wine-100 text-wine-700' : 'bg-sano-100 text-sano-700'} rounded-full flex items-center justify-center flex-shrink-0">
                <i data-lucide="${isBot ? 'bot' : 'user'}" class="w-4 h-4"></i>
            </div>
            <div class="${isBot ? 'bg-white text-stone-700 dark:bg-stone-800 dark:text-stone-200' : 'bg-wine-700 text-white'} p-4 rounded-[1.5rem] ${isBot ? 'rounded-tl-none' : 'rounded-tr-none'} shadow-sm text-sm max-w-[85%] font-medium">
                ${text}
            </div>
        `;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
        lucide.createIcons();
    };

    // --- Helpers ---
    const setupTheme = () => {
        const toggle = $('dark-mode-toggle');
        const applyTheme = (dark) => {
            document.documentElement.classList.toggle('dark', dark);
            localStorage.setItem('theme', dark ? 'dark' : 'light');
            const icon = dark ? 'sun' : 'moon';
            toggle.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5 text-stone-600 dark:text-stone-400"></i>`;
            lucide.createIcons();
            if (progressChart) {
                const color = dark ? '#a1a1aa' : '#78716c';
                progressChart.options.scales.y.ticks.color = color;
                progressChart.options.scales.x.ticks.color = color;
                progressChart.update();
            }
        };

        toggle.onclick = () => applyTheme(!document.documentElement.classList.contains('dark'));
        if (localStorage.getItem('theme') === 'dark') applyTheme(true);
    };

    const showToast = (message, type = 'success') => {
        const container = $('toast-container');
        
        // Limitar a 3 toasts máximo para no saturar la pantalla
        if (container.children.length >= 2) {
            container.removeChild(container.firstChild);
        }

        const toast = document.createElement('div');
        const isSuccess = type === 'success';
        
        toast.className = `flex items-center gap-4 p-5 rounded-[1.5rem] shadow-2xl border glass animate-slide-up pointer-events-auto min-w-[320px]`;
        toast.innerHTML = `
            <div class="w-10 h-10 ${isSuccess ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'} rounded-xl flex items-center justify-center">
                <i data-lucide="${isSuccess ? 'check-circle' : 'alert-circle'}" class="w-6 h-6"></i>
            </div>
            <p class="text-sm font-bold text-stone-800 dark:text-white flex-1">${message}</p>
        `;
        
        container.appendChild(toast);
        lucide.createIcons();
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-x-10');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    };

    const debounce = (fn, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    };

    const revealOnScroll = () => {
        $$('.reveal, .reveal-left, .reveal-right').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) el.classList.add('active');
        });
    };
    window.addEventListener('scroll', revealOnScroll);

    const updateDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        $('today-date').textContent = new Date().toLocaleDateString('es-ES', options);
    };

    // --- Public API ---
    return {
        init,
        registerProductConsumo: async (id, kcal) => {
            if (!state.token) {
                showToast('Inicia sesión para registrar consumos', 'error');
                switchView('login');
                return;
            }
            try {
                const res = await fetch(`${state.apiBase}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.token}` },
                    body: JSON.stringify({ products: [{ product: id, quantity: 1 }], totalCalories: kcal })
                });
                if (res.ok) {
                    showToast('¡Consumo registrado! 🥗');
                    if (state.currentView === 'dashboard') loadDashboardData();
                }
            } catch (err) { showToast('Error al registrar', 'error'); }
        },
        registerManualConsumo: async (name, kcal, p, c, f) => {
            if (!state.token) {
                showToast('Inicia sesión para registrar consumos', 'error');
                switchView('login');
                return;
            }
            try {
                const res = await fetch(`${state.apiBase}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.token}` },
                    body: JSON.stringify({ 
                        totalCalories: kcal,
                        manualMacros: { protein: p, carbs: c, fat: f, itemName: name }
                    })
                });
                if (res.ok) {
                    showToast(`¡${name} registrado hoy! 🍎`);
                    if (state.currentView === 'dashboard') loadDashboardData();
                }
            } catch (err) { showToast('Error al registrar', 'error'); }
        }
    };
})();

// Initialize on Load
document.addEventListener('DOMContentLoaded', ChatoSano.init);
