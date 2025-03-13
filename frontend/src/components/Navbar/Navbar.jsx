import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiAlertTriangle,
  FiTrendingUp,
  FiTrendingDown,
  FiPackage,
} from "react-icons/fi";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-text"> Dashboard</span>
        </Link>

        <div className="nav-links">
          <Link to="/assets" className="nav-link">
            <FiBriefcase className="nav-icon" />
            <span className="nav-link-text">Assets</span>
          </Link>

          <Link to="/liabilities" className="nav-link">
            <FiAlertTriangle className="nav-icon" />
            <span className="nav-link-text">Liabilities</span>
          </Link>

          <Link to="/incomes" className="nav-link">
            <FiTrendingUp className="nav-icon" />
            <span className="nav-link-text">Incomes</span>
          </Link>

          <Link to="/expenses" className="nav-link">
            <FiTrendingDown className="nav-icon" />
            <span className="nav-link-text">Expenses</span>
          </Link>

          <Link to="/products" className="nav-link">
            <FiPackage className="nav-icon" />
            <span className="nav-link-text">Products</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
