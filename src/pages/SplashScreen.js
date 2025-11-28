import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger animations
    setTimeout(() => setShowContent(true), 100);

    const timer = setTimeout(() => {
      const hasOnboarded = localStorage.getItem('savora_user');
      if (hasOnboarded) {
        navigate('/home');
      } else {
        navigate('/onboarding');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      {/* Animated background circles */}
      <div style={styles.bgCircle1}></div>
      <div style={styles.bgCircle2}></div>
      <div style={styles.bgCircle3}></div>

      <div style={{
        ...styles.content,
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Animated Logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logoOuter}>
            <div style={styles.logoMiddle}>
              <div style={styles.logoInner}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path
                    d="M30 10 L37 25 L52 25 L41 35 L45 50 L30 40 L15 50 L19 35 L8 25 L23 25 Z"
                    fill="white"
                    style={{
                      animation: 'starPulse 2s ease-in-out infinite',
                      transformOrigin: 'center',
                    }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* App Name */}
        <h1 style={styles.title}>Savora</h1>
        <p style={styles.subtitle}>Decide Together, Dine Better</p>

        {/* Loading dots */}
        <div style={styles.loadingContainer}>
          <div style={{ ...styles.dot, animationDelay: '0s' }}></div>
          <div style={{ ...styles.dot, animationDelay: '0.2s' }}></div>
          <div style={{ ...styles.dot, animationDelay: '0.4s' }}></div>
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
    animation: 'logoFloat 3s ease-in-out infinite',
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
    animation: 'titleSlideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s backwards',
  },
  subtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.95)',
    margin: '0',
    fontWeight: '500',
    letterSpacing: '0.5px',
    animation: 'titleSlideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s backwards',
  },
  loadingContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '40px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'white',
    animation: 'dotPulse 1.5s ease-in-out infinite',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.5)',
  },
};

// Add keyframe animations to the stylesheet
const styleSheet = document.styleSheets[0];

if (!document.querySelector('[data-splash-animations]')) {
  const style = document.createElement('style');
  style.setAttribute('data-splash-animations', 'true');
  style.textContent = `
    @keyframes logoFloat {
      0%, 100% {
        transform: translateY(0px) scale(1);
      }
      50% {
        transform: translateY(-15px) scale(1.05);
      }
    }

    @keyframes starPulse {
      0%, 100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
      50% {
        transform: scale(1.2) rotate(180deg);
        opacity: 0.8;
      }
    }

    @keyframes titleSlideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes dotPulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.5);
        opacity: 0.5;
      }
    }
  `;
  document.head.appendChild(style);
}

export default SplashScreen;
