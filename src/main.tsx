import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './components/ThemeProvider.tsx';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="label-printer-ui-theme">
            <App />
        </ThemeProvider>
    </StrictMode>,
);
