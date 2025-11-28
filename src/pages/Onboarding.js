import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';

const Onboarding = () => {
  const navigate = useNavigate();
  const { saveUser, savePreferences } = useUser();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [budget, setBudget] = useState(250); // AED value
  const [distance, setDistance] = useState(3); // km value
  const [selectedCuisines, setSelectedCuisines] = useState([]);

  const cuisines = [
    'Italian', 'Chinese', 'Japanese', 'Mexican', 'Indian',
    'Thai', 'American', 'Korean', 'Mediterranean', 'French'
  ];

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation (supports various formats)
  const validatePhone = (phone) => {
    // eslint-disable-next-line
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phone === '' || phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    if (value && !validatePhone(value)) {
      setPhoneError('Please enter a valid phone number');
    } else {
      setPhoneError('');
    }
  };

  const toggleCuisine = (cuisine) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  const handleNext = () => {
    if (step === 1 && name && email && !emailError && validateEmail(email) && (!phone || validatePhone(phone))) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleComplete = () => {
    const userData = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      createdAt: new Date().toISOString(),
    };

    const preferences = {
      budget,
      distance,
      cuisines: selectedCuisines,
      currency: 'AED',
      distanceUnit: 'km',
    };

    saveUser(userData);
    savePreferences(preferences);
    navigate('/home');
  };

  return (
    <div style={styles.container}>
      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              ...styles.progressBar,
              background: s <= step ? theme.colors.primary.main : theme.colors.border.medium,
            }}
          />
        ))}
      </div>

      <div className="mobile-screen-content" style={styles.content}>
        {step === 1 && (
          <div className="fade-in" style={styles.stepContainer}>
            <h2 style={styles.title}>Welcome to Savora</h2>
            <p style={styles.subtitle}>Let's personalize your experience</p>

            <div style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="john@university.edu"
                  value={email}
                  onChange={handleEmailChange}
                  style={{
                    ...styles.input,
                    borderColor: emailError ? theme.colors.error : theme.colors.border.medium,
                  }}
                />
                {emailError && <span style={styles.errorText}>{emailError}</span>}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="+971 50 123 4567"
                  value={phone}
                  onChange={handlePhoneChange}
                  style={{
                    ...styles.input,
                    borderColor: phoneError ? theme.colors.error : theme.colors.border.medium,
                  }}
                />
                {phoneError && <span style={styles.errorText}>{phoneError}</span>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in" style={styles.stepContainer}>
            <h2 style={styles.title}>Dining Preferences</h2>
            <p style={styles.subtitle}>Help us find perfect matches</p>

            <div style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Budget Range: {budget} AED
                </label>
                <div style={styles.sliderContainer}>
                  <span style={styles.sliderLabel}>50 AED</span>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                    style={styles.slider}
                  />
                  <span style={styles.sliderLabel}>500 AED</span>
                </div>
                <div style={styles.budgetDescription}>
                  {budget < 100 && '💰 Budget-friendly'}
                  {budget >= 100 && budget < 200 && '💵 Moderate'}
                  {budget >= 200 && budget < 350 && '💸 Upscale'}
                  {budget >= 350 && '✨ Fine dining'}
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Maximum Distance: {distance} km
                </label>
                <div style={styles.sliderContainer}>
                  <span style={styles.sliderLabel}>1 km</span>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    step="1"
                    value={distance}
                    onChange={(e) => setDistance(parseInt(e.target.value))}
                    style={styles.slider}
                  />
                  <span style={styles.sliderLabel}>25 km</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in" style={styles.stepContainer}>
            <h2 style={styles.title}>Favorite Cuisines</h2>
            <p style={styles.subtitle}>Select all that you enjoy</p>

            <div style={styles.cuisineGrid}>
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => toggleCuisine(cuisine)}
                  style={{
                    ...styles.cuisineButton,
                    background: selectedCuisines.includes(cuisine)
                      ? theme.colors.primary.main
                      : 'white',
                    color: selectedCuisines.includes(cuisine)
                      ? 'white'
                      : theme.colors.text.primary,
                    border: `1px solid ${
                      selectedCuisines.includes(cuisine)
                        ? theme.colors.primary.main
                        : theme.colors.border.medium
                    }`,
                  }}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div style={styles.footer}>
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            style={styles.backButton}
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={handleNext}
            style={{
              ...styles.nextButton,
              opacity: (step === 1 && (!name || !email || emailError || phoneError)) ? 0.5 : 1,
            }}
            disabled={step === 1 && (!name || !email || emailError || phoneError)}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleComplete}
            style={styles.nextButton}
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: theme.colors.background.primary,
  },
  progressContainer: {
    display: 'flex',
    gap: '8px',
    padding: '40px 20px 16px 20px',
    background: theme.colors.background.secondary,
    borderBottom: `1px solid ${theme.colors.border.light}`,
  },
  progressBar: {
    flex: 1,
    height: '3px',
    borderRadius: '2px',
    transition: 'background 0.3s ease',
  },
  content: {
    padding: '24px 20px',
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '15px',
    color: theme.colors.text.secondary,
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    background: 'white',
    transition: 'all 0.2s ease',
  },
  errorText: {
    fontSize: '13px',
    color: theme.colors.error,
    marginTop: '4px',
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px',
  },
  sliderLabel: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
    minWidth: '60px',
    textAlign: 'center',
  },
  slider: {
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    background: `linear-gradient(to right, ${theme.colors.primary.main} 0%, ${theme.colors.primary.main} 50%, ${theme.colors.border.medium} 50%, ${theme.colors.border.medium} 100%)`,
    WebkitAppearance: 'none',
    appearance: 'none',
  },
  budgetDescription: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    marginTop: '8px',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
  },
  optionButton: {
    padding: '14px 8px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cuisineGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  cuisineButton: {
    padding: '16px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  footer: {
    padding: '16px 20px calc(16px + env(safe-area-inset-bottom))',
    display: 'flex',
    gap: '12px',
    background: theme.colors.background.secondary,
    borderTop: `1px solid ${theme.colors.border.light}`,
  },
  backButton: {
    flex: 1,
    background: 'white',
    color: theme.colors.text.primary,
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '12px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  nextButton: {
    flex: 2,
    background: theme.colors.primary.main,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
  },
};

export default Onboarding;
