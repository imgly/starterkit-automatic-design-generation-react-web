/**
 * CE.SDK Automatic Design Generation Starterkit - React Entry Point
 *
 * A design generation tool that automatically creates social media
 * assets from podcast information using the CE.SDK Engine.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import type { Configuration } from '@cesdk/cesdk-js';
import { createRoot } from 'react-dom/client';

import App from './app/App';

import './app/index.css';

// ============================================================================
// Configuration
// ============================================================================

const config: Configuration = {
  // Unique user identifier for analytics (customize for your app)
  userId: 'starterkit-automatic-design-generation-user'

  // Local assets (uncomment and set path for self-hosted assets)
  // baseURL: `/assets/`,

  // License key (required for production)
  // license: 'YOUR_LICENSE_KEY',
};

// ============================================================================
// Initialize React Application
// ============================================================================

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<App config={config} />);
