import { Option } from 'effect';
import { describe, expect, it } from 'vitest';
import { createDefaultConfig } from '@/domain/config';
import { decodeV2, migrateToV1, migrateToV2 } from './migrations';

const unwrap = <A>(option: Option.Option<A>): A => {
    if (Option.isNone(option)) throw new Error('Expected Some');
    return option.value;
};

type V1State = {
    readonly label: Record<string, unknown>;
    readonly sheet: Record<string, unknown>;
};

describe('migrateToV1', () => {
    it('Maps legacy fields into the V1 label/sheet shape', () => {
        const defaults = createDefaultConfig();
        const result = unwrap(
            migrateToV1({
                labelType: 'text',
                labelImage: 'legacy-image',
                labelText: 'Legacy text',
                labelTextSize: 18,
                labelBorderWidth: 2,
                labelWidth: 5,
                labelHeight: 2,
                labelPaddings: defaults.label.paddings,
                paperFormat: 'A4',
                isPaperRotationAlbum: true,
                sheetPaddings: defaults.sheet.paddings,
                sheetGapX: 1,
                sheetGapY: 2,
            }),
        ) as V1State;

        expect(result.label).toMatchObject({
            type: 'text',
            image: 'legacy-image',
            text: 'Legacy text',
            textSize: 18,
            borderWidth: 2,
            width: 5,
            height: 2,
            fontFamily: defaults.text.fontFamily,
            barcode: defaults.barcode,
        });
        expect(result.sheet).toMatchObject({
            format: 'A4',
            landscape: true,
            gapX: 1,
            gapY: 2,
        });
    });

    it('Returns None for non-record state', () => {
        expect(Option.isNone(migrateToV1(null))).toBe(true);
    });
});

describe('migrateToV2', () => {
    it('Maps V1 state into the current config shape', () => {
        const defaults = createDefaultConfig();
        const result = unwrap(
            migrateToV2({
                label: {
                    type: 'text',
                    image: 'v1-image',
                    text: 'V1 text',
                    fontFamily: defaults.text.fontFamily,
                    fontWeight: defaults.text.fontWeight,
                    lineHeight: defaults.text.lineHeight,
                    letterSpacing: defaults.text.letterSpacing,
                    textAlign: 'right',
                    textWrap: true,
                    textSize: 14,
                    textColor: defaults.text.color,
                    barcode: defaults.barcode,
                    borderColor: defaults.label.borderColor,
                    borderStyle: defaults.label.borderStyle,
                    borderWidth: defaults.label.borderWidth,
                    width: 4,
                    height: 2,
                    paddings: defaults.label.paddings,
                },
                sheet: defaults.sheet,
            }),
        ) as Record<string, unknown>;

        expect(result).toMatchObject({
            image: { data: 'v1-image' },
            text: { data: 'V1 text', align: 'right', wrap: true, size: 14 },
            barcode: defaults.barcode,
            label: { type: 'text', width: 4, height: 2 },
            sheet: defaults.sheet,
        });
    });

    it('Returns None for invalid V1 state', () => {
        expect(Option.isNone(migrateToV2({ label: 'nope' }))).toBe(true);
    });
});

describe('decodeV2', () => {
    it('Normalizes valid current state', () => {
        expect(unwrap(decodeV2(createDefaultConfig()))).toEqual(
            createDefaultConfig(),
        );
    });

    it('Returns None for invalid current state', () => {
        expect(Option.isNone(decodeV2(null))).toBe(true);
    });
});
