import { useEffect, useState } from "react";
import "./BestDestination.css";

const API_URL = "http://127.0.0.1:8000";

export default function BestDestination({
  onRecommendationSelect,
  refreshKey,
}) {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadRecommendation = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/government/recommended-destination?_=${Date.now()}`,
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
            `Failed to load recommendation: ${response.status}`
          );
        }

        const data = await response.json();

        

        if (!cancelled) {
          setRecommendation(data);
        }

      } catch (err) {
        console.error(
          "Recommendation error:",
          err
        );

        if (!cancelled) {
          setError(
            "Unable to generate destination recommendation."
          );
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRecommendation();

    return () => {
      cancelled = true;
    };

  }, [refreshKey,onRecommendationSelect]);


  return (
    <section className="best-destination-section">

      <div className="best-destination-heading">

        <span className="ai-badge">
          AI TOURISM STRATEGY
        </span>

        <h2>
          Recommended Redistribution
        </h2>

        <p>
          Identify the most suitable destination
          for reducing tourism pressure.
        </p>

      </div>


      {loading && (
        <div className="best-destination-status">
          Analyzing destination conditions...
        </div>
      )}


      {error && (
        <div className="best-destination-error">
          {error}
        </div>
      )}


      {!loading &&
        !error &&
        recommendation && (

        <div className="recommendation-card">

          <div className="recommendation-route">

            <div className="recommendation-place">

              <span>
                OVER-CROWDED DESTINATION
              </span>

              <h3>
                {recommendation.source_destination}
              </h3>

              <strong>
                {Number(
                  recommendation.source_footfall || 0
                ).toLocaleString()}
              </strong>

              <small>
                current visitors
              </small>

            </div>


            <div className="recommendation-arrow">
              →
            </div>


            <div className="recommendation-place recommended">

              <span>
                RECOMMENDED DESTINATION
              </span>

              <h3>
                {recommendation.recommended_destination}
              </h3>

              <strong>
                {Number(
                  recommendation.recommended_footfall || 0
                ).toLocaleString()}
              </strong>

              <small>
                current visitors
              </small>

            </div>

          </div>


          <div className="recommendation-score">

            <span>
              RECOMMENDATION SCORE
            </span>

            <strong>
              {recommendation.recommendation_score}
            </strong>

            <small>
              / 100
            </small>

          </div>


          <div className="recommendation-reason">

            <span>
              🤖
            </span>

            <div>

              <strong>
                Government Recommendation
              </strong>

              <p>
                {recommendation.reason}
              </p>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}