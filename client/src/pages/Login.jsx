import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password.trim()) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setErrorMessage("");

    onLogin({
      email: trimmedEmail,
      password,
    });
  }

  return (
    <div className="login">
      <section className="login__left">
        <div className="login__hero">
          <h1 className="login__brand">CanvassNow</h1>

          <h2 className="login__title">Every Door. Every Conversation.</h2>

          <p className="login__subtitle">
            Organize routes, track visits, and make every knock count.
          </p>

          <div className="login__illustration">🚶📋🏠</div>
        </div>
      </section>

      <section className="login__right">
        <div className="login__card">
          <h2>Welcome Back</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email</label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
            />

            <label htmlFor="login-password">Password</label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            {errorMessage && <p className="login__error">{errorMessage}</p>}

            <button type="submit">Log In</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
