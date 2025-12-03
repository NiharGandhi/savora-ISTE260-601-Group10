import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import { IoChevronDown, IoChevronUp, IoMail, IoChatbubbleEllipses, IoDocumentText, IoSearch } from 'react-icons/io5';

const HelpSupport = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      id: 1,
      category: 'Getting Started',
      question: 'How do I create a group?',
      answer: 'To create a group, tap on "Create Group" from the Home screen. You can then select members from your contacts or invite them later. Once created, you can start making dining decisions together!',
    },
    {
      id: 2,
      category: 'Getting Started',
      question: 'How do I join a session with a code?',
      answer: 'Tap on "Join using Code" from the Home screen. Enter the session code that was shared with you, and you\'ll be added to the active session.',
    },
    {
      id: 3,
      category: 'Preferences',
      question: 'How do I update my dining preferences?',
      answer: 'Go to Settings > Your Preferences and tap "Edit Preferences". You can update your budget range, distance preferences, favorite cuisines, and dietary restrictions.',
    },
    {
      id: 4,
      category: 'Preferences',
      question: 'Can I change my preferences after joining a session?',
      answer: 'Yes! You can update your preferences at any time during a session. Your updated preferences will be used for future recommendations in that session.',
    },
    {
      id: 5,
      category: 'Decisions',
      question: 'How does the decision-making process work?',
      answer: 'Once everyone has set their preferences, Savora will find restaurants that match all members\' requirements. The app considers budget, distance, cuisine preferences, and dietary restrictions to suggest the best matches.',
    },
    {
      id: 6,
      category: 'Decisions',
      question: 'What if I don\'t like any of the suggested restaurants?',
      answer: 'You can view additional matches or update your preferences to get different recommendations. You can also suggest specific restaurants to your group.',
    },
    {
      id: 7,
      category: 'Groups',
      question: 'How many people can be in a group?',
      answer: 'There\'s no strict limit, but we recommend keeping groups under 10 people for the best decision-making experience. Larger groups may have fewer matching options.',
    },
    {
      id: 8,
      category: 'Groups',
      question: 'Can I leave a group?',
      answer: 'Yes, you can leave a group at any time. Go to Groups, select the group you want to leave, and tap the leave option. Note that you\'ll need to be re-invited to join again.',
    },
    {
      id: 9,
      category: 'Account',
      question: 'How do I reset my password?',
      answer: 'Currently, password reset is not available in-app. If you\'ve forgotten your password, please contact our support team for assistance.',
    },
    {
      id: 10,
      category: 'Account',
      question: 'Can I change my email address?',
      answer: 'Email changes are currently not available in the app. Please contact support if you need to update your email address.',
    },
    {
      id: 11,
      category: 'Technical',
      question: 'The app is not loading properly. What should I do?',
      answer: 'Try closing and reopening the app. If the issue persists, clear your browser cache or restart your device. If problems continue, contact our support team.',
    },
    {
      id: 12,
      category: 'Technical',
      question: 'I\'m not receiving notifications. How can I fix this?',
      answer: 'Check your device\'s notification settings for the app. Make sure notifications are enabled in your phone settings and within the app\'s notification preferences.',
    },
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const categories = ['All', 'Getting Started', 'Preferences', 'Decisions', 'Groups', 'Account', 'Technical'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const displayFaqs = selectedCategory === 'All' 
    ? filteredFaqs 
    : filteredFaqs.filter(faq => faq.category === selectedCategory);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
        <h2 style={styles.title}>Help & Support</h2>
        <div style={{ width: '40px' }} />
      </div>

      <div className="mobile-screen-content" style={styles.content}>
        {/* Search Bar */}
        <div style={styles.searchSection}>
          <div style={styles.searchContainer}>
            <IoSearch size={20} color={theme.colors.text.secondary} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-focus"
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Categories */}
        <div style={styles.categoriesSection}>
          <div style={styles.categoriesContainer}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'category-button-active' : 'category-button'}
                style={{
                  ...styles.categoryButton,
                  ...(selectedCategory === category ? styles.categoryButtonActive : {}),
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'Frequently Asked Questions' : `${selectedCategory} FAQs`}
          </h3>
          {displayFaqs.length > 0 ? (
            <div style={styles.faqList}>
              {displayFaqs.map((faq) => (
                <div key={faq.id} style={styles.faqItem}>
                  <button
                    className="faq-question-button"
                    style={styles.faqQuestion}
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span style={styles.faqQuestionText}>{faq.question}</span>
                    {expandedFaq === faq.id ? (
                      <IoChevronUp size={20} color={theme.colors.text.secondary} />
                    ) : (
                      <IoChevronDown size={20} color={theme.colors.text.secondary} />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div style={styles.faqAnswer}>
                      <div style={styles.faqCategory}>{faq.category}</div>
                      <div style={styles.faqAnswerText}>{faq.answer}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔍</div>
              <div style={styles.emptyText}>No results found for "{searchQuery}"</div>
              <div style={styles.emptySubtext}>Try searching with different keywords</div>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Still need help?</h3>
          <div style={styles.contactCard}>
            <div style={styles.contactItem}>
              <div style={styles.contactIcon}>
                <IoMail size={24} color={theme.colors.primary.main} />
              </div>
              <div style={styles.contactInfo}>
                <div style={styles.contactLabel}>Email Support</div>
                <div style={styles.contactValue}>support@savora.com</div>
              </div>
            </div>
            <div style={styles.contactItem}>
              <div style={styles.contactIcon}>
                <IoChatbubbleEllipses size={24} color={theme.colors.primary.main} />
              </div>
              <div style={styles.contactInfo}>
                <div style={styles.contactLabel}>Response Time</div>
                <div style={styles.contactValue}>Within 24 hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Resources</h3>
          <div style={styles.resourcesList}>
            <button
              className="resource-item-button"
              style={styles.resourceItem}
              onClick={() => navigate('/coming-soon', {
                state: {
                  featureName: 'User Guide',
                  description: 'A comprehensive guide to using all features of Savora.',
                },
              })}
            >
              <div style={styles.resourceIcon}>
                <IoDocumentText size={20} color={theme.colors.primary.main} />
              </div>
              <div style={styles.resourceText}>
                <div style={styles.resourceTitle}>User Guide</div>
                <div style={styles.resourceSubtitle}>Complete guide to Savora</div>
              </div>
              <span style={styles.menuArrow}>→</span>
            </button>
          </div>
        </div>

        <div style={{ height: '20px' }}></div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#F3F4F6',
  },
  header: {
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '40px 20px 16px 20px',
    borderBottom: '1px solid #E5E7EB',
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    margin: 0,
  },
  content: {
    padding: '16px',
  },
  searchSection: {
    marginBottom: '20px',
  },
  searchContainer: {
    position: 'relative',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    background: 'white',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  categoriesSection: {
    marginBottom: '20px',
  },
  categoriesContainer: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '4px',
    WebkitOverflowScrolling: 'touch',
  },
  categoryButton: {
    padding: '8px 16px',
    border: `2px solid ${theme.colors.border.medium}`,
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  categoryButtonActive: {
    background: theme.colors.primary.main,
    color: 'white',
    borderColor: theme.colors.primary.main,
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: '12px',
  },
  faqList: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  faqItem: {
    borderBottom: '1px solid #E5E7EB',
  },
  faqQuestion: {
    width: '100%',
    background: 'none',
    border: 'none',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.2s ease',
  },
  faqQuestionText: {
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: '12px',
  },
  faqAnswer: {
    padding: '0 16px 16px 16px',
    background: '#FAFAFA',
  },
  faqCategory: {
    fontSize: '11px',
    fontWeight: '600',
    color: theme.colors.primary.main,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  faqAnswerText: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    lineHeight: '1.6',
  },
  emptyState: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px 24px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '8px',
  },
  emptySubtext: {
    fontSize: '14px',
    color: theme.colors.text.secondary,
  },
  contactCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 0',
  },
  contactIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: `${theme.colors.primary.main}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
    marginBottom: '4px',
  },
  contactValue: {
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  resourcesList: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  resourceItem: {
    width: '100%',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #E5E7EB',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  resourceIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: `${theme.colors.primary.main}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resourceText: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: '2px',
  },
  resourceSubtitle: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
  },
  menuArrow: {
    fontSize: '20px',
    color: theme.colors.text.secondary,
  },
};

export default HelpSupport;

