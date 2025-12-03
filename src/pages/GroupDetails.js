import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';
import { IoPeople, IoRestaurant, IoPizza, IoBeer, IoCafe, IoFastFood, IoWine, IoIceCream, IoNutrition, IoBriefcase, IoHome, IoArrowBack, IoCalendar, IoTime, IoCheckmarkCircle } from 'react-icons/io5';

const GroupDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { groups, sessions } = useUser();

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
    return React.createElement(iconObj.icon, { size: 28, color: iconObj.color });
  };

  const getIconColor = (iconId) => {
    const iconObj = iconMap[iconId] || iconMap['IoPeople'];
    return iconObj.color;
  };

  const group = groups.find(g => g.id === id);

  if (!group) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => navigate('/groups')} style={styles.backButton}>
            <IoArrowBack size={24} />
          </button>
          <h2 style={styles.title}>Group Not Found</h2>
          <div style={{ width: '40px' }}></div>
        </div>
        <div className="mobile-screen-content" style={styles.content}>
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>This group doesn't exist or has been deleted.</p>
            <button
              style={styles.backButtonLarge}
              onClick={() => navigate('/groups')}
            >
              Back to Groups
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get group sessions
  const groupSessions = sessions.filter(s => s.groupId === group.id);
  const activeSessions = groupSessions.filter(s => s.status === 'waiting' || s.status === 'active');
  const completedSessions = groupSessions.filter(s => s.status === 'completed');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/groups')} style={styles.backButton}>
          <IoArrowBack size={24} />
        </button>
        <h2 style={styles.title}>Group Details</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="mobile-screen-content" style={styles.content}>
        {/* Group Info Card */}
        <div style={styles.groupCard}>
          <div style={{
            ...styles.groupAvatar,
            background: `${getIconColor(group.photo)}15`,
          }}>
            {group.photo ? getIconComponent(group.photo) : <IoPeople size={28} color="#6366F1" />}
          </div>
          <div style={styles.groupInfo}>
            <h3 style={styles.groupName}>{group.name}</h3>
            <p style={styles.groupDescription}>
              {group.description || 'No description provided'}
            </p>
          </div>
        </div>

        {/* Members Section */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            Members ({group.members.length})
          </h4>
          <div style={styles.membersList}>
            {group.members.map((member, index) => (
              <div key={index} style={styles.memberCard}>
                <div style={styles.memberAvatar}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.memberInfo}>
                  <div style={styles.memberName}>{member.name}</div>
                  <div style={styles.memberEmail}>{member.email || member.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>
              Active Sessions ({activeSessions.length})
            </h4>
            <div style={styles.sessionsList}>
              {activeSessions.map((session) => (
                <div key={session.id} style={styles.sessionCard}>
                  <div style={styles.sessionHeader}>
                    <div style={styles.sessionTitle}>
                      {session.timing === 'later' && session.scheduledFor ? 'Scheduled Session' : 'Quick Decision'}
                    </div>
                    <div style={styles.sessionBadge}>
                      {session.status === 'waiting' ? 'Waiting' : 'Active'}
                    </div>
                  </div>

                  {session.timing === 'later' && session.scheduledFor && (
                    <div style={styles.sessionInfo}>
                      <IoCalendar size={16} color={theme.colors.text.secondary} />
                      <span style={styles.sessionInfoText}>
                        {new Date(session.scheduledFor).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}

                  <div style={styles.sessionInfo}>
                    <IoPeople size={16} color={theme.colors.text.secondary} />
                    <span style={styles.sessionInfoText}>
                      {session.participants.filter(p => p.submitted).length}/{session.participants.length} submitted
                    </span>
                  </div>

                  <button
                    style={styles.viewSessionButton}
                    onClick={() => navigate(`/session/waiting?sessionId=${session.id}`)}
                  >
                    View Session
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Decisions */}
        {completedSessions.length > 0 && (
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>
              Recent Decisions ({completedSessions.slice(0, 5).length})
            </h4>
            <div style={styles.sessionsList}>
              {completedSessions.slice(0, 5).map((session) => (
                <div key={session.id} style={styles.completedSessionCard}>
                  <div style={styles.completedSessionHeader}>
                    <div style={styles.completedIconContainer}>
                      <IoCheckmarkCircle size={24} color="#10B981" />
                    </div>
                    <div style={styles.completedSessionInfo}>
                      <div style={styles.completedSessionTitle}>
                        {session.result?.name || 'Decision Complete'}
                      </div>
                      <div style={styles.completedSessionTime}>
                        {formatDate(session.completedAt || session.createdAt)}
                      </div>
                    </div>
                  </div>
                  {session.result && (
                    <button
                      style={styles.viewResultButton}
                      onClick={() => navigate(`/result/${session.id}`)}
                    >
                      View Result
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Start New Session Button */}
        <button
          style={styles.newSessionButton}
          onClick={() => navigate('/decision', { state: { preselectedGroup: group.id } })}
        >
          Start New Decision
        </button>

        <div style={{ height: '20px' }}></div>
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
    padding: '40px 20px 16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #E5E7EB',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    margin: 0,
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    color: theme.colors.text.primary,
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: '16px',
  },
  groupCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: theme.shadows.sm,
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  groupAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: '22px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    margin: '0 0 8px 0',
  },
  groupDescription: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    margin: 0,
    lineHeight: '1.5',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    margin: '0 0 12px 0',
  },
  membersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  memberCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: theme.shadows.sm,
  },
  memberAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: theme.colors.primary.gradient,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    flexShrink: 0,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '2px',
  },
  memberEmail: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
  },
  sessionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sessionCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: theme.shadows.sm,
  },
  sessionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  sessionTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  sessionBadge: {
    background: 'rgba(59, 130, 246, 0.15)',
    color: '#3B82F6',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  sessionInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  sessionInfoText: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
  },
  viewSessionButton: {
    width: '100%',
    background: theme.colors.primary.blueGradient,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  completedSessionCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '14px 16px',
    boxShadow: theme.shadows.sm,
  },
  completedSessionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  completedIconContainer: {
    flexShrink: 0,
  },
  completedSessionInfo: {
    flex: 1,
  },
  completedSessionTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '2px',
  },
  completedSessionTime: {
    fontSize: '12px',
    color: theme.colors.text.secondary,
  },
  viewResultButton: {
    width: '100%',
    background: 'transparent',
    color: theme.colors.primary.main,
    border: `1px solid ${theme.colors.primary.main}`,
    borderRadius: '10px',
    padding: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  newSessionButton: {
    width: '100%',
    background: theme.colors.primary.gradient,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: theme.shadows.md,
    marginTop: '8px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
  },
  emptyText: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    marginBottom: '24px',
  },
  backButtonLarge: {
    background: theme.colors.primary.blueGradient,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: theme.shadows.md,
  },
};

export default GroupDetails;
