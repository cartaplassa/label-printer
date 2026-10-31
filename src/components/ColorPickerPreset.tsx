import type { ColorPickerValueChangeDetails } from '@ark-ui/react/color-picker';
import {
    ColorPicker,
    ColorPickerArea,
    ColorPickerAreaThumb,
    ColorPickerContent,
    ColorPickerControl,
    ColorPickerEyeDropperTrigger,
    type ColorPickerProps,
    ColorPickerSlider,
    ColorPickerSwatchPreview,
    ColorPickerTransparencyGrid,
    ColorPickerTrigger,
    ColorPickerView,
} from '@/components/ui/ColorPicker';
import { ColorPickerRGBAInput } from './ColorPickerRGBAInput';
import { Button } from './ui/button';

export type ColorPickerPresetProps = Omit<ColorPickerProps, 'onValueChange'> & {
    onValueChange?: (val: string) => void;
};

export const ColorPickerPreset = ({
    onValueChange,
    ...rest
}: ColorPickerPresetProps) => {
    const handleValueChange = onValueChange
        ? (details: ColorPickerValueChangeDetails) => {
              onValueChange(details.value.toString('rgba'));
          }
        : () => {};

    return (
        <ColorPicker
            className="w-full max-w-64"
            defaultFormat="rgba"
            format="hsla"
            {...rest}
            onValueChange={handleValueChange}
        >
            <ColorPickerControl>
                <div className="flex items-stretch gap-2">
                    <ColorPickerTrigger asChild>
                        <Button variant="outline">
                            <ColorPickerSwatchPreview />
                        </Button>
                    </ColorPickerTrigger>
                    <ColorPickerRGBAInput style={{ width: '12ch' }} />
                </div>
            </ColorPickerControl>

            <ColorPickerContent>
                <ColorPickerArea showDots>
                    <ColorPickerAreaThumb />
                </ColorPickerArea>
                <ColorPickerView format="hsla">
                    <div className="flex items-center gap-3">
                        <ColorPickerEyeDropperTrigger />
                        <div className="flex flex-1 flex-col gap-2.5">
                            <ColorPickerSlider channel="hue" />
                            <ColorPickerSlider channel="alpha">
                                <ColorPickerTransparencyGrid className="rounded-full" />
                            </ColorPickerSlider>
                        </div>
                    </div>
                </ColorPickerView>
            </ColorPickerContent>
        </ColorPicker>
    );
};
