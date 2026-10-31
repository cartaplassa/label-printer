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
export const TEXT_ALIGN_OPTIONS = ['left', 'center', 'right'] as const;
export type TextAlign = (typeof TEXT_ALIGN_OPTIONS)[number];

export const FONT_FALLBACK = '<browser default>';
export const FONT_FAMILY_OPTIONS = {
    Inter: "'Inter Variable', sans-serif",
    'JetBrains Mono': "'JetBrains Mono Variable', monospace",
    'Playfair Display': "'Playfair Display Variable', serif",
    Oxanium: "'Oxanium Variable', serif",
    [FONT_FALLBACK]: 'system-ui',
} as const;
export type FontFamily = keyof typeof FONT_FAMILY_OPTIONS;
export const FONT_FAMILIES = Object.keys(FONT_FAMILY_OPTIONS) as FontFamily[];
export const FONT_WEIGHT_RANGES = {
    Inter: [100, 900],
    'JetBrains Mono': [100, 800],
    'Playfair Display': [400, 900],
    Oxanium: [200, 800],
    [FONT_FALLBACK]: [100, 900],
} as const satisfies Record<FontFamily, [number, number]>;

export interface LabelConfig {
    type: LabelType;
    image: string;
    fontFamily: FontFamily | null;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
    text: string;
    textAlign: TextAlign;
    textWrap: boolean;
    textSize: number; // pt
    textColor: string;
    borderColor: string;
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
const DEFAULT_FONT_FAMILY = FONT_FALLBACK;
const DEFAULT_FONT_WEIGHT = 400;
const DEFAULT_LINE_HEIGHT = 1.5;
const DEFAULT_LETTER_SPACING = 0;
const DEFAULT_TEXT = '';
const DEFAULT_TEXT_ALIGN = 'center';
const DEFAULT_TEXT_WRAP = false;
const DEFAULT_TEXT_COLOR = '#000000ff';
const DEFAULT_BORDER_COLOR = '#000000ff';
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
            fontFamily: DEFAULT_FONT_FAMILY,
            fontWeight: DEFAULT_FONT_WEIGHT,
            lineHeight: DEFAULT_LINE_HEIGHT,
            letterSpacing: DEFAULT_LETTER_SPACING,
            text: DEFAULT_TEXT,
            textAlign: DEFAULT_TEXT_ALIGN,
            textWrap: DEFAULT_TEXT_WRAP,
            textSize: DEFAULT_TEXT_SIZE,
            textColor: DEFAULT_TEXT_COLOR,
            borderColor: DEFAULT_BORDER_COLOR,
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

export function fitFontPaddings(val: number, range: [number, number]) {
    if (val < range[0]) return range[0];
    if (val > range[1]) return range[1];
    return val;
}

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

    const fontFamily =
        label.fontFamily && FONT_FAMILIES.includes(label.fontFamily)
            ? label.fontFamily
            : DEFAULT_FONT_FAMILY;
    const fontWeight = fitFontPaddings(
        typeof label.fontWeight === 'number' ? label.fontWeight : 400,
        FONT_WEIGHT_RANGES[fontFamily],
    );

    return {
        label: {
            type: isLabelType(label.type) ? label.type : DEFAULT_LABEL_TYPE,
            image:
                typeof label.image === 'string' ? label.image : DEFAULT_IMAGE,
            fontFamily,
            fontWeight,
            lineHeight:
                typeof label.lineHeight === 'number'
                    ? label.lineHeight
                    : DEFAULT_LINE_HEIGHT,
            letterSpacing:
                typeof label.letterSpacing === 'number'
                    ? label.letterSpacing
                    : DEFAULT_LETTER_SPACING,
            text: typeof label.text === 'string' ? label.text : DEFAULT_TEXT,
            textAlign: TEXT_ALIGN_OPTIONS.includes(label.textAlign)
                ? label.textAlign
                : DEFAULT_TEXT_ALIGN,
            textWrap: Boolean(label.textWrap),
            textSize: clamp(
                numberOr(label.textSize, DEFAULT_TEXT_SIZE),
                0,
                TEXT_SIZE_MAX,
            ),
            // TODO: color hex validation
            textColor:
                typeof label.textColor === 'string'
                    ? label.textColor
                    : DEFAULT_TEXT_COLOR,
            borderColor:
                typeof label.borderColor === 'string'
                    ? label.borderColor
                    : DEFAULT_BORDER_COLOR,
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
