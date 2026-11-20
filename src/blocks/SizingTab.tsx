import { Accordion } from '@/components/ui/accordion';
import { LabelPaddingsItem } from '@/components/Sizing/LabelPaddingsItem';
import { LabelSizeItem } from '@/components/Sizing/LabelSizeItem';
import { SheetGapItem } from '@/components/Sizing/SheetGapItem';
import { SheetPaddingsItem } from '@/components/Sizing/SheetPaddingsItem';

export function SizingTab() {
    return (
        <Accordion className="w-full" defaultValue={['sheet-paddings']}>
            <SheetPaddingsItem />
            <SheetGapItem />
            <LabelSizeItem />
            <LabelPaddingsItem />
        </Accordion>
    );
}
