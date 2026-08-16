export function buildRouteCoordinates(properties) {
  return properties.map((property) => [property.longitude, property.latitude]);
}

export async function getWalkingRoute(properties) {
  const coordinates = buildRouteCoordinates(properties);

  const response = await fetch("http://localhost:3001/api/route", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Walking route could not be loaded.");
  }

  return data;
}
