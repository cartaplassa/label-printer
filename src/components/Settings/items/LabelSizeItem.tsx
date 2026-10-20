import useConfigStore, { PAPER_FORMAT_DIMENSIONS } from '@/store';
import { NumberSetter } from '@/components/NumberSetter';
import { PositionsAccordionItem } from '../PositionsAccordionItem';

export function LabelSizeItem() {
    const paperFormat = useConfigStore((state) => state.paperFormat);
    const labelWidth = useConfigStore((state) => state.labelWidth);
    const setLabelWidth = useConfigStore((state) => state.setLabelWidth);
    const labelHeight = useConfigStore((state) => state.labelHeight);
    const setLabelHeight = useConfigStore((state) => state.setLabelHeight);

    return (
        <PositionsAccordionItem value="label-size" title="Label size" isGrid>
            <NumberSetter
                isSubgrid
                value={labelWidth}
                setValue={setLabelWidth}
                max={PAPER_FORMAT_DIMENSIONS[paperFormat].width}
                label="Width"
            />
            <NumberSetter
                isSubgrid
                value={labelHeight}
                setValue={setLabelHeight}
                max={PAPER_FORMAT_DIMENSIONS[paperFormat].height}
                label="Height"
            />
        </PositionsAccordionItem>
    );
}
