import { useState } from "react";
import { CheckCircle2, Filter, Search } from "lucide-react";

import "./RouteList.css";

function RouteList({
  properties,
  currentIndex,
  onSelectProperty,
  onOptimizeRoute,
}) {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  function getPeople(property) {
    return Array.isArray(property.people) ? property.people : [];
  }

  function isPersonCanvassed(person) {
    return Boolean(person.outcome || person.knocked);
  }

  function isPropertyCanvassed(property) {
    return getPeople(property).some((person) => isPersonCanvassed(person));
  }

  function getStatus(property) {
    const people = getPeople(property);

    if (people.length === 0) {
      return "No People";
    }

    const canvassedPerson = people.find(
      (person) => person.outcome || person.knocked,
    );

    if (!canvassedPerson) {
      return "Not Visited";
    }

    if (canvassedPerson.outcome && canvassedPerson.knocked) {
      return `Knocked / ${canvassedPerson.outcome}`;
    }

    if (canvassedPerson.knocked) {
      return "Knocked";
    }

    if (canvassedPerson.outcome) {
      return canvassedPerson.outcome;
    }

    return "Not Visited";
  }

  function matchesFilter(property) {
    const people = getPeople(property);

    if (filter === "All") {
      return true;
    }

    if (filter === "Canvassed") {
      return people.some((person) => isPersonCanvassed(person));
    }

    if (filter === "Not Home") {
      return people.some((person) => person.outcome === "Not Home");
    }

    if (filter === "Refused") {
      return people.some((person) => person.outcome === "Refused");
    }

    return true;
  }

  function matchesSearch(property) {
    const searchValue = searchTerm.toLowerCase().trim();

    if (!searchValue) {
      return true;
    }

    const address = property.address?.toLowerCase() || "";

    const people = getPeople(property);

    const matchesPerson = people.some((person) =>
      person.name?.toLowerCase().includes(searchValue),
    );

    return address.includes(searchValue) || matchesPerson;
  }

  const filteredProperties = properties.filter(
    (property) => matchesFilter(property) && matchesSearch(property),
  );

  const hasActiveSearch = searchTerm.trim() !== "" || filter !== "All";

  function handleClear() {
    setSearchTerm("");
    setFilter("All");
  }

  return (
    <section className="route-list">
      <div className="route-list__header">
        <div>
          <p className="route-list__eyebrow">Addresses / People</p>

          <h2>Today's Route</h2>
        </div>

        <div className="route-list__progress">
          <span className="route-list__count">{properties.length} Homes</span>

          <span className="route-list__position">
            Home {currentIndex + 1} of {properties.length}
          </span>
        </div>
      </div>

      <div className="route-list__search-row">
        <div className="route-list__search">
          <Search size={18} />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search address or person"
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
          <Filter size={18} />
          Filter
        </label>

        <select
          id="address-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="All">All</option>

          <option value="Canvassed">Canvassed</option>

          <option value="Not Home">Not Home</option>

          <option value="Refused">Refused</option>
        </select>
      </div>

      {onOptimizeRoute && (
        <button
          type="button"
          className="route-list__optimize"
          onClick={onOptimizeRoute}
        >
          Optimize Walking Route
        </button>
      )}

      <p className="route-list__results">
        Showing {filteredProperties.length} of {properties.length}
      </p>

      <div className="route-list__items">
        {filteredProperties.map((property) => {
          const actualIndex = properties.findIndex(
            (item) => item.id === property.id,
          );

          const people = getPeople(property);

          const firstPerson = people[0];

          const completed = isPropertyCanvassed(property);

          return (
            <button
              key={property.id}
              type="button"
              className={`route-list__item ${
                actualIndex === currentIndex ? "route-list__item--active" : ""
              }`}
              onClick={() => onSelectProperty(actualIndex)}
            >
              <span className="route-list__number">{actualIndex + 1}</span>

              <span className="route-list__details">
                <span className="route-list__address">{property.address}</span>

                <span className="route-list__person">
                  {firstPerson ? firstPerson.name : "No person assigned"}

                  {people.length > 1 && ` +${people.length - 1} more`}
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
                <CheckCircle2 className="route-list__check" size={20} />
              )}

              {actualIndex === currentIndex && (
                <span className="route-list__current">Current</span>
              )}
            </button>
          );
        })}
      </div>

      {filteredProperties.length === 0 && (
        <p className="route-list__empty">
          No addresses or people match your search.
        </p>
      )}
    </section>
  );
}

export default RouteList;
