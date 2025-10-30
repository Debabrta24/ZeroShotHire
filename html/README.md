# ZeroShotHire - HTML Version

A comprehensive AI-powered career guidance platform built with pure HTML, CSS, and JavaScript.

## Overview

ZeroShotHire is a standalone HTML/CSS/JavaScript version of a career guidance platform designed to help individuals discover their ideal career path, develop necessary skills, and achieve their professional goals.

## Quick Start

1. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)
2. Navigate between pages using the sidebar menu or feature cards on the home page
3. All features work without requiring any server or build tools

## Features

### Core Features

- **Dashboard** - Track your career progress, view stats, and access quick actions
- **Career Analysis** - Complete comprehensive multi-step assessment to discover your ideal career
- **Career Recommendations** - View AI-powered career matches with detailed insights
- **Learning Path** - Follow personalized roadmap with curated courses and milestones
- **Career Roadmaps** - Explore detailed career progression paths and requirements
- **Progress Tracking** - Track achievements, badges, and learning milestones
- **Job Matches** - Find job positions tailored to your career profile

### Career Tools

- **AI Career Coach** - Chat with AI assistant for personalized career advice
- **Skill Assessments** - Test your skills with interactive assessments
- **Salary Calculator** - Calculate expected salary based on role, location, and experience
- **Interview Simulator** - Practice interviews with different scenarios
- **Networking Events** - Discover career fairs, workshops, and networking opportunities
- **Career Comparison** - Compare different career paths side-by-side
- **Goal Tracker** - Set and track your career goals with progress visualization
- **Company Matcher** - Find companies that match your values and preferences
- **Career News** - Stay updated with latest career trends and industry news

### Professional Development

- **LinkedIn Booster** - Optimize your LinkedIn profile for maximum visibility
- **Resume Builder** - Create professional resume with templates
- **Internship Opportunities** - Browse curated internship listings
- **DSA Practice** - Practice data structures and algorithms with company-specific problems
- **Spoken English** - Improve communication skills with interactive courses

### Account Management

- **Profile** - Manage personal information, skills, and career preferences
- **Settings** - Configure account preferences, notifications, and theme

## Pages

### All Available Pages (23 pages)

1. `index.html` - Landing page with all features
2. `dashboard.html` - Main dashboard with stats and overview
3. `career-analysis.html` - Multi-step career assessment form
4. `recommendations.html` - AI-powered career recommendations
5. `learning-path.html` - Personalized learning roadmap with timeline
6. `career-roadmaps.html` - Career progression paths
7. `progress.html` - Achievement tracking and badges
8. `jobs.html` - Job listings and matches
9. `ai-coach.html` - AI chat interface for career guidance
10. `assessments.html` - Skill testing and certifications
11. `salary-calculator.html` - Interactive salary estimation tool
12. `interview-simulator.html` - Mock interview practice
13. `events.html` - Networking events and career fairs
14. `career-comparison.html` - Side-by-side career comparison
15. `goal-tracker.html` - Goal setting and progress tracking
16. `company-matcher.html` - Company culture fit analysis
17. `career-news.html` - Industry news and trends
18. `linkedin-booster.html` - LinkedIn profile optimization
19. `resume-builder.html` - Resume creation tool
20. `internship.html` - Internship opportunity listings
21. `dsa.html` - DSA practice platform
22. `spoken-english.html` - English learning courses
23. `profile.html` - User profile management
24. `settings.html` - Account settings and preferences

## Technical Details

### Technologies Used

- **Pure HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Variables
- **Vanilla JavaScript** - No frameworks or dependencies (except Lucide icons from CDN)
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - Automatic theme switching with localStorage persistence

### File Structure

```
html/
├── index.html                  # Landing page
├── dashboard.html              # Main dashboard
├── career-analysis.html        # Career assessment
├── recommendations.html        # Career recommendations
├── learning-path.html          # Learning roadmap
├── career-roadmaps.html        # Career paths
├── progress.html               # Progress tracking
├── jobs.html                   # Job matches
├── profile.html                # User profile
├── settings.html               # Settings
├── ai-coach.html               # AI career coach
├── assessments.html            # Skill assessments
├── salary-calculator.html      # Salary calculator
├── interview-simulator.html    # Interview practice
├── events.html                 # Networking events
├── career-comparison.html      # Career comparison
├── goal-tracker.html           # Goal tracking
├── company-matcher.html        # Company matching
├── career-news.html            # Career news
├── linkedin-booster.html       # LinkedIn optimization
├── resume-builder.html         # Resume builder
├── internship.html             # Internship listings
├── dsa.html                    # DSA practice
├── spoken-english.html         # English courses
├── styles.css                  # All styling
├── script.js                   # Common JavaScript
├── nav-template.html           # Navigation template
├── README.md                   # This file
└── WEBSITE_INFORMATION.txt     # Comprehensive documentation
```

### Features

#### Dark Mode Support
- Toggle between light and dark themes
- Theme preference saved in localStorage
- Smooth transitions between themes
- Consistent styling across all pages

#### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Collapsible sidebar navigation
- Touch-friendly interactions

#### Interactive Elements
- Smooth animations and transitions
- Form validation
- Progress tracking
- Achievement celebrations
- Chat interface
- Interactive calculators

#### Data Management
- LocalStorage for theme persistence
- In-memory data structures
- No server-side dependencies
- Works offline after initial load

## Browser Compatibility

Fully supported in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

## Key Components

### Navigation
- Persistent sidebar with categorized links
- Collapsible menu for mobile
- Active page highlighting
- Theme toggle button

### Cards
- Consistent card design across all pages
- Interactive hover effects
- Clear visual hierarchy
- Responsive grid layouts

### Forms
- Multi-step wizard forms
- Real-time validation
- Tag input for skills/interests
- Progress indicators

### Data Visualization
- Progress bars
- Stat cards with trends
- Match scores
- Timeline components

## Customization

### Changing Colors
Edit CSS variables in `styles.css`:

```css
:root {
    --primary: #3b82f6;       /* Primary brand color */
    --success: #10b981;       /* Success color */
    --warning: #f59e0b;       /* Warning color */
    --danger: #ef4444;        /* Danger color */
    /* ... more variables */
}
```

### Adding New Pages
1. Copy an existing HTML file as a template
2. Update the page title and content
3. Add navigation link to sidebar
4. Maintain consistent structure

### Modifying Styles
All styling is centralized in `styles.css`:
- Global styles and resets
- Component styles
- Utility classes
- Responsive breakpoints
- Dark mode overrides

## Development Notes

### No Build Process
- All files can be edited directly
- No compilation or bundling required
- Instant preview in browser
- Simple deployment

### State Management
- LocalStorage for persistent data
- Session-based data in memory
- No database required for demo

### External Dependencies
- Lucide Icons (via CDN) - Only external dependency
- All other functionality is self-contained

## Future Enhancements

Potential improvements for production version:
- Backend API integration
- User authentication
- Real-time data updates
- Advanced analytics
- Social features
- Mobile apps
- Email notifications
- Data export/import
- API integrations with job boards
- AI-powered content generation

## Support

For questions or issues:
- Check `WEBSITE_INFORMATION.txt` for comprehensive documentation
- Review individual page source code
- Inspect browser console for errors

## License

This is a demonstration project showcasing career guidance platform capabilities.

## Credits

- Icons: Lucide Icons (https://lucide.dev)
- Fonts: System font stack
- Design: Custom design system

---

**Version:** 1.0.0  
**Last Updated:** October 2025  
**Total Pages:** 24
