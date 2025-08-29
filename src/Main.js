// routes.js
import React from 'react';
import App from './App';
import Home from './pages/Home';
import Service from './pages/Service';
import Contact from './pages/Contact';
import About from './pages/About';
import Appointment from './pages/Appointment';
import Login from './pages/login';
import Register from './pages/register';
import ProtectedRoute from './context/ProtectedRoute';
import './fonts.css';

import AdminLayout from './AdminPage/AdminLayout';
import AdminHome from './AdminPage/AdminHome';
import AdminAppointments from './AdminPage/AdminAppointments';
import AdminEmployees from './AdminPage/AdminEmployees';
import AdminService from './AdminPage/AdminService';
import History from './pages/BookingHistory';
import Report from './AdminPage/Report';

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "service", element: <ProtectedRoute><Service /></ProtectedRoute> },
      { path: "about", element: <ProtectedRoute><About /></ProtectedRoute> },
      { path: "contact", element: <ProtectedRoute><Contact /></ProtectedRoute> },
      { path: "history", element: <ProtectedRoute><History /></ProtectedRoute> },
      { path: "appointment", element: <ProtectedRoute><Appointment /></ProtectedRoute> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Register /> }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <ProtectedRoute><AdminHome /></ProtectedRoute> },
      { path: "appointments", element: <ProtectedRoute><AdminAppointments /></ProtectedRoute> },
      { path: "employees", element: <ProtectedRoute><AdminEmployees /></ProtectedRoute> },
      { path: "service", element: <ProtectedRoute><AdminService /></ProtectedRoute> },
      { path: "report", element: <ProtectedRoute><Report /></ProtectedRoute> },

    ],
  },
];

export default routes;
