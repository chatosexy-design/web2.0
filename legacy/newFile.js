/**
 * Chato Sano App - Main JavaScript Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. SPA Navigation System
    const views = document.querySelectorAll('.view');
    const navLinks = document.querySelectorAll('.nav-link');
    const navLogo = document.getElementById('nav-logo');

    function switchView(viewId) {
        views.forEach(v => v.classList.add('hidden'));
        document.getElementById(`view-${viewId}`).classList.remove('hidden');

        // Update nav links active state
        navLinks.forEach(link => {
            if (link.dataset.view === viewId) {
                link.classList.add('text-wine-700', 'font-bold');
                link.classList.remove('text-stone-600', 'font-medium');
            } else {
                link.classList.remove('text-wine-700', 'font-bold');
                link.classList.add('text-stone-600', 'font-medium');
            }
        });

        // Trigger scroll reveal for new view
        setTimeout(revealOnScroll, 100);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchView(link.dataset.view);
        });
    });

    navLogo.addEventListener('click', () => switchView('home'));

    // 3. Auth Simulation
    const authButtons = document.getElementById('auth-buttons');
    const userProfileNav = document.getElementById('user-profile-nav');
    const navUsername = document.getElementById('nav-username');
    const loginNavBtn = document.getElementById('login-nav-btn');
    const registerNavBtn = document.getElementById('register-nav-btn');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    let currentUser = null;

    function updateAuthUI() {
        if (currentUser) {
            authButtons.classList.add('hidden');
            userProfileNav.classList.remove('hidden');
            userProfileNav.classList.add('flex');
            navUsername.textContent = currentUser.name;
        } else {
            authButtons.classList.remove('hidden');
            userProfileNav.classList.add('hidden');
            userProfileNav.classList.remove('flex');
        }
    }

    loginNavBtn.addEventListener('click', () => switchView('login'));
    registerNavBtn.addEventListener('click', () => switchView('login'));

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        currentUser = { name: email.split('@')[0], email: email };
        updateAuthUI();
        showToast(`¡Bienvenido de nuevo, ${currentUser.name}!`);
        switchView('dashboard');
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        updateAuthUI();
        showToast("Has cerrado sesión correctamente.");
        switchView('home');
    });

    // 4. Cafeteria Menu System (Ported from WEBdefinitive)
    const cafeteriaMenu = document.getElementById('cafeteria-menu');
    const menuItems = [
        { name: "Pechuga al Grill", calories: 450, price: "$110", icon: "🍗", tags: ["Bajo en Grasa"] },
        { name: "Tacos de Bistec", calories: 450, price: "$95", icon: "🌮", tags: ["Proteína", "Clásico"] },
        { name: "Enchiladas Verdes", calories: 580, price: "$105", icon: "🥘", tags: ["Tradicional"] },
        { name: "Pozole de Pollo", calories: 420, price: "$85", icon: "🍲", tags: ["Completo"] },
        { name: "Pescado al Vapor", calories: 320, price: "$125", icon: "🐟", tags: ["Omega 3", "Ligero"] },
        { name: "Ensalada Mix", calories: 150, price: "$65", icon: "🥗", tags: ["Fibra", "Natural"] },
        { name: "Agua de Fruta", calories: 80, price: "$35", icon: "🥤", tags: ["Refrescante"] },
        { name: "Fruta Picada", calories: 120, price: "$45", icon: "🍎", tags: ["Vitamina C"] },
        { name: "Huevo con Nopales", calories: 280, price: "$75", icon: "🍳", tags: ["Desayuno"] },
        { name: "Frijoles de la Olla", calories: 120, price: "$40", icon: "🥣", tags: ["Leguminosa"] },
        { name: "Arroz Blanco", calories: 150, price: "$40", icon: "🍚", tags: ["Cereal"] },
        { name: "Aguacate Extra", calories: 80, price: "$25", icon: "🥑", tags: ["Grasa Sana"] }
    ];

    function renderMenu() {
        if (!cafeteriaMenu) return;
        cafeteriaMenu.innerHTML = menuItems.map(item => `
            <div class="bg-stone-50 p-6 rounded-[2.5rem] border border-stone-100 hover:border-sano-300 transition-all group cursor-pointer shadow-sm hover:shadow-xl dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-sano-500">
                <div class="flex justify-between items-start mb-6">
                    <div class="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform dark:bg-zinc-800">
                        ${item.icon}
                    </div>
                    <span class="text-wine-700 font-black text-xl dark:text-wine-400">${item.price}</span>
                </div>
                <h4 class="text-xl font-bold mb-2 dark:text-white">${item.name}</h4>
                <div class="flex items-center gap-2 mb-6">
                    <span class="text-xs font-black text-stone-400 uppercase tracking-tighter dark:text-zinc-500">${item.calories} kcal</span>
                    <div class="flex gap-1">
                        ${item.tags.map(tag => `<span class="text-[10px] bg-sano-50 text-sano-700 px-2 py-0.5 rounded-full font-bold dark:bg-sano-900/30 dark:text-sano-400">${tag}</span>`).join('')}
                    </div>
                </div>
                <button class="w-full py-3 bg-white border-2 border-stone-100 rounded-xl font-bold text-sm hover:bg-sano-600 hover:text-white hover:border-sano-600 transition-all dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-sano-600 dark:hover:text-white dark:hover:border-sano-600">
                    Registrar Consumo
                </button>
            </div>
        `).join('');
    }

    renderMenu();

    // Scroll Reveal Logic
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const revealTop = reveal.getBoundingClientRect().top;
            const revealPoint = 150;
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load


    // 2. Tips Generator
    const tips = [
        "Masticar cada bocado al menos 20 veces ayuda a mejorar la digestión.",
        "Beber un vaso de agua antes de cada comida reduce el hambre excesiva.",
        "Prioriza alimentos enteros sobre los procesados siempre que sea posible.",
        "Dormir 7-8 horas es crucial para regular las hormonas del hambre.",
        "Las especias como la cúrcuma y el jengibre tienen propiedades antiinflamatorias.",
        "El 80% de tu salud depende de lo que comes, el 20% del ejercicio.",
        "Evita comer frente a pantallas para ser más consciente de tu saciedad."
    ];

    const tipElement = document.getElementById('daily-tip');
    const refreshTipBtn = document.getElementById('refresh-tip');

    if (refreshTipBtn) {
        refreshTipBtn.addEventListener('click', () => {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            tipElement.classList.add('opacity-0');
            setTimeout(() => {
                tipElement.textContent = `"${randomTip}"`;
                tipElement.classList.remove('opacity-0');
            }, 300);
        });
    }

    // 3. Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const moonIcon = darkModeToggle.querySelector('i');

    // Toast Notification System
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `flex items-center gap-3 p-4 rounded-2xl shadow-xl border bg-white animate-slide-up pointer-events-auto min-w-[300px] z-[70] dark:bg-zinc-800 dark:border-zinc-700`;

        const icon = type === 'success' ? 'check-circle' : 'alert-circle';
        const iconColor = type === 'success' ? 'text-emerald-500' : 'text-rose-500';

        toast.innerHTML = `
            <div class="p-2 ${type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-rose-50 dark:bg-rose-900/30'} rounded-xl">
                <i data-lucide="${icon}" class="w-5 h-5 ${iconColor}"></i>
            </div>
            <div class="flex-1">
                <p class="text-sm font-bold text-stone-900 dark:text-zinc-100">${message}</p>
            </div>
            <button class="p-1 hover:bg-stone-50 rounded-lg text-stone-400 dark:hover:bg-zinc-700 dark:text-zinc-500">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        `;

        container.appendChild(toast);
        lucide.createIcons();

        const removeToast = () => {
            toast.classList.add('opacity-0', 'translate-x-full');
            toast.style.transition = 'all 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        };

        toast.querySelector('button').onclick = removeToast;
        setTimeout(removeToast, 5000);
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');

        // Update icon based on mode
        if (isDark) {
            moonIcon.setAttribute('data-lucide', 'sun');
        } else {
            moonIcon.setAttribute('data-lucide', 'moon');
        }
        lucide.createIcons();
        updateCharts();

        // Save preference (optional)
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Check for saved theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark');
        moonIcon.setAttribute('data-lucide', 'sun');
        lucide.createIcons();
    }

    // 4. Modern Food Analysis System (Mexican Variety)
    const foodSearchModern = document.getElementById('food-search-modern');
    const clearSearchBtn = document.getElementById('clear-search');
    const searchActionBtn = document.getElementById('search-action-btn');
    const searchSuggestions = document.getElementById('search-suggestions');
    const modernAnalysisResult = document.getElementById('modern-analysis-result');
    const recentSearchesContainer = document.getElementById('recent-searches-container');
    const recentSearchesList = document.getElementById('recent-searches-list');
    const categoryChips = document.querySelectorAll('.category-chip');

    let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

    const mexicanFoodDB = {
        // --- Platillos Preparados ---
        'taco al pastor': {
            label: 'Taco al Pastor',
            calories: 93, protein: 4.99, fat: 6.1, carbs: 4.7,
            description: 'Tortilla de maíz rellena de carne de cerdo adobada (achiote, chiles) y piña, servido con cebolla y cilantro.',
            tags: ['Popular', 'Cerdo'],
            category: 'tacos'
        },
        'tamal': {
            label: 'Tamal (100g)',
            calories: 148, protein: 2.81, fat: 8.5, carbs: 15.2,
            description: 'Masa de maíz sazonada rellena de carne, pollo o rajas, cocida al vapor en hojas de maíz.',
            tags: ['Tradicional', 'Maíz'],
            category: 'mexicana'
        },
        'enchilada': {
            label: 'Enchilada de Carne y Queso',
            calories: 212, protein: 10.52, fat: 11.9, carbs: 16.6,
            description: 'Tortilla de maíz enrollada y bañada en salsa picante, rellena de carne y queso.',
            tags: ['Picante', 'Queso'],
            category: 'mexicana'
        },
        'pozole': {
            label: 'Pozole (1 taza)',
            calories: 228, protein: 16.23, fat: 10.9, carbs: 15.1,
            description: 'Caldo tradicional de granos de maíz nixtamalizado con carne y especias.',
            tags: ['Completo', 'Caldo'],
            category: 'mexicana'
        },
        'mole poblano': {
            label: 'Mole Poblano (100g)',
            calories: 118, protein: 3.98, fat: 8.64, carbs: 8.52,
            description: 'Salsa espesa de chiles secos, especias, frutos secos y chocolate amargo.',
            tags: ['Gourmet', 'Puebla'],
            category: 'mexicana'
        },
        'chilaquiles': {
            label: 'Chilaquiles (1 porción)',
            calories: 443, protein: 9.74, fat: 32.0, carbs: 31.9,
            description: 'Totopos de tortilla fritos cocinados en salsa verde o roja, con pollo y queso.',
            tags: ['Desayuno', 'Frito'],
            category: 'mexicana'
        },
        'quesadilla': {
            label: 'Quesadilla Básica',
            calories: 171, protein: 9.50, fat: 9.9, carbs: 10.5,
            description: 'Tortilla doblada con queso fundido, asada en comal.',
            tags: ['Rápido', 'Queso'],
            category: 'mexicana'
        },
        'sope': {
            label: 'Sope de Masa (Sencillo)',
            calories: 87, protein: 2.24, fat: 0.9, carbs: 18.3,
            description: 'Base de masa de maíz gruesa con bordes pellizcados, frita en manteca.',
            tags: ['Antojito', 'Maíz'],
            category: 'mexicana'
        },
        'taco de carnitas': {
            label: 'Taco de Carnitas',
            calories: 243, protein: 16.00, fat: 10.1, carbs: 21.7,
            description: 'Trozos de carne de cerdo cocidos lentamente en su propia grasa.',
            tags: ['Michoacán', 'Cerdo'],
            category: 'tacos'
        },
        'birria': {
            label: 'Birria (1 taza)',
            calories: 342, protein: 28.86, fat: 20.1, carbs: 10.5,
            description: 'Guiso de carne marinada en adobo de chiles secos y especias.',
            tags: ['Jalisco', 'Caldo'],
            category: 'mexicana'
        },
        'chile en nogada': {
            label: 'Chile en Nogada (1 pza)',
            calories: 413, protein: 18.06, fat: 29.2, carbs: 22.4,
            description: 'Chile poblano relleno de picadillo con frutas, cubierto con salsa de nuez.',
            tags: ['Temporada', 'Elegante'],
            category: 'mexicana'
        },
        'sopa de tortilla': {
            label: 'Sopa de Tortilla (1 taza)',
            calories: 235, protein: 9.82, fat: 13.7, carbs: 18.8,
            description: 'Caldo de jitomate con tiras de tortilla fritas, chile y aguacate.',
            tags: ['Sopa', 'Azteca'],
            category: 'mexicana'
        },
        // --- Productos de Abarrotes / Tiendita ---
        'azúcar': {
            label: 'Azúcar (1kg)',
            calories: 3870, protein: 0, fat: 0, carbs: 1000,
            description: 'Endulzante para café, aguas frescas y postres. Marcas: Zulka, Los Portales.',
            tags: ['Básico', 'Endulzante'],
            category: 'abarrotes',
            price: '~$15/kg',
            substitutes: ['Miel', 'Azúcar mascabada']
        },
        'aceite vegetal': {
            label: 'Aceite Vegetal (1L)',
            calories: 8840, protein: 0, fat: 1000, carbs: 0,
            description: 'Esencial para freír y guisar. Marcas: 1-2-3, Nutrioli, Cristal.',
            tags: ['Básico', 'Grasas'],
            category: 'abarrotes',
            price: '~$25/L',
            substitutes: ['Aceite de oliva']
        },
        'leche entera': {
            label: 'Leche Entera (1L)',
            calories: 610, protein: 32, fat: 33, carbs: 48,
            description: 'Base para bebidas y cocina. Marcas: Lala, Alpura.',
            tags: ['Lácteo', 'Desayuno'],
            category: 'abarrotes',
            price: '~$20/L',
            substitutes: ['Leche en polvo']
        },
        'café soluble': {
            label: 'Café Soluble (200g)',
            calories: 2, protein: 0.1, fat: 0, carbs: 0.3,
            description: 'Bebida instantánea de consumo diario. Marcas: Nescafé, Starbucks.',
            tags: ['Bebida', 'Cafeína'],
            category: 'abarrotes',
            price: '~$50/frasco',
            substitutes: ['Té negro', 'Chocolate caliente']
        },
        'sal de mesa': {
            label: 'Sal de Mesa (1kg)',
            calories: 0, protein: 0, fat: 0, carbs: 0,
            description: 'Condimento esencial. Marcas: Sal Sol, Sal Suprema.',
            tags: ['Básico', 'Sodio'],
            category: 'abarrotes',
            price: '~$10/kg',
            substitutes: ['Caldos en polvo']
        },
        'frijol negro': {
            label: 'Frijol Negro (1kg)',
            calories: 3410, protein: 216, fat: 14, carbs: 624,
            description: 'Proteína vegetal para caldos o refritos. Marcas: San Juan, La Sierra.',
            tags: ['Leguminosa', 'Proteína'],
            category: 'abarrotes',
            price: '~$20/kg',
            substitutes: ['Lentejas']
        },
        'arroz': {
            label: 'Arroz (1kg)',
            calories: 3650, protein: 71, fat: 7, carbs: 800,
            description: 'Grano versátil para guarniciones y sopas. Marcas: Zafrán, La Sierra.',
            tags: ['Cereal', 'Energía'],
            category: 'abarrotes',
            price: 'No especificado',
            substitutes: ['Pasta de fideo']
        },
        'tortilla de maíz': {
            label: 'Tortilla de Maíz (paquete)',
            calories: 218, protein: 5.7, fat: 2.8, carbs: 45,
            description: 'Base de la alimentación mexicana. Tortillería local.',
            tags: ['Básico', 'Maíz'],
            category: 'abarrotes',
            price: '~$15/paquete',
            substitutes: ['Tostadas']
        }
    };

    function updateRecentSearchesUI() {
        if (recentSearches.length === 0) {
            recentSearchesContainer.classList.add('hidden');
            return;
        }
        recentSearchesContainer.classList.remove('hidden');
        recentSearchesList.innerHTML = recentSearches.map(term => `
            <button class="px-4 py-2 bg-stone-100 rounded-full text-xs font-bold text-stone-500 hover:bg-sano-50 hover:text-sano-700 transition-all recent-item dark:bg-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-sano-400">
                ${term}
            </button>
        `).join('');

        document.querySelectorAll('.recent-item').forEach(btn => {
            btn.addEventListener('click', () => {
                foodSearchModern.value = btn.textContent.trim();
                handleSearch(btn.textContent.trim());
            });
        });
    }

    function handleSearch(query) {
        if (!query) return;

        const food = mexicanFoodDB[query.toLowerCase()];
        searchSuggestions.classList.add('hidden');

        // Save to recent
        if (!recentSearches.includes(query)) {
            recentSearches = [query, ...recentSearches.slice(0, 4)];
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
            updateRecentSearchesUI();
        }

        if (food) {
            displayModernResult(food);
        } else {
            showToast(`No encontramos "${query}", pero prueba con "Taco al pastor" o "Pozole".`, 'error');
        }
    }

    function displayModernResult(food) {
        modernAnalysisResult.innerHTML = `
            <div class="bg-white rounded-[3rem] p-8 border border-stone-100 shadow-2xl overflow-hidden relative dark:bg-zinc-900 dark:border-zinc-800">
                <div class="flex flex-col md:flex-row gap-10">
                    <div class="flex-1">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="w-16 h-16 bg-sano-100 rounded-3xl flex items-center justify-center text-3xl dark:bg-sano-900/30">
                                ${food.category === 'tacos' ? '🌮' : (food.category === 'abarrotes' ? '📦' : '🍲')}
                            </div>
                            <div>
                                <h3 class="text-3xl font-black text-stone-900 dark:text-white">${food.label}</h3>
                                <div class="flex gap-2 mt-1">
                                    ${food.tags.map(t => `<span class="text-[10px] font-black uppercase tracking-tighter text-sano-600 bg-sano-50 px-2 py-0.5 rounded-full dark:text-sano-400 dark:bg-sano-900/40">${t}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                        <p class="text-stone-500 leading-relaxed font-medium mb-8 dark:text-zinc-400">${food.description}</p>
                        
                        ${food.price ? `
                            <div class="mb-6 p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200 dark:bg-zinc-800/50 dark:border-zinc-700">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-xs font-black text-stone-400 uppercase dark:text-zinc-500">Precio Estimado</span>
                                    <span class="text-sm font-black text-wine-700 dark:text-wine-400">${food.price}</span>
                                </div>
                                ${food.substitutes ? `
                                    <div class="flex gap-2 items-center">
                                        <span class="text-[10px] font-black text-stone-400 uppercase dark:text-zinc-500">Sustitutos:</span>
                                        <div class="flex gap-1">
                                            ${food.substitutes.map(s => `<span class="text-[10px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded-lg border border-stone-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">${s}</span>`).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}

                        <div class="grid grid-cols-2 gap-4">
                            <div class="p-6 bg-stone-50 rounded-[2rem] border border-stone-100 dark:bg-zinc-800 dark:border-zinc-700">
                                <p class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 dark:text-zinc-500">Calorías</p>
                                <p class="text-3xl font-black text-wine-900 dark:text-wine-100">${food.calories} <span class="text-sm font-bold text-stone-400">kcal</span></p>
                            </div>
                            <div class="p-6 bg-stone-50 rounded-[2rem] border border-stone-100 dark:bg-zinc-800 dark:border-zinc-700">
                                <p class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 dark:text-zinc-500">Proteína</p>
                                <p class="text-3xl font-black text-emerald-600 dark:text-emerald-400">${food.protein} <span class="text-sm font-bold text-stone-400">g</span></p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="w-full md:w-72 space-y-4">
                        <div class="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
                            <div class="flex justify-between items-center mb-4">
                                <span class="text-xs font-black text-stone-400 uppercase dark:text-zinc-500">Grasas</span>
                                <span class="text-sm font-black text-rose-500 dark:text-rose-400">${food.fat}g</span>
                            </div>
                            <div class="h-2 bg-stone-100 rounded-full overflow-hidden dark:bg-zinc-900">
                                <div class="h-full bg-rose-500" style="width: ${Math.min(food.fat * 2, 100)}%"></div>
                            </div>
                        </div>
                        <div class="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
                            <div class="flex justify-between items-center mb-4">
                                <span class="text-xs font-black text-stone-400 uppercase dark:text-zinc-500">Carbohidratos</span>
                                <span class="text-sm font-black text-amber-500 dark:text-amber-400">${food.carbs}g</span>
                            </div>
                            <div class="h-2 bg-stone-100 rounded-full overflow-hidden dark:bg-zinc-900">
                                <div class="h-full bg-amber-500" style="width: ${Math.min(food.carbs, 100)}%"></div>
                            </div>
                        </div>
                        <button class="w-full py-4 bg-sano-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-sano-100 hover:bg-sano-700 transition-all flex items-center justify-center gap-2 dark:shadow-sano-900/20">
                            <i data-lucide="plus" class="w-4 h-4"></i> Agregar al Diario
                        </button>
                    </div>
                </div>
            </div>
        `;
        modernAnalysisResult.classList.remove('hidden');
        modernAnalysisResult.scrollIntoView({ behavior: 'smooth' });
        lucide.createIcons();
    }

    foodSearchModern.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase().trim();
        clearSearchBtn.classList.toggle('hidden', !val);

        if (val.length < 2) {
            searchSuggestions.classList.add('hidden');
            return;
        }

        const matches = Object.keys(mexicanFoodDB).filter(k => k.includes(val)).slice(0, 5);
        if (matches.length > 0) {
            searchSuggestions.innerHTML = matches.map(m => `
                <div class="px-6 py-4 hover:bg-stone-50 cursor-pointer border-b border-stone-50 last:border-0 flex items-center gap-3 suggestion-item dark:hover:bg-zinc-800 dark:border-zinc-800">
                    <i data-lucide="search" class="w-4 h-4 text-stone-300 dark:text-zinc-600"></i>
                    <span class="font-bold text-stone-600 dark:text-zinc-300">${mexicanFoodDB[m].label}</span>
                </div>
            `).join('');
            searchSuggestions.classList.remove('hidden');
            lucide.createIcons();

            document.querySelectorAll('.suggestion-item').forEach((item, idx) => {
                item.addEventListener('click', () => {
                    foodSearchModern.value = mexicanFoodDB[matches[idx]].label;
                    handleSearch(matches[idx]);
                });
            });
        } else {
            searchSuggestions.classList.add('hidden');
        }
    });

    clearSearchBtn.addEventListener('click', () => {
        foodSearchModern.value = '';
        clearSearchBtn.classList.add('hidden');
        searchSuggestions.classList.add('hidden');
        foodSearchModern.focus();
    });

    searchActionBtn.addEventListener('click', () => handleSearch(foodSearchModern.value));
    foodSearchModern.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch(foodSearchModern.value);
    });

    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const cat = chip.dataset.category;
            const firstMatch = Object.keys(mexicanFoodDB).find(k => mexicanFoodDB[k].category === cat || k.includes(cat));
            if (firstMatch) {
                foodSearchModern.value = mexicanFoodDB[firstMatch].label;
                handleSearch(firstMatch);
            }
        });
    });

    updateRecentSearchesUI();

    // 4. Progress Chart (Chart.js)
    function getChartColors() {
        const isDark = document.body.classList.contains('dark');
        return {
            text: isDark ? '#a1a1aa' : '#78716c',
            grid: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            wine: isDark ? '#ac1e2f' : '#722f37',
            sano: isDark ? '#3eb856' : '#3eb856'
        };
    }

    const chartColors = getChartColors();
    const ctx = document.getElementById('progressChart').getContext('2d');
    const progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Consumo de Azúcar (g)',
                data: [45, 38, 42, 25, 30, 22, 18],
                borderColor: chartColors.wine,
                backgroundColor: 'rgba(114, 47, 55, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }, {
                label: 'Hábito Sano (Meta)',
                data: [25, 25, 25, 25, 25, 25, 25],
                borderColor: chartColors.sano,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: chartColors.grid
                    },
                    ticks: {
                        color: chartColors.text
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: chartColors.text
                    }
                }
            }
        }
    });

    // 5. Macro Distribution Chart
    const macroCtx = document.getElementById('macroChart').getContext('2d');
    const macroChart = new Chart(macroCtx, {
        type: 'doughnut',
        data: {
            labels: ['Proteína', 'Carbos', 'Grasas'],
            datasets: [{
                data: [85, 120, 45],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0,
                cutout: '80%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Function to update charts on dark mode toggle
    function updateCharts() {
        const colors = getChartColors();

        progressChart.options.scales.y.grid.color = colors.grid;
        progressChart.options.scales.y.ticks.color = colors.text;
        progressChart.options.scales.x.ticks.color = colors.text;
        progressChart.data.datasets[0].borderColor = colors.wine;
        progressChart.update();

        // Doughnut chart usually doesn't need scale updates but can update labels if needed
        macroChart.update();
    }

    // 6. Water Tracker Logic
    const addWaterBtn = document.getElementById('add-water');
    const waterProgress = document.getElementById('water-progress');
    const waterCupsContainer = document.getElementById('water-cups');
    let currentWater = 1.5;
    const waterMeta = 2.5;

    function updateWaterUI() {
        waterProgress.innerHTML = `${currentWater.toFixed(1)}<span class="text-xl text-blue-200">L</span>`;

        // Generate cups
        const totalCups = 10;
        const activeCups = Math.floor((currentWater / waterMeta) * totalCups);

        waterCupsContainer.innerHTML = '';
        for (let i = 0; i < totalCups; i++) {
            const cup = document.createElement('div');
            cup.className = `h-8 rounded-lg transition-all duration-500 ${i < activeCups ? 'bg-blue-400' : 'bg-white/10'}`;
            waterCupsContainer.appendChild(cup);
        }
    }

    addWaterBtn.addEventListener('click', () => {
        if (currentWater < waterMeta) {
            currentWater += 0.25;
            updateWaterUI();
            showToast("¡Vaso de agua registrado! 💧");

            // Simulating XP gain
            showToast("+5 XP de Hidratación", "success");
        } else {
            showToast("¡Meta de hidratación alcanzada! 🌟");
        }
    });

    updateWaterUI(); // Initial run


    // 5. Chatbot System
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');

    function toggleChat() {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
    }

    function addMessage(text, isBot = true) {
        const msg = document.createElement('div');
        msg.className = `flex gap-2 ${isBot ? '' : 'flex-row-reverse'}`;

        msg.innerHTML = `
            <div class="w-8 h-8 ${isBot ? 'bg-wine-100 dark:bg-wine-900/30' : 'bg-sano-100 dark:bg-sano-900/30'} rounded-full flex items-center justify-center flex-shrink-0">
                <i data-lucide="${isBot ? 'bot' : 'user'}" class="w-4 h-4 ${isBot ? 'text-wine-700 dark:text-wine-400' : 'text-sano-700 dark:text-sano-400'}"></i>
            </div>
            <div class="${isBot ? 'bg-white dark:bg-zinc-800 dark:text-zinc-200' : 'bg-wine-700 text-white dark:bg-wine-600'} p-3 rounded-2xl ${isBot ? 'rounded-tl-none' : 'rounded-tr-none'} shadow-sm text-sm max-w-[80%]">
                ${text}
            </div>
        `;

        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        lucide.createIcons();
    }

    async function handleChat() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, false);
        chatInput.value = '';

        // Simulate bot thinking
        const thinking = document.createElement('div');
        thinking.className = 'flex gap-2 animate-pulse';
        thinking.innerHTML = `
            <div class="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center">
                <i data-lucide="loader-2" class="w-4 h-4 text-stone-400 animate-spin"></i>
            </div>
            <div class="bg-stone-100 p-3 rounded-2xl rounded-tl-none text-xs text-stone-400">Escribiendo...</div>
        `;
        chatMessages.appendChild(thinking);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        lucide.createIcons();

        setTimeout(() => {
            thinking.remove();
            let response = "Interesante pregunta. Como asistente de Chato Sano, te recomiendo priorizar alimentos frescos y equilibrar tus macronutrientes.";

            const lowText = text.toLowerCase();
            if (lowText.includes('cena')) response = "Para la cena, busca algo ligero como salmón a la plancha con espárragos o una ensalada de garbanzos.";
            if (lowText.includes('calorias')) response = "Controlar las calorías es importante, pero la calidad nutricional lo es más. ¡Busca alimentos con alta densidad de nutrientes!";
            if (lowText.includes('gracias')) response = "¡De nada! En Chato Sano estamos para acompañarte. 🍎";

            addMessage(response, true);
        }, 1500);
    }

    chatbotToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);
    sendChat.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    // 6. Geolocation API Simulation
    const findNearbyBtn = document.getElementById('find-nearby-btn');
    const mapPlaceholder = document.getElementById('map-placeholder');

    findNearbyBtn.addEventListener('click', () => {
        findNearbyBtn.disabled = true;
        findNearbyBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin w-5 h-5"></i> Localizando...';
        lucide.createIcons();

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setTimeout(() => {
                    mapPlaceholder.innerHTML = `
                        <div class="p-8 text-center animate-fade-in">
                            <i data-lucide="check-circle" class="w-12 h-12 text-emerald-500 mx-auto mb-4"></i>
                            <h4 class="font-bold text-lg mb-2 dark:text-white">¡Ubicación detectada!</h4>
                            <p class="text-stone-500 text-sm mb-4 dark:text-zinc-500">Mostrando 5 restaurantes saludables en tu zona.</p>
                            <div class="space-y-2 text-left max-w-xs mx-auto">
                                <div class="p-2 bg-white rounded-lg shadow-sm border border-stone-200 text-xs font-bold dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300">• Green Garden (0.5km)</div>
                                <div class="p-2 bg-white rounded-lg shadow-sm border border-stone-200 text-xs font-bold dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300">• BioBite Healthy (1.2km)</div>
                            </div>
                        </div>
                    `;
                    findNearbyBtn.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i> Cerca de ti';
                    findNearbyBtn.classList.replace('bg-wine-700', 'bg-emerald-600');
                    lucide.createIcons();
                }, 1500);
            }, (error) => {
                showToast("No se pudo obtener la ubicación. Mostrando opciones generales.", "error");
                mapPlaceholder.innerHTML = "<p>Ubicación no disponible.</p>";
                findNearbyBtn.innerHTML = "Reintentar";
                findNearbyBtn.disabled = false;
                lucide.createIcons();
            });
        } else {
            showToast("Tu navegador no soporta geolocalización.", "error");
        }
    });

    // 7. Micro-interactions (Habits)
    const habits = document.querySelectorAll('[title]');
    habits.forEach(habit => {
        habit.addEventListener('click', () => {
            if (!habit.classList.contains('opacity-40')) {
                showToast("¡Hábito completado! +10 puntos Chato Sano 🏆");
                habit.classList.add('scale-125');
                setTimeout(() => habit.classList.remove('scale-125'), 200);
            }
        });
    });

    // 8. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
