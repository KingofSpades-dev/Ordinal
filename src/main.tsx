import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import RatingAgents from './RatingAgents.tsx'

function MainRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return currentPath === '/ratingagents' ? <RatingAgents /> : <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainRouter />
  </StrictMode>,
)
