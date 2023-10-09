// Error normalization
const validationErrors = {
  null_error: "null_error",
  email_length: "email_length",
  password_length: "password_length",
  password_mismatch: "password_mismatch",
  name: "name",
  lastName: "lastName",
  email_regex: "email_regex",
  password_regex: "password_regex",
  username_password: "username_password",
  phone_regex: "phone_regex",
  phone_length: "phone_length",
};

// Private functions
const validateEmail = (email) => {
  if (!email) {
    console.log("Email is null");
    return {
      error: validationErrors.null_error,
      validated: false,
      message: "Email cannot be empty.",
    };
  }

  if (email === "") {
    console.log("Email cannot be empty");
    return {
      error: validationErrors.name,
      validated: false,
      message: "Email cannot be empty.",
    };
  }

  if (email.length > 100) {
    console.log("Invalid email length");
    return {
      error: validationErrors.email_length,
      validated: false,
      message: "Email size exceeded.",
    };
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    console.log("Invalid email");
    return {
      error: validationErrors.email_regex,
      message: "Invalid email.",
      validated: false,
    };
  }

  return {
    error: null,
    message: null,
    validated: true,
  };
};

const validatePassword = (password) => {
  if (!password) {
    console.log("Password is null");
    return {
      error: validationErrors.null_error,
      validated: false,
      message: "Password cannot be empty.",
    };
  }

  if (password.length > 50) {
    console.log("invalid pword length");
    return {
      error: validationErrors.password_length,
      validated: false,
      message: "Passwords cannot exceed 50 characters.",
    };
  }

  if (
    !/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/.test(
      password
    )
  ) {
    console.log("invalid pword");
    return {
      error: validationErrors.password_regex,
      validated: false,
      message:
        "Password must be at least 8 characters, contain at least one upper case letter, one of [@,$,!,%,*,#,?, or &], and at least a digit.",
    };
  }

  return {
    error: null,
    message: null,
    validated: true,
  };
};

const validateName = (name) => {
  if (!name) {
    console.log("Name is null");
    return {
      error: validationErrors.name,
      validated: false,
      message: "Name cannot be empty.",
    };
  }

  if (name === "") {
    console.log("Empty name/lastname");
    return {
      error: validationErrors.name,
      validated: false,
      message: "Name cannot be empty.",
    };
  }

  if (name.length > 20) {
    console.log("Too long name/lastname");
    return {
      error: validationErrors.name,
      validated: false,
      message: "Name size exceeded.",
    };
  }

  return {
    error: null,
    message: null,
    validated: true,
  };
};

const validateLastName = (lastName) => {
  if (!lastName) {
    console.log("Last name is null");
    return {
      error: validationErrors.lastName,
      validated: false,
      message: "Last name cannot be empty.",
    };
  }

  if (lastName === "") {
    console.log("Empty name/lastname");
    return {
      error: validationErrors.lastName,
      validated: false,
      message: "Last Name cannot be empty.",
    };
  }

  if (lastName.length > 40) {
    console.log("Too long name/lastname");
    return {
      error: validationErrors.lastName,
      validated: false,
      message: "Last Name size exceeded.",
    };
  }

  return {
    error: null,
    message: null,
    validated: true,
  };
};

const validatePhone = (phone) => {
  if (!phone) {
    console.log("Phone is null");
  }

  if (phone.length > 0 && phone.length !== 10) {
    console.log("invalid phone length");
    return {
      error: validationErrors.phone_length,
      validated: false,
      message: "Invalid phone.",
    };
  }

  if (phone.length > 20) {
    console.log("invalid phone length");
    return {
      error: validationErrors.phone_length,
      validated: false,
      message: "Exceeded phone number length.",
    };
  }
  if (phone.length > 0 && !/^\d{10}$/.test(phone)) {
    console.log("Invalid phone");
    return {
      error: validationErrors.phone_regex,
      validated: false,
      message: "Invalid phone number.",
    };
  }

  return {
    error: null,
    message: null,
    validated: true,
  };
};

// Public interfaces
const usernamePasswordValidation = async (username, password) => {
  let validation;

  validation = validateEmail(username);
  if (!validation?.validated) {
    return {
      error: validationErrors.username_password,
      message: "Wrong username or password",
      validated: false,
    };
  }

  validation = validatePassword(password);
  if (!validation?.validated) {
    return {
      error: validationErrors.username_password,
      message: "Wrong username or password",
      validated: false,
    };
  }

  return validation;
};

const registrationValidation = async (registration) => {
  let validation;

  validation = validateName(registration?.name);
  if (!validation?.validated) return validation;

  validation = validateLastName(registration?.lastName);
  if (!validation?.validated) return validation;

  validation = validateEmail(registration?.email);
  if (!validation?.validated) return validation;

  validation = validatePassword(registration?.password);
  if (!validation?.validated) return validation;

  validation = validatePhone(registration?.phone);
  if (!validation?.validated) return validation;

  validation = console.log("Registration Validated");
  return validation;
};

const handleValidatePhone = async (lookupData) => {
  if (lookupData.length == 0) {
    return {
      error: validationErrors.phone_length,
      validated: false,
      message: "Phone field cannot be empty.",
    };
  }
  return validatePhone(lookupData);
};

const handleValidateUsername = async (lookupData) => {
  return validateEmail(lookupData);
};

const handleValidatePassword = async (password) => {
  return validatePassword(password);
};

const handleValidateName = async (name) => {
  return validateName(name);
};

const handleValidateLastName = async (lastName) => {
  return validateLastName(lastName);
};

export {
  validationErrors,
  usernamePasswordValidation,
  registrationValidation,
  handleValidateUsername,
  handleValidatePhone,
  handleValidatePassword,
  handleValidateName,
  handleValidateLastName,
};
