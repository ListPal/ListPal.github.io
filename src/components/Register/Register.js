import { useState, useRef } from 'react'
import {
  Button,
  Typography,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Divider,
} from '@mui/material'
import { postRequest, logout } from '../../utils/testApi/testApi'
import { URLS, mobileWidth } from '../../utils/enum'
import { useNavigate } from 'react-router-dom'
import {
  registrationValidation,
  validationErrors,
} from '../../utils/inputValidation'

const Register = ({ setUser, setActiveList }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [validation, setValidation] = useState({
    validated: true,
    message: '',
  })

  const nameRef = useRef(null)
  const lastnameRef = useRef(null)
  const usernameRef = useRef(null)
  const passwordRef = useRef(null)
  const phoneRef = useRef(null)
  const navigate = useNavigate()

  const handleDuplicatedAccountError = async () => {
    return {
      error: validationErrors.email_regex,
      message: 'A user already exists with this email',
      validated: false,
    }
  }

  const handleRegister = async (name, lastName, username, password, phone) => {
    setButtonDisabled(true)
    const data = {
      name: name,
      lastName: lastName,
      phone: phone,
      username: username,
      email: username,
      password: password,
    }

    // Validate regisration input on client side
    const valid = await registrationValidation(data)
    if (!valid?.validated) {
      setValidation(valid)
      setError(valid?.error)
      setButtonDisabled(false)
      return
    }

    // Reset validation
    setError(null)
    setActiveList({ groceryListItems: [] })
    setValidation({
      validated: true,
      message: '',
      error: null,
    })

    // Attempt to log user out if necessary
    setLoading(true)
    const loggedOut = await logout()
    if (loggedOut?.status === 200) {
      // logged out successfully, attempt to register new account
      const res = await postRequest(URLS.registerUri, data)
      setLoading(false)
      if (res?.status === 200) {
        setUser(res?.user)
        navigate(`/containers`)
      } else if (res?.status === 403) {
        console.log(res)
        const duplicatedResponse = await handleDuplicatedAccountError()
        setValidation(duplicatedResponse)
        setError(duplicatedResponse?.error)
      } else {
        console.log('Error on the server when registering user')
      }
    } else if (loggedOut?.status === 403) {
      console.lof(loggedOut)
      setValidation({ error: null, validated: true, message: null })
    } else {
      console.lof(loggedOut)
      console.log('Server error when trying to log out user')
    }
    setButtonDisabled(false)
  }

  return (
    <>
      {loading && (
        <>
          <CircularProgress
            color={'success'}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '45%',
              transform: 'translate(-50%, 0)',
              zIndex: 10,
            }}
          />
        </>
      )}

      <Grid
        container
        sx={{
          backgroundImage: 'linear-gradient(to top, #c1dfc4 0%, #deecdd 100%)',
          maxWidth: mobileWidth,
        }}
      >
        <Stack
          direction={'column'}
          spacing={3}
          sx={{
            marginTop: '10vh',
            height: '90vh',
            width: '100vw',
            maxWidth: mobileWidth,
            borderRadius: '40px 40px 0px 0px',
            boxShadow: '-1px -1px 8px lightgray',
            background: 'white',
            alignItems: 'center',
          }}
        >
          <Typography variant='h2'>
            Signup 🥳
            <Divider sx={{ mt: 1, width: '90vw', maxWidth: mobileWidth, }} />
          </Typography>

          <TextField
            error={error === validationErrors.name ? true : false}
            helperText={error === validationErrors.name && validation?.message}
            color='success'
            required
            id='name-input'
            label='Name'
            variant='filled'
            sx={{ width: '80vw', maxWidth: mobileWidth, }}
            inputRef={nameRef}
            inputProps={{
              maxLength: 20,
            }}
          />
          <TextField
            error={error === validationErrors.lastName}
            helperText={
              error === validationErrors.lastName && validation?.message
            }
            color='success'
            required
            id='last-name-input'
            label='Last Name'
            variant='filled'
            sx={{ width: '80vw', maxWidth: mobileWidth, }}
            inputRef={lastnameRef}
            inputProps={{
              maxLength: 40,
            }}
          />
          <TextField
            error={
              error === validationErrors.email_regex ||
              error === validationErrors.email_length
            }
            helperText={
              error === validationErrors.email_regex ||
              error === validationErrors.email_length
                ? validation?.message
                : 'This will be your username'
            }
            required
            color='success'
            id='username-input'
            label='Email'
            type='email'
            variant='filled'
            sx={{ width: '80vw', maxWidth: mobileWidth, }}
            inputRef={usernameRef}
            inputProps={{
              maxLength: 100,
            }}
          />
          <TextField
            error={
              error === validationErrors.password_regex ||
              error === validationErrors.password_length
            }
            helperText={
              (error === validationErrors.password_regex ||
                error === validationErrors.password_length) &&
              validation?.message
            }
            required
            color='success'
            id='password-input'
            label='Password'
            type='password'
            autoComplete='current-password'
            variant='filled'
            sx={{ width: '80vw', maxWidth: mobileWidth, }}
            inputRef={passwordRef}
            inputProps={{
              maxLength: 50,
            }}
          />
          <TextField
            error={
              error === validationErrors.phone_regex ||
              error === validationErrors.phone_length
            }
            helperText={
              (error === validationErrors.phone_regex ||
                error === validationErrors.phone_length) &&
              validation?.message
            }
            color='success'
            id='phone-mumber-input'
            label='Phone Number'
            type='tel'
            variant='filled'
            sx={{ width: '80vw', maxWidth: mobileWidth, }}
            inputRef={phoneRef}
            inputProps={{
              maxLength: 10,
            }}
          />
          <Button
            disabled={buttonDisabled}
            sx={{
              mt: 5,
              height: '50px',
              width: '60vw',
              maxWidth: mobileWidth,
              background: 'black',
              '&:hover': {
                background: 'black',
                border: `2px solid black`,
              },
            }}
            variant='contained'
            onClick={() =>
              handleRegister(
                nameRef.current.value,
                lastnameRef.current.value,
                usernameRef.current.value,
                passwordRef.current.value,
                phoneRef.current.value
              )
            }
          >
            Welcome Aboard
          </Button>
        </Stack>
      </Grid>
    </>
  )
}

export default Register
