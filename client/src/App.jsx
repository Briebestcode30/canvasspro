import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import "./App.css";

import Progress from "./pages/Progress";

import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import DashboardStats from "./components/DashboardStats/DashboardStats";
import RouteList from "./components/RouteList/RouteList";
import RouteMap from "./components/RouteMap/RouteMap";
import PropertyCard from "./components/PropertyCard/PropertyCard";

import initialProperties from "./data/properties";
import { optimizeRoute } from "./utils/routeUtils";

function App() {
  const [properties, setProperties] = useState(initialProperties);
  const [currentIndex, setCurrentIndex] = useState(0);

  const canvassableProperties = properties.filter(
    (property) => !property.redDoor,
  );

  const currentProperty = canvassableProperties[currentIndex];

  function handleNextHome() {
    if (currentIndex < canvassableProperties.length - 1) {
      setCurrentIndex((current) => current + 1);
    }
  }

  function handlePreviousHome() {
    if (currentIndex > 0) {
      setCurrentIndex((current) => current - 1);
    }
  }

  function handleSaveProperty(updatedProperty) {
    const updatedProperties = properties.map((property) =>
      property.id === updatedProperty.id ? updatedProperty : property,
    );

    setProperties(updatedProperties);

    if (updatedProperty.redDoor) {
      const remainingProperties = updatedProperties.filter(
        (property) => !property.redDoor,
      );

      if (remainingProperties.length === 0) {
        setCurrentIndex(0);
        return;
      }

      setCurrentIndex((current) =>
        Math.min(current, remainingProperties.length - 1),
      );
    }
  }

  function handleOptimizeRoute() {
    const optimized = optimizeRoute(canvassableProperties);

    const redDoors = properties.filter((property) => property.redDoor);

    setProperties([...optimized, ...redDoors]);
    setCurrentIndex(0);
  }

  function DashboardPage() {
    const visitedHomes = canvassableProperties.filter(
      (property) => property.outcome || property.knocked,
    ).length;

    const remainingHomes = canvassableProperties.length - visitedHomes;

    return (
      <>
        <div className="page-heading">
          <h1>Dashboard</h1>

          <p>Overview of today&apos;s canvassing activity.</p>
        </div>

        <DashboardStats properties={canvassableProperties} />

        {canvassableProperties.length > 0 ? (
          <section className="dashboard-overview">
            <div className="dashboard-overview__card">
              <p className="dashboard-overview__label">Current Home</p>

              <h2>{currentProperty.address}</h2>

              <p>{currentProperty.homeowner}</p>

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

          <p>View and optimize today&apos;s walking route.</p>
        </div>

        <div className="canvass-workspace">
          <div className="canvass-workspace__panel">
            <RouteList
              properties={canvassableProperties}
              currentIndex={currentIndex}
              onSelectProperty={setCurrentIndex}
              onOptimizeRoute={handleOptimizeRoute}
            />

            <PropertyCard
              property={currentProperty}
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
            onSelectProperty={setCurrentIndex}
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

          <p>View and filter the people on today&apos;s route.</p>
        </div>

        <div className="addresses-layout">
          <RouteList
            properties={canvassableProperties}
            currentIndex={currentIndex}
            onSelectProperty={setCurrentIndex}
          />

          <PropertyCard
            property={currentProperty}
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
