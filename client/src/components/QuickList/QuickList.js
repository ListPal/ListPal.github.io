import { useState } from 'react'
import QuickDialogue from './QuickDialogue/QuickDialogue'
import QuickListItem from './QuickListItem/QuickListItem'
import { dialogueObject, dialogues } from '../../utils/enum'
import { Typography, Toolbar, Grid, AppBar, Alert, Slide } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import AddIcon from '@mui/icons-material/Add'
import IconButton from '@mui/material/IconButton'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import { useNavigate } from 'react-router-dom'

const QuickList = () => {
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(true)
  const [itemsArray, setItemsArray] = useState([])
  const [openDialogue, setOpenDialogue] = useState(dialogues.closed)
  const navigate = useNavigate()
  const listName = 'Quick List'

  return (
    <div
      style={{
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {loading && (
        <CircularProgress
          color={'success'}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: '10',
            transform: 'translate(-50%, 0)',
          }}
        />
      )}
      <AppBar
        component='nav'
        sx={{
          paddingLeft: '10px',
          width: '105vw',
          background: '#1F2937',
          alignItems: 'space-between',
        }}
      >
        <Toolbar>
          <IconButton size={'medium'} onClick={() => navigate('/login')}>
            <ArrowBackIosIcon sx={{ color: 'white' }} />
          </IconButton>
          <Typography
            padding={1}
            variant='h5'
            sx={{ color: 'white', flexGrow: 1 }}
          >
            {listName} <ElectricBoltIcon />
          </Typography>
          <IconButton onClick={() => {setOpenDialogue(dialogues.addQuickItem)}}>
            <AddIcon sx={{ color: 'white' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Slide className='alert-slide' in={alert}>
        <Alert severity={'warning'} sx={{marginTop:8}}>
          {
            'In QuickList items live on the tab. If you refresh this tab all content will be lost. To have persistent lists and unlock all our features, please create a free account.'
          }
        </Alert>
      </Slide>

      <Grid
        container
        padding={2}
        spacing={2}
        sx={{
          justifyContent: 'center',
          justifyItems: 'center',
        }}
      >
        {itemsArray.length > 0 &&
          itemsArray.map((e, i) => (
            <QuickListItem
              itemsArray={itemsArray}
              setItemsArray={setItemsArray}
              item={e}
              key={i}
              openDialogue={openDialogue}
              setOpenDialogue={setOpenDialogue}
            />
          ))}
      </Grid>

      {openDialogue === dialogues.addQuickItem && (
        <QuickDialogue
          itemsArray={itemsArray}
          setItemsArray={setItemsArray}
          openDialogue={openDialogue}
          setOpenDialogue={setOpenDialogue}
          dialogueObject={dialogueObject.addQuickItem}
        />
      )}

      <ElectricBoltIcon
        sx={{
          fontSize: '300pt',
          color: '#D1D5DB',
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform:'translate(-50%, -50%)',
          zIndex: '-1',
        }}
      />
    </div>
  )
}

export default QuickList
