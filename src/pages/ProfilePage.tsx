import React from 'react';
import { MotionPage } from '../components/MotionPage';
import { StatCard } from '../components/StatCard';

// Extend the global Window interface to include the Android JavascriptInterface
declare global {
  interface Window {
    Android?: {
      /** Displays a native Android Toast message */
      showToast: (msg: string) => void;
      /** Returns the version string of the Android app */
      getAppVersion: () => string;
      /** Requests notification permissions on the Android device */
      requestNotificationPermission: () => void;
    };
  }
}

/**
 * ProfilePage Component
 * Displays user settings and provides controls to test the Android JS Bridge.
 */
const ProfilePage = () => {

  // Test functionality: Call the native Android "Toast" method
  const handleToastTest = () => {
    if (window.Android && window.Android.showToast) {
      window.Android.showToast("Hello from React!");
    } else {
      // Fallback for browser development
      alert("Android Bridge not active (Running in browser)");
    }
  };

  // Test functionality: Request native permissions
  const handlePerms = () => {
      if (window.Android && window.Android.requestNotificationPermission) {
          window.Android.requestNotificationPermission();
      } else {
          alert("Requesting Notification Permissions (Mock)");
      }
  }

  return (
    <MotionPage>
        <div>
        <h1 className="headline">Profile</h1>

        {/* User Information Card (Static for MVP) */}
        <StatCard title="User Info">
            <h3>Guest User</h3>
            <p>Goals: Strength, Mobility</p>
        </StatCard>

        {/* Preferences Card */}
        <StatCard title="Preferences">
            <div className="flex-row" style={{padding: '8px 0'}}>
                <span>Dark Mode</span>
                <input type="checkbox" />
            </div>
            <div className="flex-row" style={{padding: '8px 0'}}>
                <span>Units (lb/kg)</span>
                <select><option>lb</option><option>kg</option></select>
            </div>
        </StatCard>

        {/* Debugging / Bridge Test Card */}
        <StatCard title="Device Bridge Tests">
            <button className="btn btn-secondary mb-2" onClick={handleToastTest}>Test Native Toast</button>
            <button className="btn btn-secondary" onClick={handlePerms}>Request Native Permission</button>
        </StatCard>
        </div>
    </MotionPage>
  );
};

export default ProfilePage;
