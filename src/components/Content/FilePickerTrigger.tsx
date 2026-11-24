import type { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { useConfigStore } from '@/store';

type FilePickerTriggerProps = {
    disabled?: boolean;
};

export default function FilePickerTrigger({
    disabled,
}: FilePickerTriggerProps) {
    const updateImage = useConfigStore((state) => state.updateImage);
    const resetImage = useConfigStore((state) => state.resetImage);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            resetImage();
            return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            const result = loadEvent.target?.result;

            if (typeof result === 'string') updateImage({ data: result });
        };
        reader.readAsDataURL(file);
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
