import React, { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Login: React.FC = () => {
  const { login, error, isAuthenticated, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (error) {
      setIsLeaving(false);
      const timer = setTimeout(() => {
        closeAlert();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const closeAlert = () => {
    setIsLeaving(true);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    await login();
    setIsLoading(false);
  };

  if (loading || isAuthenticated) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="login-container">
      <div className="card">
        <h2>Welcome to Media App</h2>
        {error && (
          <div
            className={`alert alert-danger ${isLeaving ? "alert-closing" : ""}`}
          >
            <span className="alert-message">{error}</span>
            <button
              type="button"
              className="alert-close-btn"
              onClick={closeAlert}
            >
              &times;
            </button>
          </div>
        )}
        <p>Sign in to upload and manage your media files</p>
        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              <FaGoogle />
              <span>Sign in with Google</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;
