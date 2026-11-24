import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    WrapText,
} from 'lucide-react';
import { ColorPickerPreset } from '@/components/ColorPickerPreset';
import { ExpandableTextarea } from '@/components/ExpandableTextarea';
import { NumberSetter } from '@/components/NumberSetter';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FONT_FALLBACK,
    FONT_FAMILIES,
    FONTS,
    type FontFamily,
    TEXT_SIZE_MAX,
} from '@/domain/config';
import { useConfigStore, useText } from '@/store';
import { Row } from './Row';

export function TextContent() {
    const text = useText();
    const updateText = useConfigStore((state) => state.updateText);

    return (
        <>
            <ExpandableTextarea
                onChange={(event) => updateText({ data: event.target.value })}
                value={text.data}
            />
            <Row>
                <label htmlFor="font-family-select">Font</label>
                <Select
                    value={text.fontFamily}
                    onValueChange={(fontFamily) =>
                        updateText({
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
                    variant={text.align === 'left' ? 'default' : 'outline'}
                    onClick={() => updateText({ align: 'left' })}
                >
                    <AlignLeft />
                </Button>
                <Button
                    variant={text.align === 'center' ? 'default' : 'outline'}
                    onClick={() => updateText({ align: 'center' })}
                >
                    <AlignCenter />
                </Button>
                <Button
                    variant={text.align === 'right' ? 'default' : 'outline'}
                    onClick={() => updateText({ align: 'right' })}
                >
                    <AlignRight />
                </Button>
            </Row>
            <Row className="justify-between">
                <Row>
                    <label htmlFor="text-color-selector">Text&nbsp;color</label>
                    <ColorPickerPreset
                        id="text-color-selector"
                        withAlpha
                        value={text.color}
                        onValueChange={(color: string) => updateText({ color })}
                    />
                </Row>
                <Row>
                    <label htmlFor="wrap-control">Wrap</label>
                    <Button
                        id="wrap-control"
                        onClick={() => updateText({ wrap: !text.wrap })}
                    >
                        {text.wrap ? <WrapText /> : <AlignJustify />}
                    </Button>
                </Row>
            </Row>
            <NumberSetter
                label="Font size"
                unit="pt"
                value={text.size}
                setValue={(size) => updateText({ size })}
                max={TEXT_SIZE_MAX}
                step={0.5}
            />
            <NumberSetter
                value={text.fontWeight}
                setValue={(fontWeight) => updateText({ fontWeight })}
                label="Weight"
                step={50}
                min={FONTS[text.fontFamily ?? FONT_FALLBACK].minWeight}
                max={FONTS[text.fontFamily ?? FONT_FALLBACK].maxWeight}
            />
            <NumberSetter
                value={text.lineHeight}
                setValue={(lineHeight) => updateText({ lineHeight })}
                label="Line height"
                step={0.05}
                min={0.9}
                max={2}
            />
            <NumberSetter
                value={text.letterSpacing}
                setValue={(letterSpacing) => updateText({ letterSpacing })}
                unit="em"
                label="Spacing"
                step={0.01}
                min={-0.3}
                max={1}
            />
        </>
    );
}
