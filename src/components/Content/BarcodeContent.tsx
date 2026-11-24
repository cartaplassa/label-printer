import { useMemo } from 'react';
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
import { generateBarcodeDataUrl } from '@/domain/barcode';
import {
    BARCODE_HEIGHT_MAX,
    BARCODE_TYPE_LABELS,
    BARCODE_TYPES,
    isBarcodeType,
} from '@/domain/config';
import { useBarcode, useConfigStore } from '@/store';
import { Row } from './Row';
import { Pencil, PencilOff } from 'lucide-react';

export function BarcodeContent() {
    const barcode = useBarcode();
    const updateBarcode = useConfigStore((state) => state.updateBarcode);
    const { error } = useMemo(() => generateBarcodeDataUrl(barcode), [barcode]);

    return (
        <>
            <ExpandableTextarea
                value={barcode.data}
                onChange={(event) =>
                    updateBarcode({ data: event.target.value })
                }
            />
            {error ? (
                <p className="text-sm text-destructive" role="alert">
                    {error}
                </p>
            ) : null}
            <Row>
                <label htmlFor="barcode-type-select">Type</label>
                <Select
                    value={barcode.type}
                    onValueChange={(value) => {
                        if (isBarcodeType(value))
                            updateBarcode({ type: value });
                    }}
                >
                    <SelectTrigger
                        id="barcode-type-select"
                        className="w-full grow"
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {BARCODE_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {BARCODE_TYPE_LABELS[type]}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </Row>
            <Row className="justify-between">
                <Row>
                    <label htmlFor="text-control">Show text</label>
                    <Button
                        id="text-control"
                        onClick={() =>
                            updateBarcode({ includeText: !barcode.includeText })
                        }
                    >
                        {barcode.includeText ? <Pencil /> : <PencilOff />}
                    </Button>
                </Row>
                <Row>
                    <label htmlFor="barcode-text-color-selector">
                        Text&nbsp;color
                    </label>
                    <ColorPickerPreset
                        id="barcode-text-color-selector"
                        disabled={!barcode.includeText}
                        value={barcode.textColor}
                        onValueChange={(textColor) =>
                            updateBarcode({ textColor })
                        }
                    />
                </Row>
            </Row>
            <NumberSetter
                label="Bar height"
                value={barcode.height}
                setValue={(height) => updateBarcode({ height })}
                min={1}
                max={BARCODE_HEIGHT_MAX}
                step={1}
            />
            <Row>
                <label htmlFor="barcode-color-selector">Bars color</label>
                <ColorPickerPreset
                    id="barcode-color-selector"
                    value={barcode.color}
                    onValueChange={(color) => updateBarcode({ color })}
                />
            </Row>
        </>
    );
}
