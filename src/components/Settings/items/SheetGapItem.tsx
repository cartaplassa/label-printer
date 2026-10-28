import { NumberSetter } from '@/components/NumberSetter';
import { useConfigStore, useLabel, usePaperSize, useSheet } from '@/store';
import { PositionsAccordionItem } from '../PositionsAccordionItem';

export function SheetGapItem() {
    const { gapX, gapY } = useSheet();
    const { width, height } = useLabel();
    const { unit } = usePaperSize();
    const updateSheet = useConfigStore((state) => state.updateSheet);

    return (
        <PositionsAccordionItem isGrid value="sheet-gap" title="Sheet gap">
            <NumberSetter
                isSubgrid
                value={gapX}
                setValue={(newGapX) => updateSheet({ gapX: newGapX })}
                max={width}
                unit={unit}
                label="X gap"
            />
            <NumberSetter
                isSubgrid
                value={gapY}
                setValue={(newGapY) => updateSheet({ gapY: newGapY })}
                max={height}
                unit={unit}
                label="Y gap"
            />
        </PositionsAccordionItem>
    );
}
