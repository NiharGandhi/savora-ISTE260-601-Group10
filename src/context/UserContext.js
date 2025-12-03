import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children, userId = 'default' }) => {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [groups, setGroups] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [streak, setStreak] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // Get storage keys based on userId
  const getStorageKey = (key) => {
    // Sessions are global, not per-user
    if (key === 'sessions') {
      return 'savora_sessions_global';
    }
    return `savora_${key}_${userId}`;
  };

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const savedUser = localStorage.getItem(getStorageKey('user'));
      const savedPreferences = localStorage.getItem(getStorageKey('preferences'));
      const savedGroups = localStorage.getItem(getStorageKey('groups'));
      const savedSessions = localStorage.getItem(getStorageKey('sessions'));
      const savedFavorites = localStorage.getItem(getStorageKey('favorites'));
      const savedStreak = localStorage.getItem(getStorageKey('streak'));
      const savedNotifications = localStorage.getItem(getStorageKey('notifications'));

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedPreferences) setPreferences(JSON.parse(savedPreferences));
      if (savedGroups) setGroups(JSON.parse(savedGroups));
      if (savedSessions) setSessions(JSON.parse(savedSessions));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedStreak) setStreak(parseInt(savedStreak));
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    };

    loadData();

    // Reload sessions periodically to catch updates from other tabs/users
    const interval = setInterval(() => {
      const savedSessions = localStorage.getItem(getStorageKey('sessions'));
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        setSessions(parsedSessions);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [userId]);

  // Save user data to localStorage
  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem(getStorageKey('user'), JSON.stringify(userData));
  };

  const savePreferences = (prefs) => {
    // Ensure default values for units
    const prefsWithDefaults = {
      ...prefs,
      currency: prefs.currency || 'AED',
      distanceUnit: prefs.distanceUnit || 'km',
    };
    setPreferences(prefsWithDefaults);
    localStorage.setItem(getStorageKey('preferences'), JSON.stringify(prefsWithDefaults));
  };

  const addGroup = (group) => {
    const newGroups = [...groups, group];
    setGroups(newGroups);
    localStorage.setItem(getStorageKey('groups'), JSON.stringify(newGroups));
  };

  const addSession = (session) => {
    const newSessions = [...sessions, session];
    setSessions(newSessions);
    localStorage.setItem(getStorageKey('sessions'), JSON.stringify(newSessions));
  };

  const updateSession = (sessionId, updates) => {
    const newSessions = sessions.map(s =>
      s.id === sessionId ? { ...s, ...updates } : s
    );
    setSessions(newSessions);
    localStorage.setItem(getStorageKey('sessions'), JSON.stringify(newSessions));
  };

  const addFavorite = (restaurant) => {
    const newFavorites = [...favorites, restaurant];
    setFavorites(newFavorites);
    localStorage.setItem(getStorageKey('favorites'), JSON.stringify(newFavorites));
  };

  const incrementStreak = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem(getStorageKey('streak'), newStreak.toString());
  };

  const addNotification = (notification) => {
    const newNotifications = [notification, ...notifications];
    setNotifications(newNotifications);
    localStorage.setItem(getStorageKey('notifications'), JSON.stringify(newNotifications));
  };

  // Add notification to a specific user's storage (for cross-user notifications)
  const addNotificationToUser = (targetUserId, notification) => {
    const targetStorageKey = `savora_notifications_${targetUserId}`;
    const existingNotifications = JSON.parse(localStorage.getItem(targetStorageKey) || '[]');
    const newNotifications = [notification, ...existingNotifications];
    localStorage.setItem(targetStorageKey, JSON.stringify(newNotifications));
  };

  const updateGroup = (groupId, updates) => {
    const newGroups = groups.map(g =>
      g.id === groupId ? { ...g, ...updates } : g
    );
    setGroups(newGroups);
    localStorage.setItem(getStorageKey('groups'), JSON.stringify(newGroups));
  };

  const acceptInvitation = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    // Handle group invitation
    if (notification.type === 'group_invite' && notification.groupId) {
      let group = groups.find(g => g.id === notification.groupId);
      
      if (!group && notification.groupName) {
        // Group doesn't exist in user's list, create it from notification
        group = {
          id: notification.groupId,
          name: notification.groupName,
          description: notification.groupDescription || '',
          photo: notification.groupIcon || 'IoPeople',
          members: notification.groupMembers || [],
          createdAt: notification.timestamp,
        };
        
        // Add the group to user's groups
        const newGroups = [...groups, group];
        setGroups(newGroups);
        localStorage.setItem(getStorageKey('groups'), JSON.stringify(newGroups));
      }
      
      if (group && user) {
        // Check if user is already a member
        const isMember = group.members.some(m => 
          m.name === user.name || m.phone === user.phone
        );
        
        if (!isMember) {
          // Add current user to the group
          const updatedMembers = [...(group.members || []), {
            name: user.name,
            phone: user.phone,
            email: user.email,
          }];
          updateGroup(notification.groupId, { members: updatedMembers });
        }
      }
    }

    const newNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, status: 'accepted', read: true } : n
    );
    setNotifications(newNotifications);
    localStorage.setItem(getStorageKey('notifications'), JSON.stringify(newNotifications));
  };

  const declineInvitation = (notificationId) => {
    const newNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, status: 'declined', read: true } : n
    );
    setNotifications(newNotifications);
    localStorage.setItem(getStorageKey('notifications'), JSON.stringify(newNotifications));
  };

  const markNotificationAsRead = (notificationId) => {
    const newNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(newNotifications);
    localStorage.setItem(getStorageKey('notifications'), JSON.stringify(newNotifications));
  };

  // Load user by email and password (for sign in)
  const loadUserByEmail = (email, password) => {
    if (!email || !password) {
      return false;
    }

    // Normalize inputs
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    
    // Helper function to check if user matches
    const checkUserMatch = (userData) => {
      if (!userData || typeof userData !== 'object') return false;
      if (!userData.email || !userData.password) return false;
      
      const userEmailNormalized = String(userData.email).trim().toLowerCase();
      const userPassword = String(userData.password);
      
      return userEmailNormalized === normalizedEmail && userPassword === trimmedPassword;
    };

    // First, check current userId's storage (fast path)
    const currentUserKey = getStorageKey('user');
    const currentUserStr = localStorage.getItem(currentUserKey);
    if (currentUserStr) {
      try {
        const currentUserData = JSON.parse(currentUserStr);
        if (checkUserMatch(currentUserData)) {
          // Found in current storage, load all data
          setUser(currentUserData);
          
          // Load all user data for current userId
          const savedPreferences = localStorage.getItem(getStorageKey('preferences'));
          const savedGroups = localStorage.getItem(getStorageKey('groups'));
          const savedSessions = localStorage.getItem(getStorageKey('sessions'));
          const savedFavorites = localStorage.getItem(getStorageKey('favorites'));
          const savedStreak = localStorage.getItem(getStorageKey('streak'));
          const savedNotifications = localStorage.getItem(getStorageKey('notifications'));

          if (savedPreferences) setPreferences(JSON.parse(savedPreferences));
          if (savedGroups) setGroups(JSON.parse(savedGroups));
          if (savedSessions) setSessions(JSON.parse(savedSessions));
          if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
          if (savedStreak) setStreak(parseInt(savedStreak) || 0);
          if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
          
          return true;
        }
      } catch (e) {
        // Invalid JSON, continue searching
      }
    }
    
    // Search through all localStorage keys to find user with matching email
    const allKeys = Object.keys(localStorage);
    let foundUserId = null;
    let foundUserData = null;

    // Look for user keys (savora_user_*)
    for (const key of allKeys) {
      if (key.startsWith('savora_user_')) {
        // Extract userId from key (savora_user_<userId>)
        const userIdFromKey = key.replace('savora_user_', '');
        
        // Skip fake test users (nihar, kripa, zara) - they're for testing only
        if (userIdFromKey === 'nihar' || userIdFromKey === 'kripa' || userIdFromKey === 'zara') {
          continue;
        }
        
        // Skip if we already checked this key
        if (key === currentUserKey) {
          continue;
        }
        
        try {
          const userDataStr = localStorage.getItem(key);
          if (!userDataStr) continue;
          
          const userData = JSON.parse(userDataStr);
          
          if (checkUserMatch(userData)) {
            foundUserId = userIdFromKey;
            foundUserData = userData;
            break;
          }
        } catch (e) {
          // Skip invalid JSON
          continue;
        }
      }
    }

    if (!foundUserData) {
      return false;
    }

    // Set the found user
    setUser(foundUserData);

    // Load all other user data using the found userId
    const getFoundUserStorageKey = (key) => {
      if (key === 'sessions') {
        return 'savora_sessions_global';
      }
      return `savora_${key}_${foundUserId}`;
    };

    // Load all user data from found user's storage
    try {
      const savedPreferences = localStorage.getItem(getFoundUserStorageKey('preferences'));
      const savedGroups = localStorage.getItem(getFoundUserStorageKey('groups'));
      const savedSessions = localStorage.getItem(getFoundUserStorageKey('sessions'));
      const savedFavorites = localStorage.getItem(getFoundUserStorageKey('favorites'));
      const savedStreak = localStorage.getItem(getFoundUserStorageKey('streak'));
      const savedNotifications = localStorage.getItem(getFoundUserStorageKey('notifications'));

      if (savedPreferences) setPreferences(JSON.parse(savedPreferences));
      if (savedGroups) setGroups(JSON.parse(savedGroups));
      if (savedSessions) setSessions(JSON.parse(savedSessions));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedStreak) setStreak(parseInt(savedStreak) || 0);
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    } catch (e) {
      console.error('Error loading user data:', e);
    }

    // Copy the user data to current userId's storage for consistency
    // This ensures the user is loaded in the current context
    try {
      localStorage.setItem(getStorageKey('user'), JSON.stringify(foundUserData));
      
      const savedPreferences = localStorage.getItem(getFoundUserStorageKey('preferences'));
      const savedGroups = localStorage.getItem(getFoundUserStorageKey('groups'));
      const savedFavorites = localStorage.getItem(getFoundUserStorageKey('favorites'));
      const savedStreak = localStorage.getItem(getFoundUserStorageKey('streak'));
      const savedNotifications = localStorage.getItem(getFoundUserStorageKey('notifications'));
      
      if (savedPreferences) localStorage.setItem(getStorageKey('preferences'), savedPreferences);
      if (savedGroups) localStorage.setItem(getStorageKey('groups'), savedGroups);
      if (savedFavorites) localStorage.setItem(getStorageKey('favorites'), savedFavorites);
      if (savedStreak) localStorage.setItem(getStorageKey('streak'), savedStreak);
      if (savedNotifications) localStorage.setItem(getStorageKey('notifications'), savedNotifications);
    } catch (e) {
      console.error('Error copying user data to current context:', e);
    }

    return true;
  };

  // Helper function to load all user data for a given userId
  const loadUserData = (targetUserId) => {
    const getTargetStorageKey = (key) => {
      if (key === 'sessions') {
        return 'savora_sessions_global';
      }
      return `savora_${key}_${targetUserId}`;
    };

    try {
      const savedPreferences = localStorage.getItem(getTargetStorageKey('preferences'));
      const savedGroups = localStorage.getItem(getTargetStorageKey('groups'));
      const savedSessions = localStorage.getItem(getTargetStorageKey('sessions'));
      const savedFavorites = localStorage.getItem(getTargetStorageKey('favorites'));
      const savedStreak = localStorage.getItem(getTargetStorageKey('streak'));
      const savedNotifications = localStorage.getItem(getTargetStorageKey('notifications'));

      if (savedPreferences) setPreferences(JSON.parse(savedPreferences));
      if (savedGroups) setGroups(JSON.parse(savedGroups));
      if (savedSessions) setSessions(JSON.parse(savedSessions));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedStreak) setStreak(parseInt(savedStreak) || 0);
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    } catch (e) {
      console.error('Error loading user data:', e);
    }
  };

  // Logout function - only clears current session state, keeps all data in localStorage
  // This allows user to log back in with same credentials
  const logout = () => {
    // Only clear the current session state (React state)
    // Keep ALL data in localStorage including user data, so user can log back in
    setUser(null);
    setPreferences(null);
    setGroups([]);
    setFavorites([]);
    setStreak(0);
    setNotifications([]);
    // Keep sessions in localStorage - don't clear them
    // All user data remains in localStorage for future login
  };

  const value = {
    user,
    preferences,
    groups,
    sessions,
    favorites,
    streak,
    notifications,
    saveUser,
    savePreferences,
    addGroup,
    updateGroup,
    addSession,
    updateSession,
    addFavorite,
    incrementStreak,
    addNotification,
    addNotificationToUser,
    acceptInvitation,
    declineInvitation,
    markNotificationAsRead,
    loadUserByEmail,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
