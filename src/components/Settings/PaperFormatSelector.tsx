import type { ClassValue } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { isPaperFormat, PAPER_FORMATS, type PaperFormat } from '@/domain/paper';

interface PaperFormatSelectorProps
    extends Omit<
        ComponentPropsWithoutRef<typeof Select>,
        'value' | 'onValueChange'
    > {
    className?: ClassValue;
    value: PaperFormat;
    onValueChange: (value: PaperFormat) => void;
    options: readonly PaperFormat[];
}

function PaperFormatSelector({
    className,
    value,
    onValueChange,
    options,
    ...rest
}: PaperFormatSelectorProps) {
    return (
        <Select
            {...rest}
            value={value}
            onValueChange={(next) => {
                if (isPaperFormat(next)) onValueChange(next);
            }}
        >
            <SelectTrigger className={cn('', className)}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((format) => {
                        const { width, height, unit } = PAPER_FORMATS[format];

                        return (
                            <SelectItem key={format} value={format}>
                                {format} · {width} × {height} {unit}
                            </SelectItem>
                        );
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export default PaperFormatSelector;
