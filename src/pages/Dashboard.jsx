import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    todaySales: 0,
    pendingBills: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalProducts: data.totalProducts || 0,
          todaySales: data.todaySales || 0,
          pendingBills: data.pendingBills || 0,
        });
      })
      .catch((err) => console.log("Dashboard Error:", err));
  }, []);

  const handleLogout = async () => {
    try {
       // <-- now this is imported
      navigate("/login");    // <-- navigate to login page
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Stationary</h2>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/billing">Billing</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </aside>

      {/* Main Section */}
      <div className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.profile}>👤 Admin</div>
          <div className={styles.authButtons}>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className={styles.content}>
          <h1 className={styles.heading}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome Admin! 👋</p>

          <div className={styles.cards}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Total Products</div>
              <div className={styles.cardValue}>{stats.totalProducts}</div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}>Today Sales</div>
              <div className={styles.cardValue}>Rs {stats.todaySales}</div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}>Pending Bills</div>
              <div className={styles.cardValue}>{stats.pendingBills}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
