import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import styles from "./signup.module.css";

export default function Signup() {
  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Signup successful");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Signup</h2>

        <form onSubmit={signup} className={styles.form}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} name="email" placeholder="Email" />

          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Password"
          />

          <button className={styles.btn} type="submit">
            Signup
          </button>

          <p className={styles.note}>
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}
