import type { ReactNode } from 'react';
import { Link, Redirect, Route, Switch, useLocation } from 'wouter';
import { Logo } from '@/components/Logo';
import PrintButton from '@/components/PrintButton';
import ReloadFrame from '@/components/ReloadFrame';
import RepoLink from '@/components/RepoLink';
import ThemeToggle from '@/components/ThemeToggle';
import { cn } from '@/lib/cn';
import { ContentTab } from './ContentTab';
import { QueueTab } from './QueueTab';
import { SizingTab } from './SizingTab';

const tabs = [
    { href: '/content', label: 'Content' },
    { href: '/sizing', label: 'Sizing' },
    { href: '/queue', label: 'Queue' },
] as const;

function SettingsTabs() {
    const [location] = useLocation();

    return (
        <nav
            className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1"
            aria-label="Settings sections"
        >
            {tabs.map((tab) => {
                const active = location === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            'rounded-md px-3 py-1.5 text-center text-sm font-medium transition-colors',
                            active
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                        aria-current={active ? 'page' : undefined}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}

export function SettingsContent({
    headerAction,
}: {
    headerAction?: ReactNode;
}) {
    return (
        <div className="flex h-full min-h-0 flex-col gap-2">
            <div className="flex items-center gap-2">
                <Logo className="size-6 shrink-0" />
                <h1 className="font-semibold">label-printer</h1>
                <div className="grow" />
                <PrintButton />
                <ThemeToggle />
                <RepoLink />
                {headerAction}
            </div>
            <ReloadFrame />
            <SettingsTabs />
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <Switch>
                    <Route
                        path="/"
                        component={() => <Redirect to="/content" />}
                    />
                    <Route path="/content" component={ContentTab} />
                    <Route path="/sizing" component={SizingTab} />
                    <Route path="/queue" component={QueueTab} />
                    <Route component={() => <Redirect to="/content" />} />
                </Switch>
            </div>
        </div>
    );
}
