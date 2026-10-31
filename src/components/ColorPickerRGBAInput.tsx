import { type ComponentProps, useState } from 'react';
import { parseColor, useColorPickerContext } from './ui/ColorPicker';
import { Input } from './ui/input';

type ColorPickerRGBAInputProps = Omit<
    ComponentProps<typeof Input>,
    'value' | 'defaultValue' | 'onChange'
>;

const HEXA_PATTERN =
    /^#?(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function ColorPickerRGBAInput({
    onBlur,
    onFocus,
    onKeyDown,
    ...props
}: ColorPickerRGBAInputProps) {
    const { value, setValue, getChannelInputProps } = useColorPickerContext();
    const [draft, setDraft] = useState<string | null>(null);

    const channelProps = getChannelInputProps({ channel: 'hex' });
    const displayValue = value.toString('hexa');

    const commit = (input: string) => {
        const text = input.trim();
        if (!HEXA_PATTERN.test(text)) return;

        const hex = text.replace(/^#/, '');
        const color = parseColor(`#${hex}`);

        // 3 and 6 digit hex values carry no alpha, so keep the current one.
        setValue(
            hex.length === 4 || hex.length === 8
                ? color
                : color.withChannelValue(
                      'alpha',
                      value.getChannelValue('alpha'),
                  ),
        );
    };

    return (
        <Input
            {...props}
            aria-label={props['aria-label'] ?? 'Hex color with alpha'}
            autoComplete="off"
            data-slot="color-picker-rgba-input"
            disabled={props.disabled ?? channelProps.disabled}
            readOnly={props.readOnly ?? channelProps.readOnly}
            spellCheck={false}
            value={draft ?? displayValue}
            onBlur={(event) => {
                if (draft !== null) {
                    commit(draft);
                    setDraft(null);
                }
                onBlur?.(event);
            }}
            onChange={(event) => {
                const next = event.currentTarget.value;
                setDraft(next);

                // Preview complete hexa values as they are typed.
                const hex = next.trim().replace(/^#/, '');
                if (hex.length === 4 || hex.length === 8) {
                    commit(next);
                }
            }}
            onFocus={(event) => {
                onFocus?.(event);
                if (!event.defaultPrevented) {
                    event.currentTarget.select();
                }
            }}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    event.currentTarget.blur();
                } else if (event.key === 'Escape') {
                    event.preventDefault();
                    setDraft(null);
                }
                onKeyDown?.(event);
            }}
        />
    );
}
