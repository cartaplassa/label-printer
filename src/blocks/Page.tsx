import type { ClassValue } from 'clsx';
import {
    Minus,
    PanelRightClose,
    PanelRightOpen,
    Plus,
    RotateCcw,
} from 'lucide-react';
import { type ComponentPropsWithoutRef, useMemo } from 'react';
import {
    TransformComponent,
    TransformWrapper,
    useControls,
} from 'react-zoom-pan-pinch';
import { Button } from '@/components/ui/button';
import { generateBarcodeDataUrl } from '@/domain/barcode';
import { formatLength, formatSides } from '@/domain/paper';
import { buildPrintCss } from '@/domain/printCss';
import { cn } from '@/lib/cn';
import {
    useBarcode,
    useGridLayout,
    useImage,
    useLabel,
    useSheet,
    useText,
} from '@/store';

interface SheetProps extends ComponentPropsWithoutRef<'div'> {}

function Sheet({ className, ...rest }: SheetProps) {
    const image = useImage();
    const text = useText();
    const barcode = useBarcode();
    const label = useLabel();
    const sheet = useSheet();
    const layout = useGridLayout();
    const { paper, cellCount, paddingOverflows } = layout;
    const barcodeImage = useMemo(
        () =>
            label.type === 'barcode' ? generateBarcodeDataUrl(barcode).url : '',
        [label.type, barcode],
    );

    return (
        <div
            id="PRINTAREA"
            className={cn('bg-white dark:bg-[#FFFAED]', className)}
            style={{
                width: formatLength(paper.width, paper.unit),
                height: formatLength(paper.height, paper.unit),
                padding: formatSides(sheet.paddings, paper.unit),
                boxSizing: 'border-box',
            }}
            {...rest}
        >
            <style>
                {buildPrintCss({
                    image,
                    text,
                    label,
                    sheet,
                    layout,
                    barcodeImage,
                })}
            </style>
            <div className="GRID">
                {Array.from({ length: cellCount }, (_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: the grid has no stable per-cell identity
                    <div className="CELL" key={i}>
                        {!paddingOverflows &&
                            (label.type === 'image' ? (
                                <div className="SERIAL-IMAGE" />
                            ) : label.type === 'barcode' ? (
                                barcodeImage ? (
                                    <div className="SERIAL-BARCODE" />
                                ) : null
                            ) : (
                                <p>{text.data}</p>
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

interface ControlsProps {
    desktopSidebarCollapsed?: boolean;
    onToggleDesktopSidebar?: () => void;
}

const Controls = ({
    desktopSidebarCollapsed,
    onToggleDesktopSidebar,
}: ControlsProps) => {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start">
            <div className="flex-1" />
            <div className="pointer-events-auto flex gap-2">
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
            <div className="flex flex-1 justify-end">
                {onToggleDesktopSidebar ? (
                    <ControlButton
                        onClick={onToggleDesktopSidebar}
                        className="pointer-events-auto hidden md:inline-flex"
                        aria-label={
                            desktopSidebarCollapsed
                                ? 'Show settings sidebar'
                                : 'Hide settings sidebar'
                        }
                        title={
                            desktopSidebarCollapsed
                                ? 'Show settings sidebar'
                                : 'Hide settings sidebar'
                        }
                    >
                        {desktopSidebarCollapsed ? (
                            <PanelRightOpen />
                        ) : (
                            <PanelRightClose />
                        )}
                    </ControlButton>
                ) : null}
            </div>
        </div>
    );
};

interface PageProps
    extends Omit<
        ComponentPropsWithoutRef<typeof TransformWrapper>,
        'children'
    > {
    className?: ClassValue;
    desktopSidebarCollapsed?: boolean;
    onToggleDesktopSidebar?: () => void;
}

function Page({
    className,
    desktopSidebarCollapsed,
    onToggleDesktopSidebar,
    ...rest
}: PageProps) {
    return (
        <TransformWrapper
            initialScale={0.8}
            minScale={0.2}
            initialPositionX={0}
            initialPositionY={0}
            {...rest}
        >
            <div
                className={cn(
                    'relative h-full w-full min-w-0 min-h-0',
                    className,
                )}
            >
                <Controls
                    desktopSidebarCollapsed={desktopSidebarCollapsed}
                    onToggleDesktopSidebar={onToggleDesktopSidebar}
                />
                <TransformComponent
                    wrapperClass="!w-full !h-full"
                    wrapperStyle={{
                        width: '100%',
                        height: '100%',
                    }}
                    contentStyle={{
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <div className="flex h-full w-full items-center justify-center">
                        <Sheet />
                    </div>
                </TransformComponent>
            </div>
        </TransformWrapper>
    );
}

export default Page;
