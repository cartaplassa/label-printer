import { NumberSetter } from '@/components/NumberSetter';
import FilePickerTrigger from '@/components/Settings/FilePickerTrigger';
import { PositionsAccordionItem } from '@/components/Settings/PositionsAccordionItem';
import { Button } from '@/components/ui/button';
import { Field, FieldContent } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    BORDER_WIDTH_MAX,
    isLabelType,
    TEXT_SIZE_MAX,
    TextAlign,
} from '@/domain/config';
import { useConfigStore, useLabel } from '@/store';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { ReactNode } from 'react';

export function LabelTypeItem() {
    const label = useLabel();
    const updateLabel = useConfigStore((state) => state.updateLabel);

    return (
        <PositionsAccordionItem value="label" title="Label">
            <RadioGroup
                onValueChange={(value) => {
                    if (isLabelType(value)) updateLabel({ type: value });
                }}
                value={label.type}
            >
                <Field orientation="horizontal">
                    <RadioGroupItem id="label-type-image" value="image" />
                    <FieldContent>
                        <label htmlFor="label-type-image">Image</label>
                        <FilePickerTrigger disabled={label.type !== 'image'} />
                    </FieldContent>
                </Field>
                <Field orientation="horizontal">
                    <RadioGroupItem id="label-type-text" value="text" />
                    <FieldContent>
                        <label htmlFor="label-type-text">Text</label>
                        <div className="flex gap-2">
                            <Input
                                className="grow"
                                disabled={label.type !== 'text'}
                                onChange={(event) =>
                                    updateLabel({ text: event.target.value })
                                }
                                value={label.text}
                            />
                            <Button
                                variant={
                                    label.textAlign === 'left'
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() =>
                                    updateLabel({ textAlign: 'left' })
                                }
                            >
                                <AlignLeft />
                            </Button>
                            <Button
                                variant={
                                    label.textAlign === 'center'
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() =>
                                    updateLabel({ textAlign: 'center' })
                                }
                            >
                                <AlignCenter />
                            </Button>
                            <Button
                                variant={
                                    label.textAlign === 'right'
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() =>
                                    updateLabel({ textAlign: 'right' })
                                }
                            >
                                <AlignRight />
                            </Button>
                        </div>
                        <NumberSetter
                            disabled={label.type !== 'text'}
                            label="Font size"
                            unit="pt"
                            value={label.textSize}
                            setValue={(textSize) => updateLabel({ textSize })}
                            max={TEXT_SIZE_MAX}
                            step={0.5}
                        />
                    </FieldContent>
                </Field>
            </RadioGroup>

            <NumberSetter
                label="Border"
                unit="pt"
                value={label.borderWidth}
                setValue={(borderWidth) => updateLabel({ borderWidth })}
                max={BORDER_WIDTH_MAX}
                step={0.01}
            />
        </PositionsAccordionItem>
    );
}
