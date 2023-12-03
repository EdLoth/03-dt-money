import styled from 'styled-components'

export const TransactionsContainer = styled.main`
  width: 100%;
  max-width: 1320px;
  margin: 0rem auto 2rem;
  padding: 0 1.5rem;
`

export const TransactionsTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
  margin-top: 1.5rem;

  td {
    padding: 1.5rem 2rem;
    background: ${(props) => props.theme['gray-700']};

    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }

    &:last-child {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }
`

interface ButtonTypeProps {
  variant: 'edit' | 'delete'
}

export const WrapperDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`

export const ButtonIcon = styled.button<ButtonTypeProps>`
  padding: 10px;
  display: flex;
  outline: none;
  align-items: center;
  box-shadow: none;
  justify-content: center;
  margin: 0;
  border-radius: 8px;
  border: none;
  background-color: ${(props) =>
    props.variant === 'edit'
      ? props.theme['green-300']
      : props.variant === 'delete'
      ? props.theme['red-300']
      : 'initial'};
  cursor: pointer;
  filter: brightness(100%);
  transition: ease-in 0.2s;

  &:hover {
    filter: brightness(50%);
  }
`

interface ButtonTypePayProps {
  variant: 'pay' | 'debit'
}

export const ButtonIconPay = styled.button<ButtonTypePayProps>`
  padding: 10px;
  display: flex;
  outline: none;
  align-items: center;
  box-shadow: none;
  justify-content: center;
  margin: 0;
  border-radius: 8px;
  border: none;
  background-color: ${(props) =>
    props.variant === 'debit' ? props.theme.cash : props.theme.credit};
  cursor: pointer;
  filter: brightness(100%);
  transition: ease-in 0.2s;

  &:hover {
    filter: brightness(50%);
  }
`

export const ButtonFilter = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.75;
  width: 150px;

  border: 0;
  padding: 1rem;
  background: transparent;
  border: 1px solid ${(props) => props.theme['green-300']};
  color: ${(props) => props.theme['green-300']};
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: ${(props) => props.theme['green-500']};
    border-color: ${(props) => props.theme['green-500']};
    color: ${(props) => props.theme.white};
    transition:
      background-color 0.2s,
      color 0.2s,
      border-color 0.2s;
  }
`

interface PriceHighlightProps {
  variant: 'income' | 'outcome'
}

export const PriceHighlight = styled.span<PriceHighlightProps>`
  color: ${(props) =>
    props.variant === 'income'
      ? props.theme['green-300']
      : props.theme['red-300']};
`
