import { Alert, Button, Typography } from '@mui/material'
import { useState, useRef } from 'react'
import Slide from '@mui/material/Slide'
import Backdrop from '@mui/material/Backdrop'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { styled } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { dialogues, dialogueObject, URLS } from '../../../../utils/enum'
import { deleteList, postRequest } from '../../../../utils/testApi/testApi'
import { useNavigate } from 'react-router-dom'
import { dialogueValidation } from '../../../../utils/dialoguesValidation'

const MoreDialog = ({
  listName,
  listId,
  activeContainer,
  setActiveContainer,
  openDialogue,
  setOpenDialogue,
}) => {
  // States
  const [loading, setLoading] = useState(false)
  const [severity, setSeverity] = useState('info')
  const [alertMessage, setAlertMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [buttonDisable, setButtonDisable] = useState(false)
  // Other locals
  const textFieldRef = useRef(null)
  const urlParams = new URLSearchParams(window.location.search)
  const navigate = useNavigate()

  const handleInputValidation = async (input) => {
    return dialogueValidation(input)
  }

  const handleEditListName = async (newListName) => {
    setButtonDisable(true)
    setErrorMessage(null)
    setAlertMessage(null)
    // Validate input
    const validation = await handleInputValidation(newListName)
    if (!validation?.validated) {
      setErrorMessage(validation?.message)
      setButtonDisable(false)
      return
    }

    // Send to db
    const data = {
      containerId: urlParams.get("containerId"),
      listId: listId,
      listName: newListName,
    }
    setLoading(true)
    const res = await postRequest(URLS.updateListNameUri, data)
    setLoading(false)

    // Update state hierarchy
    if (res?.status === 200) {
      const updatedLists = activeContainer?.collapsedLists.map((list) => {
        if (list.id === listId) {
          return { ...list, listName: newListName }
        } else {
          return list
        }
      })
      setActiveContainer(container => {
        return {...container, collapsedLists: updatedLists}
      })
      closeDialogueWithoutDelay()
    } else if (res?.status === 403) {
      navigate('/login')
    } else {
      showAlert('error', 'Whoops!. Something went wrong in our end')
      closeDialogueWithDelay()
    }
  }

  const handleDeleteList = async () => {
    setButtonDisable(true)
    setErrorMessage(null)
    setAlertMessage(null)
    // validate that user entered acknowledgement
    if (textFieldRef.current.value !== listName) {
      showAlert(
        'error',
        "Couldn't delete the list.\nMake sure you enter the name of the list correctly (case sensitive)"
      )
      setTimeout(() => {
        hideAlert()
        setButtonDisable(false)
      }, 3000)
      return
    }

    // Send to db
    const data = {
      containerId: urlParams.get("containerId"),
      listId: listId,
    }

    setLoading(true)
    const res = await deleteList(data)
    setLoading(false)

    // Update state hierarchy
    if (res?.status === 200) {
      const updatedLists = activeContainer?.collapsedLists.filter((list) => list.id !== listId)
      setActiveContainer(container => {
        return {...container, collapsedLists: updatedLists}
      })
      closeDialogueWithoutDelay()
    } else if (res?.status === 403) {
      navigate('/login')
    } else {
      showAlert('error', 'Whoops!. Something went wrong in our end')
      closeDialogueWithDelay()
    }
  }

  // TODO:
  const handleAddPeople = () => {
    setButtonDisable(true)
    //
    setButtonDisable(false)
  }


  const handleRedirectToVenmo = () => {
    // Redirect to p2p provider
    setButtonDisable(true)
    window.open('venmo://accounts')
    setButtonDisable(false)
  }

  const handleRedirectToCashapp = () => {
    // Redirect to p2p provider
    setButtonDisable(true)
    window.open('cashme://')
    setButtonDisable(false)
  }

  const actions = [handleRedirectToVenmo, handleRedirectToCashapp]

  const deriveCorrectIcon = (header) => {
    if (header === 'deleteIcon') return <DeleteIcon />
    if (header === 'editIcon') return <EditIcon />
  }

  const showAlert = (severity, msg) => {
    setSeverity(severity)
    setAlertMessage(msg)
  }

  const hideAlert = () => {
    setAlertMessage(null)
  }

  const closeDialogueWithDelay = () => {
    setTimeout(() => {
      setOpenDialogue(dialogues.closed)
      setTimeout(() => setButtonDisable(false), 1000)
    }, 1000)
  }

  const closeDialogueWithoutDelay = () => {
    setOpenDialogue(dialogues.closed)
    setButtonDisable(false)
  }

  return (
    <>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={openDialogue !== dialogues.closed}
        onClose={
          alertMessage ? closeDialogueWithDelay : closeDialogueWithoutDelay
        }
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openDialogue !== dialogues.closed}>
          <Paper
            sx={{
              position: 'absolute',
              top: '25%',
              left: '50%',
              transform: 'translate(-50%)',
              borderRadius: 5,
              width: '80vw',
              height: 300,
            }}
          >
            <Slide
              className='alert-slide'
              in={alertMessage && true}
              sx={{
                position: 'absolute',
                top: -100,
                left: -15,
                width: '80vw',
              }}
            >
              <Alert severity={severity}>{alertMessage}</Alert>
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
              <Typography variant='h4'>
                {dialogueObject[openDialogue]?.header}
              </Typography>

              {dialogueObject[openDialogue]?.textFields.map((textField, i) => (
                !textField.hidden && <CssTextField
                  error={errorMessage && true}
                  required
                  key={`${textField.text}${i}`}
                  inputRef={textFieldRef}
                  id='custom-css-outlined-input'
                  label={textField.text}
                  helperText={errorMessage ? errorMessage : textField.helperText}
                  defaultValue={textField.defaultValue ? listName : null}
                  sx={{ width: '80%' }}
                  inputProps={{
                    maxLength: 30,
                    required: true,
                  }}
                />
              ))}
              {dialogueObject[openDialogue]?.button.map((button, i) => {
                return (<Button
                  fullWidth
                  key={i}
                  type='submit'
                  disabled={buttonDisable}
                  endIcon={deriveCorrectIcon(button.icon)}
                  onClick={() => {
                    if (openDialogue === dialogues.deleteList) {
                      handleDeleteList()
                    } else if (openDialogue === dialogues.editList) {
                      handleEditListName(textFieldRef.current.value)
                    } else if (openDialogue === dialogues.sendMoney) {
                      actions[i]()
                    }
                  }}
                  sx={{
                    width: '80%',
                    height: 50,
                    '&:hover': {
                      background: button.color,
                    },
                    background: button.color,
                    borderRadius: 0,
                    color: button.textColor,
                  }}
                >
                  {button.text}
                </Button>)
              })}
            </Stack>
          </Paper>
        </Fade>
      </Modal>
    </>
  )
}

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'black',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: '2px solid black',
      borderRadius: 0,
    },
    '&:hover fieldset': {
      borderColor: 'black',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'black',
    },
  },
})

export default MoreDialog
