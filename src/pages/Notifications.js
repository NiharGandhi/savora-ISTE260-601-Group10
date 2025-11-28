import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';
import { IoArrowBack, IoCheckmark, IoClose, IoPeople, IoFlash, IoTimeOutline } from 'react-icons/io5';

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, acceptInvitation, declineInvitation } = useUser();
  const [processingId, setProcessingId] = useState(null);

  const handleAccept = (notification) => {
    setProcessingId(notification.id);
    acceptInvitation(notification.id);
    
    // Navigate based on notification type
    setTimeout(() => {
      if (notification.type === 'group_invite') {
        // Navigate to groups page after accepting group invitation
        navigate('/groups');
      } else if (notification.type === 'session_invite') {
        // Navigate to the session waiting room
        navigate('/session/waiting', {
          state: {
            sessionType: notification.sessionType,
            sessionCode: notification.sessionCode,
            groupName: notification.sessionName,
            members: notification.members || [],
            sessionId: notification.sessionId,
            isCreator: false, // User was invited, not the creator
          }
        });
      }
    }, 500);
  };

  const handleDecline = (notificationId) => {
    setProcessingId(notificationId);
    setTimeout(() => {
      declineInvitation(notificationId);
      setProcessingId(null);
    }, 300);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <IoArrowBack size={24} color={theme.colors.text.primary} />
          </button>
          <h1 style={styles.mainTitle}>Notifications</h1>
          {unreadCount > 0 && (
            <span style={styles.unreadBadge}>{unreadCount}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {notifications.length > 0 ? (
          <div style={styles.notificationsList}>
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                style={{
                  ...styles.notificationCard,
                  opacity: processingId === notification.id ? 0.5 : 1,
                  ...(notification.read ? {} : styles.unreadCard),
                }}
              >
                <div style={styles.notificationIcon}>
                  {notification.sessionType === 'quick' ? (
                    <IoFlash size={24} color="#3B82F6" />
                  ) : (
                    <IoPeople size={24} color="#6366F1" />
                  )}
                </div>
                
                <div style={styles.notificationContent}>
                  <div style={styles.notificationHeader}>
                    <span style={styles.notificationTitle}>
                      {notification.type === 'session_invite' ? 'Session Invitation' : 'Group Invitation'}
                    </span>
                    <span style={styles.notificationTime}>
                      <IoTimeOutline size={14} />
                      {getTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                  
                  <p style={styles.notificationMessage}>
                    <span style={styles.inviterName}>{notification.inviterName}</span>
                    {' '}invited you to join{' '}
                    <span style={styles.sessionName}>
                      "{notification.type === 'group_invite' ? notification.groupName : notification.sessionName}"
                    </span>
                  </p>
                  
                  <div style={styles.notificationMeta}>
                    {notification.type === 'session_invite' && notification.sessionCode && (
                      <span style={styles.metaItem}>
                        Code: <strong>{notification.sessionCode}</strong>
                      </span>
                    )}
                    {notification.participantCount && (
                      <span style={styles.metaItem}>
                        {notification.participantCount} {notification.type === 'group_invite' ? 'members' : 'participants'}
                      </span>
                    )}
                  </div>

                  {notification.status === 'pending' && (
                    <div style={styles.actionsRow}>
                      <button
                        onClick={() => handleAccept(notification)}
                        onMouseDown={(e) => e.preventDefault()}
                        style={styles.acceptButton}
                        disabled={processingId === notification.id}
                      >
                        <IoCheckmark size={18} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(notification.id)}
                        onMouseDown={(e) => e.preventDefault()}
                        style={styles.declineButton}
                        disabled={processingId === notification.id}
                      >
                        <IoClose size={18} />
                        Decline
                      </button>
                    </div>
                  )}

                  {notification.status === 'accepted' && (
                    <div style={styles.statusBadge}>
                      <IoCheckmark size={14} />
                      Accepted
                    </div>
                  )}

                  {notification.status === 'declined' && (
                    <div style={{...styles.statusBadge, ...styles.declinedBadge}}>
                      <IoClose size={14} />
                      Declined
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔔</div>
            <div style={styles.emptyTitle}>No notifications</div>
            <div style={styles.emptyText}>
              You'll be notified when someone invites you to a session
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#F5F7FA',
    overflow: 'hidden',
  },
  header: {
    background: 'white',
    padding: '40px 20px 16px 20px',
    borderBottom: `1px solid ${theme.colors.border.light}`,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  mainTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    margin: 0,
    lineHeight: '1.2',
    flex: 1,
  },
  unreadBadge: {
    background: '#EF4444',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '12px',
    minWidth: '20px',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  notificationCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    gap: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
  },
  unreadCard: {
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
    border: `1px solid rgba(59, 130, 246, 0.2)`,
  },
  notificationIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(59, 130, 246, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notificationContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  notificationTime: {
    fontSize: '11px',
    color: theme.colors.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  notificationMessage: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    margin: 0,
    lineHeight: '1.4',
  },
  inviterName: {
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  sessionName: {
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
  notificationMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: theme.colors.text.secondary,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  actionsRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '4px',
  },
  acceptButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: theme.colors.primary.main,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  declineButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: 'white',
    color: theme.colors.text.secondary,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(34, 197, 94, 0.1)',
    color: '#22C55E',
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 10px',
    borderRadius: '8px',
    alignSelf: 'flex-start',
  },
  declinedBadge: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#EF4444',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    opacity: 0.5,
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
    lineHeight: '1.5',
  },
};

export default Notifications;

