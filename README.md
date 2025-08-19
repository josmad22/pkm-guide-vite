# Pokemon Guide - Vite Version

This project is a migration of the Pokemon Guide component from Next.js to a pure React application using Vite. The guide provides information about Pokemon trainers and their Pokemon across different regions.

## Features

- Interactive Pokemon guide with expandable regions, leaders, and Pokemon details
- Dynamic data loading from JSON configuration files
- Light/dark mode toggle
- Responsive design with Tailwind CSS
- Animations for smooth transitions

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/pokemon-guide.git
   cd pokemon-guide/pkm-guide-vite
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to http://localhost:5173

### Project Structure

- `/src/components/` - React components including PokemonGuide and TrickItem
- `/src/data/` - JSON configuration files for regions, leaders, and Pokemon
- `/public/` - Static assets like images

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages using GitHub Actions.

### Manual Deployment

1. Build the project
   ```bash
   npm run build
   # or
   yarn build
   ```

2. The built files will be in the `dist` directory, which you can deploy to any static hosting service

### Automated Deployment with GitHub Actions

This repository includes a GitHub Actions workflow that automatically deploys the application to GitHub Pages when you push to the main branch.

1. Push your changes to the main branch
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. The GitHub Actions workflow will build and deploy your application

3. Your application will be available at `https://yourusername.github.io/pokemon-guide/`
