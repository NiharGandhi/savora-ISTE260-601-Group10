import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';

const ErrorStates = () => {
  const navigate = useNavigate();

  const errors = [
    {
      title: 'No Internet Connection',
      message: 'We can’t reach Savora right now. Check your connection and try again.',
      primaryAction: 'Retry',
      secondaryAction: 'Go Home',
      tone: 'warning',
    },
    {
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred while loading this page. Please try again in a moment.',
      primaryAction: 'Try Again',
      secondaryAction: 'Report Issue',
      tone: 'error',
    },
    {
      title: 'Location Permission Needed',
      message: 'To find great places nearby, allow location access in your browser settings.',
      primaryAction: 'Open Settings',
      secondaryAction: 'Not Now',
      tone: 'info',
    },
    {
      title: 'No Results Found',
      message: "We couldn't find any places that match your filters. Try widening your search.",
      primaryAction: 'Clear Filters',
      secondaryAction: 'Back to Explore',
      tone: 'neutral',
    },
    {
      title: 'Session Expired',
      message: 'Your decision session has expired. Start a new one to keep deciding together.',
      primaryAction: 'Start New Session',
      secondaryAction: 'Go Home',
      tone: 'info',
    },
    {
      title: 'Group Not Found',
      message: 'This group link may be broken or the group was deleted by its creator.',
      primaryAction: 'View My Groups',
      secondaryAction: 'Create New Group',
      tone: 'warning',
    },
    {
      title: 'Savora is Having a Moment',
      message: 'Our servers are a bit overwhelmed right now. Your data is safe — please try again shortly.',
      primaryAction: 'Retry',
      secondaryAction: 'Status Page',
      tone: 'error',
    },
  ];

  const getToneStyles = (tone) => {
    switch (tone) {
      case 'warning':
        return {
          badgeBg: 'rgba(245, 158, 11, 0.12)',
          badgeColor: '#92400E',
          icon: '⚠️',
        };
      case 'error':
        return {
          badgeBg: 'rgba(239, 68, 68, 0.12)',
          badgeColor: '#B91C1C',
          icon: '❌',
        };
      case 'info':
        return {
          badgeBg: 'rgba(59, 130, 246, 0.12)',
          badgeColor: '#1D4ED8',
          icon: 'ℹ️',
        };
      default:
        return {
          badgeBg: 'rgba(148, 163, 184, 0.12)',
          badgeColor: '#64748B',
          icon: '👀',
        };
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
        <h2 style={styles.title}>Error Messages</h2>
        <div style={{ width: '40px' }} />
      </div>

      <div className="mobile-screen-content" style={styles.content}>
        <p style={styles.intro}>
          Examples of how Savora can show different error and empty states in a friendly,
          helpful way.
        </p>

        <div style={styles.list}>
          {errors.map((error, index) => {
            const toneStyles = getToneStyles(error.tone);
            return (
              <div key={index} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={{ ...styles.iconBubble, background: toneStyles.badgeBg }}>
                    <span style={{ fontSize: 20 }}>{toneStyles.icon}</span>
                  </div>
                  <div style={styles.cardHeaderText}>
                    <div style={styles.cardTitle}>{error.title}</div>
                    <div
                      style={{
                        ...styles.badge,
                        background: toneStyles.badgeBg,
                        color: toneStyles.badgeColor,
                      }}
                    >
                      {error.tone === 'error'
                        ? 'Critical'
                        : error.tone === 'warning'
                        ? 'Action needed'
                        : error.tone === 'info'
                        ? 'Helpful hint'
                        : 'Empty state'}
                    </div>
                  </div>
                </div>
                <p style={styles.message}>{error.message}</p>
                <div style={styles.actionsRow}>
                  <button
                    style={styles.primaryButton}
                    type="button"
                  >
                    {error.primaryAction}
                  </button>
                  <button
                    style={styles.secondaryButton}
                    type="button"
                  >
                    {error.secondaryAction}
                  </button>
                </div>
              </div>
            );
          })}
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
  intro: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
    marginBottom: '16px',
    lineHeight: 1.5,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: theme.shadows.sm,
  },
  cardHeader: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '8px',
  },
  iconBubble: {
    width: '40px',
    height: '40px',
    borderRadius: '999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  badge: {
    alignSelf: 'flex-start',
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '999px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  message: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
    marginTop: '4px',
    marginBottom: '12px',
    lineHeight: 1.5,
  },
  actionsRow: {
    display: 'flex',
    gap: '8px',
  },
  primaryButton: {
    flex: 1,
    background: theme.colors.primary.gradient,
    color: 'white',
    border: 'none',
    borderRadius: '999px',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  secondaryButton: {
    flex: 1,
    background: 'white',
    color: theme.colors.text.primary,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '999px',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default ErrorStates;


