import * as Dialog from '@radix-ui/react-dialog'
import {
  CloseButton,
  Content,
  Overlay,
  TransactionType,
  TransactionTypeButton,
} from './style'
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react'
import * as z from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect, useState } from 'react'
import {
  Transaction,
  TransactionsContext,
} from '../../contexts/TransactionsContext'

const newTransactionFormSchema = z.object({
  id: z.number(),
  description: z.string(),
  price: z.number(),
  category: z.enum(["Salario", "Pagamentos", "Contas", "Compras", "Saúde", "Lazer", "Emergencia", "Construção", "Transporte", "Assinaturas", "Mercado", "Estudos"]),
  type: z.enum(["income", "outcome"]),
  dateAt: z.string(),
});

type TransactionFormInputs = z.infer<typeof newTransactionFormSchema>;


type Props = {
  id: number
}
export function EditTransactionModal({ id }: Props) {
  const { updateTransaction, getTransactionById } =
    useContext(TransactionsContext)
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<TransactionFormInputs>({
    resolver: zodResolver(newTransactionFormSchema),
  })
  const [transactionDetails, setTransactionDetails] =
    useState<null | Transaction>(null)

  console.log(errors)
  console.log(`passou aqui ${id}`)

  async function EditTransaction(data: TransactionFormInputs) {
    console.log(data)
    const { id, category, description, price, type, dateAt } = data

    await updateTransaction(id, {
      category,
      description,
      price,
      type,
      dateAt,
      method: 'cash', // Valor padrão para method
      quantity: 1, // Valor padrão para quantity
      createdAt: new Date().toISOString(), // Valor padrão para createdAt
      debited: false // Valor padrão para debited
    });

    reset()
  }

  async function fetchTransactionDetailsById(transactionId: number) {
    try {
      const transaction = await getTransactionById(transactionId)
      console.log(transaction?.id)
      console.log(transaction?.description)

      setTransactionDetails(transaction)
      return transaction
    } catch (error) {
      console.error('Error fetching transaction details:', error)
    }
  }

  useEffect(() => {
    async function fetchData() {
      const result = await fetchTransactionDetailsById(id)
      if (result) {
        setTransactionDetails(result)
      }
    }

    fetchData()
  }, [])

  return (
    <Dialog.Portal>
      <Overlay />
      <Content>
        <CloseButton>
          <X />
        </CloseButton>
        <Dialog.Title>Editar Transação:</Dialog.Title>
        <form onSubmit={handleSubmit(EditTransaction)}>
          <input
            type="number"
            defaultValue={transactionDetails?.id}
            {...register('id', { valueAsNumber: true })}
            hidden
          />
          <input
            type="text"
            placeholder="Titulo"
            required
            defaultValue={transactionDetails?.description}
            {...register('description')}
          />
          <input
            type="number"
            placeholder="Preço"
            defaultValue={transactionDetails?.price}
            required
            {...register('price', { valueAsNumber: true })}
          />
          <input
            type="text"
            placeholder="Categoria"
            defaultValue={transactionDetails?.category}
            required
            {...register('category')}
          />

          <input
            type="date"
            defaultValue={transactionDetails?.dateAt || ''}
            required
            {...register('dateAt')}
          />
          {errors.dateAt && <p>{errors.dateAt.message}</p>}

          <Controller
            control={control}
            name="type"
            defaultValue={transactionDetails?.type}
            render={({ field }) => {
              return (
                <TransactionType
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <TransactionTypeButton variant="income" value="income">
                    <ArrowCircleUp size={24} />
                    Entrada
                  </TransactionTypeButton>
                  <TransactionTypeButton variant="outcome" value="outcome">
                    <ArrowCircleDown size={24} />
                    Saída
                  </TransactionTypeButton>
                </TransactionType>
              )
            }}
          />

          <button type="submit" disabled={isSubmitting}>
            Salvar Alterações
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}
