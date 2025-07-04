import cn from '@/cn';
import useConfigStore, { PAPER_FORMAT_DIMENSIONS, Side, Sides } from '../store';
import { useMemo } from 'react';
import {
    TransformWrapper,
    TransformComponent,
    useControls,
} from 'react-zoom-pan-pinch';
import type { ClassValue } from 'clsx';
import { Button } from '@/components/ui/button';
import { Minus, Plus, RotateCcw } from 'lucide-react';

const stringifyPaddings = (
    paddings: Sides<number>,
    measurementUnit: string, //TODO - make a literal type?
) =>
    Object.keys(paddings)
        .map((side) => paddings[side as Side] + measurementUnit)
        .join(' ');

interface SheetProps extends React.ComponentPropsWithoutRef<'div'> {}

function Sheet({ className, ...rest }: SheetProps) {
    const paperFormat = useConfigStore((state) => state.paperFormat);
    const isPaperRotationAlbum = useConfigStore(
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
    const label = useConfigStore((state) => state.label);
    const labelWidth = useConfigStore((state) => state.labelWidth);
    const labelHeight = useConfigStore((state) => state.labelHeight);
    const labelPaddings = useConfigStore((state) => state.labelPaddings);
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
            className={cn('bg-white border border-red-500', className)}
            style={{
                ...paperSize,
                padding: stringifyPaddings(sheetPaddings, measurementUnit),
            }}
            {...rest}
        >
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, ${labelWidth + measurementUnit})`,
                    gridTemplateRows: `repeat(${rows}, ${labelHeight + measurementUnit})`,
                }}
            >
                {columns > 0 &&
                    rows > 0 &&
                    [...Array(columns * rows).keys()].map((i) => (
                        <div
                            key={i}
                            style={{
                                border: '1px solid red',
                                width: labelWidth + measurementUnit,
                                height: labelHeight + measurementUnit,
                                maxWidth: labelWidth + measurementUnit,
                                maxHeight: labelHeight + measurementUnit,
                                padding: stringifyPaddings(
                                    labelPaddings,
                                    measurementUnit,
                                ),
                                boxSizing: 'border-box',
                                overflow: 'hidden',
                            }}
                        >
                            {!isPaddingOverflow && (
                                <img
                                    className={cn(
                                        'object-contain', // TODO 'object-scale-down' conditionally
                                        'size-full',
                                    )}
                                    src={label}
                                    alt="Label"
                                />
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}

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
            <Button onClick={() => zoomIn()}>
                <Plus />
            </Button>
            <Button onClick={() => zoomOut()}>
                <Minus />
            </Button>
            <Button onClick={() => resetTransform()}>
                <RotateCcw />
            </Button>
        </div>
    );
};

interface PageProps
    extends React.ComponentPropsWithoutRef<typeof TransformWrapper> {
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
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
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
            )}
        </TransformWrapper>
    );
}

export default Page;
