import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';
import { IoArrowBack, IoCopy, IoCheckmark, IoShareSocial, IoPeople, IoPersonAdd, IoLogoWhatsapp, IoInformationCircle } from 'react-icons/io5';

const SessionWaiting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateSession, user, sessions } = useUser();
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  // Get session data from navigation state
  const sessionData = location.state || {};
  const {
    sessionType = 'quick', // 'quick' or 'group'
    sessionCode = 'ABC123',
    groupName = 'Quick Session',
    sessionId,
    isCreator = true, // Default to true for backward compatibility
  } = sessionData;

  const [sessionMembers, setSessionMembers] = useState([]);

  const isQuickSession = sessionType === 'quick';
  const heading = isQuickSession ? 'Quick Session' : 'Group Decision';

  // Check if user has already joined and load session data
  useEffect(() => {
    // Load from sessionId (from global storage)
    if (sessionId) {
      // Get session from global storage (sessions are now shared)
      const session = sessions.find(s => s.id === sessionId);

      if (session) {
        // Ensure participants is an array
        const participants = Array.isArray(session.participants)
          ? session.participants
          : [];

        // Check if current user is in participants
        const userJoined = participants.some(p =>
          (p.name === user?.name) || (p.phone === user?.phone)
        );
        setHasJoined(userJoined);

        // Update members from session data (this is the source of truth)
        setSessionMembers(participants);

        // Auto-navigate when stage changes to 'preferences'
        if (session.stage === 'preferences' && hasJoined) {
          navigate(`/preferences/${sessionId}`);
        }
      }
    } else if (sessionData.members && Array.isArray(sessionData.members)) {
      // Fallback: use members from navigation state if sessionId not available
      setSessionMembers(sessionData.members);
    }
  }, [sessionId, sessions, user, sessionData.members, hasJoined, navigate]);

  // Handle joining the session
  const handleJoin = () => {
    if (!user || !sessionId) return;

    // Find session in global storage
    const currentSession = sessions.find(s => s.id === sessionId);

    if (!currentSession) return;

    // Add user to participants
    const userParticipant = {
      name: user.name,
      phone: user.phone,
      email: user.email,
      joined: true,
    };

    const existingParticipants = Array.isArray(currentSession.participants)
      ? currentSession.participants
      : [];

    // Check if user already exists
    const userExists = existingParticipants.some(p =>
      p.name === user.name || p.phone === user.phone
    );

    if (!userExists) {
      const updatedParticipants = [...existingParticipants, userParticipant];

      // Update session in global storage
      updateSession(sessionId, {
        participants: updatedParticipants,
      });

      // Update local state
      setSessionMembers(updatedParticipants);
      setHasJoined(true);
    } else {
      // User already exists, just mark as joined
      const updatedParticipants = existingParticipants.map(p =>
        (p.name === user.name || p.phone === user.phone)
          ? { ...p, joined: true }
          : p
      );

      updateSession(sessionId, {
        participants: updatedParticipants,
      });

      setSessionMembers(updatedParticipants);
      setHasJoined(true);
    }
  };

  // Generate session URL
  const sessionUrl = `${window.location.origin}/join/${sessionCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Join ${groupName}`,
      text: `Join our dining decision session! Use code: ${sessionCode}`,
      url: sessionUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        handleCopyCode();
      }
    } else {
      handleCopyCode();
    }
  };

  const handleStartDecision = () => {
    if (sessionId) {
      // Update session stage to 'preferences'
      updateSession(sessionId, { stage: 'preferences' });
      navigate(`/preferences/${sessionId}`);
    }
  };

  const handleInviteFriend = (method) => {
    if (method === 'whatsapp') {
      window.open(`https://wa.me/?text=Join my dining session! Code: ${sessionCode}`);
    } else {
      handleShare();
    }
  };

  const handleInviteContact = (contact) => {
    // Ensure sessionMembers is an array
    const safeMembers = Array.isArray(sessionMembers) ? sessionMembers : [];
    
    // Check if contact is already in the session
    if (safeMembers.find(m => m.name === contact.name)) {
      return; // Already invited
    }

    // Add contact to session members with "Waiting" status
    const newMember = {
      name: contact.name,
      phone: contact.phone,
      joined: false,
    };
    
    setSessionMembers([...safeMembers, newMember]);
    
    // Show toast notification
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Ensure sessionMembers is always an array
  const safeSessionMembers = Array.isArray(sessionMembers) ? sessionMembers : [];
  
  // All possible test user IDs
  const allTestUserIds = ['nihar', 'kripa', 'zara', 'default'];
  
  // Remove duplicates and update "You" member status
  const seenMembers = new Set();
  let membersForDisplay = safeSessionMembers
    .filter(member => {
      // Skip invalid members
      if (!member || (!member.name && !member.phone)) {
        return false;
      }
      
      // Remove duplicates based on name or phone
      const key = `${member.name || ''}_${member.phone || ''}`;
      if (seenMembers.has(key)) {
        return false; // Duplicate, skip
      }
      seenMembers.add(key);
      return true;
    })
    .map(member => {
      // Check if this member is the current user
      const isYou = user && (
        (member.name && member.name === user.name) || 
        (member.phone && member.phone === user.phone)
      );
      
      if (isYou && user) {
        // Update "You" member status to match hasJoined
        return {
          ...member,
          name: user.name,
          phone: user.phone,
          email: user.email,
          joined: hasJoined,
        };
      }
      return member;
    });
  
  // For group decisions, if "You" is not in the list, add them
  if (!isQuickSession && user) {
    const youInList = membersForDisplay.some(m => 
      (m.name && m.name === user.name) || (m.phone && m.phone === user.phone)
    );
    if (!youInList) {
      membersForDisplay = [{ 
        name: user.name, 
        phone: user.phone,
        email: user.email,
        joined: hasJoined 
      }, ...membersForDisplay];
    }
  }
  
  const joinedCount = membersForDisplay.filter(m => m.joined).length;
  const totalCount = membersForDisplay.length;
  const canStart = isQuickSession ? joinedCount >= 2 : joinedCount >= 1;

  // Mock contacts list for inviting
  const allContacts = [
    { id: 1, name: 'Kripa', phone: '+971 50 XXXXXXXX' },
    { id: 2, name: 'Zara', phone: '+971 50 XXXXXXXX' },
    { id: 3, name: 'Shiza', phone: '+971 50 XXXXXXXX' },
    { id: 4, name: 'Nadia', phone: '+971 50 XXXXXXXX' },
    { id: 5, name: 'Sandhli', phone: '+971 50 XXXXXXXX' },
    { id: 6, name: 'Nishok', phone: '+971 50 XXXXXXXX' },
    { id: 7, name: 'Tanmay', phone: '+971 50 XXXXXXXX' },
    { id: 8, name: 'Alina', phone: '+971 50 XXXXXXXX' },
    { id: 9, name: 'Ashitha', phone: '+971 50 XXXXXXXX' },
    { id: 10, name: 'Jaiwant', phone: '+971 50 XXXXXXXX' },
  ];

  // Filter out contacts already in session
  const availableContacts = allContacts.filter(
    contact => !safeSessionMembers.find(m => m.name === contact.name)
  );

  return (
    <div style={styles.container}>
      {/* Header with Session Code */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <button onClick={() => navigate('/decision')} style={styles.backButton}>
            <IoArrowBack size={24} color={theme.colors.text.primary} />
          </button>
          <h1 style={styles.mainTitle}>{heading}</h1>
        </div>
        <p style={styles.tagline}>Waiting for everyone...</p>
        
        {/* Session Code Row */}
        <div style={styles.codeRow}>
          <div style={styles.codeInfo}>
            <span style={styles.codeLabel}>Code:</span>
            <span style={styles.codeText}>{sessionCode}</span>
          </div>
          <div style={styles.codeActions}>
            <button 
              onClick={handleCopyCode} 
              onMouseDown={(e) => e.preventDefault()}
              style={styles.copyButton}
            >
              {copied ? (
                <IoCheckmark size={18} color="#10B981" />
              ) : (
                <IoCopy size={18} color={theme.colors.text.secondary} />
              )}
            </button>
            <button 
              onClick={() => handleInviteFriend('whatsapp')}
              onMouseDown={(e) => e.preventDefault()}
              style={styles.whatsappIconButton}
            >
              <IoLogoWhatsapp size={18} color="#25D366" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Members Section */}
        <div style={styles.membersSection}>
          <div style={styles.sectionHeader}>
            <IoPeople size={18} color={theme.colors.text.secondary} />
            <span style={styles.sectionTitle}>
              {isQuickSession ? 'Participants' : 'Members'} ({joinedCount}/{totalCount})
            </span>
          </div>

          {/* Group Decision - Show Members Grid */}
          {!isQuickSession && membersForDisplay.length > 0 && (
            <div style={styles.membersGrid}>
              {membersForDisplay.map((member, index) => {
                const isYou = member.name === user?.name || member.phone === user?.phone;
                return (
                  <div key={index} style={styles.memberGridItem}>
                    <div style={styles.memberAvatar}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={styles.memberName}>
                      {isYou ? 'You' : member.name}
                    </span>
                    <span style={{
                      ...styles.memberStatus,
                      ...(member.joined ? styles.statusJoinedBadge : styles.statusWaitingBadge),
                    }}>
                      {member.joined ? 'Joined' : 'Waiting'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Session - Empty State with Invite Options */}
          {isQuickSession && (
            <>
              {sessionMembers.length > 0 && (
                <div style={styles.membersGrid}>
                  {sessionMembers.map((member, index) => (
                    <div key={index} style={styles.memberGridItem}>
                      <div style={styles.memberAvatar}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={styles.memberName}>{member.name}</span>
                      <span style={{
                        ...styles.memberStatus,
                        ...(member.joined ? styles.statusJoinedBadge : styles.statusWaitingBadge),
                      }}>
                        {member.joined ? 'Joined' : 'Waiting'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Invite Contacts */}
              {availableContacts.length > 0 && (
                <div style={styles.inviteSection}>
                  <span style={styles.invitePrompt}>Invite friends to join</span>
                  
                  <div style={styles.contactsGrid}>
                    {availableContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => handleInviteContact(contact)}
                        onMouseDown={(e) => e.preventDefault()}
                        style={styles.contactCard}
                      >
                        <div style={styles.contactAvatar}>
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={styles.contactName}>{contact.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Creator: Tip Card and Button in scrollable content */}
        {isCreator && (
          <>
            {/* Tip Card for Creator */}
            <div style={styles.tipCard}>
              <IoInformationCircle size={20} color={theme.colors.primary.main} />
              <p style={styles.tipText}>
                {canStart 
                  ? 'You have enough people to start! Feel free to begin matching.'
                  : isQuickSession
                    ? 'You need at least 2 people to start a decision session.'
                    : 'You can start when at least one member joins.'}
              </p>
            </div>

            {/* Start Decision Button */}
            <button
              onClick={handleStartDecision}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                ...styles.startButton,
                opacity: canStart ? 1 : 0.5,
                cursor: canStart ? 'pointer' : 'not-allowed',
              }}
              disabled={!canStart}
            >
              Start Matching
            </button>
          </>
        )}
      </div>

      {/* Non-Creator: Join button or waiting message */}
      {!isCreator && (
        <div style={styles.bottomSection}>
          {!hasJoined ? (
            <>
              {/* Join Button */}
              <div style={styles.tipCard}>
                <IoInformationCircle size={20} color={theme.colors.primary.main} />
                <p style={styles.tipText}>
                  Join this session to participate in the decision
                </p>
              </div>
              <button
                onClick={handleJoin}
                onMouseDown={(e) => e.preventDefault()}
                style={styles.startButton}
              >
                Join Session
              </button>
            </>
          ) : (
            /* Message for Joined Members */
            <div style={styles.waitingCard}>
              <IoInformationCircle size={20} color="#F59E0B" />
              <p style={styles.waitingText}>
                Waiting for the host to start the session...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div style={styles.toast}>
          <IoCheckmark size={18} color="white" />
          <span>Invite sent</span>
        </div>
      )}
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
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
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
    margin: '0 0 12px 0',
    paddingLeft: '32px',
  },
  codeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#F9FAFB',
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '10px',
    padding: '10px 12px',
    marginTop: '12px',
  },
  codeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  codeLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  codeText: {
    fontSize: '18px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    letterSpacing: '2px',
  },
  codeActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  copyButton: {
    background: 'none',
    border: 'none',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
  },
  whatsappIconButton: {
    background: 'rgba(37, 211, 102, 0.1)',
    border: 'none',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    paddingBottom: '20px',
  },
  bottomSection: {
    background: 'white',
    borderTop: `1px solid ${theme.colors.border.light}`,
    padding: '16px 20px 20px 20px',
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
  },
  membersSection: {
    marginBottom: '20px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  membersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '20px',
  },
  memberGridItem: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
  },
  memberAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: theme.colors.primary.main,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    flexShrink: 0,
  },
  memberName: {
    fontSize: '13px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    lineHeight: '1.2',
  },
  memberStatus: {
    fontSize: '10px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '10px',
  },
  statusJoinedBadge: {
    color: '#10B981',
    background: 'rgba(16, 185, 129, 0.1)',
  },
  statusWaitingBadge: {
    color: '#F59E0B',
    background: 'rgba(245, 158, 11, 0.1)',
  },
  inviteSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  invitePrompt: {
    fontSize: '13px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '12px',
  },
  contactsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
  },
  contactCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    background: '#F9FAFB',
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '10px',
    padding: '10px 8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
  },
  contactAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: theme.colors.primary.main,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    flexShrink: 0,
  },
  contactName: {
    fontSize: '11px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
    lineHeight: '1.2',
  },
  toast: {
    position: 'fixed',
    bottom: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#10B981',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    fontSize: '14px',
    fontWeight: '600',
    zIndex: 1000,
    animation: 'slideUp 0.3s ease',
  },
  tipCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    background: 'rgba(59, 130, 246, 0.05)',
    border: `1px solid rgba(59, 130, 246, 0.2)`,
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '16px',
  },
  tipText: {
    fontSize: '13px',
    fontWeight: '500',
    color: theme.colors.text.primary,
    margin: 0,
    lineHeight: '1.5',
  },
  waitingCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    background: 'rgba(251, 146, 60, 0.05)',
    border: `1px solid rgba(251, 146, 60, 0.2)`,
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '16px',
  },
  waitingText: {
    fontSize: '13px',
    fontWeight: '500',
    color: theme.colors.text.primary,
    margin: 0,
    lineHeight: '1.5',
  },
  startButton: {
    width: '100%',
    background: theme.colors.primary.main,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    marginBottom: 0,
  },
};

export default SessionWaiting;

