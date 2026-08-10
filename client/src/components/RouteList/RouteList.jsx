import "./RouteList.css";
import { CheckCircle2 } from "lucide-react";

function RouteList({ properties, currentIndex, onSelectProperty }) {
  function getStatus(property) {
    if (property.outcome && property.knocked) {
      return `Knocked / ${property.outcome}`;
    }

    if (property.knocked) {
      return "Knocked";
    }

    if (property.outcome) {
      return property.outcome;
    }

    return "Not Visited";
  }

  function isCompleted(property) {
    return Boolean(property.outcome || property.knocked);
  }

  return (
    <section className="route-list">
      <div className="route-list__header">
        <div>
          <p className="route-list__eyebrow">Today's Route</p>
          <h2>Canvass Route</h2>
        </div>

        <div className="route-list__progress">
          <span className="route-list__count">{properties.length} Homes</span>

          <span className="route-list__position">
            Home {currentIndex + 1} of {properties.length}
          </span>
        </div>
      </div>

      <div className="route-list__items">
        {properties.map((property, index) => (
          <button
            key={property.id}
            type="button"
            className={`route-list__item ${
              index === currentIndex ? "route-list__item--active" : ""
            }`}
            onClick={() => onSelectProperty(index)}
          >
            <span className="route-list__number">{index + 1}</span>

            <span className="route-list__details">
              <span className="route-list__address">{property.address}</span>

              <span
                className={`route-list__status ${
                  isCompleted(property) ? "route-list__status--completed" : ""
                }`}
              >
                {getStatus(property)}
              </span>
            </span>

            {isCompleted(property) && (
              <CheckCircle2 className="route-list__check" size={20} />
            )}

            {index === currentIndex && (
              <span className="route-list__current">Current</span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

export default RouteList;
