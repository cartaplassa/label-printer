import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';

export const Row = ({
    className,
    children,
    ...rest
}: ComponentPropsWithRef<'div'>) => (
    <div className={cn('flex items-center gap-2', className)} {...rest}>
        {children}
    </div>
);
