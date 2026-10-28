import { type ComponentPropsWithoutRef, useEffect, useState } from 'react';
import cn from '@/cn';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import type { Unit } from '@/domain/paper';

interface NumberSetterProps extends ComponentPropsWithoutRef<'div'> {
    value: number;
    setValue: (newValue: number) => void;
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
    max,
    label,
    step = 0.01,
    disabled,
    isSubgrid,
    unit,
    ...rest
}: NumberSetterProps) {
    const [text, setText] = useState(() => String(value));
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!isFocused) setText(String(value));
    }, [value, isFocused]);

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
                value={[value]}
                onValueChange={(newValue) => setValue(newValue[0])}
                min={0}
                max={max}
                step={step}
                className="grow"
            />
            <Input
                className="min-w-24 max-w-24"
                disabled={disabled}
                type="number"
                step={step}
                value={text}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setIsFocused(false);
                    setText(String(value));
                }}
                onChange={(event) => {
                    setText(event.target.value);
                    const next = event.target.valueAsNumber;
                    if (Number.isFinite(next)) setValue(next);
                }}
            />
        </div>
    );
}
