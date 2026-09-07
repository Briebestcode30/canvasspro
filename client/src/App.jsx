import { useEffect, useMemo, useRef, useState } from "react";

import { NavLink, Route, Routes, useNavigate } from "react-router-dom";

import { UserPlus } from "lucide-react";

import "./App.css";

import Progress from "./pages/Progress";
import SettingsPage from "./pages/Settings";
import Login from "./pages/Login";
import CanvassScript from "./pages/CanvassScript";

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

/* =========================
   STORAGE
========================= */

const STORAGE_KEYS = {
  properties: "canvassnow-properties",

  shiftNotes: "canvassnow-shift-notes",

  hourlyAnalysis: "canvassnow-hourly-analysis",

  profile: "canvassnow-profile",

  backSheet: "canvassnow-back-sheet",
};

/* =========================
   HOURLY ANALYSIS
========================= */

const ANALYSIS_TIMES = ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"];

const ANALYSIS_REMINDER_HOURS = {
  16: "4:00 PM",
  17: "5:00 PM",
  18: "6:00 PM",
  19: "7:00 PM",
  20: "8:00 PM",
};

function createEmptyHourlyAnalysis() {
  return {
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
}

/* =========================
   LOCAL STORAGE HELPER
========================= */

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

/* =========================
   VISIT HELPERS
========================= */

function isPersonVisited(person) {
  const hasCtaResponse =
    person?.ctaSigned === true || person?.ctaSigned === false;

  const hasIndustry =
    Array.isArray(person?.industries) && person.industries.length > 0;

  const hasNotes =
    typeof person?.notes === "string" && person.notes.trim() !== "";

  return Boolean(
    person?.outcome ||
    person?.knocked === true ||
    hasCtaResponse ||
    person?.importantIssue ||
    hasIndustry ||
    person?.waMembershipJoin === true ||
    person?.textMessageOk === true ||
    person?.hotContact === true ||
    hasNotes,
  );
}

function isPropertyVisited(property) {
  const people = Array.isArray(property?.people) ? property.people : [];

  return people.some((person) => isPersonVisited(person));
}

/* =========================
   DASHBOARD PAGE
========================= */

function DashboardPage({
  canvassableProperties,
  currentProperty,
  currentPerson,
  currentIndex,
  shiftNotes,
  onShiftNotesChange,
  hourlyAnalysis,
  onAnalysisChange,
  onSaveAnalysis,
  onClearAnalysis,
  onSubmitBackSheet,
}) {
  const visitedHomes = canvassableProperties.filter(isPropertyVisited).length;

  const remainingHomes = Math.max(
    canvassableProperties.length - visitedHomes,
    0,
  );

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

            <h2>{currentProperty.address || "Address unavailable"}</h2>

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

      {/* =====================
          SHIFT NOTES
      ===================== */}

      <section className="dashboard-shift">
        <div className="dashboard-shift__notes">
          <h2>Shift Notes</h2>

          <p className="dashboard-shift__helper">
            Add notes that apply to the entire shift.
          </p>

          <textarea
            value={shiftNotes}
            onChange={(event) => {
              if (typeof onShiftNotesChange === "function") {
                onShiftNotesChange(event.target.value);
              }
            }}
            placeholder="Enter shift notes..."
          />
        </div>

        {/* =====================
            HOURLY ANALYSIS
        ===================== */}

        <div className="dashboard-analysis">
          <h2>Hourly Plus / Delta / Plus</h2>

          <p className="dashboard-analysis__helper">
            Record what went well, what can improve, and another positive for
            each hour.
          </p>

          <div className="dashboard-analysis__list">
            {ANALYSIS_TIMES.map((time) => (
              <div
                key={time}
                className="dashboard-analysis__hour"
                id={`analysis-${time.replaceAll(" ", "-")}`}
              >
                <span className="dashboard-analysis__time">{time}</span>

                <div className="dashboard-analysis__fields">
                  <label className="dashboard-analysis__field">
                    <span>Plus</span>

                    <input
                      type="text"
                      value={hourlyAnalysis?.[time]?.plusOne || ""}
                      onChange={(event) => {
                        if (typeof onAnalysisChange === "function") {
                          onAnalysisChange(time, "plusOne", event.target.value);
                        }
                      }}
                      placeholder="What went well?"
                    />
                  </label>

                  <label className="dashboard-analysis__field">
                    <span>Delta</span>

                    <input
                      type="text"
                      value={hourlyAnalysis?.[time]?.delta || ""}
                      onChange={(event) => {
                        if (typeof onAnalysisChange === "function") {
                          onAnalysisChange(time, "delta", event.target.value);
                        }
                      }}
                      placeholder="What can improve?"
                    />
                  </label>

                  <label className="dashboard-analysis__field">
                    <span>Plus</span>

                    <input
                      type="text"
                      value={hourlyAnalysis?.[time]?.plusTwo || ""}
                      onChange={(event) => {
                        if (typeof onAnalysisChange === "function") {
                          onAnalysisChange(time, "plusTwo", event.target.value);
                        }
                      }}
                      placeholder="Another positive"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-analysis__actions">
            <button
              type="button"
              className="dashboard-analysis__save"
              onClick={onSaveAnalysis}
            >
              Save Analysis
            </button>

            <button
              type="button"
              className="dashboard-analysis__clear"
              onClick={onClearAnalysis}
            >
              Clear Analysis
            </button>
          </div>
        </div>
      </section>

      {/* =====================
          BACK SHEET
      ===================== */}

      <section className="dashboard-back-sheet">
        <button
          type="button"
          className="dashboard-back-sheet__submit"
          onClick={onSubmitBackSheet}
        >
          Submit Back Sheet
        </button>
      </section>
    </>
  );
}

/* =========================
   PERSON SELECTOR
========================= */

function PersonSelector({
  currentProperty,
  currentPeople = [],
  currentPersonIndex = 0,
  onSelectPerson,
}) {
  if (!currentProperty) {
    return null;
  }

  return (
    <section className="person-selector" aria-label="People at this address">
      <div className="person-selector__header">
        <h3>People at this address</h3>

        <span>
          {currentPeople.length}{" "}
          {currentPeople.length === 1 ? "Person" : "People"}
        </span>
      </div>

      {currentPeople.length > 0 ? (
        <div className="person-selector__list">
          {currentPeople.map((person, index) => (
            <button
              key={person?.id ?? `${person?.name}-${index}`}
              type="button"
              className={`person-selector__button ${
                index === currentPersonIndex
                  ? "person-selector__button--active"
                  : ""
              }`}
              onClick={() => {
                if (typeof onSelectPerson === "function") {
                  onSelectPerson(index);
                }
              }}
              aria-pressed={index === currentPersonIndex}
            >
              <span>{person?.name || "Unnamed Person"}</span>

              <small>Age {person?.age ?? "—"}</small>
            </button>
          ))}
        </div>
      ) : (
        <p>No people are currently assigned to this address.</p>
      )}
    </section>
  );
}

/* =========================
   ROUTES PAGE
========================= */

function RoutesPage({
  canvassableProperties,
  currentProperty,
  currentPeople,
  currentPersonIndex,
  currentIndex,
  onSelectProperty,
  onSelectPerson,
  onOptimizeRoute,
  onPreviousHome,
  onNextHome,
  onSaveProperty,
}) {
  if (!currentProperty) {
    return <p>No canvassable addresses remain.</p>;
  }

  return (
    <>
      <div className="page-heading">
        <h1>Routes</h1>
      </div>

      <nav className="route-page-links" aria-label="Route page links">
        <NavLink to="/">Dashboard</NavLink>

        <NavLink to="/progress">Progress</NavLink>

        <NavLink to="/addresses">Addresses / People</NavLink>

        <NavLink to="/script">Canvass Script</NavLink>

        <NavLink to="/settings">Settings</NavLink>
      </nav>

      <div className="canvass-workspace">
        <div className="canvass-workspace__panel">
          <RouteList
            properties={canvassableProperties}
            currentIndex={currentIndex}
            onSelectProperty={onSelectProperty}
            onOptimizeRoute={onOptimizeRoute}
          />

          <PersonSelector
            currentProperty={currentProperty}
            currentPeople={currentPeople}
            currentPersonIndex={currentPersonIndex}
            onSelectPerson={onSelectPerson}
          />

          <PropertyCard
            property={currentProperty}
            selectedPersonIndex={currentPersonIndex}
            currentIndex={currentIndex}
            totalProperties={canvassableProperties.length}
            onPrevious={onPreviousHome}
            onNext={onNextHome}
            onSaveProperty={onSaveProperty}
          />
        </div>

        <RouteMap
          properties={canvassableProperties}
          currentIndex={currentIndex}
          onSelectProperty={onSelectProperty}
        />
      </div>
    </>
  );
}

/* =========================
   ADDRESSES / PEOPLE PAGE
========================= */

function AddressesPeoplePage({
  canvassableProperties,
  currentProperty,
  currentPeople,
  currentPersonIndex,
  currentIndex,
  showAddPersonForm,
  showAddAddressForm,
  onOpenAddPersonForm,
  onOpenAddAddressForm,
  onCloseAddPersonForm,
  onCloseAddAddressForm,
  onAddPerson,
  onAddAddress,
  onSelectProperty,
  onSelectPerson,
  onPreviousHome,
  onNextHome,
  onSaveProperty,
}) {
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
          className="addresses-actions__button addresses-actions__button--person"
          onClick={onOpenAddPersonForm}
          aria-label="Add person to current address"
          title="Add Person"
        >
          <UserPlus size={24} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="addresses-actions__button addresses-actions__button--secondary"
          onClick={onOpenAddAddressForm}
        >
          Add New Address / Person
        </button>
      </div>

      {showAddPersonForm && (
        <AddPersonForm
          address={currentProperty.address}
          onAddPerson={onAddPerson}
          onCancel={onCloseAddPersonForm}
        />
      )}

      {showAddAddressForm && (
        <AddAddressForm
          onAddAddress={onAddAddress}
          onCancel={onCloseAddAddressForm}
        />
      )}

      <div className="addresses-layout">
        <RouteList
          properties={canvassableProperties}
          currentIndex={currentIndex}
          onSelectProperty={onSelectProperty}
        />

        <PersonSelector
          currentProperty={currentProperty}
          currentPeople={currentPeople}
          currentPersonIndex={currentPersonIndex}
          onSelectPerson={onSelectPerson}
        />

        <PropertyCard
          property={currentProperty}
          selectedPersonIndex={currentPersonIndex}
          currentIndex={currentIndex}
          totalProperties={canvassableProperties.length}
          onPrevious={onPreviousHome}
          onNext={onNextHome}
          onSaveProperty={onSaveProperty}
        />
      </div>
    </>
  );
}

/* =========================
   APP
========================= */

function App() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState(() => {
    const storedProperties = loadStoredValue(
      STORAGE_KEYS.properties,
      initialProperties,
    );

    return Array.isArray(storedProperties)
      ? storedProperties
      : initialProperties;
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);

  const [showAddPersonForm, setShowAddPersonForm] = useState(false);

  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [shiftNotes, setShiftNotes] = useState(() =>
    loadStoredValue(STORAGE_KEYS.shiftNotes, ""),
  );

  const [hourlyAnalysis, setHourlyAnalysis] = useState(() => {
    const storedAnalysis = loadStoredValue(
      STORAGE_KEYS.hourlyAnalysis,
      createEmptyHourlyAnalysis(),
    );

    return {
      ...createEmptyHourlyAnalysis(),
      ...(storedAnalysis && typeof storedAnalysis === "object"
        ? storedAnalysis
        : {}),
    };
  });

  const [analysisReminder, setAnalysisReminder] = useState(null);

  const [analysisScrollTarget, setAnalysisScrollTarget] = useState(null);

  const lastReminderRef = useRef("");

  const isLoggedIn = Boolean(currentUser);

  /* =========================
     CANVASSABLE PROPERTIES
  ========================= */

  const canvassableProperties = useMemo(
    () => properties.filter((property) => property?.redDoor !== true),
    [properties],
  );

  const currentProperty = canvassableProperties[currentIndex];

  const currentPeople = Array.isArray(currentProperty?.people)
    ? currentProperty.people
    : [];

  const currentPerson = currentPeople[currentPersonIndex];

  /* =========================
     SAVE PROPERTIES
  ========================= */

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

  /* =========================
     SAVE SHIFT NOTES
  ========================= */

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

  /* =========================
     KEEP HOME INDEX VALID
  ========================= */

  useEffect(() => {
    if (canvassableProperties.length === 0) {
      if (currentIndex !== 0) {
        setCurrentIndex(0);
      }

      if (currentPersonIndex !== 0) {
        setCurrentPersonIndex(0);
      }

      return;
    }

    if (currentIndex >= canvassableProperties.length) {
      setCurrentIndex(canvassableProperties.length - 1);

      setCurrentPersonIndex(0);
    }
  }, [canvassableProperties.length, currentIndex, currentPersonIndex]);

  /* =========================
     KEEP PERSON INDEX VALID
  ========================= */

  useEffect(() => {
    if (currentPeople.length === 0) {
      if (currentPersonIndex !== 0) {
        setCurrentPersonIndex(0);
      }

      return;
    }

    if (currentPersonIndex >= currentPeople.length) {
      setCurrentPersonIndex(currentPeople.length - 1);
    }
  }, [currentPeople.length, currentPersonIndex]);

  /* =========================
     HOURLY REMINDERS
  ========================= */

  useEffect(() => {
    if (!isLoggedIn) {
      return undefined;
    }

    function checkHourlyAnalysisReminder() {
      const now = new Date();

      const reminderTime = ANALYSIS_REMINDER_HOURS[now.getHours()];

      if (!reminderTime) {
        return;
      }

      const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

      const reminderKey = `${todayKey}-${reminderTime}`;

      if (lastReminderRef.current === reminderKey) {
        return;
      }

      const analysis = hourlyAnalysis?.[reminderTime];

      const analysisComplete = Boolean(
        analysis?.plusOne?.trim() &&
        analysis?.delta?.trim() &&
        analysis?.plusTwo?.trim(),
      );

      if (analysisComplete) {
        lastReminderRef.current = reminderKey;

        return;
      }

      lastReminderRef.current = reminderKey;

      setAnalysisReminder(reminderTime);
    }

    checkHourlyAnalysisReminder();

    const reminderInterval = window.setInterval(
      checkHourlyAnalysisReminder,
      60 * 1000,
    );

    return () => {
      window.clearInterval(reminderInterval);
    };
  }, [hourlyAnalysis, isLoggedIn]);

  /* =========================
     SCROLL TO ANALYSIS HOUR
  ========================= */

  useEffect(() => {
    if (!analysisScrollTarget) {
      return undefined;
    }

    const targetId = `analysis-${analysisScrollTarget.replaceAll(" ", "-")}`;

    const scrollTimer = window.setTimeout(() => {
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        const firstInput = targetElement.querySelector("input");

        if (firstInput) {
          window.setTimeout(() => {
            firstInput.focus({
              preventScroll: true,
            });
          }, 500);
        }
      }

      setAnalysisScrollTarget(null);
    }, 150);

    return () => {
      window.clearTimeout(scrollTimer);
    };
  }, [analysisScrollTarget]);

  /* =========================
     LOGIN
  ========================= */

  function handleLogin({ email }) {
    const normalizedEmail = email?.trim() || "";

    if (!normalizedEmail) {
      return;
    }

    const savedProfile = loadStoredValue(STORAGE_KEYS.profile, null);

    if (
      savedProfile &&
      savedProfile.email?.trim().toLowerCase() === normalizedEmail.toLowerCase()
    ) {
      setCurrentUser(savedProfile);

      return;
    }

    setCurrentUser({
      fullName: "",
      email: normalizedEmail,
      position: "Canvasser",
      organizationRole: "Canvasser",
      licenseImage: "",
    });
  }

  /* =========================
     LOGOUT
  ========================= */

  function handleLogout() {
    setCurrentUser(null);

    setCurrentIndex(0);

    setCurrentPersonIndex(0);

    setShowAddPersonForm(false);

    setShowAddAddressForm(false);

    setAnalysisReminder(null);

    setAnalysisScrollTarget(null);

    navigate("/");
  }

  /* =========================
     UPDATE PROFILE
  ========================= */

  function handleUpdateUser(updatedUser) {
    if (!updatedUser) {
      return;
    }

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

  /* =========================
     SELECT PROPERTY
  ========================= */

  function handleSelectProperty(index) {
    if (index < 0 || index >= canvassableProperties.length) {
      return;
    }

    setCurrentIndex(index);

    setCurrentPersonIndex(0);

    setShowAddPersonForm(false);

    setShowAddAddressForm(false);
  }

  /* =========================
     SELECT PERSON
  ========================= */

  function handleSelectPerson(index) {
    if (index < 0 || index >= currentPeople.length) {
      return;
    }

    setCurrentPersonIndex(index);
  }

  /* =========================
     NEXT HOME
  ========================= */

  function handleNextHome() {
    if (currentIndex < canvassableProperties.length - 1) {
      setCurrentIndex((current) => current + 1);

      setCurrentPersonIndex(0);

      setShowAddPersonForm(false);

      setShowAddAddressForm(false);
    }
  }

  /* =========================
     PREVIOUS HOME
  ========================= */

  function handlePreviousHome() {
    if (currentIndex > 0) {
      setCurrentIndex((current) => current - 1);

      setCurrentPersonIndex(0);

      setShowAddPersonForm(false);

      setShowAddAddressForm(false);
    }
  }

  /* =========================
     SAVE PROPERTY
  ========================= */

  function handleSaveProperty(updatedProperty) {
    if (!updatedProperty?.id) {
      return;
    }

    setProperties((currentProperties) =>
      currentProperties.map((property) =>
        property?.id === updatedProperty.id ? updatedProperty : property,
      ),
    );
  }

  /* =========================
     ADD PERSON FORM
  ========================= */

  function handleOpenAddPersonForm() {
    setShowAddPersonForm(true);

    setShowAddAddressForm(false);
  }

  function handleOpenAddAddressForm() {
    setShowAddAddressForm(true);

    setShowAddPersonForm(false);
  }

  /* =========================
     ADD PERSON
  ========================= */

  function handleAddPerson(person) {
    if (!currentProperty || !person) {
      return;
    }

    const newPerson = {
      id: Date.now() + Math.random(),

      name: person.name?.trim() || "Unnamed Person",

      age: person.age,

      phone: person.phone?.trim() || "",

      email: person.email?.trim() || "",

      notes: person.notes?.trim() || "",

      outcome: person.outcome || "",

      knocked: Boolean(person.knocked),

      inaccessibleReason:
        person.outcome === "Inaccessible"
          ? person.inaccessibleReason || ""
          : "",

      importantIssue: person.importantIssue || "",

      industries: Array.isArray(person.industries) ? person.industries : [],

      ctaSigned: person.ctaSigned ?? null,

      waMembershipJoin: Boolean(person.waMembershipJoin),

      textMessageOk: Boolean(person.textMessageOk),

      hotContact: Boolean(person.hotContact),
    };

    const newPersonIndex = currentPeople.length;

    setProperties((currentProperties) =>
      currentProperties.map((property) =>
        property?.id === currentProperty.id
          ? {
              ...property,

              people: [
                ...(Array.isArray(property.people) ? property.people : []),

                newPerson,
              ],
            }
          : property,
      ),
    );

    setCurrentPersonIndex(newPersonIndex);

    setShowAddPersonForm(false);
  }

  /* =========================
     ADD NEW ADDRESS
  ========================= */

  async function handleAddNewAddress({ address, person }) {
    if (!address || !person) {
      return;
    }

    try {
      const location = await geocodeAddress(address);

      if (
        !Number.isFinite(location?.latitude) ||
        !Number.isFinite(location?.longitude)
      ) {
        throw new Error("Map coordinates were not returned for this address.");
      }

      const newPerson = {
        id: Date.now() + Math.random(),

        name: person.name?.trim() || "Unnamed Person",

        age: person.age,

        phone: person.phone?.trim() || "",

        email: person.email?.trim() || "",

        notes: person.notes?.trim() || "",

        outcome: person.outcome || "",

        knocked: Boolean(person.knocked),

        inaccessibleReason:
          person.outcome === "Inaccessible"
            ? person.inaccessibleReason || ""
            : "",

        importantIssue: person.importantIssue || "",

        industries: Array.isArray(person.industries) ? person.industries : [],

        ctaSigned: person.ctaSigned ?? null,

        waMembershipJoin: Boolean(person.waMembershipJoin),

        textMessageOk: Boolean(person.textMessageOk),

        hotContact: Boolean(person.hotContact),
      };

      const newProperty = {
        id: Date.now(),

        address: location.label || address.trim(),

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
        error?.message ||
          "The address could not be found. Please check the address and try again.",
      );
    }
  }

  /* =========================
     OPTIMIZE ROUTE
  ========================= */

  function handleOptimizeRoute() {
    const propertiesWithCoordinates = canvassableProperties.filter(
      (property) =>
        Number.isFinite(property?.latitude) &&
        Number.isFinite(property?.longitude),
    );

    if (propertiesWithCoordinates.length < 2) {
      return;
    }

    const optimized = optimizeRoute(propertiesWithCoordinates);

    const propertiesWithoutCoordinates = canvassableProperties.filter(
      (property) =>
        !Number.isFinite(property?.latitude) ||
        !Number.isFinite(property?.longitude),
    );

    const redDoors = properties.filter(
      (property) => property?.redDoor === true,
    );

    setProperties([...optimized, ...propertiesWithoutCoordinates, ...redDoors]);

    setCurrentIndex(0);

    setCurrentPersonIndex(0);
  }

  /* =========================
     HOURLY ANALYSIS CHANGE
  ========================= */

  function handleAnalysisChange(time, field, value) {
    setHourlyAnalysis((currentAnalysis) => ({
      ...currentAnalysis,

      [time]: {
        ...currentAnalysis?.[time],

        [field]: value,
      },
    }));
  }

  /* =========================
     SAVE ANALYSIS
  ========================= */

  function handleSaveAnalysis() {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.hourlyAnalysis,
        JSON.stringify(hourlyAnalysis),
      );

      window.alert("Hourly analysis saved.");
    } catch (error) {
      console.error("Could not save hourly analysis:", error);

      window.alert("The hourly analysis could not be saved.");
    }
  }

  /* =========================
     CLEAR ANALYSIS
  ========================= */

  function handleClearAnalysis() {
    const confirmed = window.confirm("Clear all hourly analysis responses?");

    if (!confirmed) {
      return;
    }

    const emptyAnalysis = createEmptyHourlyAnalysis();

    setHourlyAnalysis(emptyAnalysis);

    try {
      window.localStorage.setItem(
        STORAGE_KEYS.hourlyAnalysis,
        JSON.stringify(emptyAnalysis),
      );
    } catch (error) {
      console.error("Could not clear hourly analysis:", error);
    }

    setAnalysisReminder(null);

    setAnalysisScrollTarget(null);

    lastReminderRef.current = "";
  }

  /* =========================
     SUBMIT BACK SHEET
  ========================= */

  function handleSubmitBackSheet() {
    const visitedHomes = canvassableProperties.filter(isPropertyVisited).length;

    const backSheet = {
      submittedAt: new Date().toISOString(),

      canvasser: {
        fullName: currentUser?.fullName || "",

        email: currentUser?.email || "",

        position:
          currentUser?.position || currentUser?.organizationRole || "Canvasser",
      },

      shiftNotes,

      hourlyAnalysis,

      routeSummary: {
        totalHomes: canvassableProperties.length,

        visitedHomes,

        remainingHomes: Math.max(
          canvassableProperties.length - visitedHomes,
          0,
        ),
      },
    };

    try {
      window.localStorage.setItem(
        STORAGE_KEYS.hourlyAnalysis,
        JSON.stringify(hourlyAnalysis),
      );

      window.localStorage.setItem(
        STORAGE_KEYS.shiftNotes,
        JSON.stringify(shiftNotes),
      );

      window.localStorage.setItem(
        STORAGE_KEYS.backSheet,
        JSON.stringify(backSheet),
      );

      /*
        This currently saves to this
        device only. It is not yet
        being sent to the backend.
      */

      window.alert("Back sheet saved as submitted on this device.");
    } catch (error) {
      console.error("Could not save back sheet:", error);

      window.alert("The back sheet could not be saved.");
    }
  }

  /* =========================
     OPEN ANALYSIS REMINDER
  ========================= */

  function handleOpenAnalysisReminder() {
    if (!analysisReminder) {
      return;
    }

    setAnalysisScrollTarget(analysisReminder);

    setAnalysisReminder(null);

    navigate("/");
  }

  /* =========================
     LOGIN SCREEN
  ========================= */

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  /* =========================
     APP
  ========================= */

  return (
    <div className="app">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content">
        <Header currentUser={currentUser} />

        {/* =====================
            ANALYSIS REMINDER
        ===================== */}

        {analysisReminder && (
          <div className="analysis-reminder" role="alert">
            <div className="analysis-reminder__content">
              <strong>{analysisReminder} Hourly Analysis</strong>

              <span>Time to complete your Plus / Delta / Plus.</span>
            </div>

            <div className="analysis-reminder__actions">
              <button
                type="button"
                className="analysis-reminder__open"
                onClick={handleOpenAnalysisReminder}
              >
                Open Analysis
              </button>

              <button
                type="button"
                className="analysis-reminder__dismiss"
                onClick={() => setAnalysisReminder(null)}
                aria-label="Dismiss hourly analysis reminder"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* =====================
            ROUTES
        ===================== */}

        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                canvassableProperties={canvassableProperties}
                currentProperty={currentProperty}
                currentPerson={currentPerson}
                currentIndex={currentIndex}
                shiftNotes={shiftNotes}
                onShiftNotesChange={setShiftNotes}
                hourlyAnalysis={hourlyAnalysis}
                onAnalysisChange={handleAnalysisChange}
                onSaveAnalysis={handleSaveAnalysis}
                onClearAnalysis={handleClearAnalysis}
                onSubmitBackSheet={handleSubmitBackSheet}
              />
            }
          />

          <Route
            path="/routes"
            element={
              <RoutesPage
                canvassableProperties={canvassableProperties}
                currentProperty={currentProperty}
                currentPeople={currentPeople}
                currentPersonIndex={currentPersonIndex}
                currentIndex={currentIndex}
                onSelectProperty={handleSelectProperty}
                onSelectPerson={handleSelectPerson}
                onOptimizeRoute={handleOptimizeRoute}
                onPreviousHome={handlePreviousHome}
                onNextHome={handleNextHome}
                onSaveProperty={handleSaveProperty}
              />
            }
          />

          <Route
            path="/progress"
            element={<Progress properties={canvassableProperties} />}
          />

          <Route
            path="/addresses"
            element={
              <AddressesPeoplePage
                canvassableProperties={canvassableProperties}
                currentProperty={currentProperty}
                currentPeople={currentPeople}
                currentPersonIndex={currentPersonIndex}
                currentIndex={currentIndex}
                showAddPersonForm={showAddPersonForm}
                showAddAddressForm={showAddAddressForm}
                onOpenAddPersonForm={handleOpenAddPersonForm}
                onOpenAddAddressForm={handleOpenAddAddressForm}
                onCloseAddPersonForm={() => setShowAddPersonForm(false)}
                onCloseAddAddressForm={() => setShowAddAddressForm(false)}
                onAddPerson={handleAddPerson}
                onAddAddress={handleAddNewAddress}
                onSelectProperty={handleSelectProperty}
                onSelectPerson={handleSelectPerson}
                onPreviousHome={handlePreviousHome}
                onNextHome={handleNextHome}
                onSaveProperty={handleSaveProperty}
              />
            }
          />

          <Route path="/script" element={<CanvassScript />} />

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
