import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './popup.css'
import '@fontsource/roboto'
import WeatherCard from './weatherCard'
import { Box, Grid, Paper, InputBase, IconButton } from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'
import { setStoredCities, setStoredOptions, getStoredCities, getStoredOptions, LocalStorageOptions } from '../utils/storage'

const App: React.FC<{}> = () => {
  const [cities, setCities] = useState<string[]>([])
  const [cityInput, setCityInput] = useState<string>('')
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)

  useEffect(() => {
    getStoredCities().then(cities => setCities(cities))
    getStoredOptions().then((options) => setOptions(options))
  }, [])

  const handleAdd = () => {
    if (cityInput === '') {
      return
    }
    const updatedCities = [...cities, cityInput]
    setStoredCities(updatedCities)
      .then(() => {
        setCities(updatedCities)
        setCityInput('')
      })
  }

  const handleDelete = (index: number) => {
    cities.splice(index, 1)
    const updatedCities = [...cities]
    setStoredCities(updatedCities)
      .then(() => {
        setCities(updatedCities)
      })
  }

  const handleTempScale = () => {
    const updateOptions: LocalStorageOptions = {
      ...options,
      tempScale: options.tempScale === 'metric' ? 'imperial' : 'metric',
    }
    setStoredOptions(updateOptions).then(() => {
      setOptions(updateOptions)
    })
  }

  if (!options) {
    return null
  }

  return (
    <Box mx="8px" my="16px">
      <Grid container justifyContent='space-evenly'>
        <Grid item>
          <Paper>
            <Box mx="15px" my="5px">
              <InputBase
                placeholder='Add a city name'
                value={cityInput}
                onChange={event => setCityInput(event.target.value)}
              />
              <IconButton onClick={handleAdd}>
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box my="4px">
              <IconButton onClick={handleTempScale}>
                {options.tempScale === 'metric' ? '\u2103' : '\u2109'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {
        options.homeCity != '' && (
          <WeatherCard city={options.homeCity} tempScale={options.tempScale} />
        )
      }
      {
        cities.map((city, index) =>
          <WeatherCard
            city={city}
            tempScale={options.tempScale}
            key={index}
            onDelete={() => { handleDelete(index) }}
          />)
      }
      <Box height="16px" />
    </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
