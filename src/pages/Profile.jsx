import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "./profile.module.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [accountCreated, setAccountCreated] = useState("");
  const [stats, setStats] = useState({
    totalOrders: 12,
    pendingOrders: 3,
    completedOrders: 9,
    loyaltyPoints: 150,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        const displayName =
          currentUser.displayName || currentUser.email.split("@")[0];
        setUser({ ...currentUser, displayName });

        // Format account creation date
        const createdAt = new Date(currentUser.metadata.creationTime);
        setAccountCreated(
          `${createdAt.toLocaleDateString()} at ${createdAt.toLocaleTimeString()}`
        );
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!user) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.card}>
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <h2 className={styles.name}>{user.displayName}</h2>
          <p className={styles.email}>{user.email}</p>
          <p><strong>Account Created:</strong> {accountCreated}</p>
        </div>

        {/* Account Info */}
        <div className={styles.infoSection}>
          <p><strong>UID:</strong> {user.uid}</p>
          <p>
            <strong>Provider:</strong> {user.providerData[0].providerId === "password" ? "Email/Password" : user.providerData[0].providerId}
          </p>
        </div>

        {/* Order & Loyalty Stats */}
        <div className={styles.stats}>
          <div className={styles.statBox}>
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
          <div className={styles.statBox}>
            <h3>Pending Orders</h3>
            <p>{stats.pendingOrders}</p>
          </div>
          <div className={styles.statBox}>
            <h3>Completed Orders</h3>
            <p>{stats.completedOrders}</p>
          </div>
          <div className={styles.statBox}>
            <h3>Loyalty Points</h3>
            <p>{stats.loyaltyPoints}</p>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={() => alert("Edit Profile Coming Soon!")}>
            Edit Profile
          </button>
          <button className={styles.ordersBtn} onClick={() => navigate("/orders")}>
            View Orders
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
