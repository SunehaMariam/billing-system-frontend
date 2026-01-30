import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import styles from "./login.module.css";

export default function Login() {
  const login = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);

      window.location.href = "/dashboard";
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        alert("❌ Incorrect email or password");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>

        <form onSubmit={login} className={styles.form}>
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
            Login
          </button>

          <p className={styles.note}>
            Don't have an account? <a href="/signup">Signup</a>
          </p>
        </form>
      </div>
    </div>
  );
}
