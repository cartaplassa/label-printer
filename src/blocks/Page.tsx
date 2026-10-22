import cn from '@/cn';
import useConfigStore, {
    PAPER_FORMAT_DIMENSIONS,
    type Side,
    type Sides,
} from '../store';
import {
    TransformWrapper,
    TransformComponent,
    useControls,
} from 'react-zoom-pan-pinch';
import type { ClassValue } from 'clsx';
import { Button } from '@/components/ui/button';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

const stringifyPaddings = (paddings: Sides<number>, measurementUnit: string) =>
    Object.keys(paddings)
        .map((side) => String(paddings[side as Side]) + measurementUnit)
        .join(' ');

interface SheetProps extends ComponentPropsWithoutRef<'div'> {}

const MAX_ITEMS = 4096;

function Sheet({ className, ...rest }: SheetProps) {
    const paperFormat = useConfigStore((state) => state.paperFormat);
    const isPaperRotationAlbum = useConfigStore(
        // TODO finish that
        (state) => state.isPaperRotationAlbum,
    );
    const {
        width: sheetWidth,
        height: sheetHeight,
        unit: measurementUnit,
    } = PAPER_FORMAT_DIMENSIONS[paperFormat];

    const paperSize = isPaperRotationAlbum
        ? {
              width: `${sheetHeight}${measurementUnit}`,
              height: `${sheetWidth}${measurementUnit}`,
          }
        : {
              width: `${sheetWidth}${measurementUnit}`,
              height: `${sheetHeight}${measurementUnit}`,
          };
    const sheetPaddings = useConfigStore((state) => state.sheetPaddings);
    const labelType = useConfigStore((state) => state.labelType);
    const labelText = useConfigStore((state) => state.labelText);
    const labelImage = useConfigStore((state) => state.labelImage);
    const labelWidth = useConfigStore((state) => state.labelWidth);
    const labelHeight = useConfigStore((state) => state.labelHeight);
    const labelPaddings = useConfigStore((state) => state.labelPaddings);
    const labelTextSize = useConfigStore((state) => state.labelTextSize);
    const labelBorderWidth = useConfigStore((state) => state.labelBorderWidth);
    const isPaddingOverflow =
        labelWidth <= labelPaddings.left + labelPaddings.right ||
        labelHeight <= labelPaddings.top + labelPaddings.bottom;
    const columns = Math.floor(
        (PAPER_FORMAT_DIMENSIONS[paperFormat][
            !isPaperRotationAlbum ? 'width' : 'height'
        ] -
            sheetPaddings.left -
            sheetPaddings.right) /
            labelWidth,
    );
    const rows = Math.floor(
        (PAPER_FORMAT_DIMENSIONS[paperFormat][
            !isPaperRotationAlbum ? 'height' : 'width'
        ] -
            sheetPaddings.top -
            sheetPaddings.bottom) /
            labelHeight,
    );

    return (
        <div
            id="PRINTAREA"
            className={cn('bg-white dark:bg-stone-700', className)}
            style={{
                ...paperSize,
                padding: stringifyPaddings(sheetPaddings, measurementUnit),
                boxSizing: 'border-box',
            }}
            {...rest}
        >
            <style>{`
            .CELL {
                width: ${labelWidth + measurementUnit};
                height: ${labelHeight + measurementUnit};
                max-width: ${labelWidth + measurementUnit};
                max-height: ${labelHeight + measurementUnit};
                padding: ${stringifyPaddings(labelPaddings, measurementUnit)};
                box-sizing: border-box;
                overflow: hidden;
                border-width: ${labelBorderWidth ? labelBorderWidth + measurementUnit : 0};
                border-color: black;
                border-style: solid;
            }

            .CELL p {
                margin-block-start: 0;
                margin-block-end: 0;
                line-height: 1.5;
            }

            .CELL .SERIAL-IMAGE {
                -webkit-print-color-adjust: exact;
                object-fit: contain;
                background: no-repeat center/contain url("${labelImage}");
                width: 100%;
                height: 100%;
            }
            `}</style>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, ${labelWidth + measurementUnit})`,
                    gridTemplateRows: `repeat(${rows}, ${labelHeight + measurementUnit})`,
                    fontSize: labelTextSize,
                }}
            >
                {columns > 0 &&
                    rows > 0 &&
                    [...Array(Math.min(columns * rows, MAX_ITEMS)).keys()].map(
                        (i) =>
                            labelWidth > 0 &&
                            labelHeight > 0 && (
                                <div className="CELL" key={i}>
                                    {!isPaddingOverflow &&
                                        (labelType === 'image' ? (
                                            <div className="SERIAL-IMAGE" />
                                        ) : (
                                            <p>{labelText}</p>
                                        ))}
                                </div>
                            ),
                    )}
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
