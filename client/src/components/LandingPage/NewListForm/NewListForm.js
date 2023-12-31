import { useState, useRef } from 'react'
import {
  Alert,
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import Slide from '@mui/material/Slide'
import AddIcon from '@mui/icons-material/Add'
import Backdrop from '@mui/material/Backdrop'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { styled } from '@mui/material/styles'
import { postRequest } from '../../../utils/testApi/testApi'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import { URLS, colors, groceryContainerTypes, mobileWidth } from '../../../utils/enum'
import { useNavigate } from 'react-router-dom'
import { dialogueValidation } from '../../../utils/dialoguesValidation'


function NewListForm({ open, setOpen, user, setActiveContainer, activeContainer }) {
  // States
  const [loading, setLoading] = useState(false)
  const [scope, setScope] = useState('PRIVATE')
  const [severity, setSeverity] = useState('info')
  const [alertMessage, setAlertMessage] = useState(null)
  const [buttonDisable, setButtonDisable] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  
  // Other locals
  const listNameRef = useRef(null)
  const urlParams = new URLSearchParams(window.location.search)
  const navigate = useNavigate()
  
  // Handlers
  const handleInputVlidation = async (input) => {
    return dialogueValidation(input)
  }

  const showAlert = (severity, message) => {
    setAlertMessage(message)
    setSeverity(severity)
  }

  const hideAlert = () => {
    showAlert('info', null)
  }

  const closeDialogueWithDelay = () => {
    setTimeout(() => {
      setErrorMessage(null)
      setOpen(false)
      hideAlert()
      setTimeout(() => setButtonDisable(false), 1000)
    }, 1000)
  }

  const closeDialogueWithoutDelay = () => {
    setErrorMessage(null)
    setButtonDisable(false)
    setOpen(false)
    hideAlert()
  }

  const handleScopeSelection = (event) => {
    setScope(event.target.value)
  }
  
  const handleThemeColor = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return colors.landingPageColors.bold;
    }
    if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return colors.todoColors.bold;
    }
    if (
      activeContainer?.containerType === groceryContainerTypes.whishlist
    ) {
      return colors.landingPageColors.bold;
    }
  }
  const handleCreateList = async (name) => {
    setButtonDisable(true)
    setErrorMessage(null)
    // Validate input
    const valid = await handleInputVlidation(name)
    if (!valid?.validated) {
      setErrorMessage(valid?.message)
      setButtonDisable(false)
      return
    }
    if (!name || name === '') name = 'New List'

    const data = {
      userId: user?.id,
      containerId: urlParams.get("containerId"),
      listName: name,
      scope: scope,
    }

    setLoading(true)
    const res = await postRequest(URLS.createListUri, data)
    setLoading(false)
    if (res?.status === 200) {

      setActiveContainer(container => {
        return {...container, collapsedLists: [res.body, ...activeContainer?.collapsedLists]}
      })
      closeDialogueWithoutDelay()
    } else if (res?.status === 403) {
      navigate('/login')
    } else {
      showAlert('error', "Sorry, couldn't create the list")
      closeDialogueWithoutDelay()
    }
  }

  const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: '#A0AAB4',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: handleThemeColor(),
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: `2px solid ${handleThemeColor()}`,
        borderRadius: 0,
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
    },
  })

  return (
    <>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        closeAfterTransition
        open={open}
        onClose={closeDialogueWithoutDelay}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Paper
            sx={{
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              direction: 'column',
              top: '25vh',
              left: '50vw',
              transform: 'translate(-50%)',
              borderRadius: 5,
              width: 330,
              height: 350,
              p: 2,
            }}
          >
            <Slide
              className='alert-slide'
              in={alertMessage && true}
              sx={{
                position: 'fixed',
                top: '-25vh',
                width: '95vw',
                maxWidth: `calc(${mobileWidth} - 10px`,
              }}
            >
              <Alert
                severity={severity}
                action={
                  <IconButton
                    aria-label='close'
                    color='inherit'
                    size='small'
                    onClick={hideAlert}
                  >
                    <CloseIcon fontSize='inherit' />
                  </IconButton>
                }
              >
                {alertMessage}
              </Alert>
            </Slide>

            <Stack
              direction={'column'}
              spacing={2}
              sx={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant='h3'>Create List</Typography>

              <FormControl>
                <CssTextField
                  fullWidth
                  required
                  error={errorMessage && true}
                  inputRef={listNameRef}
                  id='custom-css-outlined-input'
                  label='Give your List a name'
                  helperText={
                    errorMessage
                      ? errorMessage
                      : "(e.g. Walmart List, Nick's Party List, etc.)"
                  }
                  inputProps={{
                    maxLength: 30,
                  }}
                />

                <RadioGroup
                  row
                  aria-labelledby='demo-radio-buttons-group-label'
                  defaultValue='PRIVATE'
                  name='radio-buttons-group'
                  onChange={handleScopeSelection}

                >
                  <FormControlLabel
                    value='PUBLIC'
                    control={<Radio sx={{color: handleThemeColor()}}/>}
                    label='Public'
                  />
                  <FormControlLabel
                    value='PRIVATE'
                    control={<Radio sx={{color: handleThemeColor()}}/>}
                    label='Private'
                  />
                  <FormControlLabel
                    value='RESTRICTED'
                    control={<Radio sx={{color: handleThemeColor()}}/>}
                    label='Restricted'
                  />
                </RadioGroup>
              </FormControl>
              <Button
                fullWidth
                onClick={() =>
                  showAlert(
                    'info',
                    'Coming soon. This feature is still on the works.'
                  )
                }
                sx={{
                  height: 50,
                  '&:hover': {
                    border: `2px solid ${handleThemeColor()}`,
                  },
                  borderRadius: 0,
                  border: `2px solid ${handleThemeColor()}`,
                  color: 'black',
                }}
              >
                Invite People
                <AddIcon />
              </Button>

              <Button
                fullWidth
                disabled={buttonDisable}
                onClick={() => handleCreateList(listNameRef.current.value)}
                variant='contained'
                sx={{
                  background: handleThemeColor(),
                  '&:hover': { background: handleThemeColor() },
                }}
              >
                Create
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Modal>
    </>
  )
}

export default NewListForm
