import cn from '@/cn';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import type { ComponentPropsWithoutRef } from 'react';

interface NumberSetterProps extends ComponentPropsWithoutRef<'div'> {
    value: number;
    setValue: (newValue: number) => void;
    max: number;
    label: string;
    step?: number;
    disabled?: boolean;
    isSubgrid?: boolean;
}

export function NumberSetter({
    className,
    value,
    setValue,
    max,
    label,
    step = 0.01,
    disabled,
    isSubgrid,
    ...rest
}: NumberSetterProps) {
    return (
        <div
            className={cn(
                isSubgrid
                    ? 'grid col-span-3 grid-cols-subgrid gap-x-3 items-center justify-items-end'
                    : 'flex gap-3 items-center',
                className,
            )}
            {...rest}
        >
            <span className="text-right">{label}</span>
            <Slider
                disabled={disabled}
                defaultValue={[value]}
                onValueChange={(newValue) => setValue(newValue[0])}
                min={0}
                max={max}
                step={step}
                className={cn('grow')}
            />
            <Input
                className="min-w-24 max-w-24"
                disabled={disabled}
                type="number"
                step={step}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
            />
        </div>
    );
}
