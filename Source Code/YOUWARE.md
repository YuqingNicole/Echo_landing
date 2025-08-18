# YOUWARE Template - React Modern Development Guide

This is a modern React application template built with React 18, TypeScript, Vite, and Tailwind CSS.

## IMPORTANT: Update This File After Completion

After completing the user requirements, please update this YOUWARE.md file to:
1. Remove the template notice section
2. Add specific project details and documentation
3. Include any special instructions for future development
4. Document key features implemented for the user
5. Follow the user's preferred language, not the default language of this file

## Project Status

- **Project Type**: React + TypeScript Modern Web Application
- **Entry Point**: `src/main.tsx` (React application entry)
- **Build System**: Vite 7.0.0 (Fast development and build)
- **Styling System**: Tailwind CSS 3.4.17 (Atomic CSS framework)

## Core Design Principles

### Visual Engagement

- Prioritize impactful visual design that creates memorable experiences
- Choose dynamic interactions over static presentations
- Favor bold, innovative design choices over conventional approaches
- Embrace contemporary design trends for modern aesthetics

### Interactive Experience

- Design interfaces that feel responsive and alive through animation
- Implement subtle motion and transitions to enhance usability
- Push boundaries with advanced animation techniques using Framer Motion and GSAP
- Create immersive 3D experiences with Three.js for enhanced visual storytelling
- Integrate realistic physics simulations using Cannon-es and Matter.js
- Balance visual richness with performance considerations

### React Modern Development

- Leverage React 18's concurrent features to enhance user experience
- Adopt TypeScript for type-safe development experience
- Use Zustand for lightweight state management
- Implement smooth single-page application routing through React Router DOM

## Project Architecture

### Directory Structure

```
project-root/
├── index.html              # Main HTML template
├── package.json            # Node.js dependencies and scripts
├── package-lock.json       # Lock file for npm dependencies
├── README.md              # Project documentation
├── YOUWARE.md             # Development guide and template documentation
├── yw_manifest.json       # Project manifest file
├── vite.config.ts         # Vite build tool configuration
├── tsconfig.json          # TypeScript configuration (main)
├── tsconfig.app.json      # TypeScript configuration for app
├── tsconfig.node.json     # TypeScript configuration for Node.js
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── dist/                  # Build output directory (generated)
└── src/                   # Source code directory
    ├── App.tsx            # Main application component
    ├── main.tsx           # Application entry point
    ├── index.css          # Global styles and Tailwind CSS imports
    ├── vite-env.d.ts      # Vite type definitions
    ├── api/               # API related code
    ├── assets/            # Static assets
    ├── components/        # Reusable components
    ├── layouts/           # Layout components
    ├── pages/             # Page components
    ├── store/             # State management
    ├── styles/            # Style files
    └── types/             # TypeScript type definitions
```

### Code Organization Principles

- Write semantic React components with clear component hierarchy
- Use TypeScript interfaces and types to ensure type safety
- Create modular components with clear separation of concerns
- Prioritize maintainability and readability

## Tech Stack

### Core Framework
- **React**: 18.3.1 - Declarative UI library
- **TypeScript**: 5.8.3 - Type-safe JavaScript superset
- **Vite**: 7.0.0 - Next generation frontend build tool
- **Tailwind CSS**: 3.4.17 - Atomic CSS framework

### Routing and State Management
- **React Router DOM**: 6.30.1 - Client-side routing
- **Zustand**: 4.4.7 - Lightweight state management

### Internationalization Support
- **i18next**: 23.10.1 - Internationalization core library
- **react-i18next**: 14.1.0 - React integration for i18next
- **i18next-browser-languagedetector**: 7.2.0 - Browser language detection

### UI and Styling
- **Lucide React**: Beautiful icon library
- **Headless UI**: 1.7.18 - Unstyled UI components
- **Framer Motion**: 11.0.8 - Powerful animation library
- **GSAP**: 3.13.0 - High-performance professional animation library
- **clsx**: 2.1.0 - Conditional className utility

### 3D Graphics and Physics
- **Three.js**: 0.179.1 - JavaScript 3D graphics library
- **Cannon-es**: Modern TypeScript-enabled 3D physics engine
- **Matter.js**: 0.20.0 - 2D physics engine for web

## Technical Standards

### React Component Development Methodology

- Use functional components and React Hooks
- Implement single responsibility principle for components
- Create reusable and composable component architecture
- Use TypeScript for strict type checking

### Styling and Design System

- Use Tailwind CSS design token system
- Apply mobile-first responsive design approach
- Leverage modern layout techniques (Grid, Flexbox)
- Implement thoughtful animations and transitions through Framer Motion and GSAP
- Create immersive 3D visual experiences with Three.js
- Add realistic physics interactions using Cannon-es and Matter.js

### CSS Import Order Rules

**CRITICAL**: `@import` statements must come BEFORE all other CSS statements to avoid PostCSS warnings.

### State Management Approach

- Use Zustand for global state management
- Prioritize React built-in Hooks for local state
- Implement clear data flow and state update patterns
- Ensure state predictability and debugging capabilities

### Performance Optimization Requirements

- Use React.memo and useMemo for component optimization
- Implement code splitting and lazy loading
- Optimize resource loading and caching strategies
- Ensure all interactions work on both touch and pointer devices

## Development Commands

- **Install dependencies**: `npm install`
- **Build project**: `npm run build`

## ⚠️ CRITICAL: Do NOT Modify index.html Entry Point

**WARNING**: This is a Vite + React project. **NEVER** modify this critical line in `index.html`:

```html
<script type="module" src="/src/main.tsx"></script>
```

**Why**: This is the core entry point. Any modification will cause the app to completely stop working.

**Do instead**: Work in `src/` directory - modify `App.tsx`, add components in `src/components/`, pages in `src/pages/`.

**If accidentally modified**: 
1. Restore: `<script type="module" src="/src/main.tsx"></script>`
2. Rebuild: `npm run build`

## Quality Assurance

- Maintain cross-browser compatibility
- Adhere to accessibility standards (WCAG 2.1)
- Optimize performance for all user contexts
- Test thoroughly across devices and platforms
- Implement ESLint and Prettier for code quality control

## Development Process

1. **Project Setup**: Install dependencies and configure development environment
2. **Component Architecture**: Design and implement core component structure
3. **Routing Configuration**: Set up React Router and page navigation
4. **State Management**: Configure Zustand store and data flow
5. **Styling Implementation**: Implement responsive design using Tailwind CSS
6. **Interactive Enhancement**: Add Framer Motion and GSAP animations and interactions
7. **3D Graphics Integration**: Implement Three.js for immersive 3D experiences
8. **Physics Simulation**: Add Cannon-es and Matter.js for realistic physics interactions
9. **Internationalization**: Configure i18next for multi-language support
10. **Performance Optimization**: Optimize for performance and accessibility
11. **Testing and Refinement**: Thorough testing and refinement across devices and platforms

## Extended Development Guide

To develop applications based on this template, you can:

1. **Component Development**: Add reusable components in `src/components/`
2. **Page Development**: Add page components in `src/pages/`
3. **API Integration**: Add API call logic in `src/api/`
4. **Routing Management**: Configure React Router for routing management
5. **State Management**: Use Zustand for application state management
6. **Internationalization**: Configure i18next for multi-language support
7. **Animation Effects**: Use Framer Motion and GSAP for smooth animations
8. **3D Graphics**: Create immersive 3D scenes and models with Three.js
9. **Physics Simulation**: Implement realistic physics with Cannon-es (3D) and Matter.js (2D)
10. **Icon Usage**: Import icons from Lucide React library
11. **UI Components**: Build accessible components with Headless UI

## Key Features

- **TypeScript Support** - Complete type-safe development experience
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Routing Management** - React Router DOM for single-page applications
- **State Management** - Lightweight state management with Zustand
- **Internationalization Support** - Multi-language support with i18next
- **Advanced Animation Support** - Smooth animations with Framer Motion and GSAP
- **3D Graphics** - Immersive 3D experiences with Three.js
- **Physics Simulation** - Realistic physics with Cannon-es (3D) and Matter.js (2D)
- **Icon Library** - Beautiful icon resources with Lucide React
- **Accessible Components** - Accessibility components with Headless UI
- **Development Tools** - Fast development and hot reload with Vite

## Build and Deployment

The project uses Vite build system:
- **Development server**: `http://127.0.0.1:5173`
- **Build output**: `dist/` directory
- **Supports HMR**: Hot Module Replacement
- **Optimized production build**: Automatic code splitting and optimization

## Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `yw_manifest.json` - Project manifest file
