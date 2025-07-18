import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useConfigStore from '@/store';
import type { ChangeEvent } from 'react';

export default function FilePickerTrigger() {
    const setLabel = useConfigStore((state) => state.setLabel);
    const resetLabel = useConfigStore((state) => state.resetLabel);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setLabel(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        } else {
            resetLabel();
        }
    };

    return (
        <Label htmlFor="picture">
            Label
            <Input id="picture" type="file" onChange={handleImageChange} />
        </Label>
    );
}
