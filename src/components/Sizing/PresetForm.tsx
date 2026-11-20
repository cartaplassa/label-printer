import { Save } from 'lucide-react';
import { type SubmitEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    SIZING_PRESET_NAME_MAX_LENGTH,
    useSizing,
    useSizingPresetsStore,
} from '@/store';

export function PresetForm() {
    const [name, setName] = useState('');
    const sizing = useSizing();
    const savePreset = useSizingPresetsStore((state) => state.savePreset);
    const trimmedName = name.trim();

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (!trimmedName) return;

        savePreset(trimmedName, sizing);
        setName('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
                aria-label="Preset name"
                placeholder="Preset name"
                maxLength={SIZING_PRESET_NAME_MAX_LENGTH}
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <Button
                type="submit"
                disabled={!trimmedName}
                aria-label="Save preset"
                title="Save preset"
            >
                <Save />
            </Button>
        </form>
    );
}
