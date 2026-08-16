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

app.post("/api/route", async (req, res) => {
  try {
    const { coordinates } = req.body;

    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return res.status(400).json({
        message: "At least two coordinates are required.",
      });
    }

    if (!process.env.ORS_API_KEY) {
      return res.status(500).json({
        message: "Walking route API key is missing.",
      });
    }

    const response = await fetch(
      "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
      {
        method: "POST",
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          coordinates,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Walking route error:", data);

      return res.status(response.status).json({
        message: "Walking route could not be calculated.",
        details: data,
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
  console.log(`CanvassNow server running on port ${PORT}`);
});
