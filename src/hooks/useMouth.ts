// Em useMouth
import { useContext } from 'react'
import { TransactionsContext } from '../contexts/TransactionsContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function useMouth() {
  const { transactions } = useContext(TransactionsContext)

  const dateWithTransactions = Array.from(
    new Set(
      transactions.map((transaction) => {
        const transactionDate = new Date(transaction.dateAt)

        // Utilizando 'MMMM yyyy' para formatar o mês por extenso e o ano
        const monthYearString = format(transactionDate, 'MMMM yyyy', {
          locale: ptBR,
        })

        return monthYearString
      }),
    ),
  )

  return dateWithTransactions
}
