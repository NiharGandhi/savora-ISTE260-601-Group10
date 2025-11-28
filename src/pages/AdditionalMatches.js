import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';
import { IoArrowBack, IoHeart, IoHeartOutline, IoStar, IoChevronForward } from 'react-icons/io5';

const AdditionalMatches = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { addFavorite } = useUser();
  const [favoritedRestaurants, setFavoritedRestaurants] = useState(new Set());

  // Mock data - in real app from backend
  const totalPeople = 8;
  
  const restaurants = [
    {
      id: 1,
      name: 'Sushi Paradise',
      cuisine: 'Japanese',
      budget: 'Upscale',
      distance: '1.2 km',
      rating: 4.8,
      matchCount: 7,
      badge: 'Perfect Match',
      badgeColor: '#10B981',
      cuisineType: 'Japanese',
      dietary: 'Non-Veg',
      image: '🍣',
    },
    {
      id: 2,
      name: 'Burger Haven',
      cuisine: 'American',
      budget: 'Budget Friendly',
      distance: '0.8 km',
      rating: 4.5,
      matchCount: 6,
      badge: 'Trending',
      badgeColor: '#F59E0B',
      cuisineType: 'American',
      dietary: 'Mixed',
      image: '🍔',
    },
    {
      id: 3,
      name: 'Green Garden',
      cuisine: 'Mediterranean',
      budget: 'Moderate',
      distance: '3.5 km',
      rating: 4.7,
      matchCount: 6,
      badge: 'Strong Match',
      badgeColor: '#3B82F6',
      cuisineType: 'Mediterranean',
      dietary: 'Veg',
      image: '🥗',
    },
    {
      id: 4,
      name: 'Spice Route',
      cuisine: 'Indian',
      budget: 'Moderate',
      distance: '2.1 km',
      rating: 4.6,
      matchCount: 5,
      badge: 'New Place',
      badgeColor: '#8B5CF6',
      cuisineType: 'Indian',
      dietary: 'Mixed',
      image: '🍛',
    },
    {
      id: 5,
      name: 'Pasta Palace',
      cuisine: 'Italian',
      budget: 'Upscale',
      distance: '1.8 km',
      rating: 4.9,
      matchCount: 7,
      badge: 'Hidden Gem',
      badgeColor: '#EC4899',
      cuisineType: 'Italian',
      dietary: 'Non-Veg',
      image: '🍝',
    },
  ];

  const handleToggleFavorite = (restaurantId) => {
    const newFavorites = new Set(favoritedRestaurants);
    if (newFavorites.has(restaurantId)) {
      newFavorites.delete(restaurantId);
    } else {
      newFavorites.add(restaurantId);
      const restaurant = restaurants.find(r => r.id === restaurantId);
      addFavorite(restaurant);
    }
    setFavoritedRestaurants(newFavorites);
  };

  const getDietaryBadgeStyle = (dietary) => {
    switch(dietary) {
      case 'Veg':
        return { background: '#10B98115', color: '#10B981' };
      case 'Non-Veg':
        return { background: '#EF444415', color: '#EF4444' };
      case 'Mixed':
        return { background: '#8B5CF615', color: '#8B5CF6' };
      default:
        return { background: '#F3F4F6', color: theme.colors.text.secondary };
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <IoArrowBack size={24} color={theme.colors.text.primary} />
          </button>
          <h1 style={styles.mainTitle}>Additional Matches</h1>
        </div>
        <p style={styles.tagline}>Based on everyone's preferences...</p>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} style={styles.restaurantCard}>
            {/* Top Row - Badge, People Count, Favorite */}
            <div style={styles.cardTopRow}>
              <div style={styles.leftGroup}>
                <div style={{...styles.badge, background: restaurant.badgeColor}}>
                  {restaurant.badge}
                </div>
                <span style={styles.peopleCount}>
                  {restaurant.matchCount}/{totalPeople} people
                </span>
              </div>
              <button
                onClick={() => handleToggleFavorite(restaurant.id)}
                onMouseDown={(e) => e.preventDefault()}
                style={styles.favoriteButton}
              >
                {favoritedRestaurants.has(restaurant.id) ? (
                  <IoHeart size={24} color="#EF4444" />
                ) : (
                  <IoHeartOutline size={24} color={theme.colors.text.secondary} />
                )}
              </button>
            </div>

            {/* Restaurant Name */}
            <h3 style={styles.restaurantName}>{restaurant.name}</h3>

            {/* Meta Info */}
            <div style={styles.metaRow}>
              <span>{restaurant.cuisine}</span>
              <span style={styles.separator}>|</span>
              <span>{restaurant.budget}</span>
              <span style={styles.separator}>|</span>
              <span>{restaurant.distance}</span>
            </div>

            {/* Rating */}
            <div style={styles.ratingRow}>
              <IoStar size={16} color="#F59E0B" />
              <span style={styles.ratingText}>{restaurant.rating}</span>
            </div>

            {/* Badges */}
            <div style={styles.badgesRow}>
              <span style={styles.cuisineBadge}>{restaurant.cuisineType}</span>
              <span style={{
                ...styles.dietaryBadge,
                ...getDietaryBadgeStyle(restaurant.dietary),
              }}>
                {restaurant.dietary}
              </span>
            </div>

            {/* More Details Button */}
            <button
              onMouseDown={(e) => e.preventDefault()}
              style={styles.moreDetailsButton}
              onClick={() => alert(`Details for ${restaurant.name}`)}
            >
              <span>More Details</span>
              <IoChevronForward size={18} />
            </button>
          </div>
        ))}

        {/* Spacer */}
        <div style={{ height: '20px' }} />
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <button
          onClick={() => navigate('/home')}
          onMouseDown={(e) => e.preventDefault()}
          style={styles.homeButton}
        >
          Return to Home
        </button>
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
    margin: 0,
    paddingLeft: '32px',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  restaurantCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: `1px solid ${theme.colors.border.light}`,
  },
  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  leftGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  badge: {
    color: 'white',
    fontSize: '11px',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '12px',
    letterSpacing: '0.2px',
  },
  peopleCount: {
    fontSize: '12px',
    fontWeight: '600',
    color: theme.colors.text.secondary,
    background: '#F3F4F6',
    padding: '6px 10px',
    borderRadius: '12px',
  },
  favoriteButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: '20px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    margin: 0,
    marginBottom: '8px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: theme.colors.text.secondary,
    marginBottom: '8px',
  },
  separator: {
    color: theme.colors.border.light,
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px',
  },
  ratingText: {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  badgesRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  cuisineBadge: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#3B82F6',
    background: '#3B82F615',
    padding: '6px 12px',
    borderRadius: '12px',
  },
  dietaryBadge: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '12px',
  },
  moreDetailsButton: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#F9FAFB',
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
  },
  footer: {
    background: 'white',
    padding: '20px',
    borderTop: `1px solid ${theme.colors.border.light}`,
  },
  homeButton: {
    width: '100%',
    padding: '16px',
    background: theme.colors.primary.main,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
  },
};

export default AdditionalMatches;

