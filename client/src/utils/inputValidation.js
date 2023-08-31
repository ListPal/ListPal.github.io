const MIN_USERNAME_LENGTH = 5
const MIN_PASSWORD_LENGTH = 8

const validationErrors = {
  email_length: 'email_length',
  password_length: 'password_length',
  name: 'name',
  lastName: 'lastName',
  email_regex: 'email_regex',
  password_regex: 'password_regex',
  username_password: 'username_password',
  phone_regex: 'phone_regex',
  phone_length: 'phone_length',
}


const usernamePasswordValidation = async (username, password) => {
  if (
    username.length < MIN_USERNAME_LENGTH ||
    password.length < MIN_PASSWORD_LENGTH
  ) {
    return {
      error: validationErrors.username_password,
      message: 'Wrong username or password',
      validated: false,
    }
  }

  if (
    !/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/.test(
      password
    )
  ) {
    return {
      error: validationErrors.email_regex,
      message: 'Worng username or password',
      validated: false,
    }
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(username)) {
    return {
      error: validationErrors.email_regex,
      message: 'Worng username or password',
      validated: false,
    }
  }

  return {
    error: null,
    message: null,
    validated: true,
  }
}

const registrationValidation = async (registration) => {
  // validate name/lastname
  if (registration.name === '') {
    console.log('Empty name/lastname')
    return {
      error: validationErrors.name,
      validated: false,
      message: 'Name cannot be empty.',
    }
  }

  if (registration.name.length > 20) {
    console.log('Too long name/lastname')
    return {
      error: validationErrors.name,
      validated: false,
      message: 'Name size exceeded.',
    }
  }

  if (registration.lastName === '') {
    console.log('Empty name/lastname')
    return {
      error: validationErrors.lastName,
      validated: false,
      message: 'Last Name cannot be empty.',
    }
  }

  if (registration.lastName.length > 40) {
    console.log('Too long name/lastname')
    return {
      error: validationErrors.lastName,
      validated: false,
      message: 'Last Name size exceeded.',
    }
  }

  if (registration.username.length > 100) {
    console.log('Invalid uname length')
    return {
      error: validationErrors.email_length,
      validated: false,
      message: 'email size exceeded.',
    }
  }

  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      registration.username
    )
  ) {
    console.log('Invalid uname')
    return {
      error: validationErrors.email_regex,
      message: 'Invalid email.',
      validated: false,
    }
  }

  if (registration.password.length > 50) {
    console.log('invalid pword length')
    return {
      error: validationErrors.password_length,
      validated: false,
      message: 'Passwords cannot exceed 50 characters.',
    }
  }

  if (
    !/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/.test(
      registration.password
    )
  ) {
    console.log('invalid pword')
    return {
      error: validationErrors.password_regex,
      validated: false,
      message:
        'Password must be at least 8 characters, contain at least one upper case letter, one of [@,$,!,%,*,#,?, or &], and at least a digit.',
    }
  }

  if (registration.phone.length !== 10) {
    console.log('invalid phone length')
    return {
      error: validationErrors.phone_length,
      validated: false,
      message: 'Invalid phone.',
    }
  }

  if (registration.phone.length > 20) {
    console.log('invalid phone length')
    return {
      error: validationErrors.phone_length,
      validated: false,
      message: 'Exceeded phone number length.',
    }
  }
  if (!/^\d{10}$/.test(registration.phone)) {
    console.log('Invalid phone')
    return {
      error: validationErrors.phone_regex,
      validated: false,
      message: 'Invalid phone number.',
    }
  }
  console.log('Validated')
  return {
    error: null,
    message: null,
    validated: true,
  }
}

export {validationErrors, usernamePasswordValidation, registrationValidation}
