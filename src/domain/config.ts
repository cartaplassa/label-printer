import exampleImage from '@/assets/exampleImage';
import {
    convertLength,
    getPaperSize,
    isPaperFormat,
    type PaperFormat,
    roundLength,
    type Side,
    type Sides,
    sideToDimension,
    type Unit,
} from './paper';

export type LabelType = 'text' | 'image';
export type TextAlign = 'left' | 'center' | 'right';
export const TEXT_ALIGN_OPTIONS = [
    'left',
    'center',
    'right',
] as const satisfies TextAlign[];

export interface LabelConfig {
    type: LabelType;
    image: string;
    text: string;
    textAlign: TextAlign;
    textSize: number; // pt
    borderWidth: number; // pt
    width: number; // uom
    height: number; // uom
    paddings: Sides<number>;
}

export interface SheetConfig {
    format: PaperFormat;
    landscape: boolean;
    paddings: Sides<number>;
    gapX: number;
    gapY: number;
}

export interface Config {
    label: LabelConfig;
    sheet: SheetConfig;
}

export type LabelPatch = Partial<Omit<LabelConfig, 'paddings'>>;
export type SheetPatch = Partial<
    Omit<SheetConfig, 'paddings' | 'format' | 'landscape'>
>;

export const TEXT_SIZE_MAX = 100;
export const BORDER_WIDTH_MAX = 10;
export const DEFAULT_IMAGE = exampleImage;

const DEFAULT_FORMAT: PaperFormat = 'A4';
const DEFAULT_LABEL_WIDTH = 3;
const DEFAULT_LABEL_HEIGHT = 1;
const DEFAULT_PADDING = 0.1;
const DEFAULT_TEXT_SIZE = 16;
const DEFAULT_BORDER_WIDTH = 1;
const DEFAULT_TEXT = '';
const DEFAULT_TEXT_ALIGN = 'center';
const DEFAULT_LABEL_TYPE: LabelType = 'image';

export const isLabelType = (value: unknown): value is LabelType =>
    value === 'text' || value === 'image';

const createPaddings = (): Sides<number> => ({
    top: DEFAULT_PADDING,
    right: DEFAULT_PADDING,
    bottom: DEFAULT_PADDING,
    left: DEFAULT_PADDING,
});

export function createDefaultConfig(): Config {
    return {
        label: {
            type: DEFAULT_LABEL_TYPE,
            image: DEFAULT_IMAGE,
            text: DEFAULT_TEXT,
            textAlign: DEFAULT_TEXT_ALIGN,
            textSize: DEFAULT_TEXT_SIZE,
            borderWidth: DEFAULT_BORDER_WIDTH,
            width: DEFAULT_LABEL_WIDTH,
            height: DEFAULT_LABEL_HEIGHT,
            paddings: createPaddings(),
        },
        sheet: {
            format: DEFAULT_FORMAT,
            landscape: false,
            paddings: createPaddings(),
            gapX: 0,
            gapY: 0,
        },
    };
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

export const isConfig = (value: unknown): value is Config =>
    isRecord(value) && isRecord(value.label) && isRecord(value.sheet);

const numberOr = (value: unknown, fallback: number): number =>
    typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const clamp = (value: number, min: number, max: number): number =>
    Math.min(Math.max(value, min), max);

export const paddingLimit = (
    side: Side,
    width: number,
    height: number,
): number => (sideToDimension[side] === 'width' ? width : height) / 2;

const clampPadding = (
    value: unknown,
    side: Side,
    width: number,
    height: number,
): number => clamp(numberOr(value, 0), 0, paddingLimit(side, width, height));

export function clampPaddings(
    paddings: Sides<number>,
    width: number,
    height: number,
): Sides<number> {
    return {
        top: clampPadding(paddings.top, 'top', width, height),
        right: clampPadding(paddings.right, 'right', width, height),
        bottom: clampPadding(paddings.bottom, 'bottom', width, height),
        left: clampPadding(paddings.left, 'left', width, height),
    };
}

const mapPaddings = (
    paddings: Sides<number>,
    fn: (value: number) => number,
): Sides<number> => ({
    top: fn(paddings.top),
    right: fn(paddings.right),
    bottom: fn(paddings.bottom),
    left: fn(paddings.left),
});

export function convertConfigUnits(
    config: Config,
    from: Unit,
    to: Unit,
): Config {
    if (from === to) return config;

    const convert = (value: number) =>
        roundLength(convertLength(value, from, to));

    return {
        label: {
            ...config.label,
            width: convert(config.label.width),
            height: convert(config.label.height),
            paddings: mapPaddings(config.label.paddings, convert),
        },
        sheet: {
            ...config.sheet,
            paddings: mapPaddings(config.sheet.paddings, convert),
            gapX: convert(config.sheet.gapX),
            gapY: convert(config.sheet.gapY),
        },
    };
}

export function normalizeConfig(config: Config): Config {
    const label = config.label ?? ({} as LabelConfig);
    const sheet = config.sheet ?? ({} as SheetConfig);
    const format = isPaperFormat(sheet.format) ? sheet.format : DEFAULT_FORMAT;
    const landscape = sheet.landscape === true;
    const paper = getPaperSize(format, landscape);

    const sheetPaddings = clampPaddings(
        sheet.paddings ?? createPaddings(),
        paper.width,
        paper.height,
    );
    const labelWidth = clamp(
        numberOr(label.width, DEFAULT_LABEL_WIDTH),
        0,
        paper.width,
    );
    const labelHeight = clamp(
        numberOr(label.height, DEFAULT_LABEL_HEIGHT),
        0,
        paper.height,
    );
    const labelPaddings = clampPaddings(
        label.paddings ?? createPaddings(),
        labelWidth,
        labelHeight,
    );

    return {
        label: {
            type: isLabelType(label.type) ? label.type : DEFAULT_LABEL_TYPE,
            image:
                typeof label.image === 'string' ? label.image : DEFAULT_IMAGE,
            text: typeof label.text === 'string' ? label.text : DEFAULT_TEXT,
            textAlign: TEXT_ALIGN_OPTIONS.includes(label.textAlign)
                ? label.textAlign
                : DEFAULT_TEXT_ALIGN,
            textSize: clamp(
                numberOr(label.textSize, DEFAULT_TEXT_SIZE),
                0,
                TEXT_SIZE_MAX,
            ),
            borderWidth: clamp(
                numberOr(label.borderWidth, DEFAULT_BORDER_WIDTH),
                0,
                BORDER_WIDTH_MAX,
            ),
            width: labelWidth,
            height: labelHeight,
            paddings: labelPaddings,
        },
        sheet: {
            format,
            landscape,
            paddings: sheetPaddings,
            gapX: clamp(numberOr(sheet.gapX, 0), 0, labelWidth),
            gapY: clamp(numberOr(sheet.gapY, 0), 0, labelHeight),
        },
    };
}
