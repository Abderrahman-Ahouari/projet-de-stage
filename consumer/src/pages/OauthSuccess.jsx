// pages/OAuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUser } from "../services/authService";

function OAuthSuccess() {
  const navigate = useNavigate();
  const {oLogin} = useAuth();
  const {token} = useParams();
  useEffect(() => {
     (async () => {
      try {
        oLogin(token)
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {navigate('/login')}
    })();
    
  }, [oLogin, navigate]);
  return <p>Redirecting...</p>;
}

export default OAuthSuccess;
