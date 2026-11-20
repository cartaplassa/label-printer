import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from 'wouter';
import { ThemeProvider } from './components/ThemeProvider.tsx';
import './index.css';
import App from './App.tsx';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="label-printer-ui-theme">
            <Router base={base}>
                <App />
            </Router>
        </ThemeProvider>
    </StrictMode>,
);
