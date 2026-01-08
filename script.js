// Données de démonstration
const demoCredentials = {
    email: 'admin@demo.com',
    password: 'admin123'
};

// Fonctions utilitaires
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR');
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Gestion de l'authentification
function createAccount(email, password, companyName) {
    // Vérifier si l'utilisateur existe déjà
    const users = getFromStorage('users') || [];
    if (users.find(user => user.email === email)) {
        return { success: false, message: 'Un compte avec cet email existe déjà' };
    }
    
    // Créer le nouvel utilisateur
    const newUser = {
        id: generateId(),
        email: email,
        password: password, // En production, il faudrait hasher le mot de passe
        companyName: companyName,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveToStorage('users', users);
    
    return { success: true, message: 'Compte créé avec succès' };
}

function login(email, password) {
    // Vérifier d'abord les comptes créés
    const users = getFromStorage('users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('companyName', user.companyName || 'Mon Entreprise');
        return true;
    }
    
    // Fallback sur le compte de démonstration
    if (email === demoCredentials.email && password === demoCredentials.password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('companyName', 'Entreprise Démo');
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('companyName');
    window.location.href = 'index.html';
}

function checkAuth() {
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Gestion du formulaire de connexion
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const toggleMode = document.getElementById('toggleMode');
    const toggleText = document.getElementById('toggleText');
    const submitBtn = document.getElementById('submitBtn');
    const signupFields = document.getElementById('signupFields');
    const confirmPassword = document.getElementById('confirmPassword');
    const companyName = document.getElementById('companyName');
    
    let isSignupMode = false;
    
    // Basculer entre connexion et inscription
    if (toggleMode) {
        toggleMode.addEventListener('click', function(e) {
            e.preventDefault();
            isSignupMode = !isSignupMode;
            
            if (isSignupMode) {
                signupFields.style.display = 'block';
                submitBtn.textContent = 'Créer le compte';
                toggleText.textContent = 'Déjà un compte ?';
                toggleMode.textContent = 'Se connecter';
                confirmPassword.required = true;
                companyName.required = true;
            } else {
                signupFields.style.display = 'none';
                submitBtn.textContent = 'Se connecter';
                toggleText.textContent = 'Pas encore de compte ?';
                toggleMode.textContent = 'Créer un compte';
                confirmPassword.required = false;
                companyName.required = false;
            }
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (isSignupMode) {
                // Mode inscription
                const confirmPass = confirmPassword.value;
                const company = companyName.value;
                
                if (password !== confirmPass) {
                    alert('Les mots de passe ne correspondent pas');
                    return;
                }
                
                if (password.length < 6) {
                    alert('Le mot de passe doit contenir au moins 6 caractères');
                    return;
                }
                
                const result = createAccount(email, password, company);
                if (result.success) {
                    alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
                    // Basculer vers le mode connexion
                    toggleMode.click();
                    loginForm.reset();
                } else {
                    alert(result.message);
                }
            } else {
                // Mode connexion
                if (login(email, password)) {
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Email ou mot de passe incorrect');
                }
            }
        });
    }
});

// Gestion des données
function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Initialisation des données de démonstration
function initDemoData() {
    if (!localStorage.getItem('demoDataInitialized')) {
        // Clients de démonstration
        const demoClients = [
            { id: '1', name: 'Jean Dupont', email: 'jean@exemple.com', phone: '01 23 45 67 89', company: 'Dupont SARL' },
            { id: '2', name: 'Marie Martin', email: 'marie@martin.fr', phone: '01 98 76 54 32', company: 'Martin & Co' },
            { id: '3', name: 'Pierre Durand', email: 'pierre@durand.com', phone: '01 45 67 89 12', company: 'Durand Industries' }
        ];
        
        // Ventes de démonstration
        const demoSales = [
            { id: '1', date: '2025-01-15', client: 'Jean Dupont', product: 'Consultation web', amount: 850 },
            { id: '2', date: '2025-01-14', client: 'Marie Martin', product: 'Développement site', amount: 2500 },
            { id: '3', date: '2025-01-12', client: 'Pierre Durand', product: 'Formation équipe', amount: 1200 }
        ];
        
        // Dépenses de démonstration
        const demoExpenses = [
            { id: '1', date: '2025-01-15', description: 'Abonnement logiciel', category: 'Services', amount: 99 },
            { id: '2', date: '2025-01-14', description: 'Essence véhicule', category: 'Transport', amount: 75 },
            { id: '3', date: '2025-01-13', description: 'Fournitures bureau', category: 'Fournitures', amount: 45 }
        ];
        
        saveToStorage('clients', demoClients);
        saveToStorage('sales', demoSales);
        saveToStorage('expenses', demoExpenses);
        localStorage.setItem('demoDataInitialized', 'true');
    }
}

// Gestion du tableau de bord
function loadDashboardData() {
    initDemoData();
    
    const sales = getFromStorage('sales');
    const clients = getFromStorage('clients');
    const expenses = getFromStorage('expenses');
    
    // Calcul des métriques
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalSales = sales.length;
    const totalClients = clients.length;
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Mise à jour de l'interface
    const revenueEl = document.getElementById('totalRevenue');
    const salesEl = document.getElementById('totalSales');
    const clientsEl = document.getElementById('totalClients');
    const expensesEl = document.getElementById('totalExpenses');
    
    if (revenueEl) revenueEl.textContent = formatCurrency(totalRevenue);
    if (salesEl) salesEl.textContent = totalSales;
    if (clientsEl) clientsEl.textContent = totalClients;
    if (expensesEl) expensesEl.textContent = formatCurrency(totalExpenses);
    
    // Graphiques
    loadSalesChart(sales);
    loadExpensesChart(expenses);
    
    // Listes récentes
    loadRecentSales(sales);
    loadRecentClients(clients);
}

function loadSalesChart(sales) {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    // Données groupées par mois
    const monthlyData = {};
    sales.forEach(sale => {
        const month = new Date(sale.date).toLocaleString('fr-FR', { month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + sale.amount;
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(monthlyData),
            datasets: [{
                label: 'Ventes (€)',
                data: Object.values(monthlyData),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function loadExpensesChart(expenses) {
    const ctx = document.getElementById('expensesChart');
    if (!ctx) return;
    
    // Données groupées par catégorie
    const categoryData = {};
    expenses.forEach(expense => {
        categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
    });
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: [
                    '#2563eb',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#06b6d4'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function loadRecentSales(sales) {
    const container = document.getElementById('recentSales');
    if (!container) return;
    
    const recentSales = sales.slice(-5).reverse();
    
    if (recentSales.length === 0) {
        container.innerHTML = '<p class="no-data">Aucune vente récente</p>';
        return;
    }
    
    container.innerHTML = recentSales.map(sale => `
        <div class="recent-item">
            <div>
                <strong>${sale.client}</strong><br>
                <small>${sale.product}</small>
            </div>
            <div>${formatCurrency(sale.amount)}</div>
        </div>
    `).join('');
}

function loadRecentClients(clients) {
    const container = document.getElementById('recentClients');
    if (!container) return;
    
    const recentClients = clients.slice(-5).reverse();
    
    if (recentClients.length === 0) {
        container.innerHTML = '<p class="no-data">Aucun nouveau client</p>';
        return;
    }
    
    container.innerHTML = recentClients.map(client => `
        <div class="recent-item">
            <div>
                <strong>${client.name}</strong><br>
                <small>${client.company || client.email}</small>
            </div>
        </div>
    `).join('');
}

// Gestion des ventes
function loadSales() {
    const sales = getFromStorage('sales');
    const tbody = document.getElementById('salesTable');
    
    if (!tbody) return;
    
    if (sales.length === 0) {
        tbody.innerHTML = '<tr class="no-data"><td colspan="5">Aucune vente enregistrée</td></tr>';
        return;
    }
    
    tbody.innerHTML = sales.map(sale => `
        <tr>
            <td>${formatDate(sale.date)}</td>
            <td>${sale.client}</td>
            <td>${sale.product}</td>
            <td>${formatCurrency(sale.amount)}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editSale('${sale.id}')" class="btn-icon btn-edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteSale('${sale.id}')" class="btn-icon btn-delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadClientsForSelect() {
    const clients = getFromStorage('clients');
    const select = document.getElementById('saleClient');
    
    if (!select) return;
    
    select.innerHTML = '<option value="">Sélectionner un client</option>' +
        clients.map(client => `<option value="${client.name}">${client.name}</option>`).join('');
}

let editingSaleId = null;

function openSaleModal(saleId = null) {
    const modal = document.getElementById('saleModal');
    const form = document.getElementById('saleForm');
    const title = document.getElementById('modalTitle');
    
    if (saleId) {
        const sales = getFromStorage('sales');
        const sale = sales.find(s => s.id === saleId);
        
        if (sale) {
            document.getElementById('saleDate').value = sale.date;
            document.getElementById('saleClient').value = sale.client;
            document.getElementById('saleProduct').value = sale.product;
            document.getElementById('saleAmount').value = sale.amount;
            title.textContent = 'Modifier la vente';
            editingSaleId = saleId;
        }
    } else {
        form.reset();
        document.getElementById('saleDate').value = new Date().toISOString().split('T')[0];
        title.textContent = 'Nouvelle vente';
        editingSaleId = null;
    }
    
    modal.classList.add('active');
}

function closeSaleModal() {
    const modal = document.getElementById('saleModal');
    modal.classList.remove('active');
    editingSaleId = null;
}

function editSale(id) {
    openSaleModal(id);
}

function deleteSale(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vente ?')) {
        const sales = getFromStorage('sales');
        const filtered = sales.filter(sale => sale.id !== id);
        saveToStorage('sales', filtered);
        loadSales();
    }
}

// Formulaire de vente
document.addEventListener('DOMContentLoaded', function() {
    const saleForm = document.getElementById('saleForm');
    if (saleForm) {
        saleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(saleForm);
            const saleData = {
                id: editingSaleId || generateId(),
                date: formData.get('date'),
                client: formData.get('client'),
                product: formData.get('product'),
                amount: parseFloat(formData.get('amount'))
            };
            
            const sales = getFromStorage('sales');
            
            if (editingSaleId) {
                const index = sales.findIndex(s => s.id === editingSaleId);
                if (index !== -1) {
                    sales[index] = saleData;
                }
            } else {
                sales.push(saleData);
            }
            
            saveToStorage('sales', sales);
            loadSales();
            closeSaleModal();
        });
    }
});

// Gestion des clients
function loadClients() {
    const clients = getFromStorage('clients');
    const tbody = document.getElementById('clientsTable');
    
    if (!tbody) return;
    
    if (clients.length === 0) {
        tbody.innerHTML = '<tr class="no-data"><td colspan="5">Aucun client enregistré</td></tr>';
        return;
    }
    
    tbody.innerHTML = clients.map(client => `
        <tr>
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone || '-'}</td>
            <td>${client.company || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editClient('${client.id}')" class="btn-icon btn-edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteClient('${client.id}')" class="btn-icon btn-delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

let editingClientId = null;

function openClientModal(clientId = null) {
    const modal = document.getElementById('clientModal');
    const form = document.getElementById('clientForm');
    const title = document.getElementById('modalTitle');
    
    if (clientId) {
        const clients = getFromStorage('clients');
        const client = clients.find(c => c.id === clientId);
        
        if (client) {
            document.getElementById('clientName').value = client.name;
            document.getElementById('clientEmail').value = client.email;
            document.getElementById('clientPhone').value = client.phone || '';
            document.getElementById('clientCompany').value = client.company || '';
            title.textContent = 'Modifier le client';
            editingClientId = clientId;
        }
    } else {
        form.reset();
        title.textContent = 'Nouveau client';
        editingClientId = null;
    }
    
    modal.classList.add('active');
}

function closeClientModal() {
    const modal = document.getElementById('clientModal');
    modal.classList.remove('active');
    editingClientId = null;
}

function editClient(id) {
    openClientModal(id);
}

function deleteClient(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
        const clients = getFromStorage('clients');
        const filtered = clients.filter(client => client.id !== id);
        saveToStorage('clients', filtered);
        loadClients();
    }
}

// Formulaire de client
document.addEventListener('DOMContentLoaded', function() {
    const clientForm = document.getElementById('clientForm');
    if (clientForm) {
        clientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(clientForm);
            const clientData = {
                id: editingClientId || generateId(),
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                company: formData.get('company')
            };
            
            const clients = getFromStorage('clients');
            
            if (editingClientId) {
                const index = clients.findIndex(c => c.id === editingClientId);
                if (index !== -1) {
                    clients[index] = clientData;
                }
            } else {
                clients.push(clientData);
            }
            
            saveToStorage('clients', clients);
            loadClients();
            closeClientModal();
        });
    }
});

// Gestion des dépenses
function loadExpenses() {
    const expenses = getFromStorage('expenses');
    const tbody = document.getElementById('expensesTable');
    
    if (!tbody) return;
    
    if (expenses.length === 0) {
        tbody.innerHTML = '<tr class="no-data"><td colspan="5">Aucune dépense enregistrée</td></tr>';
        return;
    }
    
    tbody.innerHTML = expenses.map(expense => `
        <tr>
            <td>${formatDate(expense.date)}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>${formatCurrency(expense.amount)}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editExpense('${expense.id}')" class="btn-icon btn-edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteExpense('${expense.id}')" class="btn-icon btn-delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

let editingExpenseId = null;

function openExpenseModal(expenseId = null) {
    const modal = document.getElementById('expenseModal');
    const form = document.getElementById('expenseForm');
    const title = document.getElementById('modalTitle');
    
    if (expenseId) {
        const expenses = getFromStorage('expenses');
        const expense = expenses.find(e => e.id === expenseId);
        
        if (expense) {
            document.getElementById('expenseDate').value = expense.date;
            document.getElementById('expenseDescription').value = expense.description;
            document.getElementById('expenseCategory').value = expense.category;
            document.getElementById('expenseAmount').value = expense.amount;
            title.textContent = 'Modifier la dépense';
            editingExpenseId = expenseId;
        }
    } else {
        form.reset();
        document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
        title.textContent = 'Nouvelle dépense';
        editingExpenseId = null;
    }
    
    modal.classList.add('active');
}

function closeExpenseModal() {
    const modal = document.getElementById('expenseModal');
    modal.classList.remove('active');
    editingExpenseId = null;
}

function editExpense(id) {
    openExpenseModal(id);
}

function deleteExpense(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
        const expenses = getFromStorage('expenses');
        const filtered = expenses.filter(expense => expense.id !== id);
        saveToStorage('expenses', filtered);
        loadExpenses();
    }
}

// Formulaire de dépense
document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        expenseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(expenseForm);
            const expenseData = {
                id: editingExpenseId || generateId(),
                date: formData.get('date'),
                description: formData.get('description'),
                category: formData.get('category'),
                amount: parseFloat(formData.get('amount'))
            };
            
            const expenses = getFromStorage('expenses');
            
            if (editingExpenseId) {
                const index = expenses.findIndex(e => e.id === editingExpenseId);
                if (index !== -1) {
                    expenses[index] = expenseData;
                }
            } else {
                expenses.push(expenseData);
            }
            
            saveToStorage('expenses', expenses);
            loadExpenses();
            closeExpenseModal();
        });
    }
});

// Fermetures de modales en cliquant à l'extérieur
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});