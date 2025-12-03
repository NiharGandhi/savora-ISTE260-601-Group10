import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, MemoryRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import MobileFrame from './components/MobileFrame';

// Pages
import SplashScreen from './pages/SplashScreen';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Decision from './pages/Decision';
import CreateGroup from './pages/CreateGroup';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import Preferences from './pages/Preferences';
import Result from './pages/Result';
import Explore from './pages/Explore';
import Settings from './pages/Settings';
import ComingSoon from './pages/ComingSoon';
import ErrorStates from './pages/ErrorStates';
import SessionWaiting from './pages/SessionWaiting';
import AdditionalMatches from './pages/AdditionalMatches';
import Notifications from './pages/Notifications';
import JoinWithCode from './pages/JoinWithCode';

// Helper function to calculate age from DOB
const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Fake user data for testing
const fakeUsers = {
  nihar: {
    name: 'Nihar',
    dob: '2003-06-15',
    email: 'nihar@example.com',
    phone: '+971 50 123 4567',
    phoneCountry: 'AE',
    preferences: {
      budgetRange: { label: 'Above 100 AED', value: '> 100', minValue: 100, maxValue: 500 },
      distanceRange: { label: '5-10 km', value: '5-10', minValue: 5, maxValue: 10 },
      cuisines: ['Indian', 'Mediterranean', 'Chinese'],
      dietaryRestrictions: ['Vegetarian'],
      currency: 'AED',
      distanceUnit: 'km',
    },
  },
  kripa: {
    name: 'Kripa',
    dob: '2004-03-22',
    email: 'kripa@example.com',
    phone: '+1 555 234 5678',
    phoneCountry: 'US',
    preferences: {
      budgetRange: { label: '60-100 AED', value: '60-100', minValue: 60, maxValue: 100 },
      distanceRange: { label: '2-5 km', value: '2-5', minValue: 2, maxValue: 5 },
      cuisines: ['Italian', 'Chinese'],
      dietaryRestrictions: [],
      currency: 'AED',
      distanceUnit: 'km',
    },
  },
  zara: {
    name: 'Zara',
    dob: '2002-11-08',
    email: 'zara@example.com',
    phone: '+91 98765 43210',
    phoneCountry: 'IN',
    preferences: {
      budgetRange: { label: 'Above 100 AED', value: '> 100', minValue: 100, maxValue: 500 },
      distanceRange: { label: 'Above 10 km', value: '> 10', minValue: 10, maxValue: 25 },
      cuisines: ['Japanese', 'Mediterranean', 'Italian'],
      dietaryRestrictions: ['Vegan'],
      currency: 'AED',
      distanceUnit: 'km',
    },
  },
};

// Initialize fake user data
const initializeFakeUsers = () => {
  Object.entries(fakeUsers).forEach(([userId, userData]) => {
    if (!localStorage.getItem(`savora_user_${userId}`)) {
      localStorage.setItem(`savora_user_${userId}`, JSON.stringify({
        name: userData.name,
        dob: userData.dob,
        age: calculateAge(userData.dob),
        email: userData.email,
        phone: userData.phone,
        phoneCountry: userData.phoneCountry,
      }));
    }
    if (!localStorage.getItem(`savora_preferences_${userId}`)) {
      localStorage.setItem(`savora_preferences_${userId}`, JSON.stringify(userData.preferences));
    }
  });
};

// Reset storage function
const resetStorage = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('savora_')) {
      localStorage.removeItem(key);
    }
  });
  window.location.reload();
};

// App Routes Component - wrapped with UserProvider
const AppRoutes = ({ userId, useMemoryRouter = false }) => {
  const RouterComponent = useMemoryRouter ? MemoryRouter : Router;
  const routerProps = useMemoryRouter ? { initialEntries: ['/home'] } : {};

  return (
    <UserProvider userId={userId}>
      <RouterComponent {...routerProps}>
        <MobileFrame>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/decision" element={<Decision />} />
            <Route path="/create-group" element={<CreateGroup />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/group/:id" element={<GroupDetails />} />
            <Route path="/session/waiting" element={<SessionWaiting />} />
            <Route path="/preferences/:sessionId" element={<Preferences />} />
            <Route path="/result/:sessionId" element={<Result />} />
            <Route path="/additional-matches/:sessionId" element={<AdditionalMatches />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/error-states" element={<ErrorStates />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/join" element={<JoinWithCode />} />
          </Routes>
        </MobileFrame>
      </RouterComponent>
    </UserProvider>
  );
};

function App() {
  const [user2Id, setUser2Id] = useState(() => {
    // Retrieve from localStorage or default to 'nihar'
    return localStorage.getItem('savora_user2_selected') || 'nihar';
  });

  useEffect(() => {
    initializeFakeUsers();
  }, []);

  const handleReset = () => {
    resetStorage();
  };

  const handleUserChange = (e) => {
    const newUserId = e.target.value;
    setUser2Id(newUserId);
    // Persist User 2 selection
    localStorage.setItem('savora_user2_selected', newUserId);
  };

  return (
    <div style={styles.appContainer} className="app-container">
      {/* Reset Storage Button and User 2 Selector - Fixed at top */}
      <div style={styles.controlsBar} className="app-controls-bar">
        <button 
          onClick={handleReset}
          style={styles.resetButton}
          type="button"
          className="app-reset-button"
        >
          🔄 Reset All Storage
        </button>
        <div style={styles.userSelector} className="app-user-selector">
          <label htmlFor="user2-select" style={styles.userSelectorLabel} className="app-user-label">User 2:</label>
          <select 
            id="user2-select"
            value={user2Id} 
            onChange={handleUserChange}
            style={styles.userSelectorDropdown}
            className="app-user-dropdown"
          >
            <option value="nihar">Nihar</option>
            <option value="kripa">Kripa</option>
            <option value="zara">Zara</option>
          </select>
        </div>
      </div>

      {/* Two Mobile Frames Side by Side */}
      <div style={styles.framesContainer} className="app-frames-container">
        {/* User 1 - Default (Dynamic - anyone using sign up/login) */}
        <div style={styles.frameWrapper} className="app-frame-wrapper">
          <div style={styles.frameLabel} className="app-frame-label">User 1 (Default)</div>
          <AppRoutes userId="default" />
        </div>

        {/* User 2 - Selected from dropdown */}
        <div style={styles.frameWrapper} className="app-frame-wrapper">
          <div style={styles.frameLabel} className="app-frame-label">User 2 ({fakeUsers[user2Id]?.name || 'Select'})</div>
          <AppRoutes userId={user2Id} useMemoryRouter={true} key={user2Id} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    width: '100%',
    minHeight: '100%',
    background: 'transparent',
    padding: '32px 16px 40px',
    paddingTop: '40px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    /* Let the browser handle scrolling instead of this container */
    overflowX: 'visible',
    overflowY: 'visible',
  },
  controlsBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(26, 26, 26, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 99999,
    pointerEvents: 'auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  resetButton: {
    background: '#EF4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    transition: 'all 0.2s ease',
    pointerEvents: 'auto',
    zIndex: 100000,
    position: 'relative',
    flexShrink: 0,
  },
  resetButtonHover: {
    background: '#DC2626',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)',
  },
  userSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    position: 'relative',
    zIndex: 100000,
    pointerEvents: 'auto',
    flexShrink: 0,
  },
  userSelectorLabel: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    pointerEvents: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  userSelectorDropdown: {
    background: '#2a2a2a',
    color: 'white',
    border: '2px solid #3a3a3a',
    borderRadius: '8px',
    padding: '10px 16px',
    paddingRight: '40px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '120px',
    pointerEvents: 'auto',
    zIndex: 100001,
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    position: 'relative',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '12px',
    flexShrink: 0,
  },
  framesContainer: {
    display: 'flex',
    gap: '40px',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '1120px',
    padding: '16px 0 0',
    margin: '0 auto 40px',
  },
  frameWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0px',
    flexShrink: 0,
  },
  frameLabel: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
    whiteSpace: 'nowrap',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
};

export default App;
