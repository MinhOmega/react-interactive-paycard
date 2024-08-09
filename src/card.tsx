import { useEffect, useMemo, useState } from 'react'
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group'
import './styles.scss'
import { FORM_FIELDS } from './interactive-pay-card'

type CardType = 'amex' | 'diners' | 'discover' | 'mastercard' | 'troy' | 'unionpay' | 'visa'

type ImagesCardType = Record<CardType, string>

const imagesCardType: ImagesCardType = {
  amex: 'https://github.com/user-attachments/assets/8c6a945e-82d7-43bd-a649-addeb547bd2c',
  diners: 'https://github.com/user-attachments/assets/e7aa1d25-f24a-4099-a7b3-3fd78a3a625b',
  discover: 'https://github.com/user-attachments/assets/5e6645dc-c981-4f56-a6d1-a188441544fb',
  mastercard: 'https://github.com/user-attachments/assets/dccecfa5-f9bc-48a1-bb36-a20c3855493e',
  troy: 'https://github.com/user-attachments/assets/123f224a-99d6-40fb-8803-651fc3a23728',
  unionpay: 'https://github.com/user-attachments/assets/1b3b8eae-46e6-452c-bed1-f1a4320c58a5',
  visa: 'https://github.com/user-attachments/assets/ab3ac91f-ca1c-471e-bce1-c68e3053e383',
}

/**
 * Map of card backgrounds by card index.
 *
 * @type {Record<number, string>}
 */
const cardBackgrounds: Record<number, string> = {
  1: 'https://github.com/user-attachments/assets/1fe78b35-3611-4219-91e1-78057b065d6b',
  2: 'https://github.com/user-attachments/assets/078ad1e1-8feb-423c-ba6d-44ccdadb7237',
  3: 'https://github.com/user-attachments/assets/2dc5a1d3-1987-40c3-a579-cdb74409aeb9',
  4: 'https://github.com/user-attachments/assets/3fdc6840-7ad9-4986-a94c-ec31112bd695',
  5: 'https://github.com/user-attachments/assets/2327e85e-f761-4f0b-ae1a-1d7b8bd35ffb',
  6: 'https://github.com/user-attachments/assets/755c30bc-7566-44a9-b138-1a176eef8d56',
  7: 'https://github.com/user-attachments/assets/99c5e0cf-69a6-4297-895d-efc3257a6fe7',
  8: 'https://github.com/user-attachments/assets/a705d23b-3e79-4673-aa25-0d4511e29556',
  9: 'https://github.com/user-attachments/assets/602be827-b271-4694-bc17-9737814f7846',
  10: 'https://github.com/user-attachments/assets/6a8821e1-4521-40e8-9bb8-3ee1d3c1dd41',
  11: 'https://github.com/user-attachments/assets/d88c60c3-ad8e-4a0f-acfb-92b8863fac9a',
  12: 'https://github.com/user-attachments/assets/146c4a05-9798-4b55-90ec-18f0f6b80876',
  13: 'https://github.com/user-attachments/assets/cdd66015-ad2a-48c0-a589-a607c76ba89c',
  14: 'https://github.com/user-attachments/assets/99acb780-6402-4124-ad5e-a80fff5637cf',
  15: 'https://github.com/user-attachments/assets/5defe104-3119-441d-83b1-92a010ab244f',
  16: 'https://github.com/user-attachments/assets/8caf0908-36e3-45c4-88b5-8d9dbabb7d0b',
  17: 'https://github.com/user-attachments/assets/c7d61175-422d-4b4d-8f19-689391d6e15f',
  18: 'https://github.com/user-attachments/assets/5d1de241-6ec5-4039-bfee-c320ab916890',
  19: 'https://github.com/user-attachments/assets/8b07fb26-aba9-4ca7-addf-7ea515360941',
  20: 'https://github.com/user-attachments/assets/318a9f79-063e-458f-82ee-71d2e58efd24',
  21: 'https://github.com/user-attachments/assets/6b877a1c-b011-4a23-946d-7de71c83b598',
  22: 'https://github.com/user-attachments/assets/f90bc5a8-f8f7-45bd-ba84-26b0fd28bfdc',
  23: 'https://github.com/user-attachments/assets/9eab63fa-b7ea-4e66-b229-371c9f4c9f9f',
  24: 'https://github.com/user-attachments/assets/83a22894-a139-4b2d-adb6-39c7fe71ac57',
  25: 'https://github.com/user-attachments/assets/f4924ffb-87f0-4094-a3f3-a87b4751dac1',
}

const chipImage = 'https://github.com/user-attachments/assets/294e0f7e-8fa8-42d0-a74e-07eb91f2d84b'

const CARDS = {
  visa: '^4',
  amex: '^(34|37)',
  mastercard: '^5[1-5]',
  discover: '^6011',
  unionpay: '^62',
  troy: '^9792',
  diners: '^(30[0-5]|36)',
}

const BACKGROUND_IMG = Math.floor(Math.random() * 25 + 1)

interface CreditCardProps {
  cardHolder: string
  cardNumber: string
  cardMonth: string
  cardYear: string
  cardCvv: string
  isCardFlipped: boolean
  currentFocusedElm?: React.RefObject<HTMLLabelElement>
  onCardElementClick: (element: keyof typeof FORM_FIELDS) => void
  cardNumberRef?: React.RefObject<HTMLLabelElement>
  cardHolderRef?: React.RefObject<HTMLLabelElement>
  cardDateRef?: React.RefObject<HTMLLabelElement>
}

const CreditCard: React.FC<CreditCardProps> = ({
  cardHolder,
  cardNumber,
  cardMonth,
  cardYear,
  cardCvv,
  isCardFlipped,
  currentFocusedElm,
  onCardElementClick,
  cardNumberRef,
  cardHolderRef,
  cardDateRef,
}): JSX.Element => {
  const [style, setStyle] = useState<React.CSSProperties>({})

  const cardType = (cardNumber: string): CardType => {
    const number = cardNumber
    let re: RegExp
    const CARDS: Record<CardType, string> = {
      amex: '^3[47][0-9]{13}$',
      diners: '^3(?:0[0-5]|[68][0-9])[0-9]{11}$',
      discover: '^6(?:011|5[0-9]{2})[0-9]{12}$',
      mastercard: '^5[1-5][0-9]{14}$',
      troy: '^9792[0-9]{12}$',
      unionpay: '^62[0-9]{14,17}$',
      visa: '^4[0-9]{12}(?:[0-9]{3})?$',
    }

    for (const [card, pattern] of Object.entries(CARDS)) {
      re = new RegExp(pattern)
      if (number.match(re) !== null) {
        return card as CardType
      }
    }

    return 'visa' // default type
  }

  const useCardType = useMemo<CardType>(() => {
    return cardType(cardNumber)
  }, [cardNumber])

  const outlineElementStyle = (element: HTMLLabelElement | null): React.CSSProperties | null => {
    return element
      ? {
          width: `${element.offsetWidth}px`,
          height: `${element.offsetHeight}px`,
          transform: `translateX(${element.offsetLeft}px) translateY(${element.offsetTop}px)`,
        }
      : null
  }

  useEffect(() => {
    if (currentFocusedElm) {
      const style = outlineElementStyle(currentFocusedElm.current) as React.CSSProperties
      setStyle(style)
      return
    }
    setStyle({})
  }, [currentFocusedElm])

  const maskCardNumber = (cardNumber: string): string[] => {
    let cardNumberArr = cardNumber.split('')
    cardNumberArr.forEach((val, index) => {
      if (index > 4 && index < 14) {
        if (cardNumberArr[index] !== ' ') {
          cardNumberArr[index] = '*'
        }
      }
    })

    return cardNumberArr
  }

  return (
    <div className={'card-item ' + (isCardFlipped ? '-active' : '')}>
      <div className="card-item__side -front">
        <div className={`card-item__focus ${currentFocusedElm ? `-active` : ``}`} style={style} />
        <div className="card-item__cover">
          <img
            alt="img credit card background"
            src={cardBackgrounds[BACKGROUND_IMG]}
            className="card-item__bg"
            width={675}
            height={435}
          />
        </div>

        <div className="card-item__wrapper">
          <div className="card-item__top">
            <img src={chipImage} alt="img chip" className="card-item__chip" width={101} height={82} />
            <div className="card-item__type">
              <img alt={useCardType} src={imagesCardType[useCardType]} className="card-item__typeImg" />
            </div>
          </div>

          <label className="card-item__number" ref={cardNumberRef} onClick={() => onCardElementClick('cardNumber')}>
            <TransitionGroup className="slide-fade-up" component="div">
              {cardNumber ? (
                maskCardNumber(cardNumber).map((val, index) => (
                  <CSSTransition classNames="slide-fade-up" timeout={250} key={index}>
                    <div className="card-item__numberItem">{val}</div>
                  </CSSTransition>
                ))
              ) : (
                <CSSTransition classNames="slide-fade-up" timeout={250}>
                  <div className="card-item__numberItem">#</div>
                </CSSTransition>
              )}
            </TransitionGroup>
          </label>
          <div className="card-item__content">
            <label className="card-item__info" onClick={() => onCardElementClick('cardHolder')} ref={cardHolderRef}>
              <div className="card-item__holder">Card Holder</div>
              <div className="card-item__name">
                <TransitionGroup component="div" className="slide-fade-up">
                  {cardHolder === 'FULL NAME' ? (
                    <CSSTransition classNames="slide-fade-up" timeout={250}>
                      <div>FULL NAME</div>
                    </CSSTransition>
                  ) : (
                    cardHolder.split('').map((val, index) => (
                      <CSSTransition timeout={250} classNames="slide-fade-right" key={index}>
                        <span className="card-item__nameItem">{val}</span>
                      </CSSTransition>
                    ))
                  )}
                </TransitionGroup>
              </div>
            </label>
            <div className="card-item__date" onClick={() => onCardElementClick('cardDate')} ref={cardDateRef as any}>
              <label className="card-item__dateTitle">Expires</label>
              <label htmlFor="cardMonth" className="card-item__dateItem">
                <SwitchTransition in-out>
                  <CSSTransition classNames="slide-fade-up" timeout={200} key={cardMonth}>
                    <span>{!cardMonth ? 'MM' : cardMonth} </span>
                  </CSSTransition>
                </SwitchTransition>
              </label>
              /
              <label htmlFor="cardYear" className="card-item__dateItem">
                <SwitchTransition out-in>
                  <CSSTransition classNames="slide-fade-up" timeout={250} key={cardYear}>
                    <span>{!cardYear ? 'YY' : cardYear.toString().substring(cardYear.length - 2)}</span>
                  </CSSTransition>
                </SwitchTransition>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card-item__side -back">
        <div className="card-item__cover">
          <img
            alt="img credit card background"
            src={cardBackgrounds[BACKGROUND_IMG]}
            className="card-item__bg"
            width={675}
            height={435}
          />
        </div>
        <div className="card-item__band" />
        <div className="card-item__cvv">
          <div className="card-item__cvvTitle">CVV</div>
          <div className="card-item__cvvBand">
            <TransitionGroup>
              {cardCvv.split('').map((val, index) => (
                <CSSTransition classNames="zoom-in-out" key={index} timeout={250}>
                  <span>*</span>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>
          <div className="card-item__type">
            <img alt={useCardType} src={imagesCardType[useCardType]} className="card-item__typeImg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditCard
