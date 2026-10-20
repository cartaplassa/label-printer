import { Input } from '@/components/ui/input';
import useConfigStore from '@/store';
import type { ChangeEvent } from 'react';

type FilePickerTriggerProps = {
    disabled?: boolean;
};

export default function FilePickerTrigger({
    disabled,
}: FilePickerTriggerProps) {
    const setLabelImage = useConfigStore((state) => state.setLabelImage);
    const resetLabelImage = useConfigStore((state) => state.resetLabelImage);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setLabelImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        } else {
            resetLabelImage();
        }
    };

    return (
        <Input
            disabled={disabled}
            id="picture"
            type="file"
            onChange={handleImageChange}
        />
    );
}
