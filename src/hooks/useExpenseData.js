import { useState, useEffect } from 'react'

// Mock data for demonstration
const mockTransactions = [
  {
    id: '1',
    type: 'expense',
    amount: 45.50,
    category: 'Food & Dining',
    description: 'Lunch at Italian Restaurant',
    date: '2024-01-15',
    createdAt: '2024-01-15T12:30:00Z'
  },
  {
    id: '2',
    type: 'income',
    amount: 3500.00,
    category: 'Salary',
    description: 'Monthly Salary',
    date: '2024-01-01',
    createdAt: '2024-01-01T09:00:00Z'
  },
  {
    id: '3',
    type: 'expense',
    amount: 120.00,
    category: 'Transportation',
    description: 'Gas Station Fill-up',
    date: '2024-01-14',
    createdAt: '2024-01-14T16:45:00Z'
  },
  {
    id: '4',
    type: 'expense',
    amount: 89.99,
    category: 'Shopping',
    description: 'Online Shopping - Electronics',
    date: '2024-01-13',
    createdAt: '2024-01-13T14:20:00Z'
  },
  {
    id: '5',
    type: 'expense',
    amount: 25.00,
    category: 'Entertainment',
    description: 'Movie Tickets',
    date: '2024-01-12',
    createdAt: '2024-01-12T19:30:00Z'
  },
  {
    id: '6',
    type: 'expense',
    amount: 450.00,
    category: 'Bills & Utilities',
    description: 'Monthly Rent',
    date: '2024-01-01',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '7',
    type: 'income',
    amount: 800.00,
    category: 'Freelance',
    description: 'Web Development Project',
    date: '2024-01-10',
    createdAt: '2024-01-10T11:15:00Z'
  },
  {
    id: '8',
    type: 'expense',
    amount: 75.00,
    category: 'Healthcare',
    description: 'Doctor Visit',
    date: '2024-01-08',
    createdAt: '2024-01-08T15:00:00Z'
  },
  {
    id: '9',
    type: 'expense',
    amount: 200.00,
    category: 'Travel',
    description: 'Weekend Trip - Hotel',
    date: '2024-01-06',
    createdAt: '2024-01-06T18:00:00Z'
  },
  {
    id: '10',
    type: 'expense',
    amount: 35.50,
    category: 'Other',
    description: 'Miscellaneous Expenses',
    date: '2024-01-05',
    createdAt: '2024-01-05T13:45:00Z'
  },
  // Previous months data
  {
    id: '11',
    type: 'income',
    amount: 3500.00,
    category: 'Salary',
    description: 'Monthly Salary',
    date: '2023-12-01',
    createdAt: '2023-12-01T09:00:00Z'
  },
  {
    id: '12',
    type: 'expense',
    amount: 450.00,
    category: 'Bills & Utilities',
    description: 'Monthly Rent',
    date: '2023-12-01',
    createdAt: '2023-12-01T10:00:00Z'
  },
  {
    id: '13',
    type: 'expense',
    amount: 320.50,
    category: 'Food & Dining',
    description: 'Groceries & Dining',
    date: '2023-12-15',
    createdAt: '2023-12-15T14:30:00Z'
  },
  {
    id: '14',
    type: 'expense',
    amount: 180.00,
    category: 'Transportation',
    description: 'Monthly Transport Pass',
    date: '2023-12-02',
    createdAt: '2023-12-02T08:15:00Z'
  },
  {
    id: '15',
    type: 'income',
    amount: 3500.00,
    category: 'Salary',
    description: 'Monthly Salary',
    date: '2023-11-01',
    createdAt: '2023-11-01T09:00:00Z'
  },
  {
    id: '16',
    type: 'expense',
    amount: 450.00,
    category: 'Bills & Utilities',
    description: 'Monthly Rent',
    date: '2023-11-01',
    createdAt: '2023-11-01T10:00:00Z'
  }
]

export const useExpenseData = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading from Firebase
    const loadData = async () => {
      setLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Load from localStorage or use mock data
      const savedTransactions = localStorage.getItem('expense-tracker-transactions')
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions))
      } else {
        setTransactions(mockTransactions)
        localStorage.setItem('expense-tracker-transactions', JSON.stringify(mockTransactions))
      }
      
      setLoading(false)
    }

    loadData()
  }, [])

  const addTransaction = async (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    const updatedTransactions = [newTransaction, ...transactions]
    setTransactions(updatedTransactions)
    localStorage.setItem('expense-tracker-transactions', JSON.stringify(updatedTransactions))
    
    return newTransaction
  }

  const updateTransaction = async (id, updates) => {
    const updatedTransactions = transactions.map(transaction =>
      transaction.id === id ? { ...transaction, ...updates } : transaction
    )
    
    setTransactions(updatedTransactions)
    localStorage.setItem('expense-tracker-transactions', JSON.stringify(updatedTransactions))
    
    return updatedTransactions.find(t => t.id === id)
  }

  const deleteTransaction = async (id) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id)
    setTransactions(updatedTransactions)
    localStorage.setItem('expense-tracker-transactions', JSON.stringify(updatedTransactions))
    
    return true
  }

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loading
  }
}
