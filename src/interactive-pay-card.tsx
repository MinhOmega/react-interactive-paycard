import React, { useCallback, useRef, useState } from 'react'
import Card from './card'
import CForm from './form-card-input'

export enum INPUT_TYPES {
  cardNumber = 'cardNumber',
  cardHolder = 'cardHolder',
  cardMonth = 'cardMonth',
  cardYear = 'cardYear',
  cardCvv = 'cardCvv',
  isCardFlipped = 'isCardFlipped',
}

const initialState = {
  cardNumber: '#### #### #### ####',
  cardHolder: 'FULL NAME',
  cardMonth: '',
  cardYear: '',
  cardCvv: '',
  isCardFlipped: false,
}

export enum FORM_FIELDS {
  cardNumber = 'cardNumber',
  cardHolder = 'cardHolder',
  cardDate = 'cardDate',
  cardCvv = 'cardCvv',
}

export enum CARD_ELEMENT_TYPES {
  cardNumber = 'cardNumber',
  cardHolder = 'cardHolder',
  cardDate = 'cardDate',
}

export type CardElementsRef = {
  cardNumber: React.RefObject<HTMLLabelElement>
  cardHolder: React.RefObject<HTMLLabelElement>
  cardDate: React.RefObject<HTMLLabelElement>
}

export type CardState = {
  [key in INPUT_TYPES]: key extends INPUT_TYPES.isCardFlipped ? boolean : string
}

/**
 * InteractivePayCard component
 *
 * @returns {JSX.Element} Rendered InteractivePayCard component
 */
const InteractivePayCard = (): JSX.Element => {
  const [state, setState] = useState<CardState>(initialState)
  const [currentFocusedElm, setCurrentFocusedElm] = useState<React.RefObject<HTMLLabelElement> | undefined>()

  /**
   * Updates state values
   *
   * @param {keyof typeof initialState} keyName - The key of the state value to update
   * @param {string | null} value - The new value for the state value
   */
  const updateStateValues = useCallback(
    (keyName: keyof typeof initialState, value: string | null): void => {
      setState((prevState) => ({
        ...prevState,
        [keyName]: value || initialState[keyName],
      }))
    },
    [state]
  )

  // References for the Form Inputs used to focus corresponding inputs.
  const formFieldsRefObj: Record<keyof typeof FORM_FIELDS, React.RefObject<HTMLLabelElement>> = {
    cardNumber: useRef<HTMLLabelElement>(null),
    cardHolder: useRef<HTMLLabelElement>(null),
    cardDate: useRef<HTMLLabelElement>(null),
    cardCvv: useRef<HTMLLabelElement>(null),
  }

  /**
   * Focuses the form field corresponding to the provided key
   *
   * @param {string} key - The key of the form field to focus
   */
  const focusFormFieldByKey = useCallback((key: keyof typeof FORM_FIELDS): void => {
    formFieldsRefObj[key].current?.focus()
  }, [])

  // This are the references for the Card DIV elements.
  const cardElementsRef: CardElementsRef = {
    cardNumber: useRef<HTMLLabelElement>(null),
    cardHolder: useRef<HTMLLabelElement>(null),
    cardDate: useRef<HTMLLabelElement>(null),
  }

  /**
   * Sets the current focused element to the provided ref
   *
   * @param {React.MouseEvent<HTMLLabelElement>} _event - The click event
   * @param {keyof typeof cardElementsRef} inputName - The name of the input element
   */
  const onCardFormInputFocus = (_event: React.MouseEvent<HTMLLabelElement>, inputName: keyof CardElementsRef): void => {
    const refByName = cardElementsRef[inputName]
    setCurrentFocusedElm(refByName)
  }

  /**
   * Sets the current focused element to null
   */
  const onCardInputBlur = useCallback((): void => {
    setCurrentFocusedElm(undefined)
  }, [])

  return (
    <div className="min-h-screen flex p-12 md:flex-col md:flex-wrap md:p-4">
      <CForm
        cardMonth={state.cardMonth}
        cardYear={state.cardYear}
        onUpdateState={updateStateValues}
        cardNumberRef={formFieldsRefObj.cardNumber}
        cardHolderRef={formFieldsRefObj.cardHolder}
        cardDateRef={formFieldsRefObj.cardDate}
        onCardInputFocus={onCardFormInputFocus}
        onCardInputBlur={onCardInputBlur}
      >
        <Card
          cardNumber={state.cardNumber}
          cardHolder={state.cardHolder}
          cardMonth={state.cardMonth}
          cardYear={state.cardYear}
          cardCvv={state.cardCvv}
          isCardFlipped={state.isCardFlipped}
          currentFocusedElm={currentFocusedElm}
          onCardElementClick={focusFormFieldByKey}
          cardNumberRef={cardElementsRef.cardNumber}
          cardHolderRef={cardElementsRef.cardHolder}
          cardDateRef={cardElementsRef.cardDate}
        />
      </CForm>
    </div>
  )
}

export default InteractivePayCard
