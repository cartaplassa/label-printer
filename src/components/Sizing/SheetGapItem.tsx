import { NumberSetter } from '@/components/NumberSetter';
import { useConfigActions, useLabel, usePaperSize, useSheet } from '@/store';
import { CustomAccordionItem } from './CustomAccordionItem';

export function SheetGapItem() {
    const { gapX, gapY } = useSheet();
    const { width, height } = useLabel();
    const { unit } = usePaperSize();
    const { updateSheet } = useConfigActions();

    return (
        <CustomAccordionItem isGrid value="sheet-gap" title="Sheet gap">
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
        </CustomAccordionItem>
    );
}
