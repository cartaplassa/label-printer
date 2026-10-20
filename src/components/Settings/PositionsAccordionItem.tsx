import cn from '@/cn';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import type { ComponentPropsWithoutRef } from 'react';

interface PositionsAccordionItemProps
    extends ComponentPropsWithoutRef<typeof AccordionItem> {
    isGrid?: boolean;
}

export function PositionsAccordionItem({
    className,
    value,
    title,
    children,
    isGrid,
    ...rest
}: PositionsAccordionItemProps) {
    return (
        <AccordionItem className={cn('', className)} {...{ value, ...rest }}>
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionContent
                className={cn(
                    'gap-4 text-balance',
                    isGrid
                        ? 'grid grid-cols-[min-content_1fr_min-content]'
                        : 'flex flex-col',
                )}
            >
                {children}
            </AccordionContent>
        </AccordionItem>
    );
}
