import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../Components/Header";
import Category from "../Components/Category";

import styles from "../Styles/AdminProfiles.module.css";
const API_URL = import.meta.env.VITE_API_URL;


function AdminProfiles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // --------------------------------
  // CHECK ADMIN ACCESS
  // --------------------------------

  useEffect(() => {
    if (!token || role !== "ADMIN") {
      navigate("/", { replace: true });
    }
  }, [token, role, navigate]);

  // --------------------------------
  // FETCH USERS
  // --------------------------------

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/allUsers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("You are not authorized to view these profiles.");
      } else {
        setError("Unable to load users. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && role === "ADMIN") {
      fetchUsers();
    }
  }, [token, role]);

  // --------------------------------
  // DELETE USER
  // --------------------------------

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the account "${user.username}"?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(user.id);
      setError("");

      await axios.delete(
        `${API_URL}/api/admin/users/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers((previousUsers) =>
        previousUsers.filter((item) => item.id !== user.id),
      );
    } catch (err) {
      console.error("Error deleting user:", err);

      setError(
        err.response?.data?.message ||
          (typeof err.response?.data === "string"
            ? err.response.data
            : "Unable to delete user. Please try again."),
      );
    } finally {
      setDeletingId(null);
    }
  };

  // --------------------------------
  // SEARCH CALLBACK FOR HEADER
  // --------------------------------

  const handleSearch = (keyword) => {
    // This page does not display product search results.
    // Header still requires a search callback on pages that use one.
    //console.log("Product search:", keyword);
  };

  // --------------------------------
  // RENDER
  // --------------------------------

  if (!token || role !== "ADMIN") {
    return null;
  }

  return (
    <div className={styles.page}>
      <Header onSearch={handleSearch} />

      <Category />

      <main className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1>User Profiles</h1>
            <p>View and manage registered user accounts.</p>
          </div>

          <div className={styles.userCount}>
            Total users: {users.length}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.message}>Loading users...</div>
        ) : error && users.length === 0 ? (
          <div className={styles.message}>{error}</div>
        ) : users.length === 0 ? (
          <div className={styles.message}>No users found.</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>

                    <td>
                      {`${user.firstName ?? ""} ${
                        user.lastName ?? ""
                      }`.trim() || "—"}
                    </td>

                    <td>{user.username}</td>

                    <td>
                      <span
                        className={
                          user.role === "ADMIN"
                            ? styles.adminBadge
                            : styles.userBadge
                        }
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        disabled={
                          deletingId === user.id ||
                          user.id === Number(localStorage.getItem("userId"))
                        }
                        title={
                          user.id ===
                          Number(localStorage.getItem("userId"))
                            ? "You cannot delete your own account"
                            : "Delete user"
                        }
                        onClick={() => handleDelete(user)}
                      >
                        {deletingId === user.id
                          ? "Deleting..."
                          : "Delete User"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminProfiles;