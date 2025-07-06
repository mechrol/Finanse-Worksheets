export const translations = {
  pl: {
    // Navigation & Branding
    appName: 'Kontrola Wydatków',
    navigation: {
      dashboard: 'Panel główny',
      transactions: 'Transakcje',
      add: 'Dodaj wydatek',
      analytics: 'Analityka',
      worksheets: 'Arkusze',
      checklists: 'Listy zadań',
      farm: 'Księga rolnicza',
      more: 'Więcej',
      additionalFeatures: 'Dodatkowe funkcje'
    },

    // Dashboard
    dashboard: {
      title: 'Przegląd wydatków',
      monthlyOverview: 'Przegląd miesięczny',
      totalSpent: 'Łącznie wydano',
      income: 'Przychody',
      remaining: 'Pozostało',
      topSpendingCategories: 'Najwyższe kategorie wydatków',
      recentTransactions: 'Ostatnie transakcje',
      spendingInsights: 'Analiza wydatków',
      noExpenses: 'Brak wydatków w tym miesiącu',
      noTransactions: 'Brak transakcji',
      addTransactionsPrompt: 'Dodaj transakcje, aby zobaczyć analizę wydatków',
      insights: {
        topCategory: 'Główna kategoria',
        dailyAverage: 'Średnia dzienna',
        savingsRate: 'Stopa oszczędności',
        thisMonth: 'W tym miesiącu',
        ofIncomeSaved: 'dochodu zaoszczędzone',
        noData: 'Brak danych'
      }
    },

    // Categories
    categories: {
      'Food & Dining': 'Jedzenie i restauracje',
      'Transportation': 'Transport',
      'Shopping': 'Zakupy',
      'Entertainment': 'Rozrywka',
      'Bills & Utilities': 'Rachunki i media',
      'Healthcare': 'Opieka zdrowotna',
      'Travel': 'Podróże',
      'Other': 'Inne',
      'Salary': 'Pensja',
      'Freelance': 'Freelancing',
      'Investment': 'Inwestycje',
      'Seeds & Plants': 'Nasiona i rośliny',
      'Equipment': 'Sprzęt',
      'Fuel': 'Paliwo',
      'Labor': 'Praca',
      'Fertilizers': 'Nawozy',
      'Pesticides': 'Pestycydy',
      'Feed': 'Pasza',
      'Veterinary': 'Weterynarz',
      'Maintenance': 'Konserwacja',
      'Insurance': 'Ubezpieczenie'
    },

    // Transaction Form
    transactionForm: {
      title: 'Dodaj nową transakcję',
      description: 'Śledź swoje wydatki i przychody',
      type: 'Typ',
      expense: 'Wydatek',
      income: 'Przychód',
      amount: 'Kwota',
      amountPlaceholder: 'Wprowadź kwotę',
      category: 'Kategoria',
      selectCategory: 'Wybierz kategorię',
      description: 'Opis',
      descriptionPlaceholder: 'Opisz transakcję',
      date: 'Data',
      addTransaction: 'Dodaj transakcję',
      adding: 'Dodawanie...',
      success: 'Transakcja została dodana pomyślnie!',
      error: 'Błąd podczas dodawania transakcji'
    },

    // Transaction List
    transactionList: {
      title: 'Historia transakcji',
      subtitle: 'Zarządzaj swoimi wydatkami i przychodami',
      searchPlaceholder: 'Szukaj transakcji...',
      filterAll: 'Wszystkie',
      filterExpenses: 'Wydatki',
      filterIncome: 'Przychody',
      sortNewest: 'Najnowsze',
      sortOldest: 'Najstarsze',
      sortHighest: 'Najwyższe',
      sortLowest: 'Najniższe',
      noTransactions: 'Nie znaleziono transakcji',
      noTransactionsDesc: 'Dodaj swoją pierwszą transakcję, aby rozpocząć śledzenie',
      edit: 'Edytuj',
      delete: 'Usuń',
      confirmDelete: 'Czy na pewno chcesz usunąć tę transakcję?',
      cancel: 'Anuluj',
      deleteSuccess: 'Transakcja została usunięta',
      deleteError: 'Błąd podczas usuwania transakcji'
    },

    // Analytics
    analytics: {
      title: 'Analityka finansowa',
      subtitle: 'Szczegółowe raporty i trendy wydatków',
      monthlyTrends: 'Trendy miesięczne',
      categoryBreakdown: 'Podział według kategorii',
      incomeVsExpenses: 'Przychody vs Wydatki',
      savingsOverTime: 'Oszczędności w czasie',
      topCategories: 'Najwyższe kategorie',
      monthlyComparison: 'Porównanie miesięczne',
      noData: 'Brak danych do wyświetlenia',
      addTransactions: 'Dodaj transakcje, aby zobaczyć analitykę'
    },

    // Worksheets
    worksheets: {
      title: 'Arkusze finansowe',
      subtitle: 'Planowanie budżetu i cele finansowe',
      budgetPlanner: 'Planowanie budżetu',
      expenseTracker: 'Śledzenie wydatków',
      savingsGoals: 'Cele oszczędnościowe',
      monthlyBudget: 'Budżet miesięczny',
      setBudget: 'Ustaw budżet',
      budgetLimit: 'Limit budżetu',
      spent: 'Wydano',
      remaining: 'Pozostało',
      overBudget: 'Przekroczono budżet',
      onTrack: 'Na dobrej drodze'
    },

    // Checklists
    checklists: {
      title: 'Listy zadań finansowych',
      subtitle: 'Organizuj swoje cele finansowe',
      monthlyTasks: 'Zadania miesięczne',
      financialGoals: 'Cele finansowe',
      addTask: 'Dodaj zadanie',
      taskPlaceholder: 'Wprowadź nowe zadanie...',
      completed: 'Ukończone',
      pending: 'Oczekujące',
      noTasks: 'Brak zadań',
      addFirstTask: 'Dodaj swoje pierwsze zadanie finansowe'
    },

    // Farm Ledger
    farmLedger: {
      title: 'Księga rolnicza',
      subtitle: 'Specjalistyczne śledzenie wydatków rolniczych',
      cropExpenses: 'Wydatki na uprawy',
      livestockExpenses: 'Wydatki na zwierzęta',
      equipmentExpenses: 'Wydatki na sprzęt',
      totalFarmExpenses: 'Łączne wydatki rolnicze',
      addFarmExpense: 'Dodaj wydatek rolniczy',
      farmCategories: 'Kategorie rolnicze',
      seasonalBreakdown: 'Podział sezonowy',
      profitability: 'Rentowność'
    },

    // Authentication
    auth: {
      welcomeBack: 'Witaj ponownie',
      createAccount: 'Utwórz konto',
      resetPassword: 'Resetuj hasło',
      signInSubtitle: 'Zaloguj się do swojego konta, aby kontynuować',
      registerSubtitle: 'Dołącz do nas i zacznij śledzić swoje wydatki',
      resetSubtitle: 'Wprowadź swój email, aby otrzymać instrukcje resetowania',
      fullName: 'Imię i nazwisko',
      fullNamePlaceholder: 'Wprowadź swoje imię i nazwisko',
      email: 'Adres email',
      emailPlaceholder: 'Wprowadź swój email',
      password: 'Hasło',
      passwordPlaceholder: 'Wprowadź swoje hasło',
      confirmPassword: 'Potwierdź hasło',
      confirmPasswordPlaceholder: 'Potwierdź swoje hasło',
      signIn: 'Zaloguj się',
      signUp: 'Zarejestruj się',
      sendResetEmail: 'Wyślij email resetujący',
      forgotPassword: 'Zapomniałeś hasła?',
      noAccount: 'Nie masz konta?',
      hasAccount: 'Masz już konto?',
      rememberPassword: 'Pamiętasz hasło?',
      signOut: 'Wyloguj się',
      loading: 'Ładowanie...',
      features: {
        smartAnalytics: {
          title: 'Inteligentna analityka',
          description: 'Śledź wzorce wydatków z inteligentnymi spostrzeżeniami'
        },
        securePrivate: {
          title: 'Bezpieczne i prywatne',
          description: 'Bezpieczeństwo na poziomie bankowym dla Twoich danych finansowych'
        },
        realtimeSync: {
          title: 'Synchronizacja w czasie rzeczywistym',
          description: 'Dostęp do danych w każdym miejscu i czasie'
        }
      },
      tagline: 'Przejmij kontrolę nad swoją',
      taglineHighlight: 'przyszłością finansową',
      description: 'Dołącz do tysięcy użytkowników, którzy zmienili swoje nawyki finansowe dzięki naszej kompleksowej platformie śledzenia wydatków i budżetowania.'
    },

    // User Interface
    ui: {
      user: 'Użytkownik',
      close: 'Zamknij',
      save: 'Zapisz',
      cancel: 'Anuluj',
      delete: 'Usuń',
      edit: 'Edytuj',
      add: 'Dodaj',
      search: 'Szukaj',
      filter: 'Filtruj',
      sort: 'Sortuj',
      loading: 'Ładowanie...',
      error: 'Błąd',
      success: 'Sukces',
      warning: 'Ostrzeżenie',
      info: 'Informacja',
      confirm: 'Potwierdź',
      yes: 'Tak',
      no: 'Nie'
    },

    // Months
    months: {
      january: 'Styczeń',
      february: 'Luty',
      march: 'Marzec',
      april: 'Kwiecień',
      may: 'Maj',
      june: 'Czerwiec',
      july: 'Lipiec',
      august: 'Sierpień',
      september: 'Wrzesień',
      october: 'Październik',
      november: 'Listopad',
      december: 'Grudzień'
    },

    // Affiliate
    affiliate: {
      earnMoney: 'Zarabiaj pieniądze online',
      joinProgram: 'Dołącz do programu partnerskiego',
      learnMore: 'Dowiedz się więcej'
    }
  },

  en: {
    // Navigation & Branding
    appName: 'SpendTracker',
    navigation: {
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      add: 'Add Expense',
      analytics: 'Analytics',
      worksheets: 'Worksheets',
      checklists: 'Checklists',
      farm: 'Farm Ledger',
      more: 'More',
      additionalFeatures: 'Additional Features'
    },

    // Dashboard
    dashboard: {
      title: 'Spending Overview',
      monthlyOverview: 'Monthly Overview',
      totalSpent: 'Total Spent',
      income: 'Income',
      remaining: 'Remaining',
      topSpendingCategories: 'Top Spending Categories',
      recentTransactions: 'Recent Transactions',
      spendingInsights: 'Spending Insights',
      noExpenses: 'No expenses this month',
      noTransactions: 'No transactions yet',
      addTransactionsPrompt: 'Add some transactions to see your spending insights',
      insights: {
        topCategory: 'Top Category',
        dailyAverage: 'Daily Average',
        savingsRate: 'Savings Rate',
        thisMonth: 'This month',
        ofIncomeSaved: 'Of income saved',
        noData: 'No data'
      }
    },

    // Categories
    categories: {
      'Food & Dining': 'Food & Dining',
      'Transportation': 'Transportation',
      'Shopping': 'Shopping',
      'Entertainment': 'Entertainment',
      'Bills & Utilities': 'Bills & Utilities',
      'Healthcare': 'Healthcare',
      'Travel': 'Travel',
      'Other': 'Other',
      'Salary': 'Salary',
      'Freelance': 'Freelance',
      'Investment': 'Investment',
      'Seeds & Plants': 'Seeds & Plants',
      'Equipment': 'Equipment',
      'Fuel': 'Fuel',
      'Labor': 'Labor',
      'Fertilizers': 'Fertilizers',
      'Pesticides': 'Pesticides',
      'Feed': 'Feed',
      'Veterinary': 'Veterinary',
      'Maintenance': 'Maintenance',
      'Insurance': 'Insurance'
    },

    // Transaction Form
    transactionForm: {
      title: 'Add New Transaction',
      description: 'Track your expenses and income',
      type: 'Type',
      expense: 'Expense',
      income: 'Income',
      amount: 'Amount',
      amountPlaceholder: 'Enter amount',
      category: 'Category',
      selectCategory: 'Select category',
      description: 'Description',
      descriptionPlaceholder: 'Describe the transaction',
      date: 'Date',
      addTransaction: 'Add Transaction',
      adding: 'Adding...',
      success: 'Transaction added successfully!',
      error: 'Error adding transaction'
    },

    // Transaction List
    transactionList: {
      title: 'Transaction History',
      subtitle: 'Manage your expenses and income',
      searchPlaceholder: 'Search transactions...',
      filterAll: 'All',
      filterExpenses: 'Expenses',
      filterIncome: 'Income',
      sortNewest: 'Newest',
      sortOldest: 'Oldest',
      sortHighest: 'Highest',
      sortLowest: 'Lowest',
      noTransactions: 'No transactions found',
      noTransactionsDesc: 'Add your first transaction to start tracking',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this transaction?',
      cancel: 'Cancel',
      deleteSuccess: 'Transaction deleted successfully',
      deleteError: 'Error deleting transaction'
    },

    // Analytics
    analytics: {
      title: 'Financial Analytics',
      subtitle: 'Detailed reports and spending trends',
      monthlyTrends: 'Monthly Trends',
      categoryBreakdown: 'Category Breakdown',
      incomeVsExpenses: 'Income vs Expenses',
      savingsOverTime: 'Savings Over Time',
      topCategories: 'Top Categories',
      monthlyComparison: 'Monthly Comparison',
      noData: 'No data to display',
      addTransactions: 'Add transactions to see analytics'
    },

    // Worksheets
    worksheets: {
      title: 'Financial Worksheets',
      subtitle: 'Budget planning and financial goals',
      budgetPlanner: 'Budget Planner',
      expenseTracker: 'Expense Tracker',
      savingsGoals: 'Savings Goals',
      monthlyBudget: 'Monthly Budget',
      setBudget: 'Set Budget',
      budgetLimit: 'Budget Limit',
      spent: 'Spent',
      remaining: 'Remaining',
      overBudget: 'Over Budget',
      onTrack: 'On Track'
    },

    // Checklists
    checklists: {
      title: 'Financial Checklists',
      subtitle: 'Organize your financial goals',
      monthlyTasks: 'Monthly Tasks',
      financialGoals: 'Financial Goals',
      addTask: 'Add Task',
      taskPlaceholder: 'Enter new task...',
      completed: 'Completed',
      pending: 'Pending',
      noTasks: 'No tasks yet',
      addFirstTask: 'Add your first financial task'
    },

    // Farm Ledger
    farmLedger: {
      title: 'Farm Ledger',
      subtitle: 'Specialized tracking for agricultural expenses',
      cropExpenses: 'Crop Expenses',
      livestockExpenses: 'Livestock Expenses',
      equipmentExpenses: 'Equipment Expenses',
      totalFarmExpenses: 'Total Farm Expenses',
      addFarmExpense: 'Add Farm Expense',
      farmCategories: 'Farm Categories',
      seasonalBreakdown: 'Seasonal Breakdown',
      profitability: 'Profitability'
    },

    // Authentication
    auth: {
      welcomeBack: 'Welcome Back',
      createAccount: 'Create Account',
      resetPassword: 'Reset Password',
      signInSubtitle: 'Sign in to your account to continue',
      registerSubtitle: 'Join us and start tracking your expenses',
      resetSubtitle: 'Enter your email to receive reset instructions',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      email: 'Email Address',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      sendResetEmail: 'Send Reset Email',
      forgotPassword: 'Forgot your password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      rememberPassword: 'Remember your password?',
      signOut: 'Sign Out',
      loading: 'Loading...',
      features: {
        smartAnalytics: {
          title: 'Smart Analytics',
          description: 'Track spending patterns with intelligent insights'
        },
        securePrivate: {
          title: 'Secure & Private',
          description: 'Bank-level security for your financial data'
        },
        realtimeSync: {
          title: 'Real-time Sync',
          description: 'Access your data anywhere, anytime'
        }
      },
      tagline: 'Take Control of Your',
      taglineHighlight: 'Financial Future',
      description: 'Join thousands of users who have transformed their financial habits with our comprehensive expense tracking and budgeting platform.'
    },

    // User Interface
    ui: {
      user: 'User',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No'
    },

    // Months
    months: {
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September',
      october: 'October',
      november: 'November',
      december: 'December'
    },

    // Affiliate
    affiliate: {
      earnMoney: 'Earn Money Online',
      joinProgram: 'Join Affiliate Program',
      learnMore: 'Learn More'
    }
  }
}

export const useTranslation = (language = 'pl') => {
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        // Fallback to English if Polish translation is missing
        value = translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object') {
            value = value[fallbackKey]
          } else {
            return key // Return key if no translation found
          }
        }
        break
      }
    }
    
    return value || key
  }

  return { t }
}
