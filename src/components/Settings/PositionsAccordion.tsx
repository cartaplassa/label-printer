import { Accordion } from '@/components/ui/accordion';
import { LabelTypeItem } from '@/components/Settings/items/LabelTypeItem';
import { SheetPaddingsItem } from './items/SheetPaddingsItem';
import { LabelSizeItem } from './items/LabelSizeItem';
import { LabelPaddingsItem } from './items/LabelPaddingsItem';

export function PositionsAccordion() {
    return (
        <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="sheet-paddings"
        >
            <LabelTypeItem />
            <SheetPaddingsItem />
            <LabelSizeItem />
            <LabelPaddingsItem />
        </Accordion>
    );
}
