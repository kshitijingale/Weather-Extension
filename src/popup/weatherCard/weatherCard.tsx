import React, { useEffect, useState } from 'react'
import { fetchOpenWeatherData, OpenWeatherData, OpenWeatherTempScale, getWeatherIconSrc } from '../../utils/api'
import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@material-ui/core'
import './weatherCard.css'

const WeatherCardContainer: React.FC<{
    children: React.ReactNode
    onDelete?: () => void
}> = ({ children, onDelete }) => {
    return (
        <Box mx={"4px"} my={"16px"}>
            <Card>
                <CardContent>
                    {children}
                </CardContent>
                <CardActions>
                    {
                        onDelete &&
                        <Button onClick={onDelete} color="secondary">Delete</Button>
                    }
                </CardActions>
            </Card>
        </Box>
    )
}

type WeatherCardState = "loading" | "error" | "ready"

const weatherCard: React.FC<{
    city: string
    tempScale: OpenWeatherTempScale
    onDelete?: () => void
}> = ({ city, tempScale, onDelete }) => {
    const [cardState, setCardState] = useState<WeatherCardState>("loading")

    const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null)

    useEffect(() => {
        fetchOpenWeatherData(city, tempScale)
            .then(data => {
                setWeatherData(data)
                setCardState("ready")
            })
            .catch((err) => setCardState("error")
            )
    }, [city, tempScale])

    if (cardState == "loading" || cardState == "error") {
        return <WeatherCardContainer onDelete={onDelete}>
            <Typography className="weatherCard-title">{city}</Typography>
            <Typography>
                {
                    cardState == "loading" ? "Loading...." : "Error: Could not retrieve weather data for this city"
                }
            </Typography>
        </WeatherCardContainer>
    }

    return (
        <WeatherCardContainer onDelete={onDelete}>
            <Grid container justifyContent='space-around'>
                <Grid item>
                    <Typography className="weatherCard-title">{weatherData.name}</Typography>
                    <Typography className="weatherCard-temp">{Math.round(weatherData.main.temp)}</Typography>
                    <Typography className="weatherCard-body">Feels like: {Math.round(weatherData.main.feels_like)}</Typography>
                </Grid>
                <Grid item>
                    {weatherData.weather.length > 0 && (
                        <>
                            <img src={getWeatherIconSrc(weatherData.weather[0].icon)} />
                            <Typography className="weatherCard-body">
                                {weatherData.weather[0].main}
                            </Typography>
                        </>
                    )}
                </Grid>
            </Grid>
        </WeatherCardContainer>
    )
}

export default weatherCard;