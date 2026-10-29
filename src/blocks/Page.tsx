import type { ClassValue } from 'clsx';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import {
    TransformComponent,
    TransformWrapper,
    useControls,
} from 'react-zoom-pan-pinch';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { formatLength, formatSides } from '@/domain/paper';
import { buildPrintCss } from '@/domain/printCss';
import { useGridLayout, useLabel, useSheet } from '@/store';

interface SheetProps extends ComponentPropsWithoutRef<'div'> {}

function Sheet({ className, ...rest }: SheetProps) {
    const label = useLabel();
    const sheet = useSheet();
    const layout = useGridLayout();
    const { paper, cellCount, paddingOverflows } = layout;

    return (
        <div
            id="PRINTAREA"
            className={cn('bg-white dark:bg-stone-700', className)}
            style={{
                width: formatLength(paper.width, paper.unit),
                height: formatLength(paper.height, paper.unit),
                padding: formatSides(sheet.paddings, paper.unit),
                boxSizing: 'border-box',
            }}
            {...rest}
        >
            <style>{buildPrintCss({ label, sheet, layout })}</style>
            <div className="GRID">
                {Array.from({ length: cellCount }, (_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: the grid has no stable per-cell identity
                    <div className="CELL" key={i}>
                        {!paddingOverflows &&
                            (label.type === 'image' ? (
                                <div className="SERIAL-IMAGE" />
                            ) : (
                                <p>{label.text}</p>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

const ControlButton = ({
    className,
    children,
    ...rest
}: ComponentPropsWithoutRef<typeof Button>) => (
    <Button
        variant="secondary"
        className={cn('border border-stone-500', className)}
        {...rest}
    >
        {children}
    </Button>
);

const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
        <div
            className={cn(
                'fixed top-3 left-1/2 z-10',
                'transform -translate-x-1/2',
                'flex gap-2',
            )}
        >
            <ControlButton onClick={() => zoomIn()}>
                <Plus />
            </ControlButton>
            <ControlButton onClick={() => zoomOut()}>
                <Minus />
            </ControlButton>
            <ControlButton onClick={() => resetTransform()}>
                <RotateCcw />
            </ControlButton>
        </div>
    );
};

interface PageProps extends ComponentPropsWithoutRef<typeof TransformWrapper> {
    className: ClassValue;
}

function Page({ className, ...rest }: PageProps) {
    return (
        <TransformWrapper
            initialScale={0.8}
            minScale={0.2}
            initialPositionX={0}
            initialPositionY={0}
            {...rest}
        >
            <div className="grow">
                <Controls />
                <TransformComponent
                    wrapperStyle={{
                        width: '100dvw',
                        maxWidth: '100dvw',
                        height: '100dvh',
                        maxHeight: '100dvh',
                    }}
                >
                    <Sheet />
                </TransformComponent>
            </div>
        </TransformWrapper>
    );
}

export default Page;
