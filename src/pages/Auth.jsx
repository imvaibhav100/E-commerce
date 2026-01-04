import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!loginData.email || !loginData.password) {
        toast.error("Please fill in all fields");
        setLoading(false);
        return;
      }

      const result = login(loginData.email, loginData.password);

      if (result.success) {
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const validateSignup = () => {
    if (
      !signupData.fullName ||
      !signupData.email ||
      !signupData.password ||
      !signupData.confirmPassword ||
      !signupData.phone
    ) {
      toast.error("Please fill in all fields");
      return false;
    }

    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (signupData.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateSignup()) {
        setLoading(false);
        return;
      }

      const newUser = signup({
        fullName: signupData.fullName,
        email: signupData.email,
        password: signupData.password,
        phone: signupData.phone,
      });

      if (newUser.success) {
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        toast.error(newUser.error || "Error creating account!");
      }
    } catch (error) {
      toast.error("Error creating account!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-card">
          {/* Tab Toggle */}
          <div className="auth-toggle">
            <button
              className={`toggle-btn ${isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`toggle-btn ${!isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {isLogin && (
            <>
              <div className="auth-header">
                <h2>Welcome Back</h2>
                <p>Sign in to your account</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="login-email">Email Address</label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="Enter your email"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  <div className="password-input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="login-password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Enter your password"
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="auth-btn">
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </>
          )}

          {/* Signup Form */}
          {!isLogin && (
            <>
              <div className="auth-header">
                <h2>Create Account</h2>
                <p>Join Multimart today</p>
              </div>

              <form onSubmit={handleSignupSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="signup-fullname">Full Name</label>
                  <input
                    type="text"
                    id="signup-fullname"
                    name="fullName"
                    value={signupData.fullName}
                    onChange={handleSignupChange}
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="signup-email">Email Address</label>
                  <input
                    type="email"
                    id="signup-email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    placeholder="Enter your email"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="signup-phone">Phone Number</label>
                  <input
                    type="tel"
                    id="signup-phone"
                    name="phone"
                    value={signupData.phone}
                    onChange={handleSignupChange}
                    placeholder="Enter your phone number"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <div className="password-input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="signup-password"
                      name="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      placeholder="Create a password (min 6 characters)"
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-confirm">Confirm Password</label>
                  <div className="password-input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="signup-confirm"
                      name="confirmPassword"
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      placeholder="Confirm your password"
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="auth-btn">
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <p className="auth-terms">
                By signing up, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Auth;
