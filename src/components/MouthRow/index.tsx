import { useContext } from 'react'
import { WrapperDiv, ButtonMouth, SummaryContainer } from './style' // Importe seus estilos
import { useMouth } from '../../hooks/useMouth'
import { TransactionsContext } from '../../contexts/TransactionsContext'

export function MouthRow() {
  const { filterByMonth } = useContext(TransactionsContext)
  const dateWithTransactions = useMouth()

  const handleButtonClick = (selectedMonthYear: string) => {
    filterByMonth(selectedMonthYear)
  }

  return (
    <SummaryContainer>
      <h2>Meses com Transações</h2>

      <WrapperDiv>
        {dateWithTransactions.map((date, index) => (
          <ButtonMouth key={index} onClick={() => handleButtonClick(date)}>
            {date}
          </ButtonMouth>
        ))}
      </WrapperDiv>
    </SummaryContainer>
  )
}
