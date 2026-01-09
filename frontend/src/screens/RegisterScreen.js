import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { register } from "../actions/userActions";
import "../styles/authScreens.css";
import "../styles/organicTheme.css";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    if (!agreedToTerms) {
      setMessage("Please agree to the terms and conditions");
      return;
    }

    dispatch(register(name, email, password));
  };

  return (
    <div className="auth-screen-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          {/* Brand Section */}
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <i className="fas fa-leaf"></i>
            </div>
            <h2 className="auth-brand-title">VitalRock</h2>
            <p className="auth-brand-subtitle">Organic Store</p>
          </div>

          {/* Heading */}
          <div className="auth-heading">
            <h1>Join Our Community</h1>
            <p>Start your journey to organic wellness today</p>
          </div>

          {/* Error/Success Messages */}
          {message && (
            <div className="auth-message auth-message-warning">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="auth-message auth-message-error">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={submitHandler}>
            {/* Name Field */}
            <div className="auth-form-group">
              <label className="auth-form-label" htmlFor="name">
                Full Name
              </label>
              <div className="auth-form-input-wrapper">
                <i className="fas fa-user auth-form-input-icon"></i>
                <input
                  type="text"
                  id="name"
                  className="auth-form-input"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="auth-form-group">
              <label className="auth-form-label" htmlFor="email">
                Email Address
              </label>
              <div className="auth-form-input-wrapper">
                <i className="fas fa-envelope auth-form-input-icon"></i>
                <input
                  type="email"
                  id="email"
                  className="auth-form-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="auth-form-group">
              <label className="auth-form-label" htmlFor="password">
                Password
              </label>
              <div className="auth-form-input-wrapper">
                <i className="fas fa-lock auth-form-input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="auth-form-input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength="6"
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="auth-form-group">
              <label className="auth-form-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="auth-form-input-wrapper">
                <i className="fas fa-lock auth-form-input-icon"></i>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="auth-form-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  <i
                    className={`fas ${
                      showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="auth-checkbox-wrapper">
              <input
                type="checkbox"
                id="terms"
                className="auth-checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
              />
              <label htmlFor="terms" className="auth-checkbox-label">
                I agree to the{" "}
                <Link to="/terms" className="auth-link" target="_blank">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="auth-link" target="_blank">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="auth-loader-container">
                  <div className="auth-loader"></div>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p className="auth-footer-text">
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="auth-link"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Benefits Section */}
          <div className="auth-features">
            <h3 className="auth-features-title">Member Benefits</h3>
            <ul className="auth-features-list">
              <li className="auth-features-item">
                <i className="fas fa-star"></i>
                <span>Exclusive member discounts & offers</span>
              </li>
              <li className="auth-features-item">
                <i className="fas fa-shopping-bag"></i>
                <span>Track orders & manage subscriptions</span>
              </li>
              <li className="auth-features-item">
                <i className="fas fa-heart"></i>
                <span>Save favorites & create wishlists</span>
              </li>
              <li className="auth-features-item">
                <i className="fas fa-bell"></i>
                <span>Get notified about new organic products</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
