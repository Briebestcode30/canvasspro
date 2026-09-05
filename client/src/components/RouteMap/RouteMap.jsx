import { useEffect, useMemo, useState } from "react";
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
    if (
      !Number.isFinite(property?.latitude) ||
      !Number.isFinite(property?.longitude)
    ) {
      return;
    }

    map.flyTo([property.latitude, property.longitude], 17, {
      duration: 0.8,
    });
  }, [property, map]);

  return null;
}

function LocationController({
  userLocation,
  focusUserLocation,
  onLocationFocused,
}) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !focusUserLocation) {
      return;
    }

    map.flyTo([userLocation.latitude, userLocation.longitude], 18, {
      duration: 0.8,
    });

    onLocationFocused();
  }, [userLocation, focusUserLocation, onLocationFocused, map]);

  return null;
}

/*
  PROPERTY STATUS COLORS

  Gray   = Not Knocked
  Orange = Knocked + Not Home
  Black  = Refused
  Blue   = Signed Up
  Pink   = Inaccessible
*/

function getPropertyStatus(property) {
  const people = Array.isArray(property.people) ? property.people : [];

  const hasSignup = people.some(
    (person) => person.ctaSigned === true || person.waMembershipJoin === true,
  );

  if (hasSignup) {
    return "signup";
  }

  const hasRefused = people.some((person) => person.outcome === "Refused");

  if (hasRefused) {
    return "refused";
  }

  const hasInaccessible = people.some(
    (person) => person.outcome === "Inaccessible",
  );

  if (hasInaccessible) {
    return "inaccessible";
  }

  const hasNotHome = people.some(
    (person) => person.knocked === true && person.outcome === "Not Home",
  );

  if (hasNotHome) {
    return "not-home";
  }

  return "unvisited";
}

function getStatusLabel(status) {
  switch (status) {
    case "signup":
      return "Signed Up";

    case "refused":
      return "Refused";

    case "inaccessible":
      return "Inaccessible";

    case "not-home":
      return "Knocked — Not Home";

    default:
      return "Not Knocked";
  }
}

function createNumberedIcon(number, isActive, status) {
  return L.divIcon({
    className: "route-map__custom-icon",

    html: `
      <div
        class="
          route-map__numbered-marker
          route-map__numbered-marker--${status}
          ${isActive ? "route-map__numbered-marker--active" : ""}
        "
      >
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

function distanceBetweenLocations(firstLocation, secondLocation) {
  if (!firstLocation || !secondLocation) {
    return Infinity;
  }

  const earthRadius = 6371000;

  const latitude1 = (firstLocation.latitude * Math.PI) / 180;

  const latitude2 = (secondLocation.latitude * Math.PI) / 180;

  const latitudeDifference =
    ((secondLocation.latitude - firstLocation.latitude) * Math.PI) / 180;

  const longitudeDifference =
    ((secondLocation.longitude - firstLocation.longitude) * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function RouteMap({ properties = [], currentIndex = 0, onSelectProperty }) {
  const [walkingRoute, setWalkingRoute] = useState([]);

  const [distance, setDistance] = useState(null);

  const [duration, setDuration] = useState(null);

  const [routeError, setRouteError] = useState("");

  const [userLocation, setUserLocation] = useState(null);

  const [locationError, setLocationError] = useState("");

  const [isLocating, setIsLocating] = useState(false);

  const [focusUserLocation, setFocusUserLocation] = useState(false);

  const [isHomesPanelOpen, setIsHomesPanelOpen] = useState(false);

  const currentProperty = properties[currentIndex];

  /*
    Build route coordinates separately from contact
    data so editing phone/email/survey information
    does not request a new walking route.
  */

  const routeStops = useMemo(
    () =>
      properties
        .filter(
          (property) =>
            Number.isFinite(property.latitude) &&
            Number.isFinite(property.longitude),
        )
        .map((property) => ({
          id: property.id,
          latitude: property.latitude,
          longitude: property.longitude,
        })),
    [properties],
  );

  const routeCoordinateKey = useMemo(
    () =>
      routeStops
        .map(
          (property) =>
            `${property.id}:${property.latitude}:${property.longitude}`,
        )
        .join("|"),
    [routeStops],
  );

  const fallbackRoute = useMemo(
    () => routeStops.map((property) => [property.latitude, property.longitude]),
    [routeStops],
  );

  useEffect(() => {
    let isCancelled = false;

    async function loadWalkingRoute() {
      try {
        setRouteError("");

        if (routeStops.length < 2) {
          setWalkingRoute([]);
          setDistance(null);
          setDuration(null);

          return;
        }

        const route = await getWalkingRoute(routeStops);

        if (isCancelled) {
          return;
        }

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
        if (isCancelled) {
          return;
        }

        console.error(error);

        setWalkingRoute([]);

        setDistance(null);
        setDuration(null);

        setRouteError(
          "Walking directions unavailable. Showing route stops instead.",
        );
      }
    }

    loadWalkingRoute();

    return () => {
      isCancelled = true;
    };
  }, [routeCoordinateKey]);

  /*
    BATTERY-EFFICIENT LOCATION TRACKING

    Normal tracking uses lower-power location mode.
    High accuracy is only requested when the user
    presses My Location.
  */

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Location services are not supported by this browser.");

      return undefined;
    }

    let lastLocation = null;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,

          longitude: position.coords.longitude,

          accuracy: position.coords.accuracy,
        };

        const movedDistance = distanceBetweenLocations(
          lastLocation,
          nextLocation,
        );

        const accuracyImproved =
          !lastLocation || nextLocation.accuracy + 10 < lastLocation.accuracy;

        /*
            Only refresh the marker when:
            - first location arrives
            - user moved about 10 meters
            - accuracy noticeably improves

            This avoids excessive map re-renders.
          */

        if (!lastLocation || movedDistance >= 10 || accuracyImproved) {
          lastLocation = nextLocation;

          setUserLocation(nextLocation);
        }

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
        enableHighAccuracy: false,
        maximumAge: 60000,
        timeout: 20000,
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
        maximumAge: 10000,
        timeout: 15000,
      },
    );
  }

  function handleSelectHome(index) {
    setFocusUserLocation(false);

    if (onSelectProperty) {
      onSelectProperty(index);
    }
  }

  function getPeople(property) {
    return Array.isArray(property.people) ? property.people : [];
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

      <div className="route-map__legend">
        <span className="route-map__legend-item">
          <span className="route-map__legend-dot route-map__legend-dot--unvisited" />
          Not Knocked
        </span>

        <span className="route-map__legend-item">
          <span className="route-map__legend-dot route-map__legend-dot--not-home" />
          Not Home
        </span>

        <span className="route-map__legend-item">
          <span className="route-map__legend-dot route-map__legend-dot--refused" />
          Refused
        </span>

        <span className="route-map__legend-item">
          <span className="route-map__legend-dot route-map__legend-dot--signup" />
          Signed Up
        </span>

        <span className="route-map__legend-item">
          <span className="route-map__legend-dot route-map__legend-dot--inaccessible" />
          Inaccessible
        </span>
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

      <div className="route-map__map-shell">
        <button
          type="button"
          className={`route-map__homes-toggle ${
            isHomesPanelOpen ? "route-map__homes-toggle--open" : ""
          }`}
          onClick={() => setIsHomesPanelOpen((current) => !current)}
          aria-label={isHomesPanelOpen ? "Close homes list" : "Open homes list"}
        >
          {isHomesPanelOpen ? "›" : "‹"}
        </button>

        <aside
          className={`route-map__homes-panel ${
            isHomesPanelOpen ? "route-map__homes-panel--open" : ""
          }`}
        >
          <div className="route-map__homes-header">
            <div>
              <p>Today's Route</p>

              <h3>Homes</h3>
            </div>

            <span>{properties.length}</span>
          </div>

          <div className="route-map__homes-list">
            {properties.map((property, index) => {
              const people = getPeople(property);

              const status = getPropertyStatus(property);

              return (
                <button
                  key={property.id}
                  type="button"
                  className={`route-map__home-item route-map__home-item--${status} ${
                    index === currentIndex ? "route-map__home-item--active" : ""
                  }`}
                  onClick={() => handleSelectHome(index)}
                >
                  <span
                    className={`route-map__home-number route-map__home-number--${status}`}
                  >
                    {index + 1}
                  </span>

                  <span className="route-map__home-details">
                    <strong>{property.address}</strong>

                    <small>{getStatusLabel(status)}</small>

                    {people.length > 0 && (
                      <small>
                        {people
                          .map((person) => person.name)
                          .filter(Boolean)
                          .join(", ")}
                      </small>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <MapContainer
          center={[currentProperty.latitude, currentProperty.longitude]}
          zoom={17}
          className="route-map__map"
        >
          <MapController property={currentProperty} />

          <LocationController
            userLocation={userLocation}
            focusUserLocation={focusUserLocation}
            onLocationFocused={() => setFocusUserLocation(false)}
          />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {displayedRoute.length >= 2 && (
            <Polyline
              positions={displayedRoute}
              pathOptions={{
                color: "#2563eb",
                weight: 5,
                opacity: 0.85,
              }}
            />
          )}

          {userLocation && (
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={createUserLocationIcon()}
              zIndexOffset={1000}
            >
              <Popup>
                <strong>Your Location</strong>
                <br />
                Accuracy: approximately {Math.round(userLocation.accuracy)}{" "}
                meters
              </Popup>
            </Marker>
          )}

          {properties.map((property, index) => {
            if (
              !Number.isFinite(property.latitude) ||
              !Number.isFinite(property.longitude)
            ) {
              return null;
            }

            const people = getPeople(property);

            const status = getPropertyStatus(property);

            return (
              <Marker
                key={property.id}
                position={[property.latitude, property.longitude]}
                icon={createNumberedIcon(
                  index + 1,
                  index === currentIndex,
                  status,
                )}
                eventHandlers={{
                  click: () => handleSelectHome(index),
                }}
              >
                <Popup>
                  <strong>{property.address}</strong>
                  <br />
                  Status: <strong>{getStatusLabel(status)}</strong>
                  {people.length > 0 && (
                    <>
                      <br />

                      {people
                        .map((person) => person.name)
                        .filter(Boolean)
                        .join(", ")}
                    </>
                  )}
                  <br />
                  Home {index + 1} of {properties.length}
                  <br />
                  <button
                    type="button"
                    className="route-map__popup-button"
                    onClick={() => handleSelectHome(index)}
                  >
                    Select Home
                  </button>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </section>
  );
}

export default RouteMap;
