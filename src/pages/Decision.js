import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';
import { IoShuffle, IoAdd, IoPeople, IoChevronForward, IoArrowBack, IoChevronDown, IoRestaurant, IoPizza, IoBeer, IoCafe, IoFastFood, IoWine, IoIceCream, IoNutrition, IoBriefcase, IoHome, IoCalendarOutline, IoTimeOutline, IoFlash, IoSearch, IoLocationOutline } from 'react-icons/io5';

const Decision = () => {
  const navigate = useNavigate();
  const { groups, addSession, user } = useUser();
  const [timing, setTiming] = useState('now'); // 'now' or 'later'
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [showTimingMenu, setShowTimingMenu] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState('');
  const [tempHour, setTempHour] = useState('12');
  const [tempMinute, setTempMinute] = useState('00');
  const [tempPeriod, setTempPeriod] = useState('PM');
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const dateTimePickerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTimingMenu(false);
      }
      if (dateTimePickerRef.current && !dateTimePickerRef.current.contains(event.target)) {
        setShowDateTimePicker(false);
      }
    };

    if (showTimingMenu || showDateTimePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTimingMenu, showDateTimePicker]);

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
    // Set temp values from selected values
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
    return React.createElement(iconObj.icon, { size: 24, color: iconObj.color });
  };

  const generateSessionCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleQuickSession = () => {
    const sessionCode = generateSessionCode();
    const sessionId = Date.now().toString();

    // Create participants array with creator
    const creatorParticipant = {
      name: user?.name || 'Unknown',
      phone: user?.phone || '',
      email: user?.email || '',
      joined: true,
    };

    const session = {
      id: sessionId,
      name: 'Quick Session',
      code: sessionCode,
      type: 'quick',
      participants: [creatorParticipant],
      status: 'active',
      stage: 'waiting',
      icon: 'IoFlash',
      creatorName: user?.name || 'Unknown',
      createdAt: new Date().toISOString(),
      timing: timing,
      scheduledDate: timing === 'later' ? selectedDate : null,
      scheduledTime: timing === 'later' ? selectedTime : null,
      location: timing === 'later' ? customLocation : null,
    };
    addSession(session);
    
    // Navigate to waiting room with session data
    navigate('/session/waiting', {
      state: {
        sessionType: 'quick',
        sessionCode: sessionCode,
        groupName: 'Quick Session',
        members: session.participants,
        groupIcon: '⚡',
        sessionId: session.id,
        isCreator: true,
      }
    });
  };

  const handleGroupSession = (group) => {
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
      name: `${group.name}`,
      code: sessionCode,
      type: 'group',
      groupId: group.id,
      participants: [creatorParticipant, ...otherParticipants],
      status: 'active',
      stage: 'waiting',
      icon: group.icon || 'IoPeople',
      creatorName: user?.name || 'Unknown',
      createdAt: new Date().toISOString(),
      timing: timing,
      scheduledDate: timing === 'later' ? selectedDate : null,
      scheduledTime: timing === 'later' ? selectedTime : null,
      location: timing === 'later' ? customLocation : null,
    };
    addSession(session);
    
    // Navigate to waiting room with group data
    navigate('/session/waiting', {
      state: {
        sessionType: 'group',
        sessionCode: sessionCode,
        groupName: group.name,
        members: session.participants,
        groupIcon: group.icon,
        sessionId: session.id,
        isCreator: true,
      }
    });
  };

  // Filter groups based on search query
  const filteredGroups = groups.filter((group) => {
    const query = searchQuery.toLowerCase();
    return (
      group.name.toLowerCase().includes(query) ||
      group.description?.toLowerCase().includes(query) ||
      group.members.some(member => member.name.toLowerCase().includes(query))
    );
  });

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Title and Tagline */}
        <div style={styles.titleSection}>
          <div style={styles.titleRow}>
            <button style={styles.backButton} onClick={() => navigate('/home')}>
              <IoArrowBack size={24} color={theme.colors.text.primary} />
            </button>
            <h1 style={styles.mainTitle}>Start Group Decision</h1>
          </div>
          <p style={styles.tagline}>Choose how to begin</p>
        </div>

        {/* Custom Timing Dropdown */}
        <div ref={dropdownRef} style={styles.dropdownContainer}>
          <p style={styles.pickerLabel}>Dining Time</p>
          <button
            type="button"
            style={styles.customDropdownButton}
            onClick={() => setShowTimingMenu(!showTimingMenu)}
          >
            <span style={styles.dropdownText}>
              {timing === 'now' ? (
                <>
                  <IoFlash size={16} color={theme.colors.primary.main} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Plan for Now
                </>
              ) : (
                <>
                  <IoCalendarOutline size={16} color={theme.colors.primary.main} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Plan for Later
                </>
              )}
            </span>
            <IoChevronDown 
              size={18} 
              color={theme.colors.text.secondary}
              style={{
                transform: showTimingMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
          
          {showTimingMenu && (
            <div style={styles.dropdownMenu}>
              <button
                type="button"
                style={{
                  ...styles.dropdownOption,
                  background: timing === 'now' ? theme.colors.primary.main + '10' : 'transparent',
                }}
                onClick={() => {
                  setTiming('now');
                  setShowTimingMenu(false);
                }}
              >
                <IoFlash size={18} color={timing === 'now' ? theme.colors.primary.main : theme.colors.text.secondary} />
                <span style={{
                  ...styles.dropdownOptionText,
                  color: timing === 'now' ? theme.colors.primary.main : theme.colors.text.primary,
                }}>
                  Plan for Now
                </span>
              </button>
              <button
                type="button"
                style={{
                  ...styles.dropdownOption,
                  background: timing === 'later' ? theme.colors.primary.main + '10' : 'transparent',
                }}
                onClick={() => {
                  setTiming('later');
                  setShowTimingMenu(false);
                }}
              >
                <IoCalendarOutline size={18} color={timing === 'later' ? theme.colors.primary.main : theme.colors.text.secondary} />
                <span style={{
                  ...styles.dropdownOptionText,
                  color: timing === 'later' ? theme.colors.primary.main : theme.colors.text.primary,
                }}>
                  Plan for Later
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Combined Date and Time Picker (shown when "Plan for Later" is selected) */}
        {timing === 'later' && (
          <>
            <div style={styles.dateTimeContainer} className="fade-in" ref={dateTimePickerRef}>
              <button 
                type="button"
                style={{
                  ...styles.dateTimeButton,
                  borderColor: (selectedDate && selectedTime) ? theme.colors.primary.main : theme.colors.border.light,
                }}
                onClick={openDateTimePicker}
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

              {/* Combined Date & Time Picker Modal */}
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
                    <div style={styles.dateInputWrapper}>
                      <input
                        type="date"
                        value={tempDate}
                        onChange={(e) => setTempDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        style={styles.datePickerInput}
                        onClick={(e) => {
                          if (e.target.showPicker) {
                            e.target.showPicker();
                          }
                        }}
                      />
                    </div>
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

            {/* Location Input (shown when "Plan for Later" is selected) */}
            <div style={styles.locationContainer} className="fade-in">
              <div style={{
                ...styles.locationInputWrapper,
                borderColor: customLocation ? theme.colors.primary.main : theme.colors.border.light,
              }}>
                <IoLocationOutline 
                  size={16} 
                  color={customLocation ? theme.colors.primary.main : theme.colors.text.secondary} 
                  style={{ flexShrink: 0 }}
                />
                <input
                  type="text"
                  placeholder="Enter location (optional)"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  style={styles.locationInput}
                />
              </div>
            </div>
          </>
        )}

        {/* Create New Group Button */}
            <button
              style={styles.createGroupButton}
              onClick={() => navigate('/create-group')}
            >
          <div style={styles.buttonLeft}>
            <div style={styles.createGroupIcon}>
              <IoAdd size={24} color="white" />
            </div>
            <div style={styles.buttonTextContainer}>
              <div style={styles.buttonTitle}>Create a new Group</div>
              <div style={styles.buttonSubtitle}>Start a new group from scratch</div>
            </div>
          </div>
          <IoChevronForward size={24} color="white" />
        </button>

        {/* Quick Session Button */}
        <button
          style={styles.quickSessionButton}
          onClick={handleQuickSession}
        >
          <div style={styles.buttonLeft}>
            <div style={styles.quickSessionIcon}>
              <IoShuffle size={24} color="white" />
            </div>
            <div style={styles.buttonTextContainer}>
              <div style={styles.buttonTitle}>Quick Session</div>
              <div style={styles.buttonSubtitle}>Share a code, don't save groups</div>
            </div>
          </div>
          <IoChevronForward size={24} color="white" />
            </button>

        {/* Your Groups Section */}
        <div style={styles.groupsSection}>
          <h3 style={styles.groupsSectionTitle}>Your Groups ({groups.length})</h3>

          {/* Search Bar */}
          {groups.length > 0 && (
            <div style={styles.searchContainer}>
              <IoSearch size={18} color={theme.colors.text.secondary} />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          )}

          {filteredGroups.length > 0 ? (
                <div style={styles.groupsList}>
                  {filteredGroups.map((group) => (
                    <div
                      key={group.id}
                      style={styles.groupCard}
                      onClick={() => handleGroupSession(group)}
                    >
                      <div style={styles.groupAvatar}>
                    {group.photo ? getIconComponent(group.photo) : <IoPeople size={24} color={theme.colors.text.secondary} />}
                      </div>
                      <div style={styles.groupInfo}>
                        <div style={styles.groupName}>{group.name}</div>
                        <div style={styles.groupMembers}>
                          {group.members.length} members
                        </div>
                      </div>
                  <div style={styles.groupArrow}>
                    <IoChevronForward size={20} color={theme.colors.text.secondary} />
                  </div>
                    </div>
                  ))}
                </div>
          ) : (
              <div style={styles.emptyGroups}>
                {groups.length === 0 ? (
                  <>
                    <div style={styles.emptyIcon}>
                      <IoPeople size={48} color={theme.colors.text.secondary} />
                    </div>
                    <div style={styles.emptyText}>
                      No groups yet. Create one to get started!
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.emptyIcon}>
                      <IoSearch size={48} color={theme.colors.text.secondary} />
                    </div>
                    <div style={styles.emptyText}>
                      No groups match "{searchQuery}"
                    </div>
                  </>
                )}
              </div>
            )}
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
    background: '#F5F7FA',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '40px 20px 16px 20px',
    background: '#F5F7FA',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '40px 20px 24px 20px',
  },
  titleSection: {
    marginBottom: '24px',
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
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    flexShrink: 0,
  },
  mainTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    margin: 0,
    lineHeight: '1.2',
  },
  tagline: {
    fontSize: '12px',
    fontWeight: '400',
    color: theme.colors.text.secondary,
    margin: -10,
    paddingLeft: '60px',
  },
  dropdownContainer: {
    position: 'relative',
    marginBottom: '20px',
  },
  customDropdownButton: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    fontWeight: '500',
    color: theme.colors.text.primary,
    background: 'white',
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.2s ease',
  },
  dropdownText: {
    flex: 1,
    textAlign: 'left',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    background: 'white',
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
    zIndex: 10,
    padding: '4px',
  },
  dropdownOption: {
    width: '100%',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: '8px',
    margin: '4px',
  },
  dropdownOptionText: {
    fontSize: '15px',
    fontWeight: '500',
  },
  dateTimeContainer: {
    marginBottom: '20px',
    position: 'relative',
  },
  locationContainer: {
    marginBottom: '20px',
  },
  locationInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'white',
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '10px',
    padding: '10px 12px',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  locationInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '13px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    background: 'transparent',
  },
  dateTimeButton: {
    width: '100%',
    position: 'relative',
    background: 'white',
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '10px',
    padding: '10px 12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  buttonText: {
    flex: 1,
    textAlign: 'left',
  },
  buttonLabel: {
    fontSize: '10px',
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginBottom: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  buttonValue: {
    fontSize: '13px',
    fontWeight: '600',
  },
  dateTimePickerModal: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    zIndex: 20,
    padding: '16px',
    border: `1px solid ${theme.colors.border.light}`,
  },
  pickerHeader: {
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: `1px solid ${theme.colors.border.light}`,
  },
  pickerTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  pickerSection: {
    marginBottom: '12px',
  },
  pickerLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '10px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  dateInputWrapper: {
    position: 'relative',
  },
  datePickerInput: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    fontWeight: '500',
    color: theme.colors.text.primary,
    background: 'white',
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '8px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  timeDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '6px 0',
  },
  timeSelect: {
    width: '38px',
    padding: '6px 2px',
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    background: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    outline: 'none',
    textAlign: 'center',
    appearance: 'none',
  },
  timeSeparator: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
    opacity: 0.4,
  },
  periodToggle: {
    display: 'flex',
    gap: '4px',
    marginLeft: '8px',
    background: '#F3F4F6',
    padding: '3px',
    borderRadius: '8px',
  },
  periodButton: {
    padding: '6px 14px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  confirmButton: {
    width: '100%',
    padding: '10px',
    background: theme.colors.primary.main,
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(59, 130, 246, 0.25)',
    marginTop: '8px',
  },
  createGroupButton: {
    width: '100%',
    background: '#1F2937',
    border: 'none',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.2s ease',
  },
  quickSessionButton: {
    width: '100%',
    background: theme.colors.primary.gradient,
    border: 'none',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    marginBottom: '32px',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    transition: 'transform 0.2s ease',
  },
  buttonLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  createGroupIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickSessionIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  buttonTextContainer: {
    textAlign: 'left',
  },
  buttonTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '4px',
  },
  buttonSubtitle: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  groupsSection: {
    marginTop: '8px',
  },
  groupsSectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '16px',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'white',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '16px',
    border: `1px solid ${theme.colors.border.light}`,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    color: theme.colors.text.primary,
    background: 'transparent',
  },
  groupsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  groupCard: {
    background: 'white',
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
  },
  groupAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '4px',
  },
  groupMembers: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
  },
  groupArrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyGroups: {
    background: 'white',
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
  },
  emptyIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
  },
};

export default Decision;
