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
    `https://api.open-meteo.com/v1/forecast`,
    {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true
      }
    }
  )

  cache.set(key, response.data)

  return {
    source: "api",
    data: response.data
  }

}