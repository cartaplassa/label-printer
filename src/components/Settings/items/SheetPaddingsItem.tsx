import useConfigStore, {
    PAPER_FORMAT_DIMENSIONS,
    Side,
    sideToDimension,
} from '@/store';
import { NumberSetter } from '@/components/NumberSetter';
import { PositionsAccordionItem } from '../PositionsAccordionItem';
import { capitalize } from '@/lib/capitalize';
import { typedKeys } from '@/lib/typedKeys';

export function SheetPaddingsItem() {
    const paperFormat = useConfigStore((state) => state.paperFormat);
    const sheetPaddings = useConfigStore((state) => state.sheetPaddings);
    const setSheetPadding = useConfigStore((state) => state.setSheetPadding);
    return (
        <PositionsAccordionItem
            value="sheet-paddings"
            title="Sheet paddings"
            isGrid
        >
            {typedKeys(sheetPaddings).map((k: Side) => (
                <NumberSetter
                    isSubgrid
                    key={k}
                    value={sheetPaddings[k]}
                    setValue={(newValue) => setSheetPadding(k, newValue)}
                    max={
                        PAPER_FORMAT_DIMENSIONS[paperFormat][sideToDimension[k]]
                    }
                    label={capitalize(k)}
                />
            ))}
        </PositionsAccordionItem>
    );
}
