# Comprehensive iOS & Apple Design Guidelines

This document serves as the definitive design reference for all mobile app development decisions. All AI collaborators and team members must reference this document before making any UI/UX decisions.

## Core Design Principles

### 1. Apple's Three Pillars

#### Hierarchy
- Establish clear visual hierarchy where controls and interface elements elevate and distinguish the content beneath them
- Place items to convey their relative importance
- People often start viewing in reading order (top to bottom, leading to trailing)
- Use alignment to make components easier to scan and communicate organization

#### Harmony
- Align with the concentric design of hardware and software
- Create harmony between interface elements, system experiences, and devices
- Use Liquid Glass material for consistent control appearance across iOS, iPadOS, and macOS

#### Consistency
- Adopt platform conventions to maintain consistent design
- Design continuously adapts across window sizes and displays
- Follow established patterns that users expect

### 2. Fundamental Design Elements

#### Visual Hierarchy Best Practices
- **Differentiate controls from content** using Liquid Glass material
- **Group related items** using negative space, background shapes, colors, materials, or separator lines
- **Make essential information easy to find** by giving it sufficient space
- **Extend content to fill the screen** - backgrounds and artwork should reach display edges
- **Use progressive disclosure** to help people discover hidden content

#### Adaptability Requirements
- **Design layouts that adapt gracefully** to context changes while remaining recognizable
- **Support different device screen sizes, resolutions, and color spaces**
- **Handle different device orientations** (portrait/landscape)
- **Accommodate system features** like Dynamic Island and camera controls
- **Support Dynamic Type text-size changes**
- **Respect system-defined safe areas, margins, and guides**

## Typography Standards

### Font Hierarchy and Usage

#### System Fonts
- **SF Pro**: Primary system font for iOS, iPadOS, macOS, tvOS, visionOS
- **SF Compact**: System font for watchOS
- **New York (NY)**: Serif family, available across platforms

#### Text Style Specifications (iOS/iPadOS Default - Large)
| Style | Weight | Size (points) | Leading (points) | Usage |
|-------|---------|---------------|------------------|-------|
| Large Title | Regular | 34 | 41 | Page titles, major headings |
| Title 1 | Regular | 28 | 34 | Section headers |
| Title 2 | Regular | 22 | 28 | Subsection headers |
| Title 3 | Regular | 20 | 25 | Group headers |
| Headline | Semibold | 17 | 22 | Important content emphasis |
| Body | Regular | 17 | 22 | Primary text content |
| Callout | Regular | 16 | 21 | Secondary text |
| Subhead | Regular | 15 | 20 | Descriptive text |
| Footnote | Regular | 13 | 18 | Less important information |
| Caption 1 | Regular | 12 | 16 | Image captions, labels |
| Caption 2 | Regular | 11 | 13 | Fine print, timestamps |

#### Typography Best Practices
- **Use font sizes that most people can read easily**
  - iOS/iPadOS: Default 17pt, Minimum 11pt
  - watchOS: Default 16pt, Minimum 12pt
- **Avoid light font weights** - prefer Regular, Medium, Semibold, or Bold
- **Support Dynamic Type** - allow users to adjust text size
- **Minimize typeface varieties** - mixing too many hinders readability
- **Prioritize important content** when responding to text-size changes

## Layout and Spacing

### Safe Areas and Margins
- **Respect key display and system features** on each platform
- **Use system-defined safe areas** to avoid device features like Dynamic Island
- **Account for interactive components** like bars that may reposition content

### Platform-Specific Layout Requirements

#### iOS
- **Support both portrait and landscape orientations** when possible
- **Prefer full-bleed interface** for games and immersive experiences
- **Avoid full-width buttons** - respect system margins and inset from edges
- **Hide status bar only when it adds value**

#### iPadOS
- **Design for resizable windows** - account for minimum to maximum window sizes
- **Defer switching to compact view** as long as possible during resizing
- **Test at common system-provided sizes** (halves, thirds, quadrants)
- **Consider convertible tab bar** for adaptive navigation

### Grid and Spacing Standards

#### Touch Target Requirements
- **Minimum tap target size: 44x44 points** for all interactive elements
- **Exception**: Text links can be smaller but should remain easily tappable
- **Button spacing**: Centers should be at least 60 points apart (visionOS)

#### Content Spacing
- **Between focusable elements**: Include appropriate padding to prevent overlap
- **Consistent spacing**: Maintain uniform spacing for grid-like layouts
- **Visual breathing room**: Provide sufficient space around interactive elements

## Color and Visual Design

### Dark Mode Guidelines
- **Invert text colors**: Black to white, dark gray to light gray
- **Shift background colors darker** while maintaining relative lightness hierarchy
- **Adjust theme colors** to ensure they pop against dark backgrounds
- **Test in both light and dark modes** to ensure optimal contrast

### Accessibility Standards
- **Maximize contrast** between text and background
- **Support color-blind users** - don't rely solely on color to convey information
- **Ensure sufficient contrast ratios** meet WCAG guidelines
- **Test with accessibility features enabled** (Bold Text, Increase Contrast)

## Interactive Elements and Navigation

### Navigation Patterns
- **Use tab bars** for primary app destinations (2-5 tabs recommended)
- **Provide multiple back navigation methods**:
  1. Tap "Back" button
  2. Swipe right from left edge
  3. Tap "Cancel/Done" in modal views
  4. Swipe down on modal screens

### List and Table Views
- **Consider three elements for lists**:
  1. Text display (primary content)
  2. Optional icons/images (visual context)
  3. Right-side accessory (chevron, checkmark, switch)

### Button Design
- **Avoid full-width buttons on iOS** - use system margins
- **Ensure buttons feel at home** by harmonizing with hardware curvature
- **Provide sufficient spacing** between multiple buttons
- **Use system-provided button styles** when appropriate

## Component Usage Guidelines

### Foundation Components
- **Layout**: Use system-defined guides, safe areas, and adaptive layouts
- **Typography**: Leverage built-in text styles with Dynamic Type support
- **Color**: Follow system color guidelines with proper contrast
- **Icons**: Use SF Symbols for consistent iconography
- **Materials**: Apply appropriate materials (glass, translucency) for depth

### Pattern Implementation
- **Loading**: Provide clear feedback during data loading with appropriate indicators
- **Feedback**: Give immediate response to user interactions
- **Modality**: Use modals sparingly and provide clear dismissal methods
- **Search**: Implement consistent search patterns with proper field placement
- **Settings**: Organize settings logically with clear hierarchy

### Component Categories
- **Content**: Images, videos, text display components
- **Layout and Organization**: Containers, dividers, spacers
- **Menus and Actions**: Action sheets, context menus, buttons
- **Navigation and Search**: Tab bars, navigation bars, search fields
- **Presentation**: Modals, popovers, sheets
- **Selection and Input**: Text fields, pickers, switches, sliders
- **Status**: Progress indicators, badges, alerts

## Mobile-Specific Guidelines

### React Native and Expo Considerations
- **Use NativeWind** for styling with predefined colors/fonts
- **Follow absolute imports** with `@/` prefix for clean architecture
- **Implement proper error boundaries** and loading states
- **Use expo install** for React Native packages instead of npm/yarn add
- **Test on both iOS and Android** platforms when possible

### Development Best Practices
- **Component modularity**: Maximum 80 lines per component
- **Use TypeScript** with explicit types, avoid interfaces/enums when possible
- **Functional components** with descriptive variable names (isLoading, hasError)
- **Named exports** with kebab-case file names
- **Follow src/ directory structure** as defined in project architecture

## Quality Assurance

### Testing Requirements
- **Test on multiple devices** with different screen sizes and orientations
- **Verify Dynamic Type support** at various text sizes including accessibility sizes
- **Test in both light and dark modes**
- **Validate touch targets** meet minimum size requirements
- **Check safe area compliance** across different device types
- **Ensure proper keyboard navigation** and focus management

### Performance Considerations
- **Optimize for smooth scrolling** and responsive interactions
- **Implement proper loading states** to manage user expectations
- **Use appropriate image formats** and sizes for different screen densities
- **Consider battery impact** of animations and background processes

## Design Decision Process

### Before Making Any Design Decision:
1. **Reference this document** for established patterns and guidelines
2. **Check Apple HIG** for platform-specific requirements
3. **Consider accessibility implications** for all users
4. **Evaluate cross-platform consistency** if developing for multiple platforms
5. **Test with real users** when possible, especially for complex interactions

### AI Collaborator Instructions
When any AI is asked about design decisions:
1. **Always reference this document first**
2. **Cite specific sections** that apply to the design question
3. **Provide rationale** based on Apple's design principles
4. **Consider mobile-first approach** for responsive design decisions
5. **Suggest testing methods** to validate design choices

---

## Document Updates

This document should be updated whenever:
- New Apple HIG guidelines are released
- Platform-specific requirements change
- Project-specific design patterns are established
- User feedback indicates design improvements are needed

**Last Updated**: January 2025
**Version**: 1.0
**Maintainer**: Development Team

---

## Quick Reference Links

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Apple Design Resources](https://developer.apple.com/design/resources/)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [iOS Design Templates](https://www.learnui.design/blog/ios-design-guidelines-templates.html)

## Emergency Design Decisions

For urgent decisions when this document doesn't cover a specific case:
1. Follow the **closest analogous pattern** from this document
2. **Err on the side of simplicity** and consistency
3. **Document the decision** for future reference
4. **Plan to revisit** the decision when time permits proper research