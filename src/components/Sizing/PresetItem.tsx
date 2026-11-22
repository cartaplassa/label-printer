import {
    Check,
    ClipboardPaste,
    Download,
    ListChecks,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SizingPresetsSchema, useSizingPresetsStore } from '@/store';
import { CustomAccordionItem } from './CustomAccordionItem';
import { PresetForm } from './PresetForm';
import { PresetRow } from './PresetRow';

export function PresetItem() {
    const presets = useSizingPresetsStore((state) => state.presets);
    const deletePresets = useSizingPresetsStore((state) => state.deletePresets);
    const importPresets = useSizingPresetsStore((state) => state.importPresets);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        () => new Set(),
    );
    const [feedback, setFeedback] = useState<'copied' | 'imported' | null>(
        null,
    );

    useEffect(() => {
        if (!feedback) return;

        const timeout = window.setTimeout(() => setFeedback(null), 1000);
        return () => window.clearTimeout(timeout);
    }, [feedback]);

    const startEdit = () => {
        setSelectedIds(new Set());
        setFeedback(null);
        setIsEditMode(true);
    };

    const cancelEdit = () => {
        setSelectedIds(new Set());
        setFeedback(null);
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
            .then(() => setFeedback('copied'))
            .catch(() => setFeedback(null));
    };

    const handleImportFromClipboard = async () => {
        if (!navigator.clipboard) return;

        try {
            const text = await navigator.clipboard.readText();
            const parsed = SizingPresetsSchema.safeParse(JSON.parse(text));

            if (!parsed.success || parsed.data.length === 0) return;

            importPresets(parsed.data);
            setFeedback('imported');
        } catch {
            return;
        }
    };

    return (
        <CustomAccordionItem value="saved-presets" title="Saved presets">
            <PresetForm />
            <div className="flex items-center gap-2">
                {isEditMode ? (
                    <>
                        <Button
                            className="flex-1"
                            variant="outline"
                            disabled={
                                selectedIds.size === 0 || feedback === 'copied'
                            }
                            onClick={handleExportSelected}
                            title="Copy selected presets as JSON"
                        >
                            {feedback === 'copied' ? <Check /> : <Download />}
                            {feedback === 'copied' ? 'Copied' : 'Export'}
                        </Button>
                        <Button
                            className="flex-1"
                            variant="destructive"
                            disabled={selectedIds.size === 0}
                            onClick={handleRemoveSelected}
                        >
                            <Trash2 />
                            Remove
                        </Button>
                        <Button
                            className="flex-1"
                            variant="ghost"
                            onClick={cancelEdit}
                        >
                            <X />
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            className="flex-2"
                            variant="outline"
                            disabled={feedback === 'imported'}
                            onClick={handleImportFromClipboard}
                            title="Paste presets copied as JSON"
                        >
                            {feedback === 'imported' ? (
                                <Check />
                            ) : (
                                <ClipboardPaste />
                            )}
                            {feedback === 'imported'
                                ? 'Imported'
                                : 'Import from clipboard'}
                        </Button>
                        <Button
                            className="flex-1"
                            variant="outline"
                            onClick={startEdit}
                        >
                            <ListChecks />
                            Edit
                        </Button>
                    </>
                )}
            </div>
            {presets.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No saved presets yet. Name the current sheet sizing to save
                    it here.
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
        </CustomAccordionItem>
    );
}
