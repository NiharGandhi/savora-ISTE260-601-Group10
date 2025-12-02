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
    const savedUser = localStorage.getItem(getStorageKey('user'));

    if (!savedUser) {
      return false;
    }

    const userData = JSON.parse(savedUser);

    // Check if email and password match
    if (userData.email === email && userData.password === password) {
      setUser(userData);

      // Also load all other user data
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
      if (savedStreak) setStreak(parseInt(savedStreak));
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

      return true;
    }

    return false;
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
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
