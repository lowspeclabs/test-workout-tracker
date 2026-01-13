import React from 'react';

// Shim for TypeScript
declare global {
  interface Window {
    Android?: {
      showToast: (msg: string) => void;
      getAppVersion: () => string;
      requestNotificationPermission: () => void;
    };
  }
}

const ProfilePage = () => {
  const handleToastTest = () => {
    if (window.Android && window.Android.showToast) {
      window.Android.showToast("Hello from React!");
    } else {
      alert("Android Bridge not active (Running in browser)");
    }
  };

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

      <div className="card">
        <div className="section-label">User Info</div>
        <h3>Guest User</h3>
        <p>Goals: Strength, Mobility</p>
      </div>

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

      <div className="card">
          <div className="section-label">Device Bridge Tests</div>
          <button className="btn btn-secondary mb-2" onClick={handleToastTest}>Test Native Toast</button>
          <button className="btn btn-secondary" onClick={handlePerms}>Request Native Permission</button>
      </div>
    </div>
  );
};

export default ProfilePage;
