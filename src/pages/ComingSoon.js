import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../styles/theme';

const ComingSoon = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const featureName = location.state?.featureName || 'This page';
  const description =
    location.state?.description ||
    'We’re still building this part of Savora. Check back soon!';

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
        <h2 style={styles.title}>{featureName}</h2>
        <div style={{ width: '40px' }} />
      </div>

      <div className="mobile-screen-content" style={styles.content}>
        <div style={styles.card}>
          <div style={styles.iconCircle}>🚧</div>
          <h3 style={styles.heading}>Coming Soon</h3>
          <p style={styles.text}>{description}</p>
          <button style={styles.primaryButton} onClick={() => navigate('/home')}>
            Go Back Home
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
    padding: '24px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '360px',
    background: 'white',
    borderRadius: '20px',
    padding: '32px 24px',
    textAlign: 'center',
    boxShadow: theme.shadows.md,
  },
  iconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: theme.colors.primary.gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    margin: '0 auto 16px auto',
  },
  heading: {
    fontSize: '20px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: '8px',
  },
  text: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    marginBottom: '24px',
    lineHeight: 1.5,
  },
  primaryButton: {
    width: '100%',
    background: theme.colors.primary.gradient,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: theme.shadows.sm,
  },
};

export default ComingSoon;


