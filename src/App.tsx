import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import HomePage from './pages/HomePage';
import PlanPage from './pages/PlanPage';
import StatsPage from './pages/StatsPage';
import ProfilePage from './pages/ProfilePage';
import SessionPlayer from './pages/SessionPlayer';
import './index.css';

/**
 * App Component
 * Sets up the React Router for navigation.
 *
 * Routes:
 * - / : Layout wrapper for main tabs
 *   - / (Index) -> HomePage
 *   - /plan -> PlanPage
 *   - /stats -> StatsPage
 *   - /profile -> ProfilePage
 * - /session/:workoutId : Full screen workout player (no bottom nav)
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Application with Bottom Navigation */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="plan" element={<PlanPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Standalone Pages (No Navigation) */}
        <Route path="/session/:workoutId" element={<SessionPlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
