import { type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface NumberSetterProps extends ComponentPropsWithoutRef<'div'> {
    value: number;
    setValue: (newValue: number) => void;
    min?: number;
    max: number;
    label: string;
    step?: number;
    disabled?: boolean;
    isSubgrid?: boolean;
    unit?: string;
}

export function NumberSetter({
    className,
    value,
    setValue,
    min = 0,
    max,
    label,
    step = 0.01,
    disabled,
    isSubgrid,
    unit,
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
            <span className="text-right whitespace-nowrap">
                {label}
                {unit ? (
                    <span className="text-muted-foreground"> ({unit})</span>
                ) : null}
            </span>
            <Slider
                disabled={disabled}
                value={value}
                onValueChange={(newValue) =>
                    setValue(Array.isArray(newValue) ? newValue[0] : newValue)
                }
                min={min}
                max={max}
                step={step}
                className="grow w-full h-1.5"
                orientation="horizontal"
            />
            <Input
                className="min-w-24 max-w-24"
                disabled={disabled}
                type="number"
                step={step}
                value={value}
                onChange={(event) => {
                    setValue(Number(event.target.value));
                }}
            />
        </div>
    );
}
