import type { ComponentPropsWithoutRef } from 'react';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/cn';

interface CustomAccordionItemProps
    extends ComponentPropsWithoutRef<typeof AccordionItem> {
    isGrid?: boolean;
}

export function CustomAccordionItem({
    className,
    value,
    title,
    children,
    isGrid,
    ...rest
}: CustomAccordionItemProps) {
    return (
        <AccordionItem className={cn('', className)} {...{ value, ...rest }}>
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionContent
                className={cn(
                    'gap-4 text-balance overflow-visible p-1',
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
