import { Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import { createDefaultConfig } from './model';
import {
    applySizingConfig,
    getSizingConfig,
    SizingConfigSchema,
} from './sizing';

describe('getSizingConfig', () => {
    it('Selects only sheet and label sizing', () => {
        const config = createDefaultConfig();

        expect(getSizingConfig(config)).toEqual({
            sheet: config.sheet,
            label: {
                width: config.label.width,
                height: config.label.height,
                paddings: config.label.paddings,
            },
        });
    });
});

describe('applySizingConfig', () => {
    it('Applies sizing and preserves other sections', () => {
        const config = createDefaultConfig();
        const sizing = {
            sheet: { ...config.sheet, format: 'Letter' as const, gapX: 1 },
            label: {
                width: 4,
                height: 2,
                paddings: config.label.paddings,
            },
        };

        const applied = applySizingConfig(config, sizing);

        expect(applied.sheet.format).toBe('Letter');
        expect(applied.sheet.gapX).toBe(1);
        expect(applied.label.width).toBe(4);
        expect(applied.label.height).toBe(2);
        expect(applied.text).toEqual(config.text);
        expect(applied.barcode).toEqual(config.barcode);
    });
});

describe('SizingConfigSchema', () => {
    it('Normalizes partial sizing input', () => {
        const sizing = Schema.decodeUnknownSync(SizingConfigSchema)({
            label: { width: 2 },
            sheet: { format: 'Letter', gapX: 0.5 },
        });

        expect(sizing.label.width).toBe(2);
        expect(sizing.label.height).toBe(1);
        expect(sizing.sheet.format).toBe('Letter');
        expect(sizing.sheet.gapX).toBe(0.5);
    });
});
