import { Request, Response } from "express"
import { fetchWeather } from "../services/weather.service.js"

export const getWeather = async (req: Request, res: Response) => {

  const { lat, lon } = req.query

  if (!lat || !lon) {
    return res.status(400).json({
      error: "lat y lon son requeridos"
    })
  }

  try {

    const data = await fetchWeather(
      Number(lat),
      Number(lon)
    )

    res.json(data)

  } catch (error) {

    res.status(500).json({
      error: "Error obteniendo clima"
    })

  }

}