import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import "./DestinationRecommendations.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Complete baseline database locations matching Public Dashboard
const DEFAULT_LOCATIONS = [
  { id: 1, name: "Puri Beach", district: "Puri", state: "Odisha", score: 100, saturation: 100, category: "HIGH PRESSURE" },
  { id: 2, name: "Konark Sun Temple", district: "Puri", state: "Odisha", score: 69, saturation: 82, category: "MODERATE PRESSURE" },
  { id: 3, name: "Deomali Trail", district: "Koraput", state: "Odisha", score: 28, saturation: 30, category: "LOW PRESSURE" },
  { id: 4, name: "Mahendragiri Zone", district: "Gajapati", state: "Odisha", score: 22, saturation: 25, category: "LOW PRESSURE" },
  { id: 5, name: "Kandhamal Nature Valley", district: "Kandhamal", state: "Odisha", score: 48, saturation: 52, category: "MODERATE PRESSURE" },
  { id: 6, name: "Damdamani", district: "Cuttack", state: "Odisha", score: 14, saturation: 18, category: "LOW PRESSURE" },
  { id: 7, name: "Hidden waterfall", district: "Keonjhar", state: "Odisha", score: 12, saturation: 15, category: "LOW PRESSURE" },
  { id: 8, name: "Balakati Syphon", district: "Khorda", state: "Odisha", score: 10, saturation: 14, category: "LOW PRESSURE" },
  { id: 9, name: "Dabarkhola waterfall", district: "Cuttack", state: "Odisha", score: 16, saturation: 20, category: "LOW PRESSURE" },
  { id: 10, name: "Pandav Bakhra", district: "Cuttack", state: "Odisha", score: 8, saturation: 12, category: "LOW PRESSURE" },
];

export default function DestinationRecommendations({ refreshKey }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadRecommendations = async () => {
      setLoading(true);
      setError("");

      try {
        const [scoresRes, destsRes] = await Promise.all([
          fetch(`${API_URL}/government/destination-scores?_=${Date.now()}`),
          fetch(`${API_URL}/destinations/Odisha?_=${Date.now()}`),
        ]);

        let liveScores = scoresRes.ok ? await scoresRes.json() : [];
        let liveDests = destsRes.ok ? await destsRes.json() : [];

        if (cancelled) return;

        const mergedMap = new Map();

        DEFAULT_LOCATIONS.forEach((d) => mergedMap.set(d.name.toLowerCase().trim(), d));

        if (Array.isArray(liveDests)) {
          liveDests.forEach((d) => {
            const key = String(d.name || "").toLowerCase().trim();
            const existing = mergedMap.get(key) || {};
            const isPop = String(d.name || "").toLowerCase().includes("puri") || String(d.name || "").toLowerCase().includes("konark");

            mergedMap.set(key, {
              id: d.id || existing.id || Date.now(),
              name: d.name,
              district: d.district || existing.district || "Odisha",
              state: d.state || existing.state || "Odisha",
              score: existing.score || (isPop ? 85 : 15),
              saturation: existing.saturation || (isPop ? 90 : 20),
              category: existing.category || (isPop ? "HIGH PRESSURE" : "LOW PRESSURE"),
            });
          });
        }

        if (Array.isArray(liveScores)) {
          liveScores.forEach((d) => {
            const key = String(d.name || "").toLowerCase().trim();
            const existing = mergedMap.get(key) || {};
            const scoreVal = Math.round(Number(d.vulnerability_score ?? d.score ?? existing.score ?? 15));
            const satVal = Math.round(Number(d.footfall_score ?? d.saturation ?? existing.saturation ?? (scoreVal + 5)));

            mergedMap.set(key, {
              ...existing,
              ...d,
              name: d.name,
              score: scoreVal,
              saturation: satVal,
              category: d.category || (scoreVal >= 70 ? "HIGH PRESSURE" : scoreVal >= 40 ? "MODERATE PRESSURE" : "LOW PRESSURE"),
            });
          });
        }

        setDestinations(Array.from(mergedMap.values()));
      } catch (err) {
        console.error("Destination recommendations error:", err);
        if (!cancelled) {
          setDestinations(DEFAULT_LOCATIONS);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadRecommendations();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <section className="destination-recommendations">
      <div className="destination-heading">
        <span className="ai-badge">CAPACITY STATUS</span>
        <h2>Destination Carrying Capacity & Status</h2>
        <p>
          Real-time pressure classification and carrying capacity assessment across all active locations.
        </p>
      </div>

      {loading && (
        <div className="destination-status">
          Loading destination recommendations...
        </div>
      )}

      {error && <div className="destination-error">{error}</div>}

      {!loading && destinations.length > 0 && (
        <div className="destination-grid">
          {destinations.map((item) => {
            const scoreVal = Math.round(Number(item.score ?? item.vulnerability_score ?? 0));
            const level =
              item.category === "HIGH PRESSURE" || scoreVal >= 70
                ? "high"
                : item.category === "MODERATE PRESSURE" || scoreVal >= 40
                ? "moderate"
                : "low";

            const saturationVal = Math.round(Number(item.saturation ?? item.footfall_score ?? scoreVal));

            return (
              <article
                className={`destination-score-card card-alert-${level}`}
                key={item.id ?? item.name}
              >
                <div className="destination-card-header">
                  <div>
                    <span className={`pressure-label ${level}`}>
                      {item.category || `${level.toUpperCase()} PRESSURE`}
                    </span>
                    <h3>{item.name}</h3>
                    {item.district && (
                      <p className="destination-location">
                        <MapPin size={13} /> {item.district}, {item.state}
                      </p>
                    )}
                  </div>

                  <div className={`score-circle ${level}`}>
                    <strong>{scoreVal}</strong>
                    <small>/ 100</small>
                  </div>
                </div>

                {/* VISIBLE SATURATION PROGRESS BAR */}
                <div className="score-metric">
                  <div className="metric-header-row">
                    <span className="metric-title">Carrying Capacity Saturation</span>
                    <strong className={`metric-percentage ${level}`}>
                      {saturationVal}%
                    </strong>
                  </div>
                  <div className="score-bar">
                    <div
                      className={`score-fill ${level}`}
                      style={{ width: `${Math.min(Math.max(saturationVal, 6), 100)}%` }}
                    />
                  </div>
                </div>

                <div className="destination-action">
                  {level === "high"
                    ? "🚨 Recommended for visitor diversion policy."
                    : level === "moderate"
                    ? "⚠️ Requires peak-hour capacity management."
                    : "🌿 Prime target destination for tourist diversion."}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}