import { useContext, useState } from 'react'
import { Header } from '../../components/Header'
import { Summary } from '../../components/Summary'
import { SearchForm } from './components/SearchForm'
import {
  ButtonFilter,
  ButtonIcon,
  ButtonIconPay,
  PriceHighlight,
  TransactionsContainer,
  TransactionsTable,
  WrapperDiv,
} from './style'
import { TransactionsContext } from '../../contexts/TransactionsContext'
import { dateFormatter, priceFormatter } from '../../utils/formatter'
import { FileX, PencilSimple, Receipt, TrashSimple } from 'phosphor-react'
import { EditTransactionModal } from '../../components/EditTransactionModal'
import * as Dialog from '@radix-ui/react-dialog'
import { MouthRow } from '../../components/MouthRow'
export function Transactions() {
  const {
    transactions,
    deleteTransaction,
    filterTransactions,
    originalTransactions,
    updateDebitedTransaction,
  } = useContext(TransactionsContext)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [activeFilter, setActiveFilter] = useState(false)

  async function handleCheckboxChange(id: number) {
    const isSelected = selectedIds.includes(id)

    if (isSelected) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handlePay = async (transactionId: number) => {
    await updateDebitedTransaction(transactionId)
  }

  async function handleFilterClick() {
    // Chame a função filterTransactions com os IDs selecionados
    filterTransactions(selectedIds)
    setActiveFilter(true)
  }

  async function handleClearFilterClick() {
    setSelectedIds([])
    filterTransactions(
      originalTransactions.map((transaction) => transaction.id),
    ) // Exibe todas as transações novamente
    setActiveFilter(false)
  }
  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id)
    } catch (error) {
      console.error('Erro ao excluir transação:', error)
    }
  }

  return (
    <div>
      <Header />
      <Summary />
      <MouthRow />
      <TransactionsContainer>
        <WrapperDiv>
          {selectedIds.length > 0 ? (
            <ButtonFilter
              onClick={
                activeFilter ? handleClearFilterClick : handleFilterClick
              }
            >
              {activeFilter ? 'Limpar Filtro' : 'Filtrar'}
            </ButtonFilter>
          ) : (
            ''
          )}
          <SearchForm />
        </WrapperDiv>

        <TransactionsTable>
          <tbody>
            {transactions.map((response) => {
              return (
                <tr key={response.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(response.id)}
                      onChange={() => handleCheckboxChange(response.id)}
                    />
                  </td>
                  <td width="30%">{response.description}</td>
                  <td>
                    {response.method === 'credit' ? 'Parcelado' : 'Unica'}
                  </td>
                  <td>{response.debited === true ? 'Pago' : 'Pagar'}</td>
                  <td>
                    <PriceHighlight variant={response.type}>
                      {priceFormatter.format(response.price)}
                    </PriceHighlight>
                  </td>
                  <td>{response.category}</td>
                  <td>
                    {dateFormatter.format(
                      new Date(`${response.dateAt}T03:00:00.000Z`),
                    )}
                  </td>
                  <td>
                    <WrapperDiv>
                      <ButtonIconPay
                        onClick={() => handlePay(response.id)}
                        variant={response.debited === true ? 'pay' : 'debit'}
                      >
                        {response.debited === true ? (
                          <FileX size={18} />
                        ) : (
                          <Receipt size={18} />
                        )}
                      </ButtonIconPay>
                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <ButtonIcon variant="edit">
                            <PencilSimple size={18} />
                          </ButtonIcon>
                        </Dialog.Trigger>
                        <EditTransactionModal id={response.id} />
                      </Dialog.Root>
                      <ButtonIcon
                        onClick={() => handleDelete(response.id)}
                        variant="delete"
                      >
                        <TrashSimple size={18} />
                      </ButtonIcon>
                    </WrapperDiv>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </TransactionsTable>
      </TransactionsContainer>
    </div>
  )
}
