import { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import DashboardStats from "./components/DashboardStats/DashboardStats";
import RouteList from "./components/RouteList/RouteList";
import RouteMap from "./components/RouteMap/RouteMap";
import PropertyCard from "./components/PropertyCard/PropertyCard";
import initialProperties from "./data/properties";

function App() {
  const [properties, setProperties] = useState(initialProperties);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentProperty = properties[currentIndex];

  function handleNextHome() {
    if (currentIndex < properties.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handlePreviousHome() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function handleSaveProperty(updatedProperty) {
    setProperties((currentProperties) =>
      currentProperties.map((property) =>
        property.id === updatedProperty.id ? updatedProperty : property,
      ),
    );
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Header />

        <DashboardStats properties={properties} />
        <div className="canvass-workspace">
          <div className="canvass-workspace__panel">
            <RouteList
              properties={properties}
              currentIndex={currentIndex}
              onSelectProperty={setCurrentIndex}
            />

            <PropertyCard
              property={currentProperty}
              currentIndex={currentIndex}
              totalProperties={properties.length}
              onPrevious={handlePreviousHome}
              onNext={handleNextHome}
              onSaveProperty={handleSaveProperty}
            />
          </div>

          <RouteMap
            properties={properties}
            currentIndex={currentIndex}
            onSelectProperty={setCurrentIndex}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
