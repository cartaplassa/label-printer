import cn from '@/cn';
import useConfigStore, { PAPER_FORMAT_DIMENSIONS } from '@/store';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import PaperFormatSelector from '@/components/Settings/PaperFormatSelector';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import FilePickerTrigger from '@/components/Settings/FilePickerTrigger';
import { PositionsAccordion } from '@/components/Settings/PositionsAccordion';

interface SettingsProps extends React.ComponentPropsWithoutRef<'div'> {}

function Settings({ className, ...rest }: SettingsProps) {
    const paperFormat = useConfigStore((state) => state.paperFormat);
    const setPaperFormat = useConfigStore((state) => state.setPaperFormat);

    return (
        <div
            className={cn(
                // 'fixed right-0 top-[50%] transform -translate-1/2',
                'border border-red-500 p-2 rounded-md',
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
                <a
                    href="https://github.com/cartaplassa/label-printer"
                    target="_blank"
                    rel="noopener"
                >
                    <Button>
                        <Github />
                    </Button>
                </a>
                <ThemeToggle />
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
