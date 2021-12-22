import {getStoredCities, getStoredOptions, setStoredCities, setStoredOptions} from "../utils/storage"
import {fetchOpenWeatherData} from '../utils/api'


chrome.runtime.onInstalled.addListener(() => {
  setStoredCities([])
  setStoredOptions({
    homeCity: '',
    tempScale: 'metric',
  })

  chrome.contextMenus.create({
    contexts: ['selection'],
    title: "Add City to weather extension",
    id: 'weatherExtension'
  })

  chrome.alarms.create({
    periodInMinutes: 1 / 6,
  })
})

chrome.contextMenus.onClicked.addListener(event => {
  getStoredCities().then((cities) => {
    setStoredCities([...cities, event.selectionText])
  })
})

chrome.alarms.onAlarm.addListener(() => {
  getStoredOptions().then((options) => {
    if(options.homeCity === ''){
      return
    }
    fetchOpenWeatherData(options.homeCity, options.tempScale).then(data => {
      const temp = Math.round(data.main.temp)
      const symbol = options.tempScale === 'metric' ? '\u2103' : '\u2109'
      chrome.action.setBadgeText({
        text: `${temp}${symbol}`,
      })
    })
  })
})



