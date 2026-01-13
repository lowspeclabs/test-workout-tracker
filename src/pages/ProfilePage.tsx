import React from 'react';

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
    <div>
      <h1 className="headline">Profile</h1>

      {/* User Information Card (Static for MVP) */}
      <div className="card">
        <div className="section-label">User Info</div>
        <h3>Guest User</h3>
        <p>Goals: Strength, Mobility</p>
      </div>

      {/* Preferences Card */}
      <div className="card">
        <div className="section-label">Preferences</div>
        <div className="flex-row" style={{padding: '8px 0'}}>
            <span>Dark Mode</span>
            <input type="checkbox" />
        </div>
        <div className="flex-row" style={{padding: '8px 0'}}>
            <span>Units (lb/kg)</span>
            <select><option>lb</option><option>kg</option></select>
        </div>
      </div>

      {/* Debugging / Bridge Test Card */}
      <div className="card">
          <div className="section-label">Device Bridge Tests</div>
          <button className="btn btn-secondary mb-2" onClick={handleToastTest}>Test Native Toast</button>
          <button className="btn btn-secondary" onClick={handlePerms}>Request Native Permission</button>
      </div>
    </div>
  );
};

export default ProfilePage;
