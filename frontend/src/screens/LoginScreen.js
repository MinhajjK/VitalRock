import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../actions/userActions";
import "../styles/authScreens.css";
import "../styles/organicTheme.css";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
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
            <h1>Welcome Back</h1>
            <p>Sign in to access your organic wellness journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="auth-message auth-message-error">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={submitHandler}>
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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

            {/* Forgot Password */}
            <div className="auth-forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
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
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p className="auth-footer-text">
              New to VitalRock?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="auth-link"
              >
                Create an Account
              </Link>
            </p>
          </div>

          {/* Features Section */}
          <div className="auth-features">
            <h3 className="auth-features-title">Why Shop With Us?</h3>
            <ul className="auth-features-list">
              <li className="auth-features-item">
                <i className="fas fa-check-circle"></i>
                <span>100% Certified Organic Products</span>
              </li>
              <li className="auth-features-item">
                <i className="fas fa-check-circle"></i>
                <span>Free Shipping on Orders Over $50</span>
              </li>
              <li className="auth-features-item">
                <i className="fas fa-check-circle"></i>
                <span>Eco-Friendly Packaging</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
