import axios from "axios"
import NodeCache from "node-cache"

const cache = new NodeCache({
  stdTTL: 10800 // 3 horas
})

export const fetchWeather = async (lat: number, lon: number) => {

  const key = `${lat}-${lon}`

  const cached = cache.get(key)

  if (cached) {
    return {
      source: "cache",
      data: cached
    }
  }

  const response = await axios.get(
    "https://api.open-meteo.com/v1/forecast",
    {
      params: {
        latitude: lat,
        longitude: lon,
        current: "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
        daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
        timezone: "auto"
      }
    }
  )

  const weather = {
    temperature:   response.data.current.temperature_2m,
    humidity:      response.data.current.relative_humidity_2m,
    wind_speed:    response.data.current.wind_speed_10m,
    time:          response.data.current.time,
    precipitation: response.data.daily.precipitation_sum[0],
    temp_max:      response.data.daily.temperature_2m_max[0],
    temp_min:      response.data.daily.temperature_2m_min[0]
  }

  cache.set(key, weather)

  return {
    source: "api",
    data: weather
  }

}