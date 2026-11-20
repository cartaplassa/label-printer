import { RotateCcwSquare, RotateCwSquare } from 'lucide-react';
import type { ReactNode } from 'react';
import PrintButton from '@/components/PrintButton';
import ReloadFrame from '@/components/ReloadFrame';
import RepoLink from '@/components/RepoLink';
import { PositionsAccordion } from '@/components/Settings/PositionsAccordion';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
    isPaperFormat,
    PAPER_FORMAT_KEYS,
    PAPER_FORMATS,
} from '@/domain/paper';
import { useConfigStore, useSheet } from '@/store';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <PositionsAccordion />
            </div>
        </div>
    );
}
