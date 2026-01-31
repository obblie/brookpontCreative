// CD Journal Application - Main JavaScript File

class CDJournal {
    constructor() {
        this.currentYear = new Date().getFullYear();
        this.currentMonth = new Date().getMonth(); // 0-based (0 = January)
        this.data = this.loadData();
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.convertInputsToGLFormat();
        this.loadCurrentMonth();
        this.updateUI();
        this.setupCharts();
        this.populateGLSelects();
    }

    convertInputsToGLFormat() {
        // Convert all input fields to include GL account selection
        const allInputs = document.querySelectorAll('.bs-input, .pl-input');
        
        allInputs.forEach(input => {
            // Skip if already converted (has a parent with input-controls class)
            if (input.parentElement.classList.contains('input-controls')) {
                return;
            }
            
            // Create the controls container
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'input-controls';
            
            // Create the GL select
            const glSelect = document.createElement('select');
            glSelect.className = 'gl-select';
            glSelect.setAttribute('data-account', input.getAttribute('data-account'));
            glSelect.innerHTML = '<option value="">Select GL Account</option>';
            
            // Insert the controls container before the input
            input.parentElement.insertBefore(controlsDiv, input);
            
            // Move input into controls container and add select
            controlsDiv.appendChild(glSelect);
            controlsDiv.appendChild(input);
        });
    }

    // Data Management
    loadData() {
        const savedData = localStorage.getItem('cdJournalData');
        if (savedData) {
            return JSON.parse(savedData);
        }
        
        // Initialize default data structure
        return {
            glAccounts: this.getDefaultGLAccounts(),
            [this.currentYear]: {
                balanceSheet: {},
                profitLoss: {},
                journalEntries: {}
            }
        };
    }

    getDefaultGLAccounts() {
        return {
            // Assets (1000-1999)
            '1010': { number: '1010', name: 'Cash - Operating', type: 'assets', description: 'Primary operating bank account' },
            '1020': { number: '1020', name: 'Cash - Savings', type: 'assets', description: 'Savings account' },
            '1200': { number: '1200', name: 'Accounts Receivable', type: 'assets', description: 'Money owed by customers' },
            '1300': { number: '1300', name: 'Inventory', type: 'assets', description: 'Products held for sale' },
            '1400': { number: '1400', name: 'Prepaid Expenses', type: 'assets', description: 'Prepaid insurance, rent, etc.' },
            '1500': { number: '1500', name: 'Equipment', type: 'assets', description: 'Office and business equipment' },
            '1510': { number: '1510', name: 'Accumulated Depreciation - Equipment', type: 'assets', description: 'Contra asset account for equipment' },
            
            // Liabilities (2000-2999)
            '2010': { number: '2010', name: 'Accounts Payable', type: 'liabilities', description: 'Money owed to suppliers' },
            '2020': { number: '2020', name: 'Credit Card Payable', type: 'liabilities', description: 'Credit card balances' },
            '2100': { number: '2100', name: 'Short-term Loans', type: 'liabilities', description: 'Loans due within one year' },
            '2200': { number: '2200', name: 'Long-term Debt', type: 'liabilities', description: 'Loans due after one year' },
            
            // Equity (3000-3999)
            '3010': { number: '3010', name: 'Owner\'s Equity', type: 'equity', description: 'Owner\'s investment in business' },
            '3020': { number: '3020', name: 'Retained Earnings', type: 'equity', description: 'Accumulated profits' },
            
            // Revenue (4000-4999)
            '4010': { number: '4010', name: 'Sales Revenue', type: 'revenue', description: 'Revenue from product sales' },
            '4020': { number: '4020', name: 'Service Revenue', type: 'revenue', description: 'Revenue from services' },
            '4030': { number: '4030', name: 'Other Revenue', type: 'revenue', description: 'Miscellaneous income' },
            
            // Expenses (5000-9999)
            '5010': { number: '5010', name: 'Cost of Goods Sold', type: 'expenses', description: 'Direct cost of products sold' },
            '6010': { number: '6010', name: 'Salaries & Wages', type: 'expenses', description: 'Employee compensation' },
            '6020': { number: '6020', name: 'Rent Expense', type: 'expenses', description: 'Office/facility rent' },
            '6030': { number: '6030', name: 'Utilities', type: 'expenses', description: 'Electricity, water, gas' },
            '6040': { number: '6040', name: 'Marketing & Advertising', type: 'expenses', description: 'Promotional expenses' },
            '6050': { number: '6050', name: 'Insurance', type: 'expenses', description: 'Business insurance premiums' },
            '6060': { number: '6060', name: 'Professional Services', type: 'expenses', description: 'Legal, accounting fees' },
            '6070': { number: '6070', name: 'Depreciation Expense', type: 'expenses', description: 'Asset depreciation' },
            '6080': { number: '6080', name: 'Interest Expense', type: 'expenses', description: 'Interest on loans' },
            '6090': { number: '6090', name: 'Other Operating Expenses', type: 'expenses', description: 'Miscellaneous expenses' }
        };
    }

    saveData() {
        localStorage.setItem('cdJournalData', JSON.stringify(this.data));
        this.showToast('Data saved successfully', 'success');
    }

    getMonthKey() {
        return `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}`;
    }

    getCurrentYearData() {
        if (!this.data[this.currentYear]) {
            this.data[this.currentYear] = {
                balanceSheet: {},
                profitLoss: {}
            };
        }
        return this.data[this.currentYear];
    }

    getCurrentMonthData(type) {
        const yearData = this.getCurrentYearData();
        const monthKey = this.getMonthKey();
        
        if (!yearData[type][monthKey]) {
            yearData[type][monthKey] = {};
        }
        
        return yearData[type][monthKey];
    }

    // Event Listeners
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Month navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.changeMonth(-1);
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.changeMonth(1);
        });

        document.getElementById('prevMonthPL').addEventListener('click', () => {
            this.changeMonth(-1);
        });
        
        document.getElementById('nextMonthPL').addEventListener('click', () => {
            this.changeMonth(1);
        });

        // Journal Entries month navigation
        document.getElementById('prevMonthJournal').addEventListener('click', () => {
            this.changeMonth(-1);
        });
        
        document.getElementById('nextMonthJournal').addEventListener('click', () => {
            this.changeMonth(1);
        });

        // Journal entry management
        document.getElementById('addJournalEntry').addEventListener('click', () => {
            this.addJournalEntry();
        });

        document.getElementById('balanceBroughtForward').addEventListener('input', () => {
            this.updateJournalCalculations();
        });

        document.getElementById('citizenStatementDeposit').addEventListener('input', () => {
            this.updateJournalCalculations();
        });

        // Year selector
        document.getElementById('yearSelector').addEventListener('change', (e) => {
            this.currentYear = parseInt(e.target.value);
            this.loadCurrentMonth();
            this.updateUI();
            this.updateCharts();
        });

        // Balance Sheet inputs
        document.querySelectorAll('.bs-input').forEach(input => {
            input.addEventListener('input', () => {
                this.updateBalanceSheet();
                this.saveCurrentMonthData('balanceSheet');
            });
        });

        // P&L inputs
        document.querySelectorAll('.pl-input').forEach(input => {
            input.addEventListener('input', () => {
                this.updateProfitLoss();
                this.saveCurrentMonthData('profitLoss');
            });
        });

        // Export/Import
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        // GL Account management
        document.getElementById('addGLAccount').addEventListener('click', () => {
            this.openGLAccountModal();
        });

        document.getElementById('glAccountForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveGLAccount();
        });

        document.getElementById('cancelModal').addEventListener('click', () => {
            this.closeGLAccountModal();
        });

        document.querySelector('.close').addEventListener('click', () => {
            this.closeGLAccountModal();
        });

        document.getElementById('glSearchInput').addEventListener('input', (e) => {
            this.filterGLAccounts(e.target.value);
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('glAccountModal');
            if (e.target === modal) {
                this.closeGLAccountModal();
            }
        });
    }

    // UI Management
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Update charts if on summary tab
        if (tabName === 'summary') {
            this.updateSummary();
            this.updateCharts();
        }

        // Load GL accounts if on GL accounts tab
        if (tabName === 'gl-accounts') {
            this.loadGLAccountsUI();
            this.populateGLSelects();
        }

        // Load journal entries if on journal entries tab
        if (tabName === 'journal-entries') {
            this.loadJournalEntries();
        }
    }

    changeMonth(direction) {
        this.currentMonth += direction;
        
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }

        // Update year selector
        document.getElementById('yearSelector').value = this.currentYear;
        
        this.loadCurrentMonth();
        this.updateUI();
    }

    updateUI() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const monthDisplay = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        document.getElementById('currentMonth').textContent = monthDisplay;
        document.getElementById('currentMonthPL').textContent = monthDisplay;
        document.getElementById('currentMonthJournal').textContent = monthDisplay;
        document.getElementById('summaryYear').textContent = this.currentYear;
    }

    loadCurrentMonth() {
        // Load Balance Sheet data
        const bsData = this.getCurrentMonthData('balanceSheet');
        document.querySelectorAll('.bs-input').forEach(input => {
            const account = input.dataset.account;
            const data = bsData[account];
            
            if (data) {
                // Handle both old format (number) and new format (object)
                input.value = typeof data === 'object' ? data.amount : data;
                
                // Set GL account if available
                const glSelect = input.parentElement.querySelector('.gl-select');
                if (glSelect && typeof data === 'object' && data.glAccount) {
                    glSelect.value = data.glAccount;
                }
            } else {
                input.value = '';
                const glSelect = input.parentElement.querySelector('.gl-select');
                if (glSelect) glSelect.value = '';
            }
        });

        // Load P&L data
        const plData = this.getCurrentMonthData('profitLoss');
        document.querySelectorAll('.pl-input').forEach(input => {
            const account = input.dataset.account;
            const data = plData[account];
            
            if (data) {
                // Handle both old format (number) and new format (object)
                input.value = typeof data === 'object' ? data.amount : data;
                
                // Set GL account if available
                const glSelect = input.parentElement.querySelector('.gl-select');
                if (glSelect && typeof data === 'object' && data.glAccount) {
                    glSelect.value = data.glAccount;
                }
            } else {
                input.value = '';
                const glSelect = input.parentElement.querySelector('.gl-select');
                if (glSelect) glSelect.value = '';
            }
        });

        this.updateBalanceSheet();
        this.updateProfitLoss();
    }

    saveCurrentMonthData(type) {
        const monthData = this.getCurrentMonthData(type);
        const inputs = type === 'balanceSheet' ? '.bs-input' : '.pl-input';
        
        document.querySelectorAll(inputs).forEach(input => {
            const account = input.dataset.account;
            const value = parseFloat(input.value) || 0;
            const glSelect = input.parentElement.querySelector('.gl-select');
            const glAccount = glSelect ? glSelect.value : '';
            
            if (value !== 0) {
                monthData[account] = {
                    amount: value,
                    glAccount: glAccount
                };
            } else {
                delete monthData[account];
            }
        });

        this.saveData();
    }

    // Balance Sheet Calculations
    updateBalanceSheet() {
        // Current Assets
        const currentAssets = this.sumAccounts([
            'cash', 'accounts-receivable', 'inventory', 'prepaid-expenses'
        ]);
        document.getElementById('total-current-assets').textContent = this.formatCurrency(currentAssets);

        // Fixed Assets
        const ppe = this.getAccountValue('ppe');
        const accDepreciation = this.getAccountValue('accumulated-depreciation');
        const intangibleAssets = this.getAccountValue('intangible-assets');
        const fixedAssets = ppe - accDepreciation + intangibleAssets;
        document.getElementById('total-fixed-assets').textContent = this.formatCurrency(fixedAssets);

        // Total Assets
        const totalAssets = currentAssets + fixedAssets;
        document.getElementById('total-assets').textContent = this.formatCurrency(totalAssets);

        // Current Liabilities
        const currentLiabilities = this.sumAccounts([
            'accounts-payable', 'short-term-debt', 'accrued-expenses'
        ]);
        document.getElementById('total-current-liabilities').textContent = this.formatCurrency(currentLiabilities);

        // Long-term Liabilities
        const ltLiabilities = this.sumAccounts([
            'long-term-debt', 'other-lt-liabilities'
        ]);
        document.getElementById('total-lt-liabilities').textContent = this.formatCurrency(ltLiabilities);

        // Total Equity
        const totalEquity = this.sumAccounts([
            'owners-equity', 'retained-earnings'
        ]);
        document.getElementById('total-equity').textContent = this.formatCurrency(totalEquity);

        // Total Liabilities & Equity
        const totalLiabilitiesEquity = currentLiabilities + ltLiabilities + totalEquity;
        document.getElementById('total-liabilities-equity').textContent = this.formatCurrency(totalLiabilitiesEquity);

        // Balance Check
        this.updateBalanceCheck(totalAssets, totalLiabilitiesEquity);
    }

    updateBalanceCheck(assets, liabilitiesEquity) {
        const balanceStatus = document.getElementById('balance-status');
        const difference = Math.abs(assets - liabilitiesEquity);
        
        if (difference < 0.01) {
            balanceStatus.className = 'balance-status balanced';
            balanceStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Balance Sheet is balanced</span>';
        } else {
            balanceStatus.className = 'balance-status';
            balanceStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>Balance Sheet does not balance (Difference: $${this.formatCurrency(difference)})</span>`;
        }
    }

    // Profit & Loss Calculations
    updateProfitLoss() {
        // Total Revenue
        const totalRevenue = this.sumAccounts([
            'sales-revenue', 'service-revenue', 'other-revenue'
        ], '.pl-input');
        document.getElementById('total-revenue').textContent = this.formatCurrency(totalRevenue);

        // Total COGS
        const totalCogs = this.sumAccounts([
            'direct-materials', 'direct-labor', 'manufacturing-overhead'
        ], '.pl-input');
        document.getElementById('total-cogs').textContent = this.formatCurrency(totalCogs);

        // Gross Profit
        const grossProfit = totalRevenue - totalCogs;
        document.getElementById('gross-profit').textContent = this.formatCurrency(grossProfit);

        // Total Operating Expenses
        const totalOpExpenses = this.sumAccounts([
            'salaries-wages', 'rent', 'utilities', 'marketing', 'insurance',
            'professional-services', 'depreciation', 'other-operating'
        ], '.pl-input');
        document.getElementById('total-operating-expenses').textContent = this.formatCurrency(totalOpExpenses);

        // Operating Income
        const operatingIncome = grossProfit - totalOpExpenses;
        document.getElementById('operating-income').textContent = this.formatCurrency(operatingIncome);

        // Net Other Income
        const interestIncome = this.getAccountValue('interest-income', '.pl-input');
        const interestExpense = this.getAccountValue('interest-expense', '.pl-input');
        const otherIncome = this.getAccountValue('other-income', '.pl-input');
        const netOtherIncome = interestIncome - interestExpense + otherIncome;
        document.getElementById('net-other-income').textContent = this.formatCurrency(netOtherIncome);

        // Net Income
        const netIncome = operatingIncome + netOtherIncome;
        const netIncomeElement = document.getElementById('net-income');
        netIncomeElement.textContent = this.formatCurrency(netIncome);
        
        // Update net income styling
        const netIncomeContainer = netIncomeElement.closest('.net-income');
        netIncomeContainer.classList.toggle('negative', netIncome < 0);
    }

    // Helper Functions
    getAccountValue(account, selector = '.bs-input') {
        const input = document.querySelector(`${selector}[data-account="${account}"]`);
        return parseFloat(input?.value) || 0;
    }

    sumAccounts(accounts, selector = '.bs-input') {
        return accounts.reduce((sum, account) => {
            return sum + this.getAccountValue(account, selector);
        }, 0);
    }

    // Helper to get value from data that might be in old or new format
    getDataValue(data, account) {
        if (!data[account]) return 0;
        return typeof data[account] === 'object' ? data[account].amount : data[account];
    }

    formatCurrency(amount) {
        return Math.abs(amount).toFixed(2);
    }

    // Summary and Charts
    updateSummary() {
        const yearData = this.getCurrentYearData();
        let ytdRevenue = 0;
        let ytdExpenses = 0;
        let ytdNetIncome = 0;
        let monthsWithData = 0;

        // Calculate YTD totals
        for (let month = 0; month < 12; month++) {
            const monthKey = `${this.currentYear}-${String(month + 1).padStart(2, '0')}`;
            const plData = yearData.profitLoss[monthKey] || {};

            const monthRevenue = this.getDataValue(plData, 'sales-revenue') + 
                               this.getDataValue(plData, 'service-revenue') + 
                               this.getDataValue(plData, 'other-revenue');

            const monthExpenses = this.getDataValue(plData, 'direct-materials') +
                                this.getDataValue(plData, 'direct-labor') +
                                this.getDataValue(plData, 'manufacturing-overhead') +
                                this.getDataValue(plData, 'salaries-wages') +
                                this.getDataValue(plData, 'rent') +
                                this.getDataValue(plData, 'utilities') +
                                this.getDataValue(plData, 'marketing') +
                                this.getDataValue(plData, 'insurance') +
                                this.getDataValue(plData, 'professional-services') +
                                this.getDataValue(plData, 'depreciation') +
                                this.getDataValue(plData, 'other-operating') +
                                this.getDataValue(plData, 'interest-expense');

            if (monthRevenue > 0 || monthExpenses > 0) {
                monthsWithData++;
            }

            ytdRevenue += monthRevenue;
            ytdExpenses += monthExpenses;
        }

        ytdNetIncome = ytdRevenue - ytdExpenses;
        const avgMonthlyRevenue = monthsWithData > 0 ? ytdRevenue / monthsWithData : 0;

        // Update summary metrics
        document.getElementById('ytd-revenue').textContent = `$${this.formatCurrency(ytdRevenue)}`;
        document.getElementById('ytd-expenses').textContent = `$${this.formatCurrency(ytdExpenses)}`;
        
        const ytdNetIncomeElement = document.getElementById('ytd-net-income');
        ytdNetIncomeElement.textContent = `$${this.formatCurrency(ytdNetIncome)}`;
        ytdNetIncomeElement.className = `metric-value ${ytdNetIncome >= 0 ? 'positive' : 'negative'}`;
        
        document.getElementById('avg-monthly-revenue').textContent = `$${this.formatCurrency(avgMonthlyRevenue)}`;

        // Update monthly summary table
        this.updateMonthlySummaryTable();
    }

    updateMonthlySummaryTable() {
        const tbody = document.getElementById('monthly-summary-body');
        tbody.innerHTML = '';

        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const yearData = this.getCurrentYearData();
        let cumulativeIncome = 0;

        for (let month = 0; month < 12; month++) {
            const monthKey = `${this.currentYear}-${String(month + 1).padStart(2, '0')}`;
            const plData = yearData.profitLoss[monthKey] || {};

            const revenue = this.getDataValue(plData, 'sales-revenue') + 
                           this.getDataValue(plData, 'service-revenue') + 
                           this.getDataValue(plData, 'other-revenue');

            const expenses = this.getDataValue(plData, 'direct-materials') +
                           this.getDataValue(plData, 'direct-labor') +
                           this.getDataValue(plData, 'manufacturing-overhead') +
                           this.getDataValue(plData, 'salaries-wages') +
                           this.getDataValue(plData, 'rent') +
                           this.getDataValue(plData, 'utilities') +
                           this.getDataValue(plData, 'marketing') +
                           this.getDataValue(plData, 'insurance') +
                           this.getDataValue(plData, 'professional-services') +
                           this.getDataValue(plData, 'depreciation') +
                           this.getDataValue(plData, 'other-operating') +
                           this.getDataValue(plData, 'interest-expense');

            const netIncome = revenue - expenses;
            cumulativeIncome += netIncome;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${monthNames[month]}</td>
                <td>$${this.formatCurrency(revenue)}</td>
                <td>$${this.formatCurrency(expenses)}</td>
                <td class="${netIncome >= 0 ? 'positive' : 'negative'}">$${this.formatCurrency(netIncome)}</td>
                <td class="${cumulativeIncome >= 0 ? 'positive' : 'negative'}">$${this.formatCurrency(cumulativeIncome)}</td>
            `;
            tbody.appendChild(row);
        }
    }

    setupCharts() {
        // Setup Chart.js charts for the summary page
        this.setupRevenueChart();
        this.setupExpenseChart();
        this.setupNetIncomeChart();
    }

    setupRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Monthly Revenue',
                    data: [],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    setupExpenseChart() {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        this.charts.expense = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Monthly Expenses',
                    data: [],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    setupNetIncomeChart() {
        const ctx = document.getElementById('netIncomeChart').getContext('2d');
        this.charts.netIncome = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Net Income',
                    data: [],
                    backgroundColor: function(context) {
                        const value = context.parsed.y;
                        return value >= 0 ? '#27ae60' : '#e74c3c';
                    },
                    borderColor: function(context) {
                        const value = context.parsed.y;
                        return value >= 0 ? '#229954' : '#c0392b';
                    },
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    updateCharts() {
        const yearData = this.getCurrentYearData();
        const revenueData = [];
        const expenseData = [];
        const netIncomeData = [];

        for (let month = 0; month < 12; month++) {
            const monthKey = `${this.currentYear}-${String(month + 1).padStart(2, '0')}`;
            const plData = yearData.profitLoss[monthKey] || {};

            const revenue = this.getDataValue(plData, 'sales-revenue') + 
                           this.getDataValue(plData, 'service-revenue') + 
                           this.getDataValue(plData, 'other-revenue');

            const expenses = this.getDataValue(plData, 'direct-materials') +
                           this.getDataValue(plData, 'direct-labor') +
                           this.getDataValue(plData, 'manufacturing-overhead') +
                           this.getDataValue(plData, 'salaries-wages') +
                           this.getDataValue(plData, 'rent') +
                           this.getDataValue(plData, 'utilities') +
                           this.getDataValue(plData, 'marketing') +
                           this.getDataValue(plData, 'insurance') +
                           this.getDataValue(plData, 'professional-services') +
                           this.getDataValue(plData, 'depreciation') +
                           this.getDataValue(plData, 'other-operating') +
                           this.getDataValue(plData, 'interest-expense');

            revenueData.push(revenue);
            expenseData.push(expenses);
            netIncomeData.push(revenue - expenses);
        }

        // Update chart data
        if (this.charts.revenue) {
            this.charts.revenue.data.datasets[0].data = revenueData;
            this.charts.revenue.update();
        }

        if (this.charts.expense) {
            this.charts.expense.data.datasets[0].data = expenseData;
            this.charts.expense.update();
        }

        if (this.charts.netIncome) {
            this.charts.netIncome.data.datasets[0].data = netIncomeData;
            this.charts.netIncome.update();
        }
    }

    // Import/Export Functions
    exportData() {
        const dataToExport = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: this.data
        };

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cd-journal-${this.currentYear}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Data exported successfully', 'success');
    }

    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (importedData.data) {
                    this.data = importedData.data;
                    this.saveData();
                    this.loadCurrentMonth();
                    this.updateUI();
                    this.showToast('Data imported successfully', 'success');
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                this.showToast('Error importing data: ' + error.message, 'error');
            }
        };

        reader.readAsText(file);
    }

    // Journal Entry Management
    loadJournalEntries() {
        const journalData = this.getCurrentMonthData('journalEntries');
        const tbody = document.getElementById('journalTableBody');
        tbody.innerHTML = '';

        // Load balance brought forward
        document.getElementById('balanceBroughtForward').value = journalData.balanceBroughtForward || '';

        // Load citizen statement deposit
        document.getElementById('citizenStatementDeposit').value = journalData.citizenStatementDeposit || '';

        // Load journal entries
        if (journalData.entries && journalData.entries.length > 0) {
            journalData.entries.forEach((entry, index) => {
                this.addJournalEntryRow(entry, index + 1);
            });
        } else {
            // Add initial empty rows
            for (let i = 1; i <= 5; i++) {
                this.addJournalEntryRow({}, i);
            }
        }

        this.updateJournalCalculations();
    }

    addJournalEntry() {
        const tbody = document.getElementById('journalTableBody');
        const lineNumber = tbody.children.length + 1;
        this.addJournalEntryRow({}, lineNumber);
        this.saveJournalEntries();
    }

    addJournalEntryRow(entry = {}, lineNumber) {
        const tbody = document.getElementById('journalTableBody');
        const row = document.createElement('tr');
        row.className = 'journal-entry-row';
        
        row.innerHTML = `
            <td>${lineNumber}</td>
            <td><input type="date" class="date-input" value="${entry.date || ''}" data-field="date"></td>
            <td><input type="text" class="payee-input" value="${entry.payee || ''}" data-field="payee" placeholder="Payee"></td>
            <td><input type="text" class="check-input" value="${entry.checkNumber || ''}" data-field="checkNumber" placeholder="Ck #"></td>
            <td><input type="number" step="0.01" class="amount-input" value="${entry.checkAmount || ''}" data-field="checkAmount"></td>
            <td class="horizontal-proof">$0.00</td>
            <td class="book-balance">$0.00</td>
            <td><input type="date" class="date-input" value="${entry.depositDate || ''}" data-field="depositDate"></td>
            <td><input type="number" step="0.01" class="amount-input" value="${entry.otherPLReceipts || ''}" data-field="otherPLReceipts"></td>
            <td><input type="number" step="0.01" class="amount-input" value="${entry.arDepositAmount || ''}" data-field="arDepositAmount"></td>
            <td><input type="text" class="explanation-input" value="${entry.plDepositExplanation || ''}" data-field="plDepositExplanation" placeholder="P&L Explanation"></td>
            <td><input type="number" step="0.01" class="amount-input" value="${entry.balanceSheetDeposit || ''}" data-field="balanceSheetDeposit"></td>
            <td><input type="text" class="explanation-input" value="${entry.bsDepositExplanation || ''}" data-field="bsDepositExplanation" placeholder="BS Explanation"></td>
            <!-- P&L Distribution Columns -->
            <td><input type="text" class="gl-number-input" value="${entry.gl1 || ''}" data-field="gl1" placeholder="GL#"></td>
            <td><input type="text" class="gl-name-input" value="${entry.glName1 || ''}" data-field="glName1" placeholder="Name"></td>
            <td><input type="text" class="gl-number-input" value="${entry.gl2 || ''}" data-field="gl2" placeholder="GL#"></td>
            <td><input type="text" class="gl-name-input" value="${entry.glName2 || ''}" data-field="glName2" placeholder="Name"></td>
            <td><input type="text" class="gl-number-input" value="${entry.gl3 || ''}" data-field="gl3" placeholder="GL#"></td>
            <td><input type="text" class="gl-name-input" value="${entry.glName3 || ''}" data-field="glName3" placeholder="Name"></td>
            <td><input type="text" class="gl-number-input" value="${entry.gl4 || ''}" data-field="gl4" placeholder="GL#"></td>
            <td><input type="text" class="gl-name-input" value="${entry.glName4 || ''}" data-field="glName4" placeholder="Name"></td>
            <td><input type="text" class="gl-number-input" value="${entry.gl5 || ''}" data-field="gl5" placeholder="GL#"></td>
            <td><input type="text" class="gl-name-input" value="${entry.glName5 || ''}" data-field="glName5" placeholder="Name"></td>
            <td><input type="text" class="gl-number-input" value="${entry.gl6 || ''}" data-field="gl6" placeholder="GL#"></td>
            <td><input type="text" class="gl-name-input" value="${entry.glName6 || ''}" data-field="glName6" placeholder="Name"></td>
            <td><input type="text" class="gl-number-input" value="${entry.gl7 || ''}" data-field="gl7" placeholder="GL#"></td>
            <td><input type="text" class="gl-name-input" value="${entry.glName7 || ''}" data-field="glName7" placeholder="Name"></td>
            <td><button class="delete-entry-btn" onclick="app.deleteJournalEntry(${lineNumber - 1})">×</button></td>
        `;

        tbody.appendChild(row);

        // Add event listeners for real-time calculations
        row.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                this.updateJournalCalculations();
                this.saveJournalEntries();
            });
        });
    }

    deleteJournalEntry(index) {
        const tbody = document.getElementById('journalTableBody');
        if (tbody.children.length > 1) {
            tbody.removeChild(tbody.children[index]);
            this.renumberJournalEntries();
            this.updateJournalCalculations();
            this.saveJournalEntries();
        }
    }

    renumberJournalEntries() {
        const tbody = document.getElementById('journalTableBody');
        Array.from(tbody.children).forEach((row, index) => {
            row.children[0].textContent = index + 1;
            // Update delete button onclick
            const deleteBtn = row.querySelector('.delete-entry-btn');
            if (deleteBtn) {
                deleteBtn.onclick = () => app.deleteJournalEntry(index);
            }
        });
    }

    updateJournalCalculations() {
        const tbody = document.getElementById('journalTableBody');
        const balanceBroughtForward = parseFloat(document.getElementById('balanceBroughtForward').value) || 0;
        const citizenStatementDeposit = parseFloat(document.getElementById('citizenStatementDeposit').value) || 0;

        let runningBalance = balanceBroughtForward;
        let totalCkAmount = 0;
        let totalOtherReceipts = 0;
        let totalARDeposit = 0;
        let totalPLDeposit = 0;
        let totalBSDeposit = 0;

        // Calculate running balances and totals
        Array.from(tbody.children).forEach(row => {
            const checkAmount = parseFloat(row.querySelector('[data-field="checkAmount"]').value) || 0;
            const otherPLReceipts = parseFloat(row.querySelector('[data-field="otherPLReceipts"]').value) || 0;
            const arDepositAmount = parseFloat(row.querySelector('[data-field="arDepositAmount"]').value) || 0;
            const balanceSheetDeposit = parseFloat(row.querySelector('[data-field="balanceSheetDeposit"]').value) || 0;

            // Calculate horizontal proof (should equal check amount)
            const horizontalProof = otherPLReceipts + arDepositAmount + balanceSheetDeposit;
            row.querySelector('.horizontal-proof').textContent = `$${horizontalProof.toFixed(2)}`;

            // Update running balance
            runningBalance = runningBalance - checkAmount + otherPLReceipts + arDepositAmount + balanceSheetDeposit;
            row.querySelector('.book-balance').textContent = `$${runningBalance.toFixed(2)}`;

            // Add to totals
            totalCkAmount += checkAmount;
            totalOtherReceipts += otherPLReceipts;
            totalARDeposit += arDepositAmount;
            totalBSDeposit += balanceSheetDeposit;
        });

        // Update footer totals
        document.getElementById('totalCkAmount').textContent = `$${totalCkAmount.toFixed(2)}`;
        document.getElementById('finalBookBalance').textContent = `$${runningBalance.toFixed(2)}`;
        document.getElementById('otherReceipts').textContent = `$${totalOtherReceipts.toFixed(2)}`;
        document.getElementById('arDepositTotal').textContent = `$${totalARDeposit.toFixed(2)}`;
        document.getElementById('bsDepositTotal').textContent = `$${totalBSDeposit.toFixed(2)}`;

        // Calculate balance check (should be zero if balanced)
        const totalDistribution = totalOtherReceipts + totalARDeposit + totalBSDeposit;
        const balanceCheck = totalCkAmount - totalDistribution;
        const balanceCheckCell = document.getElementById('balanceCheck');
        balanceCheckCell.textContent = `$${balanceCheck.toFixed(2)}`;
        
        if (Math.abs(balanceCheck) < 0.01) {
            balanceCheckCell.classList.add('balanced');
        } else {
            balanceCheckCell.classList.remove('balanced');
        }

        document.getElementById('totalDistribution').textContent = `$${totalDistribution.toFixed(2)}`;

        // Calculate DIF (difference between citizen statement and book balance)
        const dif = citizenStatementDeposit - runningBalance;
        document.getElementById('difAmount').value = dif.toFixed(2);
    }

    saveJournalEntries() {
        const journalData = this.getCurrentMonthData('journalEntries');
        const tbody = document.getElementById('journalTableBody');
        
        // Save balance brought forward and citizen statement
        journalData.balanceBroughtForward = parseFloat(document.getElementById('balanceBroughtForward').value) || 0;
        journalData.citizenStatementDeposit = parseFloat(document.getElementById('citizenStatementDeposit').value) || 0;

        // Save all entries
        journalData.entries = [];
        Array.from(tbody.children).forEach(row => {
            const entry = {};
            row.querySelectorAll('[data-field]').forEach(input => {
                const field = input.dataset.field;
                const value = input.value;
                if (value) {
                    entry[field] = input.type === 'number' ? parseFloat(value) : value;
                }
            });
            
            // Only save entries that have some data
            if (Object.keys(entry).length > 0) {
                journalData.entries.push(entry);
            }
        });

        this.saveData();
    }

    // GL Account Management
    openGLAccountModal(accountNumber = null) {
        const modal = document.getElementById('glAccountModal');
        const form = document.getElementById('glAccountForm');
        const title = document.getElementById('modalTitle');
        
        form.reset();
        
        if (accountNumber) {
            // Editing existing account
            const account = this.data.glAccounts[accountNumber];
            title.textContent = 'Edit GL Account';
            document.getElementById('accountNumber').value = account.number;
            document.getElementById('accountName').value = account.name;
            document.getElementById('accountType').value = account.type;
            document.getElementById('accountDescription').value = account.description || '';
            document.getElementById('accountNumber').readOnly = true;
        } else {
            // Adding new account
            title.textContent = 'Add GL Account';
            document.getElementById('accountNumber').readOnly = false;
        }
        
        modal.style.display = 'block';
    }

    closeGLAccountModal() {
        const modal = document.getElementById('glAccountModal');
        modal.style.display = 'none';
    }

    saveGLAccount() {
        const form = document.getElementById('glAccountForm');
        const formData = new FormData(form);
        
        const accountNumber = formData.get('accountNumber');
        const accountName = formData.get('accountName');
        const accountType = formData.get('accountType');
        const accountDescription = formData.get('accountDescription');

        // Validate account number format
        if (!/^\d{4}$/.test(accountNumber)) {
            this.showToast('Account number must be 4 digits', 'error');
            return;
        }

        // Validate account number range based on type
        const num = parseInt(accountNumber);
        const validRanges = {
            'assets': [1000, 1999],
            'liabilities': [2000, 2999],
            'equity': [3000, 3999],
            'revenue': [4000, 4999],
            'expenses': [5000, 9999]
        };

        if (!validRanges[accountType] || num < validRanges[accountType][0] || num > validRanges[accountType][1]) {
            this.showToast(`Account number must be in range ${validRanges[accountType][0]}-${validRanges[accountType][1]} for ${accountType}`, 'error');
            return;
        }

        // Check for duplicate account numbers (except when editing)
        if (!this.data.glAccounts[accountNumber] || document.getElementById('modalTitle').textContent === 'Edit GL Account') {
            this.data.glAccounts[accountNumber] = {
                number: accountNumber,
                name: accountName,
                type: accountType,
                description: accountDescription
            };

            this.saveData();
            this.loadGLAccountsUI();
            this.populateGLSelects();
            this.closeGLAccountModal();
            this.showToast('GL Account saved successfully', 'success');
        } else {
            this.showToast('Account number already exists', 'error');
        }
    }

    deleteGLAccount(accountNumber) {
        if (confirm(`Are you sure you want to delete account ${accountNumber}?`)) {
            delete this.data.glAccounts[accountNumber];
            this.saveData();
            this.loadGLAccountsUI();
            this.populateGLSelects();
            this.showToast('GL Account deleted successfully', 'success');
        }
    }

    loadGLAccountsUI() {
        if (!this.data.glAccounts) {
            this.data.glAccounts = this.getDefaultGLAccounts();
        }

        const sections = {
            'assets': document.getElementById('assets-gl-list'),
            'liabilities': document.getElementById('liabilities-gl-list'),
            'equity': document.getElementById('equity-gl-list'),
            'revenue': document.getElementById('revenue-gl-list'),
            'expenses': document.getElementById('expenses-gl-list')
        };

        // Clear existing content
        Object.values(sections).forEach(section => {
            section.innerHTML = '';
        });

        // Populate GL accounts by type
        Object.values(this.data.glAccounts).forEach(account => {
            const accountElement = this.createGLAccountElement(account);
            if (sections[account.type]) {
                sections[account.type].appendChild(accountElement);
            }
        });
    }

    createGLAccountElement(account) {
        const div = document.createElement('div');
        div.className = 'gl-account-item';
        div.innerHTML = `
            <div class="gl-account-info">
                <div class="gl-account-number">${account.number}</div>
                <div class="gl-account-name">${account.name}</div>
            </div>
            <div class="gl-account-actions">
                <button class="edit-btn" onclick="app.openGLAccountModal('${account.number}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="app.deleteGLAccount('${account.number}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return div;
    }

    populateGLSelects() {
        const selects = document.querySelectorAll('.gl-select');
        
        selects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select GL Account</option>';
            
            // Sort accounts by number
            const sortedAccounts = Object.values(this.data.glAccounts).sort((a, b) => a.number.localeCompare(b.number));
            
            sortedAccounts.forEach(account => {
                const option = document.createElement('option');
                option.value = account.number;
                option.textContent = `${account.number} - ${account.name}`;
                select.appendChild(option);
            });
            
            // Restore previous selection
            select.value = currentValue;
        });
    }

    filterGLAccounts(searchTerm) {
        const accountItems = document.querySelectorAll('.gl-account-item');
        const term = searchTerm.toLowerCase();
        
        accountItems.forEach(item => {
            const number = item.querySelector('.gl-account-number').textContent.toLowerCase();
            const name = item.querySelector('.gl-account-name').textContent.toLowerCase();
            
            if (number.includes(term) || name.includes(term)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Utility Functions
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Initialize the application when the DOM is loaded
let app; // Global reference for modal callbacks
document.addEventListener('DOMContentLoaded', () => {
    app = new CDJournal();
});
