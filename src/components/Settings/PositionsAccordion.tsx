import cn from '@/cn';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Slider } from '../ui/slider';
import useConfigStore, {
    PAPER_FORMAT_DIMENSIONS,
    type PaperFormat,
} from '@/store';
import { Input } from '../ui/input';
import type { ComponentPropsWithoutRef } from 'react';

interface NumberSetterProps extends ComponentPropsWithoutRef<'div'> {
    value: number;
    setValue: (newValue: number) => void;
    max: number;
    label: string;
}

function NumberSetter({
    className,
    value,
    setValue,
    max,
    label,
    ...rest
}: NumberSetterProps) {
    return (
        <div className={cn('flex gap-3 items-center', className)} {...rest}>
            <span className="min-w-12 max-w-12">{label}</span>
            <Slider
                defaultValue={[value]}
                onValueChange={(newValue) => setValue(newValue[0])}
                min={0}
                max={max}
                step={0.01}
                className={cn('grow')}
            />
            <Input
                className="min-w-24 max-w-24"
                type="number"
                step={0.01}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
            />
        </div>
    );
}

interface PositionsAccordionItemProps
    extends ComponentPropsWithoutRef<typeof AccordionItem> {}

function PositionsAccordionItem({
    className,
    value,
    title,
    children,
    ...rest
}: PositionsAccordionItemProps) {
    return (
        <AccordionItem className={cn('', className)} {...{ value, ...rest }}>
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
                {children}
            </AccordionContent>
        </AccordionItem>
    );
}

interface PositionsAccordionProps {
    paperFormat: PaperFormat;
}

export function PositionsAccordion({ paperFormat }: PositionsAccordionProps) {
    const sheetPaddings = useConfigStore((state) => state.sheetPaddings);
    const setSheetPadding = useConfigStore((state) => state.setSheetPadding);
    const labelPaddings = useConfigStore((state) => state.labelPaddings);
    const setLabelPadding = useConfigStore((state) => state.setLabelPadding);

    const labelWidth = useConfigStore((state) => state.labelWidth);
    const setLabelWidth = useConfigStore((state) => state.setLabelWidth);
    const labelHeight = useConfigStore((state) => state.labelHeight);
    const setLabelHeight = useConfigStore((state) => state.setLabelHeight);

    return (
        <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="sheet-paddings"
        >
            <PositionsAccordionItem
                value="sheet-paddings"
                title="Sheet paddings"
            >
                {/* {Object.keys(labelPaddings).map((k)=>(<NumberSetter key={k} value={labelPaddings[k as Side]} setValue={(newValue)=>setLabelPadding(k as Side, newValue)} max={} />))} */}
                <NumberSetter
                    value={sheetPaddings.top}
                    setValue={(newValue) => setSheetPadding('top', newValue)}
                    max={PAPER_FORMAT_DIMENSIONS[paperFormat].height}
                    label="Top"
                />
                <NumberSetter
                    value={sheetPaddings.right}
                    setValue={(newValue) => setSheetPadding('right', newValue)}
                    max={PAPER_FORMAT_DIMENSIONS[paperFormat].width}
                    label="Right"
                />
                <NumberSetter
                    value={sheetPaddings.bottom}
                    setValue={(newValue) => setSheetPadding('bottom', newValue)}
                    max={PAPER_FORMAT_DIMENSIONS[paperFormat].height}
                    label="Bottom"
                />
                <NumberSetter
                    value={sheetPaddings.left}
                    setValue={(newValue) => setSheetPadding('left', newValue)}
                    max={PAPER_FORMAT_DIMENSIONS[paperFormat].width}
                    label="Left"
                />
            </PositionsAccordionItem>
            <PositionsAccordionItem value="label-size" title="Label size">
                <NumberSetter
                    value={labelWidth}
                    setValue={setLabelWidth}
                    max={PAPER_FORMAT_DIMENSIONS[paperFormat].width}
                    label="Width"
                />
                <NumberSetter
                    value={labelHeight}
                    setValue={setLabelHeight}
                    max={PAPER_FORMAT_DIMENSIONS[paperFormat].height}
                    label="Height"
                />
            </PositionsAccordionItem>
            <PositionsAccordionItem
                value="label-paddings"
                title="Label paddings"
            >
                <NumberSetter
                    value={labelPaddings.top}
                    setValue={(newValue) => setLabelPadding('top', newValue)}
                    max={labelHeight / 2}
                    label="Top"
                />
                <NumberSetter
                    value={labelPaddings.right}
                    setValue={(newValue) => setLabelPadding('right', newValue)}
                    max={labelWidth / 2}
                    label="Right"
                />
                <NumberSetter
                    value={labelPaddings.bottom}
                    setValue={(newValue) => setLabelPadding('bottom', newValue)}
                    max={labelHeight / 2}
                    label="Bottom"
                />
                <NumberSetter
                    value={labelPaddings.left}
                    setValue={(newValue) => setLabelPadding('left', newValue)}
                    max={labelWidth / 2}
                    label="Left"
                />
            </PositionsAccordionItem>
        </Accordion>
    );
}
