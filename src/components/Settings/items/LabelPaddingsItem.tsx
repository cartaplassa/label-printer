import { NumberSetter } from '@/components/NumberSetter';
import { PositionsAccordionItem } from '../PositionsAccordionItem';
import { typedKeys } from '@/lib/typedKeys';
import { capitalize } from '@/lib/capitalize';
import useConfigStore, { Side } from '@/store';

export function LabelPaddingsItem() {
    const labelPaddings = useConfigStore((state) => state.labelPaddings);
    const setLabelPadding = useConfigStore((state) => state.setLabelPadding);
    const labelWidth = useConfigStore((state) => state.labelWidth);
    const labelHeight = useConfigStore((state) => state.labelHeight);

    return (
        <PositionsAccordionItem
            value="label-paddings"
            title="Label paddings"
            isGrid
        >
            {typedKeys(labelPaddings).map((k: Side) => (
                <NumberSetter
                    isSubgrid
                    key={k}
                    value={labelPaddings[k]}
                    setValue={(newValue) => setLabelPadding(k, newValue)}
                    max={
                        {
                            top: labelHeight,
                            bottom: labelHeight,
                            left: labelWidth,
                            right: labelWidth,
                        }[k]
                    }
                    label={capitalize(k)}
                />
            ))}
        </PositionsAccordionItem>
    );
}
