import { NumberSetter } from '@/components/NumberSetter';
import { paddingLimit } from '@/domain/config';
import { SIDES } from '@/domain/paper';
import { capitalize } from '@/lib/capitalize';
import { useConfigStore, useLabel, usePaperSize } from '@/store';
import { PositionsAccordionItem } from '../PositionsAccordionItem';

export function LabelPaddingsItem() {
    const label = useLabel();
    const { unit } = usePaperSize();
    const setLabelPadding = useConfigStore((state) => state.setLabelPadding);

    return (
        <PositionsAccordionItem
            value="label-paddings"
            title="Label paddings"
            isGrid
        >
            {SIDES.map((side) => (
                <NumberSetter
                    isSubgrid
                    key={side}
                    value={label.paddings[side]}
                    setValue={(newValue) => setLabelPadding(side, newValue)}
                    max={paddingLimit(side, label.width, label.height)}
                    unit={unit}
                    label={capitalize(side)}
                />
            ))}
        </PositionsAccordionItem>
    );
}
