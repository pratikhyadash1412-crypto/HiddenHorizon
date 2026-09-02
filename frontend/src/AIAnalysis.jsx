import React, { useEffect, useState } from "react";
import "./AIAnalysis.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Metric({ label, value }) {
  const numericValue = Number(value) || 0;

  return (
    <div className="ai-metric">
      <div className="ai-metric-header">
        <span>{label}</span>
        <strong>{value ?? 0}</strong>
      </div>
      <div className="ai-bar">
        <div
          className="ai-bar-fill"
          style={{ width: `${Math.min(Math.max(numericValue, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

function DecisionSummary({ analysis }) {
  const normalizeImpact = (value) => {
    const number = Number(value) || 0;
    return Math.min(Math.max((number / 30) * 100, 0), 100);
  };

  const overcrowdingScore = normalizeImpact(analysis.overcrowding_impact);
  const employmentScore = normalizeImpact(analysis.employment_impact);
  const localPurchaseScore = normalizeImpact(analysis.local_purchase_impact);
  const governmentProfitScore = normalizeImpact(analysis.government_profit_impact);
  const waterScore = normalizeImpact(analysis.water_saving);
  const wasteScore = normalizeImpact(analysis.waste_impact);
  const pollutionScore = normalizeImpact(analysis.pollution_impact);
  const accessibilityScore = Math.min(Math.max(Number(analysis.accessibility_score) || 0, 0), 100);

  const overallScore = Math.round(
    overcrowdingScore * 0.25 +
    employmentScore * 0.15 +
    localPurchaseScore * 0.15 +
    governmentProfitScore * 0.1 +
    waterScore * 0.075 +
    wasteScore * 0.075 +
    pollutionScore * 0.05 +
    accessibilityScore * 0.15
  );

  let decision = "Moderate Recommendation";
  let decisionClass = "moderate";

  if (overallScore >= 70) {
    decision = "Strong Recommendation";
    decisionClass = "strong";
  } else if (overallScore < 40) {
    decision = "Low Priority";
    decisionClass = "low";
  }

  const localEconomyScore = (employmentScore + localPurchaseScore + governmentProfitScore) / 3;
  const environmentalScore = (waterScore + wasteScore + pollutionScore) / 3;

  return (
    <div className="decision-summary">
      <div className="decision-summary-header">
        <div>
          <span className="decision-label">GOVERNMENT DECISION SUPPORT</span>
          <h4>Redistribution Assessment</h4>
        </div>
        <div className={`decision-badge ${decisionClass}`}>{decision}</div>
      </div>

      <div className="decision-score">
        <span>Overall Assessment Score</span>
        <strong>{overallScore}</strong>
        <small>/ 100</small>
      </div>

      <div className="decision-points">
        <div>
          <span>Tourism Pressure</span>
          <strong>
            {overcrowdingScore >= 70
              ? "High reduction potential"
              : overcrowdingScore >= 40
              ? "Moderate reduction potential"
              : "Low reduction potential"}
          </strong>
        </div>

        <div>
          <span>Local Economy</span>
          <strong>
            {localEconomyScore >= 70 ? "Strong" : localEconomyScore >= 40 ? "Moderate" : "Limited"}
          </strong>
        </div>

        <div>
          <span>Accessibility</span>
          <strong>
            {accessibilityScore >= 70 ? "Good" : accessibilityScore >= 40 ? "Moderate" : "Needs improvement"}
          </strong>
        </div>

        <div>
          <span>Environmental Benefit</span>
          <strong>
            {environmentalScore >= 70 ? "Strong" : environmentalScore >= 40 ? "Moderate" : "Limited"}
          </strong>
        </div>
      </div>

      <div className={`government-decision ${decisionClass}`}>
        <div className="government-decision-header">
          <span>GOVERNMENT DECISION</span>
          <strong>
            {overallScore >= 70 ? "RECOMMENDED" : overallScore >= 40 ? "REVIEW REQUIRED" : "NOT RECOMMENDED"}
          </strong>
        </div>
        <p>
          {overallScore >= 70
            ? "The proposed tourist redistribution shows strong potential for reducing tourism pressure while supporting local economic and environmental benefits."
            : overallScore >= 40
            ? "The proposed redistribution has potential benefits, but the government should review economic, environmental, and accessibility factors before implementation."
            : "The current redistribution scenario provides limited overall benefit. A smaller shift or a different hidden destination should be evaluated before implementation."}
        </p>
      </div>
    </div>
  );
}

export default function AIAnalysis({ refreshKey }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadLatestAnalysis = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/government/ai-analysis?_=${Date.now()}`, {
          method: "GET",
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) throw new Error(`Failed to load AI analysis: ${response.status}`);

        const data = await response.json();
        if (cancelled) return;

        if (!Array.isArray(data) || data.length === 0) {
          setAnalysis(null);
          return;
        }

        const sorted = [...data].sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
        setAnalysis(sorted[0]);
      } catch (err) {
        console.error("AI Analysis error:", err);
        if (!cancelled) setError("Unable to load AI analysis.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadLatestAnalysis();
    return () => { cancelled = true; };
  }, [refreshKey]);

  return (
    <section className="ai-analysis-section">
      <div className="ai-analysis-heading">
        <span className="ai-badge">AI DECISION SUPPORT</span>
        <h2>Tourism Impact Analysis</h2>
        <p>AI-generated analysis of tourist redistribution and its economic and environmental impact.</p>
      </div>

      {loading && <div className="ai-status">Loading AI analysis...</div>}
      {error && <div className="ai-error">{error}</div>}

      {!loading && !error && !analysis && (
        <div className="ai-status">No AI analysis available yet. Run a redistribution simulation first.</div>
      )}

      {!loading && !error && analysis && (
        <div className="ai-analysis-list">
          <article className="ai-analysis-card" key={analysis.id}>
            <div className="ai-route">
              <div>
                <span>OVER-CROWDED DESTINATION</span>
                <h3>{analysis.famous_destination}</h3>
              </div>
              <div className="ai-arrow">
                →
                <small>{analysis.visitor_shift_percentage}% shift</small>
              </div>
              <div>
                <span>HIDDEN DESTINATION</span>
                <h3>{analysis.hidden_destination}</h3>
              </div>
            </div>

            <div className="ai-metrics-grid">
              <Metric label="Overcrowding Impact" value={analysis.overcrowding_impact} />
              <Metric label="Employment Impact" value={analysis.employment_impact} />
              <Metric label="Local Purchase Impact" value={analysis.local_purchase_impact} />
              <Metric label="Government Profit Impact" value={analysis.government_profit_impact} />
              <Metric label="Water Saving" value={analysis.water_saving} />
              <Metric label="Waste Impact" value={analysis.waste_impact} />
              <Metric label="Pollution Impact" value={analysis.pollution_impact} />
              <Metric label="Accessibility Score" value={analysis.accessibility_score} />
            </div>

            <div className="ai-recommendation">
              <div className="ai-recommendation-title">
                <span>🤖</span>
                <strong>AI Recommendation</strong>
              </div>
              <p>{analysis.ai_recommendation}</p>
            </div>

            <DecisionSummary analysis={analysis} />
          </article>
        </div>
      )}
    </section>
  );
}