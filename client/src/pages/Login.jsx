import "./Login.css";

function Login() {
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

          <form>
            <label>Email</label>

            <input type="email" placeholder="Enter your email" />

            <label>Password</label>

            <input type="password" placeholder="Enter your password" />

            <button type="submit">Log In</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
