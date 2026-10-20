import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faEye,
  faEyeSlash,
  faChevronLeft,
  faChevronRight,
  faArrowRight,
  faBagShopping,
} from "@fortawesome/free-solid-svg-icons";

import styles from "../Styles/LoginSignup.module.css";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;


const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85",
    eyebrow: "YOUR STYLE, YOUR STORY",
    title: "Discover your next favourite.",
    description: "Explore products you'll love, all in one place.",
    tag: "FIND YOUR STYLE",
  },
  {
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85",
    eyebrow: "STEP INTO SOMETHING NEW",
    title: "Everyday essentials. Extraordinary style.",
    description: "Find the perfect pair and make every step count.",
    tag: "EXPLORE FOOTWEAR",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=85",
    eyebrow: "THE DETAILS MATTER",
    title: "Little things. Big statements.",
    description: "Discover accessories that complete your look.",
    tag: "SHOP ACCESSORIES",
  },
];

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // --------------------------------
  // AUTOMATIC IMAGE SLIDER
  // --------------------------------

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const previousSlide = () => {
    setCurrentSlide(
      (previous) => (previous - 1 + slides.length) % slides.length,
    );
  };

  const nextSlide = () => {
    setCurrentSlide((previous) => (previous + 1) % slides.length);
  };

  // --------------------------------
  // FORM INPUT
  // --------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage("");
  };

  // --------------------------------
  // SWITCH LOGIN / SIGNUP
  // --------------------------------

  const switchMode = () => {
    setIsLogin((previous) => !previous);

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMessage("");
  };

  // --------------------------------
  // LOGIN / SIGNUP
  // --------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    const email = formData.email.trim();

    if (!email) {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (!isLogin) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setErrorMessage("Please enter your first and last name.");
        return;
      }

      if (formData.password.length < 8) {
        setErrorMessage("Password must contain at least 8 characters.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);

      if (isLogin) {
        // The backend expects "username".
        // The value entered by the user is their email.
        const response = await axios.post(`${API_URL}/api/login`, {
          username: email,
          password: formData.password,
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("role", response.data.role);

        navigate("/home", { replace: true });
      } else {
        // Send only the fields expected by the backend.
        // Email is stored in the backend's username field.
        await axios.post(`${API_URL}/api/register`, {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          username: email,
          password: formData.password,
        });

        toast.success("Account created successfully! Please log in.");

        setFormData({
          firstName: "",
          lastName: "",
          email,
          password: "",
          confirmPassword: "",
        });

        setIsLogin(true);
        setShowPassword(false);
        setShowConfirmPassword(false);
      }
    } catch (error) {
      console.error("Authentication error:", error);

      const responseData = error.response?.data;

      setErrorMessage(
        typeof responseData === "string"
          ? responseData
          : responseData?.message ||
              (error.response?.status === 401
                ? "Invalid email or password."
                : error.response?.status === 409
                  ? "An account with this email may already exist."
                  : "Something went wrong. Please try again."),
      );
      if (error.response?.status === 409) {
        setErrorMessage("An account with this email already exists.");
      } else {
        setErrorMessage(
          typeof error.response?.data === "string"
            ? error.response.data
            : "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const slide = slides[currentSlide];

  return (
    <main className={styles.authPage}>
      {/* LEFT: E-COMMERCE IMAGE SLIDER */}

      <section className={styles.showcase}>
        <div
          className={styles.slideBackground}
          style={{ backgroundImage: `url("${slide.image}")` }}
          key={slide.image}
        />

        <div className={styles.imageOverlay} />

        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <FontAwesomeIcon icon={faBagShopping} />
          </div>

          <span>SHOPORA</span>
        </div>

        <div className={styles.slideContent} key={slide.title}>
          <span className={styles.slideEyebrow}>{slide.eyebrow}</span>

          <h1>{slide.title}</h1>

          <p>{slide.description}</p>

          <span className={styles.slideTag}>
            {slide.tag}
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </div>

        <button
          type="button"
          className={`${styles.sliderArrow} ${styles.previousArrow}`}
          onClick={previousSlide}
          aria-label="Previous slide"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <button
          type="button"
          className={`${styles.sliderArrow} ${styles.nextArrow}`}
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>

        <div className={styles.sliderFooter}>
          <div className={styles.sliderDots}>
            {slides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={
                  currentSlide === index ? styles.activeDot : styles.dot
                }
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={currentSlide === index ? "true" : undefined}
              />
            ))}
          </div>

          <span>
            {String(currentSlide + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        <div className={styles.showcaseCaption}>
          A LITTLE SOMETHING FOR EVERYONE.
        </div>
      </section>

      {/* RIGHT: LOGIN / SIGNUP FORM */}

      <section className={styles.formSection}>
        <div className={styles.authCard}>
          <div className={styles.mobileBrand}>
            <div className={styles.brandIcon}>
              <FontAwesomeIcon icon={faBagShopping} />
            </div>

            <span>SHOPORA</span>
          </div>

          <div className={styles.formHeader}>
            <span className={styles.formEyebrow}>
              {isLogin ? "WELCOME BACK" : "JOIN OUR COMMUNITY"}
            </span>

            <h2>{isLogin ? "Hello again." : "Create account."}</h2>

            <p>
              {isLogin
                ? "Enter your details to continue shopping."
                : "A few details and you're ready to explore."}
            </p>
          </div>

          {/* LOGIN / SIGNUP SWITCH */}

          <div className={styles.authTabs}>
            <button
              type="button"
              className={isLogin ? styles.activeTab : ""}
              onClick={() => {
                if (!isLogin) switchMode();
              }}
            >
              Login
            </button>

            <button
              type="button"
              className={!isLogin ? styles.activeTab : ""}
              onClick={() => {
                if (isLogin) switchMode();
              }}
            >
              Sign up
            </button>
          </div>

          <form className={styles.authForm} onSubmit={handleSubmit}>
            {/* FIRST NAME AND LAST NAME */}

            {!isLogin && (
              <div className={styles.nameRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="firstName">First name</label>

                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    required={!isLogin}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="lastName">Last name</label>

                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            {/* PASSWORD */}

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>

              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={
                    isLogin ? "Enter your password" : "Create a password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                />

                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              {!isLogin && (
                <small className={styles.inputHint}>
                  Use at least 8 characters.
                </small>
              )}
            </div>

            {/* CONFIRM PASSWORD */}

            {!isLogin && (
              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">Confirm password</label>

                <div className={styles.passwordWrapper}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* LOGIN OPTIONS */}

            {isLogin && (
              <div className={styles.formOptions}>
                <label className={styles.remember}>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
              </div>
            )}

            {/* ERROR MESSAGE */}

            {errorMessage && (
              <div className={styles.errorMessage} role="alert">
                {errorMessage}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className={styles.authButton}
              disabled={loading}
            >
              <span>
                {loading
                  ? "Please wait..."
                  : isLogin
                    ? "Login to your account"
                    : "Create my account"}
              </span>

              {!loading && <FontAwesomeIcon icon={faArrowRight} />}
            </button>
          </form>

          <div className={styles.formFooter}>
            {isLogin ? "New here? " : "Already have an account? "}

            <button type="button" onClick={switchMode}>
              {isLogin ? "Create an account" : "Login instead"}
            </button>
          </div>

          <div className={styles.terms}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginSignup;
