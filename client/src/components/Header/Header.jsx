import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <h1>CanvassNow</h1>
      </div>

      <div className="header__right">
        <button className="header__profile">👤 My Profile</button>
      </div>
    </header>
  );
}

export default Header;
