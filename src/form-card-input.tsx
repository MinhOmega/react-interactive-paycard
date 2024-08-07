import React, { useState } from 'react'
import { CardElementsRef, INPUT_TYPES } from './interactive-pay-card'

const currentYear = new Date().getFullYear()
const monthsArr = Array.from({ length: 12 }, (x, i) => {
  const month = i + 1
  return month <= 9 ? '0' + month : month
})
const yearsArr = Array.from({ length: 9 }, (_x, i) => currentYear + i)

interface CreditCardProps {
  cardMonth: string
  cardYear: string
  cardNumberRef?: React.RefObject<HTMLInputElement> | React.RefObject<HTMLLabelElement>
  cardHolderRef?: React.RefObject<HTMLInputElement> | React.RefObject<HTMLLabelElement>
  cardDateRef?: React.RefObject<HTMLSelectElement> | React.RefObject<HTMLLabelElement>
  onUpdateState: (key: INPUT_TYPES, value: any) => void
  onCardInputFocus: (e: any, name: keyof CardElementsRef) => void
  onCardInputBlur: (e: any) => void
  children?: React.ReactNode
}

const FormCardInput: React.FC<CreditCardProps> = ({
  cardMonth,
  cardYear,
  onUpdateState,
  cardNumberRef,
  cardHolderRef,
  cardDateRef,
  onCardInputFocus,
  onCardInputBlur,
  children,
}): JSX.Element => {
  const [cardNumber, setCardNumber] = useState('')

  const handleFormChange = (event: any) => {
    const { name, value } = event.target || {}

    onUpdateState(name, value)
  }

  // TODO: We can improve the regex check with a better approach like in the card component.
  const onCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { value, name } = event.target
    let cardNumber = value
    value = value.replace(/\D/g, '')
    if (/^3[47]\d{0,13}$/.test(value)) {
      cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
    } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
      // diner's club, 14 digits
      cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
    } else if (/^\d{0,16}$/.test(value)) {
      // regular cc number, 16 digits
      cardNumber = value
        .replace(/(\d{4})/, '$1 ')
        .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
        .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
    }

    setCardNumber(cardNumber.trimRight())
    onUpdateState(name as INPUT_TYPES, cardNumber)
  }

  const onCvvFocus = () => {
    onUpdateState(INPUT_TYPES.isCardFlipped, true)
  }

  const onCvvBlur = () => {
    onUpdateState(INPUT_TYPES.isCardFlipped, false)
  }

  return (
    <div className="card-form">
      <div className="card-list">{children}</div>
      <div className="card-form__inner">
        <div className="card-input">
          <label htmlFor="cardNumber" className="card-input__label">
            Card Number
          </label>
          <input
            type="tel"
            name="cardNumber"
            className="card-input__input"
            autoComplete="off"
            onChange={onCardNumberChange}
            maxLength={19}
            ref={cardNumberRef as React.RefObject<HTMLInputElement>}
            onFocus={(e) => onCardInputFocus(e, 'cardNumber')}
            onBlur={onCardInputBlur}
            value={cardNumber}
          />
        </div>

        <div className="card-input">
          <label htmlFor="cardName" className="card-input__label">
            Card Holder
          </label>
          <input
            type="text"
            className="card-input__input"
            autoComplete="off"
            name="cardHolder"
            onChange={handleFormChange}
            ref={cardHolderRef as React.RefObject<HTMLInputElement>}
            onFocus={(e) => onCardInputFocus(e, 'cardHolder')}
            onBlur={onCardInputBlur}
          />
        </div>

        <div className="card-form__row">
          <div className="card-form__col">
            <div className="card-form__group">
              <label htmlFor="cardMonth" className="card-input__label">
                Expiration Date
              </label>
              <select
                className="card-input__input -select"
                value={cardMonth}
                name="cardMonth"
                onChange={handleFormChange}
                ref={cardDateRef as React.RefObject<HTMLSelectElement>}
                onFocus={(e) => onCardInputFocus(e, 'cardDate')}
                onBlur={onCardInputBlur}
              >
                <option value="" disabled>
                  Month
                </option>

                {monthsArr.map((val, index) => (
                  <option key={index} value={val}>
                    {val}
                  </option>
                ))}
              </select>
              <select
                name="cardYear"
                className="card-input__input -select"
                value={cardYear}
                onChange={handleFormChange}
                onFocus={(e) => onCardInputFocus(e, 'cardDate')}
                onBlur={onCardInputBlur}
              >
                <option value="" disabled>
                  Year
                </option>

                {yearsArr.map((val, index) => (
                  <option key={index} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="card-form__col -cvv">
            <div className="card-input">
              <label htmlFor="cardCvv" className="card-input__label">
                CVV
              </label>
              <input
                type="tel"
                className="card-input__input"
                maxLength={4}
                autoComplete="off"
                name="cardCvv"
                onChange={handleFormChange}
                onFocus={onCvvFocus}
                onBlur={onCvvBlur}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormCardInput