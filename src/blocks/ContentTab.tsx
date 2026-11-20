import { ColorPickerPreset } from '@/components/ColorPickerPreset';
import { ExpandableTextarea } from '@/components/ExpandableTextarea';
import { NumberSetter } from '@/components/NumberSetter';
import FilePickerTrigger from '@/components/Content/FilePickerTrigger';
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
    BORDER_STYLES,
    FontFamily,
} from '@/domain/config';
import { cn } from '@/lib/cn';
import { useConfigStore, useLabel } from '@/store';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    AlignJustify,
    WrapText,
} from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';

const Row = ({
    className,
    children,
    ...rest
}: ComponentPropsWithRef<'div'>) => (
    <div className={cn('flex items-center gap-2', className)} {...rest}>
        {children}
    </div>
);

export function ContentTab() {
    const label = useLabel();
    const updateLabel = useConfigStore((state) => state.updateLabel);

    return (
        <div className="flex flex-col gap-4 text-balance">
            <div className="flex flex-col gap-4">
                <NumberSetter
                    label="Border"
                    unit="pt"
                    value={label.borderWidth}
                    setValue={(borderWidth) => updateLabel({ borderWidth })}
                    max={BORDER_WIDTH_MAX}
                    step={0.01}
                />
                <Row>
                    <label htmlFor="border-color-selector">Color</label>
                    <ColorPickerPreset
                        id="border-color-selector"
                        value={label.borderColor}
                        onValueChange={(borderColor: string) =>
                            updateLabel({ borderColor })
                        }
                    />
                    <label htmlFor="border-style-select">Style</label>
                    <Select
                        value={label.borderStyle}
                        onValueChange={(borderStyle) =>
                            updateLabel({
                                borderStyle:
                                    borderStyle as typeof label.borderStyle,
                            })
                        }
                    >
                        <SelectTrigger
                            id="border-style-select"
                            className="w-full grow"
                        >
                            <SelectValue
                                render={(props, state) => (
                                    <BorderStyleShowcase
                                        borderStyle={String(state.value)}
                                        {...props}
                                    />
                                )}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {BORDER_STYLES.map((borderStyle) => (
                                    <SelectItem
                                        key={borderStyle}
                                        value={borderStyle}
                                    >
                                        <BorderStyleShowcase
                                            borderStyle={borderStyle}
                                        />
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Row>
            </div>

            <RadioGroup
                onValueChange={(value) => {
                    if (isLabelType(value)) updateLabel({ type: value });
                }}
                value={label.type}
                className="flex flex-col gap-2"
            >
                <Field orientation="horizontal">
                    <RadioGroupItem id="label-type-image" value="image" />
                    <FieldContent>
                        <label htmlFor="label-type-image">Image</label>
                    </FieldContent>
                </Field>
                <Field orientation="horizontal">
                    <RadioGroupItem id="label-type-text" value="text" />
                    <FieldContent>
                        <label htmlFor="label-type-text">Text</label>
                    </FieldContent>
                </Field>
            </RadioGroup>

            <div className="flex flex-col gap-4">
                {label.type === 'image' ? (
                    <FilePickerTrigger />
                ) : (
                    <>
                        <ExpandableTextarea
                            className=""
                            onChange={(event) =>
                                updateLabel({
                                    text: event.target.value,
                                })
                            }
                            value={label.text}
                        />
                        <Row>
                            <label htmlFor="font-family-select">Font</label>
                            <Select
                                value={label.fontFamily}
                                onValueChange={(fontFamily) =>
                                    updateLabel({
                                        fontFamily: fontFamily as FontFamily,
                                    })
                                }
                            >
                                <SelectTrigger
                                    id="font-family-select"
                                    className="w-full grow"
                                >
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
                        </Row>
                        <Row className="justify-between">
                            <Row>
                                <label htmlFor="text-color-selector">
                                    Text&nbsp;color
                                </label>
                                <ColorPickerPreset
                                    id="text-color-selector"
                                    value={label.textColor}
                                    onValueChange={(textColor: string) =>
                                        updateLabel({ textColor })
                                    }
                                />
                            </Row>
                            <Row>
                                <label htmlFor="wrap-control">Wrap</label>
                                <Button
                                    id="wrap-control"
                                    onClick={() =>
                                        updateLabel({
                                            textWrap: !label.textWrap,
                                        })
                                    }
                                >
                                    {label.textWrap ? (
                                        <WrapText />
                                    ) : (
                                        <AlignJustify />
                                    )}
                                </Button>
                            </Row>
                        </Row>
                        <NumberSetter
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
                    </>
                )}
            </div>
        </div>
    );
}

type BorderStyleShowcaseProps = ComponentPropsWithRef<'div'> & {
    borderStyle: string;
};

const BorderStyleShowcase = ({
    borderStyle,
    className,
    ...rest
}: BorderStyleShowcaseProps) => (
    <div className={cn('p-2 w-full', className)} {...rest}>
        <div
            className="border-t-4 border-t-primary w-full"
            style={{ borderStyle }}
        />
    </div>
);
