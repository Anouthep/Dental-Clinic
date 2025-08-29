import { Outlet,Link, useLocation } from 'react-router-dom';
import { useUserAuth } from './context/AuthContext'; // <-- สำคัญมาก
import { Button } from 'react-bootstrap';
import './fonts.css';


function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

  const { user, logOut } = useUserAuth();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    
    <>
      {!hideNavbar && (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/">Family Dental Clinic</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/service">ບໍລິການ</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/about">ກ່ຽວກັບເຮົາ</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/history">ປະຫວັດການນັດໝາຍ</Link></li>
              </ul>
              {user ? (
                <div className="d-flex align-items-center ms-3">
                  <span className="me-3">👤 {user.email}</span>
                  <Button variant="outline-danger" size="sm" onClick={handleLogout}>Logout</Button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-outline-primary ms-3">Login</Link>
              )}
            </div>
          </div>
        </nav>
      )}
      <Outlet />
    </>
  );
}

export default App;
