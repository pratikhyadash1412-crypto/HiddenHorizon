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
  Image as ImageIcon,
  Star,
} from "lucide-react";
import "./App.css";
import GovernmentDashboard from "./GovernmentDashboard";

// =====================================================
// BACKEND API
// =====================================================
const API_URL = "http://127.0.0.1:8000";

// =====================================================
// DEFAULT FALLBACK IMAGES
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
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=85",
  konark:
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=2200&q=85",
  defaultHill:
    "https://static2.tripoto.com/media/filter/tst/img/2341218/SpotDocument/1762445786_1762445785742.jpg.webp",
};

// =====================================================
// GET DESTINATION IMAGE
// =====================================================
function getLocationImage(destination) {
  const customImg =
    destination?.image_url ||
    destination?.imageUrl ||
    destination?.image ||
    destination?.bg_image ||
    destination?.photo;

  if (customImg && typeof customImg === "string" && customImg.trim() !== "") {
    const image = customImg.trim();

    // If backend returned a relative upload path, resolve to FastAPI host
    if (image.startsWith("/")) {
      return `${API_URL}${image}`;
    }
    return image;
  }

  const name = destination?.name?.toLowerCase() || "";

  if (name.includes("konark")) return LOCATION_IMAGES.konark;
  if (name.includes("puri") || name.includes("beach")) return LOCATION_IMAGES.beach;
  if (name.includes("deomali")) return LOCATION_IMAGES.deomali;
  if (name.includes("mahendragiri")) return LOCATION_IMAGES.mahendragiri;
  if (name.includes("kandhamal") || name.includes("nature valley")) return LOCATION_IMAGES.kandhamal;
  if (name.includes("waterfall") || name.includes("duduma") || name.includes("demo")) return LOCATION_IMAGES.waterfall;

  return LOCATION_IMAGES.defaultHill;
}

// =====================================================
// HOME PAGE
// =====================================================
function Home() {
  return (
    <div
      className="home-page"
      style={{ backgroundImage: `url(${LOCATION_IMAGES.deomali})` }}
    >
      <div className="home-overlay"></div>

      <nav className="navbar home-navbar">
        <div className="logo home-logo">
          <MapPin size={28} />
          <span>Hidden Horizon</span>
        </div>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#mission">Our Mission</a>
        </div>
      </nav>

      <main className="home-content">
        <div className="hero-badge">
          <ShieldCheck size={18} />
          Government Verified Tourism
        </div>

        <h1 className="hero-title">
          Discover the<span> Hidden India</span>
        </h1>

        <p className="hero-description">
          Explore government-approved hidden destinations, support local communities
          and help create a more sustainable future for tourism.
        </p>

        <div className="login-options">
          <Link to="/public-login" className="login-card">
            <div className="icon-box public-icon">
              <Users size={29} />
            </div>

            <div className="login-card-content">
              <h2 className="public-login-title">Public Login</h2>
              <p>Discover hidden destinations, stays and local experiences.</p>
            </div>

            <ArrowRight className="arrow" />
          </Link>

          <Link to="/government-login" className="login-card">
            <div className="icon-box government-icon">
              <ShieldCheck size={29} />
            </div>

            <div className="login-card-content">
              <h2 className="government-login-title">Government Login</h2>
              <p>Verify destinations and monitor tourism impact using analytics.</p>
            </div>

            <ArrowRight className="arrow" />
          </Link>
        </div>
      </main>

      <section className="about-section" id="about">
        <div className="about-container">
          <div className="about-text">
            <span className="section-tag">ABOUT</span>
            <h2>Bringing hidden destinations into the spotlight.</h2>
            <p>
              Tourism is designed to help travelers discover government-approved
              destinations that are often overlooked by mainstream tourism.
            </p>
            <p>
              By redistributing tourist flow toward lesser-known places, the platform
              aims to support local communities, encourage local employment and reduce
              pressure on overcrowded tourist destinations.
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
                <span>Explore beyond the obvious.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-section" id="mission">
        <div className="mission-container">
          <div className="mission-heading">
            <span className="section-tag">OUR MISSION</span>
            <h2>Tourism that benefits more than the tourist.</h2>
            <p>
              We connect exploration with sustainability, local opportunity and
              smarter tourism decisions.
            </p>
          </div>

          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon green">
                <Globe2 size={27} />
              </div>
              <h3>Discover Hidden India</h3>
              <p>Help travelers discover lesser-known destinations across India.</p>
            </div>

            <div className="mission-card">
              <div className="mission-icon blue">
                <Leaf size={27} />
              </div>
              <h3>Sustainable Tourism</h3>
              <p>
                Reduce pressure on overcrowded destinations by redistributing
                tourist movement.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon orange">
                <BriefcaseBusiness size={27} />
              </div>
              <h3>Local Employment</h3>
              <p>
                Encourage opportunities for local communities and tourism workers.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon purple">
                <BarChart3 size={27} />
              </div>
              <h3>Smart Decisions</h3>
              <p>
                Help governments use tourism information to make better decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <MapPin size={26} />
              <span>Hidden Horizon</span>
            </div>
            <p>
              Discover hidden destinations. Support local communities. Travel more
              sustainably.
            </p>
          </div>

          <div className="footer-links">
            <h3>Explore</h3>
            <a href="#about">About</a>
            <a href="#mission">Our Mission</a>
          </div>

          <div className="footer-contact">
            <h3>Contact</h3>
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
          <p>©️ 2026 Tourism Initiative</p>
          <span>Built for sustainable tourism.</span>
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
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      if (data.role !== "PUBLIC") {
        throw new Error("This account is not a public account.");
      }

      localStorage.setItem("user_id", String(data.user_id));
      localStorage.setItem("user_name", data.name);
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_role", data.role);
      localStorage.setItem("s21_user", JSON.stringify(data));

      navigate("/public");
    } catch (error) {
      setError(error.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${LOCATION_IMAGES.deomali})` }}
    >
      <div className="login-overlay"></div>

      <div className="login-box">
        <MapPin size={48} className="login-icon" />
        <h1 className="public-login-heading">Public Login</h1>
        <p>Login to explore hidden destinations across India.</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="login-error">{error}</p>}

        <button
          onClick={login}
          disabled={loading}
          className="login-submit-btn"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <Link to="/">← Back to Home</Link>
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
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      if (data.role !== "GOVERNMENT") {
        throw new Error("This account is not a government account.");
      }

      localStorage.setItem("user_id", String(data.user_id));
      localStorage.setItem("user_name", data.name);
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_role", data.role);
      localStorage.setItem("s21_user", JSON.stringify(data));

      navigate("/government");
    } catch (error) {
      setError(error.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${LOCATION_IMAGES.deomali})` }}
    >
      <div className="login-overlay"></div>

      <div className="login-box">
        <ShieldCheck size={48} className="login-icon" />
        <h1 className="government-login-heading">Government Login</h1>
        <p>Access the S21 tourism management dashboard.</p>

        <input
          type="email"
          placeholder="Government Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="login-error">{error}</p>}

        <button
          onClick={login}
          disabled={loading}
          className="login-submit-btn"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <Link to="/">← Back to Home</Link>
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
  const [loadingStates, setLoadingStates] = useState(true);

  const [selectedPopularState, setSelectedPopularState] = useState("");
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(false);

  const [selectedState, setSelectedState] = useState("");
  const [hiddenDestinations, setHiddenDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);

  const [error, setError] = useState("");

  const [placeForm, setPlaceForm] = useState({
    name: "",
    state: "",
    district: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const [placeSubmitting, setPlaceSubmitting] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [placeMessage, setPlaceMessage] = useState("");
  const [placeError, setPlaceError] = useState("");

  useEffect(() => {
    const loadStates = async () => {
      try {
        setLoadingStates(true);
        setError("");

        const response = await fetch(`${API_URL}/states`);
        if (!response.ok) {
          throw new Error("Failed to load states.");
        }

        const data = await response.json();
        const stateList = (Array.isArray(data) ? data : [])
          .map((item) => {
            if (typeof item === "string") return item.trim();
            return String(
              item?.name || item?.state || item?.state_name || ""
            ).trim();
          })
          .filter(Boolean);

        setStates([...new Set(stateList)]);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load states.");
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, []);

  const fetchStateDestinations = async (state) => {
    const response = await fetch(
      `${API_URL}/destinations/${encodeURIComponent(state)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to load destinations for ${state}.`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  };

  const isPopularLocation = (destination) => {
    const name = String(destination?.name || "").toLowerCase();
    return (
      destination?.destination_type === "famous" ||
      destination?.destination_type === "popular" ||
      name.includes("puri") ||
      name.includes("konark") ||
      name.includes("deomali") ||
      name.includes("mahendragiri") ||
      name.includes("kandhamal") ||
      name.includes("nature valley")
    );
  };

  const handlePopularStateChange = async (event) => {
    const state = event.target.value;
    setSelectedPopularState(state);
    setPopularDestinations([]);
    setError("");

    if (!state) return;

    try {
      setLoadingPopular(true);
      const data = await fetchStateDestinations(state);
      const popular = data.filter(isPopularLocation);

      const seen = new Set();
      const uniquePopular = popular.filter((destination) => {
        const key =
          destination?.id ??
          `${destination?.name}-${destination?.state}-${destination?.district}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setPopularDestinations(uniquePopular);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load popular locations.");
      setPopularDestinations([]);
    } finally {
      setLoadingPopular(false);
    }
  };

  const handleStateChange = async (event) => {
    const state = event.target.value;
    setSelectedState(state);
    setHiddenDestinations([]);
    setError("");

    if (!state) return;

    try {
      setLoadingDestinations(true);
      const data = await fetchStateDestinations(state);

      const filteredHidden = data.filter((dest) => {
        const name = String(dest?.name || "").toLowerCase().trim();
        const isSeededPopular =
          name.includes("deomali") ||
          name.includes("mahendragiri") ||
          name.includes("kandhamal") ||
          name.includes("puri") ||
          name.includes("konark");

        const isMarkedPopular =
          dest?.destination_type === "popular" ||
          dest?.destination_type === "famous";

        return !isSeededPopular && !isMarkedPopular;
      });

      setHiddenDestinations(filteredHidden);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load hidden destinations.");
      setHiddenDestinations([]);
    } finally {
      setLoadingDestinations(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handlePlaceSubmit = async (event) => {
    event.preventDefault();

    setPlaceMessage("");
    setPlaceError("");

    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setPlaceError("Please login before submitting a hidden location.");
      return;
    }

    if (
      !placeForm.name.trim() ||
      !placeForm.state.trim() ||
      !placeForm.district.trim() ||
      !placeForm.description.trim() ||
      !placeForm.latitude ||
      !placeForm.longitude
    ) {
      setPlaceError("Please fill in all required fields.");
      return;
    }

    try {
      setPlaceSubmitting(true);

      let uploadedImageUrl = "";

      if (imageFile) {
        const imageData = new FormData();
        imageData.append("image", imageFile);

        const imageResponse = await fetch(`${API_URL}/upload-image`, {
          method: "POST",
          body: imageData,
        });

        const imageResult = await imageResponse.json();

        if (!imageResponse.ok) {
          throw new Error(imageResult.detail || "Image upload failed.");
        }

        uploadedImageUrl = imageResult.image_url;
      }

      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("name", placeForm.name.trim());
      formData.append("state", placeForm.state.trim());
      formData.append("district", placeForm.district.trim());
      formData.append("description", placeForm.description.trim());
      formData.append("latitude", placeForm.latitude);
      formData.append("longitude", placeForm.longitude);

      if (uploadedImageUrl) {
        formData.append("image_url", uploadedImageUrl);
      }

      if (videoFile) {
        formData.append("video", videoFile);
      }

      const response = await fetch(`${API_URL}/places/submit`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to submit the location.");
      }

      setPlaceMessage(
        "Location submitted successfully. It is now awaiting government verification."
      );

      setPlaceForm({
        name: "",
        state: "",
        district: "",
        description: "",
        latitude: "",
        longitude: "",
      });

      setImageFile(null);
      setVideoFile(null);
    } catch (err) {
      console.error(err);
      setPlaceError(
        err.message || "Something went wrong while submitting the location."
      );
    } finally {
      setPlaceSubmitting(false);
    }
  };

  const renderDestinationCard = (destination, type) => {
    const bgImage = getLocationImage(destination);
    const isPopular = type === "popular";

    return (
      <article
        className={`destination-card ${
          isPopular ? "popular-destination-card" : "hidden-destination-card"
        }`}
        key={
          destination?.id ??
          `${destination?.name}-${destination?.district}`
        }
        style={{ backgroundImage: `url("${bgImage}")` }}
      >
        <div className="destination-card-overlay"></div>

        <div className="destination-card-content">
          <span className="destination-tag">
            {isPopular ? "POPULAR LOCATION" : "GOVERNMENT VERIFIED"}
          </span>

          <h2>{destination?.name || "Destination"}</h2>

          <p className="destination-location">
            📍 {destination?.district || ""}
            {destination?.district && destination?.state ? ", " : ""}
            {destination?.state || ""}
          </p>

          <p className="destination-description">
            {destination?.description ||
              "Discover this destination and explore what makes it special."}
          </p>

          {destination?.id ? (
            <button
              type="button"
              onClick={() => navigate(`/destination/${destination.id}`)}
            >
              Explore Destination
              <ArrowRight size={16} />
            </button>
          ) : (
            <span className="destination-unavailable">
              Destination details unavailable
            </span>
          )}
        </div>
      </article>
    );
  };

  return (
    <div
      className="explore-page"
      style={{ backgroundImage: `url(${LOCATION_IMAGES.beach})` }}
    >
      <div className="explore-page-overlay"></div>

      <nav className="navbar explore-navbar">
        <div className="logo explore-logo">
          <MapPin size={28} />
          <span>Hidden Horizon</span>
        </div>

        <div className="explore-nav-actions">

          <button
            type="button"
            className="explore-logout"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="explore-content dashboard-content">
        <section className="explore-header">
          <span className="section-tag explore-eyebrow">EXPLORE INDIA</span>
          <h1>
            Discover
            <span> Hidden Horizons</span>
          </h1>
          <p>
            Explore iconic destinations, discover hidden places and travel
            beyond the usual routes.
          </p>
        </section>

        {error && <div className="api-error">{error}</div>}

        {/* POPULAR LOCATIONS */}
        <section className="destination-section popular-locations-section">
          <div className="destination-section-heading">
            <div>
              <span>MUST VISIT</span>
              <h2>Popular Locations</h2>
              <p>Well-loved destinations worth experiencing at least once.</p>
            </div>
            <div className="section-heading-icon">⭐</div>
          </div>

          <section className="state-box popular-state-box">
            <label htmlFor="popular-state">Select State</label>
            <select
              id="popular-state"
              value={selectedPopularState}
              onChange={handlePopularStateChange}
              disabled={loadingStates}
            >
              <option value="">
                {loadingStates ? "Loading states..." : "Select a state"}
              </option>

              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </section>

          {!selectedPopularState && !loadingStates && (
            <div className="state-selection-hint">
              <span>⭐</span>
              <div>
                <h3>Select a state to explore popular locations.</h3>
                <p>
                  Choose a state above and the destinations available in that
                  state will appear here.
                </p>
              </div>
            </div>
          )}

          {selectedPopularState && loadingPopular && (
            <div className="section-loading">
              Loading popular locations in {selectedPopularState}...
            </div>
          )}

          {selectedPopularState &&
            !loadingPopular &&
            popularDestinations.length === 0 && (
              <div className="section-empty">
                <h3>No popular locations available</h3>
                <p>
                  No popular destinations were found in {selectedPopularState}.
                </p>
              </div>
            )}

          {selectedPopularState &&
            !loadingPopular &&
            popularDestinations.length > 0 && (
              <div className="destination-grid">
                {popularDestinations.map((destination) =>
                  renderDestinationCard(destination, "popular")
                )}
              </div>
            )}
        </section>

        {/* HIDDEN LOCATIONS */}
        <section className="destination-section hidden-locations-section">
          <div className="destination-section-heading">
            <div>
              <span>OFF THE BEATEN PATH</span>
              <h2>Hidden Locations</h2>
              <p>Discover government-verified places that deserve more attention.</p>
            </div>
            <div className="section-heading-icon">🌿</div>
          </div>

          <section className="state-box">
            <label htmlFor="hidden-state">Select State</label>
            <select
              id="hidden-state"
              value={selectedState}
              onChange={handleStateChange}
              disabled={loadingStates}
            >
              <option value="">
                {loadingStates ? "Loading states..." : "Select a state"}
              </option>

              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </section>

          {!selectedState && !loadingStates && (
            <div className="hidden-location-hint">
              <span>🌿</span>
              <div>
                <h3>Find something less ordinary.</h3>
                <p>
                  Select a state above to explore government-approved hidden
                  locations available there.
                </p>
              </div>
            </div>
          )}

          {selectedState && loadingDestinations && (
            <div className="loading-message">
              Loading hidden locations in {selectedState}...
            </div>
          )}

          {selectedState &&
            !loadingDestinations &&
            hiddenDestinations.length === 0 && (
              <div className="empty-message">
                No approved hidden locations found in {selectedState}.
              </div>
            )}

          {selectedState &&
            !loadingDestinations &&
            hiddenDestinations.length > 0 && (
              <div className="destination-grid hidden-grid">
                {hiddenDestinations.map((destination) =>
                  renderDestinationCard(destination, "hidden")
                )}
              </div>
            )}
        </section>

        {/* SUBMIT HIDDEN LOCATION */}
        <section className="hidden-place-section">
          <div className="hidden-place-heading">
            <span>COMMUNITY DISCOVERY</span>
            <h2>Know a Hidden Place?</h2>
            <p>
              Help travellers discover beautiful places beyond the usual
              tourist routes. Your suggestion will be reviewed by the
              government before appearing publicly.
            </p>
          </div>

          <div className="hidden-place-card">
            <form onSubmit={handlePlaceSubmit} className="hidden-place-form">
              <div className="hidden-form-group full">
                <label>Destination Name</label>
                <input
                  type="text"
                  placeholder="Enter the place name"
                  value={placeForm.name}
                  onChange={(e) =>
                    setPlaceForm({ ...placeForm, name: e.target.value })
                  }
                />
              </div>

              <div className="hidden-form-group">
                <label>State</label>
                <input
                  type="text"
                  placeholder="e.g. Odisha"
                  value={placeForm.state}
                  onChange={(e) =>
                    setPlaceForm({ ...placeForm, state: e.target.value })
                  }
                />
              </div>

              <div className="hidden-form-group">
                <label>District</label>
                <input
                  type="text"
                  placeholder="Enter district"
                  value={placeForm.district}
                  onChange={(e) =>
                    setPlaceForm({ ...placeForm, district: e.target.value })
                  }
                />
              </div>

              <div className="hidden-form-group full">
                <label>Description</label>
                <textarea
                  placeholder="Tell travellers what makes this place special..."
                  rows="4"
                  value={placeForm.description}
                  onChange={(e) =>
                    setPlaceForm({
                      ...placeForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="hidden-form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 19.8135"
                  value={placeForm.latitude}
                  onChange={(e) =>
                    setPlaceForm({ ...placeForm, latitude: e.target.value })
                  }
                />
              </div>

              <div className="hidden-form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 85.8312"
                  value={placeForm.longitude}
                  onChange={(e) =>
                    setPlaceForm({ ...placeForm, longitude: e.target.value })
                  }
                />
              </div>

              {/* IMAGE INPUT */}
              <div className="hidden-form-group full">
                <label>
                  <ImageIcon
                    size={15}
                    style={{
                      display: "inline",
                      verticalAlign: "middle",
                      marginRight: "6px",
                    }}
                  />
                  Destination Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                  }}
                />

                <span className="form-hint">
                  Select a destination image directly from your gallery. JPG, PNG and WebP are supported.
                </span>

                {imageFile && (
                  <span className="form-hint">
                    Selected: {imageFile.name}
                  </span>
                )}
              </div>

              {/* VIDEO INPUT */}
              <div className="hidden-form-group full">
                <label>Destination Video</label>

                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setVideoFile(file);
                  }}
                />

                <span className="form-hint">
                  Select a video directly from your gallery. MP4, WebM, MOV or AVI are supported.
                </span>

                {videoFile && (
                  <span className="form-hint">
                    Selected: {videoFile.name}
                  </span>
                )}
              </div>

              {placeError && (
                <div className="hidden-place-error">{placeError}</div>
              )}

              {placeMessage && (
                <div className="hidden-place-success">✓ {placeMessage}</div>
              )}

              <button
                type="submit"
                className="hidden-place-submit"
                disabled={placeSubmitting}
              >
                {placeSubmitting
                  ? "Submitting..."
                  : "Submit Hidden Location →"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

// =====================================================
// DESTINATION DETAILS PAGE
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

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          destinationResponse,
          reviewsResponse,
          footfallResponse,
          staysResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/destination/${destination_id}`),
          fetch(`${API_URL}/reviews/${destination_id}`),
          fetch(`${API_URL}/footfall/${destination_id}`),
          fetch(`${API_URL}/stays/${destination_id}`),
        ]);

        if (!destinationResponse.ok) {
          throw new Error("Destination not found.");
        }

        const destinationData = await destinationResponse.json();
        const reviewsData = reviewsResponse.ok
          ? await reviewsResponse.json()
          : [];
        const footfallData = footfallResponse.ok
          ? await footfallResponse.json()
          : [];
        const staysData = staysResponse.ok
          ? await staysResponse.json()
          : [];

        setDestination(destinationData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        setFootfall(Array.isArray(footfallData) ? footfallData : []);
        setStays(Array.isArray(staysData) ? staysData : []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load destination.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [destination_id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSuccess("");
    setReviewError("");

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setReviewError("Please login to submit a review.");
      return;
    }

    if (!reviewFeedback.trim()) {
      setReviewError("Please share your feedback before submitting.");
      return;
    }

    try {
      setReviewSubmitting(true);

      const params = new URLSearchParams({
        user_id: userId,
        destination_id: destination_id,
        rating: reviewRating,
        feedback: reviewFeedback.trim(),
      });

      const response = await fetch(`${API_URL}/reviews?${params.toString()}`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to post review.");
      }

      setReviewSuccess("Thank you! Your review has been added.");

      setReviews((prev) => [
        {
          id: data.review_id || Date.now(),
          destination_id: Number(destination_id),
          user_id: Number(userId),
          rating: Number(reviewRating),
          feedback: reviewFeedback.trim(),
        },
        ...prev,
      ]);

      setReviewFeedback("");
      setReviewRating(5);
    } catch (err) {
      console.error(err);
      setReviewError(err.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h1>Loading destination...</h1>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="error-page">
        <div>
          <h1>Something went wrong</h1>
          <p>{error || "Destination not found."}</p>
          <button
            type="button"
            className="destination-back"
            onClick={() => navigate("/public")}
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
        backgroundImage: `url(${getLocationImage(destination)})`,
      }}
    >
      <div className="destination-page-overlay"></div>

      <nav className="destination-navbar">
        <div className="logo white-logo">
          <MapPin size={28} />
          <span>Hidden Horizon</span>
        </div>
      </nav>

      <main className="destination-main">
        <div className="destination-nav-wrapper">
          <button
            className="destination-back"
            onClick={() => navigate("/public")}
          >
            ← Back to Destinations
          </button>
        </div>

        <section className="destination-header">
          <span className="destination-tag">HIDDEN DESTINATION</span>
          <h1>{destination.name}</h1>
          <p className="destination-location">
            📍 {destination.district}, {destination.state}
          </p>
          <p className="destination-description">
            {destination.description ||
              "Discover this beautiful destination and explore what makes it special."}
          </p>
        </section>

        {destination.video_url && (
          <section className="details-section destination-video-section">
            <div className="details-section-heading">
              <span>EXPLORE THE DESTINATION</span>
              <h2>Destination Video</h2>
            </div>

            <video
              className="destination-video"
              controls
              playsInline
              preload="metadata"
              src={`${API_URL}${destination.video_url}`}
            >
              Your browser does not support video playback.
            </video>
          </section>
        )}

        <div className="destination-stats">
          <div className="stat-card">
            <h3>Reviews</h3>
            <strong>{reviews.length}</strong>
          </div>

          <div className="stat-card">
            <h3>Footfall Records</h3>
            <strong>{footfall.length}</strong>
          </div>

          <div className="stat-card">
            <h3>Nearby Stays</h3>
            <strong>{stays.length}</strong>
          </div>
        </div>

        {/* REVIEWS */}
        <section className="details-section">
          <div className="details-section-heading">
            <span>TRAVEL EXPERIENCES</span>
            <h2>Reviews & Feedback</h2>
          </div>

          <div className="review-submission-box">
            <h3>Share Your Experience</h3>
            <p>Visited {destination.name}? Help other travelers with your thoughts.</p>

            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="star-rating-select">
                <label>Your Rating:</label>
                <div className="star-group">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-btn ${
                        (reviewHoverRating || reviewRating) >= star ? "filled" : ""
                      }`}
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHoverRating(star)}
                      onMouseLeave={() => setReviewHoverRating(0)}
                    >
                      <Star
                        size={24}
                        fill={
                          (reviewHoverRating || reviewRating) >= star
                            ? "#fde047"
                            : "none"
                        }
                      />
                    </button>
                  ))}
                  <span className="rating-score">{reviewRating} / 5</span>
                </div>
              </div>

              <div className="review-input-group">
                <textarea
                  placeholder={`Write your honest review about ${destination.name}...`}
                  rows="3"
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                />
              </div>

              {reviewError && <div className="review-form-error">{reviewError}</div>}
              {reviewSuccess && <div className="review-form-success">✓ {reviewSuccess}</div>}

              <button
                type="submit"
                className="review-submit-btn"
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Submitting..." : "Post Review"}
              </button>
            </form>
          </div>

          {reviews.length === 0 ? (
            <div className="review-empty">No reviews yet. Be the first to review!</div>
          ) : (
            <div className="reviews-grid">
              {reviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <div className="review-rating">⭐ {review.rating ?? 0}/5</div>
                  <p className="review-feedback">
                    {String(review.feedback || "No written feedback provided.")}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* NEARBY STAYS */}
        <section className="details-section stays-section">
          <div className="details-section-heading">
            <span>STAY NEARBY</span>
            <h2>Where to Stay</h2>
          </div>

          {stays.length === 0 ? (
            <div className="review-empty">No nearby stays available.</div>
          ) : (
            <div className="stays-grid">
              {stays.map((stay) => (
                <article className="stay-card" key={stay.id}>
                  <div className="stay-icon">🏨</div>
                  <div className="stay-info">
                    <h3>{String(stay.name || "Stay")}</h3>
                    {stay.address && (
                      <p className="stay-address">📍 {String(stay.address)}</p>
                    )}
                    {stay.price_per_night !== null &&
                      stay.price_per_night !== undefined && (
                        <p className="stay-price">
                          ₹{Number(stay.price_per_night).toLocaleString()}
                          <span> / night</span>
                        </p>
                      )}
                    {stay.contact && (
                      <p className="stay-contact">📞 {String(stay.contact)}</p>
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
                </article>
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
        <Route path="/government" element={<GovernmentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;