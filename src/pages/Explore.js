import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';

const Explore = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recommended');

  const recommendations = [
    {
      id: 1,
      name: 'Bella Italia',
      cuisine: 'Italian',
      rating: 4.8,
      price: '$$',
      distance: '0.6 mi',
      image: '🍝',
      trending: true,
    },
    {
      id: 2,
      name: 'Sushi Master',
      cuisine: 'Japanese',
      rating: 4.7,
      price: '$$$',
      distance: '1.1 mi',
      image: '🍣',
      trending: false,
    },
    {
      id: 3,
      name: 'Taco Fiesta',
      cuisine: 'Mexican',
      rating: 4.5,
      price: '$',
      distance: '0.8 mi',
      image: '🌮',
      trending: true,
    },
    {
      id: 4,
      name: 'Dragon Wok',
      cuisine: 'Chinese',
      rating: 4.6,
      price: '$$',
      distance: '1.5 mi',
      image: '🥢',
      trending: false,
    },
  ];

  const socialShares = [
    {
      id: 1,
      user: 'Sarah M.',
      restaurant: 'Campus Burger Joint',
      image: '🍔',
      comment: 'Best burger ever! Perfect for late night study sessions',
      likes: 45,
      timeAgo: '2h ago',
    },
    {
      id: 2,
      user: 'Mike R.',
      restaurant: 'Green Bowl Cafe',
      image: '🥗',
      comment: 'Healthy and delicious! Great vegan options',
      likes: 32,
      timeAgo: '5h ago',
    },
    {
      id: 3,
      user: 'Emily L.',
      restaurant: 'Pizza Paradise',
      image: '🍕',
      comment: 'Group dinner was amazing! Huge slices',
      likes: 58,
      timeAgo: '1d ago',
    },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Explore</h2>
        <button style={styles.searchButton}>🔍</button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
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
            <div style={styles.filterSection}>
              <div style={styles.filterLabel}>Filter by:</div>
              <div style={styles.filterButtons}>
                <button style={styles.filterButton}>All</button>
                <button style={styles.filterButton}>Nearby</button>
                <button style={styles.filterButton}>Trending 🔥</button>
                <button style={styles.filterButton}>Top Rated ⭐</button>
              </div>
            </div>

            <div style={styles.restaurantGrid}>
              {recommendations.map((restaurant) => (
                <div key={restaurant.id} style={styles.restaurantCard}>
                  {restaurant.trending && (
                    <div style={styles.trendingBadge}>🔥 Trending</div>
                  )}
                  <div style={styles.cardImage}>{restaurant.image}</div>
                  <div style={styles.cardContent}>
                    <h3 style={styles.cardTitle}>{restaurant.name}</h3>
                    <div style={styles.cardMeta}>
                      {restaurant.cuisine} • {restaurant.price}
                    </div>
                    <div style={styles.cardFooter}>
                      <span>⭐ {restaurant.rating}</span>
                      <span>📍 {restaurant.distance}</span>
                    </div>
                    <button style={styles.viewButton}>View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="fade-in">
            <div style={styles.socialFeed}>
              {socialShares.map((share) => (
                <div key={share.id} style={styles.socialCard}>
                  <div style={styles.socialHeader}>
                    <div style={styles.userAvatar}>
                      {share.user.charAt(0)}
                    </div>
                    <div style={styles.socialInfo}>
                      <div style={styles.userName}>{share.user}</div>
                      <div style={styles.timeAgo}>{share.timeAgo}</div>
                    </div>
                  </div>

                  <div style={styles.socialContent}>
                    <div style={styles.socialRestaurant}>
                      <div style={styles.socialImage}>{share.image}</div>
                      <div style={styles.socialRestaurantName}>
                        {share.restaurant}
                      </div>
                    </div>
                    <p style={styles.socialComment}>{share.comment}</p>
                  </div>

                  <div style={styles.socialActions}>
                    <button style={styles.likeButton}>
                      ❤️ {share.likes}
                    </button>
                    <button style={styles.commentButton}>💬 Comment</button>
                    <button style={styles.shareButton}>🔗 Share</button>
                  </div>
                </div>
              ))}
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-settings-icon lucide-settings">
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #E5E7EB',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    margin: 0,
  },
  searchButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  tabs: {
    background: 'white',
    display: 'flex',
    padding: '0 24px',
    borderBottom: '1px solid #E5E7EB',
  },
  tab: {
    background: 'none',
    border: 'none',
    padding: '16px 0',
    marginRight: '32px',
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.25s ease',
  },
  tabActive: {
    color: theme.colors.primary.main,
    borderBottom: `2px solid ${theme.colors.primary.main}`,
  },
  content: {
    padding: '16px',
  },
  filterSection: {
    marginBottom: '24px',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '12px',
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
  },
  filterButton: {
    background: 'white',
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '20px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  restaurantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  restaurantCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: theme.shadows.sm,
    position: 'relative',
  },
  trendingBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: theme.colors.warning,
    color: 'white',
    fontSize: '10px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '8px',
    zIndex: 1,
  },
  cardImage: {
    height: '100px',
    background: theme.colors.background.gray,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
  },
  cardContent: {
    padding: '12px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '4px',
  },
  cardMeta: {
    fontSize: '12px',
    color: theme.colors.text.secondary,
    marginBottom: '8px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: theme.colors.text.secondary,
    marginBottom: '12px',
  },
  viewButton: {
    width: '100%',
    background: theme.colors.primary.main,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  socialFeed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  socialCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: theme.shadows.sm,
  },
  socialHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: theme.colors.primary.main,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
  },
  socialInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  timeAgo: {
    fontSize: '12px',
    color: theme.colors.text.secondary,
  },
  socialContent: {
    marginBottom: '12px',
  },
  socialRestaurant: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
    background: theme.colors.background.light,
    padding: '12px',
    borderRadius: '12px',
  },
  socialImage: {
    fontSize: '32px',
  },
  socialRestaurantName: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  socialComment: {
    fontSize: '14px',
    color: theme.colors.text.primary,
    lineHeight: '1.5',
  },
  socialActions: {
    display: 'flex',
    gap: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #E5E7EB',
  },
  likeButton: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  commentButton: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
  },
  shareButton: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    marginLeft: 'auto',
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
