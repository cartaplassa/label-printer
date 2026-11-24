import type { ColorPickerValueChangeDetails } from '@ark-ui/react/color-picker';
import { useRef } from 'react';
import {
    ColorPicker,
    ColorPickerArea,
    ColorPickerAreaThumb,
    ColorPickerContent,
    ColorPickerControl,
    ColorPickerEyeDropperTrigger,
    ColorPickerInput,
    type ColorPickerProps,
    ColorPickerSlider,
    ColorPickerSwatchPreview,
    ColorPickerTransparencyGrid,
    ColorPickerTrigger,
    ColorPickerView,
} from '@/components/ui/ColorPicker';
import { cn } from '@/lib/cn';
import { ColorPickerRGBAInput } from './ColorPickerRGBAInput';
import { Button } from './ui/button';
import { Input } from './ui/input';

export type ColorPickerPresetProps = Omit<ColorPickerProps, 'onValueChange'> & {
    onValueChange?: (val: string) => void;
    withAlpha?: boolean;
};

export const ColorPickerPreset = ({
    onValueChange,
    id,
    className,
    disabled,
    withAlpha = false,
    ...rest
}: ColorPickerPresetProps) => {
    // A hue change on pure black has no visible effect, so the controlled
    // value would stay unchanged and the slider would appear inert. Nudge it
    // to the nearest visible color while keeping the selected hue.
    const hueInteraction = useRef(false);

    const handleValueChange = onValueChange
        ? (details: ColorPickerValueChangeDetails) => {
              const nudgeBlack = hueInteraction.current;
              hueInteraction.current = false;

              let color = details.value;
              if (nudgeBlack) {
                  const rgb = color.toFormat('rgba');
                  const isBlack =
                      rgb.getChannelValue('red') === 0 &&
                      rgb.getChannelValue('green') === 0 &&
                      rgb.getChannelValue('blue') === 0;
                  if (isBlack) {
                      color = color
                          .withChannelValue('saturation', 100)
                          .withChannelValue('lightness', 1);
                  }
              }

              onValueChange(color.toString(withAlpha ? 'rgba' : 'hex'));
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
                <div
                    className={cn('flex items-stretch gap-2', className)}
                    id={id}
                >
                    <ColorPickerTrigger disabled={disabled} asChild>
                        <Button variant="outline">
                            <ColorPickerSwatchPreview />
                        </Button>
                    </ColorPickerTrigger>
                    {withAlpha ? (
                        <ColorPickerRGBAInput
                            disabled={disabled}
                            style={{ width: '12ch' }}
                        />
                    ) : (
                        <ColorPickerInput channel="hex" asChild>
                            <Input
                                disabled={disabled}
                                style={{ width: '10ch' }}
                            />
                        </ColorPickerInput>
                    )}
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
                            <ColorPickerSlider
                                channel="hue"
                                onPointerDown={() => {
                                    hueInteraction.current = true;
                                }}
                                onKeyDown={() => {
                                    hueInteraction.current = true;
                                }}
                            />
                            {withAlpha ? (
                                <ColorPickerSlider channel="alpha">
                                    <ColorPickerTransparencyGrid className="rounded-full" />
                                </ColorPickerSlider>
                            ) : null}
                        </div>
                    </div>
                </ColorPickerView>
            </ColorPickerContent>
        </ColorPicker>
    );
};
