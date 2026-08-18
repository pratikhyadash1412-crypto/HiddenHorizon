import { useState } from "react";
import "./GuideRegistration.css";

const API_URL = "http://localhost:8000";

export default function GuideRegistration({ userId }) {
  const [experience, setExperience] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!experience.trim() || !phone.trim()) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    if (!userId) {
      setMessage("Please log in before registering as a guide.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const params = new URLSearchParams();

      params.append("user_id", userId);
      params.append("experience", experience.trim());
      params.append("phone", phone.trim());

      const response = await fetch(
        `${API_URL}/guides/register?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Registration failed.";

        if (Array.isArray(data.detail)) {
          errorMessage = data.detail
            .map((error) => {
              if (typeof error === "string") return error;

              if (error.msg) {
                return error.msg;
              }

              return JSON.stringify(error);
            })
            .join(", ");
        } else if (typeof data.detail === "string") {
          errorMessage = data.detail;
        }

        throw new Error(errorMessage);
      }

      setMessage(
        `Application submitted successfully. Status: ${
          data.verification_status || "PENDING"
        }`
      );

      setMessageType("success");

      setExperience("");
      setPhone("");
    } catch (error) {
      console.error("Guide registration error:", error);

      setMessage(error.message || "Something went wrong.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guide-page">
      <div className="guide-card">
        <div className="guide-icon">👨‍💼</div>

        <h1>Become a Guide</h1>

        <p className="guide-subtitle">
          Share your local knowledge and help travelers discover
          unforgettable places.
        </p>

        <form onSubmit={handleSubmit} className="guide-form">
          <div className="form-group">
            <label htmlFor="experience">Experience</label>

            <input
              id="experience"
              type="text"
              placeholder="e.g. 3 years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>

            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="guide-submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Register as Guide"}
          </button>

          {message && (
            <div className={`guide-message ${messageType}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}