import * as Dialog from '@radix-ui/react-dialog'
import {
  CloseButton,
  Content,
  Overlay,
  TransactionType,
  TransactionTypeButton,
  TransactionTypeButtonMethod,
  WrapperDiv,
} from './style'
import {
  ArrowCircleDown,
  ArrowCircleUp,
  CreditCard,
  Money,
  X,
} from 'phosphor-react'
import * as z from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { TransactionsContext } from '../../contexts/TransactionsContext'

const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.enum([
    'Salario',
    'Pagamentos',
    'Contas',
    'Compras',
    'Saúde',
    'Lazer',
    'Emergencia',
    'Construção',
    'Transporte',
    'Assinaturas',
    'Mercado',
    'Estudos',
  ]),
  type: z.enum(['income', 'outcome']),
  dateAt: z.string(),
  method: z.enum(['cash', 'credit']),
  quantity: z.number(),
})

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>

export function NewTransactionModal() {
  const { createTransaction } = useContext(TransactionsContext)

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<NewTransactionFormInputs>({
    resolver: zodResolver(newTransactionFormSchema),
  })

  console.log(errors)

  async function NewTransaction(data: NewTransactionFormInputs) {
    const { category, description, price, type, dateAt, method, quantity } =
      data

    await createTransaction({
      description,
      price,
      category,
      method,
      quantity,
      dateAt,
      type,
      createdAt: '',
      debited: false,
    })

    reset()
  }

  return (
    <Dialog.Portal>
      <Overlay />
      <Content>
        <CloseButton>
          <X />
        </CloseButton>
        <Dialog.Title>Nova Transação:</Dialog.Title>
        <form onSubmit={handleSubmit(NewTransaction)}>
          <input
            type="text"
            placeholder="Titulo"
            required
            {...register('description')}
          />
          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <input
                type="number"
                placeholder="Preço"
                required
                step="any"
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                value={field.value}
              />
            )}
          />

          <select {...register('category')}>
            <option value="Compras">Compras</option>
            <option value="Salario">Salário</option>
            <option value="Mercado">Mercado</option>
            <option value="Saúde">Saúde</option>
            <option value="Estudos">Estudos</option>
            <option value="Lazer">Lazer</option>
            <option value="Emergencia">Emergência</option>
            <option value="Construção">Construção</option>
            <option value="Contas">Contas</option>
            <option value="Pagamentos">Pagamentos</option>
            <option value="Transporte">Transporte</option>
            <option value="Assinaturas">Assinaturas</option>
          </select>

          <Controller
            control={control}
            name="method"
            render={({ field }) => {
              return (
                <TransactionType
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <TransactionTypeButtonMethod variant="cash" value="cash">
                    <Money size={24} />
                    Dinheiro
                  </TransactionTypeButtonMethod>
                  <TransactionTypeButtonMethod variant="credit" value="credit">
                    <CreditCard size={24} />
                    Parcelado
                  </TransactionTypeButtonMethod>
                </TransactionType>
              )
            }}
          />

          <WrapperDiv>
            <select {...register('quantity', { valueAsNumber: true })}>
              <option value={1}>1 Vez</option>
              <option value={2}>2 Vezes</option>
              <option value={3}>3 Vezes</option>
              <option value={4}>4 Vezes</option>
              <option value={5}>5 Vezes</option>
              <option value={6}>6 Vezes</option>
              <option value={7}>7 Vezes</option>
              <option value={8}>8 Vezes</option>
              <option value={9}>9 Vezes</option>
              <option value={10}>10 Vezes</option>
              <option value={11}>11 Vezes</option>
              <option value={12}>12 Vezes</option>
              <option value={13}>13 Vezes</option>
              <option value={14}>14 Vezes</option>
              <option value={15}>15 Vezes</option>
              <option value={16}>16 Vezes</option>
              <option value={17}>17 Vezes</option>
              <option value={18}>18 Vezes</option>
              <option value={19}>19 Vezes</option>
              <option value={20}>20 Vezes</option>
              <option value={21}>21 Vezes</option>
              <option value={22}>22 Vezes</option>
              <option value={23}>23 Vezes</option>
              <option value={24}>24 Vezes</option>
            </select>

            <input
              type="date"
              placeholder="XX/XX/XXXX"
              required
              {...register('dateAt')}
            />
            {errors.dateAt && <p>{errors.dateAt.message}</p>}
          </WrapperDiv>

          <Controller
            control={control}
            name="type"
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

          {errors.dateAt && <p>{errors.dateAt.message}</p>}

          <button type="submit" disabled={isSubmitting}>
            Cadastrar
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}
