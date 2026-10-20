import { Accordion } from '@/components/ui/accordion';
import { LabelItem } from '@/components/Settings/items/LabelItem';
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
            <LabelItem />
            <SheetPaddingsItem />
            <LabelSizeItem />
            <LabelPaddingsItem />
        </Accordion>
    );
}
