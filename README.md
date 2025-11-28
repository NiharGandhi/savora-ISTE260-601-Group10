# Savora - Restaurant Decision App (Web Version)

A beautiful mobile-first React web application for university students to make group dining decisions together.

## Features

- **Splash Screen** - Beautiful animated intro with blue gradient theme
- **User Onboarding** - Multi-step preference collection (budget, distance, cuisines)
- **Home Dashboard** -
  - Welcome message with user name
  - Decision streak tracker
  - Stats cards (Groups, Decisions, Favorites)
  - Quick actions (Create/Join decision)
  - Active sessions list
  - Restaurant recommendations
- **Decision Flow** - Decide now/later with group selection
- **Create Group** - Custom group creation with emoji avatars
- **Preferences** - Per-session preference submission
- **Results** - Beautiful decision results with match scores
- **Explore** - Restaurant recommendations and social feed
- **Settings** - User profile and preferences management

## Tech Stack

- React 18
- React Router v6
- Context API for state management
- CSS-in-JS with inline styles
- Local Storage for persistence

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The app will open at http://localhost:3000 in your browser with an iPhone frame.

## Project Structure

```
src/
├── components/
│   └── MobileFrame.js       # iPhone frame wrapper
├── context/
│   └── UserContext.js       # Global state management
├── pages/
│   ├── SplashScreen.js      # Animated splash screen
│   ├── Onboarding.js        # Multi-step onboarding
│   ├── Home.js              # Main dashboard
│   ├── Decision.js          # Decision creation flow
│   ├── CreateGroup.js       # Group creation
│   ├── Preferences.js       # Session preferences
│   ├── Result.js            # Decision results
│   ├── Explore.js           # Recommendations & social
│   └── Settings.js          # User settings
├── styles/
│   ├── theme.js             # Color scheme & design tokens
│   └── GlobalStyles.css     # Global styles & mobile frame
└── App.js                   # Main app with routing
```

## Color Scheme

- Primary: Blue gradient (#3B82F6 to #1D4ED8)
- Secondary: Purple (#8B5CF6)
- Accent: Cyan (#06B6D4)
- Success: Green (#10B981)
- Background: Light gray (#F9FAFB)

## Design Features

- iPhone frame for authentic mobile experience
- Smooth animations and transitions
- Gradient backgrounds
- Card-based UI
- Bottom navigation
- Responsive touch-friendly buttons
- Beautiful color scheme optimized for university students
# savora-ISTE260-601-Group10
