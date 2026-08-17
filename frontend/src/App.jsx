import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  MapPin,
  ShieldCheck,
  Compass,
  Building2,
  ArrowRight,
  LogOut,
} from "lucide-react";

import "./App.css";


// ======================================================
// API
// ======================================================

const API_URL = "http://127.0.0.1:8000";


// ======================================================
// HOME PAGE
// ======================================================

function Home() {
  return (
    <div className="home-page">

      <header className="navbar">

        <Link to="/" className="logo">
          <MapPin size={30} />
          <span>S21 Tourism</span>
        </Link>

        <nav>
          <Link to="/public-login">
            Public Login
          </Link>

          <Link to="/government-login">
            Government Login
          </Link>
        </nav>

      </header>


      <main className="hero">

        <div className="hero-content">

          <div className="hero-icon">
            <Compass size={50} />
          </div>

          <h1>
            Discover India's
            <span> Hidden Destinations</span>
          </h1>

          <p>
            Explore lesser-known places, cultural treasures,
            natural wonders and unique destinations across India.
          </p>


          <div className="hero-buttons">

            <Link
              to="/public-login"
              className="primary-button"
            >
              Explore Destinations
              <ArrowRight size={20} />
            </Link>


            <Link
              to="/government-login"
              className="secondary-button"
            >
              Government Portal
              <ShieldCheck size={20} />
            </Link>

          </div>

        </div>


        <div className="hero-card">

          <MapPin size={70} />

          <h2>Explore India</h2>

          <p>
            From hidden villages to untouched natural
            landscapes, discover places beyond the usual
            tourist routes.
          </p>

        </div>

      </main>


      <section className="features">

        <div className="feature-card">

          <MapPin size={35} />

          <h3>Hidden Destinations</h3>

          <p>
            Discover unique and lesser-known destinations
            across different states.
          </p>

        </div>


        <div className="feature-card">

          <Building2 size={35} />

          <h3>State-wise Discovery</h3>

          <p>
            Browse destinations according to Indian states
            and regions.
          </p>

        </div>


        <div className="feature-card">

          <ShieldCheck size={35} />

          <h3>Government Verified</h3>

          <p>
            Destinations can be reviewed and managed through
            the government portal.
          </p>

        </div>

      </section>

    </div>
  );
}


// ======================================================
// PUBLIC LOGIN
// ======================================================

function PublicLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);


  const login = async () => {

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

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
            email: email,
            password: password,
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
        "s21_user",
        JSON.stringify(data)
      );


      navigate("/public");

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="login-page">

      <div className="login-box">

        <div className="login-icon">
          <MapPin size={42} />
        </div>


        <h1>Public Login</h1>

        <p>
          Login to explore hidden destinations
          across India.
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
          <div className="error-message">
            {error}
          </div>
        )}


        <button
          className="login-button"
          onClick={login}
          disabled={loading}
        >

          {loading
            ? "Logging in..."
            : "Login"}

        </button>


        <Link
          to="/"
          className="back-link"
        >
          ← Back to Home
        </Link>

      </div>

    </div>

  );
}


// ======================================================
// GOVERNMENT LOGIN
// ======================================================

function GovernmentLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);


  const login = async () => {

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

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
            email: email,
            password: password,
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
        "s21_user",
        JSON.stringify(data)
      );


      navigate("/government");

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="login-page">

      <div className="login-box">

        <div className="login-icon government">
          <ShieldCheck size={42} />
        </div>


        <h1>Government Login</h1>

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
          <div className="error-message">
            {error}
          </div>
        )}


        <button
          className="login-button government-button"
          onClick={login}
          disabled={loading}
        >

          {loading
            ? "Logging in..."
            : "Login"}

        </button>


        <Link
          to="/"
          className="back-link"
        >
          ← Back to Home
        </Link>

      </div>

    </div>

  );
}


// ======================================================
// LOGOUT
// ======================================================

function LogoutButton() {

  const logout = () => {

    localStorage.removeItem("s21_user");

    window.location.href = "/";

  };


  return (

    <button
      className="logout"
      onClick={logout}
    >

      <LogOut size={18} />

      Logout

    </button>

  );
}


// ======================================================
// PUBLIC DASHBOARD
// ======================================================

function PublicDashboard() {

  const [user, setUser] = React.useState(null);


  React.useEffect(() => {

    const savedUser =
      localStorage.getItem("s21_user");

    if (savedUser) {

      setUser(
        JSON.parse(savedUser)
      );

    }

  }, []);


  return (

    <div className="dashboard-page">

      <header className="dashboard-navbar">

        <Link
          to="/public"
          className="logo"
        >
          <MapPin size={28} />

          <span>
            S21 Tourism
          </span>
        </Link>


        <div className="dashboard-user">

          {user && (
            <span>
              Welcome, {user.email}
            </span>
          )}

          <LogoutButton />

        </div>

      </header>


      <main className="dashboard-content">

        <h1>
          Explore Hidden Destinations
        </h1>

        <p>
          Discover lesser-known places across India.
        </p>


        <div className="dashboard-placeholder">

          <MapPin size={55} />

          <h2>
            Choose a State
          </h2>

          <p>
            State-wise destination discovery
            will appear here.
          </p>

        </div>

      </main>

    </div>

  );
}


// ======================================================
// GOVERNMENT DASHBOARD
// ======================================================

function GovernmentDashboard() {

  const [user, setUser] = React.useState(null);


  React.useEffect(() => {

    const savedUser =
      localStorage.getItem("s21_user");

    if (savedUser) {

      setUser(
        JSON.parse(savedUser)
      );

    }

  }, []);


  return (

    <div className="dashboard-page">

      <header className="dashboard-navbar">

        <Link
          to="/government"
          className="logo"
        >

          <ShieldCheck size={28} />

          <span>
            S21 Government Portal
          </span>

        </Link>


        <div className="dashboard-user">

          {user && (
            <span>
              {user.email}
            </span>
          )}

          <LogoutButton />

        </div>

      </header>


      <main className="dashboard-content">

        <h1>
          Government Dashboard
        </h1>

        <p>
          Manage and review tourism destinations.
        </p>


        <div className="government-cards">

          <div className="dashboard-card">

            <MapPin size={40} />

            <h2>
              Destinations
            </h2>

            <p>
              Add, review and manage tourism
              destinations.
            </p>

          </div>


          <div className="dashboard-card">

            <Building2 size={40} />

            <h2>
              States
            </h2>

            <p>
              Manage state-wise tourism information.
            </p>

          </div>


          <div className="dashboard-card">

            <ShieldCheck size={40} />

            <h2>
              Verification
            </h2>

            <p>
              Review and approve submitted destinations.
            </p>

          </div>

        </div>

      </main>

    </div>

  );
}


// ======================================================
// APP
// ======================================================

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/public-login"
          element={<PublicLogin />}
        />


        <Route
          path="/government-login"
          element={<GovernmentLogin />}
        />


        <Route
          path="/public"
          element={<PublicDashboard />}
        />


        <Route
          path="/government"
          element={<GovernmentDashboard />}
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;