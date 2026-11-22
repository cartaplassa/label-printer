import {
    Check,
    CornerDownLeft,
    Pencil,
    Square,
    SquareCheck,
    X,
} from 'lucide-react';
import {
    type ComponentPropsWithRef,
    type SubmitEventHandler,
    useEffect,
    useState,
} from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    SIZING_PRESET_NAME_MAX_LENGTH,
    type SizingPreset,
    useConfigStore,
    useSizingPresetsStore,
} from '@/store';
import { cn } from '@/lib/cn';

interface PresetRowProps {
    preset: SizingPreset;
    isEditMode: boolean;
    isSelected: boolean;
    onToggleSelected: (id: string) => void;
}

export function PresetRow({
    preset,
    isEditMode,
    isSelected,
    onToggleSelected,
}: PresetRowProps) {
    const [isRenaming, setIsRenaming] = useState(false);
    const [name, setName] = useState(preset.name);
    const applySizing = useConfigStore((state) => state.applySizing);
    const renamePreset = useSizingPresetsStore((state) => state.renamePreset);
    const trimmedName = name.trim();

    useEffect(() => {
        if (!isEditMode) setIsRenaming(false);
    }, [isEditMode]);

    const startRenaming = () => {
        setName(preset.name);
        setIsRenaming(true);
    };

    const cancelRenaming = () => {
        setName(preset.name);
        setIsRenaming(false);
    };

    const handleRename: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (!trimmedName) return;

        renamePreset(preset.id, trimmedName);
        setIsRenaming(false);
    };

    if (isRenaming) {
        return (
            <form onSubmit={handleRename} className="flex items-center gap-1">
                <Input
                    aria-label="Configuration name"
                    className="h-7 text-sm"
                    maxLength={SIZING_PRESET_NAME_MAX_LENGTH}
                    value={name}
                    autoFocus
                    onChange={(event) => setName(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Escape') cancelRenaming();
                    }}
                />
                <Button
                    type="submit"
                    disabled={!trimmedName}
                    aria-label="Apply rename"
                    title="Apply rename"
                >
                    <Check />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={cancelRenaming}
                    aria-label="Cancel rename"
                    title="Cancel rename"
                >
                    <X />
                </Button>
            </form>
        );
    }

    if (isEditMode) {
        return (
            <div className="flex items-center gap-1">
                <PresetName>{preset.name}</PresetName>
                <Button
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => onToggleSelected(preset.id)}
                    aria-pressed={isSelected}
                    aria-label={`${isSelected ? 'Deselect' : 'Select'} ${preset.name}`}
                    title={isSelected ? 'Deselect' : 'Select'}
                >
                    {isSelected ? <SquareCheck /> : <Square />}
                </Button>
                <Button
                    variant="outline"
                    onClick={startRenaming}
                    aria-label={`Rename ${preset.name}`}
                    title="Rename configuration"
                >
                    <Pencil />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <PresetName>{preset.name}</PresetName>
            <div className="flex shrink-0 items-center gap-1">
                <Button
                    variant="outline"
                    onClick={() => applySizing(preset.sizing)}
                    aria-label={`Apply ${preset.name}`}
                    title="Apply configuration"
                >
                    <CornerDownLeft />
                </Button>
            </div>
        </div>
    );
}

const PresetName = ({
    className,
    children,
    ...rest
}: ComponentPropsWithRef<'p'>) => (
    <p
        className={cn('min-w-0 [&&&]:mb-0 flex-1 truncate text-sm pl-2.75')}
        {...rest}
    >
        {children}
    </p>
);
