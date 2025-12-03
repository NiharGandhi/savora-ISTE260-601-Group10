import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';
import { IoArrowBack, IoFlash, IoCalendarOutline, IoTimeOutline, IoLocationOutline } from 'react-icons/io5';

const GroupPlanning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addSession, user } = useUser();
  
  const group = location.state?.group;
  
  const [timing, setTiming] = useState('now'); // 'now' or 'later'
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState('');
  const [tempHour, setTempHour] = useState('12');
  const [tempMinute, setTempMinute] = useState('00');
  const [tempPeriod, setTempPeriod] = useState('PM');
  const dateTimePickerRef = useRef(null);

  // Close date/time picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateTimePickerRef.current && !dateTimePickerRef.current.contains(event.target)) {
        setShowDateTimePicker(false);
      }
    };

    if (showDateTimePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDateTimePicker]);

  const generateSessionCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleDateTimeConfirm = () => {
    setSelectedDate(tempDate);
    
    // Convert to 24-hour format for storage
    let hour24 = parseInt(tempHour);
    if (tempPeriod === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (tempPeriod === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    const timeString = `${hour24.toString().padStart(2, '0')}:${tempMinute}`;
    setSelectedTime(timeString);
    setShowDateTimePicker(false);
  };

  const openDateTimePicker = () => {
    if (selectedDate) {
      setTempDate(selectedDate);
    } else {
      setTempDate(new Date().toISOString().split('T')[0]);
    }
    
    if (selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      const hour24 = parseInt(hours);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const period = hour24 >= 12 ? 'PM' : 'AM';
      setTempHour(hour12.toString().padStart(2, '0'));
      setTempMinute(minutes);
      setTempPeriod(period);
    }
    setShowDateTimePicker(true);
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  const handleContinue = () => {
    if (!group) {
      navigate('/decision');
      return;
    }

    // Validate "Plan for Later" requires date and time
    if (timing === 'later' && (!selectedDate || !selectedTime)) {
      alert('Please select date and time for "Plan for Later"');
      return;
    }

    const sessionCode = generateSessionCode();
    const sessionId = Date.now().toString();

    // Create participants array with creator as first member
    const creatorParticipant = {
      name: user?.name || 'Unknown',
      phone: user?.phone || '',
      email: user?.email || '',
      joined: true,
    };

    // Map group members to participants (excluding creator if they're in the group)
    const otherParticipants = group.members
      .filter(member => member.name !== user?.name && member.phone !== user?.phone)
      .map(member => ({
        name: member.name,
        phone: member.phone,
        email: member.email,
        joined: false,
      }));

    const session = {
      id: sessionId,
      name: group.name,
      code: sessionCode,
      type: 'group',
      groupId: group.id,
      participants: [creatorParticipant, ...otherParticipants],
      status: 'active',
      stage: 'waiting',
      icon: group.photo || 'IoPeople',
      creatorName: user?.name || 'Unknown',
      createdAt: new Date().toISOString(),
      timing: timing,
      scheduledDate: timing === 'later' ? selectedDate : null,
      scheduledTime: timing === 'later' ? selectedTime : null,
      location: locationInput || null,
    };

    addSession(session);
    
    // Navigate to waiting room with session data
    navigate('/session/waiting', {
      state: {
        sessionType: 'group',
        sessionCode: sessionCode,
        groupName: group.name,
        members: session.participants,
        groupIcon: group.photo,
        sessionId: session.id,
        isCreator: true,
      }
    });
  };

  if (!group) {
    return (
      <div style={styles.container}>
        <div className="mobile-screen-content" style={styles.content}>
          <div style={styles.errorMessage}>
            No group data found. Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div className="mobile-screen-content" style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backButton} onClick={() => navigate(-1)}>
            <IoArrowBack size={24} color={theme.colors.text.primary} />
          </button>
          <h2 style={styles.title}>Plan Your Session</h2>
          <div style={{ width: '40px' }} />
        </div>

        {/* Group Info */}
        <div style={styles.groupInfoCard}>
          <div style={styles.groupName}>{group.name}</div>
          <div style={styles.groupMembers}>{group.members.length} member{group.members.length !== 1 ? 's' : ''}</div>
        </div>

        {/* Timing Selection */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>When do you want to dine?</h3>
          <div style={styles.timingOptions}>
            <button
              onClick={() => setTiming('now')}
              style={{
                ...styles.timingButton,
                ...(timing === 'now' ? styles.timingButtonActive : {}),
              }}
            >
              <IoFlash size={24} color={timing === 'now' ? 'white' : theme.colors.primary.main} />
              <div style={styles.timingButtonText}>
                <div style={{
                  ...styles.timingButtonTitle,
                  color: timing === 'now' ? 'white' : theme.colors.text.primary,
                }}>Plan For Now</div>
                <div style={{
                  ...styles.timingButtonSubtitle,
                  color: timing === 'now' ? 'white' : theme.colors.text.secondary,
                }}>Start immediately</div>
              </div>
            </button>
            
            <button
              onClick={() => setTiming('later')}
              style={{
                ...styles.timingButton,
                ...(timing === 'later' ? styles.timingButtonActive : {}),
              }}
            >
              <IoCalendarOutline size={24} color={timing === 'later' ? 'white' : theme.colors.primary.main} />
              <div style={styles.timingButtonText}>
                <div style={{
                  ...styles.timingButtonTitle,
                  color: timing === 'later' ? 'white' : theme.colors.text.primary,
                }}>Plan for Later</div>
                <div style={{
                  ...styles.timingButtonSubtitle,
                  color: timing === 'later' ? 'white' : theme.colors.text.secondary,
                }}>Schedule a time</div>
              </div>
            </button>
          </div>
        </div>

        {/* Location Input - Shown for both options */}
        <div style={styles.section}>
          <label style={styles.label}>
            <IoLocationOutline size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Location (Optional)
          </label>
          <input
            type="text"
            placeholder="Enter location..."
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            style={styles.locationInput}
          />
        </div>

        {/* Date & Time Picker - Shown only for "Plan for Later" */}
        {timing === 'later' && (
          <>
            <div style={styles.section} ref={dateTimePickerRef}>
              <label style={styles.label}>
                <IoCalendarOutline size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Date & Time
              </label>
              <button
                type="button"
                onClick={openDateTimePicker}
                style={{
                  ...styles.dateTimeButton,
                  borderColor: (selectedDate && selectedTime) ? theme.colors.primary.main : theme.colors.border.medium,
                }}
              >
                <div style={styles.buttonContent}>
                  <IoCalendarOutline size={16} color={(selectedDate && selectedTime) ? theme.colors.primary.main : theme.colors.text.secondary} />
                  <div style={styles.buttonText}>
                    <div style={styles.buttonLabel}>When</div>
                    <div style={{
                      ...styles.buttonValue,
                      color: (selectedDate && selectedTime) ? theme.colors.text.primary : theme.colors.text.secondary,
                    }}>
                      {(selectedDate && selectedTime)
                        ? `${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
                        : 'Select date & time'}
                    </div>
                  </div>
                </div>
              </button>

              {/* Date & Time Picker Modal */}
              {showDateTimePicker && (
                <div style={styles.dateTimePickerModal}>
                  <div style={styles.pickerHeader}>
                    <span style={styles.pickerTitle}>Select Date & Time</span>
                  </div>

                  {/* Date Input */}
                  <div style={styles.pickerSection}>
                    <label style={styles.pickerLabel}>
                      <IoCalendarOutline size={14} style={{ marginRight: '6px' }} />
                      Date
                    </label>
                    <input
                      type="date"
                      value={tempDate}
                      onChange={(e) => setTempDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      style={styles.datePickerInput}
                    />
                  </div>

                  {/* Time Selection */}
                  <div style={styles.pickerSection}>
                    <label style={styles.pickerLabel}>
                      <IoTimeOutline size={14} style={{ marginRight: '6px' }} />
                      Time
                    </label>
                    <div style={styles.timeDisplay}>
                      <select
                        value={tempHour}
                        onChange={(e) => setTempHour(e.target.value)}
                        style={styles.timeSelect}
                      >
                        {hours.map(hour => (
                          <option key={hour} value={hour}>{hour}</option>
                        ))}
                      </select>
                      
                      <span style={styles.timeSeparator}>:</span>
                      
                      <select
                        value={tempMinute}
                        onChange={(e) => setTempMinute(e.target.value)}
                        style={styles.timeSelect}
                      >
                        {minutes.map(minute => (
                          <option key={minute} value={minute}>{minute}</option>
                        ))}
                      </select>
                      
                      <div style={styles.periodToggle}>
                        <button
                          type="button"
                          style={{
                            ...styles.periodButton,
                            background: tempPeriod === 'AM' ? theme.colors.primary.main : 'transparent',
                            color: tempPeriod === 'AM' ? '#fff' : theme.colors.text.secondary,
                          }}
                          onClick={() => setTempPeriod('AM')}
                        >
                          AM
                        </button>
                        <button
                          type="button"
                          style={{
                            ...styles.periodButton,
                            background: tempPeriod === 'PM' ? theme.colors.primary.main : 'transparent',
                            color: tempPeriod === 'PM' ? '#fff' : theme.colors.text.secondary,
                          }}
                          onClick={() => setTempPeriod('PM')}
                        >
                          PM
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    style={styles.confirmButton}
                    onClick={handleDateTimeConfirm}
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Continue Button */}
        <div style={styles.footer}>
          <button
            onClick={handleContinue}
            style={{
              ...styles.continueButton,
              opacity: (timing === 'later' && (!selectedDate || !selectedTime)) ? 0.5 : 1,
            }}
            disabled={timing === 'later' && (!selectedDate || !selectedTime)}
          >
            Continue
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
    background: theme.colors.background.primary,
  },
  content: {
    padding: '20px 16px',
    flex: 1,
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
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
  groupInfoCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  groupName: {
    fontSize: '18px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '4px',
  },
  groupMembers: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
  },
  section: {
    marginBottom: '24px',
    position: 'relative',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '12px',
  },
  timingOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  timingButton: {
    width: '100%',
    padding: '20px',
    border: `2px solid ${theme.colors.border.medium}`,
    borderRadius: '16px',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  timingButtonActive: {
    background: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
    color: 'white',
  },
  timingButtonText: {
    flex: 1,
    textAlign: 'left',
  },
  timingButtonTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  timingButtonSubtitle: {
    fontSize: '14px',
    opacity: 0.8,
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  locationInput: {
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    background: 'white',
    transition: 'all 0.2s ease',
  },
  dateTimeButton: {
    width: '100%',
    background: 'white',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '12px',
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  buttonText: {
    flex: 1,
    textAlign: 'left',
  },
  buttonLabel: {
    fontSize: '11px',
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  buttonValue: {
    fontSize: '15px',
    fontWeight: '600',
  },
  dateTimePickerModal: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    zIndex: 1000,
    padding: '16px',
    border: `1px solid ${theme.colors.border.medium}`,
  },
  pickerHeader: {
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: `1px solid ${theme.colors.border.light}`,
  },
  pickerTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  pickerSection: {
    marginBottom: '16px',
  },
  pickerLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: '8px',
  },
  datePickerInput: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    fontWeight: '500',
    color: theme.colors.text.primary,
    background: 'white',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '12px',
    cursor: 'pointer',
    outline: 'none',
  },
  timeDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '8px 0',
  },
  timeSelect: {
    width: '60px',
    padding: '10px 8px',
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    background: 'white',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '8px',
    cursor: 'pointer',
    outline: 'none',
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: '18px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  periodToggle: {
    display: 'flex',
    gap: '4px',
    marginLeft: '8px',
    background: '#F3F4F6',
    padding: '4px',
    borderRadius: '8px',
  },
  periodButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  confirmButton: {
    width: '100%',
    padding: '12px',
    background: theme.colors.primary.main,
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '8px',
  },
  footer: {
    padding: '16px 0',
    borderTop: `1px solid ${theme.colors.border.light}`,
    marginTop: 'auto',
  },
  continueButton: {
    width: '100%',
    background: theme.colors.primary.main,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
  },
  errorMessage: {
    textAlign: 'center',
    padding: '40px 20px',
    color: theme.colors.text.secondary,
  },
};

export default GroupPlanning;

