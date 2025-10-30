# AI-Powered Smart Career Path & Guidance System - Design Guidelines

## Design Approach
**Reference-Based + Educational Platform Hybrid**: Drawing inspiration from modern educational platforms (Coursera, Khan Academy) combined with professional career platforms (LinkedIn Learning, Pathstream), enhanced with AI-driven visualization patterns from data analytics dashboards.

## Core Design Principles
1. **Educational & Approachable**: Soft, inviting aesthetics that reduce career anxiety
2. **Data-Driven Clarity**: Visual information hierarchy that makes complex career data digestible
3. **Progressive Disclosure**: Layered information revealing deeper insights on interaction
4. **Celebratory Feedback**: Positive reinforcement for user progress and achievements

## Color Palette

### Primary Colors
- **Primary Blue**: 220 85% 60% (Trust, professionalism, career guidance)
- **Deep Purple**: 260 70% 55% (AI intelligence, innovation)
- **Light Background**: 220 25% 97% (Clean, spacious foundation)
- **Dark Background**: 220 20% 12% (Professional dark mode)

### Accent & Support Colors
- **Success Green**: 145 65% 50% (Achievements, completed milestones)
- **Highlight Indigo**: 245 75% 65% (Interactive elements, CTAs)
- **Warning Amber**: 35 85% 55% (Skill gaps, areas needing attention)
- **Neutral Gray**: 220 10% 45% (Secondary text, borders)

### Gradients
- **Hero Gradient**: Soft diagonal from primary blue to deep purple (220 85% 60% → 260 70% 55%)
- **Card Accents**: Subtle vertical gradients with 5-10% lightness variation
- **Chart Backgrounds**: Radial gradients from white to light blue/purple tints

## Typography

### Font Families
- **Primary**: Inter (CDN: Google Fonts) - Clean, modern, excellent readability
- **Accent/Headers**: Outfit (CDN: Google Fonts) - Distinctive, friendly personality
- **Data/Numbers**: JetBrains Mono (for statistics, percentages)

### Type Scale
- **Hero Headline**: text-5xl md:text-6xl lg:text-7xl, font-bold (Outfit)
- **Section Headers**: text-3xl md:text-4xl, font-semibold (Outfit)
- **Card Titles**: text-xl md:text-2xl, font-semibold (Inter)
- **Body Text**: text-base md:text-lg, font-normal (Inter)
- **Captions/Labels**: text-sm, font-medium (Inter)
- **Micro-text**: text-xs (Inter)

## Layout System

### Spacing Primitives
Use Tailwind units: **2, 3, 4, 6, 8, 12, 16, 20, 24** for consistent rhythm
- Component padding: p-4 to p-8
- Section spacing: py-12 md:py-20 lg:py-24
- Card gaps: gap-4 md:gap-6
- Form spacing: space-y-4 to space-y-6

### Grid Structure
- **Dashboard**: 12-column grid with sidebar (collapsed: 16, expanded: 64)
- **Content Cards**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- **Feature Sections**: max-w-7xl mx-auto with px-4 md:px-6 lg:px-8

## Component Library

### Landing Page
**Hero Section** (h-screen with gradient background):
- Large hero image showing diverse students/professionals using technology (positioned right 60% width on desktop, full-width on mobile)
- Dynamic typing animation: "Find Your Perfect Career with AI" (Outfit, text-6xl)
- Subtitle with fade-in: "Personalized guidance powered by intelligent analysis"
- Primary CTA: "Start Career Analysis" (bg-gradient primary to indigo, px-8 py-4, rounded-full, shadow-lg with hover lift)
- Trust indicators: "10,000+ Students Guided" with animated counter

**Features Section** (3-column grid):
- Icon + Title + Description cards with hover scale (1.02) and shadow transitions
- Glassmorphism effect: backdrop-blur-lg bg-white/10 with border border-white/20
- Icons from Heroicons (academic cap, chart bar, light bulb, etc.)

**How It Works** (4-step timeline):
- Horizontal stepper on desktop, vertical on mobile
- Numbered circles with connecting lines, animated on scroll
- Step cards with smooth reveal animations (stagger 100ms)

**Testimonials** (2-column carousel):
- User photo (circular, w-16 h-16), name, role, quote
- 5-star rating visualization
- Auto-rotate every 5 seconds with slide transitions

### User Dashboard
**Sidebar Navigation**:
- Collapsible with smooth width transition (w-16 collapsed, w-64 expanded)
- Icons + labels with tooltip on collapse
- Active state: gradient background + border-l-4 accent color
- Sections: Profile, Recommendations, Learning Path, Progress, Jobs, Settings

**Dashboard Cards**:
- Rounded-2xl with subtle shadow (shadow-md hover:shadow-xl)
- White background in light mode, slate-800 in dark mode
- Padding: p-6
- Header with icon, title, and action button (top-right)

**Data Visualizations**:
- **Career Fit Radar Chart**: 6-axis for skills match (Recharts library)
- **Skill Gap Bar Chart**: Horizontal bars with current vs. required (animated fill)
- **Progress Rings**: Circular progress with percentage in center (Framer Motion)
- Color coding: Green (80-100%), Blue (60-79%), Amber (40-59%), Red (<40%)
- Hover tooltips with detailed breakdowns

### Career Recommendation Page
**Multi-Step Form**:
- Progress bar at top showing 5 steps (w-full h-2 rounded-full)
- Steps: Skills Input, Interests Selection, Education Level, Career Goals, Work Preferences
- Input types: Tag input for skills, checkbox grid for interests, radio cards for education
- Real-time validation with gentle shake animation on errors
- "Next" button with loading spinner during AI processing

**Recommendation Cards** (Top 3):
- Large cards (min-h-80) with career role illustration/icon
- Match percentage with animated circular progress (0 to X% on load)
- Job title (text-3xl, font-bold)
- Salary range with icon
- Growth potential badge (High/Medium/Low with color coding)
- Skills required: Tag list with user's skills highlighted in green
- "View Full Path" button expanding accordion for detailed roadmap

### Learning Path Page
**Timeline Roadmap**:
- Vertical timeline with checkpoints (line connecting circular nodes)
- Nodes: Empty circle (not started), filled circle (in progress), checkmark (completed)
- Timeline phases: Foundations, Core Skills, Advanced Topics, Specialization
- Animated line drawing on scroll (stroke-dashoffset animation)

**Course Module Cards**:
- Grid layout with hover elevation
- Course thumbnail image (16:9 aspect ratio)
- Difficulty badge (Beginner/Intermediate/Advanced with color coding)
- Duration estimate with clock icon
- Progress bar if started (0-100% with gradient fill)
- Checkbox for completion with celebration confetti on check

**Skill Tree Visualization**:
- Interactive node graph showing skill dependencies
- Nodes: Unlocked (colored), Locked (gray), Completed (green check)
- Connecting paths with directional arrows
- Click to expand skill details in modal

### Progress Tracking
**Achievement Badges**:
- Circular badge icons with gradient backgrounds
- Unlock animation: scale from 0 to 1 with bounce
- Badge categories: Learning Milestones, Skill Mastery, Consistency Streaks
- Grid display with earned vs. locked states

**Stats Dashboard**:
- Large number displays with animated count-up
- Icons: Fire (streak), Book (courses completed), Trophy (achievements)
- Weekly activity heatmap (GitHub-style contribution graph)

## Interaction Patterns

### Micro-Interactions
- Button hover: scale(1.05) with 200ms transition
- Card hover: translateY(-4px) + shadow elevation
- Form focus: ring-2 ring-primary with smooth transition
- Checkbox check: checkmark draw animation
- Success actions: Confetti burst using canvas-confetti library

### Page Transitions
- Route changes: Fade-out 150ms → Fade-in 300ms with slight slide-up
- Modal open: Scale 0.95 to 1 + opacity 0 to 1 (200ms)
- Accordion expand: Height auto with max-height transition

### Scroll Animations
- Fade-in-up: Elements start 20px below with opacity 0, animate to position
- Stagger children: Delay each by 50-100ms
- Trigger threshold: when 20% of element is visible

## Responsive Behavior
- **Mobile (< 768px)**: Single column, stacked navigation, bottom tab bar
- **Tablet (768-1024px)**: 2-column grids, sidebar toggleable with overlay
- **Desktop (> 1024px)**: Full sidebar, 3-column grids, hover states active

## Dark Mode Implementation
- Toggle switch in header (sun/moon icon with rotation animation)
- Store preference in localStorage
- Dark backgrounds: slate-900, slate-800, slate-700 hierarchy
- Dark mode text: text-slate-100 (primary), text-slate-300 (secondary)
- Adjust shadows and borders for visibility
- Maintain color contrast ratios (WCAG AA minimum 4.5:1)

## Images
**Hero Image**: Large, high-quality image showing diverse students analyzing career data on laptops/tablets with AI visualizations on screens (positioned right 60% on desktop, overlay text on left, full-width with centered overlay on mobile)

**Feature Icons**: Use Heroicons (outlined style) for consistency - academic-cap, chart-bar, light-bulb, puzzle-piece, users, sparkles

**Course Thumbnails**: Rectangular placeholders (16:9) with category-specific gradient overlays (blue for tech, purple for business, green for creative)

**Avatar Placeholders**: Circular user photos or generated avatars (dicebear.com API) for testimonials and profiles

## Animation Budget
- **Hero**: Dynamic typing effect only
- **Scroll animations**: Fade-in-up for sections (subtle, single-use)
- **Data visualizations**: Animated value transitions (numbers count up, bars fill)
- **Interactive elements**: Hover/click micro-interactions only
- **Avoid**: Continuous animations, parallax scrolling, excessive particle effects

## Accessibility
- Keyboard navigation for all interactive elements
- Focus indicators with visible outline (ring-2 ring-offset-2)
- ARIA labels for icon-only buttons
- Screen reader announcements for dynamic content updates
- Sufficient color contrast in both light and dark modes
- Reduced motion support: prefers-reduced-motion media query disables animations