import { useMemo, useState } from "react";
import { CheckCircle2, Filter, Search } from "lucide-react";

import "./RouteList.css";

function RouteList({
  properties = [],
  currentIndex = 0,
  onSelectProperty,
  onOptimizeRoute,
}) {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  function getPeople(property) {
    return Array.isArray(property?.people) ? property.people : [];
  }

  function isPersonCanvassed(person) {
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

  function isPropertyCanvassed(property) {
    const people = getPeople(property);

    return people.some((person) => isPersonCanvassed(person));
  }

  function getStatus(property) {
    const people = getPeople(property);

    if (people.length === 0) {
      return "No People";
    }

    const canvassedPeople = people.filter((person) =>
      isPersonCanvassed(person),
    );

    if (canvassedPeople.length === 0) {
      return "Not Visited";
    }

    if (canvassedPeople.length === people.length) {
      return "Canvassed";
    }

    return `${canvassedPeople.length} of ${people.length} Canvassed`;
  }

  function matchesFilter(property) {
    const people = getPeople(property);

    switch (filter) {
      case "All":
        return true;

      case "Canvassed":
        return isPropertyCanvassed(property);

      case "Not Visited":
        return !isPropertyCanvassed(property);

      case "Not Home":
        return people.some((person) => person?.outcome === "Not Home");

      case "Refused":
        return people.some((person) => person?.outcome === "Refused");

      case "Inaccessible":
        return people.some((person) => person?.outcome === "Inaccessible");

      default:
        return true;
    }
  }

  function matchesSearch(property) {
    const searchValue = searchTerm.trim().toLowerCase();

    if (!searchValue) {
      return true;
    }

    const address =
      typeof property?.address === "string"
        ? property.address.toLowerCase()
        : "";

    const people = getPeople(property);

    const matchesPerson = people.some((person) => {
      const personName =
        typeof person?.name === "string" ? person.name.toLowerCase() : "";

      return personName.includes(searchValue);
    });

    return address.includes(searchValue) || matchesPerson;
  }

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      return matchesFilter(property) && matchesSearch(property);
    });
  }, [properties, filter, searchTerm]);

  const totalPeople = useMemo(() => {
    return properties.reduce((total, property) => {
      return total + getPeople(property).length;
    }, 0);
  }, [properties]);

  const hasActiveSearch = searchTerm.trim() !== "" || filter !== "All";

  const hasCurrentProperty =
    properties.length > 0 &&
    currentIndex >= 0 &&
    currentIndex < properties.length;

  function handleClear() {
    setSearchTerm("");
    setFilter("All");
  }

  function handleSelectProperty(index) {
    if (
      typeof onSelectProperty !== "function" ||
      index < 0 ||
      index >= properties.length
    ) {
      return;
    }

    onSelectProperty(index);
  }

  function handleOptimizeRoute() {
    if (typeof onOptimizeRoute === "function") {
      onOptimizeRoute();
    }
  }

  return (
    <section className="route-list" aria-label="Today's route">
      <div className="route-list__header">
        <div>
          <p className="route-list__eyebrow">Addresses / People</p>

          <h2>Today's Route</h2>
        </div>

        <div className="route-list__progress">
          <span className="route-list__count">
            {properties.length} {properties.length === 1 ? "Home" : "Homes"}
          </span>

          <span className="route-list__people-count">
            {totalPeople} {totalPeople === 1 ? "Person" : "People"}
          </span>

          {hasCurrentProperty && (
            <span className="route-list__position">
              Home {currentIndex + 1} of {properties.length}
            </span>
          )}
        </div>
      </div>

      <div className="route-list__search-row">
        <div className="route-list__search">
          <Search size={18} aria-hidden="true" />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search address or person"
            aria-label="Search address or person"
          />
        </div>

        {hasActiveSearch && (
          <button
            type="button"
            className="route-list__clear"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>

      <div className="route-list__filter">
        <label htmlFor="address-filter">
          <Filter size={18} aria-hidden="true" />

          <span>Filter</span>
        </label>

        <select
          id="address-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="All">All</option>

          <option value="Canvassed">Canvassed</option>

          <option value="Not Visited">Not Visited</option>

          <option value="Not Home">Not Home</option>

          <option value="Refused">Refused</option>

          <option value="Inaccessible">Inaccessible</option>
        </select>
      </div>

      {typeof onOptimizeRoute === "function" && (
        <button
          type="button"
          className="route-list__optimize"
          onClick={handleOptimizeRoute}
        >
          Optimize Walking Route
        </button>
      )}

      <p className="route-list__results" aria-live="polite">
        Showing {filteredProperties.length} of {properties.length}{" "}
        {properties.length === 1 ? "address" : "addresses"}
      </p>

      <div className="route-list__items">
        {filteredProperties.map((property) => {
          const actualIndex = properties.findIndex(
            (item) => item?.id === property?.id,
          );

          const people = getPeople(property);

          const completed = isPropertyCanvassed(property);

          const isCurrent = actualIndex === currentIndex;

          return (
            <button
              key={property?.id ?? `${property?.address}-${actualIndex}`}
              type="button"
              className={`route-list__item ${
                isCurrent ? "route-list__item--active" : ""
              }`}
              onClick={() => handleSelectProperty(actualIndex)}
              aria-current={isCurrent ? "true" : undefined}
            >
              <span className="route-list__number">{actualIndex + 1}</span>

              <span className="route-list__details">
                <span className="route-list__address">
                  {property?.address || "Address unavailable"}
                </span>

                <span className="route-list__people">
                  {people.length > 0 ? (
                    people.map((person, personIndex) => (
                      <span
                        key={person?.id ?? `${person?.name}-${personIndex}`}
                        className="route-list__person"
                      >
                        {person?.name || "Unnamed Person"}
                      </span>
                    ))
                  ) : (
                    <span className="route-list__person">
                      No person assigned
                    </span>
                  )}
                </span>

                <span
                  className={`route-list__status ${
                    completed ? "route-list__status--completed" : ""
                  }`}
                >
                  {getStatus(property)}
                </span>
              </span>

              {completed && (
                <CheckCircle2
                  className="route-list__check"
                  size={20}
                  aria-hidden="true"
                />
              )}

              {isCurrent && (
                <span className="route-list__current">Current</span>
              )}
            </button>
          );
        })}
      </div>

      {filteredProperties.length === 0 && (
        <p className="route-list__empty" role="status">
          No addresses or people match your search or selected filter.
        </p>
      )}
    </section>
  );
}

export default RouteList;
