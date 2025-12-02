import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';
import { IoInformationCircle } from 'react-icons/io5';

const Onboarding = () => {
  const navigate = useNavigate();
  const { saveUser, savePreferences } = useUser();
  const dropdownRef = useRef(null);
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [dobError, setDobError] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('AE'); // Default to UAE
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [budgetRange, setBudgetRange] = useState(2); // 0-3 index for budget ranges
  const [distanceRange, setDistanceRange] = useState(2); // 0-3 index for distance ranges
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [showDobTooltip, setShowDobTooltip] = useState(false);

  // Budget ranges
  const budgetRanges = [
    { label: 'Less than 30 AED', value: '< 30', minValue: 0, maxValue: 30 },
    { label: '30-60 AED', value: '30-60', minValue: 30, maxValue: 60 },
    { label: '60-100 AED', value: '60-100', minValue: 60, maxValue: 100 },
    { label: 'Above 100 AED', value: '> 100', minValue: 100, maxValue: 500 },
  ];

  // Distance ranges
  const distanceRanges = [
    { label: 'Less than 2 km', value: '< 2 km', minValue: 0, maxValue: 2 },
    { label: '2-5 km', value: '2-5 km', minValue: 2, maxValue: 5 },
    { label: '5-10 km', value: '5-10 km', minValue: 5, maxValue: 10 },
    { label: 'Above 10 km', value: '> 10 km', minValue: 10, maxValue: 25 },
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

  const restrictions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
    'Nut Allergies', 'Halal', 'Kosher', 'Shellfish-Free',
    'Keto', 'Low-Carb', 'Paleo', 'None'
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryDropdownOpen]);

  // Phone country codes and validation rules
  const phoneCountries = {
    AE: { name: 'UAE', code: '+971', flag: '🇦🇪', minLength: 9, maxLength: 9, placeholder: '50 123 4567' },
    US: { name: 'USA', code: '+1', flag: '🇺🇸', minLength: 10, maxLength: 10, placeholder: '555 123 4567' },
    GB: { name: 'UK', code: '+44', flag: '🇬🇧', minLength: 10, maxLength: 10, placeholder: '7700 900123' },
    IN: { name: 'India', code: '+91', flag: '🇮🇳', minLength: 10, maxLength: 10, placeholder: '98765 43210' },
    CA: { name: 'Canada', code: '+1', flag: '🇨🇦', minLength: 10, maxLength: 10, placeholder: '555 123 4567' },
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // DOB validation (must be 13+ years old)
  const validateDob = (dateOfBirth) => {
    if (!dateOfBirth) return false;

    const age = calculateAge(dateOfBirth);
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    // Check if date is valid and not in the future
    if (birthDate > today) return false;

    // Check if user is at least 13 years old
    return age >= 13 && age <= 120;
  };

  // Phone validation based on selected country
  const validatePhone = (phone, country) => {
    if (phone === '') return true; // Phone is optional

    const countryInfo = phoneCountries[country];
    if (!countryInfo) return false;

    // Remove all spaces and non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');

    // Check if length matches country requirements
    return digitsOnly.length >= countryInfo.minLength &&
           digitsOnly.length <= countryInfo.maxLength;
  };

  const handleDobChange = (e) => {
    const value = e.target.value;
    setDob(value);
    if (value && !validateDob(value)) {
      const age = calculateAge(value);
      if (age < 13) {
        setDobError('You must be at least 13 years old');
      } else {
        setDobError('Please enter a valid date of birth');
      }
    } else {
      setDobError('');
    }
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
    if (value && !validatePhone(value, phoneCountry)) {
      const countryInfo = phoneCountries[phoneCountry];
      setPhoneError(`Please enter a valid ${countryInfo.name} phone number (${countryInfo.minLength} digits)`);
    } else {
      setPhoneError('');
    }
  };

  const handlePhoneCountryChange = (newCountry) => {
    setPhoneCountry(newCountry);
    setIsCountryDropdownOpen(false);
    // Revalidate phone number with new country
    if (phone && !validatePhone(phone, newCountry)) {
      const countryInfo = phoneCountries[newCountry];
      setPhoneError(`Please enter a valid ${countryInfo.name} phone number (${countryInfo.minLength} digits)`);
    } else {
      setPhoneError('');
    }
  };

  const toggleCountryDropdown = () => {
    setIsCountryDropdownOpen(!isCountryDropdownOpen);
  };

  const toggleCuisine = (cuisineName) => {
    if (selectedCuisines.includes(cuisineName)) {
      setSelectedCuisines(selectedCuisines.filter(c => c !== cuisineName));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisineName]);
    }
  };

  const toggleRestriction = (restriction) => {
    if (dietaryRestrictions.includes(restriction)) {
      setDietaryRestrictions(dietaryRestrictions.filter(r => r !== restriction));
    } else {
      setDietaryRestrictions([...dietaryRestrictions, restriction]);
    }
  };

  const handleNext = () => {
    if (step === 1 && name && dob && !dobError && validateDob(dob) && email && !emailError && validateEmail(email) && (!phone || validatePhone(phone, phoneCountry))) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleComplete = () => {
    // Format phone number with country code
    const fullPhone = phone ? `${phoneCountries[phoneCountry].code} ${phone}` : '';

    const userData = {
      id: Date.now().toString(),
      name,
      dob,
      age: calculateAge(dob),
      email,
      phone: fullPhone,
      phoneCountry,
      createdAt: new Date().toISOString(),
    };

    const preferences = {
      budgetRange: budgetRanges[budgetRange],
      distanceRange: distanceRanges[distanceRange],
      cuisines: selectedCuisines,
      dietaryRestrictions,
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
        {[1, 2, 3, 4].map((s) => (
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
                <div style={styles.labelWithIcon}>
                  <label style={styles.label}>Date of Birth (mm/dd/yyyy)</label>
                  <div
                    style={styles.infoIconContainer}
                    onMouseEnter={() => setShowDobTooltip(true)}
                    onMouseLeave={() => setShowDobTooltip(false)}
                    onClick={() => setShowDobTooltip(!showDobTooltip)}
                  >
                    <IoInformationCircle size={18} color={theme.colors.text.secondary} />
                    {showDobTooltip && (
                      <div style={styles.tooltip}>
                        <span style={styles.tooltipText}>
                          We collect your date of birth to ensure you meet restaurant age requirements.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <input
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                  style={{
                    ...styles.input,
                    borderColor: dobError ? theme.colors.error : theme.colors.border.medium,
                  }}
                  max={new Date().toISOString().split('T')[0]}
                />
                {dobError && <span style={styles.errorText}>{dobError}</span>}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="john@gmail.com"
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
                <div style={styles.phoneContainer}>
                  {/* Custom Country Dropdown */}
                  <div style={styles.customDropdownContainer} ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={toggleCountryDropdown}
                      style={styles.customDropdownButton}
                      className="custom-dropdown-button"
                    >
                      <span style={styles.dropdownSelected}>
                        <span style={styles.flagEmoji}>{phoneCountries[phoneCountry].flag}</span>
                        <span style={styles.countryCode}>{phoneCountries[phoneCountry].code}</span>
                      </span>
                      <span style={{
                        ...styles.dropdownArrow,
                        transform: isCountryDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}>▼</span>
                    </button>

                    {isCountryDropdownOpen && (
                      <div style={styles.customDropdownMenu} className="custom-dropdown-menu">
                        {Object.entries(phoneCountries).map(([code, info]) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => handlePhoneCountryChange(code)}
                            style={{
                              ...styles.customDropdownItem,
                              background: code === phoneCountry ? '#EFF6FF' : 'white',
                            }}
                            className="custom-dropdown-item"
                          >
                            <span style={styles.flagEmoji}>{info.flag}</span>
                            <span style={styles.countryCode}>{info.code}</span>
                            <span style={styles.countryName}>{info.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    type="tel"
                    placeholder={phoneCountries[phoneCountry].placeholder}
                    value={phone}
                    onChange={handlePhoneChange}
                    style={{
                      ...styles.phoneInput,
                      borderColor: phoneError ? theme.colors.error : theme.colors.border.medium,
                    }}
                  />
                </div>
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
                <label style={styles.label}>Budget Range</label>
                <div style={styles.segmentedControl}>
                  {budgetRanges.map((range, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setBudgetRange(index)}
                      style={{
                        ...styles.segmentButton,
                        background: budgetRange === index ? theme.colors.primary.main : 'white',
                        color: budgetRange === index ? 'white' : theme.colors.text.primary,
                        borderColor: budgetRange === index ? theme.colors.primary.main : theme.colors.border.medium,
                      }}
                    >
                      {range.value}
                    </button>
                  ))}
                </div>
                <div style={styles.rangeLabel}>
                  {budgetRanges[budgetRange].label}
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Distance Range</label>
                <div style={styles.segmentedControl}>
                  {distanceRanges.map((range, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setDistanceRange(index)}
                      style={{
                        ...styles.segmentButton,
                        background: distanceRange === index ? theme.colors.primary.main : 'white',
                        color: distanceRange === index ? 'white' : theme.colors.text.primary,
                        borderColor: distanceRange === index ? theme.colors.primary.main : theme.colors.border.medium,
                      }}
                    >
                      {range.value}
                    </button>
                  ))}
                </div>
                <div style={styles.rangeLabel}>
                  {distanceRanges[distanceRange].label}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in" style={styles.stepContainer}>
            <h2 style={styles.title}>Favorite Cuisines</h2>
            <p style={styles.subtitle}>Select all that you enjoy</p>

            <div style={styles.cuisineScrollContainer}>
              <div style={styles.cuisineRow}>
                {cuisines.slice(0, 5).map((cuisine) => (
                  <div
                    key={cuisine.name}
                    onClick={() => toggleCuisine(cuisine.name)}
                    style={styles.cuisineItem}
                  >
                    <div
                      style={{
                        ...styles.cuisineCircle,
                        ...(selectedCuisines.includes(cuisine.name) ? styles.cuisineCircleSelected : {}),
                      }}
                    >
                      <span style={styles.cuisineEmoji}>{cuisine.emoji}</span>
                    </div>
                    <span style={styles.cuisineName}>{cuisine.name}</span>
                  </div>
                ))}
              </div>
              <div style={styles.cuisineRow}>
                {cuisines.slice(5, 10).map((cuisine) => (
                  <div
                    key={cuisine.name}
                    onClick={() => toggleCuisine(cuisine.name)}
                    style={styles.cuisineItem}
                  >
                    <div
                      style={{
                        ...styles.cuisineCircle,
                        ...(selectedCuisines.includes(cuisine.name) ? styles.cuisineCircleSelected : {}),
                      }}
                    >
                      <span style={styles.cuisineEmoji}>{cuisine.emoji}</span>
                    </div>
                    <span style={styles.cuisineName}>{cuisine.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="fade-in" style={styles.stepContainer}>
            <h2 style={styles.title}>Dietary Restrictions</h2>
            <p style={styles.subtitle}>Help us accommodate your needs</p>

            <div style={styles.cuisineGrid}>
              {restrictions.map((restriction) => (
                <button
                  key={restriction}
                  onClick={() => toggleRestriction(restriction)}
                  style={{
                    ...styles.cuisineButton,
                    background: dietaryRestrictions.includes(restriction)
                      ? theme.colors.primary.main
                      : 'white',
                    color: dietaryRestrictions.includes(restriction)
                      ? 'white'
                      : theme.colors.text.primary,
                    border: `1px solid ${
                      dietaryRestrictions.includes(restriction)
                        ? theme.colors.primary.main
                        : theme.colors.border.medium
                    }`,
                  }}
                >
                  {restriction}
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
        {step < 4 ? (
          <button
            onClick={handleNext}
            style={{
              ...styles.nextButton,
              opacity: (step === 1 && (!name || !dob || !email || emailError || dobError || phoneError)) ? 0.5 : 1,
            }}
            disabled={step === 1 && (!name || !dob || !email || emailError || dobError || phoneError)}
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
  infoBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px 16px',
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: '10px',
    marginBottom: '24px',
  },
  infoIcon: {
    fontSize: '16px',
    lineHeight: '1.4',
    flexShrink: 0,
  },
  infoText: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
    lineHeight: '1.5',
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
  labelWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  infoIconContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '2px',
  },
  tooltip: {
    position: 'absolute',
    top: '28px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'white',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '10px',
    padding: '12px 14px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    minWidth: '280px',
    maxWidth: '320px',
    animation: 'fadeIn 0.2s ease',
  },
  tooltipText: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
    lineHeight: '1.5',
    display: 'block',
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
  phoneContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'stretch',
  },
  customDropdownContainer: {
    position: 'relative',
    minWidth: '140px',
  },
  customDropdownButton: {
    width: '100%',
    height: '100%',
    padding: '14px 12px',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '12px',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  dropdownSelected: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  flagEmoji: {
    fontSize: '16px',
    lineHeight: '1',
  },
  countryCode: {
    fontSize: '13px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  countryName: {
    fontSize: '13px',
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  dropdownArrow: {
    fontSize: '10px',
    color: theme.colors.text.secondary,
    transition: 'transform 0.2s ease',
  },
  customDropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    background: 'white',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    maxHeight: '200px',
    overflowY: 'auto',
    padding: '4px',
  },
  customDropdownItem: {
    width: '100%',
    padding: '8px 10px',
    border: 'none',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
    fontSize: '13px',
    textAlign: 'left',
  },
  phoneInput: {
    flex: 1,
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
  ageDisplay: {
    fontSize: '13px',
    color: theme.colors.primary.main,
    marginTop: '4px',
    fontWeight: '500',
  },
  segmentedControl: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginTop: '8px',
  },
  segmentButton: {
    padding: '12px 8px',
    border: '2px solid',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  rangeLabel: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    marginTop: '10px',
    textAlign: 'center',
    fontWeight: '500',
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
  cuisineScrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '8px',
  },
  cuisineRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'space-between',
  },
  cuisineItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    cursor: 'pointer',
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
  },
  cuisineCircleSelected: {
    background: 'white',
    border: `3px solid ${theme.colors.primary.main}`,
    boxShadow: `0 0 0 3px rgba(59, 130, 246, 0.1)`,
  },
  cuisineEmoji: {
    fontSize: '32px',
  },
  cuisineName: {
    fontSize: '13px',
    fontWeight: '500',
    color: theme.colors.text.primary,
    textAlign: 'center',
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
