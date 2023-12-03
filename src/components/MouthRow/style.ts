import styled from 'styled-components'

export const SummaryContainer = styled.section`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 2rem 1.5rem;

  gap: 2rem;

  h2 {
    font-size: 20px;
    padding: 1rem 0rem;
  }
`
export const WrapperDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 1120px;
  padding-bottom: 15px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 20px; /* roundness of the scroll thumb */
    background: ${(props) =>
      props.theme['gray-600']}; /* color of the tracking area */
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) =>
      props.theme['green-500']}; /* color of the scroll thumb */
    border-radius: 20px; /* roundness of the scroll thumb */
    border: none; /* creates padding around scroll thumb */
  }
`

export const ButtonMouth = styled.button`
  text-align: center;
  text-transform: capitalize;
  flex-shrink: 0;
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
