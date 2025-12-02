import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Animated background circles */}
      <div style={styles.bgCircle1}></div>
      <div style={styles.bgCircle2}></div>
      <div style={styles.bgCircle3}></div>

      <div style={styles.content}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logoOuter}>
            <div style={styles.logoMiddle}>
              <div style={styles.logoInner}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path
                    d="M30 10 L37 25 L52 25 L41 35 L45 50 L30 40 L15 50 L19 35 L8 25 L23 25 Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* App Name */}
        <h1 style={styles.title}>Savora</h1>
        <p style={styles.subtitle}>Decide Together, Dine Better</p>

        {/* CTA Buttons */}
        <div style={styles.buttonContainer}>
          <button
            onClick={() => navigate('/onboarding')}
            style={styles.signUpButton}
            className="landing-button"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate('/signin')}
            style={styles.signInButton}
            className="landing-button"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bgCircle1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
    top: '-100px',
    right: '-100px',
    animation: 'float 6s ease-in-out infinite',
  },
  bgCircle2: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    bottom: '50px',
    left: '-50px',
    animation: 'float 8s ease-in-out infinite',
    animationDelay: '1s',
  },
  bgCircle3: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
    bottom: '100px',
    right: '30px',
    animation: 'float 7s ease-in-out infinite',
    animationDelay: '2s',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    zIndex: 1,
    padding: '0 32px',
  },
  logoContainer: {
    marginBottom: '16px',
  },
  logoOuter: {
    width: '140px',
    height: '140px',
    borderRadius: '35px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  logoMiddle: {
    width: '110px',
    height: '110px',
    borderRadius: '28px',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    color: 'white',
    margin: '0',
    letterSpacing: '-1.5px',
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
  subtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.95)',
    margin: '0',
    fontWeight: '500',
    letterSpacing: '0.5px',
    marginBottom: '16px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    maxWidth: '300px',
    marginTop: '24px',
  },
  signUpButton: {
    width: '100%',
    padding: '16px 32px',
    background: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '14px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    letterSpacing: '0.3px',
  },
  signInButton: {
    width: '100%',
    padding: '16px 32px',
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '14px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.3px',
  },
};

export default Landing;
