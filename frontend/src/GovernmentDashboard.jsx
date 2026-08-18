import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, BarChart3 } from "lucide-react";
import "./GovernmentDashboard.css";

const API_URL = "http://127.0.0.1:8000";

function GovernmentDashboard() {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [destinationScores, setDestinationScores] = useState([]);
  const [scoresLoading, setScoresLoading] = useState(true);

  // Simulation State
  const [famousDestinationId, setFamousDestinationId] = useState("");
  const [hiddenDestinationId, setHiddenDestinationId] = useState("");
  const [shiftPercentage, setShiftPercentage] = useState(10);
  const [simulation, setSimulation] = useState(null);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationError, setSimulationError] = useState("");

  const logout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
    localStorage.removeItem("s21_user");
    navigate("/");
  };

  const fetchGovernmentData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        submissionsResponse,
        guidesResponse,
        analyticsResponse,
        scoresResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/government/place-submissions`),
        fetch(`${API_URL}/government/guides`),
        fetch(`${API_URL}/government/analytics`),
        fetch(`${API_URL}/government/destination-scores`),
      ]);

      const submissionsData = submissionsResponse.ok
        ? await submissionsResponse.json()
        : [];
      const guidesData = guidesResponse.ok
        ? await guidesResponse.json()
        : [];
      const analyticsData = analyticsResponse.ok
        ? await analyticsResponse.json()
        : null;
      const scoresData = scoresResponse.ok
        ? await scoresResponse.json()
        : [];

      setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
      setGuides(Array.isArray(guidesData) ? guidesData : []);
      setAnalytics(analyticsData);
      setDestinationScores(Array.isArray(scoresData) ? scoresData : []);

      setAnalyticsLoading(false);
      setScoresLoading(false);
    } catch (err) {
      console.error(err);
      setError("Unable to load government data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGovernmentData();
  }, []);

  const runSimulation = async () => {
    setSimulationError("");
    setSimulation(null);

    if (!famousDestinationId || !hiddenDestinationId) {
      setSimulationError("Please select both destinations.");
      return;
    }

    if (famousDestinationId === hiddenDestinationId) {
      setSimulationError("Please select two different destinations.");
      return;
    }

    try {
      setSimulationLoading(true);
      const params = new URLSearchParams({
        famous_destination_id: famousDestinationId,
        hidden_destination_id: hiddenDestinationId,
        visitor_shift_percentage: String(shiftPercentage),
      });

      const response = await fetch(
        `${API_URL}/government/simulate-redistribution?${params.toString()}`,
        { method: "POST" }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Simulation failed.");
      }
      setSimulation(data);
    } catch (err) {
      console.error(err);
      setSimulationError(err.message || "Unable to run simulation.");
    } finally {
      setSimulationLoading(false);
    }
  };

  const handlePlaceAction = async (submissionId, action) => {
    try {
      setActionLoading(`place-${submissionId}-${action}`);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/government/place/${submissionId}/${action}`,
        { method: "PUT" }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || `Failed to ${action} place`);
      }

      setSuccess(
        action === "approve"
          ? "Place approved successfully."
          : "Place rejected successfully."
      );
      await fetchGovernmentData();
    } catch (err) {
      console.error(err);
      setError(err.message || `Unable to ${action} place.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleGuideAction = async (guideId, action) => {
    try {
      setActionLoading(`guide-${guideId}-${action}`);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/government/guide/${guideId}/${action}`,
        { method: "PUT" }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || `Failed to ${action} guide`);
      }

      setSuccess(
        action === "approve"
          ? "Guide approved successfully."
          : "Guide rejected successfully."
      );
      await fetchGovernmentData();
    } catch (err) {
      console.error(err);
      setError(err.message || `Unable to ${action} guide.`);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingPlaces = submissions.filter(
    (item) => !item.verification_status || item.verification_status === "PENDING"
  ).length;

  const pendingGuides = guides.filter(
    (guide) => !guide.verification_status || guide.verification_status === "PENDING"
  ).length;

  return (
    <div className="gov-dashboard">
      {/* NAVBAR */}
      <nav className="navbar government-navbar">
        <div className="logo">
          <ShieldCheck size={28} />
          <span>S21 Government</span>
        </div>
        <button className="logout" onClick={logout}>
          Logout
        </button>
      </nav>

      <main className="government-main">
        {/* HEADER */}
        <section className="gov-header">
          <div className="gov-eyebrow">GOVERNMENT PORTAL</div>
          <h1>Tourism Dashboard</h1>
          <p>
            Verify destinations, approve local guides, and simulate tourist redistribution impact.
          </p>
        </section>

        {/* MESSAGES */}
        {error && <div className="gov-error">{error}</div>}
        {success && <div className="gov-success">{success}</div>}

        {/* OVERVIEW STATS */}
        <section className="government-stats">
          <div className="government-stat-card">
            <span className="stat-label">Hidden Destinations</span>
            <strong>
              {analyticsLoading ? "..." : analytics?.total_destinations ?? 0}
            </strong>
            <p>Government approved</p>
          </div>

          <div className="government-stat-card">
            <span className="stat-label">Pending Places</span>
            <strong>{pendingPlaces}</strong>
            <p>Awaiting verification</p>
          </div>

          <div className="government-stat-card">
            <span className="stat-label">Pending Guides</span>
            <strong>{pendingGuides}</strong>
            <p>Awaiting verification</p>
          </div>

          <div className="government-stat-card">
            <span className="stat-label">Tourist Redistribution</span>
            <strong>
              {simulation ? `${simulation.visitor_shift_percentage}%` : "--"}
            </strong>
            <p>
              {simulation ? "Simulation applied" : "Run simulation below"}
            </p>
          </div>
        </section>

        {/* PLACE SUBMISSIONS */}
        <section className="government-section">
          <div className="government-section-heading">
            <div>
              <span>DESTINATION VERIFICATION</span>
              <h2>Pending Places</h2>
            </div>
            <span className="count-badge">{pendingPlaces}</span>
          </div>

          {loading ? (
            <div className="gov-loading">Loading place submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="government-empty">
              <h3>No place submissions</h3>
              <p>There are currently no destination submissions waiting for review.</p>
            </div>
          ) : (
            <div className="government-list">
              {submissions.map((submission) => (
                <div className="government-review-card" key={submission.id}>
                  <div className="government-card-content">
                    <div className="submission-status">
                      {submission.verification_status || "PENDING"}
                    </div>
                    <h3>{submission.name}</h3>
                    <p className="submission-location">
                      📍 {submission.district ? `${submission.district}, ` : ""}
                      {submission.state}
                    </p>
                    {submission.description && (
                      <p className="submission-description">
                        {submission.description}
                      </p>
                    )}
                    {submission.latitude && submission.longitude && (
                      <p className="submission-coordinates">
                        Coordinates: {submission.latitude}, {submission.longitude}
                      </p>
                    )}
                  </div>

                  {(submission.verification_status === "PENDING" ||
                    !submission.verification_status) && (
                    <div className="government-actions">
                      <button
                        className="approve-button"
                        disabled={actionLoading !== null}
                        onClick={() => handlePlaceAction(submission.id, "approve")}
                      >
                        {actionLoading === `place-${submission.id}-approve`
                          ? "Approving..."
                          : "✓ Approve"}
                      </button>

                      <button
                        className="reject-button"
                        disabled={actionLoading !== null}
                        onClick={() => handlePlaceAction(submission.id, "reject")}
                      >
                        {actionLoading === `place-${submission.id}-reject`
                          ? "Rejecting..."
                          : "✕ Reject"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* GUIDE APPLICATIONS */}
        <section className="government-section">
          <div className="government-section-heading">
            <div>
              <span>GUIDE VERIFICATION</span>
              <h2>Guide Applications</h2>
            </div>
            <span className="count-badge">{pendingGuides}</span>
          </div>

          {loading ? (
            <div className="gov-loading">Loading guide applications...</div>
          ) : guides.length === 0 ? (
            <div className="government-empty">
              <h3>No guide applications</h3>
              <p>There are currently no guides waiting for verification.</p>
            </div>
          ) : (
            <div className="government-list">
              {guides.map((guide) => (
                <div className="government-review-card" key={guide.id}>
                  <div className="government-card-content">
                    <div className="submission-status">
                      {guide.verification_status || "PENDING"}
                    </div>
                    <h3>👨‍💼 Guide #{guide.id}</h3>
                    <p>Experience: {guide.experience || "Not provided"}</p>
                    <p>📞 {guide.phone || "No phone number"}</p>
                    <p>User ID: {guide.user_id}</p>
                  </div>

                  {(guide.verification_status === "PENDING" ||
                    !guide.verification_status) && (
                    <div className="government-actions">
                      <button
                        className="approve-button"
                        disabled={actionLoading !== null}
                        onClick={() => handleGuideAction(guide.id, "approve")}
                      >
                        {actionLoading === `guide-${guide.id}-approve`
                          ? "Approving..."
                          : "✓ Approve"}
                      </button>

                      <button
                        className="reject-button"
                        disabled={actionLoading !== null}
                        onClick={() => handleGuideAction(guide.id, "reject")}
                      >
                        {actionLoading === `guide-${guide.id}-reject`
                          ? "Rejecting..."
                          : "✕ Reject"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ANALYTICS */}
        <section className="government-section">
          <div className="government-section-heading">
            <div>
              <span>TOURISM INTELLIGENCE</span>
              <h2>Tourism Analytics</h2>
            </div>
          </div>

          {analyticsLoading ? (
            <div className="gov-loading">Loading tourism analytics...</div>
          ) : (
            <div className="analytics-dashboard-card">
              <div className="analytics-summary-grid">
                <div className="analytics-summary-item">
                  <span>Total Visitors</span>
                  <strong>{analytics?.total_visitors ?? 0}</strong>
                </div>

                <div className="analytics-summary-item">
                  <span>Average Footfall</span>
                  <strong>{analytics?.average_footfall ?? 0}</strong>
                </div>

                <div className="analytics-summary-item">
                  <span>Most Visited</span>
                  <strong className="analytics-destination-name">
                    {analytics?.top_destination || "No data"}
                  </strong>
                </div>
              </div>

              <div className="footfall-chart-section">
                <div className="chart-heading">
                  <span>VISITOR TREND</span>
                  <h3>Monthly Footfall</h3>
                </div>

                {!analytics?.monthly_footfall ||
                analytics.monthly_footfall.length === 0 ? (
                  <div className="chart-empty">No footfall data available yet.</div>
                ) : (
                  <div className="footfall-chart">
                    {analytics.monthly_footfall.map((item, index) => {
                      const values = analytics.monthly_footfall.map(
                        (entry) => entry.visitors
                      );
                      const maxVisitors = Math.max(...values, 1);
                      const height = Math.max(
                        (item.visitors / maxVisitors) * 100,
                        8
                      );

                      return (
                        <div
                          className="chart-column"
                          key={`${item.month}-${index}`}
                        >
                          <div className="chart-value">{item.visitors}</div>
                          <div className="chart-bar-wrapper">
                            <div
                              className="chart-bar"
                              style={{ height: `${height}%` }}
                            />
                          </div>
                          <div className="chart-month">{item.month}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="analytics-note">
                <BarChart3 size={25} />
                <p>
                  Monthly visitor counts are calculated from footfall records stored in the
                  tourism database.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* DESTINATION PRESSURE SCORES */}
        <section className="government-section">
          <div className="government-section-heading">
            <div>
              <span>DESTINATION HEALTH</span>
              <h2>Tourism Pressure Scores</h2>
            </div>
          </div>

          {scoresLoading ? (
            <div className="gov-loading">Calculating destination scores...</div>
          ) : destinationScores.length === 0 ? (
            <div className="government-empty">No approved destinations available.</div>
          ) : (
            <div className="destination-score-grid">
              {destinationScores.map((destination) => (
                <div className="destination-score-card" key={destination.id}>
                  <div className="score-card-header">
                    <div>
                      <span>{destination.category}</span>
                      <h3>{destination.name}</h3>
                      <p>📍 {destination.district}, {destination.state}</p>
                    </div>

                    <div className="score-circle">
                      <strong>
                        {Math.round(destination.vulnerability_score || 0)}
                      </strong>
                      <small>/100</small>
                    </div>
                  </div>

                  <div className="score-bars">
                    <div className="score-bar-item">
                      <div>
                        <span>Footfall</span>
                        <strong>{Math.round(destination.footfall_score || 0)}</strong>
                      </div>
                      <div className="score-bar">
                        <div
                          style={{
                            width: `${Math.min(destination.footfall_score || 0, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="score-bar-item">
                      <div>
                        <span>Water</span>
                        <strong>{Math.round(destination.water_score || 0)}</strong>
                      </div>
                      <div className="score-bar">
                        <div
                          style={{
                            width: `${Math.min(destination.water_score || 0, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="score-bar-item">
                      <div>
                        <span>Waste</span>
                        <strong>{Math.round(destination.waste_score || 0)}</strong>
                      </div>
                      <div className="score-bar">
                        <div
                          style={{
                            width: `${Math.min(destination.waste_score || 0, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="score-bar-item">
                      <div>
                        <span>Pollution</span>
                        <strong>{Math.round(destination.pollution_score || 0)}</strong>
                      </div>
                      <div className="score-bar">
                        <div
                          style={{
                            width: `${Math.min(destination.pollution_score || 0, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* REDISTRIBUTION SIMULATION */}
        <section className="government-section simulation-section">
          <div className="government-section-heading">
            <div>
              <span>DECISION SUPPORT</span>
              <h2>Tourist Redistribution Simulation</h2>
            </div>
          </div>

          <div className="simulation-card">
            <div className="simulation-intro">
              <h3>What happens if tourists are redirected?</h3>
              <p>
                Select an overcrowded destination, choose a hidden destination, and
                simulate how shifting tourists could affect tourism pressure and local
                sustainability.
              </p>
            </div>

            <div className="simulation-controls">
              <div className="simulation-field">
                <label>From: Overcrowded Destination</label>
                <select
                  value={famousDestinationId}
                  onChange={(e) => setFamousDestinationId(e.target.value)}
                >
                  <option value="">Select destination</option>
                  {destinationScores.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {destination.name} ({destination.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="simulation-arrow">→</div>

              <div className="simulation-field">
                <label>To: Hidden Destination</label>
                <select
                  value={hiddenDestinationId}
                  onChange={(e) => setHiddenDestinationId(e.target.value)}
                >
                  <option value="">Select destination</option>
                  {destinationScores.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {destination.name} ({destination.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="shift-control">
              <div className="shift-heading">
                <label>Tourist Shift</label>
                <strong>{shiftPercentage}%</strong>
              </div>

              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={shiftPercentage}
                onChange={(e) => setShiftPercentage(Number(e.target.value))}
              />

              <div className="shift-options">
                {[5, 10, 20, 30, 40, 50].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={
                      shiftPercentage === value
                        ? "shift-option active"
                        : "shift-option"
                    }
                    onClick={() => setShiftPercentage(value)}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>

            {simulationError && (
              <div className="simulation-error">{simulationError}</div>
            )}

            <button
              className="simulate-button"
              onClick={runSimulation}
              disabled={simulationLoading}
            >
              {simulationLoading
                ? "Running Simulation..."
                : "Run Redistribution Simulation →"}
            </button>

            {/* SIMULATION RESULT */}
            {simulation && (
              <div className="simulation-result">
                <div className="simulation-result-header">
                  <span>SIMULATION RESULT</span>
                  <h3>
                    {simulation.famous_destination} → {simulation.hidden_destination}
                  </h3>
                </div>

                <div className="visitor-change-grid">
                  <div className="visitor-box">
                    <span>Original Visitors</span>
                    <strong>{simulation.current_famous_visitors}</strong>
                  </div>

                  <div className="visitor-box shift-box">
                    <span>Visitor Shift</span>
                    <strong>+{simulation.shifted_visitors}</strong>
                  </div>

                  <div className="visitor-box">
                    <span>New Visitors</span>
                    <strong>{simulation.new_hidden_visitors}</strong>
                  </div>
                </div>

                {simulation.sustainability_impact && (
                  <div className="simulation-impact-note">
                    <strong>Environmental Impact Summary:</strong>
                    <p>{simulation.sustainability_impact}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default GovernmentDashboard;