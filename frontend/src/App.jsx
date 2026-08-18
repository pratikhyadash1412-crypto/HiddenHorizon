import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import {
  MapPin,
  ShieldCheck,
  Users,
  ArrowRight,
  Globe2,
  Leaf,
  BriefcaseBusiness,
  BarChart3,
  Mail,
  Phone,
} from "lucide-react";

import "./App.css";

import GuideRegistration from "./GuideRegistration";
import GovernmentDashboard from "./GovernmentDashboard";

// =====================================================
// BACKEND API
// =====================================================

const API_URL = "http://127.0.0.1:8000";

// =====================================================
// LOCATION IMAGES
// =====================================================

const LOCATION_IMAGES = {
  deomali:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Deomali_hill_top_Koraput_India.jpg",

  mahendragiri:
    "https://www.sublimetourodisha.com/app-login/Upload/pkg_img/Mahendragiri%20Camping%20Odisha.jpg",

  kandhamal:
    "https://images.herzindagi.info/her-zindagi-english/images/2025/07/18/template/image/Daringbadi%2C-Odisha-1752860839955.jpg",

  waterfall:
    "https://static2.tripoto.com/media/filter/tst/img/2341218/SpotDocument/1762445786_1762445785742.jpg.webp",

  beach:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85",
};

// =====================================================
// GET DESTINATION IMAGE
// =====================================================

function getLocationImage(destination) {
  const name = destination?.name?.toLowerCase() || "";

  if (name.includes("deomali")) {
    return LOCATION_IMAGES.deomali;
  }

  if (name.includes("mahendragiri")) {
    return LOCATION_IMAGES.mahendragiri;
  }

  if (
    name.includes("kandhamal") ||
    name.includes("nature valley")
  ) {
    return LOCATION_IMAGES.kandhamal;
  }

  if (
    name.includes("waterfall") ||
    name.includes("duduma") ||
    name.includes("demo")
  ) {
    return LOCATION_IMAGES.waterfall;
  }

  return LOCATION_IMAGES.kandhamal;
}

// =====================================================
// HOME PAGE
// =====================================================

function Home() {
  return (
    <div
      className="home-page"
      style={{
        backgroundImage: `url(${LOCATION_IMAGES.deomali})`,
      }}
    >
      <div className="home-overlay"></div>

      {/* NAVBAR */}
      <nav className="navbar home-navbar">
        <div className="logo home-logo">
          <MapPin size={28} />
          <span>Tourism</span>
        </div>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#mission">Our Mission</a>
        </div>
      </nav>

      {/* HERO */}
      <main className="home-content">
        <div className="hero-badge">
          <ShieldCheck size={18} />
          Government Verified Tourism
        </div>

        <h1 className="hero-title">
          Discover the
          <span> Hidden India</span>
        </h1>

        <p className="hero-description">
          Explore government-approved hidden destinations, support local
          communities and help create a more sustainable future for tourism.
        </p>

        <div className="login-options">
          {/* PUBLIC */}
          <Link to="/public-login" className="login-card">
            <div className="icon-box public-icon">
              <Users size={29} />
            </div>

            <div className="login-card-content">
              <h2 className="public-login-title">
                Public Login
              </h2>

              <p>
                Discover hidden destinations, guides, stays and local
                experiences.
              </p>
            </div>

            <ArrowRight className="arrow" />
          </Link>

          {/* GOVERNMENT */}
          <Link to="/government-login" className="login-card">
            <div className="icon-box government-icon">
              <ShieldCheck size={29} />
            </div>

            <div className="login-card-content">
              <h2 className="government-login-title">
                Government Login
              </h2>

              <p>
                Verify destinations and monitor tourism impact using analytics.
              </p>
            </div>

            <ArrowRight className="arrow" />
          </Link>
        </div>
      </main>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="about-container">
          <div className="about-text">
            <span className="section-tag">
              ABOUT
            </span>

            <h2>
              Bringing hidden destinations into the spotlight.
            </h2>

            <p>
              Tourism is designed to help travelers discover government-approved
              destinations that are often overlooked by mainstream tourism.
            </p>

            <p>
              By redistributing tourist flow toward lesser-known places, the
              platform aims to support local communities, encourage local
              employment and reduce pressure on overcrowded tourist destinations.
            </p>
          </div>

          <div className="about-visual">
            <div className="about-image-card">
              <img
                src={LOCATION_IMAGES.kandhamal}
                alt="Kandhamal landscape"
              />

              <div className="about-image-caption">
                <MapPin size={17} />
                <span>
                  Explore beyond the obvious.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="mission-section" id="mission">
        <div className="mission-container">
          <div className="mission-heading">
            <span className="section-tag">
              OUR MISSION
            </span>

            <h2>
              Tourism that benefits more than the tourist.
            </h2>

            <p>
              We connect exploration with sustainability, local opportunity
              and smarter tourism decisions.
            </p>
          </div>

          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon green">
                <Globe2 size={27} />
              </div>

              <h3>
                Discover Hidden India
              </h3>

              <p>
                Help travelers discover lesser-known destinations across India.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon blue">
                <Leaf size={27} />
              </div>

              <h3>
                Sustainable Tourism
              </h3>

              <p>
                Reduce pressure on overcrowded destinations by redistributing
                tourist movement.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon orange">
                <BriefcaseBusiness size={27} />
              </div>

              <h3>
                Local Employment
              </h3>

              <p>
                Encourage opportunities for local communities and tourism workers.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon purple">
                <BarChart3 size={27} />
              </div>

              <h3>
                Smart Decisions
              </h3>

              <p>
                Help governments use tourism information to make better decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <MapPin size={26} />
              <span>Tourism</span>
            </div>

            <p>
              Discover hidden destinations. Support local communities.
              Travel more sustainably.
            </p>
          </div>

          <div className="footer-links">
            <h3>
              Explore
            </h3>

            <a href="#about">
              About
            </a>

            <a href="#mission">
              Our Mission
            </a>
          </div>

          <div className="footer-contact">
            <h3>
              Contact
            </h3>

            <p>
              <Mail size={16} />
              support@tourism.in
            </p>

            <p>
              <Phone size={16} />
              Tourism Support
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            ©️ 2026 Tourism Initiative
          </p>

          <span>
            Built for sustainable tourism.
          </span>
        </div>
      </footer>
    </div>
  );
}

// =====================================================
// PUBLIC LOGIN
// =====================================================

function PublicLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Login failed"
        );
      }

      if (data.role !== "PUBLIC") {
        throw new Error(
          "This account is not a public account."
        );
      }

      localStorage.setItem(
        "user_id",
        String(data.user_id)
      );

      localStorage.setItem(
        "user_name",
        data.name
      );

      localStorage.setItem(
        "user_email",
        data.email
      );

      localStorage.setItem(
        "user_role",
        data.role
      );

      localStorage.setItem(
        "s21_user",
        JSON.stringify(data)
      );

      navigate("/public");
    } catch (error) {
      setError(
        error.message ||
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage:
          `url(${LOCATION_IMAGES.deomali})`,
      }}
    >
      <div className="login-overlay"></div>

      <div className="login-box">
        <MapPin
          size={48}
          className="login-icon"
        />

        <h1 className="public-login-heading">
          Public Login
        </h1>

        <p>
          Login to explore hidden destinations across India.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <button
          onClick={login}
          disabled={loading}
          className="login-submit-btn"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        <Link to="/">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

// =====================================================
// GOVERNMENT LOGIN
// =====================================================

function GovernmentLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Login failed"
        );
      }

      if (data.role !== "GOVERNMENT") {
        throw new Error(
          "This account is not a government account."
        );
      }

      localStorage.setItem(
        "user_id",
        String(data.user_id)
      );

      localStorage.setItem(
        "user_name",
        data.name
      );

      localStorage.setItem(
        "user_email",
        data.email
      );

      localStorage.setItem(
        "user_role",
        data.role
      );

      localStorage.setItem(
        "s21_user",
        JSON.stringify(data)
      );

      navigate("/government");
    } catch (error) {
      setError(
        error.message ||
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage:
          `url(${LOCATION_IMAGES.deomali})`,
      }}
    >
      <div className="login-overlay"></div>

      <div className="login-box">
        <ShieldCheck
          size={48}
          className="login-icon"
        />

        <h1 className="government-login-heading">
          Government Login
        </h1>

        <p>
          Access the S21 tourism management dashboard.
        </p>

        <input
          type="email"
          placeholder="Government Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <button
          onClick={login}
          disabled={loading}
          className="login-submit-btn"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        <Link to="/">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

// =====================================================
// PUBLIC DASHBOARD / EXPLORE PAGE
// =====================================================

function PublicDashboard() {
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [destinations, setDestinations] = useState([]);

  const [loadingStates, setLoadingStates] =
    useState(true);

  const [loadingDestinations, setLoadingDestinations] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(
          `${API_URL}/states`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load states"
          );
        }

        const data = await response.json();
        setStates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  const handleStateChange = async (event) => {
    const state = event.target.value;

    setSelectedState(state);
    setDestinations([]);
    setError("");

    if (!state) return;

    try {
      setLoadingDestinations(true);

      const response = await fetch(
        `${API_URL}/destinations/${encodeURIComponent(
          state
        )}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load destinations"
        );
      }

      const data = await response.json();
      setDestinations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDestinations(false);
    }
  };

  return (
    <div
      className="explore-page"
      style={{
        backgroundImage:
          `url(${LOCATION_IMAGES.beach})`,
      }}
    >
      <div className="explore-page-overlay"></div>

      {/* NAVBAR */}
      <nav className="navbar explore-navbar">
        <div className="logo explore-logo">
          <MapPin size={28} />
          <span>
            S21 Tourism
          </span>
        </div>

        <div className="explore-nav-actions">
          <button
            className="navbar-guide-button"
            onClick={() =>
              navigate("/guide-registration")
            }
          >
            👨‍💼 Become a Guide
          </button>

          <button
            className="explore-logout"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="explore-content dashboard-content">
        <section className="explore-header">
          <span className="section-tag explore-eyebrow">
            EXPLORE INDIA
          </span>

          <h1>
            Discover Hidden
            <span> Destinations</span>
          </h1>

          <p>
            Choose a state and discover government-approved
            hidden tourist destinations across India.
          </p>
        </section>

        {/* STATE SELECTOR */}
        <section className="state-box">
          <label htmlFor="state-select">
            Select State
          </label>

          <select
            id="state-select"
            value={selectedState}
            onChange={handleStateChange}
            disabled={loadingStates}
          >
            <option value="">
              {loadingStates
                ? "Loading states..."
                : "Select a state"}
            </option>

            {states.map((state) => (
              <option
                key={state}
                value={state}
              >
                {state}
              </option>
            ))}
          </select>
        </section>

        {/* ERROR */}
        {error && (
          <div className="api-error">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loadingDestinations && (
          <div className="loading-message">
            Loading destinations...
          </div>
        )}

        {/* EMPTY */}
        {!loadingDestinations &&
          selectedState &&
          destinations.length === 0 && (
            <div className="empty-message">
              No approved hidden destinations found in{" "}
              {selectedState}.
            </div>
          )}

        {/* DESTINATIONS */}
        {destinations.length > 0 && (
          <div className="destination-grid">
            {destinations.map((destination) => (
              <div
                className="destination-card"
                key={destination.id}
                style={{
                  backgroundImage:
                    `url(${getLocationImage(
                      destination
                    )})`,
                }}
              >
                <div className="destination-card-overlay"></div>

                <div className="destination-card-content">
                  <span className="destination-tag">
                    GOVERNMENT VERIFIED
                  </span>

                  <h2>
                    {destination.name}
                  </h2>

                  <p className="destination-location">
                    📍 {destination.district},{" "}
                    {destination.state}
                  </p>

                  <p className="destination-description">
                    {destination.description}
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/destination/${destination.id}`
                      )
                    }
                  >
                    Explore Destination
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// =====================================================
// DESTINATION DETAILS
// =====================================================

function DestinationDetails() {
  const { destination_id } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [footfall, setFootfall] = useState([]);
  const [stays, setStays] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          destinationResponse,
          reviewsResponse,
          footfallResponse,
          staysResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/destination/${destination_id}`
          ),
          fetch(
            `${API_URL}/reviews/destination/${destination_id}`
          ),
          fetch(
            `${API_URL}/footfall/${destination_id}`
          ),
          fetch(
            `${API_URL}/stays/${destination_id}`
          ),
        ]);

        if (!destinationResponse.ok) {
          throw new Error(
            "Destination not found"
          );
        }

        const destinationData =
          await destinationResponse.json();

        const reviewsData =
          reviewsResponse.ok
            ? await reviewsResponse.json()
            : [];

        const footfallData =
          footfallResponse.ok
            ? await footfallResponse.json()
            : [];

        const staysData =
          staysResponse.ok
            ? await staysResponse.json()
            : [];

        setDestination(destinationData);
        setReviews(
          Array.isArray(reviewsData)
            ? reviewsData
            : []
        );

        setFootfall(
          Array.isArray(footfallData)
            ? footfallData
            : []
        );

        setStays(
          Array.isArray(staysData)
            ? staysData
            : []
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [destination_id]);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h1>
            Loading destination...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <div>
          <h1>
            Something went wrong
          </h1>
          <p>
            {error}
          </p>
          <button
            className="destination-back"
            onClick={() =>
              navigate("/public")
            }
          >
            ← Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="destination-details"
      style={{
        backgroundImage:
          `url(${getLocationImage(
            destination
          )})`,
      }}
    >
      <div className="destination-page-overlay"></div>

      {/* NAVBAR */}
      <nav className="destination-navbar">
        <div className="logo white-logo">
          <MapPin size={28} />
          <span>
            S21 Tourism
          </span>
        </div>
      </nav>

      <main className="destination-main">
        {/* BACK BUTTON */}
        <button
          className="destination-back"
          onClick={() =>
            navigate("/public")
          }
        >
          ← Back to Destinations
        </button>

        {/* HEADER */}
        <section className="destination-header">
          <span className="destination-tag">
            HIDDEN DESTINATION
          </span>

          <h1>
            {destination.name}
          </h1>

          <p className="destination-location">
            📍 {destination.district},{" "}
            {destination.state}
          </p>

          <p className="destination-description">
            {destination.description}
          </p>
        </section>

        {/* STATS */}
        <div className="destination-stats">
          <div className="stat-card">
            <h3>
              Reviews
            </h3>

            <strong>
              {reviews.length}
            </strong>
          </div>

          <div className="stat-card">
            <h3>
              Footfall Records
            </h3>

            <strong>
              {footfall.length}
            </strong>
          </div>

          <div className="stat-card">
            <h3>
              Nearby Stays
            </h3>

            <strong>
              {stays.length}
            </strong>
          </div>
        </div>

        {/* REVIEWS */}
        <section className="details-section">
          <div className="section-heading">
            <span>
              TRAVEL EXPERIENCES
            </span>

            <h2>
              Reviews
            </h2>
          </div>

          {reviews.length === 0 ? (
            <p className="empty-message">
              No reviews yet.
            </p>
          ) : (
            <div className="reviews-grid">
              {reviews.map((review) => (
                <div
                  className="review-card"
                  key={review.id}
                >
                  <div className="review-rating">
                    ⭐ {review.rating}/5
                  </div>

                  <p className="review-feedback">
                    {review.feedback ||
                      "No written feedback provided."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* STAYS */}
        <section className="details-section stays-section">
          <div className="section-heading">
            <span>
              STAY NEARBY
            </span>

            <h2>
              Where to Stay
            </h2>
          </div>

          {stays.length === 0 ? (
            <div className="empty-message">
              <p>
                No nearby stays available for
                this destination yet.
              </p>
            </div>
          ) : (
            <div className="stays-grid">
              {stays.map((stay) => (
                <div
                  className="stay-card"
                  key={stay.id}
                >
                  <div className="stay-icon">
                    🏨
                  </div>

                  <div className="stay-info">
                    <h3>
                      {stay.name}
                    </h3>

                    {stay.address && (
                      <p className="stay-address">
                        📍 {stay.address}
                      </p>
                    )}

                    {stay.price_per_night !==
                      null &&
                      stay.price_per_night !==
                      undefined && (
                        <p className="stay-price">
                          ₹
                          {Number(
                            stay.price_per_night
                          ).toLocaleString()}{" "}
                          <span>
                            {" "} / night
                          </span>
                        </p>
                      )}

                    {stay.contact && (
                      <p className="stay-contact">
                        📞 {stay.contact}
                      </p>
                    )}
                  </div>

                  {stay.contact && (
                    <a
                      href={`tel:${stay.contact}`}
                      className="stay-contact-button"
                    >
                      Contact
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// =====================================================
// ROUTES
// =====================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/public-login" element={<PublicLogin />} />
        <Route path="/government-login" element={<GovernmentLogin />} />
        <Route path="/public" element={<PublicDashboard />} />
        <Route
          path="/destination/:destination_id"
          element={<DestinationDetails />}
        />
        <Route
          path="/guide-registration"
          element={
            <GuideRegistration
              userId={localStorage.getItem("user_id")}
            />
          }
        />
        <Route path="/government" element={<GovernmentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;