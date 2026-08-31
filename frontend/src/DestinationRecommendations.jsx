import { useEffect, useState } from "react";
import "./DestinationRecommendations.css";

const API_URL = "http://127.0.0.1:8000";

function getPressure(score) {
  if (score >= 70) {
    return {
      label: "HIGH PRESSURE",
      className: "high",
    };
  }

  if (score >= 40) {
    return {
      label: "MODERATE PRESSURE",
      className: "moderate",
    };
  }

  return {
    label: "LOW PRESSURE",
    className: "low",
  };
}

export default function DestinationRecommendations({
  refreshKey,
}) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDestinationScores = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/government/destination-scores?_=${Date.now()}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load destination scores: ${response.status}`
          );
        }

        const data = await response.json();

        

        if (!cancelled) {
          setDestinations(
            Array.isArray(data) ? data : []
          );
        }

      } catch (err) {
        console.error(
          "Destination scores error:",
          err
        );

        if (!cancelled) {
          setError(
            "Unable to load destination scores."
          );
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDestinationScores();

    return () => {
      cancelled = true;
    };

  }, [refreshKey]);


  return (
    <section className="destination-recommendations">

      <div className="destination-heading">

        <span className="ai-badge">
          DESTINATION HEALTH
        </span>

        <h2>
          Tourism Pressure Scores
        </h2>

        <p>
          Identify overcrowded destinations and discover
          locations with capacity for sustainable tourism growth.
        </p>

      </div>


      {loading && (
        <div className="destination-status">
          Loading destination scores...
        </div>
      )}


      {error && (
        <div className="destination-error">
          {error}
        </div>
      )}


      {!loading &&
        !error &&
        destinations.length === 0 && (
          <div className="destination-status">
            No destination data available.
          </div>
        )}


      {!loading &&
        !error &&
        destinations.length > 0 && (

        <div className="destination-grid">

          {destinations.map((destination) => {

            const score = Number(
              destination.vulnerability_score ??
              Math.max(
                Number(destination.footfall_score) || 0,
                Number(destination.water_score) || 0,
                Number(destination.waste_score) || 0,
                Number(destination.pollution_score) || 0
              )
            );


            const pressure = getPressure(score);


            return (
              <article
                className="destination-score-card"
                key={destination.id}
              >

                <div className="destination-card-header">

                  <div>

                    <span
                      className={`pressure-label ${pressure.className}`}
                    >
                      {pressure.label}
                    </span>

                    <h3>
                      {destination.name}
                    </h3>

                    {/* LOCATION */}

                    <div className="destination-location">
                      📍 {destination.district},{" "}
                      {destination.state}
                    </div>

                  </div>


                  <div
                    className={`score-circle ${pressure.className}`}
                  >

                    <strong>
                      {score}
                    </strong>

                    <small>
                      /100
                    </small>

                  </div>

                </div>


                <div className="score-metric">

                  <div>

                    <span>
                      Tourism Pressure
                    </span>

                    <strong>
                      {score}
                    </strong>

                  </div>


                  <div className="score-bar">

                    <div
                      className={`score-fill ${pressure.className}`}
                      style={{
                        width: `${Math.min(
                          Math.max(score, 0),
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>


                <div className="destination-action">

                  {score >= 70 ? (

                    <span>
                      ⚠ Tourist redistribution recommended
                    </span>

                  ) : score < 40 ? (

                    <span>
                      ✓ Suitable for increased tourism
                    </span>

                  ) : (

                    <span>
                      • Monitor tourism pressure
                    </span>

                  )}

                </div>

              </article>
            );

          })}

        </div>

      )}

    </section>
  );
}