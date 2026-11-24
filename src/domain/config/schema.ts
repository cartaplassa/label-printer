import { Predicate, Schema, SchemaGetter } from 'effect';
import { withFallback } from '@/lib/schema';
import { BARCODE_TYPES, type BarcodeType } from '../barcode';
import {
    getPaperSize,
    PAPER_FORMAT_KEYS,
    type PaperFormat,
    type Sides,
} from '../paper';
import {
    BARCODE_HEIGHT_MAX,
    BORDER_STYLES,
    BORDER_WIDTH_MAX,
    type Config,
    clamp,
    clampPaddings,
    createDefaultBarcodeConfig,
    createDefaultImageConfig,
    createDefaultLabelConfig,
    createDefaultSheetConfig,
    createDefaultTextConfig,
    DEFAULT_BARCODE_COLOR,
    DEFAULT_BARCODE_DATA,
    DEFAULT_BARCODE_HEIGHT,
    DEFAULT_BARCODE_TEXT_COLOR,
    DEFAULT_BARCODE_TYPE,
    DEFAULT_BORDER_COLOR,
    DEFAULT_BORDER_STYLE,
    DEFAULT_BORDER_WIDTH,
    DEFAULT_FONT_FAMILY,
    DEFAULT_FONT_WEIGHT,
    DEFAULT_FORMAT,
    DEFAULT_IMAGE,
    DEFAULT_LABEL_HEIGHT,
    DEFAULT_LABEL_TYPE,
    DEFAULT_LABEL_WIDTH,
    DEFAULT_LETTER_SPACING,
    DEFAULT_LINE_HEIGHT,
    DEFAULT_PADDING,
    DEFAULT_TEXT,
    DEFAULT_TEXT_ALIGN,
    DEFAULT_TEXT_COLOR,
    DEFAULT_TEXT_SIZE,
    FONT_FAMILIES,
    FONTS,
    type FontFamily,
    fitFontPaddings,
    LABEL_TYPES,
    TEXT_ALIGN_OPTIONS,
    TEXT_SIZE_MAX,
} from './model';
import { PaddingsShape, SheetShape } from './shapes';

const finiteNumber = (fallback: number) =>
    withFallback(Schema.Finite, fallback);

const defaultPaddings: Sides<number> = {
    top: DEFAULT_PADDING,
    right: DEFAULT_PADDING,
    bottom: DEFAULT_PADDING,
    left: DEFAULT_PADDING,
};

const ImageShape = Schema.Struct({
    data: Schema.String,
});

const TextShape = Schema.Struct({
    data: Schema.String,
    fontFamily: Schema.Literals(FONT_FAMILIES as [FontFamily, ...FontFamily[]]),
    fontWeight: Schema.Finite,
    lineHeight: Schema.Finite,
    letterSpacing: Schema.Finite,
    align: Schema.Literals(TEXT_ALIGN_OPTIONS),
    wrap: Schema.Boolean,
    size: Schema.Finite,
    color: Schema.String,
});

const BarcodeShape = Schema.Struct({
    type: Schema.Literals(BARCODE_TYPES as [BarcodeType, ...BarcodeType[]]),
    data: Schema.String,
    height: Schema.Finite,
    color: Schema.String,
    textColor: Schema.String,
    includeText: Schema.Boolean,
});

const LabelShape = Schema.Struct({
    type: Schema.Literals(LABEL_TYPES),
    borderColor: Schema.String,
    borderStyle: Schema.Literals(BORDER_STYLES),
    borderWidth: Schema.Finite,
    width: Schema.Finite,
    height: Schema.Finite,
    paddings: PaddingsShape,
});

const ConfigShape = Schema.Struct({
    image: ImageShape,
    text: TextShape,
    barcode: BarcodeShape,
    label: LabelShape,
    sheet: SheetShape,
});

const strictTrue = withFallback(
    Schema.Unknown.pipe(
        Schema.decodeTo(Schema.Boolean, {
            decode: SchemaGetter.transform((value: unknown) => value === true),
            encode: SchemaGetter.transform((value: boolean) => value),
        }),
    ),
    false,
);

const PaddingsSchema = withFallback(
    Schema.Struct({
        top: finiteNumber(DEFAULT_PADDING),
        right: finiteNumber(DEFAULT_PADDING),
        bottom: finiteNumber(DEFAULT_PADDING),
        left: finiteNumber(DEFAULT_PADDING),
    }),
    defaultPaddings,
);

const RawImageSchema = withFallback(
    Schema.Struct({
        data: withFallback(Schema.String, DEFAULT_IMAGE),
    }),
    createDefaultImageConfig(),
);

const RawTextSchema = withFallback(
    Schema.Struct({
        data: withFallback(Schema.String, DEFAULT_TEXT),
        fontFamily: withFallback(
            Schema.Literals(FONT_FAMILIES as [FontFamily, ...FontFamily[]]),
            DEFAULT_FONT_FAMILY,
        ),
        fontWeight: finiteNumber(DEFAULT_FONT_WEIGHT),
        lineHeight: finiteNumber(DEFAULT_LINE_HEIGHT),
        letterSpacing: finiteNumber(DEFAULT_LETTER_SPACING),
        align: withFallback(
            Schema.Literals(TEXT_ALIGN_OPTIONS),
            DEFAULT_TEXT_ALIGN,
        ),
        wrap: strictTrue,
        size: finiteNumber(DEFAULT_TEXT_SIZE),
        color: withFallback(Schema.String, DEFAULT_TEXT_COLOR),
    }),
    createDefaultTextConfig(),
);

const RawBarcodeSchema = withFallback(
    Schema.Struct({
        type: withFallback(
            Schema.Literals(BARCODE_TYPES as [BarcodeType, ...BarcodeType[]]),
            DEFAULT_BARCODE_TYPE,
        ),
        data: withFallback(Schema.String, DEFAULT_BARCODE_DATA),
        height: finiteNumber(DEFAULT_BARCODE_HEIGHT),
        color: withFallback(Schema.String, DEFAULT_BARCODE_COLOR),
        textColor: withFallback(Schema.String, DEFAULT_BARCODE_TEXT_COLOR),
        includeText: strictTrue,
    }),
    createDefaultBarcodeConfig(),
);

const RawLabelSchema = withFallback(
    Schema.Struct({
        type: withFallback(Schema.Literals(LABEL_TYPES), DEFAULT_LABEL_TYPE),
        borderColor: withFallback(Schema.String, DEFAULT_BORDER_COLOR),
        borderStyle: withFallback(
            Schema.Literals(BORDER_STYLES),
            DEFAULT_BORDER_STYLE,
        ),
        borderWidth: finiteNumber(DEFAULT_BORDER_WIDTH),
        width: finiteNumber(DEFAULT_LABEL_WIDTH),
        height: finiteNumber(DEFAULT_LABEL_HEIGHT),
        paddings: PaddingsSchema,
    }),
    createDefaultLabelConfig(),
);

const RawSheetSchema = withFallback(
    Schema.Struct({
        format: withFallback(
            Schema.Literals(
                PAPER_FORMAT_KEYS as [PaperFormat, ...PaperFormat[]],
            ),
            DEFAULT_FORMAT,
        ),
        landscape: strictTrue,
        paddings: PaddingsSchema,
        gapX: finiteNumber(0),
        gapY: finiteNumber(0),
    }),
    createDefaultSheetConfig(),
);

const sectionsFromUnknown = (input: unknown) => {
    const source = Predicate.isObject(input) ? input : {};
    const section = (key: string) =>
        Predicate.isObject(source[key]) ? source[key] : {};

    return {
        image: section('image'),
        text: section('text'),
        barcode: section('barcode'),
        label: section('label'),
        sheet: section('sheet'),
    };
};

const RawConfigSchema = Schema.Unknown.pipe(
    Schema.decodeTo(
        Schema.Struct({
            image: RawImageSchema,
            text: RawTextSchema,
            barcode: RawBarcodeSchema,
            label: RawLabelSchema,
            sheet: RawSheetSchema,
        }),
        {
            decode: SchemaGetter.transform(sectionsFromUnknown),
            encode: SchemaGetter.transform((raw) => raw),
        },
    ),
);

type RawConfig = (typeof RawConfigSchema)['Type'];

function normalizeRaw(raw: RawConfig): Config {
    const paper = getPaperSize(raw.sheet.format, raw.sheet.landscape);

    const sheetPaddings = clampPaddings(
        raw.sheet.paddings,
        paper.width,
        paper.height,
    );
    const labelWidth = clamp(raw.label.width, 0, paper.width);
    const labelHeight = clamp(raw.label.height, 0, paper.height);
    const labelPaddings = clampPaddings(
        raw.label.paddings,
        labelWidth,
        labelHeight,
    );
    const fontWeight = fitFontPaddings(raw.text.fontWeight, [
        FONTS[raw.text.fontFamily].minWeight,
        FONTS[raw.text.fontFamily].maxWeight,
    ]);

    return {
        image: raw.image,
        text: {
            ...raw.text,
            fontWeight,
            size: clamp(raw.text.size, 0, TEXT_SIZE_MAX),
            // TODO: color hex validation
        },
        barcode: {
            ...raw.barcode,
            height: clamp(raw.barcode.height, 1, BARCODE_HEIGHT_MAX),
        },
        label: {
            type: raw.label.type,
            borderColor: raw.label.borderColor,
            borderStyle: raw.label.borderStyle,
            borderWidth: clamp(raw.label.borderWidth, 0, BORDER_WIDTH_MAX),
            width: labelWidth,
            height: labelHeight,
            paddings: labelPaddings,
        },
        sheet: {
            format: raw.sheet.format,
            landscape: raw.sheet.landscape,
            paddings: sheetPaddings,
            gapX: clamp(raw.sheet.gapX, 0, labelWidth),
            gapY: clamp(raw.sheet.gapY, 0, labelHeight),
        },
    };
}

export const ConfigSchema = RawConfigSchema.pipe(
    Schema.decodeTo(ConfigShape, {
        decode: SchemaGetter.transform(normalizeRaw),
        encode: SchemaGetter.transform((config) => config),
    }),
);

export function normalizeConfig(config: unknown): Config {
    return Schema.decodeUnknownSync(ConfigSchema)(config);
}
