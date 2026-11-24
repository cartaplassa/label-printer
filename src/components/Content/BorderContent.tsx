import type { ComponentPropsWithRef } from 'react';
import { ColorPickerPreset } from '@/components/ColorPickerPreset';
import { NumberSetter } from '@/components/NumberSetter';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { BORDER_STYLES, BORDER_WIDTH_MAX } from '@/domain/config';
import { cn } from '@/lib/cn';
import { useConfigStore, useLabel } from '@/store';
import { Row } from './Row';

export function BorderContent() {
    const label = useLabel();
    const updateLabel = useConfigStore((state) => state.updateLabel);
    return (
        <>
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
                    withAlpha
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
        </>
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
