const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    message: "CanvassNow server is running",
  });
});

app.get("/api/geocode", async (req, res) => {
  try {
    const address = req.query.address?.trim();

    if (!address) {
      return res.status(400).json({
        message: "An address is required.",
      });
    }

    const apiKey = process.env.ORS_API_KEY;

    if (!apiKey) {
      console.error("ORS_API_KEY is missing from the server environment.");

      return res.status(500).json({
        message: "Geocoding API key is missing.",
      });
    }

    const params = new URLSearchParams({
      text: address,
      size: "1",
    });

    const geocodeResponse = await fetch(
      `https://api.openrouteservice.org/geocode/search?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: apiKey,
          Accept: "application/json",
        },
      },
    );

    const responseText = await geocodeResponse.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = {
        message: responseText,
      };
    }

    if (!geocodeResponse.ok) {
      console.error("OpenRouteService geocode error:", {
        status: geocodeResponse.status,
        data,
      });

      return res.status(geocodeResponse.status).json({
        message:
          data?.error?.message ||
          data?.message ||
          "Address could not be found.",
        details: data,
      });
    }

    const feature = data.features?.[0];

    if (!feature) {
      return res.status(404).json({
        message: "No matching address was found.",
      });
    }

    const coordinates = feature.geometry?.coordinates;

    if (
      !Array.isArray(coordinates) ||
      coordinates.length < 2 ||
      !Number.isFinite(coordinates[0]) ||
      !Number.isFinite(coordinates[1])
    ) {
      return res.status(502).json({
        message: "The geocoding service returned invalid coordinates.",
      });
    }

    const [longitude, latitude] = coordinates;

    return res.json({
      address,
      latitude,
      longitude,
      label: feature.properties?.label || address,
    });
  } catch (error) {
    console.error("Server geocode error:", error);

    return res.status(500).json({
      message: "Server error while finding the address.",
      details: error.message,
    });
  }
});

app.post("/api/route", async (req, res) => {
  try {
    const { coordinates } = req.body;

    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return res.status(400).json({
        message: "At least two coordinates are required.",
      });
    }

    const validCoordinates = coordinates.every(
      (coordinate) =>
        Array.isArray(coordinate) &&
        coordinate.length === 2 &&
        Number.isFinite(coordinate[0]) &&
        Number.isFinite(coordinate[1]),
    );

    if (!validCoordinates) {
      return res.status(400).json({
        message: "One or more route coordinates are invalid.",
      });
    }

    const apiKey = process.env.ORS_API_KEY;

    if (!apiKey) {
      console.error("ORS_API_KEY is missing from the server environment.");

      return res.status(500).json({
        message: "Walking route API key is missing.",
      });
    }

    const orsResponse = await fetch(
      "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
      {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
          Accept: "application/geo+json",
        },
        body: JSON.stringify({
          coordinates,
          instructions: true,
        }),
      },
    );

    const responseText = await orsResponse.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = {
        message: responseText,
      };
    }

    if (!orsResponse.ok) {
      console.error("OpenRouteService error:", {
        status: orsResponse.status,
        data,
      });

      return res.status(orsResponse.status).json({
        message:
          data?.error?.message ||
          data?.message ||
          "Walking route could not be calculated.",
        details: data,
      });
    }

    if (!data.features || data.features.length === 0) {
      return res.status(502).json({
        message: "OpenRouteService returned no walking route.",
      });
    }

    return res.json(data);
  } catch (error) {
    console.error("Server route error:", error);

    return res.status(500).json({
      message: "Server error while calculating walking route.",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`CanvassNow server running on http://localhost:${PORT}`);
});
