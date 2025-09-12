import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
} else {
  // eslint-disable-next-line no-console
  console.error('Root element not found');
}
