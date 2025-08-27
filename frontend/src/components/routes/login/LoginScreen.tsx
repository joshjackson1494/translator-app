import React, { useState, ChangeEvent, FormEvent } from "react";
import "./LoginScreen.css";
import { BACKEND_URL } from "../../../constants";
import { useNavigate } from "react-router-dom";
import { User } from "../../../types";

interface LoginFormData {
  email: string;
  password: string;
}

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  // Login form state
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // Sign up form state
  const [signUpData, setSignUpData] = useState<SignUpFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState<boolean>(false);

  // Handle login form input changes
  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // Handle sign up form input changes
  const handleSignUpChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };

  // Handle login form submission
  const handleLoginSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      const loginPayload = {
        email: loginData.email,
        password: loginData.password,
      };

      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginPayload),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      console.log(data);

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      alert(`Login successful for ${loginData.email}`);
      navigate("/text");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign up form submission
  const handleSignUpSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    setSignUpError(null);

    if (signUpData.password !== signUpData.confirmPassword) {
      setSignUpError("Passwords don't match");
      return;
    }

    setIsSigningUp(true);

    try {
      const signUpPayload = {
        email: signUpData.email,
        password: signUpData.password,
      };

      const response = await fetch(`${BACKEND_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      // Show success message
      setSignUpSuccess(true);

      // Auto-close modal after success
      setTimeout(() => {
        setShowSignUpModal(false);
        setSignUpSuccess(false);

        // Pre-fill login form with the email from sign up
        setLoginData({
          ...loginData,
          email: signUpData.email,
        });

        // Reset sign up form
        setSignUpData({
          email: "",
          password: "",
          confirmPassword: "",
        });
      }, 2000);
    } catch (err) {
      setSignUpError(err instanceof Error ? err.message : "Sign up failed");
    }
  };

  // Open sign up modal
  const openSignUpModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowSignUpModal(true);
    setSignUpError(null);
    setSignUpSuccess(false);
  };

  // Close sign up modal
  const closeSignUpModal = () => {
    setShowSignUpModal(false);
    setSignUpData({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setSignUpError(null);
    setSignUpSuccess(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please sign in to continue</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form className="login-form" onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              value={loginData.email}
              onChange={handleLoginChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={loginData.password}
              onChange={handleLoginChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <a href="#" onClick={openSignUpModal}>
              Sign Up
            </a>
          </p>
        </div>
      </div>

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Create Account</h2>
              <button className="modal-close" onClick={closeSignUpModal}>
                ×
              </button>
            </div>

            {signUpError && <div className="error-alert">{signUpError}</div>}

            {signUpSuccess ? (
              <div className="success-alert">
                Account created successfully! You can now log in.
              </div>
            ) : (
              <form className="signup-form" onSubmit={handleSignUpSubmit}>
                <div className="form-group">
                  <label htmlFor="signupEmail">Email</label>
                  <input
                    type="email"
                    id="signupEmail"
                    name="email"
                    placeholder="your@email.com"
                    value={signUpData.email}
                    onChange={handleSignUpChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="signupPassword">Password</label>
                  <input
                    type="password"
                    id="signupPassword"
                    name="password"
                    placeholder="••••••••"
                    value={signUpData.password}
                    onChange={handleSignUpChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={signUpData.confirmPassword}
                    onChange={handleSignUpChange}
                    required
                  />
                </div>

                <button type="submit" className="signup-button">
                  Create Account
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
