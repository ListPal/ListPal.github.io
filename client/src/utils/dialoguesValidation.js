const dialogueValidation = (input) => {
  if (input?.length < 1) 
  return {
    validated: false,
    message: 'Filed cannot be empty.'
  }

  if (input?.length > 30) {
    return {
      validated: false,
      message: 'Filed cannot exceed 30 characters.'
    }
  }

  return {
    validated: true,
    message: ''
  }
}

export {dialogueValidation}
