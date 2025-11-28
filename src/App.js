import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, MemoryRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import MobileFrame from './components/MobileFrame';

// Pages
import SplashScreen from './pages/SplashScreen';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Decision from './pages/Decision';
import CreateGroup from './pages/CreateGroup';
import Groups from './pages/Groups';
import Preferences from './pages/Preferences';
import Result from './pages/Result';
import Explore from './pages/Explore';
import Settings from './pages/Settings';
import SessionWaiting from './pages/SessionWaiting';
import AdditionalMatches from './pages/AdditionalMatches';
import Notifications from './pages/Notifications';
import JoinWithCode from './pages/JoinWithCode';

// Fake user data for testing
const fakeUsers = {
  nihar: {
    name: 'Nihar',
    email: 'nihar@example.com',
    phone: '+971 50 1234567',
    preferences: {
      budget: 'moderate',
      distance: 8,
      cuisines: ['Indian', 'Mediterranean', 'Chinese'],
      dietary: ['Vegetarian'],
      currency: 'AED',
      distanceUnit: 'km',
    },
  },
  kripa: {
    name: 'Kripa',
    email: 'kripa@example.com',
    phone: '+971 50 2345678',
    preferences: {
      budget: 'moderate',
      distance: 5,
      cuisines: ['Italian', 'Chinese'],
      dietary: [],
      currency: 'AED',
      distanceUnit: 'km',
    },
  },
  zara: {
    name: 'Zara',
    email: 'zara@example.com',
    phone: '+971 50 3456789',
    preferences: {
      budget: 'high',
      distance: 10,
      cuisines: ['Japanese', 'Mediterranean', 'Italian'],
      dietary: ['Vegan'],
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
        email: userData.email,
        phone: userData.phone,
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
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/decision" element={<Decision />} />
            <Route path="/create-group" element={<CreateGroup />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/session/waiting" element={<SessionWaiting />} />
            <Route path="/preferences/:sessionId" element={<Preferences />} />
            <Route path="/result/:sessionId" element={<Result />} />
            <Route path="/additional-matches/:sessionId" element={<AdditionalMatches />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/settings" element={<Settings />} />
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
    <div style={styles.appContainer}>
      {/* Reset Storage Button and User 2 Selector */}
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
          <label htmlFor="user2-select" style={styles.userSelectorLabel}>User 2:</label>
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
      <div style={styles.framesContainer}>
        {/* User 1 - Default (Dynamic - anyone using sign up/login) */}
        <div style={styles.frameWrapper}>
          <div style={styles.frameLabel}>User 1 (Default)</div>
          <AppRoutes userId="default" />
        </div>

        {/* User 2 - Selected from dropdown */}
        <div style={styles.frameWrapper}>
          <div style={styles.frameLabel}>User 2 ({fakeUsers[user2Id]?.name || 'Select'})</div>
          <AppRoutes userId={user2Id} useMemoryRouter={true} key={user2Id} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    background: '#1a1a1a',
    padding: '20px',
    position: 'relative',
  },
  controlsBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 10000,
    pointerEvents: 'auto',
  },
  resetButton: {
    background: '#EF4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    transition: 'all 0.2s ease',
    pointerEvents: 'auto',
    zIndex: 10001,
    position: 'relative',
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
    zIndex: 10000,
    pointerEvents: 'auto',
  },
  userSelectorLabel: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    pointerEvents: 'none',
    userSelect: 'none',
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
    zIndex: 10001,
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    position: 'relative',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '12px',
  },
  framesContainer: {
    display: 'flex',
    gap: '40px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  frameWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  frameLabel: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
};

export default App;
