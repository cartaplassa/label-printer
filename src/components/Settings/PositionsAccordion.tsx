import { Accordion } from '@/components/ui/accordion';
import { LabelTypeItem } from '@/components/Settings/items/LabelTypeItem';
import { SheetPaddingsItem } from './items/SheetPaddingsItem';
import { LabelSizeItem } from './items/LabelSizeItem';
import { LabelPaddingsItem } from './items/LabelPaddingsItem';
import { SheetGapItem } from './items/SheetGapItem';

export function PositionsAccordion() {
    return (
        <Accordion className="w-full" defaultValue={['label']}>
            <LabelTypeItem />
            <SheetPaddingsItem />
            <SheetGapItem />
            <LabelSizeItem />
            <LabelPaddingsItem />
        </Accordion>
    );
}
