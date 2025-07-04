import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import cn from '@/cn';
import type { ClassValue } from 'clsx';

interface PaperFormatSelectorProps
    extends React.ComponentPropsWithoutRef<typeof Select> {
    className?: ClassValue;
    options: string[];
}

function PaperFormatSelector({
    className,
    value,
    onValueChange,
    options,
    ...rest
}: PaperFormatSelectorProps) {
    return (
        <Select {...{ value, onValueChange, ...rest }}>
            <SelectTrigger className={cn('', className)}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((i) => (
                        <SelectItem key={i} value={i}>
                            {i}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export default PaperFormatSelector;
