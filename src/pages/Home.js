import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';
import { IoFlame, IoStar, IoPeople, IoRestaurant, IoPizza, IoBeer, IoCafe, IoFastFood, IoWine, IoIceCream, IoNutrition, IoBriefcase, IoHome, IoNotifications } from 'react-icons/io5';

const Home = () => {
  const navigate = useNavigate();
  const { user, groups, sessions, favorites, streak, notifications } = useUser();
  const [refreshKey, setRefreshKey] = useState(0);

  // Listen for localStorage changes to update sessions in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'savora_sessions_global') {
        // Force re-render by updating refresh key
        setRefreshKey(prev => prev + 1);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Sessions are already polled via UserContext, but we can force refresh here too
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 1000); // Check every second

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [sessions]);

  const iconMap = {
    IoPeople: { icon: IoPeople, color: '#6366F1' },
    IoRestaurant: { icon: IoRestaurant, color: '#EC4899' },
    IoPizza: { icon: IoPizza, color: '#F59E0B' },
    IoBeer: { icon: IoBeer, color: '#F59E0B' },
    IoCafe: { icon: IoCafe, color: '#8B5CF6' },
    IoFastFood: { icon: IoFastFood, color: '#EF4444' },
    IoWine: { icon: IoWine, color: '#DC2626' },
    IoIceCream: { icon: IoIceCream, color: '#06B6D4' },
    IoNutrition: { icon: IoNutrition, color: '#10B981' },
    IoBriefcase: { icon: IoBriefcase, color: '#3B82F6' },
    IoHome: { icon: IoHome, color: '#8B5CF6' },
  };

  const getIconComponent = (iconId) => {
    const iconObj = iconMap[iconId] || iconMap['IoPeople'];
    return React.createElement(iconObj.icon, { size: 20, color: iconObj.color });
  };

  // Show only sessions created by others that user can join
  // Sessions are already global, so we just filter them
  const activeSessions = sessions.filter(s => {
    // Only show active sessions that are in waiting stage (joinable)
    // Allow sessions without stage (for backward compatibility) or with stage === 'waiting'
    if (s.status !== 'active') return false;
    if (s.stage && s.stage !== 'waiting') return false;

    // Check if user created this session
    const isUserCreator = s.creatorName === user?.name;

    // Show if NOT created by user
    return !isUserCreator;
  });
  const completedDecisions = sessions.filter(s => s.status === 'completed').length;

  const mockRecommendations = [
    { 
      id: 1, 
      name: 'Bella Italia', 
      cuisine: 'Italian', 
      rating: 4.8, 
      price: '$$', 
      distance: '0.5 mi',
      match: 92,
      dietary: 'Both',
      tagline: 'Nearby'
    },
    { 
      id: 2, 
      name: 'Sushi Station', 
      cuisine: 'Japanese', 
      rating: 4.7, 
      price: '$$$', 
      distance: '1.2 mi',
      match: 88,
      dietary: 'Non-Veg',
      tagline: 'Trending in your area'
    },
    { 
      id: 3, 
      name: 'Taco Town', 
      cuisine: 'Mexican', 
      rating: 4.5, 
      price: '$', 
      distance: '0.8 mi',
      match: 85,
      dietary: 'Both',
      tagline: 'Popular choice'
    },
  ];

  const getSessionStageBadgeStyle = (stage) => {
    const baseStyle = {
      ...styles.statusBadge,
    };

    switch (stage) {
      case 'waiting':
        return {
          ...baseStyle,
          background: 'rgba(251, 146, 60, 0.15)',
          color: '#F97316',
        };
      case 'preferences':
        return {
          ...baseStyle,
          background: 'rgba(139, 92, 246, 0.15)',
          color: '#8B5CF6',
        };
      case 'deciding':
        return {
          ...baseStyle,
          background: 'rgba(59, 130, 246, 0.15)',
          color: '#3B82F6',
        };
      case 'result':
        return {
          ...baseStyle,
          background: 'rgba(34, 197, 94, 0.15)',
          color: '#22C55E',
        };
      default:
        return {
          ...baseStyle,
          background: 'rgba(156, 163, 175, 0.15)',
          color: '#6B7280',
        };
    }
  };

  const getDietaryBadgeStyle = (dietary) => {
    const baseStyle = {
      ...styles.dietaryBadge,
    };

    switch (dietary) {
      case 'Veg':
        return {
          ...baseStyle,
          background: 'rgba(34, 197, 94, 0.15)',
          color: '#22C55E',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        };
      case 'Non-Veg':
        return {
          ...baseStyle,
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#EF4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      case 'Both':
      case 'Mixed':
        return {
          ...baseStyle,
          background: 'rgba(168, 85, 247, 0.15)',
          color: '#A855F7',
          border: '1px solid rgba(168, 85, 247, 0.3)',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div style={styles.container}>
      <div className="mobile-screen-content" style={styles.content}>
        {/* Gradient Background */}
        <div style={styles.gradientBg} />
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.greeting}>Hello, {user?.name || 'there'}</div>
            <div style={styles.headerSubtitle}>Ready for your next meal?</div>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.notificationButton} onClick={() => navigate('/notifications')}>
              <IoNotifications size={24} color="white" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span style={styles.notificationBadge}>
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <button style={styles.avatar} onClick={() => navigate('/settings')}>
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </button>
          </div>
        </div>
        <div style={styles.contentWrapper}>
        {/* Streak Card */}
        <div style={styles.streakCard} className="scale-in">
          <div style={styles.streakLeft}>
            <div style={styles.streakIcon}>
              <IoFlame size={36} color="#FF6B35" />
            </div>
            <div>
              <div style={styles.streakNumber}>{streak || 0}</div>
              <div style={styles.streakLabel}>day streak</div>
            </div>
          </div>
          <div style={styles.streakRight}>Keep going!</div>
        </div>

        {/* Stats */}
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{groups.length}</div>
            <div style={styles.statLabel}>Groups</div>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <div style={styles.statValue}>{completedDecisions}</div>
            <div style={styles.statLabel}>Decisions</div>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <div style={styles.statValue}>{favorites.length}</div>
            <div style={styles.statLabel}>Favorites</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div style={styles.actionsGrid}>
            <button style={styles.primaryAction} onClick={() => navigate('/decision')}>
              <div style={styles.actionLabel}>Create Decision</div>
            </button>
            <button style={styles.secondaryAction} onClick={() => navigate('/join')}>
              <div style={styles.actionLabel}>Join with Code</div>
            </button>
          </div>
        </div>

        {/* Active Sessions - Sessions created by others that user can join */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Join Active Sessions</h3>
          {activeSessions.length > 0 ? (
            <div style={styles.groupsList}>
              {activeSessions.slice(0, 3).map((session) => {
                // Determine session stage and display
                let stage = 'Waiting';
                let navigatePath = '/session/waiting';
                let navigationState = {};
                
                if (session.stage === 'waiting' || !session.stage) {
                  stage = 'Waiting';
                  navigatePath = '/session/waiting';
                  // Ensure participants is an array
                  const participants = Array.isArray(session.participants) 
                    ? session.participants 
                    : [];
                  navigationState = {
                    sessionType: session.type || 'group',
                    sessionCode: session.code,
                    groupName: session.name,
                    members: participants,
                    sessionId: session.id,
                    isCreator: false, // User joining someone else's session
                  };
                } else if (session.stage === 'preferences') {
                  stage = 'Setting Preferences';
                  navigatePath = `/preferences/${session.id}`;
                } else if (session.stage === 'deciding') {
                  stage = 'Deciding';
                  navigatePath = `/preferences/${session.id}`;
                } else if (session.stage === 'result') {
                  stage = 'Results Ready';
                  navigatePath = `/result/${session.id}`;
                }
                
                const handleSessionClick = () => {
                  if (navigatePath.includes('waiting')) {
                    navigate(navigatePath, { state: navigationState });
                  } else {
                    navigate(navigatePath);
                  }
                };
                
                return (
                  <div key={session.id} style={styles.groupCard} onClick={handleSessionClick}>
                    <div style={styles.groupAvatar}>
                      {session.icon ? getIconComponent(session.icon) : <IoPeople size={20} color="#6366F1" />}
                    </div>
                    <div style={styles.groupInfo}>
                      <div style={styles.groupNameRow}>
                        <div style={styles.groupName}>{session.name}</div>
                        <div style={getSessionStageBadgeStyle(session.stage)}>
                          {stage}
                        </div>
                      </div>
                      <div style={styles.groupMembers}>
                        Started by: {session.creatorName || user?.name || 'You'}
                      </div>
                    </div>
                    <div style={styles.groupArrow}>→</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>👥</div>
              <div style={styles.emptyTitle}>No active sessions</div>
              <div style={styles.emptyText}>Start a new decision or join with a code</div>
              <button
                style={styles.emptyButton}
                onClick={() => navigate('/decision')}
              >
                Start Decision
              </button>
            </div>
          )}
        </div>        

        {/* Recommendations */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Recommended</h3>
          <div style={styles.restaurantsList}>
            {mockRecommendations.map((restaurant) => (
              <div key={restaurant.id} style={styles.restaurantCard} onClick={() => navigate('/explore')}>
                {/* Match Badge */}
                <div style={styles.matchBadge}>
                  {restaurant.match}%
                </div>

                <div style={styles.restaurantContent}>
                  <div style={styles.restaurantInfo}>
                    <div style={styles.restaurantNameRow}>
                      <div style={styles.restaurantName}>{restaurant.name}</div>
                      <div style={styles.restaurantRating}>
                        <IoStar size={14} color="#FBBF24" />
                        <span style={styles.ratingValue}>{restaurant.rating}</span>
                      </div>
                    </div>
                    
                    {/* Tagline */}
                    <div style={styles.tagline}>
                      {restaurant.tagline}
                    </div>

                    {/* Badges Row */}
                    <div style={styles.badgesRow}>
                      <span style={styles.cuisineBadge}>{restaurant.cuisine}</span>
                      <span style={getDietaryBadgeStyle(restaurant.dietary)}>
                        {restaurant.dietary === 'Both' ? 'Mixed' : restaurant.dietary}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{height: '100px'}}></div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav-container">
        <div style={styles.bottomNav}>
          <button style={styles.navBtnActive}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
            <span style={styles.navLabel}>Home</span>
          </button>
          <button style={styles.navBtn} onClick={() => navigate('/groups')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/>
            </svg>
            <span style={styles.navLabel}>Groups</span>
          </button>
          <button style={styles.navBtn} onClick={() => navigate('/explore')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span style={styles.navLabel}>Explore</span>
          </button>
          <button style={styles.navBtn} onClick={() => navigate('/settings')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v10M1 12h6m6 0h10"/>
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
    background: '#F5F7FA',
    position: 'relative',
    overflow: 'hidden',
  },
  gradientBg: {
    position: 'relative',
    height: '350px',
    background: 'linear-gradient(180deg, #3B82F6 0%, #60A5FA 28%, #93C5FD 50%, rgba(147, 197, 253, 0.5) 70%, rgba(245, 247, 250, 0.8) 88%, #F5F7FA 100%)',
    borderRadius: '0 0 50% 50% / 0 0 15% 15%',
    marginBottom: '-80px',
    zIndex: 0,
    pointerEvents: 'none',
  },
  header: {
    background: 'transparent',
    padding: '40px 0 12px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: 'none',
    position: 'absolute',
    top: 0,
    left: '20px',
    right: '20px',
    zIndex: 3,
  },
  greeting: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '4px',
    letterSpacing: '-0.5px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  headerSubtitle: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  notificationButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    flexShrink: 0,
    position: 'relative',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  notificationBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    background: '#EF4444',
    color: 'white',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '18px',
    textAlign: 'center',
    border: '2px solid white',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 100%)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    color: theme.colors.primary.main,
    fontSize: '20px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    flexShrink: 0,
  },
  contentWrapper: {
    padding: '0 20px',
    position: 'relative',
    zIndex: 2,
    marginTop: '-240px',
  },
  content: {
    padding: '0 0 16px 0',
    position: 'relative',
  },
  streakCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '18px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  streakLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  streakIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNumber: {
    fontSize: '28px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    lineHeight: 1,
  },
  streakLabel: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
    marginTop: '4px',
  },
  streakRight: {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  statsContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '18px 20px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: '24px',
  },
  statItem: {
    flex: 1,
    textAlign: 'center',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: '#D1D5DB',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: theme.colors.text.secondary,
  },
  section: {
    marginBottom: '24px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    margin: '0 0 14px 0',
    letterSpacing: '-0.5px',
  },
  badge: {
    background: theme.colors.primary.main,
    color: 'white',
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  primaryAction: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    border: 'none',
    borderRadius: '16px',
    padding: '18px 16px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.2s ease',
  },
  secondaryAction: {
    background: 'rgba(255, 255, 255, 0.95)',
    border: '2px solid #3B82F6',
    borderRadius: '16px',
    padding: '18px 16px',
    color: theme.colors.primary.main,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
  },
  actionLabel: {
    fontSize: '15px',
    fontWeight: '600',
  },
  sessionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sessionCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  sessionName: {
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '4px',
  },
  sessionMeta: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
  },
  sessionCode: {
    fontSize: '13px',
    fontWeight: '600',
    color: theme.colors.primary.main,
    fontFamily: 'monospace',
  },
  restaurantsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  restaurantCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '12px 16px',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  matchBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    color: 'white',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)',
    lineHeight: '1',
  },
  restaurantContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  restaurantName: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    letterSpacing: '-0.2px',
    lineHeight: '1.2',
  },
  badgesRow: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cuisineBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '6px',
    background: 'rgba(147, 197, 253, 0.2)',
    color: '#3B82F6',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    lineHeight: '1',
  },
  dietaryBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '6px',
    lineHeight: '1',
  },
  tagline: {
    fontSize: '12px',
    color: theme.colors.text.secondary,
    fontWeight: '500',
    lineHeight: '1.3',
    marginBottom: '10px',
  },
  restaurantMeta: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
  },
  restaurantRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    padding: '3px 7px',
    borderRadius: '6px',
    background: 'rgba(251, 191, 36, 0.15)',
    flexShrink: 0,
  },
  ratingValue: {
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontSize: '12px',
    lineHeight: '1',
  },
  groupsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  groupCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  groupAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    flexShrink: 0,
  },
  groupInfo: {
    flex: 1,
  },
  groupNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  groupName: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '6px',
    textTransform: 'capitalize',
  },
  groupMembers: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
  },
  groupArrow: {
    fontSize: '20px',
    color: theme.colors.text.secondary,
  },
  emptyState: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '32px 24px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  emptyButton: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
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

export default Home;
