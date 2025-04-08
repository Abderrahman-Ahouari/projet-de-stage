// pages/OAuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // Navigate to your protected/dashboard page
      navigate("/dashboard");
    } else {
      // Handle error
      navigate("/login");
    }
  }, []);

  return <p>Redirecting...</p>;
}

export default OAuthSuccess;
