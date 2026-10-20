import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../Styles/Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCartShopping,
  faUser,
  faLocationDot,
  faMagnifyingGlass,
  faPlus,
  faUsers,
  faSignOutAlt,
  faUserEdit,
  faEye,
  faEyeSlash,
  faXmark,
  faBagShopping,
} from "@fortawesome/free-solid-svg-icons";
const API_URL = import.meta.env.VITE_API_URL;


function Header({ onSearch = () => {} }) {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  const profileRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // --------------------------------
  // LIVE SEARCH
  // --------------------------------

  useEffect(() => {
    const keyword = searchText.trim();

    if (!keyword) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${API_URL}/api/products/search`,
          {
            params: {
              keyWord: keyword,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.log("Search error:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, token]);

  // --------------------------------
  // CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
  // --------------------------------

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --------------------------------
  // SELECT PRODUCT
  // --------------------------------

  const handleProductClick = (product) => {
    setShowSuggestions(false);
    setSearchText("");
    onSearch(product.productName);
  };

  // --------------------------------
  // SEARCH SUBMIT
  // --------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();

    const keyword = searchText.trim();

    if (!keyword) return;

    setShowSuggestions(false);
    onSearch(keyword);
  };

  // --------------------------------
  // LOGOUT
  // --------------------------------

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    setShowProfileMenu(false);
    setShowEditProfile(false);

    navigate("/", { replace: true });
  };

  // --------------------------------
  // OPEN EDIT PROFILE
  // --------------------------------

  const handleOpenEditProfile = async () => {
    setShowProfileMenu(false);
    setShowEditProfile(true);

    setProfileError("");
    setProfileMessage("");
    setNewPassword("");
    setConfirmPassword("");

    try {
      setProfileLoading(true);

      const response = await axios.get(`${API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsername(response.data.username);
      setFirstName(response.data.firstName ?? "");
      setLastName(response.data.lastName ?? "");
    } catch (error) {
      console.error("Unable to load profile:", error);

      setProfileError(
        error.response?.data?.message ||
          "Unable to load profile. Please try again.",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // --------------------------------
  // SAVE PROFILE
  // --------------------------------

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    setProfileError("");
    setProfileMessage("");

    if (!firstName.trim() || !lastName.trim()) {
      setProfileError("First name and last name are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setProfileError("Passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      await axios.put(
        `${API_URL}/api/update`,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Password was changed successfully.
      // Log the user out automatically.
      if (newPassword) {
        handleLogout();
      }
      setShowEditProfile(false);
    } catch (error) {
      console.error("Profile update error:", error);

      setProfileError(
        error.response?.data?.message ||
          (typeof error.response?.data === "string"
            ? error.response.data
            : "Unable to update profile. Please try again."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <header className={styles.header}>
        {/* LOGO */}

        {/* LOGO */}
<div className={styles.headerBrand}>
  <div className={styles.headerBrandIcon}>
    <FontAwesomeIcon icon={faBagShopping} />
  </div>

  <span className={styles.headerBrandText}>SHOPORA</span>
</div>

        {/* LOCATION */}

        <div className={styles.location}>
          <FontAwesomeIcon
            icon={faLocationDot}
            className={styles.locationIcon}
          />

          <div className={styles.locationText}>
            <span>Deliver to</span>
            <strong>Hyderabad 500039</strong>
          </div>
        </div>

        {/* SEARCH */}

        <div className={styles.searchContainer}>
          <form className={styles.search} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />

            <button type="submit" aria-label="Search">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>

          {showSuggestions && searchText.trim() && (
            <div className={styles.searchDropdown}>
              {loading ? (
                <div className={styles.searchMessage}>Searching...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((product) => (
                  <div
                    key={product.id}
                    className={styles.searchItem}
                    onClick={() => handleProductClick(product)}
                  >
                    <img src={product.imageUrl} alt={product.productName} />

                    <div className={styles.searchItemInfo}>
                      <strong>{product.productName}</strong>
                      <span>{product.brand}</span>
                      <small>₹{product.price}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.searchMessage}>No products found</div>
              )}
            </div>
          )}
        </div>

        {/* NAVIGATION */}

        <nav className={styles.nav}>
          {role === "ADMIN" && (
            <Link to="/product" className={styles.addProductLink}>
              <span className={styles.addProductFull}>Add Product</span>

              <span className={styles.addProductShort}>
                <FontAwesomeIcon icon={faPlus} />
              </span>
            </Link>
          )}

          {role === "USER" && (
            <Link to="/cart" className={styles.actionLink}>
              <FontAwesomeIcon icon={faCartShopping} />
              <span>Cart</span>
            </Link>
          )}

          {/* PROFILE DROPDOWN */}

          <div className={styles.profileContainer} ref={profileRef}>
            <button
              type="button"
              className={styles.profileButton}
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Profile</span>
            </button>

            {showProfileMenu && (
              <div className={styles.profileDropdown}>
                {role === "ADMIN" && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/admin/profiles");
                    }}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    Check Profiles
                  </button>
                )}

                <button type="button" onClick={handleOpenEditProfile}>
                  <FontAwesomeIcon icon={faUserEdit} />
                  Edit Profile
                </button>

                <button type="button" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* EDIT PROFILE MODAL */}

      {showEditProfile && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) {
              setShowEditProfile(false);
            }
          }}
        >
          <div
            className={styles.profileModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="editProfileTitle"
          >
            <div className={styles.modalHeader}>
              <h2 id="editProfileTitle">Edit Profile</h2>

              <button
                type="button"
                className={styles.closeButton}
                aria-label="Close"
                disabled={saving}
                onClick={() => setShowEditProfile(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {profileLoading ? (
              <p className={styles.modalMessage}>Loading profile...</p>
            ) : (
              <form className={styles.profileForm} onSubmit={handleSaveProfile}>
                <label>
                  Username
                  <input
                    type="text"
                    value={username}
                    readOnly
                    className={styles.readOnlyInput}
                  />
                </label>

                <label>
                  First Name
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </label>

                <label>
                  Last Name
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </label>

                <label>
                  New Password
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className={styles.passwordToggle}
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowNewPassword((prev) => !prev)}
                    >
                      <FontAwesomeIcon
                        icon={showNewPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </label>

                <label>
                  Confirm Password
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className={styles.passwordToggle}
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </label>

                {profileError && (
                  <p className={styles.profileError}>{profileError}</p>
                )}

                {profileMessage && (
                  <p className={styles.profileSuccess}>{profileMessage}</p>
                )}

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    disabled={saving}
                    onClick={() => setShowEditProfile(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {!profileLoading && profileError && (
              <p className={styles.profileError}>{profileError}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
