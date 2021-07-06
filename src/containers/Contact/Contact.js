import React, { useState, useEffect } from 'react'
import * as emailjs from 'emailjs-com'
import { validateInput } from '../../shared/validation'
import { updateObject } from '../../shared/Utility'
import Spinner from '../../components/UI/Spinner/Spinner'
import classes from './Contact.module.css'

const Contact = ({ hasOwnWrapper = false }) => {
  const [nameElement, setNameElement] = useState({
    validation: {
      required: true,
      minLength: 2,
    },
    wasTouched: false,
    isValid: false,
    invalidFormErrorMessage: 'Name must be at least 2 characters.',
    value: '',
  })
  const [emailElement, setEmailElement] = useState({
    validation: {
      required: true,
      isEmail: true,
    },
    wasTouched: false,
    isValid: false,
    invalidFormErrorMessage: 'Please enter a valid email address.',
    value: '',
  })
  const [subjectElement, setSubjectElement] = useState({
    validation: {
      required: false,
    },
    wasTouched: false,
    isValid: true,
    value: '',
  })
  const [textBoxElement, setTextBoxElement] = useState({
    validation: {
      required: true,
      minLength: 10,
    },
    wasTouched: false,
    isValid: false,
    invalidFormErrorMessage: 'Message must be at least 10 characters.',
    value: '',
  })
  const [isFormValid, setIsFormValid] = useState(false)
  const [emailHandler, setEmailHandler] = useState({
    isSending: false,
    isSuccess: false,
  })

  const [invalidFormErrorMessages, setInvalidFormErrorMessages] = useState([])

  useEffect(() => {
    if (nameElement.isValid && emailElement.isValid && textBoxElement.isValid)
      setIsFormValid(true)
    else setIsFormValid(false)
  }, [nameElement, emailElement, subjectElement, textBoxElement])

  const submitHandler = event => {
    event.preventDefault()

    if (isFormValid) {
      setEmailHandler({ isSending: true, isSuccess: false })
      emailjs
        .sendForm(
          'gmail',
          'portfoliocontactme',
          'ContactForm',
          process.env.REACT_APP_EMAILJS_API_KEY
        )
        .then(response => {
          setEmailHandler({ isSending: false, isSuccess: true })
        })
        .catch(error => {
          setEmailHandler({ isSending: false, isSuccess: false })
        })
    } else {
      setInvalidFormErrorMessages([
        !nameElement.isValid ? nameElement.invalidFormErrorMessage : null,
        !emailElement.isValid ? emailElement.invalidFormErrorMessage : null,
        !textBoxElement.isValid ? textBoxElement.invalidFormErrorMessage : null,
      ])
    }
  }

  const inputChangedHandler = (value, elementIdentifier) => {
    let targetElement
    let setTargetElement

    if (elementIdentifier === 'name') {
      targetElement = nameElement
      setTargetElement = setNameElement
    }
    if (elementIdentifier === 'email') {
      targetElement = emailElement
      setTargetElement = setEmailElement
    }
    if (elementIdentifier === 'subject') {
      targetElement = subjectElement
      setTargetElement = setSubjectElement
    }
    if (elementIdentifier === 'textBox') {
      targetElement = textBoxElement
      setTargetElement = setTextBoxElement
    }
    setTargetElement(
      updateObject(targetElement, {
        isValid: validateInput(value, targetElement.validation),
        wasTouched: true,
        value: value,
      })
    )
  }

  const formSuccess = (
    <div className={classes.FormSuccess}>
      <h1>Success!</h1>
      <p>Thank you for your interest, I will get back to you shortly!</p>
      <p>For urgent matters you can contact me directly on 07989148953.</p>
    </div>
  )

  let content = emailHandler.isSuccess ? (
    formSuccess
  ) : emailHandler.isSending ? (
    <Spinner />
  ) : (
    <form
      id="ContactForm"
      className={classes.ContactForm}
      onSubmit={submitHandler}
    >
      {invalidFormErrorMessages.map(message => (
        <p key={message} className={classes.InvalidFormErrorMessage}>
          {message}
        </p>
      ))}
      <h2>Name</h2>
      <input
        className={
          !nameElement.isValid && nameElement.wasTouched
            ? classes.FormNotValid
            : null
        }
        name="name"
        onChange={event => inputChangedHandler(event.target.value, 'name')}
        value={nameElement.value}
      />
      <h2>Email</h2>
      <input
        className={
          !emailElement.isValid && emailElement.wasTouched
            ? classes.FormNotValid
            : null
        }
        name="email"
        onChange={event => inputChangedHandler(event.target.value, 'email')}
        value={emailElement.value}
      />
      <h2>Subject</h2>
      <input
        name="subject"
        placeholder="(optional)"
        onChange={event => inputChangedHandler(event.target.value, 'subject')}
        value={subjectElement.value}
      />
      <h2>Message</h2>
      <textarea
        className={
          !textBoxElement.isValid && textBoxElement.wasTouched
            ? `${classes.FormNotValid} ${classes.TextBox}`
            : classes.TextBox
        }
        name="message"
        onChange={event => inputChangedHandler(event.target.value, 'textBox')}
        value={textBoxElement.value}
      />
      <button onSubmit={event => submitHandler(event)}>Submit</button>
      <p className={classes.Disclaimer}>
        Personal information provided is confidential and will not be shared.
      </p>
    </form>
  )

  const final = hasOwnWrapper ? (
    <div className={classes.ConditionalContactWrapper}>
      <div className={classes.Contact}>{content}</div>
    </div>
  ) : (
    <div className={classes.Contact}>{content}</div>
  )

  return final
}

export default Contact
