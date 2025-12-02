import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import { IoStar, IoClose, IoLogoInstagram, IoLogoTiktok, IoLogoWhatsapp, IoSearch } from 'react-icons/io5';

const Explore = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');

  const recommendations = [
    {
      id: 1,
      name: 'Bella Italia',
      cuisine: 'Italian',
      rating: 4.8,
      price: '$$',
      distance: '0.6 mi',
      match: 92,
      dietary: 'Both',
      tagline: 'Authentic Italian cuisine',
      trending: true,
    },
    {
      id: 2,
      name: 'Sushi Master',
      cuisine: 'Japanese',
      rating: 4.7,
      price: '$$$',
      distance: '1.1 mi',
      match: 88,
      dietary: 'Non-Veg',
      tagline: 'Fresh sushi daily',
      trending: false,
    },
    {
      id: 3,
      name: 'Taco Fiesta',
      cuisine: 'Mexican',
      rating: 4.5,
      price: '$',
      distance: '0.8 mi',
      match: 85,
      dietary: 'Both',
      tagline: 'Best tacos in town',
      trending: true,
    },
    {
      id: 4,
      name: 'Dragon Wok',
      cuisine: 'Chinese',
      rating: 4.6,
      price: '$$',
      distance: '1.5 mi',
      match: 82,
      dietary: 'Both',
      tagline: 'Authentic Chinese food',
      trending: false,
    },
    {
      id: 5,
      name: 'Green Leaf Bistro',
      cuisine: 'Vegan',
      rating: 4.9,
      price: '$$',
      distance: '0.4 mi',
      match: 95,
      dietary: 'Veg',
      tagline: 'Plant-based paradise',
      trending: true,
    },
    {
      id: 6,
      name: 'Spice Garden',
      cuisine: 'Indian',
      rating: 4.7,
      price: '$$$',
      distance: '2.0 mi',
      match: 90,
      dietary: 'Both',
      tagline: 'Traditional Indian spices',
      trending: false,
    },
  ];

  const socialShares = [
    {
      id: 1,
      restaurant: 'Campus Burger Joint',
      cuisine: 'American',
      rating: 4.6,
      match: 78,
      dietary: 'Both',
      tagline: 'Best burger ever! Perfect for late night study sessions',
      sharedFrom: 'Instagram',
    },
    {
      id: 2,
      restaurant: 'Green Bowl Cafe',
      cuisine: 'Healthy',
      rating: 4.8,
      match: 88,
      dietary: 'Veg',
      tagline: 'Healthy and delicious! Great vegan options',
      sharedFrom: 'TikTok',
    },
    {
      id: 3,
      restaurant: 'Pizza Paradise',
      cuisine: 'Italian',
      rating: 4.5,
      match: 82,
      dietary: 'Both',
      tagline: 'Group dinner was amazing! Huge slices',
      sharedFrom: 'WhatsApp',
    },
    {
      id: 4,
      restaurant: 'Sushi Master',
      cuisine: 'Japanese',
      rating: 4.7,
      match: 88,
      dietary: 'Non-Veg',
      tagline: 'Fresh sushi daily',
      sharedFrom: 'Instagram',
    },
    {
      id: 5,
      restaurant: 'Dragon Wok',
      cuisine: 'Chinese',
      rating: 4.6,
      match: 82,
      dietary: 'Both',
      tagline: 'Authentic Chinese food',
      sharedFrom: 'TikTok',
    },
  ];

  const getDietaryBadgeStyle = (dietary) => {
    const baseStyle = {
      ...styles.dietaryBadge,
    };

    switch (dietary) {
      case 'Veg':
        return {
          ...baseStyle,
          background: 'rgba(34, 197, 94, 0.15)',
          color: '#22C55E',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        };
      case 'Non-Veg':
        return {
          ...baseStyle,
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#EF4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      case 'Both':
        return {
          ...baseStyle,
          background: 'rgba(59, 130, 246, 0.15)',
          color: '#3B82F6',
          border: '1px solid rgba(59, 130, 246, 0.3)',
        };
      default:
        return baseStyle;
    }
  };

  const getSharedFromStyle = (platform) => {
    switch (platform) {
      case 'Instagram':
        return {
          icon: IoLogoInstagram,
          background: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)',
          color: 'white',
        };
      case 'TikTok':
        return {
          icon: IoLogoTiktok,
          background: '#000000',
          color: '#00F2EA',
        };
      case 'WhatsApp':
        return {
          icon: IoLogoWhatsapp,
          background: '#25D366',
          color: 'white',
        };
      default:
        return {
          icon: null,
          background: 'rgba(107, 114, 128, 0.1)',
          color: theme.colors.text.secondary,
        };
    }
  };

  // Filter restaurants based on search query
  const filteredRecommendations = recommendations.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSocialShares = socialShares.filter(share =>
    share.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    share.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    share.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Explore</h2>
        <div style={styles.searchInputContainer}>
          <IoSearch size={20} style={styles.searchIcon} color={theme.colors.text.secondary} />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={styles.clearButton}>
              <IoClose size={18} color={theme.colors.text.secondary} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'recommended' ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab('recommended')}
        >
          Recommended
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'social' ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab('social')}
        >
          Social Feed
        </button>
      </div>

      <div className="mobile-screen-content" style={styles.content}>
        {activeTab === 'recommended' && (
          <div className="fade-in">
            {searchQuery && (
              <div style={styles.searchResultsHeader}>
                Found {filteredRecommendations.length} restaurant{filteredRecommendations.length !== 1 ? 's' : ''}
              </div>
            )}
            <div style={styles.restaurantsList}>
              {filteredRecommendations.length > 0 ? (
                filteredRecommendations.map((restaurant) => (
                  <div key={restaurant.id} style={styles.restaurantCard}>
                    {/* Match Badge */}
                    <div style={styles.matchBadge}>
                      {restaurant.match}% match
                    </div>

                    <div style={styles.restaurantContent}>
                      <div style={styles.restaurantInfo}>
                        <div style={styles.restaurantNameRow}>
                          <div style={styles.restaurantName}>
                            {restaurant.name}
                            <span style={styles.restaurantRating}>
                              <IoStar size={14} color="#FBBF24" />
                              <span style={styles.ratingValue}>{restaurant.rating}</span>
                            </span>
                          </div>
                        </div>

                        {/* Tagline */}
                        <div style={styles.tagline}>
                          {restaurant.tagline}
                        </div>

                        {/* Badges Row */}
                        <div style={styles.badgesRow}>
                          <span style={styles.cuisineBadge}>{restaurant.cuisine}</span>
                          <span style={getDietaryBadgeStyle(restaurant.dietary)}>
                            {restaurant.dietary === 'Both' ? 'Mixed' : restaurant.dietary}
                          </span>
                          {restaurant.trending && (
                            <span style={styles.trendingBadge}>🔥 Trending</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.noResults}>
                  <span style={styles.noResultsEmoji}>🔍</span>
                  <p style={styles.noResultsText}>No restaurants found</p>
                  <p style={styles.noResultsSubtext}>Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="fade-in">
            {searchQuery && (
              <div style={styles.searchResultsHeader}>
                Found {filteredSocialShares.length} post{filteredSocialShares.length !== 1 ? 's' : ''}
              </div>
            )}
            <div style={styles.restaurantsList}>
              {filteredSocialShares.length > 0 ? (
                filteredSocialShares.map((share) => {
                  const sharedFromStyle = getSharedFromStyle(share.sharedFrom);
                  const IconComponent = sharedFromStyle.icon;

                  return (
                    <div key={share.id} style={styles.restaurantCard}>
                      {/* Shared From Badge */}
                      <div style={{
                        ...styles.sharedFromBadge,
                        background: sharedFromStyle.background,
                        color: sharedFromStyle.color,
                      }}>
                        Shared from {IconComponent && <IconComponent size={14} style={{ marginLeft: '4px' }} />}
                      </div>

                    <div style={styles.restaurantContent}>
                      <div style={styles.restaurantInfo}>
                        <div style={styles.restaurantNameRow}>
                          <div style={styles.restaurantName}>
                            {share.restaurant}
                            <span style={styles.restaurantRating}>
                              <IoStar size={14} color="#FBBF24" />
                              <span style={styles.ratingValue}>{share.rating}</span>
                            </span>
                          </div>
                        </div>

                        {/* Tagline */}
                        <div style={styles.tagline}>
                          {share.tagline}
                        </div>

                        {/* Badges Row */}
                        <div style={styles.badgesRow}>
                          <span style={styles.cuisineBadge}>{share.cuisine}</span>
                          <span style={getDietaryBadgeStyle(share.dietary)}>
                            {share.dietary === 'Both' ? 'Mixed' : share.dietary}
                          </span>
                        </div>
                      </div>
                    </div>
                    </div>
                  );
                })
              ) : (
                <div style={styles.noResults}>
                  <span style={styles.noResultsEmoji}>🔍</span>
                  <p style={styles.noResultsText}>No posts found</p>
                  <p style={styles.noResultsSubtext}>Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        )}
        <div style={{ height: '20px' }}></div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav-container">
        <div style={styles.bottomNav}>
          <button style={styles.navBtn} onClick={() => navigate('/home')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <span style={styles.navLabel}>Home</span>
          </button>
          <button style={styles.navBtn} onClick={() => navigate('/groups')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
            </svg>
            <span style={styles.navLabel}>Groups</span>
          </button>
          <button style={styles.navBtnActive}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span style={styles.navLabel}>Explore</span>
          </button>
          <button style={styles.navBtn} onClick={() => navigate('/settings')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span style={styles.navLabel}>Settings</span>
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
    background: '#F9FAFB',
  },
  header: {
    background: 'white',
    padding: '40px 20px 16px 20px',
    borderBottom: '1px solid #E5E7EB',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    margin: '0 0 16px 0',
  },
  searchInputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    zIndex: 1,
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 42px',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    background: '#F9FAFB',
    transition: 'all 0.2s ease',
  },
  clearButton: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background 0.2s ease',
  },
  tabsContainer: {
    background: 'white',
    display: 'flex',
    padding: '0 20px',
    gap: '8px',
    borderBottom: '1px solid #E5E7EB',
  },
  tab: {
    flex: 1,
    background: 'none',
    border: 'none',
    padding: '14px 16px',
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
  tabActive: {
    color: theme.colors.primary.main,
    borderBottom: `3px solid ${theme.colors.primary.main}`,
  },
  content: {
    padding: '16px',
  },
  searchResultsHeader: {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: '16px',
    padding: '0 4px',
  },
  restaurantsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  restaurantCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '12px 16px',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  matchBadge: {
    position: 'absolute',
    top: '12px',
    right: '16px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    color: 'white',
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)',
  },
  sharedFromBadge: {
    position: 'absolute',
    bottom: '12px',
    right: '16px',
    fontSize: '10px',
    fontWeight: '700',
    padding: '5px 9px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
  },
  restaurantContent: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  restaurantInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  restaurantNameRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '8px',
    paddingRight: '45px',
  },
  restaurantName: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  restaurantRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    padding: '3px 7px',
    borderRadius: '6px',
    background: 'rgba(251, 191, 36, 0.15)',
    flexShrink: 0,
  },
  ratingValue: {
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontSize: '12px',
    lineHeight: '1',
  },
  tagline: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
    lineHeight: '1.4',
  },
  badgesRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  cuisineBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '6px',
    background: 'rgba(147, 197, 253, 0.2)',
    color: '#3B82F6',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    lineHeight: '1',
  },
  dietaryBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '6px',
    lineHeight: '1',
  },
  trendingBadge: {
    background: 'rgba(251, 146, 60, 0.15)',
    color: '#F97316',
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '6px',
    border: '1px solid rgba(251, 146, 60, 0.3)',
    lineHeight: '1',
  },
  noResults: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
  },
  noResultsEmoji: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  noResultsText: {
    fontSize: '18px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '8px',
  },
  noResultsSubtext: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
  },
  bottomNav: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    padding: '0 12px',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    color: theme.colors.text.tertiary,
    transition: 'color 0.2s ease',
  },
  navBtnActive: {
    background: 'none',
    border: 'none',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    color: theme.colors.primary.main,
  },
  navLabel: {
    fontSize: '11px',
    fontWeight: '600',
  },
};

export default Explore;
