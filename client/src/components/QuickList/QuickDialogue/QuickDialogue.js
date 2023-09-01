import {
  Alert,
  Slide,
  Button,
  Typography,
  Modal,
  Fade,
  Backdrop,
  Paper,
  Stack,
  TextField,
} from '@mui/material'
import { useState, useRef } from 'react'
import { dialogues } from '../../../utils/enum'
import { styled } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { dialogueValidation } from '../../../utils/dialoguesValidation'

const QuickDialogue = ({
  openDialogue,
  setOpenDialogue,
  item,
  setIsActive,
  dialogueObject,
  itemsArray,
  setItemsArray,
}) => {

  const [alertMessage, setAlertMessage] = useState(null)
  const [severity, setSeverity] = useState('info')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const textFieldRef = useRef(null)

  const deriveCorrectIcon = (header) => {
    if (header === 'addIcon') return <AddIcon />
    if (header === 'deleteIcon') return <DeleteIcon />
    if (header === 'editIcon') return <EditIcon />
  }

  const deriveDefaultText = () => {
    if (openDialogue === dialogues.addItem) return ''
    return item?.name
  }

  const showAlert = (severity, msg) => {
    setSeverity(severity)
    setAlertMessage(msg)
  }

  const hideAlert = () => {
    setAlertMessage(null)
  }

  const closeDialogueWithoutDelay = () => {
    setOpenDialogue(dialogues.closed)
    hideAlert()
    setTimeout(() => setLoading(false), 1000)
  }

  const handleAddItem = (itemName) => {
    setLoading(true)
    setErrorMessage(null)
    // Validate input
    const valid = dialogueValidation(itemName)
    if (!valid?.validated) {
      setErrorMessage(valid?.message)
      setLoading(false)
      return
    }
    const duplicate = itemsArray.filter((i) => i.name === itemName)
    if (duplicate.length > 0) {
      showAlert('warning', 'Item already exists in this list.')
      setLoading(false)
      return
    }
    setItemsArray((items) => [...items, { name: itemName }])
    closeDialogueWithoutDelay()
    setLoading(false)
  }

  const handleEditItem = (itemName) => {
    setLoading(true)
    setErrorMessage(false)
    // Validate input
    const valid = dialogueValidation(itemName)
    if (!valid?.validated) {
      setErrorMessage(valid?.message)
      setLoading(false)
      return
    }
    const duplicate = itemsArray.filter((i) => i.name === itemName)
    if (duplicate.length > 0) {
      showAlert('warning', 'Item already exists in this list.')
      setLoading(false)
      return
    }
    const update = itemsArray.map((i) => {
      if (i.name === item?.name) {
        return { ...i, name: itemName }
      } else {
        return i
      }
    })
    setItemsArray(update)
    closeDialogueWithoutDelay()
    setLoading(false)
  }

  const handleDeleteItem = (item) => {
    setLoading(true)
    setErrorMessage(null)
    const update = itemsArray.filter((i) => i.name !== item?.name)
    setItemsArray(update)
    closeDialogueWithoutDelay()
    setLoading(false)
    setIsActive(false)
  }

  return (
    <>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={openDialogue !== dialogues.closed}
        onClose={closeDialogueWithoutDelay}
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
              display: 'flex',
              justifyContent: 'center',
              direction: 'column',
              position: 'absolute',
              top: '25vh',
              left: '50vw',
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
                position: 'fixed',
                top: '-25vh',
                width: '90vw',
              }}
            >
              <Alert severity={severity}>{alertMessage && true}</Alert>
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
              <Typography variant='h4'>{dialogueObject?.header}</Typography>

              {dialogueObject?.textFields.map((e, i) => (
                <CssTextField
                  autoFocus={false}
                  fullWidth
                  sx={{minWidth:'60vw'}}
                  error={errorMessage && true}
                  required
                  key={`${e.text}${i}`}
                  inputRef={textFieldRef}
                  id='custom-css-outlined-input'
                  label={e.text}
                  helperText={errorMessage ? errorMessage : e.helperText}
                  defaultValue={deriveDefaultText()}
                  inputProps={{
                    maxLength: 100,
                    required: true,
                  }}
                />
              ))}
              
              {dialogueObject?.button.map((button, i) => (
                <Button
                key={i}
                fullWidth
                disabled={loading}
                onClick={() => {
                  if (openDialogue === dialogues.addQuickItem) {
                    handleAddItem(textFieldRef.current.value)
                  } else if (openDialogue === dialogues.editItem) {
                    handleEditItem(textFieldRef.current.value)
                  } else if (openDialogue === dialogues.deleteItem) {
                    handleDeleteItem(item)
                  }
                }}
                sx={{
                  height: 50,
                  '&:hover': { background: button.color  },
                  background: button.color,
                  borderRadius: 0,
                  color: button.textColor,
                }}
              >
                {button.text}
                {deriveCorrectIcon(button.icon)}
              </Button>
              ))}
            </Stack>
          </Paper>
        </Fade>
      </Modal>
    </>
  )
}

export default QuickDialogue
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
