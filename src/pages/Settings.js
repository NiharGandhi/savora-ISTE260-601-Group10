import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';

const Settings = () => {
  const navigate = useNavigate();
  const { user, preferences, streak, savePreferences } = useUser();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.clear();
      navigate('/');
    }
  };

  const handleCurrencyChange = (newCurrency) => {
    const updatedPreferences = {
      ...preferences,
      currency: newCurrency,
    };
    savePreferences(updatedPreferences);
  };

  const handleDistanceUnitChange = (newUnit) => {
    const updatedPreferences = {
      ...preferences,
      distanceUnit: newUnit,
    };
    savePreferences(updatedPreferences);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/home')}>
          ←
        </button>
        <h2 style={styles.title}>Settings</h2>
        <div style={{ width: '40px' }} />
      </div>

      <div className="mobile-screen-content" style={styles.content}>
        {/* Profile Section */}
        <div style={styles.section}>
          <div style={styles.profileCard}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div style={styles.profileInfo}>
              <div style={styles.profileName}>{user?.name || 'Student'}</div>
              <div style={styles.profileEmail}>{user?.email || 'student@university.edu'}</div>
            </div>
            <button style={styles.editButton} onClick={() => navigate('/edit-profile')}>
              Edit
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.section}>
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{streak || 0}</div>
              <div style={styles.statLabel}>Day Streak 🔥</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>
                {preferences?.cuisines?.length || 0}
              </div>
              <div style={styles.statLabel}>Fav Cuisines</div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Your Preferences</h3>
          <div style={styles.preferencesList}>
            <div style={styles.preferenceItem}>
              <div style={styles.preferenceLabel}>Budget Range</div>
              <div style={styles.preferenceValue}>
                {preferences?.budget || 250} {preferences?.currency || 'AED'}
              </div>
            </div>
            <div style={styles.preferenceItem}>
              <div style={styles.preferenceLabel}>Max Distance</div>
              <div style={styles.preferenceValue}>
                {preferences?.distance || 3} {preferences?.distanceUnit || 'km'}
              </div>
            </div>
            <div style={styles.preferenceItem}>
              <div style={styles.preferenceLabel}>Favorite Cuisines</div>
              <div style={styles.preferenceValue}>
                {preferences?.cuisines?.length || 0} selected
              </div>
            </div>
          </div>
          <button
            style={styles.editPreferencesButton}
            onClick={() => navigate('/edit-preferences')}
          >
            Edit Preferences
          </button>
        </div>

        {/* Units */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Units</h3>
          <div style={styles.preferencesList}>
            <div style={styles.preferenceItem}>
              <div style={styles.preferenceLabel}>Currency</div>
              <select
                value={preferences?.currency || 'AED'}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                style={styles.select}
              >
                <option value="AED">AED (د.إ)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div style={styles.preferenceItem}>
              <div style={styles.preferenceLabel}>Distance</div>
              <select
                value={preferences?.distanceUnit || 'km'}
                onChange={(e) => handleDistanceUnitChange(e.target.value)}
                style={styles.select}
              >
                <option value="km">Kilometers (km)</option>
                <option value="mi">Miles (mi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Account</h3>
          <div style={styles.menuList}>
            <button style={styles.menuItem}>
              <span style={styles.menuIcon}>🔔</span>
              <span style={styles.menuText}>Notifications</span>
              <span style={styles.menuArrow}>→</span>
            </button>
            <button style={styles.menuItem}>
              <span style={styles.menuIcon}>🔒</span>
              <span style={styles.menuText}>Privacy</span>
              <span style={styles.menuArrow}>→</span>
            </button>
            <button style={styles.menuItem}>
              <span style={styles.menuIcon}>❓</span>
              <span style={styles.menuText}>Help & Support</span>
              <span style={styles.menuArrow}>→</span>
            </button>
            <button style={styles.menuItem}>
              <span style={styles.menuIcon}>ℹ️</span>
              <span style={styles.menuText}>About Savora</span>
              <span style={styles.menuArrow}>→</span>
            </button>
          </div>
        </div>

        {/* Logout */}
        <div style={styles.section}>
          <button style={styles.logoutButton} onClick={handleLogout}>
            🚪 Log Out
          </button>
        </div>
        <div style={{ height: '20px' }}></div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav-container">
        <div style={styles.bottomNav}>
          <button style={styles.navBtn} onClick={() => navigate('/home')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <span style={styles.navLabel}>Home</span>
          </button>
          <button style={styles.navBtn} onClick={() => navigate('/groups')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
            </svg>
            <span style={styles.navLabel}>Groups</span>
          </button>
          <button style={styles.navBtn} onClick={() => navigate('/explore')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span style={styles.navLabel}>Explore</span>
          </button>
          <button style={styles.navBtnActive}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" class="lucide lucide-settings-icon lucide-settings">
              <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
              <circle cx="12" cy="12" r="3" fill="white" />
            </svg>
            <span style={styles.navLabel}>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#F9FAFB',
  },
  header: {
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '40px 20px 16px 20px',
    borderBottom: '1px solid #E5E7EB',
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    margin: 0,
  },
  content: {
    padding: '16px',
  },
  section: {
    marginBottom: '24px',
  },
  profileCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: theme.shadows.sm,
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: theme.colors.primary.blueGradient,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: '18px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '4px',
  },
  profileEmail: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
  },
  editButton: {
    background: theme.colors.primary.main,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  statBox: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: theme.shadows.sm,
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: theme.colors.primary.main,
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: '12px',
  },
  preferencesList: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '12px',
    boxShadow: theme.shadows.sm,
  },
  preferenceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #E5E7EB',
  },
  preferenceLabel: {
    fontSize: '14px',
    color: theme.colors.text.primary,
  },
  preferenceValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
  select: {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.primary.main,
    border: `2px solid ${theme.colors.primary.main}`,
    borderRadius: '8px',
    padding: '6px 10px',
    background: 'white',
    cursor: 'pointer',
    outline: 'none',
  },
  editPreferencesButton: {
    width: '100%',
    background: 'white',
    border: `2px solid ${theme.colors.primary.main}`,
    borderRadius: '12px',
    padding: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.primary.main,
    cursor: 'pointer',
  },
  menuList: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: theme.shadows.sm,
  },
  menuItem: {
    width: '100%',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #E5E7EB',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  menuIcon: {
    fontSize: '20px',
  },
  menuText: {
    flex: 1,
    fontSize: '16px',
    color: theme.colors.text.primary,
  },
  menuArrow: {
    fontSize: '20px',
    color: theme.colors.text.secondary,
  },
  logoutButton: {
    width: '100%',
    background: 'white',
    border: `2px solid ${theme.colors.error}`,
    borderRadius: '12px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.error,
    cursor: 'pointer',
  },
  bottomNav: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    padding: '0 12px',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    color: theme.colors.text.tertiary,
    transition: 'color 0.2s ease',
  },
  navBtnActive: {
    background: 'none',
    border: 'none',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    color: theme.colors.primary.main,
  },
  navLabel: {
    fontSize: '11px',
    fontWeight: '600',
  },
};

export default Settings;
