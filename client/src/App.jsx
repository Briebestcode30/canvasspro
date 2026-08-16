import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import "./App.css";

import Progress from "./pages/Progress";
import SettingsPage from "./pages/Settings";

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

function App() {
  const [properties, setProperties] = useState(initialProperties);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);

  const [showAddPersonForm, setShowAddPersonForm] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  const canvassableProperties = properties.filter(
    (property) => !property.redDoor,
  );

  const currentProperty = canvassableProperties[currentIndex];

  const currentPeople = Array.isArray(currentProperty?.people)
    ? currentProperty.people
    : [];

  const currentPerson = currentPeople[currentPersonIndex];

  function createEmptyPerson(name, age) {
    return {
      id: Date.now() + Math.random(),
      name,
      age,
      phone: "",
      email: "",
      notes: "",
      outcome: "",
      knocked: false,
      importantIssue: "",
      industries: [],
      ctaSigned: null,
      waMembershipJoin: false,
      textMessageOk: false,
      hotContact: false,
    };
  }

  function isPropertyVisited(property) {
    return Boolean(
      property.people?.some((person) => person.outcome || person.knocked),
    );
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

  function handleAddPerson({ name, age }) {
    if (!currentProperty) {
      return;
    }

    const newPerson = createEmptyPerson(name, age);
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

  function handleAddNewAddress({ address, name, age }) {
    const newPerson = createEmptyPerson(name, age);

    const fallbackLatitude =
      currentProperty?.latitude ?? canvassableProperties[0]?.latitude ?? 0;

    const fallbackLongitude =
      currentProperty?.longitude ?? canvassableProperties[0]?.longitude ?? 0;

    const newProperty = {
      id: Date.now(),
      address,
      redDoor: false,
      latitude: fallbackLatitude,
      longitude: fallbackLongitude,
      needsGeocoding: true,
      people: [newPerson],
    };

    const newIndex = canvassableProperties.length;

    setProperties((currentProperties) => [...currentProperties, newProperty]);

    setCurrentIndex(newIndex);
    setCurrentPersonIndex(0);
    setShowAddAddressForm(false);
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

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Header />

        <Routes>
          <Route path="/" element={<DashboardPage />} />

          <Route path="/routes" element={<RoutesPage />} />

          <Route path="/progress" element={<ProgressPage />} />

          <Route path="/addresses" element={<AddressesPeoplePage />} />

          <Route path="/settings" element={<SettingsPage />} />

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
