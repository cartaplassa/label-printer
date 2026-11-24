import { cn } from 'cn';
import type { ComponentPropsWithRef } from 'react';

export const Column = ({
    className,
    children,
    ...rest
}: ComponentPropsWithRef<'div'>) => (
    <div className={cn('flex flex-col gap-4', className)} {...rest}>
        {children}
    </div>
);
