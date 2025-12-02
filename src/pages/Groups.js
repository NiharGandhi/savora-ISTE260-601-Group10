import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';
import { IoPeople, IoRestaurant, IoPizza, IoBeer, IoCafe, IoFastFood, IoWine, IoIceCream, IoNutrition, IoBriefcase, IoHome, IoSearch, IoPeopleCircle, IoSearchCircle } from 'react-icons/io5';

const Groups = () => {
  const navigate = useNavigate();
  const { groups } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

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
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>My Groups</h2>
        <button
          style={styles.addButton}
          onClick={() => navigate('/create-group')}
        >
          +
        </button>
      </div>

      <div className="mobile-screen-content" style={styles.content}>
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
              <div key={group.id} style={styles.groupCard}>
                <div style={styles.groupAvatar}>{group.photo ? getIconComponent(group.photo) : <IoPeople size={24} color="#6366F1" />}</div>
                <div style={styles.groupInfo}>
                  <div style={styles.groupName}>{group.name}</div>
                  <div style={styles.groupDescription}>
                    {group.description || 'No description'}
                  </div>
                  <div style={styles.groupMembers}>
                    {group.members.length} members
                  </div>
                </div>
                <button
                  style={styles.viewButton}
                  onClick={() => navigate(`/group/${group.id}`)}
                >
                  →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            {groups.length === 0 ? (
              <>
                <div style={styles.emptyIcon}>
                  <IoPeopleCircle size={80} color={theme.colors.text.tertiary} />
                </div>
                <h3 style={styles.emptyTitle}>No Groups Yet</h3>
                <p style={styles.emptyText}>
                  Create a group to start making dining decisions together
                </p>
                <button
                  style={styles.createButton}
                  onClick={() => navigate('/create-group')}
                >
                  Create Your First Group
                </button>
              </>
            ) : (
              <>
                <div style={styles.emptyIcon}>
                  <IoSearchCircle size={80} color={theme.colors.text.tertiary} />
                </div>
                <h3 style={styles.emptyTitle}>No Groups Found</h3>
                <p style={styles.emptyText}>
                  No groups match "{searchQuery}"
                </p>
              </>
            )}
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
          <button style={styles.navBtnActive}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
            </svg>
            <span style={styles.navLabel}>Groups</span>
          </button>
          <button style={styles.navBtn} onClick={() => navigate('/explore')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  addButton: {
    background: theme.colors.primary.main,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    width: '40px',
    height: '40px',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: '16px',
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
    boxShadow: theme.shadows.sm,
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
    gap: '16px',
  },
  groupCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: theme.shadows.sm,
  },
  groupAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: theme.colors.background.gray,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    flexShrink: 0,
  },
  groupInfo: {
    flex: 1,
    minWidth: 0,
  },
  groupName: {
    fontSize: '18px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '4px',
  },
  groupDescription: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  groupMembers: {
    fontSize: '12px',
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  viewButton: {
    background: theme.colors.primary.main,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    width: '40px',
    height: '40px',
    fontSize: '20px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
  },
  emptyIcon: {
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  createButton: {
    background: theme.colors.primary.gradient,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    position: 'relative',
    zIndex: 10,
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

export default Groups;
