import { LabelPaddingsItem } from '@/components/Sizing/LabelPaddingsItem';
import { LabelSizeItem } from '@/components/Sizing/LabelSizeItem';
import { PaperControls } from '@/components/Sizing/PaperControls';
import { PresetItem } from '@/components/Sizing/PresetItem';
import { SheetGapItem } from '@/components/Sizing/SheetGapItem';
import { SheetPaddingsItem } from '@/components/Sizing/SheetPaddingsItem';
import { Accordion } from '@/components/ui/accordion';

export function SizingTab() {
    return (
        <div className="flex w-full flex-col gap-2">
            <PaperControls />
            <Accordion
                className="w-full"
                defaultValue={['saved-presets', 'sheet-paddings']}
            >
                <PresetItem />
                <SheetPaddingsItem />
                <SheetGapItem />
                <LabelSizeItem />
                <LabelPaddingsItem />
            </Accordion>
        </div>
    );
}
