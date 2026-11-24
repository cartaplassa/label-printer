import { RotateCcwSquare, RotateCwSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    isPaperFormat,
    PAPER_FORMAT_KEYS,
    PAPER_FORMATS,
} from '@/domain/paper';
import { useConfigActions, useSheet } from '@/store';

export function PaperControls() {
    const { format, landscape } = useSheet();
    const { setPaperFormat, toggleLandscape } = useConfigActions();

    return (
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
                                <SelectItem key={formatKey} value={formatKey}>
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
    );
}
