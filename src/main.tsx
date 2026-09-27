import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

// Note: StrictMode is intentionally not used. The layers beneath these
// components install global listeners, GSAP timelines and two WebGL contexts,
// all of which must be created exactly once per page load.
createRoot(document.getElementById('root')!).render(<App />);
