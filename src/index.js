import { el, mount } from "redom";
import IMask from 'imask';
import moment from 'moment';
import valid from 'card-validator';
import './style.scss';
import logo from './img/assets/logo.png';
import mc from './img/assets/mc.png';
import visa from './img/assets/visa.png';
import mir from './img/assets/mir.png';


// Создание функции поля ошибки
const getError = (text) => {
  let validationText = el('p.pay__error')
  validationText.textContent = text
  return validationText
}
const numberCardError = getError('Введите корректный номер карты')
const monthYearCardError = getError('Введите корректную дату')
const cvcError = getError('Введите корректный cvc-код')
const emailError = getError('Введите корректный e-mail')

// Создание функции блокировки кнопки
const btnDisabled = () => {
  if (numberInp.classList.contains('valid') && monthYearInp.classList.contains('valid') && cvcInp.classList.contains('valid') && emailInp.classList.contains('valid')) {
    (formBtn).disabled = false
  } else {
    (formBtn).disabled = true
  }
}

// Создание функции успешной валидации
const validBlock = (input, error) => {
  input.classList.add('valid')
  input.classList.remove('is-invalid')
  error.remove()
}

// Создание функции не успешной валидации
const inValidBlock = (input, block, error) => {
  input.classList.add('is-invalid')
  input.classList.remove('valid')
  block.append(error)
}

const formText = el(".pay__text", "Нажимая кнопку «Оплатить», я соглашаюсь с условиями Банка")

const formBtn = el("button.pay__btn", "Оплатить", { type: "submit", disabled: true })

const emailLabel = el("label.pay__label", "Электронная почта", { for: "email" })
const emailInp = el("input.pay__input", { type: "email", name: "email", required: true });
emailInp.setAttribute("aria-label", "Электронная почта");
const emailCard = el(".pay__field", [emailInp, emailLabel])

const cvcLabel = el("label.pay__label", "CVC/CVV-код", { for: "cvc" })
const cvcInp = el("input.pay__input", { type: "tel", name: "cvc", minlength: "3", maxlength: "3", autocomplete: "off", autocorrect: "off", spellcheck: "off", required: true });
cvcInp.setAttribute("aria-label", "CVC/CVV-код");
const cvcCard = el(".pay__field", [cvcInp, cvcLabel])

const monthYearLabel = el("label.pay__label", "Месяц/Год", { for: "expiry" })
const monthYearInp = el("input.pay__input", { type: "tel", name: "expiry", autocomplete: "off", autocorrect: "off", spellcheck: "off", required: true });
monthYearInp.setAttribute("aria-label", "Месяц/Год");

const monthYearCard = el(".pay__field", [monthYearInp, monthYearLabel])

const numberLabel = el("label.pay__label", "Номер карты", { for: "pan" })
const numberInp = el("input.pay__input", { type: "tel", name: "pan", maxlength: "23", autocomplete: "off", autocorrect: "off", spellcheck: "off", required: true });
numberInp.setAttribute("aria-label", "Номер карты");
const numberCard = el(".pay__field", [numberInp, numberLabel])

const form = el("form.pay__form", [numberCard, monthYearCard, cvcCard, emailCard, formBtn, formText]);
form.setAttribute("action", "https://jsonplaceholder.typicode.com/posts");
form.setAttribute("method", "post");

const typeCard = el(".pay__type-card");
let img = el("img.pay__type-img")
const payTitle = el("h2.pay__title-min", "Введите данные карты");
const divTitle = el(".pay__title", payTitle, typeCard);
const pay = el(".pay", divTitle, form)

const title = el("h1.title", "Страница оплаты");

const leftLogo = new Image();
leftLogo.src = logo;
leftLogo.classList.add('left-logo')

const rightLogo = new Image();
rightLogo.src = logo;
rightLogo.classList.add('right-logo')
const titleBlock = el(".title-block", leftLogo, title, rightLogo);
const container = el(".container", titleBlock, pay)


mount(document.body, container)

IMask(
  numberInp, { mask: '0000 0000 0000 0000' }
)

IMask(
  monthYearInp, {
  mask: 'MM/YY',
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: 20,
      to: 60
    },
  }
})

IMask(
  cvcInp, { mask: '000' }
)

numberInp.addEventListener('input', () => {
  const numberInpValue = (numberInp).value.trim();
  const numberValidation = valid.number(numberInpValue);

  numberInp.classList.remove('valid')
  numberInp.classList.remove('is-invalid')

  if (numberInpValue === '') {
    typeCard.textContent = ''
  }

  if (!numberValidation.isPotentiallyValid) {
    typeCard.textContent = 'ошибка№'
  }

  if (numberValidation.card) {
    typeCard.append(img)
   if (numberValidation.card.type === 'mastercard') {
      img.src = mc;
      img.alt = numberValidation.card.type;
    } else if (numberValidation.card.type === 'visa') {
      img.src = visa;
      img.alt = numberValidation.card.type;
    } else if (numberValidation.card.type ==='mir') {
      img.src = mir
      typeCard.append(mir)
      img.alt = numberValidation.card.type;
    } else {
      typeCard.textContent = numberValidation.card.type
    }
  }


  numberInp.addEventListener('blur', () => {
    if (numberValidation.isValid) {
      validBlock(numberInp, numberCardError)
    } else {
      inValidBlock(numberInp, numberCard, numberCardError)
    }
    btnDisabled()
  })
})

monthYearInp.addEventListener('input', () => {
  let monthYearInpValue = (monthYearInp).value.trim();
  let getDate = new Date(moment(monthYearInpValue, "MM/YY").format());

  monthYearInp.classList.remove('valid')
  monthYearInp.classList.remove('is-invalid')

  monthYearInp.addEventListener('blur', () => {
    if (getDate > new Date() && monthYearInpValue.length === 5) {
      validBlock(monthYearInp, monthYearCardError)
    } else {
      inValidBlock(monthYearInp, monthYearCard, monthYearCardError)
    }
    btnDisabled()
  })
})

cvcInp.addEventListener('input', () => {
  let cvcInpValue = (cvcInp).value
  if (cvcInpValue !== '') {
    cvcLabel.classList.add('top')
  } else {
    cvcLabel.classList.remove('top')
  }

  cvcInp.addEventListener('blur', () => {
    if (cvcInpValue.length === 3) {
      validBlock(cvcInp, cvcError)
    } else {
      inValidBlock(cvcInp, cvcCard, cvcError)
    }
    btnDisabled()
  })
})

emailInp.addEventListener('input', () => {

  if ((emailInp).value !== '') {
    emailLabel.classList.add('top')
  } else {
    emailLabel.classList.remove('top')
  }

  emailInp.addEventListener('blur', () => {
    emailInp.classList.add('valid')
    if ((emailInp).validity.typeMismatch === false) {
      validBlock(emailInp, emailError)
    } else {
      inValidBlock(emailInp, emailCard, emailError)
    }
    btnDisabled()
  })
})
