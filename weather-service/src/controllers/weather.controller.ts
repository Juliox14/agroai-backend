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
    const parseCoord = (val: any) => Number(String(val).replace(',', '.'));
    const parsedLat = parseCoord(lat);
    const parsedLon = parseCoord(lon);

    if (isNaN(parsedLat) || isNaN(parsedLon)) {
      return res.status(400).json({ error: "Coordenadas inválidas (NaN)" });
    }

    const data = await fetchWeather(
      parsedLat,
      parsedLon
    )

    res.json(data)

  } catch (error) {
    console.error("Error en weather controller:", error);
    res.status(500).json({
      error: "Error obteniendo clima"
    })

  }

}