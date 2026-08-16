import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./RouteMap.css";

import { getWalkingRoute } from "../../services/routeService";

function MapController({ property }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([property.latitude, property.longitude], 17, {
      duration: 0.8,
    });
  }, [property, map]);

  return null;
}

function createNumberedIcon(number, isActive) {
  return L.divIcon({
    className: "route-map__custom-icon",
    html: `
      <div class="route-map__numbered-marker ${
        isActive ? "route-map__numbered-marker--active" : ""
      }">
        ${number}
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
  });
}

function RouteMap({ properties, currentIndex, onSelectProperty }) {
  const [walkingRoute, setWalkingRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [routeError, setRouteError] = useState("");

  const currentProperty = properties[currentIndex];

  const fallbackRoute = properties.map((property) => [
    property.latitude,
    property.longitude,
  ]);

  useEffect(() => {
    async function loadWalkingRoute() {
      try {
        setRouteError("");

        const route = await getWalkingRoute(properties);

        const feature = route.features?.[0];

        if (!feature) {
          throw new Error("No walking route was returned.");
        }

        const positions = feature.geometry.coordinates.map(
          ([longitude, latitude]) => [latitude, longitude],
        );

        setWalkingRoute(positions);

        const summary = feature.properties?.summary;

        setDistance(summary?.distance ?? null);

        setDuration(summary?.duration ?? null);
      } catch (error) {
        console.error(error);

        setWalkingRoute([]);

        setRouteError(
          "Walking directions unavailable. Showing route stops instead.",
        );
      }
    }

    if (properties.length >= 2) {
      loadWalkingRoute();
    } else {
      setWalkingRoute([]);
      setDistance(null);
      setDuration(null);
      setRouteError("");
    }
  }, [properties]);

  if (!currentProperty) {
    return (
      <section className="route-map">
        <p>No route available.</p>
      </section>
    );
  }

  const distanceMiles =
    distance !== null ? (distance / 1609.344).toFixed(2) : null;

  const durationMinutes = duration !== null ? Math.round(duration / 60) : null;

  const displayedRoute = walkingRoute.length > 0 ? walkingRoute : fallbackRoute;

  return (
    <section className="route-map">
      <div className="route-map__header">
        <div>
          <p className="route-map__eyebrow">Walking Route</p>

          <h2>Today's Map</h2>
        </div>

        <span className="route-map__position">
          Home {currentIndex + 1} of {properties.length}
        </span>
      </div>

      <div className="route-map__summary">
        <span>{properties.length} Stops</span>

        {distanceMiles && <span>{distanceMiles} miles</span>}

        {durationMinutes && <span>{durationMinutes} min</span>}
      </div>

      {routeError && <p className="route-map__warning">{routeError}</p>}

      <MapContainer
        center={[currentProperty.latitude, currentProperty.longitude]}
        zoom={17}
        className="route-map__map"
      >
        <MapController property={currentProperty} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline
          positions={displayedRoute}
          pathOptions={{
            color: "#2563eb",
            weight: 5,
            opacity: 0.85,
          }}
        />

        {properties.map((property, index) => {
          const people = Array.isArray(property.people) ? property.people : [];

          const primaryPerson = people[0];

          return (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createNumberedIcon(index + 1, index === currentIndex)}
              eventHandlers={{
                click: () => onSelectProperty(index),
              }}
            >
              <Popup>
                <strong>{property.address}</strong>
                <br />
                {primaryPerson?.name || "No person assigned"}
                {people.length > 1 && (
                  <>
                    <br />
                    {people.length} people at this address
                  </>
                )}
                <br />
                Home {index + 1} of {properties.length}
                <br />
                <button
                  type="button"
                  className="route-map__popup-button"
                  onClick={() => onSelectProperty(index)}
                >
                  Select Home
                </button>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </section>
  );
}

export default RouteMap;
