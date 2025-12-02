import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';

const SignIn = () => {
  const navigate = useNavigate();
  const { loadUserByEmail } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSignIn = () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Try to load user by email and verify password
    const success = loadUserByEmail(email, password);

    if (success) {
      navigate('/home');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignIn();
    }
  };

  return (
    <div style={styles.container}>
      <div className="mobile-screen-content" style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <button
            onClick={() => navigate('/landing')}
            style={styles.backButton}
          >
            ← Back
          </button>
        </div>

        {/* Logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logoCircle}>
            <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
              <path
                d="M30 10 L37 25 L52 25 L41 35 L45 50 L30 40 L15 50 L19 35 L8 25 L23 25 Z"
                fill={theme.colors.primary.main}
              />
            </svg>
          </div>
        </div>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to continue to Savora</p>

        <div style={styles.form}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="john@gmail.com"
              value={email}
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
              style={{
                ...styles.input,
                borderColor: emailError ? theme.colors.error : theme.colors.border.medium,
              }}
            />
            {emailError && <span style={styles.errorText}>{emailError}</span>}
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
              style={styles.input}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            style={{
              ...styles.signInButton,
              opacity: (!email || !password || emailError) ? 0.5 : 1,
            }}
            disabled={!email || !password || emailError}
          >
            Sign In
          </button>

          {/* Sign Up Link */}
          <div style={styles.footer}>
            <span style={styles.footerText}>Don't have an account? </span>
            <button
              onClick={() => navigate('/onboarding')}
              style={styles.linkButton}
            >
              Sign Up
            </button>
          </div>
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
    padding: '24px 20px',
  },
  header: {
    marginBottom: '32px',
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    color: theme.colors.text.primary,
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  logoCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: `${theme.colors.primary.main}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '8px',
    letterSpacing: '-0.5px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '15px',
    color: theme.colors.text.secondary,
    marginBottom: '32px',
    textAlign: 'center',
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
  errorBox: {
    padding: '12px 16px',
    background: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: '10px',
    color: theme.colors.error,
    fontSize: '14px',
    textAlign: 'center',
  },
  signInButton: {
    width: '100%',
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
    marginTop: '8px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '8px',
  },
  footerText: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
  },
  linkButton: {
    background: 'transparent',
    border: 'none',
    color: theme.colors.primary.main,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '0',
    textDecoration: 'underline',
  },
};

export default SignIn;
