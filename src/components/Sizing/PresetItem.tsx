import {
    Check,
    ClipboardPaste,
    Download,
    ListChecks,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useSizingPresetsStore } from '@/store';
import { PresetForm } from './PresetForm';
import { PresetRow } from './PresetRow';

export function PresetItem() {
    const presets = useSizingPresetsStore((state) => state.presets);
    const deletePresets = useSizingPresetsStore((state) => state.deletePresets);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        () => new Set(),
    );
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (!isCopied) return;

        const timeout = window.setTimeout(() => setIsCopied(false), 1000);
        return () => window.clearTimeout(timeout);
    }, [isCopied]);

    const startEdit = () => {
        setSelectedIds(new Set());
        setIsCopied(false);
        setIsEditMode(true);
    };

    const cancelEdit = () => {
        setSelectedIds(new Set());
        setIsCopied(false);
        setIsEditMode(false);
    };

    const toggleSelected = (id: string) => {
        setSelectedIds((current) => {
            const next = new Set(current);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleRemoveSelected = () => {
        deletePresets([...selectedIds]);
        cancelEdit();
    };

    const handleExportSelected = () => {
        const selected = presets.filter((preset) => selectedIds.has(preset.id));
        if (!navigator.clipboard) return;

        navigator.clipboard
            .writeText(JSON.stringify(selected, null, 2))
            .then(() => setIsCopied(true))
            .catch(() => setIsCopied(false));
    };

    return (
        <AccordionItem value="saved-presets">
            <AccordionTrigger>Saved presets</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-3">
                <PresetForm />
                <div className="flex items-center gap-2">
                    {isEditMode ? (
                        <>
                            <Button
                                variant="outline"
                                disabled={selectedIds.size === 0 || isCopied}
                                onClick={handleExportSelected}
                                title="Copy selected presets as JSON"
                            >
                                {isCopied ? <Check /> : <Download />}
                                {isCopied ? 'Copied' : 'Export'}
                            </Button>
                            <Button
                                variant="destructive"
                                disabled={selectedIds.size === 0}
                                onClick={handleRemoveSelected}
                            >
                                <Trash2 />
                                Remove
                            </Button>
                            <Button variant="ghost" onClick={cancelEdit}>
                                <X />
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                title="Not implemented yet"
                            >
                                <ClipboardPaste />
                                Import from clipboard
                            </Button>
                            <Button variant="outline" onClick={startEdit}>
                                <ListChecks />
                                Edit
                            </Button>
                        </>
                    )}
                </div>
                {presets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No saved presets yet. Name the current sheet sizing to
                        save it here.
                    </p>
                ) : (
                    <ul className="flex flex-col gap-1">
                        {presets.map((preset) => (
                            <li key={preset.id}>
                                <PresetRow
                                    preset={preset}
                                    isEditMode={isEditMode}
                                    isSelected={selectedIds.has(preset.id)}
                                    onToggleSelected={toggleSelected}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}
