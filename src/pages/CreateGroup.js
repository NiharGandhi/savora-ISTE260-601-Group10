import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';
import { IoArrowBack, IoPeople, IoRestaurant, IoPizza, IoBeer, IoCafe, IoFastFood, IoWine, IoIceCream, IoNutrition, IoBriefcase, IoHome, IoSearch } from 'react-icons/io5';

const CreateGroup = () => {
  const navigate = useNavigate();
  const { addGroup, addNotificationToUser, user: currentUser } = useUser();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('IoPeople');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const iconPickerRef = useRef(null);

  const iconOptions = [
    { id: 'IoPeople', icon: IoPeople, color: '#6366F1' },
    { id: 'IoRestaurant', icon: IoRestaurant, color: '#EC4899' },
    { id: 'IoPizza', icon: IoPizza, color: '#F59E0B' },
    { id: 'IoBeer', icon: IoBeer, color: '#F59E0B' },
    { id: 'IoCafe', icon: IoCafe, color: '#8B5CF6' },
    { id: 'IoFastFood', icon: IoFastFood, color: '#EF4444' },
    { id: 'IoWine', icon: IoWine, color: '#DC2626' },
    { id: 'IoIceCream', icon: IoIceCream, color: '#06B6D4' },
    { id: 'IoNutrition', icon: IoNutrition, color: '#10B981' },
    { id: 'IoBriefcase', icon: IoBriefcase, color: '#3B82F6' },
    { id: 'IoHome', icon: IoHome, color: '#8B5CF6' },
  ];

  const getIconComponent = (iconId) => {
    const iconObj = iconOptions.find(opt => opt.id === iconId);
    return iconObj || iconOptions[0];
  };

  // Close icon picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (iconPickerRef.current && !iconPickerRef.current.contains(event.target)) {
        setShowIconPicker(false);
      }
    };

    if (showIconPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showIconPicker]);

  const allContacts = [
    { id: 1, name: 'Nihar', phone: '+971 50 XXXXXXXX' },
    { id: 2, name: 'Kripa', phone: '+971 50 XXXXXXXX' },
    { id: 3, name: 'Zara', phone: '+971 50 XXXXXXXX' },
    { id: 4, name: 'Shiza', phone: '+971 50 XXXXXXXX' },
    { id: 5, name: 'Nadia', phone: '+971 50 XXXXXXXX' },
    { id: 6, name: 'Sandhli', phone: '+971 50 XXXXXXXX' },
    { id: 7, name: 'Nishok', phone: '+971 50 XXXXXXXX' },
    { id: 8, name: 'Tanmay', phone: '+971 50 XXXXXXXX' },
    { id: 9, name: 'Alina', phone: '+971 50 XXXXXXXX' },
    { id: 10, name: 'Ashitha', phone: '+971 50 XXXXXXXX' },
    { id: 11, name: 'Jaiwant', phone: '+971 50 XXXXXXXX' },
  ];

  const toggleContact = (contact) => {
    if (selectedContacts.find(c => c.id === contact.id)) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  // Map contact names to userIds for notifications
  const getUserIdFromContact = (contactName) => {
    // Map known users to their userIds
    const lowerName = contactName.toLowerCase();
    if (lowerName === 'nihar') return 'nihar';
    if (lowerName === 'kripa') return 'kripa';
    if (lowerName === 'zara') return 'zara';
    return 'default';
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    if (selectedContacts.length === 0) {
      alert('Please select at least one member');
      return;
    }

    const groupId = Date.now().toString();
    const group = {
      id: groupId,
      name: groupName,
      description,
      photo: photo,
      members: selectedContacts,
      createdAt: new Date().toISOString(),
    };

    addGroup(group);

    // Send notifications to all selected contacts
    selectedContacts.forEach((contact) => {
      const targetUserId = getUserIdFromContact(contact.name);
      const notification = {
        id: `notification_${Date.now()}_${contact.id}`,
        type: 'group_invite',
        groupId: groupId,
        groupName: groupName,
        groupIcon: photo,
        groupDescription: description,
        groupMembers: selectedContacts, // Include all members
        inviterName: currentUser?.name || 'Someone',
        inviterPhone: currentUser?.phone || '',
        timestamp: new Date().toISOString(),
        status: 'pending',
        read: false,
      };

      addNotificationToUser(targetUserId, notification);
    });

    navigate('/home');
  };

  // Filter contacts based on search query
  const filteredContacts = allContacts.filter((contact) => {
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.phone.toLowerCase().includes(query)
    );
  });

  return (
    <div style={styles.container}>
      <div className="mobile-screen-content" style={styles.content}>
        {/* Title and Tagline */}
        <div style={styles.titleSection}>
          <div style={styles.titleRow}>
            <button style={styles.backButton} onClick={() => navigate(-1)}>
              <IoArrowBack size={24} color={theme.colors.text.primary} />
            </button>
            <h1 style={styles.mainTitle}>Create New Group</h1>
          </div>
          <p style={styles.tagline}>Give it a name and add members</p>
        </div>

        {/* Group Name with Icon Picker */}
        <div style={styles.inputGroup} ref={iconPickerRef}>
          <label style={styles.label}>Group Name *</label>
          <div style={styles.nameInputContainer}>
            <button
              type="button"
              style={{
                ...styles.iconPickerButton,
                background: getIconComponent(photo).color + '15',
                border: `2px solid ${getIconComponent(photo).color}30`,
              }}
              onClick={() => setShowIconPicker(!showIconPicker)}
            >
              {React.createElement(getIconComponent(photo).icon, { 
                size: 24, 
                color: getIconComponent(photo).color 
              })}
            </button>
            <input
              type="text"
              className="input"
              placeholder="e.g., Lunch Squad, Roommates"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={styles.nameInput}
            />
          </div>
          
          {/* Icon Picker Dropdown */}
          {showIconPicker && (
            <div style={styles.iconPickerDropdown}>
              <div style={styles.iconPickerGrid}>
                {iconOptions.map((iconObj) => (
                  <button
                    key={iconObj.id}
                    style={{
                      ...styles.iconOption,
                      background: photo === iconObj.id ? iconObj.color + '15' : 'transparent',
                      border: photo === iconObj.id ? `2px solid ${iconObj.color}` : '2px solid transparent',
                    }}
                    onClick={() => {
                      setPhoto(iconObj.id);
                      setShowIconPicker(false);
                    }}
                  >
                    {React.createElement(iconObj.icon, { 
                      size: 24, 
                      color: iconObj.color 
                    })}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            className="input"
            placeholder="What's this group about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
          />
        </div>

        {/* Contacts */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Select Members ({selectedContacts.length} selected)
          </label>

          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <IoSearch size={18} color={theme.colors.text.secondary} />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Contact List */}
          <div style={styles.contactsList}>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => {
              const isSelected = selectedContacts.find(c => c.id === contact.id);
              return (
                <div
                  key={contact.id}
                  style={{
                    ...styles.contactCard,
                    background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'white',
                    border: isSelected ? `2px solid ${theme.colors.primary.main}` : '1px solid #E5E7EB',
                  }}
                  onClick={() => toggleContact(contact)}
                >
                  <div
                    style={{
                      ...styles.contactAvatar,
                      background: isSelected ? theme.colors.primary.main : theme.colors.background.gray,
                      color: isSelected ? 'white' : theme.colors.text.primary,
                    }}
                  >
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.contactName}>{contact.name}</div>
                    <div style={styles.contactPhone}>{contact.phone}</div>
                  </div>
                  <div style={{
                    ...styles.checkbox,
                    background: isSelected ? theme.colors.primary.main : 'transparent',
                    borderColor: isSelected ? theme.colors.primary.main : '#D1D5DB',
                  }}>
                    {isSelected && '✓'}
                  </div>
                </div>
              );
            })
            ) : (
              <div style={styles.emptyContacts}>
                <IoSearch size={32} color={theme.colors.text.secondary} />
                <div style={styles.emptyContactsText}>
                  No contacts match "{searchQuery}"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <button
          onClick={handleCreateGroup}
          style={{
            ...styles.createButton,
            opacity: (!groupName.trim() || selectedContacts.length === 0) ? 0.5 : 1,
            cursor: (!groupName.trim() || selectedContacts.length === 0) ? 'not-allowed' : 'pointer',
          }}
          disabled={!groupName.trim() || selectedContacts.length === 0}
        >
          Create Group ({selectedContacts.length} member{selectedContacts.length !== 1 ? 's' : ''})
        </button>
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
  content: {
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
  nameInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
  },
  iconPickerButton: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#F3F4F6',
    border: '2px solid #E5E7EB',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  },
  nameInput: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    background: 'white',
  },
  iconPickerDropdown: {
    position: 'absolute',
    top: '100%',
    left: '0',
    marginTop: '8px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
    padding: '12px',
    zIndex: 10,
    border: '1px solid #E5E7EB',
  },
  iconPickerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '8px',
  },
  iconOption: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    background: 'transparent',
  },
  inputGroup: {
    marginBottom: '24px',
    position: 'relative',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '8px',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'white',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '12px',
    border: '2px solid #E5E7EB',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    color: theme.colors.text.primary,
    background: 'transparent',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    background: 'white',
  },
  contactsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  contactCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    background: 'white',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  contactAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    flexShrink: 0,
  },
  contactName: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '2px',
  },
  contactPhone: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
  },
  checkbox: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    border: '2px solid',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  },
  createButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  footer: {
    padding: '20px',
    borderTop: '1px solid #E5E7EB',
    background: 'white',
  },
  emptyContacts: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    gap: '12px',
  },
  emptyContactsText: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
};

export default CreateGroup;
