import { z } from 'zod';
import exampleImage from '@/assets/exampleImage';
import {
    convertLength,
    getPaperSize,
    PAPER_FORMAT_KEYS,
    type PaperFormat,
    roundLength,
    type Side,
    type Sides,
    sideToDimension,
    type Unit,
} from './paper';

export const LABEL_TYPES = ['text', 'image', 'barcode'] as const;
export type LabelType = (typeof LABEL_TYPES)[number];

export const BARCODE_TYPES = [
    'code128',
    'code39',
    'ean13',
    'upca',
    'qrcode',
    'datamatrix',
] as const;
export type BarcodeType = (typeof BARCODE_TYPES)[number];

export const BARCODE_TYPE_LABELS: Record<BarcodeType, string> = {
    code128: 'Code 128',
    code39: 'Code 39',
    ean13: 'EAN-13',
    upca: 'UPC-A',
    qrcode: 'QR Code',
    datamatrix: 'Data Matrix',
};

export const isBarcodeType = (value: unknown): value is BarcodeType =>
    BARCODE_TYPES.includes(value as BarcodeType);

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

export const BORDER_STYLES = [
    'solid',
    'dotted',
    'dashed',
    'double',
    'groove',
    'ridge',
    'inset',
    'outset',
] as const;
export type BorderStyle = (typeof BORDER_STYLES)[number];

export interface ImageConfig {
    data: string; // data URL
}

export interface TextConfig {
    data: string;
    fontFamily: FontFamily;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
    align: TextAlign;
    wrap: boolean;
    size: number; // pt
    color: string;
}

export interface BarcodeConfig {
    type: BarcodeType;
    data: string;
    // Opaque input that shapes the generated SVG's aspect ratio; the label
    // cell determines the printed size.
    height: number;
    color: string;
    textColor: string;
    includeText: boolean;
}

export interface LabelConfig {
    type: LabelType;
    borderColor: string;
    borderStyle: BorderStyle;
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
    image: ImageConfig;
    text: TextConfig;
    barcode: BarcodeConfig;
    label: LabelConfig;
    sheet: SheetConfig;
}

export type LabelSizingConfig = Pick<
    LabelConfig,
    'width' | 'height' | 'paddings'
>;

export interface SizingConfig {
    sheet: SheetConfig;
    label: LabelSizingConfig;
}

type PartialNullable<T> = {
    [P in keyof T]?: T[P] | null | undefined;
};
export type ImagePatch = PartialNullable<ImageConfig>;
export type TextPatch = PartialNullable<TextConfig>;
export type BarcodePatch = PartialNullable<BarcodeConfig>;
export type LabelPatch = PartialNullable<Omit<LabelConfig, 'paddings'>>;
export type SheetPatch = PartialNullable<
    Omit<SheetConfig, 'paddings' | 'format' | 'landscape'>
>;

export const TEXT_SIZE_MAX = 100;
export const BORDER_WIDTH_MAX = 10;
export const DEFAULT_IMAGE = exampleImage;

export const DEFAULT_FORMAT: PaperFormat = 'A4';
export const DEFAULT_LABEL_WIDTH = 3;
export const DEFAULT_LABEL_HEIGHT = 1;
export const DEFAULT_PADDING = 0.1;
export const DEFAULT_TEXT_SIZE = 16;
export const DEFAULT_BORDER_WIDTH = 1;
export const DEFAULT_FONT_FAMILY = FONT_FALLBACK;
export const DEFAULT_FONT_WEIGHT = 400;
export const DEFAULT_LINE_HEIGHT = 1.5;
export const DEFAULT_LETTER_SPACING = 0;
export const DEFAULT_TEXT = '';
export const DEFAULT_TEXT_ALIGN = 'center';
export const DEFAULT_TEXT_WRAP = false;
export const DEFAULT_TEXT_COLOR = '#000000ff';
export const DEFAULT_BORDER_STYLE: BorderStyle = 'solid';
export const DEFAULT_BORDER_COLOR = '#000000ff';
export const DEFAULT_LABEL_TYPE: LabelType = 'image';

export const DEFAULT_BARCODE_TYPE: BarcodeType = 'code128';
export const DEFAULT_BARCODE_DATA = '';
export const DEFAULT_BARCODE_HEIGHT = 10;
export const DEFAULT_BARCODE_COLOR = '#000000';
export const DEFAULT_BARCODE_TEXT_COLOR = '#000000';
export const DEFAULT_BARCODE_INCLUDE_TEXT = false;
export const BARCODE_HEIGHT_MAX = 100;

export const isLabelType = (value: unknown): value is LabelType =>
    LABEL_TYPES.includes(value as LabelType);

export const createDefaultImageConfig = (): ImageConfig => ({
    data: DEFAULT_IMAGE,
});

export const createDefaultTextConfig = (): TextConfig => ({
    data: DEFAULT_TEXT,
    fontFamily: DEFAULT_FONT_FAMILY,
    fontWeight: DEFAULT_FONT_WEIGHT,
    lineHeight: DEFAULT_LINE_HEIGHT,
    letterSpacing: DEFAULT_LETTER_SPACING,
    align: DEFAULT_TEXT_ALIGN,
    wrap: DEFAULT_TEXT_WRAP,
    size: DEFAULT_TEXT_SIZE,
    color: DEFAULT_TEXT_COLOR,
});

export const createDefaultBarcodeConfig = (): BarcodeConfig => ({
    type: DEFAULT_BARCODE_TYPE,
    data: DEFAULT_BARCODE_DATA,
    height: DEFAULT_BARCODE_HEIGHT,
    color: DEFAULT_BARCODE_COLOR,
    textColor: DEFAULT_BARCODE_TEXT_COLOR,
    includeText: DEFAULT_BARCODE_INCLUDE_TEXT,
});

const createPaddings = (): Sides<number> => ({
    top: DEFAULT_PADDING,
    right: DEFAULT_PADDING,
    bottom: DEFAULT_PADDING,
    left: DEFAULT_PADDING,
});

export const createDefaultLabelConfig = (): LabelConfig => ({
    type: DEFAULT_LABEL_TYPE,
    borderColor: DEFAULT_BORDER_COLOR,
    borderStyle: DEFAULT_BORDER_STYLE,
    borderWidth: DEFAULT_BORDER_WIDTH,
    width: DEFAULT_LABEL_WIDTH,
    height: DEFAULT_LABEL_HEIGHT,
    paddings: createPaddings(),
});

export const createDefaultSheetConfig = (): SheetConfig => ({
    format: DEFAULT_FORMAT,
    landscape: false,
    paddings: createPaddings(),
    gapX: 0,
    gapY: 0,
});

export function createDefaultConfig(): Config {
    return {
        image: createDefaultImageConfig(),
        text: createDefaultTextConfig(),
        barcode: createDefaultBarcodeConfig(),
        label: createDefaultLabelConfig(),
        sheet: createDefaultSheetConfig(),
    };
}

const clamp = (value: number, min: number, max: number): number =>
    Math.min(Math.max(value, min), max);

export const paddingLimit = (
    side: Side,
    width: number,
    height: number,
): number => (sideToDimension[side] === 'width' ? width : height) / 2;

export function clampPaddings(
    paddings: Sides<number>,
    width: number,
    height: number,
): Sides<number> {
    return {
        top: clamp(paddings.top, 0, paddingLimit('top', width, height)),
        right: clamp(paddings.right, 0, paddingLimit('right', width, height)),
        bottom: clamp(
            paddings.bottom,
            0,
            paddingLimit('bottom', width, height),
        ),
        left: clamp(paddings.left, 0, paddingLimit('left', width, height)),
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
        ...config,
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

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export const isConfig = (value: unknown): value is Config =>
    isRecord(value) &&
    isRecord(value.image) &&
    isRecord(value.text) &&
    isRecord(value.barcode) &&
    isRecord(value.label) &&
    isRecord(value.sheet);

const finiteNumber = (fallback: number) => z.number().finite().catch(fallback);
const finiteNumberOrZero = z.number().finite().catch(0);

const defaultPaddings: Sides<number> = createPaddings();

const PaddingsSchema = z
    .object({
        top: finiteNumber(DEFAULT_PADDING),
        right: finiteNumber(DEFAULT_PADDING),
        bottom: finiteNumber(DEFAULT_PADDING),
        left: finiteNumber(DEFAULT_PADDING),
    })
    .catch(defaultPaddings);

const ImageSchema = z
    .object({
        data: z.string().catch(DEFAULT_IMAGE),
    })
    .catch(createDefaultImageConfig());

const TextSchema = z
    .object({
        data: z.string().catch(DEFAULT_TEXT),
        fontFamily: z
            .enum(FONT_FAMILIES as [FontFamily, ...FontFamily[]])
            .catch(DEFAULT_FONT_FAMILY),
        fontWeight: finiteNumber(DEFAULT_FONT_WEIGHT),
        lineHeight: finiteNumber(DEFAULT_LINE_HEIGHT),
        letterSpacing: finiteNumber(DEFAULT_LETTER_SPACING),
        align: z.enum(TEXT_ALIGN_OPTIONS).catch(DEFAULT_TEXT_ALIGN),
        wrap: z.unknown().transform((value) => value === true),
        size: finiteNumber(DEFAULT_TEXT_SIZE),
        color: z.string().catch(DEFAULT_TEXT_COLOR),
    })
    .catch(createDefaultTextConfig());

const BarcodeSchema = z
    .object({
        type: z.enum(BARCODE_TYPES).catch(DEFAULT_BARCODE_TYPE),
        data: z.string().catch(DEFAULT_BARCODE_DATA),
        height: finiteNumber(DEFAULT_BARCODE_HEIGHT),
        color: z.string().catch(DEFAULT_BARCODE_COLOR),
        textColor: z.string().catch(DEFAULT_BARCODE_TEXT_COLOR),
        includeText: z.unknown().transform((value) => value === true),
    })
    .catch(createDefaultBarcodeConfig());

const RawLabelSchema = z
    .object({
        type: z.enum(LABEL_TYPES).catch(DEFAULT_LABEL_TYPE),
        borderColor: z.string().catch(DEFAULT_BORDER_COLOR),
        borderStyle: z.enum(BORDER_STYLES).catch(DEFAULT_BORDER_STYLE),
        borderWidth: finiteNumber(DEFAULT_BORDER_WIDTH),
        width: finiteNumber(DEFAULT_LABEL_WIDTH),
        height: finiteNumber(DEFAULT_LABEL_HEIGHT),
        paddings: PaddingsSchema,
    })
    .passthrough()
    .catch({
        type: DEFAULT_LABEL_TYPE,
        borderColor: DEFAULT_BORDER_COLOR,
        borderStyle: DEFAULT_BORDER_STYLE,
        borderWidth: DEFAULT_BORDER_WIDTH,
        width: DEFAULT_LABEL_WIDTH,
        height: DEFAULT_LABEL_HEIGHT,
        paddings: defaultPaddings,
    });

const RawSheetSchema = z
    .object({
        format: z
            .enum(PAPER_FORMAT_KEYS as [PaperFormat, ...PaperFormat[]])
            .catch(DEFAULT_FORMAT),
        landscape: z.unknown().transform((value) => value === true),
        paddings: PaddingsSchema,
        gapX: finiteNumberOrZero,
        gapY: finiteNumberOrZero,
    })
    .passthrough()
    .catch({
        format: DEFAULT_FORMAT,
        landscape: false,
        paddings: defaultPaddings,
        gapX: 0,
        gapY: 0,
    });

export const ConfigSchema = z
    .unknown()
    .transform(
        (
            input,
        ): {
            image: unknown;
            text: unknown;
            barcode: unknown;
            label: unknown;
            sheet: unknown;
        } => {
            if (!isRecord(input)) {
                return {
                    image: {},
                    text: {},
                    barcode: {},
                    label: {},
                    sheet: {},
                };
            }
            return {
                image: isRecord(input.image) ? input.image : {},
                text: isRecord(input.text) ? input.text : {},
                barcode: isRecord(input.barcode) ? input.barcode : {},
                label: isRecord(input.label) ? input.label : {},
                sheet: isRecord(input.sheet) ? input.sheet : {},
            };
        },
    )
    .transform((input): Config => {
        const image = ImageSchema.parse(input.image);
        const text = TextSchema.parse(input.text);
        const barcode = BarcodeSchema.parse(input.barcode);
        const label = RawLabelSchema.parse(input.label);
        const sheet = RawSheetSchema.parse(input.sheet);

        const paper = getPaperSize(sheet.format, sheet.landscape);

        const sheetPaddings = clampPaddings(
            sheet.paddings,
            paper.width,
            paper.height,
        );
        const labelWidth = clamp(label.width, 0, paper.width);
        const labelHeight = clamp(label.height, 0, paper.height);
        const labelPaddings = clampPaddings(
            label.paddings,
            labelWidth,
            labelHeight,
        );
        const fontWeight = fitFontPaddings(
            text.fontWeight,
            FONT_WEIGHT_RANGES[text.fontFamily],
        );

        return {
            image,
            text: {
                ...text,
                fontWeight,
                size: clamp(text.size, 0, TEXT_SIZE_MAX),
                // TODO: color hex validation
            },
            barcode: {
                ...barcode,
                height: clamp(barcode.height, 1, BARCODE_HEIGHT_MAX),
            },
            label: {
                type: label.type,
                borderColor: label.borderColor,
                borderStyle: label.borderStyle,
                borderWidth: clamp(label.borderWidth, 0, BORDER_WIDTH_MAX),
                width: labelWidth,
                height: labelHeight,
                paddings: labelPaddings,
            },
            sheet: {
                format: sheet.format,
                landscape: sheet.landscape,
                paddings: sheetPaddings,
                gapX: clamp(sheet.gapX, 0, labelWidth),
                gapY: clamp(sheet.gapY, 0, labelHeight),
            },
        };
    });

export function normalizeConfig(config: unknown): Config {
    return ConfigSchema.parse(config);
}

export function getSizingConfig(
    config: Pick<Config, 'label' | 'sheet'>,
): SizingConfig {
    return {
        sheet: config.sheet,
        label: {
            width: config.label.width,
            height: config.label.height,
            paddings: config.label.paddings,
        },
    };
}

export function applySizingConfig(
    config: Config,
    sizing: SizingConfig,
): Config {
    return normalizeConfig({
        ...config,
        sheet: sizing.sheet,
        label: { ...config.label, ...sizing.label },
    });
}

export const SizingConfigSchema = z
    .unknown()
    .transform((input): SizingConfig => {
        const source = isRecord(input) ? input : {};
        const label = isRecord(source.label) ? source.label : {};
        const sheet = isRecord(source.sheet) ? source.sheet : {};

        return getSizingConfig(
            normalizeConfig({
                label: { ...createDefaultLabelConfig(), ...label },
                sheet,
            }),
        );
    });
