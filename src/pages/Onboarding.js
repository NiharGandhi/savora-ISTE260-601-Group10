import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';
import { IoInformationCircle, IoCalendarOutline, IoChevronBack, IoChevronForward, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [budgetRange, setBudgetRange] = useState(2); // 0-3 index for budget ranges
  const [distanceRange, setDistanceRange] = useState(2); // 0-3 index for distance ranges
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [showDobTooltip, setShowDobTooltip] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarView, setCalendarView] = useState('calendar'); // 'calendar', 'month', 'year'
  const [calendarMonth, setCalendarMonth] = useState(() => {
    // Initialize to 20 years ago (reasonable default for DOB)
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 20);
    return defaultDate.getMonth();
  });
  const [calendarYear, setCalendarYear] = useState(() => {
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 20);
    return defaultDate.getFullYear();
  });
  const calendarRef = useRef(null);

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
    { name: 'Greek', emoji: '🥗' },
    { name: 'Vietnamese', emoji: '🍲' },
    { name: 'Spanish', emoji: '🥘' },
    { name: 'Turkish', emoji: '🥙' },
    { name: 'Lebanese', emoji: '🧆' },
    { name: 'Brazilian', emoji: '🥩' },
    { name: 'Ethiopian', emoji: '🫓' },
    { name: 'Middle Eastern', emoji: '🍢' },
    { name: 'Caribbean', emoji: '🍗' },
    { name: 'British', emoji: '🫖' },
    { name: 'German', emoji: '🥨' },
    { name: 'Moroccan', emoji: '🍲' },
    { name: 'Peruvian', emoji: '🌶️' },
    { name: 'Filipino', emoji: '🍚' },
    { name: 'Indonesian', emoji: '🍛' },
    { name: 'Malaysian', emoji: '🍜' },
    { name: 'Singaporean', emoji: '🦐' },
    { name: 'Pakistani', emoji: '🍛' },
    { name: 'African', emoji: '🍲' },
    { name: 'Fusion', emoji: '🌟' },
    { name: 'Seafood', emoji: '🦞' },
    { name: 'BBQ', emoji: '🍖' },
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Sushi', emoji: '🍱' },
    { name: 'Steakhouse', emoji: '🥩' },
    { name: 'Street Food', emoji: '🌭' },
    { name: 'Cafe', emoji: '☕' },
    { name: 'Bakery', emoji: '🥐' },
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
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (isCountryDropdownOpen || showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryDropdownOpen, showCalendar]);

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

  // Calendar utility functions
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  };

  const formatDateForISO = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCalendarDateSelect = (day) => {
    const selectedDate = new Date(calendarYear, calendarMonth, day);
    const isoDate = formatDateForISO(selectedDate);
    
    setDob(isoDate);
    setShowCalendar(false);
    
    // Validate the selected date
    if (!validateDob(isoDate)) {
      const age = calculateAge(isoDate);
      if (age < 13) {
        setDobError('You must be at least 13 years old');
      } else {
        setDobError('Please enter a valid date of birth');
      }
    } else {
      setDobError('');
    }
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const isDateDisabled = (day) => {
    const date = new Date(calendarYear, calendarMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    // Disable future dates
    if (date > today) return true;
    
    // Disable dates that would make user less than 13 years old
    const age = calculateAge(formatDateForISO(date));
    if (age < 13 || age > 120) return true;
    
    return false;
  };

  const isDateSelected = (day) => {
    if (!dob) return false;
    const selectedDate = new Date(dob);
    return selectedDate.getDate() === day &&
           selectedDate.getMonth() === calendarMonth &&
           selectedDate.getFullYear() === calendarYear;
  };

  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };

  const getMonthNames = () => {
    return [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  };

  const getYearRange = () => {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 120; // Allow up to 120 years old
    const maxYear = currentYear;
    const years = [];
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year);
    }
    return years;
  };

  const handleMonthSelect = (month) => {
    setCalendarMonth(month);
    setCalendarView('calendar');
  };

  const handleYearSelect = (year) => {
    setCalendarYear(year);
    setCalendarView('month');
  };

  const openYearPicker = () => {
    setCalendarView('year');
  };

  const openMonthPicker = () => {
    setCalendarView('month');
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

  // Password validation (minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 symbol)
  const validatePassword = (pwd) => {
    if (pwd.length < 8) return false;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
    return hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
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

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value && !validatePassword(value)) {
      setPasswordError('Password must be at least 8 characters with uppercase, lowercase, number, and symbol');
    } else {
      setPasswordError('');
    }
    // Revalidate confirm password if it's already filled
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value && value !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
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
    if (step === 1 && name && dob && !dobError && validateDob(dob) && email && !emailError && validateEmail(email) && (!phone || validatePhone(phone, phoneCountry)) && password && !passwordError && validatePassword(password) && confirmPassword && !confirmPasswordError && password === confirmPassword) {
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
      password, // Store password (in production, this should be hashed)
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
                <div style={styles.datePickerContainer} ref={calendarRef}>
                  <div
                    onClick={() => {
                      setShowCalendar(!showCalendar);
                      setCalendarView('calendar');
                      // Sync calendar view with selected date if exists
                      if (dob) {
                        const selectedDate = new Date(dob);
                        setCalendarMonth(selectedDate.getMonth());
                        setCalendarYear(selectedDate.getFullYear());
                      }
                    }}
                    className="date-picker-input"
                  style={{
                      ...styles.datePickerInput,
                    borderColor: dobError ? theme.colors.error : theme.colors.border.medium,
                  }}
                  >
                    <span style={{
                      ...styles.datePickerValue,
                      color: dob ? theme.colors.text.primary : theme.colors.text.tertiary,
                    }}>
                      {dob ? formatDateForInput(dob) : 'Select date'}
                    </span>
                    <IoCalendarOutline size={20} color={theme.colors.text.secondary} />
                  </div>
                  
                  {showCalendar && (
                    <div style={styles.calendarDropdown}>
                      {calendarView === 'calendar' && (
                        <>
                          {/* Calendar Header */}
                          <div style={styles.calendarHeader}>
                            <button
                              type="button"
                              onClick={handlePrevMonth}
                              className="calendar-nav-button"
                              style={styles.calendarNavButton}
                            >
                              <IoChevronBack size={20} />
                            </button>
                            <div 
                              onClick={openMonthPicker}
                              className="calendar-month-year-clickable"
                              style={styles.calendarMonthYearClickable}
                            >
                              {getMonthName(calendarMonth)} {calendarYear}
                            </div>
                            <button
                              type="button"
                              onClick={handleNextMonth}
                              className="calendar-nav-button"
                              style={styles.calendarNavButton}
                            >
                              <IoChevronForward size={20} />
                            </button>
                          </div>
                          
                          {/* Calendar Days Grid */}
                          <div style={styles.calendarWeekdays}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                              <div key={day} style={styles.calendarWeekday}>{day}</div>
                            ))}
                          </div>
                          
                          <div style={styles.calendarDays}>
                            {Array.from({ length: getFirstDayOfMonth(calendarMonth, calendarYear) }, (_, i) => (
                              <div key={`empty-${i}`} style={styles.calendarDayEmpty} />
                            ))}
                            {Array.from({ length: getDaysInMonth(calendarMonth, calendarYear) }, (_, i) => {
                              const day = i + 1;
                              const disabled = isDateDisabled(day);
                              const selected = isDateSelected(day);
                              
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => !disabled && handleCalendarDateSelect(day)}
                                  disabled={disabled}
                                  className={!disabled ? "calendar-day-button" : ""}
                                  style={{
                                    ...styles.calendarDay,
                                    ...(disabled ? styles.calendarDayDisabled : {}),
                                    ...(selected ? styles.calendarDaySelected : {}),
                                  }}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}

                      {calendarView === 'month' && (
                        <>
                          {/* Month Picker Header */}
                          <div style={styles.calendarHeader}>
                            <button
                              type="button"
                              onClick={openYearPicker}
                              className="calendar-nav-button"
                              style={styles.calendarNavButton}
                            >
                              <IoChevronBack size={20} />
                            </button>
                            <div 
                              onClick={openYearPicker}
                              className="calendar-month-year-clickable"
                              style={styles.calendarMonthYearClickable}
                            >
                              {calendarYear}
                            </div>
                            <div style={styles.calendarNavButton}></div>
                          </div>
                          
                          {/* Month Grid */}
                          <div style={styles.monthYearGrid}>
                            {getMonthNames().map((monthName, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleMonthSelect(index)}
                                className="month-year-button"
                                style={{
                                  ...styles.monthYearButton,
                                  ...(calendarMonth === index ? styles.monthYearButtonSelected : {}),
                                }}
                              >
                                {monthName}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {calendarView === 'year' && (
                        <>
                          {/* Year Picker Header */}
                          <div style={styles.calendarHeader}>
                            <div style={styles.calendarNavButton}></div>
                            <div style={styles.calendarMonthYear}>
                              Select Year
                            </div>
                            <div style={styles.calendarNavButton}></div>
                          </div>
                          
                          {/* Year List */}
                          <div className="year-list-container" style={styles.yearListContainer}>
                            {getYearRange().map((year) => (
                              <button
                                key={year}
                                type="button"
                                onClick={() => handleYearSelect(year)}
                                className="year-button"
                                style={{
                                  ...styles.yearButton,
                                  ...(calendarYear === year ? styles.monthYearButtonSelected : {}),
                                }}
                              >
                                {year}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
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

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.passwordContainer}>
                <input
                    type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  style={{
                      ...styles.passwordInput,
                    borderColor: passwordError ? theme.colors.error : theme.colors.border.medium,
                  }}
                />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-button"
                    style={styles.passwordToggle}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <IoEyeOffOutline size={20} color={theme.colors.text.secondary} />
                    ) : (
                      <IoEyeOutline size={20} color={theme.colors.text.secondary} />
                    )}
                  </button>
                </div>
                {passwordError && <span style={styles.errorText}>{passwordError}</span>}
                {!passwordError && password && (
                  <span style={styles.successText}>Password is strong</span>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.passwordContainer}>
                <input
                    type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  style={{
                      ...styles.passwordInput,
                    borderColor: confirmPasswordError ? theme.colors.error : theme.colors.border.medium,
                  }}
                />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle-button"
                    style={styles.passwordToggle}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <IoEyeOffOutline size={20} color={theme.colors.text.secondary} />
                    ) : (
                      <IoEyeOutline size={20} color={theme.colors.text.secondary} />
                    )}
                  </button>
                </div>
                {confirmPasswordError && <span style={styles.errorText}>{confirmPasswordError}</span>}
                {!confirmPasswordError && confirmPassword && password === confirmPassword && (
                  <span style={styles.successText}>Passwords match</span>
                )}
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
            <p style={{ ...styles.subtitle, marginBottom: '16px' }}>Select all that you enjoy</p>

            <div className="cuisine-grid-scroll" style={styles.cuisineGridContainer}>
              {cuisines.map((cuisine, index) => (
                <div
                  key={cuisine.name}
                  onClick={() => toggleCuisine(cuisine.name)}
                  className="cuisine-item-hint"
                  style={{
                    ...styles.cuisineGridItem,
                    animationDelay: `${0.5 + index * 0.08}s`,
                  }}
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
              opacity: (step === 1 && (!name || !dob || !email || emailError || dobError || phoneError || !password || !confirmPassword || passwordError || confirmPasswordError || password !== confirmPassword)) ? 0.5 : 1,
            }}
            disabled={step === 1 && (!name || !dob || !email || emailError || dobError || phoneError || !password || !confirmPassword || passwordError || confirmPasswordError || password !== confirmPassword)}
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
    padding: '32px 16px 12px 16px',
    background: theme.colors.background.secondary,
    borderBottom: `1px solid ${theme.colors.border.light}`,
    flexShrink: 0,
  },
  progressBar: {
    flex: 1,
    height: '3px',
    borderRadius: '2px',
    transition: 'background 0.3s ease',
  },
  content: {
    flex: 1,
    padding: '20px 16px',
    overflowY: 'auto',
    overflowX: 'hidden',
    minHeight: 0,
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '6px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '15px',
    color: theme.colors.text.secondary,
    marginBottom: '24px',
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
    gap: '20px',
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
  passwordContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  passwordInput: {
    width: '100%',
    padding: '14px 48px 14px 16px',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    background: 'white',
    transition: 'all 0.2s ease',
  },
  passwordToggle: {
    position: 'absolute',
    right: '12px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  },
  errorText: {
    fontSize: '13px',
    color: theme.colors.error,
    marginTop: '4px',
  },
  successText: {
    fontSize: '13px',
    color: '#10B981',
    marginTop: '4px',
    fontWeight: '500',
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
  cuisineGridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    padding: '16px 12px',
    background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
    borderRadius: '16px',
    border: '2px dashed #D1D5DB',
    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.05)',
    marginTop: '8px',
    maxHeight: 'calc(100vh - 280px)',
    overflowY: 'auto',
    overflowX: 'hidden',
    width: '100%',
    boxSizing: 'border-box',
  },
  cuisineGridItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    minWidth: 0,
  },
  scrollWrapper: {
    position: 'relative',
    marginTop: '8px',
  },
  cuisineScrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px 16px',
    background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
    borderRadius: '16px',
    border: '2px dashed #D1D5DB',
    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.05)',
    overflowX: 'hidden',
  },
  cuisineRowScrollable: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollSnapType: 'x mandatory',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: '8px',
  },
  scrollHint: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '12px',
    padding: '8px',
    background: '#EFF6FF',
    borderRadius: '10px',
    border: '1px solid #BFDBFE',
  },
  scrollHintText: {
    fontSize: '13px',
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  scrollArrow: {
    fontSize: '14px',
    color: theme.colors.primary.main,
    animation: 'bounce 2s infinite',
  },
  scrollArrowHorizontal: {
    fontSize: '14px',
    color: theme.colors.primary.main,
    animation: 'slideHorizontal 2s infinite',
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
    minWidth: '85px',
    flexShrink: 0,
    cursor: 'pointer',
    scrollSnapAlign: 'start',
  },
  cuisineCircle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#F9FAFB',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
  cuisineCircleSelected: {
    background: 'white',
    border: `2px solid ${theme.colors.primary.main}`,
    boxShadow: `0 0 0 2px rgba(59, 130, 246, 0.1)`,
  },
  cuisineEmoji: {
    fontSize: '28px',
    lineHeight: '1',
  },
  cuisineName: {
    fontSize: '11px',
    fontWeight: '500',
    color: theme.colors.text.primary,
    textAlign: 'center',
    lineHeight: '1.2',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    maxWidth: '100%',
  },
  footer: {
    padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
    display: 'flex',
    gap: '10px',
    background: theme.colors.background.secondary,
    borderTop: `1px solid ${theme.colors.border.light}`,
    flexShrink: 0,
  },
  backButton: {
    flex: 1,
    background: 'white',
    color: theme.colors.text.primary,
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '12px',
    padding: '12px',
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
    padding: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
  },
  datePickerContainer: {
    position: 'relative',
    width: '100%',
  },
  datePickerInput: {
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    background: 'white',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  datePickerValue: {
    color: theme.colors.text.primary,
    fontSize: '15px',
  },
  calendarDropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    background: 'white',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    zIndex: 1000,
    padding: '16px',
    width: '100%',
    maxHeight: 'calc(100vh - 200px)',
    animation: 'fadeIn 0.2s ease',
    overflowY: 'auto',
  },
  calendarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  calendarNavButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '8px',
    color: theme.colors.text.primary,
    transition: 'all 0.2s ease',
  },
  calendarMonthYear: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  calendarWeekdays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    marginBottom: '8px',
  },
  calendarWeekday: {
    fontSize: '12px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
    textAlign: 'center',
    padding: '8px 4px',
  },
  calendarDays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  },
  calendarDayEmpty: {
    height: '40px',
  },
  calendarDay: {
    height: '40px',
    border: 'none',
    background: 'transparent',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: theme.colors.text.primary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayDisabled: {
    color: theme.colors.text.tertiary,
    cursor: 'not-allowed',
    opacity: 0.4,
  },
  calendarDaySelected: {
    background: theme.colors.primary.main,
    color: 'white',
    fontWeight: '600',
  },
  calendarMonthYearClickable: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  monthYearGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  monthYearButton: {
    padding: '12px 8px',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: theme.colors.text.primary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'white',
    textAlign: 'center',
  },
  monthYearButtonSelected: {
    background: theme.colors.primary.main,
    color: 'white',
    borderColor: theme.colors.primary.main,
    fontWeight: '600',
  },
  yearListContainer: {
    maxHeight: '300px',
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    padding: '4px',
  },
  yearButton: {
    padding: '12px 8px',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: theme.colors.text.primary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'white',
    textAlign: 'center',
  },
};

export default Onboarding;
