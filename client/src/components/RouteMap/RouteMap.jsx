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

function LocationController({ userLocation, focusUserLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !focusUserLocation) {
      return;
    }

    map.flyTo([userLocation.latitude, userLocation.longitude], 18, {
      duration: 0.8,
    });
  }, [userLocation, focusUserLocation, map]);

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

function createUserLocationIcon() {
  return L.divIcon({
    className: "route-map__user-location-icon",
    html: `
      <div class="route-map__user-location-marker">
        <div class="route-map__user-location-dot"></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

function RouteMap({ properties, currentIndex, onSelectProperty }) {
  const [walkingRoute, setWalkingRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [routeError, setRouteError] = useState("");

  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [focusUserLocation, setFocusUserLocation] = useState(false);

  const currentProperty = properties[currentIndex];

  const fallbackRoute = properties
    .filter(
      (property) =>
        Number.isFinite(property.latitude) &&
        Number.isFinite(property.longitude),
    )
    .map((property) => [property.latitude, property.longitude]);

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

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Location services are not supported by this browser.");

      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        setLocationError("");
        setIsLocating(false);
      },
      (error) => {
        console.error("Location error:", error);

        setIsLocating(false);

        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Location permission was denied. Allow location access in your browser to show your position.",
          );
        } else {
          setLocationError("Your current location could not be loaded.");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  function handleLocateUser() {
    if (!navigator.geolocation) {
      setLocationError("Location services are not supported by this browser.");

      return;
    }

    setIsLocating(true);
    setFocusUserLocation(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        setLocationError("");
        setIsLocating(false);
        setFocusUserLocation(true);
      },
      (error) => {
        console.error("Location error:", error);

        setIsLocating(false);

        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Location permission was denied. Allow location access in your browser to show your position.",
          );
        } else {
          setLocationError("Your current location could not be loaded.");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      },
    );
  }

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

      <div className="route-map__location-controls">
        <button
          type="button"
          className="route-map__location-button"
          onClick={handleLocateUser}
          disabled={isLocating}
          aria-label="Show my current location"
        >
          <span className="route-map__location-arrow">➤</span>

          <span>{isLocating ? "Finding You..." : "My Location"}</span>
        </button>

        {userLocation && (
          <span className="route-map__location-status">Location active</span>
        )}
      </div>

      {routeError && <p className="route-map__warning">{routeError}</p>}

      {locationError && <p className="route-map__warning">{locationError}</p>}

      <MapContainer
        center={[currentProperty.latitude, currentProperty.longitude]}
        zoom={17}
        className="route-map__map"
      >
        <MapController property={currentProperty} />

        <LocationController
          userLocation={userLocation}
          focusUserLocation={focusUserLocation}
        />

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

        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={createUserLocationIcon()}
            zIndexOffset={1000}
          >
            <Popup>
              <strong>Your Location</strong>
              <br />
              Accuracy: approximately {Math.round(userLocation.accuracy)} meters
            </Popup>
          </Marker>
        )}

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
