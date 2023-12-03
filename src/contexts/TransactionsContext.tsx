import { ReactNode, createContext, useState, useEffect } from 'react'
import { api } from '../lib/axios'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface Transaction {
  id: number
  description: string
  method: 'cash' | 'credit'
  type: 'income' | 'outcome'
  price: number
  qunatity: string
  category: string
  createdAt: string
  dateAt: string
  debited: boolean
}

interface TransactionInput {
  description: string
  method: 'cash' | 'credit'
  type: 'income' | 'outcome'
  price: number
  quantity: number
  category:
    | 'Salario'
    | 'Pagamentos'
    | 'Contas'
    | 'Compras'
    | 'Saúde'
    | 'Lazer'
    | 'Emergencia'
    | 'Construção'
    | 'Transporte'
    | 'Assinaturas'
    | 'Mercado'
    | 'Estudos'
  createdAt: string
  dateAt: string
  debited: boolean
}

interface TransactionsContextType {
  transactions: Transaction[]
  originalTransactions: Transaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: TransactionInput) => Promise<void>
  deleteTransaction: (id: number) => Promise<void>
  getTransactionById: (id: number) => Promise<Transaction | null>
  updateTransaction: (id: number, data: TransactionInput) => Promise<void>
  updateDebitedTransaction: (id: number) => Promise<void>
  filterTransactions: (selectedIds: number[]) => void
  filterByMonth: (selectedMonthYear: string) => void
}

interface TransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionsContextType)

export function TransactionProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  async function createTransaction(data: TransactionInput) {
    const {
      category,
      description,
      price,
      type,
      dateAt,
      method,
      quantity,
      debited,
    } = data

    // Inicializa a variável como um array vazio do tipo Transaction
    const newTransactions: Transaction[] = []

    if (method === 'credit' && quantity > 1) {
      const baseDate = new Date(dateAt)

      for (let i = 0; i < quantity; i++) {
        const newDate = new Date(baseDate)
        newDate.setMonth(baseDate.getMonth() + i)

        const response = await api.post<Transaction>('transactions', {
          category,
          description,
          price: price / quantity,
          type,
          createdAt: new Date().toISOString(),
          dateAt: newDate.toISOString().split('T')[0], // Ajusta para manter apenas a parte da data
          method,
          quantity: 1,
          debited: debited || false,
        })

        newTransactions.push(response.data)
      }
    } else {
      const response = await api.post<Transaction>('transactions', {
        category,
        description,
        price,
        type,
        createdAt: new Date().toISOString(),
        dateAt,
        method,
        quantity,
        debited: debited || false,
      })

      newTransactions.push(response.data)
    }

    // Atualiza o estado com todas as transações criadas
    setTransactions((state) => [...newTransactions, ...state])
  }

  const [originalTransactions, setOriginalTransactions] = useState<
    Transaction[]
  >([])

  async function fetchTransactions(query?: string) {
    const params: { [key: string]: string | boolean } = {
      _sort: 'dateAt',
      _order: 'desc',
    }

    if (query) {
      params.debited = false
      params.q = query
    }

    const response = await api.get('transactions', {
      params,
    })

    const newTransactions = response.data
    setTransactions(newTransactions)
    setOriginalTransactions(newTransactions)
  }

  function filterTransactions(selectedIds: number[]) {
    const filteredData = originalTransactions.filter((transaction) =>
      selectedIds.includes(transaction.id),
    )
    setTransactions(filteredData)
  }

  async function filterByMonth(selectedMonthYear: string) {
    const filteredData = originalTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.dateAt)

      // Utilizando 'MMMM yyyy' para formatar o mês por extenso e o ano
      const transactionMonthYearString = format(transactionDate, 'MMMM yyyy', {
        locale: ptBR,
      })

      return (
        transactionMonthYearString === selectedMonthYear && !transaction.debited
      )
    })

    setTransactions(filteredData)
  }

  async function deleteTransaction(id: number) {
    await api.delete(`transactions/${id}`)

    setTransactions((state) =>
      state.filter((transaction) => transaction.id !== id),
    )
  }

  async function getTransactionById(id: number): Promise<Transaction | null> {
    try {
      const response = await api.get(`transactions/${id}`)
      return response.data
    } catch (error) {
      console.error('Erro ao obter transação por ID:', error)
      return null
    }
  }

  async function updateTransaction(id: number, data: TransactionInput) {
    try {
      const response = await api.put(`transactions/${id}`, data)
      // Atualiza a transação localmente após a atualização bem-sucedida
      setTransactions((state) =>
        state.map((transaction) =>
          transaction.id === id ? response.data : transaction,
        ),
      )
    } catch (error) {
      console.error('Erro ao atualizar transação:', error)
    }
  }

  async function updateDebitedTransaction(id: number) {
    try {
      const targetTransaction = transactions.find(
        (transaction) => transaction.id === id,
      )

      if (targetTransaction) {
        const updatedData = {
          ...targetTransaction,
          debited: !targetTransaction.debited,
        }

        const response = await api.put(`transactions/${id}`, updatedData)

        // Atualiza a transação localmente após a atualização bem-sucedida
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction.id === id ? response.data : transaction,
          ),
        )

        // Atualiza a transação no estado original, se necessário
        setOriginalTransactions((prevOriginalTransactions) =>
          prevOriginalTransactions.map((transaction) =>
            transaction.id === id ? response.data : transaction,
          ),
        )
      }
    } catch (error) {
      console.error('Erro ao atualizar transação:', error)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createTransaction,
        deleteTransaction,
        getTransactionById,
        updateTransaction,
        updateDebitedTransaction,
        filterTransactions,
        originalTransactions,
        filterByMonth,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
