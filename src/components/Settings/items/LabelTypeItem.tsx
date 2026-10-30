import { ExpandableTextarea } from '@/components/ExpandableTextarea';
import { NumberSetter } from '@/components/NumberSetter';
import FilePickerTrigger from '@/components/Settings/FilePickerTrigger';
import { PositionsAccordionItem } from '@/components/Settings/PositionsAccordionItem';
import { Button } from '@/components/ui/button';
import { Field, FieldContent } from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    BORDER_WIDTH_MAX,
    FONT_FAMILIES,
    FONT_FALLBACK,
    FONT_WEIGHT_RANGES,
    isLabelType,
    TEXT_SIZE_MAX,
    type FontFamily,
} from '@/domain/config';
import { useConfigStore, useLabel } from '@/store';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    AlignJustify,
    WrapText,
} from 'lucide-react';

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
                        <ExpandableTextarea
                            className=""
                            disabled={label.type !== 'text'}
                            onChange={(event) =>
                                updateLabel({ text: event.target.value })
                            }
                            value={label.text}
                        />
                        <div className="flex items-center gap-2">
                            <label htmlFor="font-family-select">Font</label>
                            <Select
                                id="font-family-select"
                                value={label.fontFamily}
                                onValueChange={(fontFamily) =>
                                    updateLabel({
                                        fontFamily:
                                            (fontFamily as FontFamily) ??
                                            FONT_FALLBACK,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full grow">
                                    <SelectValue placeholder={FONT_FALLBACK} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {FONT_FAMILIES.map((font) => (
                                            <SelectItem key={font} value={font}>
                                                {font}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
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
                            <Button
                                onClick={() =>
                                    updateLabel({ textWrap: !label.textWrap })
                                }
                            >
                                {label.textWrap ? (
                                    <WrapText />
                                ) : (
                                    <AlignJustify />
                                )}
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
                        <NumberSetter
                            value={label.fontWeight}
                            setValue={(fontWeight) =>
                                updateLabel({ fontWeight })
                            }
                            label="Weight"
                            step={50}
                            min={
                                FONT_WEIGHT_RANGES[
                                    label.fontFamily ?? FONT_FALLBACK
                                ][0]
                            }
                            max={
                                FONT_WEIGHT_RANGES[
                                    label.fontFamily ?? FONT_FALLBACK
                                ][1]
                            }
                        />
                        <NumberSetter
                            value={label.lineHeight}
                            setValue={(lineHeight) =>
                                updateLabel({ lineHeight })
                            }
                            label="Line height"
                            step={0.05}
                            min={0.9}
                            max={2}
                        />
                        <NumberSetter
                            value={label.letterSpacing}
                            setValue={(letterSpacing) =>
                                updateLabel({ letterSpacing })
                            }
                            unit="em"
                            label="Spacing"
                            step={0.01}
                            min={-0.3}
                            max={1}
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
