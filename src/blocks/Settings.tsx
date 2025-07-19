import cn from '@/cn';
import useConfigStore, { PAPER_FORMAT_DIMENSIONS } from '@/store';
import PaperFormatSelector from '@/components/Settings/PaperFormatSelector';
import ThemeToggle from '@/components/ThemeToggle';
import FilePickerTrigger from '@/components/Settings/FilePickerTrigger';
import { PositionsAccordion } from '@/components/Settings/PositionsAccordion';
import RepoLink from '@/components/RepoLink';
import PrintButton from '@/components/PrintButton';
import type { ComponentPropsWithoutRef } from 'react';

interface SettingsProps extends ComponentPropsWithoutRef<'div'> {}

function Settings({ className, ...rest }: SettingsProps) {
    const paperFormat = useConfigStore((state) => state.paperFormat);
    const setPaperFormat = useConfigStore((state) => state.setPaperFormat);

    return (
        <div
            className={cn(
                'border border-stone-500 p-2 rounded-md',
                'bg-background',
                'flex flex-col gap-2',
                className,
            )}
            {...rest}
        >
            <div className="flex gap-2 items-center">
                <h1>label-printer</h1>
                <div className="grow">
                    <span className="hidden">
                        That's a spacer with an invisible text you shouldn't be
                        able to read
                    </span>
                </div>
                <PrintButton />
                <ThemeToggle />
                <RepoLink />
            </div>
            <PaperFormatSelector
                className="w-full"
                value={paperFormat}
                onValueChange={setPaperFormat}
                options={Object.keys(PAPER_FORMAT_DIMENSIONS)}
            />
            <FilePickerTrigger />
            <PositionsAccordion paperFormat={paperFormat} />
        </div>
    );
}

export default Settings;
