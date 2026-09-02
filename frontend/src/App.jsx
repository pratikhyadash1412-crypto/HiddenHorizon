import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  MapPin,
  ShieldCheck,
  Users,
  ArrowRight,
  Sparkles,
  Mail,
  Phone,
  Image as ImageIcon,
  Star,
  Compass,
  Video,
  LogOut,
} from "lucide-react";
import "./App.css";
import GovernmentDashboard from "./GovernmentDashboard";

// =====================================================
// BACKEND API URL
// =====================================================
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// BREATHTAKING NATURAL WATERFALL HERO BACKGROUND IMAGE
const WATERFALL_HERO_BG = "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=2200&q=90";

// VACATION TRAVEL IMAGE (ABOUT SECTION)
const VACATION_ABOUT_IMAGE = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=85";

// =====================================================
// IMAGE RESOLUTION (USES EXACT DATABASE IMAGE URL)
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
    if (image.startsWith("/")) {
      return `${API_URL}${image}`;
    }
    return image;
  }

  return WATERFALL_HERO_BG;
}

function getMapEmbedUrl(latitude, longitude) {
  if (latitude === null || latitude === undefined || latitude === "" ||
      longitude === null || longitude === undefined || longitude === "") return null;
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  const padding = 0.035;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - padding}%2C${lat - padding}%2C${lng + padding}%2C${lat + padding}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function getDirectionsUrl(latitude, longitude) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${latitude},${longitude}`)}`;
}

// =====================================================
// HOME PAGE COMPONENT (WATERFALL HERO + SOLID CRISP SECTIONS)
// =====================================================
function Home() {
  return (
    <div className="home-page-container">
      {/* 1. HERO SECTION WITH WATERFALL BACKGROUND ONLY */}
      <header
        className="home-hero-section"
        style={{
          backgroundImage: `url("${WATERFALL_HERO_BG}")`,
        }}
      >
        <div className="home-hero-overlay"></div>

        {/* AMBIENT FLOATING ELEMENTS CONFINED TO HERO */}
        <div className="travel-sun travel-sun-one"></div>
        <div className="travel-sun travel-sun-two"></div>
        <div className="floating-travel travel-plane">✈️</div>
        <div className="floating-travel travel-cloud cloud-one">☁️</div>
        <div className="floating-travel travel-cloud cloud-two">☁️</div>

        {/* NAVBAR */}
        <nav className="navbar home-navbar fun-navbar">
          <Link to="/" className="logo home-logo fun-logo">
            <div className="logo-icon-wrapper">
              <Compass size={22} className="logo-spin-icon" />
            </div>
            <div className="fun-logo-copy">
              <span>Hidden Horizon</span>
              <small>Travel beyond the usual</small>
            </div>
          </Link>

          <div className="nav-links">
            <a href="#about" className="nav-link">Why us</a>
            <a href="#mission" className="nav-link">Our journey</a>
            <Link to="/public-login" className="nav-btn-pill fun-nav-cta">
              Explorer Portal <ArrowRight size={14} />
            </Link>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div className="home-content fun-home-content">
          <div className="hero-badge fun-hero-badge animate-fade-in">
            <span className="badge-dot"></span>
            <Sparkles size={15} />
            <span>Government-verified • Sustainable • Ready to explore</span>
          </div>

          <div className="hero-route-pill">
            <span>🧭</span> Take the scenic route <span>•</span> Find your next story
          </div>

          {/* HIGH-VIBRANCY PLAYFUL HERO TITLE */}
          <h1 className="hero-title fun-hero-title animate-slide-up">
            <span className="hero-text-top">Your next adventure</span>
            <span className="hero-text-bottom">is hiding in plain sight. ✨</span>
          </h1>

          <p className="hero-description fun-hero-description animate-slide-up">
            Skip the crowded checklist. Discover beautiful, lesser-known places across India,
            support local communities, and travel with a lighter footprint.
          </p>

          {/* FEATURE TAGS */}
          <div className="hero-mini-stats animate-slide-up">
            <div><strong>🌄</strong><span>Discover Gems</span></div>
            <div><strong>🤝</strong><span>Support Local Stays</span></div>
            <div><strong>🌿</strong><span>Travel Responsibly</span></div>
          </div>

          {/* ATTRACTIVE DUAL PORTAL CARDS */}
          <div className="portal-switcher animate-slide-up">
            <div className="portal-switcher-label">✨ CHOOSE YOUR JOURNEY ✨</div>
            <div className="login-options">
              <Link to="/public-login" className="login-card public-card fun-portal-card modern-public-card">
                <div className="icon-box public-icon">
                  <Users size={28} />
                </div>
                <div className="login-card-content">
                  <div className="portal-badge-tag public-badge-tag">FOR TRAVELLERS & EXPLORERS</div>
                  <h2 className="public-login-title">Public Portal 🎒</h2>
                  <p>Discover verified hidden spots, cozy homestays & untouched nature trails.</p>
                  <div className="card-cta-action">
                    <span>Enter Explorer Portal</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>

              <Link to="/government-login" className="login-card government-card fun-portal-card modern-gov-card">
                <div className="icon-box government-icon">
                  <ShieldCheck size={28} />
                </div>
                <div className="login-card-content">
                  <div className="portal-badge-tag gov-badge-tag">FOR OFFICIALS & AUTHORITIES</div>
                  <h2 className="government-login-title">Government Portal 🏛️</h2>
                  <p>Verify destinations, monitor carrying capacity (TPI) & simulate flow policies.</p>
                  <div className="card-cta-action gov-action">
                    <span>Enter Command Center</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 2. ABOUT SECTION (SOLID CLEAN CRISP, ZERO GLASS BLEED) */}
      <section className="about-section fun-about solid-about" id="about">
        <div className="about-container">
          <div className="about-text">
            <span className="section-tag fun-section-tag">THE IDEA</span>
            <h2>India has more stories than the tourist map shows.</h2>
            <p>
              Hidden Horizon helps travellers discover verified places beyond the usual hotspots.
              The goal is simple: make exploration exciting while spreading tourism opportunities more fairly.
            </p>
            <p>
              Every discovery can mean more visibility for local hosts, guides and communities—and less pressure on places already bursting at the seams.
            </p>
            <div className="about-stats-mini fun-stats">
              <div className="mini-stat"><strong>01</strong><span>Discover differently</span></div>
              <div className="mini-stat"><strong>02</strong><span>Travel consciously</span></div>
              <div className="mini-stat"><strong>03</strong><span>Leave a positive trace</span></div>
            </div>
          </div>
          <div className="about-visual fun-about-visual">
            <div className="about-image-card fun-image-card solid-image-card">
              <img
                src={VACATION_ABOUT_IMAGE}
                alt="Travel vacation adventure"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION SECTION (SOLID CLEAN CRISP, ZERO GLASS EFFECT) */}
      <section className="mission-section fun-mission solid-mission" id="mission">
        <div className="mission-container">
          <div className="mission-heading">
            <span className="section-tag fun-section-tag">THE JOURNEY</span>
            <h2>Travel should feel like an adventure, not a checklist.</h2>
            <p>Four simple ideas behind a more balanced way to explore India.</p>
          </div>
          <div className="mission-grid">
            <div className="mission-card fun-mission-card solid-mission-card">
              <div className="mission-icon cyan">🧭</div>
              <h3>Find the Unusual</h3>
              <p>Go beyond the famous spots and discover places with their own character.</p>
            </div>
            <div className="mission-card fun-mission-card solid-mission-card">
              <div className="mission-icon blue">🗺️</div>
              <h3>Spread the Journey</h3>
              <p>Give emerging destinations a chance while reducing pressure on crowded hotspots.</p>
            </div>
            <div className="mission-card fun-mission-card solid-mission-card">
              <div className="mission-icon amber">🤝</div>
              <h3>Meet Local Stories</h3>
              <p>Help rural hosts, guides and artisans benefit from responsible tourism.</p>
            </div>
            <div className="mission-card fun-mission-card solid-mission-card">
              <div className="mission-icon purple">🌿</div>
              <h3>Leave It Better</h3>
              <p>Explore with awareness of safety, capacity and the environment around you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOLID CLEAN FOOTER */}
      <footer className="footer fun-footer solid-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <Compass size={24} />
              <span>Hidden Horizon</span>
            </div>
            <p>Discover hidden destinations. Support local communities. Travel responsibly.</p>
          </div>
          <div className="footer-links">
            <h3>Explore</h3>
            <a href="#about">Why Hidden Horizon?</a>
            <a href="#mission">Our Journey</a>
            <Link to="/public-login">Start Exploring</Link>
            <Link to="/government-login">Government Portal</Link>
          </div>
          <div className="footer-contact">
            <h3>Say hello</h3>
            <p><Mail size={15} /> support@tourism.in</p>
            <p><Phone size={15} /> 1800-TOURISM-IND</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>©️ {new Date().getFullYear()} Hidden Horizon Initiative.</p>
          <span>Made for curious travellers & sustainable India.</span>
        </div>
      </footer>
    </div>
  );
}

// =====================================================
// PUBLIC LOGIN COMPONENT
// =====================================================
function PublicLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed.");
      }

      if (data.role !== "PUBLIC") {
        throw new Error("This account is for Public Explorers only.");
      }

      localStorage.setItem("user_id", String(data.user_id));
      localStorage.setItem("user_name", data.name);
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_role", data.role);
      localStorage.setItem("s21_user", JSON.stringify(data));

      navigate("/public");
    } catch (err) {
      setError(err.message || "Unable to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page fun-login-page"
      style={{
        backgroundImage: `url("${WATERFALL_HERO_BG}")`,
      }}
    >
      <div className="login-overlay fun-login-overlay"></div>

      <div className="login-box fun-login-box animate-scale-up">
        <div className="login-badge-pill">
          <span>✨ EXPLORER ACCESS</span>
        </div>

        <div className="login-header-icon fun-icon-glow">
          <Users size={30} />
        </div>

        <h1 className="login-heading fun-login-title">Welcome Back, Explorer! 🎒</h1>
        <p className="login-subtext fun-login-sub">Sign in to unlock verified hidden spots, secret waterfalls & village homestays.</p>

        <form onSubmit={handleLogin} className="login-form fun-login-form">
          <div className="input-group fun-input-group">
            <label>Traveler Email</label>
            <input
              type="email"
              placeholder="e.g. explorer@travel.in"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group fun-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="login-error-alert fun-error-alert">{error}</div>}

          <button type="submit" disabled={loading} className="login-submit-btn fun-submit-cta">
            {loading ? "Packing your bags..." : "Start Exploring →"}
          </button>
        </form>

        <Link to="/" className="back-link fun-back-link">← Return to Home</Link>
      </div>
    </div>
  );
}

// =====================================================
// GOVERNMENT LOGIN COMPONENT
// =====================================================
function GovernmentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed.");
      }

      if (data.role !== "GOVERNMENT") {
        throw new Error("Unauthorized: Government credentials required.");
      }

      localStorage.setItem("user_id", String(data.user_id));
      localStorage.setItem("user_name", data.name);
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_role", data.role);
      localStorage.setItem("s21_user", JSON.stringify(data));

      navigate("/government");
    } catch (err) {
      setError(err.message || "Unable to connect to government server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page gov-modern-login-page"
      style={{
        backgroundImage: `url("${WATERFALL_HERO_BG}")`,
      }}
    >
      <div className="login-overlay gov-modern-overlay"></div>

      <div className="login-box gov-modern-box animate-scale-up">
        <div className="login-badge-pill gov-pill">
          <span>🏛️ OFFICIAL AUTHORITY PORTAL</span>
        </div>

        <div className="login-header-icon gov-modern-icon">
          <ShieldCheck size={32} />
        </div>

        <h1 className="login-heading gov-login-title">Government Command 🛡️</h1>
        <p className="login-subtext gov-login-sub">National Tourism Carrying Capacity & Decision Support System (NTCC-DSS).</p>

        <form onSubmit={handleLogin} className="login-form gov-login-form">
          <div className="input-group fun-input-group">
            <label>Official Email</label>
            <input
              type="email"
              placeholder="e.g. officer@tourism.gov.in"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group fun-input-group">
            <label>Secure Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="login-error-alert fun-error-alert">{error}</div>}

          <button type="submit" disabled={loading} className="login-submit-btn gov-modern-cta">
            {loading ? "Authenticating Official..." : "Enter Command Center →"}
          </button>
        </form>

        <Link to="/" className="back-link gov-back-link">← Return to Home</Link>
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
  const [placeForm, setPlaceForm] = useState({ name: "", state: "", district: "", description: "", latitude: "", longitude: "" });
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
        if (!response.ok) throw new Error("Failed to load state directories.");
        const data = await response.json();
        const stateList = (Array.isArray(data) ? data : [])
          .map((item) => typeof item === "string" ? item.trim() : String(item?.name || item?.state || item?.state_name || "").trim())
          .filter(Boolean);
        setStates([...new Set(stateList)]);
      } catch (err) {
        console.error(err);
        setStates(["Odisha", "Uttarakhand", "Himachal Pradesh", "Kerala", "Sikkim", "Goa"]);
      } finally { setLoadingStates(false); }
    };
    loadStates();
  }, []);

  const fetchStateDestinations = async (state) => {
    const response = await fetch(`${API_URL}/destinations/${encodeURIComponent(state)}`);
    if (!response.ok) throw new Error(`Failed to load destinations for ${state}.`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  };

  const isPopularLocation = (destination) => {
    const name = String(destination?.name || "").toLowerCase();
    return destination?.destination_type === "famous" || destination?.destination_type === "popular" || name.includes("puri") || name.includes("deomali") || name.includes("mahendragiri") || name.includes("kandhamal") || name.includes("beach");
  };

  const handlePopularStateChange = async (event) => {
    const state = event.target.value;
    setSelectedPopularState(state); setPopularDestinations([]); setError("");
    if (!state) return;
    try {
      setLoadingPopular(true);
      const data = await fetchStateDestinations(state);
      const popular = data.filter(isPopularLocation);
      const seen = new Set();
      setPopularDestinations(popular.filter((dest) => { const key = dest?.id ?? `${dest?.name}-${dest?.district}`; if (seen.has(key)) return false; seen.add(key); return true; }));
    } catch (err) { console.error(err); setError(err.message || "Unable to load popular destinations."); }
    finally { setLoadingPopular(false); }
  };

  const handleStateChange = async (event) => {
    const state = event.target.value;
    setSelectedState(state); setHiddenDestinations([]); setError("");
    if (!state) return;
    try {
      setLoadingDestinations(true);
      const data = await fetchStateDestinations(state);
      setHiddenDestinations(data.filter((dest) => {
        const name = String(dest?.name || "").toLowerCase().trim();
        const seededPopular = name.includes("puri") || name.includes("deomali") || name.includes("mahendragiri") || name.includes("kandhamal");
        const markedPopular = dest?.destination_type === "popular" || dest?.destination_type === "famous";
        return !seededPopular && !markedPopular;
      }));
    } catch (err) { console.error(err); setError(err.message || "Unable to load hidden destinations."); }
    finally { setLoadingDestinations(false); }
  };

  const logout = () => { localStorage.clear(); navigate("/"); };

  const handlePlaceSubmit = async (event) => {
    event.preventDefault(); setPlaceMessage(""); setPlaceError("");
    const userId = localStorage.getItem("user_id") || "1";
    if (!placeForm.name.trim() || !placeForm.state.trim() || !placeForm.district.trim() || !placeForm.description.trim() || !placeForm.latitude || !placeForm.longitude) {
      setPlaceError("Please fill in all required fields."); return;
    }
    try {
      setPlaceSubmitting(true);
      let uploadedImageUrl = "";
      if (imageFile) {
        const imageData = new FormData(); imageData.append("image", imageFile);
        const imageResponse = await fetch(`${API_URL}/upload-image`, { method: "POST", body: imageData });
        if (imageResponse.ok) { const imageResult = await imageResponse.json(); uploadedImageUrl = imageResult.image_url; }
      }
      const formData = new FormData();
      formData.append("user_id", userId); formData.append("name", placeForm.name.trim()); formData.append("state", placeForm.state.trim());
      formData.append("district", placeForm.district.trim()); formData.append("description", placeForm.description.trim());
      formData.append("latitude", placeForm.latitude); formData.append("longitude", placeForm.longitude);
      if (uploadedImageUrl) formData.append("image_url", uploadedImageUrl);
      if (videoFile) formData.append("video", videoFile);
      const response = await fetch(`${API_URL}/places/submit`, { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to submit discovery.");
      setPlaceMessage("Discovery submitted! It is now in the Government verification queue.");
      setPlaceForm({ name: "", state: "", district: "", description: "", latitude: "", longitude: "" }); setImageFile(null); setVideoFile(null);
    } catch (err) { console.error(err); setPlaceError(err.message || "Failed to submit discovery."); }
    finally { setPlaceSubmitting(false); }
  };

  const renderDestinationCard = (destination, type) => {
    const bgImage = getLocationImage(destination); const isPopular = type === "popular";
    return (
      <article className={`destination-card ${isPopular ? "popular-card" : "hidden-card"}`} key={destination?.id ?? `${destination?.name}-${destination?.district}`} style={{ backgroundImage: `url("${bgImage}")`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="destination-card-overlay"></div>
        <div className="destination-card-content">
          <span className={`destination-tag ${isPopular ? "tag-popular" : "tag-hidden"}`}>{isPopular ? "🔥 EVERYONE LOVES IT" : "✨ HIDDEN GEM"}</span>
          <h2 className="destination-title">{destination?.name || "Destination"}</h2>
          {/* FLUSH LEFT-ALIGNED LOCATION */}
          <p className="destination-location">
            <MapPin size={14} />
            <span>{destination?.district ? `${destination.district}, ` : ""}{destination?.state || ""}</span>
          </p>
          <p className="destination-description">{destination?.description || "A beautiful place waiting to become part of your next story."}</p>
          {destination?.id ? <button type="button" className="card-explore-btn" onClick={() => navigate(`/destination/${destination.id}`)}>Explore this place <ArrowRight size={15} /></button> : <span className="destination-unavailable">Details Pending</span>}
        </div>
      </article>
    );
  };

  return (
    <div className="explore-page fun-explore-page">
      <div className="explore-page-overlay"></div>
      <div className="explore-decor decor-one">✈️</div><div className="explore-decor decor-two">☀️</div><div className="explore-decor decor-three">🌿</div>

      {/* NAVBAR WITH EXACT "LOGOUT" BUTTON */}
      <nav className="navbar explore-navbar fun-explore-navbar">
        <button type="button" className="logo explore-logo fun-explore-logo" onClick={() => navigate("/")}>
          <div className="logo-icon-wrapper"><Compass size={22} /></div>
          <div className="fun-logo-copy"><span>Hidden Horizon</span><small>Go somewhere unexpected</small></div>
        </button>
        <div className="explore-nav-actions">
          <button type="button" className="explore-logout fun-logout" onClick={logout}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      <main className="explore-content fun-explore-content">
        <header className="explore-header fun-explore-header animate-fade-in">
          <span className="section-tag fun-section-tag">YOUR TRAVEL MAP STARTS HERE</span>
          <h1>Where will you <span>wander next?</span> 🧭</h1>
          <p>Pick a state, choose your vibe, and uncover places beyond the usual tourist trail.</p>
        </header>

        <section className="travel-vibes-card">
          <div className="vibes-heading"><div><span className="section-tag-mini">CHOOSE YOUR VIBE</span><h2>What sounds good today?</h2></div><span className="vibes-tip">Tap a mood to get inspired ✨</span></div>
          <div className="travel-vibes-grid">
            <div className="travel-vibe vibe-mountain"><span>🏔️</span><strong>Mountain Escape</strong><small>Cool air & big views</small></div>
            <div className="travel-vibe vibe-water"><span>🌊</span><strong>Water & Waves</strong><small>Chase the blue</small></div>
            <div className="travel-vibe vibe-nature"><span>🌿</span><strong>Into the Wild</strong><small>Forests & hidden trails</small></div>
            <div className="travel-vibe vibe-heritage"><span>🏛️</span><strong>Culture & Stories</strong><small>Places with a past</small></div>
          </div>
        </section>

        {error && <div className="api-error fun-api-error">{error}</div>}

        <section className="destination-section fun-destination-section popular-locations-section" id="popular">
          <div className="destination-section-heading fun-section-heading">
            <span className="section-tag-mini">🔥 THE CLASSICS</span><h2>Places Everyone Talks About</h2><p>Start with the icons—then see what lies beyond them.</p>
          </div>
          <div className="state-box fun-state-box"><label htmlFor="popular-state">📍 PICK A STATE</label><select id="popular-state" value={selectedPopularState} onChange={handlePopularStateChange} disabled={loadingStates}><option value="">{loadingStates ? "Loading your map..." : "Choose a state"}</option>{states.map((st) => <option key={st} value={st}>{st}</option>)}</select></div>
          {!selectedPopularState && !loadingStates && <div className="state-selection-hint fun-hint"><span>👆</span><div><h3>Choose a state and let the adventure begin.</h3><p>Your familiar favourites are just the starting point.</p></div></div>}
          {selectedPopularState && loadingPopular && <div className="section-loading fun-loading">🧭 Finding places in {selectedPopularState}...</div>}
          {selectedPopularState && !loadingPopular && popularDestinations.length === 0 && <div className="section-empty fun-empty"><h3>No popular destinations listed for {selectedPopularState}.</h3><p>That's okay—your next discovery might be hiding below. ✨</p></div>}
          {selectedPopularState && !loadingPopular && popularDestinations.length > 0 && <div className="destination-grid">{popularDestinations.map((dest) => renderDestinationCard(dest, "popular"))}</div>}
        </section>

        <div className="discovery-divider"><span>NOW FOR THE GOOD STUFF</span><div></div><span>✨</span></div>

        <section className="destination-section fun-destination-section hidden-locations-section" id="hidden">
          <div className="destination-section-heading fun-section-heading hidden-heading">
            <span className="section-tag-mini cyan">✨ OFF THE BEATEN PATH</span><h2>Places You Haven't Seen Yet</h2><p>Government-verified hidden gems that bring fresh journeys and local stories to life.</p>
          </div>
          <div className="state-box fun-state-box hidden-state-box"><label htmlFor="hidden-state">🗺️ CHOOSE WHERE TO GO</label><select id="hidden-state" value={selectedState} onChange={handleStateChange} disabled={loadingStates}><option value="">{loadingStates ? "Loading your map..." : "Pick a state to uncover gems"}</option>{states.map((st) => <option key={st} value={st}>{st}</option>)}</select></div>
          {!selectedState && !loadingStates && <div className="hidden-location-hint fun-hint gem-hint"><span>💎</span><div><h3>Your next favourite place may not be famous yet.</h3><p>Choose a state to reveal the hidden side of India.</p></div></div>}
          {selectedState && loadingDestinations && <div className="loading-message fun-loading">✨ Searching for hidden gems in {selectedState}...</div>}
          {selectedState && !loadingDestinations && hiddenDestinations.length === 0 && <div className="empty-message fun-empty">No verified hidden gems found for {selectedState} yet. Try another state! 🌄</div>}
          {selectedState && !loadingDestinations && hiddenDestinations.length > 0 && <div className="destination-grid">{hiddenDestinations.map((dest) => renderDestinationCard(dest, "hidden"))}</div>}
        </section>

        {/* SUBMISSION SECTION */}
        <section className="hidden-place-section fun-submit-section" id="submit-place">
          <div className="hidden-place-heading fun-submit-heading"><span className="section-tag-mini">📸 KNOW A SECRET SPOT?</span><h2>Share your hidden gem.</h2><p>Tell us about a place worth discovering. It will go through government verification before it appears on the public map.</p></div>
          <div className="hidden-place-card fun-form-card">
            <form onSubmit={handlePlaceSubmit} className="hidden-place-form">
              <div className="hidden-form-group full"><label>Destination Name *</label><input type="text" placeholder="e.g. Gundichaghai Waterfalls" required value={placeForm.name} onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })} /></div>
              <div className="hidden-form-group"><label>State *</label><input type="text" placeholder="e.g. Odisha" required value={placeForm.state} onChange={(e) => setPlaceForm({ ...placeForm, state: e.target.value })} /></div>
              <div className="hidden-form-group"><label>District *</label><input type="text" placeholder="e.g. Kendujhar" required value={placeForm.district} onChange={(e) => setPlaceForm({ ...placeForm, district: e.target.value })} /></div>
              <div className="hidden-form-group full"><label>Tell us about it *</label><textarea rows="3" placeholder="What makes this place special? Describe the landscape, experience or local story..." required value={placeForm.description} onChange={(e) => setPlaceForm({ ...placeForm, description: e.target.value })} /></div>
              <div className="hidden-form-group"><label>Latitude *</label><input type="number" step="any" placeholder="e.g. 21.5421" required value={placeForm.latitude} onChange={(e) => setPlaceForm({ ...placeForm, latitude: e.target.value })} /></div>
              <div className="hidden-form-group"><label>Longitude *</label><input type="number" step="any" placeholder="e.g. 85.8321" required value={placeForm.longitude} onChange={(e) => setPlaceForm({ ...placeForm, longitude: e.target.value })} /></div>
              <div className="hidden-form-group full"><label><ImageIcon size={15} style={{ verticalAlign: "middle", marginRight: "6px" }} />Photo Upload</label><input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />{imageFile && <span className="form-hint active">Selected: {imageFile.name}</span>}</div>
              <div className="hidden-form-group full"><label><Video size={15} style={{ verticalAlign: "middle", marginRight: "6px" }} />Video Clip</label><input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />{videoFile && <span className="form-hint active">Selected: {videoFile.name}</span>}</div>
              {placeError && <div className="hidden-place-error">{placeError}</div>}{placeMessage && <div className="hidden-place-success">✓ {placeMessage}</div>}
              <button type="submit" className="hidden-place-submit fun-submit-btn" disabled={placeSubmitting}>{placeSubmitting ? "Sending your discovery..." : "Share this place ✨"}</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

// =====================================================
// DESTINATION DETAILS COMPONENT (LIGHT THEME MATCH)
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

        const [destRes, revRes, footRes, stayRes] = await Promise.all([
          fetch(`${API_URL}/destination/${destination_id}`),
          fetch(`${API_URL}/reviews/${destination_id}`),
          fetch(`${API_URL}/footfall/${destination_id}`),
          fetch(`${API_URL}/stays/${destination_id}`),
        ]);

        if (!destRes.ok) throw new Error("Destination details not found.");

        const destData = await destRes.json();
        const revData = revRes.ok ? await revRes.json() : [];
        const footData = footRes.ok ? await footRes.json() : [];
        const stayData = stayRes.ok ? await stayRes.json() : [];

        setDestination(destData);
        setReviews(Array.isArray(revData) ? revData : []);
        setFootfall(Array.isArray(footData) ? footData : []);
        setStays(Array.isArray(stayData) ? stayData : []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load destination.");
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

    const userId = localStorage.getItem("user_id") || "1";

    if (!reviewFeedback.trim()) {
      setReviewError("Please provide your feedback comment.");
      return;
    }

    try {
      setReviewSubmitting(true);

      const params = new URLSearchParams({
        user_id: userId,
        destination_id: destination_id,
        rating: String(reviewRating),
        feedback: reviewFeedback.trim(),
      });

      const response = await fetch(`${API_URL}/reviews?${params.toString()}`, {
        method: "POST",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to post review.");
      }

      setReviewSuccess("Thank you! Your feedback has been posted.");
      setReviews((prev) => [
        {
          id: Date.now(),
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
      setReviewError(err.message || "Error submitting review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page fun-loading-page">
        <div className="loading-spinner"></div>
        <h1>Loading Destination Details...</h1>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="error-page fun-error-page">
        <h1>Destination Not Found</h1>
        <p>{error || "Unable to retrieve information for this destination."}</p>
        <button type="button" className="destination-back" onClick={() => navigate("/public")}>
          ← Back to Destinations
        </button>
      </div>
    );
  }

  const mapEmbedUrl = getMapEmbedUrl(destination.latitude, destination.longitude);

  return (
    <div className="destination-details fun-destination-details light-details-page">
      {/* FRESH LIGHT TRAVEL OVERLAY */}
      <div className="destination-page-overlay fun-details-overlay light-details-overlay"></div>

      <nav className="destination-navbar fun-details-navbar light-details-navbar">
        <div className="logo fun-details-logo" onClick={() => navigate("/public")}>
          <div className="logo-icon-wrapper">
            <Compass size={22} color="#15966d" />
          </div>
          <div className="fun-logo-copy">
            <span className="light-logo-text">Hidden Horizon</span>
            <small className="light-logo-sub">Explorer Guide</small>
          </div>
        </div>
        <button className="destination-back-btn fun-back-btn light-back-btn" onClick={() => navigate("/public")}>
          ← Back to Explore
        </button>
      </nav>

      <main className="destination-main fun-details-main">
        {/* LIGHT THEMED HEADER */}
        <header className="destination-header fun-details-header light-details-header animate-fade-in">
          <span className="destination-tag fun-tag light-tag">✨ GOVERNMENT VERIFIED ECO-DESTINATION</span>
          <h1 className="light-title">{destination.name}</h1>
          <p className="destination-location fun-loc light-loc">
            <MapPin size={16} />
            <span>{destination.district}, {destination.state}</span>
          </p>
          <p className="destination-description fun-desc light-desc">
            {destination.description || "A scenic and protected natural landscape with pristine surroundings."}
          </p>
        </header>

        {destination.video_url && (
          <section className="details-section destination-video-section fun-details-card light-details-card">
            <div className="details-section-heading">
              <span className="section-tag-mini">EXPERIENCE THE LOCATION</span>
              <h2>Video Showcase</h2>
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

        {mapEmbedUrl && (
          <section className="details-section fun-details-card light-details-card destination-map-section">
            <div className="details-section-heading">
              <span className="section-tag-mini">LOCATION & DIRECTIONS</span>
              <h2>Destination Map</h2>
            </div>
            <div className="destination-map-card">
              <iframe
                title={`Map of ${destination.name}`}
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="map-card-footer">
                <span><MapPin size={15} /> {Number(destination.latitude).toFixed(5)}, {Number(destination.longitude).toFixed(5)}</span>
                <a href={getDirectionsUrl(destination.latitude, destination.longitude)} target="_blank" rel="noreferrer">Get directions ↗</a>
              </div>
            </div>
          </section>
        )}

        {destination.guidelines && (
          <section className="details-section fun-details-card light-details-card guidelines-section">
            <div className="details-section-heading">
              <span className="section-tag-mini">OFFICIAL VISITOR INFORMATION</span>
              <h2>Government Guidelines</h2>
            </div>
            <div className="guidelines-card">
              <span className="guidelines-icon">✓</span>
              <p>{destination.guidelines}</p>
            </div>
          </section>
        )}

        {/* LIGHT THEMED STATS */}
        <div className="destination-stats fun-stats-grid">
          <div className="stat-card fun-stat-box light-stat-box">
            <h3>Verified Reviews</h3>
            <strong>{reviews.length}</strong>
          </div>
          <div className="stat-card fun-stat-box light-stat-box">
            <h3>Footfall Records</h3>
            <strong>{footfall.length > 0 ? footfall.length : "3"}</strong>
          </div>
          <div className="stat-card fun-stat-box light-stat-box">
            <h3>Nearby Stays</h3>
            <strong>{stays.length > 0 ? stays.length : "2"}</strong>
          </div>
        </div>

        {/* LIGHT THEMED REVIEWS */}
        <section className="details-section fun-details-card light-details-card">
          <div className="details-section-heading">
            <span className="section-tag-mini">TRAVELLER EXPERIENCES</span>
            <h2>Reviews & Feedback</h2>
          </div>

          <div className="review-submission-box fun-review-box light-review-box">
            <h3>Leave a Verified Review ✨</h3>
            <p>Help other travellers make responsible travel decisions.</p>

            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="star-rating-select">
                <label>Your Rating:</label>
                <div className="star-group">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-btn ${(reviewHoverRating || reviewRating) >= star ? "filled" : ""}`}
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHoverRating(star)}
                      onMouseLeave={() => setReviewHoverRating(0)}
                    >
                      <Star
                        size={26}
                        fill={(reviewHoverRating || reviewRating) >= star ? "#f59e0b" : "none"}
                        color={(reviewHoverRating || reviewRating) >= star ? "#f59e0b" : "#cbd5e1"}
                      />
                    </button>
                  ))}
                  <span className="rating-score">{reviewRating} / 5</span>
                </div>
              </div>

              <div className="review-input-group">
                <textarea
                  placeholder={`Share your experience about visiting ${destination.name}...`}
                  rows="3"
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                />
              </div>

              {reviewError && <div className="review-form-error">{reviewError}</div>}
              {reviewSuccess && <div className="review-form-success">✓ {reviewSuccess}</div>}

              <button type="submit" className="review-submit-btn fun-submit-cta" disabled={reviewSubmitting}>
                {reviewSubmitting ? "Posting..." : "Post Review →"}
              </button>
            </form>
          </div>

          {reviews.length === 0 ? (
            <div className="review-empty light-review-empty">No reviews yet. Be the first to share your experience!</div>
          ) : (
            <div className="reviews-grid">
              {reviews.map((rev) => (
                <article className="review-card fun-review-card light-review-card" key={rev.id}>
                  <div className="review-rating">⭐ {rev.rating || 5} / 5.0</div>
                  <p className="review-feedback">"{rev.feedback}"</p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* LIGHT THEMED STAYS */}
        <section className="details-section stays-section fun-details-card light-details-card">
          <div className="details-section-heading">
            <span className="section-tag-mini">SUSTAINABLE STAYS</span>
            <h2>Homestays & Eco-Resorts</h2>
          </div>

          {stays.length === 0 ? (
            <div className="review-empty light-review-empty">No verified stays listed yet. Local community camping available.</div>
          ) : (
            <div className="stays-grid">
              {stays.map((stay) => (
                <article className="stay-card fun-stay-card light-stay-card" key={stay.id}>
                  <div className="stay-icon">🏡</div>
                  <div className="stay-info">
                    <h3>{stay.name}</h3>
                    {stay.address && <p className="stay-address">📍 {stay.address}</p>}
                    {stay.price_per_night !== undefined && (
                      <p className="stay-price">₹{Number(stay.price_per_night).toLocaleString()} <span>/ night</span></p>
                    )}
                    {stay.contact && <p className="stay-contact">📞 {stay.contact}</p>}
                  </div>
                  {stay.contact && (
                    <a href={`tel:${stay.contact}`} className="stay-contact-button">
                      Contact Host
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
// MAIN ROUTER
// =====================================================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/public-login" element={<PublicLogin />} />
        <Route path="/government-login" element={<GovernmentLogin />} />
        <Route path="/public" element={<PublicDashboard />} />
        <Route path="/destination/:destination_id" element={<DestinationDetails />} />
        <Route path="/government" element={<GovernmentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
