import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Calendar, BarChart2, User } from 'lucide-react';

/**
 * Layout Component
 * This component wraps the main content of the application.
 * It renders the child route's content via <Outlet /> and displays the persistent bottom navigation bar.
 */
export const Layout = () => {
  return (
    <>
      {/* Main Content Area */}
      <div className="container">
        <Outlet />
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="nav-bar">
        {/* Home Tab */}
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>

        {/* Plan/Workouts Tab */}
        <NavLink to="/plan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Calendar size={24} />
          <span>Plan</span>
        </NavLink>

        {/* Statistics Tab */}
        <NavLink to="/stats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart2 size={24} />
          <span>Stats</span>
        </NavLink>

        {/* User Profile Tab */}
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </>
  );
};
