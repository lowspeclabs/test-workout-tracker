import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Calendar, BarChart2, User } from 'lucide-react';

export const Layout = () => {
  return (
    <>
      <div className="container">
        <Outlet />
      </div>
      <nav className="nav-bar">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/plan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Calendar size={24} />
          <span>Plan</span>
        </NavLink>
        <NavLink to="/stats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart2 size={24} />
          <span>Stats</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </>
  );
};
