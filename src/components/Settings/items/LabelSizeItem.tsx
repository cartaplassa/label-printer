import { NumberSetter } from '@/components/NumberSetter';
import { useConfigStore, useLabel, usePaperSize } from '@/store';
import { PositionsAccordionItem } from '../PositionsAccordionItem';

export function LabelSizeItem() {
    const { width, height } = useLabel();
    const { width: paperWidth, height: paperHeight, unit } = usePaperSize();
    const updateLabel = useConfigStore((state) => state.updateLabel);

    return (
        <PositionsAccordionItem value="label-size" title="Label size" isGrid>
            <NumberSetter
                isSubgrid
                value={width}
                setValue={(width) => updateLabel({ width })}
                max={paperWidth}
                unit={unit}
                label="Width"
            />
            <NumberSetter
                isSubgrid
                value={height}
                setValue={(height) => updateLabel({ height })}
                max={paperHeight}
                unit={unit}
                label="Height"
            />
        </PositionsAccordionItem>
    );
}
