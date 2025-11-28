import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';
import { IoHeart, IoHeartOutline, IoNavigate, IoRestaurant, IoCall, IoShareSocial } from 'react-icons/io5';

const Result = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { incrementStreak, addFavorite } = useUser();
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock data - in real app, this would come from backend
  const decisionTime = 3; // minutes
  const badgeType = "Today's Pick"; // or "Perfect Match", "Hidden Gem", etc.
  
  const restaurant = {
    id: 1,
    name: 'La Trattoria Moderna',
    cuisine: 'Italian',
    budget: 'Moderate',
    distance: '2.5 km',
    rating: 4.7,
    address: '123 Main Street, Downtown',
  };

  const groupConsensus = {
    percentage: 85,
    happyCount: 7,
    totalCount: 8,
  };

  const furtherSteps = [
    { 
      id: 1, 
      title: 'Get Directions', 
      description: 'Navigate to restaurant location',
      icon: IoNavigate, 
      color: '#3B82F6' 
    },
    { 
      id: 2, 
      title: 'View Menu', 
      description: 'Check out dishes and prices',
      icon: IoRestaurant, 
      color: '#10B981' 
    },
    { 
      id: 3, 
      title: 'Call Restaurant', 
      description: 'Make a reservation by phone',
      icon: IoCall, 
      color: '#F59E0B' 
    },
    { 
      id: 4, 
      title: 'Share Decision', 
      description: 'Send to friends and family',
      icon: IoShareSocial, 
      color: '#8B5CF6' 
    },
  ];

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    if (!isFavorited) {
      addFavorite(restaurant);
    }
  };

  const handleDone = () => {
    incrementStreak();
    navigate('/home');
  };

  const handleSeeMore = () => {
    navigate(`/additional-matches/${sessionId}`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerSection}>
        <h1 style={styles.mainHeading}>Decision Made</h1>
        <p style={styles.subHeading}>In just {decisionTime} minutes</p>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Main Restaurant Card */}
        <div style={styles.restaurantCard}>
          {/* Badge and Favorite */}
          <div style={styles.cardTopRow}>
            <div style={styles.badge}>{badgeType}</div>
            <button
              onClick={handleToggleFavorite}
              onMouseDown={(e) => e.preventDefault()}
              style={styles.favoriteButton}
            >
              {isFavorited ? (
                <IoHeart size={24} color="#EF4444" />
              ) : (
                <IoHeartOutline size={24} color={theme.colors.text.secondary} />
              )}
            </button>
          </div>

          {/* Restaurant Info */}
          <h2 style={styles.restaurantName}>{restaurant.name}</h2>
          <div style={styles.restaurantMeta}>
            <span>{restaurant.cuisine}</span>
            <span style={styles.separator}>|</span>
            <span>{restaurant.budget}</span>
            <span style={styles.separator}>|</span>
            <span>{restaurant.distance}</span>
          </div>

          {/* Group Consensus Card */}
          <div style={styles.consensusCard}>
            <h3 style={styles.consensusTitle}>Group Consensus</h3>
            
            {/* Progress Bar */}
            <div style={styles.progressContainer}>
              <div style={styles.progressTrack}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${groupConsensus.percentage}%`,
                  }}
                />
              </div>
              <span style={styles.progressLabel}>{groupConsensus.percentage}%</span>
            </div>

            {/* Happy Count */}
            <p style={styles.happyText}>
              {groupConsensus.happyCount} people are happy with this choice!
            </p>
          </div>
        </div>

        {/* Further Steps */}
        <div style={styles.furtherStepsSection}>
          <h3 style={styles.sectionTitle}>Further Steps</h3>
          <div style={styles.stepsContainer}>
            {furtherSteps.map((step) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onMouseDown={(e) => e.preventDefault()}
                  style={styles.stepCard}
                >
                  <div style={{...styles.stepIcon, background: `${step.color}15`}}>
                    <Icon size={24} color={step.color} />
                  </div>
                  <div style={styles.stepContent}>
                    <span style={styles.stepTitle}>{step.title}</span>
                    <span style={styles.stepDescription}>{step.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: '20px' }} />
      </div>

      {/* Footer Buttons */}
      <div style={styles.footer}>
        <button
          onClick={handleDone}
          onMouseDown={(e) => e.preventDefault()}
          style={styles.primaryButton}
        >
          Done
        </button>
        <button
          onClick={handleSeeMore}
          onMouseDown={(e) => e.preventDefault()}
          style={styles.secondaryButton}
        >
          See Additional Matches
        </button>
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
  headerSection: {
    background: 'white',
    padding: '40px 20px 24px 20px',
    textAlign: 'center',
    borderBottom: `1px solid ${theme.colors.border.light}`,
  },
  mainHeading: {
    fontSize: '28px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    margin: 0,
    marginBottom: '8px',
  },
  subHeading: {
    fontSize: '14px',
    fontWeight: '400',
    color: theme.colors.text.secondary,
    margin: 0,
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  restaurantCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  badge: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '20px',
    letterSpacing: '0.3px',
  },
  favoriteButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: '24px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    margin: 0,
    marginBottom: '8px',
  },
  restaurantMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: theme.colors.text.secondary,
    marginBottom: '20px',
  },
  separator: {
    color: theme.colors.border.light,
  },
  consensusCard: {
    background: '#F9FAFB',
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${theme.colors.border.light}`,
  },
  consensusTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    margin: 0,
    marginBottom: '12px',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  progressTrack: {
    flex: 1,
    height: '8px',
    background: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#10B981',
    minWidth: '40px',
  },
  happyText: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
    margin: 0,
  },
  furtherStepsSection: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    margin: 0,
    marginBottom: '12px',
  },
  stepsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  stepCard: {
    background: 'white',
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    textAlign: 'left',
  },
  stepIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  stepTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  stepDescription: {
    fontSize: '13px',
    fontWeight: '400',
    color: theme.colors.text.secondary,
  },
  footer: {
    background: 'white',
    padding: '20px',
    borderTop: `1px solid ${theme.colors.border.light}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  primaryButton: {
    width: '100%',
    padding: '16px',
    background: theme.colors.primary.main,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
  },
  secondaryButton: {
    width: '100%',
    padding: '16px',
    background: 'white',
    color: theme.colors.primary.main,
    border: `2px solid ${theme.colors.primary.main}`,
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
  },
};

export default Result;
