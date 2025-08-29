// src/admin/AdminLayout.js
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate('/login'); // กลับไปหน้า login
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return (
    <div className="d-flex">
      <aside className="bg-dark text-white p-4" style={{ width: '250px', minHeight: '100vh' }}>
        <h4 className="mb-4">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/appointments">ຈັດການນັດໝາຍ</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/employees">ຈັດພະນັກງານ</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/service">ຈັດການບໍລິການ</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/report">ລາຍງານ</Link>
          </li>
          <li className="nav-item mt-4">
            <button
              onClick={handleLogout}
              className="btn btn-danger w-100"
            >
              Logout
            </button>
          </li>
        </ul>
      </aside>
      <main className="p-4 flex-grow-1 bg-light" style={{ width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
