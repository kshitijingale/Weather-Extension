import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './options.css'
import '@fontsource/roboto'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Grid,
  Typography,
  Button
}
  from '@material-ui/core'
import { getStoredOptions, LocalStorageOptions, setStoredOptions } from '../utils/storage'

type FormState = 'ready' | 'saving'



const App: React.FC<{}> = () => {

  const [options, setOptions] = useState<LocalStorageOptions | null>(null)
  const [formState, setFormState] = useState<FormState>('ready')

  useEffect(() => {
    getStoredOptions().then((options) => setOptions(options))
  }, [])

  const HandleHomeCityChange = (homeCity: string) => {
    setOptions({
      ...options,
      homeCity,
    })
  }

  const HandleOptionClick = () => {
    setFormState('saving')
    setStoredOptions(options).then(() => {
      setTimeout(() => {
        setFormState('ready')
      }, 500)
    })
  }

  if (!options) {
    return null
  }

  const isFieldDisabled = formState === 'saving'

  return (
    <Box mx='10%' my='2%'>
      <Card>
        <CardContent>
          <Grid container direction='column' spacing={4}>
            <Grid item>
              <Typography variant='h4'>Weather Extension Options</Typography>
            </Grid>
            <Grid item>
              <Typography variant='body1'>Home city name:</Typography>
              <TextField
                placeholder='Enter your home city'
                fullWidth
                value={options.homeCity}
                onChange={event => HandleHomeCityChange(event.target.value)}
                disabled={isFieldDisabled}
              />
            </Grid>
            <Grid item>
              <Button
                variant='contained'
                color='primary'
                onClick={HandleOptionClick}
                disabled={isFieldDisabled}
              >
                {formState === 'ready' ? 'Save' : 'Saving...'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
