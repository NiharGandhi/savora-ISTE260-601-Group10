import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';
import { IoArrowBack, IoCheckmark, IoClose } from 'react-icons/io5';

const JoinWithCode = () => {
  const navigate = useNavigate();
  const { sessions } = useUser();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (index === 5 && value) {
      const fullCode = newCode.join('');
      handleJoin(fullCode);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('').concat(['', '', '', '', '', '']).slice(0, 6);
      setCode(newCode);
      
      // Focus last filled input or next empty
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();

      // Auto-submit if complete
      if (pastedData.length === 6) {
        handleJoin(pastedData);
      }
    }
  };

  const handleJoin = async (sessionCode) => {
    setIsValidating(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Search for session in global storage
    const session = sessions.find(s => s.code === sessionCode);

    if (session) {
      // Ensure participants is an array
      const participants = Array.isArray(session.participants)
        ? session.participants
        : [];

      // Session found - navigate to waiting room
      navigate('/session/waiting', {
        state: {
          sessionType: session.type,
          sessionCode: session.code,
          groupName: session.name,
          members: participants,
          sessionId: session.id,
          isCreator: false, // User joined via code, not the creator
        }
      });
    } else {
      setError('Invalid session code. Please try again.');
      setIsValidating(false);
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    handleJoin(fullCode);
  };

  const isComplete = code.every(digit => digit !== '');

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <IoArrowBack size={24} color={theme.colors.text.primary} />
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.iconContainer}>
          <div style={styles.iconCircle}>
            🎯
          </div>
        </div>

        <h1 style={styles.title}>Join with Code</h1>
        <p style={styles.subtitle}>
          Enter the 6-digit code to join a session
        </p>

        {/* Code Input */}
        <div style={styles.codeInputContainer}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              style={{
                ...styles.codeInput,
                ...(digit ? styles.codeInputFilled : {}),
                ...(error ? styles.codeInputError : {}),
              }}
              disabled={isValidating}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorMessage}>
            <IoClose size={16} />
            {error}
          </div>
        )}

        {/* Validation Success */}
        {isValidating && !error && (
          <div style={styles.successMessage}>
            <IoCheckmark size={16} />
            Validating code...
          </div>
        )}

        {/* Join Button */}
        <button
          onClick={handleSubmit}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            ...styles.joinButton,
            opacity: isComplete && !isValidating ? 1 : 0.5,
            cursor: isComplete && !isValidating ? 'pointer' : 'not-allowed',
          }}
          disabled={!isComplete || isValidating}
        >
          {isValidating ? 'Joining...' : 'Join Session'}
        </button>

        {/* Helper Text */}
        <p style={styles.helperText}>
          Ask the session host for the code or check your notifications
        </p>
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
  header: {
    background: 'white',
    padding: '40px 20px 16px 20px',
    borderBottom: `1px solid ${theme.colors.border.light}`,
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
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
  },
  iconContainer: {
    marginBottom: '24px',
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(59, 130, 246, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    margin: '0 0 8px 0',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    margin: '0 0 40px 0',
    textAlign: 'center',
    lineHeight: '1.5',
  },
  codeInputContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  codeInput: {
    width: '48px',
    height: '56px',
    fontSize: '24px',
    fontWeight: '600',
    textAlign: 'center',
    border: `2px solid ${theme.colors.border.light}`,
    borderRadius: '12px',
    background: 'white',
    color: theme.colors.text.primary,
    outline: 'none',
    transition: 'all 0.2s ease',
    caretColor: theme.colors.primary.main,
  },
  codeInputFilled: {
    borderColor: theme.colors.primary.main,
    background: 'rgba(59, 130, 246, 0.05)',
  },
  codeInputError: {
    borderColor: '#EF4444',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#EF4444',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '20px',
  },
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#22C55E',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '20px',
  },
  joinButton: {
    width: '100%',
    maxWidth: '320px',
    background: theme.colors.primary.main,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    marginBottom: '16px',
  },
  helperText: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
    textAlign: 'center',
    margin: 0,
    lineHeight: '1.5',
    maxWidth: '280px',
  },
};

export default JoinWithCode;

