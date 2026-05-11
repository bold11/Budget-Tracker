import { Link, useLocation } from 'react-router-dom';
import { MdDarkMode } from "react-icons/md";
import { CiLight }    from "react-icons/ci";
function Navbar({ darkMode, toggleTheme }) {
  const location = useLocation(); // used to highlight the active nav

  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bt-navbar navbar navbar-expand-lg px-4">
      {/* Brand */}
      <Link className="navbar-brand" to="/">
        Budget<span className="brand-dot">.</span>Tracker
      </Link>

      {/* Nav links + toggle */}
      <div className="navbar-nav ms-auto d-flex align-items-center gap-1">
        {[
          { to: '/',             label: 'Dashboard'    },
          { to: '/transactions', label: 'Transactions' },
          { to: '/categories',   label: 'Categories'   },
          { to: '/budgets',      label: 'Budgets'      },
        ].map(({ to, label }) => (
          <Link
            key={to}
            className={`nav-link ${isActive(to) ? 'active' : ''}`}
            to={to}
          >
            {label}
          </Link>
        ))}

        {/* Sun / Moon toggle */}
        <div
          onClick={toggleTheme}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            cursor: 'pointer',
            width: '52px',
            height: '26px',
            borderRadius: '999px',
            backgroundColor: darkMode ? '#10b981' : '#475569',
            display: 'flex',
            alignItems: 'center',
            padding: '3px',
            transition: 'background-color 0.3s',
            marginLeft: '12px',
          }}
        >
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            transform: darkMode ? 'translateX(26px)' : 'translateX(0)',
            transition: 'transform 0.3s',
          }}>
            {darkMode ? <MdDarkMode size={15} color="#10b981" /> : <CiLight size={15} color="#475569" />}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
