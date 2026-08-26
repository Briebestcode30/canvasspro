import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import "./App.css";

import Progress from "./pages/Progress";
import SettingsPage from "./pages/Settings";
import Login from "./pages/Login";

import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import DashboardStats from "./components/DashboardStats/DashboardStats";
import RouteList from "./components/RouteList/RouteList";
import RouteMap from "./components/RouteMap/RouteMap";
import PropertyCard from "./components/PropertyCard/PropertyCard";
import AddPersonForm from "./components/AddPersonForm/AddPersonForm";
import AddAddressForm from "./components/AddAddressForm/AddAddressForm";

import initialProperties from "./data/properties";
import { optimizeRoute } from "./utils/routeUtils";
import { geocodeAddress } from "./services/routeService";

const STORAGE_KEYS = {
  properties: "canvassnow-properties",
  shiftNotes: "canvassnow-shift-notes",
  hourlyAnalysis: "canvassnow-hourly-analysis",
  profile: "canvassnow-profile",
};

const defaultHourlyAnalysis = {
  "3:00 PM": {
    plusOne: "",
    delta: "",
    plusTwo: "",
  },
  "4:00 PM": {
    plusOne: "",
    delta: "",
    plusTwo: "",
  },
  "5:00 PM": {
    plusOne: "",
    delta: "",
    plusTwo: "",
  },
  "6:00 PM": {
    plusOne: "",
    delta: "",
    plusTwo: "",
  },
  "7:00 PM": {
    plusOne: "",
    delta: "",
    plusTwo: "",
  },
  "8:00 PM": {
    plusOne: "",
    delta: "",
    plusTwo: "",
  },
};

function loadStoredValue(key, fallbackValue) {
  try {
    const storedValue = window.localStorage.getItem(key);

    if (!storedValue) {
      return fallbackValue;
    }

    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Could not load ${key}:`, error);

    return fallbackValue;
  }
}

function App() {
  const [properties, setProperties] = useState(() =>
    loadStoredValue(STORAGE_KEYS.properties, initialProperties),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);

  const [showAddPersonForm, setShowAddPersonForm] = useState(false);

  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [shiftNotes, setShiftNotes] = useState(() =>
    loadStoredValue(STORAGE_KEYS.shiftNotes, ""),
  );

  const [hourlyAnalysis, setHourlyAnalysis] = useState(() =>
    loadStoredValue(STORAGE_KEYS.hourlyAnalysis, defaultHourlyAnalysis),
  );

  const isLoggedIn = Boolean(currentUser);

  const canvassableProperties = properties.filter(
    (property) => !property.redDoor,
  );

  const currentProperty = canvassableProperties[currentIndex];

  const currentPeople = Array.isArray(currentProperty?.people)
    ? currentProperty.people
    : [];

  const currentPerson = currentPeople[currentPersonIndex];

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.properties,
        JSON.stringify(properties),
      );
    } catch (error) {
      console.error("Could not save canvassing properties:", error);
    }
  }, [properties]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.shiftNotes,
        JSON.stringify(shiftNotes),
      );
    } catch (error) {
      console.error("Could not save shift notes:", error);
    }
  }, [shiftNotes]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.hourlyAnalysis,
        JSON.stringify(hourlyAnalysis),
      );
    } catch (error) {
      console.error("Could not save hourly analysis:", error);
    }
  }, [hourlyAnalysis]);

  useEffect(() => {
    if (
      currentIndex >= canvassableProperties.length &&
      canvassableProperties.length > 0
    ) {
      setCurrentIndex(canvassableProperties.length - 1);
      setCurrentPersonIndex(0);
    }
  }, [canvassableProperties.length, currentIndex]);

  function isPersonVisited(person) {
    return Boolean(
      person.outcome ||
      person.knocked ||
      person.ctaSigned !== null ||
      person.phone?.trim() ||
      person.email?.trim() ||
      person.importantIssue ||
      (Array.isArray(person.industries) && person.industries.length > 0) ||
      person.waMembershipJoin === true ||
      person.textMessageOk === true ||
      person.hotContact === true,
    );
  }

  function isPropertyVisited(property) {
    return Boolean(property.people?.some((person) => isPersonVisited(person)));
  }

  function handleLogin({ email }) {
    const savedProfile = loadStoredValue(STORAGE_KEYS.profile, null);

    if (
      savedProfile &&
      savedProfile.email?.toLowerCase() === email.trim().toLowerCase()
    ) {
      setCurrentUser(savedProfile);

      return;
    }

    setCurrentUser({
      fullName: "",
      email: email.trim(),
      position: "Canvasser",
      organizationRole: "Canvasser",
      licenseImage: "",
    });
  }

  function handleLogout() {
    setCurrentUser(null);
    setCurrentIndex(0);
    setCurrentPersonIndex(0);
    setShowAddPersonForm(false);
    setShowAddAddressForm(false);
  }

  function handleUpdateUser(updatedUser) {
    setCurrentUser(updatedUser);

    try {
      window.localStorage.setItem(
        STORAGE_KEYS.profile,
        JSON.stringify(updatedUser),
      );
    } catch (error) {
      console.error("Could not save user profile:", error);

      window.alert("The profile could not be saved on this device.");
    }
  }

  function handleSelectProperty(index) {
    setCurrentIndex(index);
    setCurrentPersonIndex(0);
    setShowAddPersonForm(false);
    setShowAddAddressForm(false);
  }

  function handleSelectPerson(index) {
    setCurrentPersonIndex(index);
  }

  function handleNextHome() {
    if (currentIndex < canvassableProperties.length - 1) {
      setCurrentIndex((current) => current + 1);

      setCurrentPersonIndex(0);
      setShowAddPersonForm(false);
      setShowAddAddressForm(false);
    }
  }

  function handlePreviousHome() {
    if (currentIndex > 0) {
      setCurrentIndex((current) => current - 1);

      setCurrentPersonIndex(0);
      setShowAddPersonForm(false);
      setShowAddAddressForm(false);
    }
  }

  function handleSaveProperty(updatedProperty) {
    setProperties((currentProperties) =>
      currentProperties.map((property) =>
        property.id === updatedProperty.id ? updatedProperty : property,
      ),
    );
  }

  function handleOpenAddPersonForm() {
    setShowAddPersonForm(true);
    setShowAddAddressForm(false);
  }

  function handleOpenAddAddressForm() {
    setShowAddAddressForm(true);
    setShowAddPersonForm(false);
  }

  function handleAddPerson(person) {
    if (!currentProperty) {
      return;
    }

    const newPerson = {
      id: Date.now() + Math.random(),
      name: person.name,
      age: person.age,
      phone: person.phone || "",
      email: person.email || "",
      notes: person.notes || "",
      outcome: person.outcome || "",
      knocked: person.knocked || false,
      importantIssue: person.importantIssue || "",
      industries: Array.isArray(person.industries) ? person.industries : [],
      ctaSigned: person.ctaSigned ?? null,
      waMembershipJoin: person.waMembershipJoin || false,
      textMessageOk: person.textMessageOk || false,
      hotContact: person.hotContact || false,
    };

    const newPersonIndex = currentPeople.length;

    setProperties((currentProperties) =>
      currentProperties.map((property) =>
        property.id === currentProperty.id
          ? {
              ...property,
              people: [...(property.people || []), newPerson],
            }
          : property,
      ),
    );

    setCurrentPersonIndex(newPersonIndex);

    setShowAddPersonForm(false);
  }

  async function handleAddNewAddress({ address, person }) {
    try {
      const location = await geocodeAddress(address);

      const newPerson = {
        id: Date.now() + Math.random(),
        name: person.name,
        age: person.age,
        phone: person.phone || "",
        email: person.email || "",
        notes: person.notes || "",
        outcome: person.outcome || "",
        knocked: person.knocked || false,
        importantIssue: person.importantIssue || "",
        industries: Array.isArray(person.industries) ? person.industries : [],
        ctaSigned: person.ctaSigned ?? null,
        waMembershipJoin: person.waMembershipJoin || false,
        textMessageOk: person.textMessageOk || false,
        hotContact: person.hotContact || false,
      };

      const newProperty = {
        id: Date.now(),
        address: location.label || address,
        redDoor: false,
        latitude: location.latitude,
        longitude: location.longitude,
        needsGeocoding: false,
        people: [newPerson],
      };

      const newIndex = canvassableProperties.length;

      setProperties((currentProperties) => [...currentProperties, newProperty]);

      setCurrentIndex(newIndex);
      setCurrentPersonIndex(0);

      setShowAddAddressForm(false);
      setShowAddPersonForm(false);
    } catch (error) {
      console.error("Could not add new address:", error);

      window.alert(
        error.message ||
          "The address could not be found. Please check the address and try again.",
      );
    }
  }

  function handleOptimizeRoute() {
    const propertiesWithCoordinates = canvassableProperties.filter(
      (property) =>
        Number.isFinite(property.latitude) &&
        Number.isFinite(property.longitude),
    );

    const optimized = optimizeRoute(propertiesWithCoordinates);

    const propertiesWithoutCoordinates = canvassableProperties.filter(
      (property) =>
        !Number.isFinite(property.latitude) ||
        !Number.isFinite(property.longitude),
    );

    const redDoors = properties.filter((property) => property.redDoor);

    setProperties([...optimized, ...propertiesWithoutCoordinates, ...redDoors]);

    setCurrentIndex(0);
    setCurrentPersonIndex(0);
  }

  function handleAnalysisChange(time, field, value) {
    setHourlyAnalysis((currentAnalysis) => ({
      ...currentAnalysis,
      [time]: {
        ...currentAnalysis[time],
        [field]: value,
      },
    }));
  }

  function PersonSelector() {
    if (!currentProperty) {
      return null;
    }

    return (
      <section className="person-selector">
        <div className="person-selector__header">
          <h3>People at this address</h3>

          <span>
            {currentPeople.length}{" "}
            {currentPeople.length === 1 ? "Person" : "People"}
          </span>
        </div>

        <div className="person-selector__list">
          {currentPeople.map((person, index) => (
            <button
              key={person.id}
              type="button"
              className={`person-selector__button ${
                index === currentPersonIndex
                  ? "person-selector__button--active"
                  : ""
              }`}
              onClick={() => handleSelectPerson(index)}
            >
              <span>{person.name}</span>

              <small>Age {person.age}</small>
            </button>
          ))}
        </div>
      </section>
    );
  }

  function DashboardPage() {
    const visitedHomes = canvassableProperties.filter(isPropertyVisited).length;

    const remainingHomes = canvassableProperties.length - visitedHomes;

    const analysisTimes = [
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM",
    ];

    return (
      <>
        <div className="page-heading">
          <h1>Dashboard</h1>
        </div>

        <DashboardStats properties={canvassableProperties} />

        {currentProperty ? (
          <section className="dashboard-overview">
            <div className="dashboard-overview__card">
              <p className="dashboard-overview__label">Current Home</p>

              <h2>{currentProperty.address}</h2>

              <p>{currentPerson?.name || "No person assigned"}</p>

              <span>
                Home {currentIndex + 1} of {canvassableProperties.length}
              </span>
            </div>

            <div className="dashboard-overview__card">
              <p className="dashboard-overview__label">Route Summary</p>

              <div className="dashboard-overview__summary">
                <span>
                  Visited: <strong>{visitedHomes}</strong>
                </span>

                <span>
                  Remaining: <strong>{remainingHomes}</strong>
                </span>
              </div>
            </div>

            <NavLink to="/routes" className="dashboard-overview__continue">
              Continue Route
            </NavLink>
          </section>
        ) : (
          <p>No canvassable addresses remain.</p>
        )}

        <section className="dashboard-shift">
          <div className="dashboard-shift__notes">
            <h2>Shift Notes</h2>

            <p className="dashboard-shift__helper">
              Add notes that apply to the entire shift.
            </p>

            <textarea
              value={shiftNotes}
              onChange={(event) => setShiftNotes(event.target.value)}
              placeholder="Enter shift notes..."
            />
          </div>

          <div className="dashboard-analysis">
            <h2>Hourly Plus / Delta / Plus</h2>

            <p className="dashboard-analysis__helper">
              Record what went well, what can improve, and another positive for
              each hour.
            </p>

            <div className="dashboard-analysis__list">
              {analysisTimes.map((time) => (
                <div key={time} className="dashboard-analysis__hour">
                  <span className="dashboard-analysis__time">{time}</span>

                  <div className="dashboard-analysis__fields">
                    <label className="dashboard-analysis__field">
                      <span>Plus</span>

                      <input
                        type="text"
                        value={hourlyAnalysis[time]?.plusOne || ""}
                        onChange={(event) =>
                          handleAnalysisChange(
                            time,
                            "plusOne",
                            event.target.value,
                          )
                        }
                        placeholder="What went well?"
                      />
                    </label>

                    <label className="dashboard-analysis__field">
                      <span>Delta</span>

                      <input
                        type="text"
                        value={hourlyAnalysis[time]?.delta || ""}
                        onChange={(event) =>
                          handleAnalysisChange(
                            time,
                            "delta",
                            event.target.value,
                          )
                        }
                        placeholder="What can improve?"
                      />
                    </label>

                    <label className="dashboard-analysis__field">
                      <span>Plus</span>

                      <input
                        type="text"
                        value={hourlyAnalysis[time]?.plusTwo || ""}
                        onChange={(event) =>
                          handleAnalysisChange(
                            time,
                            "plusTwo",
                            event.target.value,
                          )
                        }
                        placeholder="Another positive"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  function RoutesPage() {
    if (!currentProperty) {
      return <p>No canvassable addresses remain.</p>;
    }

    return (
      <>
        <div className="page-heading">
          <h1>Routes</h1>
        </div>

        <nav className="route-page-links">
          <NavLink to="/">Dashboard</NavLink>

          <NavLink to="/progress">Progress</NavLink>

          <NavLink to="/addresses">Addresses / People</NavLink>

          <NavLink to="/settings">Settings</NavLink>
        </nav>

        <div className="canvass-workspace">
          <div className="canvass-workspace__panel">
            <RouteList
              properties={canvassableProperties}
              currentIndex={currentIndex}
              onSelectProperty={handleSelectProperty}
              onOptimizeRoute={handleOptimizeRoute}
            />

            <PersonSelector />

            <PropertyCard
              property={currentProperty}
              selectedPersonIndex={currentPersonIndex}
              currentIndex={currentIndex}
              totalProperties={canvassableProperties.length}
              onPrevious={handlePreviousHome}
              onNext={handleNextHome}
              onSaveProperty={handleSaveProperty}
            />
          </div>

          <RouteMap
            properties={canvassableProperties}
            currentIndex={currentIndex}
            onSelectProperty={handleSelectProperty}
          />
        </div>
      </>
    );
  }

  function ProgressPage() {
    return <Progress properties={canvassableProperties} />;
  }

  function AddressesPeoplePage() {
    if (!currentProperty) {
      return <p>No canvassable addresses remain.</p>;
    }

    return (
      <>
        <div className="page-heading">
          <h1>Addresses / People</h1>
        </div>

        <div className="addresses-actions">
          <button
            type="button"
            className="addresses-actions__button"
            onClick={handleOpenAddPersonForm}
          >
            Add Person to Current Address
          </button>

          <button
            type="button"
            className="addresses-actions__button addresses-actions__button--secondary"
            onClick={handleOpenAddAddressForm}
          >
            Add New Address / Person
          </button>
        </div>

        {showAddPersonForm && (
          <AddPersonForm
            address={currentProperty.address}
            onAddPerson={handleAddPerson}
            onCancel={() => setShowAddPersonForm(false)}
          />
        )}

        {showAddAddressForm && (
          <AddAddressForm
            onAddAddress={handleAddNewAddress}
            onCancel={() => setShowAddAddressForm(false)}
          />
        )}

        <div className="addresses-layout">
          <RouteList
            properties={canvassableProperties}
            currentIndex={currentIndex}
            onSelectProperty={handleSelectProperty}
          />

          <PersonSelector />

          <PropertyCard
            property={currentProperty}
            selectedPersonIndex={currentPersonIndex}
            currentIndex={currentIndex}
            totalProperties={canvassableProperties.length}
            onPrevious={handlePreviousHome}
            onNext={handleNextHome}
            onSaveProperty={handleSaveProperty}
          />
        </div>
      </>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content">
        <Header currentUser={currentUser} />

        <Routes>
          <Route path="/" element={<DashboardPage />} />

          <Route path="/routes" element={<RoutesPage />} />

          <Route path="/progress" element={<ProgressPage />} />

          <Route path="/addresses" element={<AddressesPeoplePage />} />

          <Route
            path="/settings"
            element={
              <SettingsPage
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
                onUpdateUser={handleUpdateUser}
              />
            }
          />

          <Route
            path="*"
            element={
              <div className="page-heading">
                <h1>Page Not Found</h1>

                <p>The page you requested does not exist.</p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
