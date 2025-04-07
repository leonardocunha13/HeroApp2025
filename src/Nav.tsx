import "./styles.css";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div className="navbar">
      <div className="logo">Shopio</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/shop">Shop</Link></li>
      </ul>
    </div>
  );
}
