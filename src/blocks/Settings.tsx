import { RotateCcwSquare, RotateCwSquare } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, Redirect, Route, Switch, useLocation } from 'wouter';
import PrintButton from '@/components/PrintButton';
import ReloadFrame from '@/components/ReloadFrame';
import RepoLink from '@/components/RepoLink';
import { LabelContentPanel } from '@/components/Content/LabelContentPanel';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
    isPaperFormat,
    PAPER_FORMAT_KEYS,
    PAPER_FORMATS,
} from '@/domain/paper';
import { cn } from '@/lib/cn';
import { useConfigStore, useSheet } from '@/store';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
        <nav className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1" aria-label="Settings sections">
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

export function SettingsContent({ headerAction }: { headerAction?: ReactNode }) {
    const { format, landscape } = useSheet();
    const setPaperFormat = useConfigStore((state) => state.setPaperFormat);
    const toggleLandscape = useConfigStore((state) => state.toggleLandscape);

    return (
        <div className="flex h-full min-h-0 flex-col gap-2">
            <div className="flex items-center gap-2">
                <h1 className="font-semibold">label-printer</h1>
                <div className="grow" />
                <PrintButton />
                <ThemeToggle />
                <RepoLink />
                {headerAction}
            </div>
            <ReloadFrame />
            <div className="flex items-center gap-2">
                <Select
                    value={format}
                    onValueChange={(next) => {
                        if (isPaperFormat(next)) setPaperFormat(next);
                    }}
                >
                    <SelectTrigger className="w-full grow">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {PAPER_FORMAT_KEYS.map((formatKey) => {
                                const { width, height, unit } =
                                    PAPER_FORMATS[formatKey];

                                return (
                                    <SelectItem
                                        key={formatKey}
                                        value={formatKey}
                                    >
                                        {formatKey} · {width} × {height} {unit}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button
                    onClick={toggleLandscape}
                    variant={landscape ? 'default' : 'outline'}
                    aria-label={
                        landscape ? 'Switch to portrait' : 'Switch to landscape'
                    }
                >
                    {landscape ? <RotateCwSquare /> : <RotateCcwSquare />}
                </Button>
            </div>
            <SettingsTabs />
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <Switch>
                    <Route path="/" component={() => <Redirect to="/content" />} />
                    <Route path="/content" component={LabelContentPanel} />
                    <Route path="/sizing" component={SizingTab} />
                    <Route path="/queue" component={QueueTab} />
                    <Route component={() => <Redirect to="/content" />} />
                </Switch>
            </div>
        </div>
    );
}
