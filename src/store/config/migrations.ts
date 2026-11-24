import { Option, Schema } from 'effect';
import {
    type Config,
    createDefaultConfig,
    normalizeConfig,
} from '@/domain/config';
import type { Migration } from '@/lib/migratedStorage';

const recordSchema = Schema.Record(Schema.String, Schema.Unknown);

const V0Schema = recordSchema;

const V1Schema = Schema.Struct({
    label: recordSchema,
    sheet: recordSchema,
});

const V2Schema = Schema.Struct({
    image: recordSchema,
    text: recordSchema,
    barcode: recordSchema,
    label: recordSchema,
    sheet: recordSchema,
});

export const migrateToV1: Migration = (state) =>
    Option.map(Schema.decodeUnknownOption(V0Schema)(state), (old) => {
        const defaults = createDefaultConfig();

        return {
            label: {
                type: old.labelType,
                image: old.labelImage,
                text: old.labelText,
                fontFamily: defaults.text.fontFamily,
                fontWeight: defaults.text.fontWeight,
                lineHeight: defaults.text.lineHeight,
                letterSpacing: defaults.text.letterSpacing,
                textAlign: defaults.text.align,
                textWrap: defaults.text.wrap,
                textSize: old.labelTextSize,
                textColor: defaults.text.color,
                barcode: defaults.barcode,
                borderColor: defaults.label.borderColor,
                borderStyle: defaults.label.borderStyle,
                borderWidth: old.labelBorderWidth,
                width: old.labelWidth,
                height: old.labelHeight,
                paddings: old.labelPaddings,
            },
            sheet: {
                format: old.paperFormat,
                landscape: old.isPaperRotationAlbum,
                paddings: old.sheetPaddings,
                gapX: old.sheetGapX,
                gapY: old.sheetGapY,
            },
        };
    });

export const migrateToV2: Migration = (state) =>
    Option.map(Schema.decodeUnknownOption(V1Schema)(state), (old) => {
        const label = old.label;

        return {
            image: { data: label.image },
            text: {
                data: label.text,
                fontFamily: label.fontFamily,
                fontWeight: label.fontWeight,
                lineHeight: label.lineHeight,
                letterSpacing: label.letterSpacing,
                align: label.textAlign,
                wrap: label.textWrap,
                size: label.textSize,
                color: label.textColor,
            },
            barcode: label.barcode,
            label: {
                type: label.type,
                borderColor: label.borderColor,
                borderStyle: label.borderStyle,
                borderWidth: label.borderWidth,
                width: label.width,
                height: label.height,
                paddings: label.paddings,
            },
            sheet: old.sheet,
        };
    });

export const decodeV2 = (state: unknown): Option.Option<Config> =>
    Option.map(Schema.decodeUnknownOption(V2Schema)(state), normalizeConfig);
