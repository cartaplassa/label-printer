import { RotateCcwSquare, RotateCwSquare } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
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

interface SettingsProps extends ComponentPropsWithoutRef<'div'> {}

function Settings({ className, ...rest }: SettingsProps) {
    const { format, landscape } = useSheet();
    const setPaperFormat = useConfigStore((state) => state.setPaperFormat);
    const toggleLandscape = useConfigStore((state) => state.toggleLandscape);

    return (
        <div
            className={cn(
                'border border-stone-500 p-2 rounded-md',
                'bg-background',
                'flex flex-col gap-2 min-w-md max-w-md',
                className,
            )}
            {...rest}
        >
            <div className="flex gap-2 items-center">
                <h1>label-printer</h1>
                <div className="grow">
                    <span className="hidden">
                        That's a spacer with an invisible text you shouldn't be
                        able to read
                    </span>
                </div>
                <PrintButton />
                <ThemeToggle />
                <RepoLink />
            </div>
            <ReloadFrame />
            <div className="flex gap-2 items-center">
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
                            {PAPER_FORMAT_KEYS.map((format) => {
                                const { width, height, unit } =
                                    PAPER_FORMATS[format];

                                return (
                                    <SelectItem key={format} value={format}>
                                        {format} · {width} × {height} {unit}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button
                    onClick={toggleLandscape}
                    variant={landscape ? 'default' : 'outline'}
                >
                    {landscape ? <RotateCwSquare /> : <RotateCcwSquare />}
                </Button>
            </div>
            <PositionsAccordion />
        </div>
    );
}

export default Settings;
