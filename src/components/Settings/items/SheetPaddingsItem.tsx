import { NumberSetter } from '@/components/NumberSetter';
import { paddingLimit } from '@/domain/config';
import { SIDES } from '@/domain/paper';
import { capitalize } from '@/lib/capitalize';
import { useConfigStore, usePaperSize, useSheet } from '@/store';
import { PositionsAccordionItem } from '../PositionsAccordionItem';

export function SheetPaddingsItem() {
    const { paddings } = useSheet();
    const { width, height, unit } = usePaperSize();
    const setSheetPadding = useConfigStore((state) => state.setSheetPadding);

    return (
        <PositionsAccordionItem
            value="sheet-paddings"
            title="Sheet paddings"
            isGrid
        >
            {SIDES.map((side) => (
                <NumberSetter
                    isSubgrid
                    key={side}
                    value={paddings[side]}
                    setValue={(newValue) => setSheetPadding(side, newValue)}
                    max={paddingLimit(side, width, height)}
                    unit={unit}
                    label={capitalize(side)}
                />
            ))}
        </PositionsAccordionItem>
    );
}
