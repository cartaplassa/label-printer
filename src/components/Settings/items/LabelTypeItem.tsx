import useConfigStore from '@/store';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FilePickerTrigger from '@/components/Settings/FilePickerTrigger';
import { Input } from '@/components/ui/input';
import { Field, FieldContent } from '@/components/ui/field';
import { NumberSetter } from '@/components/NumberSetter';
import { PositionsAccordionItem } from '@/components/Settings/PositionsAccordionItem';

export function LabelTypeItem() {
    const labelType = useConfigStore((state) => state.labelType);
    const setLabelType = useConfigStore((state) => state.setLabelType);
    const labelText = useConfigStore((state) => state.labelText);
    const setLabelText = useConfigStore((state) => state.setLabelText);
    const labelTextSize = useConfigStore((state) => state.labelTextSize);
    const setLabelTextSize = useConfigStore((state) => state.setLabelTextSize);
    const labelBorderWidth = useConfigStore((state) => state.labelBorderWidth);
    const setLabelBorderWidth = useConfigStore(
        (state) => state.setLabelBorderWidth,
    );

    return (
        <PositionsAccordionItem value="label" title="Label">
            <RadioGroup onValueChange={setLabelType} value={labelType}>
                <Field orientation="horizontal">
                    <RadioGroupItem id="label-type-image" value="image" />
                    <FieldContent>
                        <label htmlFor="label-type-image">Image</label>
                        <FilePickerTrigger disabled={labelType !== 'image'} />
                    </FieldContent>
                </Field>
                <Field orientation="horizontal">
                    <RadioGroupItem id="label-type-text" value="text" />
                    <FieldContent>
                        <label htmlFor="label-type-text">Text</label>
                        <Input
                            disabled={labelType !== 'text'}
                            onChange={(e) => setLabelText(e.target.value)}
                            value={labelText}
                        />
                        <NumberSetter
                            disabled={labelType !== 'text'}
                            label="Font&nbsp;size"
                            value={labelTextSize}
                            setValue={setLabelTextSize}
                            max={100}
                            step={0.5}
                        />
                    </FieldContent>
                </Field>
            </RadioGroup>

            <NumberSetter
                label="Border"
                value={labelBorderWidth}
                setValue={setLabelBorderWidth}
                max={10}
                step={0.01}
            />
        </PositionsAccordionItem>
    );
}
