import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';
import { IoArrowBack, IoChevronDown } from 'react-icons/io5';

const Preferences = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { preferences: userPrefs, updateSession, user, sessions } = useUser();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [dietary, setDietary] = useState([]);
  const [budget, setBudget] = useState(userPrefs?.budget || 'moderate');
  const [distance, setDistance] = useState(userPrefs?.distance || 3);
  const [selectedCuisines, setSelectedCuisines] = useState(userPrefs?.cuisines || []);
  const [adventureLevel, setAdventureLevel] = useState('balanced');
  const [currency] = useState(userPrefs?.currency || 'AED');
  const [distanceUnit] = useState(userPrefs?.distanceUnit || 'km');
  const [showBudgetMenu, setShowBudgetMenu] = useState(false);
  const budgetDropdownRef = useRef(null);

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Dairy-Free'];

  const budgetOptions = [
    { value: 'budget', label: 'Budget Friendly', range: '50-100 AED' },
    { value: 'moderate', label: 'Moderate', range: '100-250 AED' },
    { value: 'upscale', label: 'Upscale', range: '250-500 AED' },
    { value: 'luxury', label: 'Luxury', range: '500+ AED' },
  ];

  const cuisines = [
    { name: 'Italian', emoji: '🍝' },
    { name: 'Chinese', emoji: '🥡' },
    { name: 'Japanese', emoji: '🍣' },
    { name: 'Mexican', emoji: '🌮' },
    { name: 'Indian', emoji: '🍛' },
    { name: 'Thai', emoji: '🍜' },
    { name: 'American', emoji: '🍔' },
    { name: 'Korean', emoji: '🍲' },
    { name: 'Mediterranean', emoji: '🥙' },
    { name: 'French', emoji: '🥖' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (budgetDropdownRef.current && !budgetDropdownRef.current.contains(event.target)) {
        setShowBudgetMenu(false);
      }
    };

    if (showBudgetMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBudgetMenu]);

  const toggleDietary = (option) => {
    if (dietary.includes(option)) {
      setDietary(dietary.filter(d => d !== option));
    } else {
      setDietary([...dietary, option]);
    }
  };

  const toggleCuisine = (cuisine) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  const handleBudgetSelect = (value) => {
    setBudget(value);
    setShowBudgetMenu(false);
  };

  // Monitor session for all participants' submissions
  useEffect(() => {
    if (!sessionId || !user) return;

    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const participants = Array.isArray(session.participants) ? session.participants : [];

    // Check if all participants have submitted
    const allSubmitted = participants.every(p => p.hasSubmittedPreferences === true);

    // If all submitted and user has submitted, navigate to results
    if (allSubmitted && hasSubmitted) {
      navigate(`/result/${sessionId}`);
    }
  }, [sessions, sessionId, user, hasSubmitted, navigate]);

  const handleSubmit = () => {
    if (!sessionId || !user) return;

    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const participants = Array.isArray(session.participants) ? session.participants : [];

    // Mark current user as having submitted preferences
    const updatedParticipants = participants.map(p => {
      if (p.name === user.name || p.phone === user.phone) {
        return {
          ...p,
          hasSubmittedPreferences: true,
          preferences: {
            dietary,
            budget,
            distance,
            cuisines: selectedCuisines,
            adventureLevel,
            currency,
            distanceUnit,
          }
        };
      }
      return p;
    });

    // Check if all participants have submitted
    const allSubmitted = updatedParticipants.every(p => p.hasSubmittedPreferences === true);

    updateSession(sessionId, {
      participants: updatedParticipants,
      stage: allSubmitted ? 'result' : 'preferences',
      status: allSubmitted ? 'completed' : 'active',
    });

    setHasSubmitted(true);
  };

  // Get current session data for progress tracking
  const currentSession = sessions.find(s => s.id === sessionId);
  const participants = currentSession?.participants || [];
  const submittedCount = participants.filter(p => p.hasSubmittedPreferences).length;
  const totalCount = participants.length;

  // If user has submitted, show waiting screen
  if (hasSubmitted) {
    return (
      <div style={styles.container}>
        <div style={styles.waitingContainer}>
          <div style={styles.waitingContent}>
            <div style={styles.checkmarkCircle}>
              <div style={styles.checkmark}>✓</div>
            </div>
            <h2 style={styles.waitingTitle}>Preferences Submitted!</h2>
            <p style={styles.waitingSubtitle}>
              Waiting for others to submit their preferences...
            </p>

            {/* Progress Bar */}
            <div style={styles.progressSection}>
              <div style={styles.progressText}>
                {submittedCount} of {totalCount} submitted
              </div>
              <div style={styles.progressBarContainer}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${(submittedCount / totalCount) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Participant Status */}
            <div style={styles.participantsList}>
              {participants.map((participant, index) => (
                <div key={index} style={styles.participantItem}>
                  <div style={styles.participantAvatar}>
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.participantInfo}>
                    <div style={styles.participantName}>
                      {participant.name === user?.name ? 'You' : participant.name}
                    </div>
                    <div style={{
                      ...styles.participantStatus,
                      color: participant.hasSubmittedPreferences ? '#10B981' : '#F59E0B',
                    }}>
                      {participant.hasSubmittedPreferences ? '✓ Submitted' : 'Waiting...'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading Spinner */}
            <div style={styles.spinner}>
              <div style={styles.spinnerCircle} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <IoArrowBack size={24} color={theme.colors.text.primary} />
          </button>
          <h1 style={styles.mainTitle}>Set Your Preferences</h1>
        </div>
        <p style={styles.tagline}>We'll match you with restaurants you'll love</p>
      </div>

      <div style={styles.content}>

        {/* Dietary Restrictions */}
        <div style={styles.section}>
          <label style={styles.label}>Dietary Restrictions (Optional)</label>
          <div style={styles.pillContainer}>
            {dietaryOptions.map(option => (
              <button
                key={option}
                onClick={() => toggleDietary(option)}
                onMouseDown={(e) => e.preventDefault()}
                style={{
                  ...styles.dietaryPill,
                  ...(dietary.includes(option) ? styles.dietaryPillSelected : {}),
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Dropdown */}
        <div style={styles.section}>
          <label style={styles.label}>Budget</label>
          <div ref={budgetDropdownRef} style={styles.dropdownContainer}>
            <button
              type="button"
              onClick={() => setShowBudgetMenu(!showBudgetMenu)}
              onMouseDown={(e) => e.preventDefault()}
              style={styles.customDropdownButton}
            >
              <span style={styles.dropdownButtonText}>
                {budgetOptions.find(opt => opt.value === budget)?.label} ({budgetOptions.find(opt => opt.value === budget)?.range})
              </span>
              <IoChevronDown
                size={20}
                color={theme.colors.text.secondary}
                style={{
                  transform: showBudgetMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
            {showBudgetMenu && (
              <div style={styles.dropdownMenu}>
                {budgetOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleBudgetSelect(option.value)}
                    onMouseDown={(e) => e.preventDefault()}
                    style={{
                      ...styles.dropdownMenuItem,
                      background: budget === option.value ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                    }}
                  >
                    <span style={{
                      ...styles.dropdownMenuItemText,
                      fontWeight: budget === option.value ? '600' : '400',
                      color: budget === option.value ? theme.colors.primary.main : theme.colors.text.primary,
                    }}>
                      {option.label}
                    </span>
                    <span style={styles.dropdownMenuItemSubtext}>
                      {option.range}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Distance Slider */}
        <div style={styles.section}>
          <label style={styles.label}>
            Maximum Distance: {distance} {distanceUnit}
          </label>
          <input
            type="range"
            min="1"
            max="25"
            step="1"
            value={distance}
            onChange={(e) => setDistance(parseInt(e.target.value))}
            style={{
              ...styles.slider,
              background: `linear-gradient(to right, ${theme.colors.primary.main} 0%, ${theme.colors.primary.main} ${(distance / 25) * 100}%, #E5E7EB ${(distance / 25) * 100}%, #E5E7EB 100%)`,
            }}
          />
        </div>

        {/* Cuisine Types - Circular */}
        <div style={styles.section}>
          <label style={styles.label}>Cuisines</label>
          <div style={styles.cuisineScrollContainer} className="cuisine-scroll">
            {/* Row 1 */}
            <div style={styles.cuisineRow}>
              {cuisines.slice(0, 5).map(cuisine => (
                <div
                  key={cuisine.name}
                  onClick={() => toggleCuisine(cuisine.name)}
                  onMouseDown={(e) => e.preventDefault()}
                  style={styles.cuisineItem}
                >
                  <div style={{
                    ...styles.cuisineCircle,
                    ...(selectedCuisines.includes(cuisine.name) ? styles.cuisineCircleSelected : {}),
                  }}>
                    <span style={styles.cuisineEmoji}>{cuisine.emoji}</span>
                  </div>
                  <span style={styles.cuisineName}>{cuisine.name}</span>
                </div>
              ))}
            </div>
            {/* Row 2 */}
            <div style={styles.cuisineRow}>
              {cuisines.slice(5, 10).map(cuisine => (
                <div
                  key={cuisine.name}
                  onClick={() => toggleCuisine(cuisine.name)}
                  onMouseDown={(e) => e.preventDefault()}
                  style={styles.cuisineItem}
                >
                  <div style={{
                    ...styles.cuisineCircle,
                    ...(selectedCuisines.includes(cuisine.name) ? styles.cuisineCircleSelected : {}),
                  }}>
                    <span style={styles.cuisineEmoji}>{cuisine.emoji}</span>
                  </div>
                  <span style={styles.cuisineName}>{cuisine.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Adventure Level */}
        <div style={styles.section}>
          <label style={styles.label}>Adventure Level</label>
          <div style={styles.adventureContainer}>
            <button
              onClick={() => setAdventureLevel('new')}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                ...styles.adventureButton,
                ...(adventureLevel === 'new' ? styles.adventureButtonSelected : {}),
              }}
            >
              <div style={styles.adventureIcon}>🌟</div>
              <div style={styles.adventureText}>
                <div style={styles.adventureTitle}>Try Something New</div>
                <div style={styles.adventureSubtext}>Discover new places</div>
              </div>
            </button>
            <button
              onClick={() => setAdventureLevel('balanced')}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                ...styles.adventureButton,
                ...(adventureLevel === 'balanced' ? styles.adventureButtonSelected : {}),
              }}
            >
              <div style={styles.adventureIcon}>⚖️</div>
              <div style={styles.adventureText}>
                <div style={styles.adventureTitle}>Balanced</div>
                <div style={styles.adventureSubtext}>Mix of both</div>
              </div>
            </button>
            <button
              onClick={() => setAdventureLevel('favourites')}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                ...styles.adventureButton,
                ...(adventureLevel === 'favourites' ? styles.adventureButtonSelected : {}),
              }}
            >
              <div style={styles.adventureIcon}>❤️</div>
              <div style={styles.adventureText}>
                <div style={styles.adventureTitle}>Stick to Favourites</div>
                <div style={styles.adventureSubtext}>Tried and tested</div>
              </div>
            </button>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: '20px' }} />
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <button
          onClick={handleSubmit}
          onMouseDown={(e) => e.preventDefault()}
          style={styles.submitButton}
        >
          Submit Preferences
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
  // Waiting Screen Styles
  waitingContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  waitingContent: {
    textAlign: 'center',
    maxWidth: '320px',
  },
  checkmarkCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
  },
  checkmark: {
    fontSize: '40px',
    color: 'white',
    fontWeight: '700',
  },
  waitingTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '8px',
  },
  waitingSubtitle: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    marginBottom: '32px',
  },
  progressSection: {
    marginBottom: '32px',
  },
  progressText: {
    fontSize: '13px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: '12px',
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    background: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  participantsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px',
  },
  participantItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'white',
    padding: '12px 16px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  participantAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: theme.colors.primary.main,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
    flexShrink: 0,
  },
  participantInfo: {
    flex: 1,
    textAlign: 'left',
  },
  participantName: {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '2px',
  },
  participantStatus: {
    fontSize: '12px',
    fontWeight: '500',
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
  },
  spinnerCircle: {
    width: '40px',
    height: '40px',
    border: `4px solid ${theme.colors.border.light}`,
    borderTop: `4px solid ${theme.colors.primary.main}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    background: 'white',
    padding: '40px 20px 16px 20px',
    borderBottom: `1px solid ${theme.colors.border.light}`,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    margin: 0,
    lineHeight: '1.2',
  },
  tagline: {
    fontSize: '12px',
    fontWeight: '300',
    color: '#737B8B',
    margin: 0,
    paddingLeft: '32px',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  section: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '12px',
  },
  // Dietary Pills
  pillContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  dietaryPill: {
    padding: '10px 16px',
    borderRadius: '20px',
    border: 'none',
    background: '#F9FAFB',
    fontSize: '13px',
    fontWeight: '500',
    color: theme.colors.text.primary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
  },
  dietaryPillSelected: {
    background: theme.colors.primary.main,
    color: 'white',
    border: 'none',
  },
  // Custom Budget Dropdown
  dropdownContainer: {
    position: 'relative',
  },
  customDropdownButton: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    background: 'white',
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
  },
  dropdownButtonText: {
    fontSize: '14px',
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    overflow: 'hidden',
    border: `1px solid ${theme.colors.border.light}`,
  },
  dropdownMenuItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '12px 14px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
  },
  dropdownMenuItemText: {
    fontSize: '14px',
    marginBottom: '2px',
  },
  dropdownMenuItemSubtext: {
    fontSize: '12px',
    color: theme.colors.text.secondary,
  },
  // Distance Slider
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer',
    marginTop: '8px',
  },
  // Cuisine Circles - 2 Rows, Horizontally Scrollable
  cuisineScrollContainer: {
    overflowX: 'auto',
    overflowY: 'hidden',
    marginTop: '4px',
    marginLeft: '-20px',
    marginRight: '-20px',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingBottom: '12px',
    WebkitOverflowScrolling: 'touch',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  cuisineRow: {
    display: 'flex',
    gap: '16px',
    minWidth: 'min-content',
  },
  cuisineItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    flexShrink: 0,
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
  },
  cuisineCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    background: '#F9FAFB',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
  },
  cuisineCircleSelected: {
    background: 'white',
    border: `3px solid ${theme.colors.primary.main}`,
    boxShadow: `0 0 0 3px rgba(59, 130, 246, 0.1)`,
  },
  cuisineEmoji: {
    fontSize: '36px',
  },
  cuisineName: {
    fontSize: '12px',
    fontWeight: '500',
    color: theme.colors.text.primary,
    textAlign: 'center',
    width: '70px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  // Adventure Level
  adventureContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  adventureButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#F9FAFB',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
  },
  adventureButtonSelected: {
    background: 'white',
    border: `2px solid ${theme.colors.primary.main}`,
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  },
  adventureIcon: {
    fontSize: '32px',
    flexShrink: 0,
  },
  adventureText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  adventureTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  adventureSubtext: {
    fontSize: '12px',
    fontWeight: '400',
    color: theme.colors.text.secondary,
  },
  footer: {
    background: 'white',
    padding: '20px',
    borderTop: `1px solid ${theme.colors.border.light}`,
  },
  submitButton: {
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
};

export default Preferences;
