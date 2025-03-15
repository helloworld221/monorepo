import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

const Login: React.FC = () => {
  const { login, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    await login();
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="card">
        <h2>Welcome to Media App</h2>
        {error && <div className="alert alert-danger">{error}</div>}
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
