import { describe, expect, it } from 'vitest';
import { createDefaultConfig, DEFAULT_IMAGE, FONT_FALLBACK } from './model';
import { normalizeConfig } from './schema';

describe('normalizeConfig', () => {
    it('Fills missing sections with defaults', () => {
        expect(normalizeConfig({})).toEqual(createDefaultConfig());
    });

    it('Falls back invalid fields without dropping sibling values', () => {
        const config = normalizeConfig({
            image: { data: 42 },
            text: {
                data: null,
                fontFamily: 'Nope',
                fontWeight: 1_000_000,
                lineHeight: 'tall',
                letterSpacing: null,
                align: 'justify',
                wrap: 'yes',
                size: -5,
                color: 42,
            },
            barcode: {
                type: 'bad',
                data: 7,
                height: 0,
                color: null,
                textColor: null,
                includeText: 'yes',
            },
            label: {
                type: 'bad',
                borderColor: 1,
                borderStyle: 'bogus',
                borderWidth: 'wide',
                width: 'x',
                paddings: { top: null },
            },
            sheet: {
                format: 'Square',
                landscape: 'no',
                paddings: 9,
                gapX: -2,
                gapY: null,
            },
        });

        expect(config.image.data).toBe(DEFAULT_IMAGE);
        expect(config.text.data).toBe('');
        expect(config.text.fontFamily).toBe(FONT_FALLBACK);
        expect(config.text.fontWeight).toBe(900);
        expect(config.text.align).toBe('center');
        expect(config.text.wrap).toBe(false);
        expect(config.text.size).toBe(0);
        expect(config.barcode.type).toBe('code128');
        expect(config.barcode.height).toBe(1);
        expect(config.barcode.includeText).toBe(false);
        expect(config.label.type).toBe('image');
        expect(config.label.width).toBe(3);
        expect(config.sheet.format).toBe('A4');
        expect(config.sheet.landscape).toBe(false);
        expect(config.sheet.gapX).toBe(0);
    });

    it('Clamps dimensions, paddings and gaps to paper and label size', () => {
        const config = normalizeConfig({
            label: {
                width: 100,
                height: 100,
                paddings: { top: 10, right: 10, bottom: 10, left: 10 },
            },
            sheet: {
                format: 'A5',
                landscape: true,
                gapX: 100,
                gapY: 100,
            },
        });

        expect(config.label.width).toBeCloseTo(21);
        expect(config.label.height).toBeCloseTo(14.8);
        expect(config.label.paddings.top).toBeCloseTo(7.4);
        expect(config.label.paddings.bottom).toBeCloseTo(7.4);
        expect(config.label.paddings.left).toBeCloseTo(10);
        expect(config.label.paddings.right).toBeCloseTo(10);
        expect(config.sheet.gapX).toBeCloseTo(21);
        expect(config.sheet.gapY).toBeCloseTo(14.8);
    });

    it('Round-trips a valid config', () => {
        expect(normalizeConfig(createDefaultConfig())).toEqual(
            createDefaultConfig(),
        );
    });
});
