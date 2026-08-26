export function buildRouteCoordinates(properties) {
  return properties
    .filter(
      (property) =>
        Number.isFinite(property.longitude) &&
        Number.isFinite(property.latitude),
    )
    .map((property) => [property.longitude, property.latitude]);
}

export async function getWalkingRoute(properties) {
  const coordinates = buildRouteCoordinates(properties);

  if (coordinates.length < 2) {
    throw new Error("At least two valid route stops are required.");
  }

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

export async function geocodeAddress(address) {
  const trimmedAddress = address.trim();

  if (!trimmedAddress) {
    throw new Error("An address is required.");
  }

  const params = new URLSearchParams({
    address: trimmedAddress,
  });

  const response = await fetch(
    `http://localhost:3001/api/geocode?${params.toString()}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Address could not be found.");
  }

  if (!Number.isFinite(data.latitude) || !Number.isFinite(data.longitude)) {
    throw new Error("The address did not return valid coordinates.");
  }

  return {
    address: data.address || trimmedAddress,
    label: data.label || trimmedAddress,
    latitude: data.latitude,
    longitude: data.longitude,
  };
}
