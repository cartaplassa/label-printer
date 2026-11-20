import { useState } from 'react';
import { cn } from '@/lib/cn';
import Page from './blocks/Page';
import {
    DesktopSettingsWrapper,
    SETTINGS_DEFAULT_WIDTH,
} from './blocks/DesktopSettingsWrapper';
import { MobileSettingsWrapper } from './blocks/MobileSettingsWrapper';

function App() {
    const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(SETTINGS_DEFAULT_WIDTH);

    return (
        <div
            className={cn(
                'flex h-dvh w-dvw overflow-hidden',
                'bg-stone-300 dark:bg-stone-900',
            )}
        >
            <Page
                className="flex-1 min-w-0"
                desktopSidebarCollapsed={isDesktopCollapsed}
                onToggleDesktopSidebar={() => setIsDesktopCollapsed((v) => !v)}
            />
            <DesktopSettingsWrapper
                collapsed={isDesktopCollapsed}
                width={sidebarWidth}
                onWidthChange={setSidebarWidth}
            />
            <MobileSettingsWrapper
                open={isMobileSettingsOpen}
                onOpen={() => setIsMobileSettingsOpen(true)}
                onClose={() => setIsMobileSettingsOpen(false)}
            />
        </div>
    );
}

export default App;
