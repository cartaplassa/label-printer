import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useConfigStore from '@/store';

interface FilePickerTriggerProps extends React.ComponentPropsWithoutRef<'div'> {
    fileSetter: (file: string) => void;
}

export default function FilePickerTrigger() {
    const setLabel = useConfigStore((state) => state.setLabel);
    const resetLabel = useConfigStore((state) => state.resetLabel);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className="grid w-full max-w-sm items-center gap-6">
            <Label htmlFor="picture">Label</Label>
            <Input id="picture" type="file" onChange={handleImageChange} />
        </div>
    );
}
