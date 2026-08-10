import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./RouteMap.css";

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
  const currentProperty = properties[currentIndex];

  const routePositions = properties.map((property) => [
    property.latitude,
    property.longitude,
  ]);

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
          positions={routePositions}
          pathOptions={{
            color: "#2563eb",
            weight: 5,
            opacity: 0.8,
          }}
        />

        {properties.map((property, index) => (
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
        ))}
      </MapContainer>
    </section>
  );
}

export default RouteMap;
