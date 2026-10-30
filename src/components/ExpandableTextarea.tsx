import type { ClassValue } from 'clsx';
import { type ComponentProps, useId, useState } from 'react';
import { cn } from '@/lib/cn';
import { Textarea } from './ui/textarea';

const BASE_STYLES = 'wrap-break-word overflow-hidden leading-5';
const GRID_CELL = 'col-start-1 col-end-2 row-start-2 row-end-3';
const FIELD_STYLE =
    'leading-tight placeholder:select-none focus-visible:outline-none';

export type ExpandableTextareaProps = Omit<
    ComponentProps<'textarea'>,
    'children'
> & {
    containerClassName?: ClassValue;
    label?: string;
    scrollable?: string;
};

export function ExpandableTextarea({
    className,
    containerClassName,
    value,
    label,
    placeholder,
    scrollable,
    ref,
    onChange,
    id: passedId,
    ...props
}: ExpandableTextareaProps) {
    const generatedId = useId();
    const id = passedId ?? generatedId;
    const [localValue, setLocalValue] = useState('');

    return (
        <div
            className={cn(
                'my-1.75 flex min-h-9 min-w-0 max-w-full flex-1 flex-col justify-center',
            )}
        >
            <div
                className={cn(
                    'relative grid',
                    scrollable
                        ? `no-scrollbar ${scrollable} min-h-0 content-start overflow-y-scroll`
                        : 'content-center',
                )}
            >
                <Textarea
                    className={cn(
                        BASE_STYLES,
                        GRID_CELL,
                        'peer resize-none placeholder:opacity-100 placeholder:transition-opacity placeholder:duration-300',
                        label && 'pt-4 not-focus:placeholder:opacity-0',
                        label && !placeholder && '[&]:placeholder:opacity-0',
                        FIELD_STYLE,
                        className,
                    )}
                    id={id}
                    onChange={(e) => {
                        onChange?.(e);
                        setLocalValue(e.target.value);
                    }}
                    placeholder={placeholder || label}
                    ref={ref}
                    rows={1}
                    value={value}
                    {...props}
                />
                <p
                    aria-hidden="true"
                    className={cn(
                        BASE_STYLES,
                        GRID_CELL,
                        'invisible whitespace-pre-wrap',
                        label && 'pt-4 not-focus:placeholder:opacity-0',
                    )}
                >
                    {value ?? localValue}{' '}
                </p>
            </div>
        </div>
    );
}
