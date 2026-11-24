import { BarcodeContent } from '@/components/Content/BarcodeContent';
import { BorderContent } from '@/components/Content/BorderContent';
import { Column } from '@/components/Content/Column';
import { ImageContent } from '@/components/Content/ImageContent';
import { TextContent } from '@/components/Content/TextContent';
import { Field, FieldContent } from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { isLabelType, LABEL_TYPES } from '@/domain/config';
import { capitalize } from '@/lib/capitalize';
import { useConfigActions, useLabel } from '@/store';

export function ContentTab() {
    const label = useLabel();
    const { updateLabel } = useConfigActions();

    return (
        <Column className="text-balance">
            <Column>
                <BorderContent />
            </Column>

            <RadioGroup
                onValueChange={(value) => {
                    if (isLabelType(value)) updateLabel({ type: value });
                }}
                value={label.type}
                className="flex flex-col gap-2"
            >
                {LABEL_TYPES.map((labelType) => (
                    <Field orientation="horizontal" key={labelType}>
                        <RadioGroupItem
                            id={`label-type-${labelType}`}
                            value={labelType}
                        />
                        <FieldContent>
                            <label htmlFor={`label-type-${labelType}`}>
                                {capitalize(labelType)}
                            </label>
                        </FieldContent>
                    </Field>
                ))}
            </RadioGroup>

            <Column className="px-1">
                {(() => {
                    switch (label.type) {
                        case 'image':
                            return <ImageContent />;
                        case 'barcode':
                            return <BarcodeContent />;
                        case 'text':
                            return <TextContent />;
                        default:
                            return <p>{'Wrong content type chosen'}</p>;
                    }
                })()}
            </Column>
        </Column>
    );
}
