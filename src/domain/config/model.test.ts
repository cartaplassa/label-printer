import { describe, expect, it } from 'vitest';
import {
    clamp,
    clampPaddings,
    convertConfigUnits,
    createDefaultConfig,
    fitFontPaddings,
    isConfig,
    paddingLimit,
} from './model';

describe('clamp', () => {
    it('Keeps values within bounds', () => {
        expect(clamp(5, 0, 10)).toBe(5);
        expect(clamp(-1, 0, 10)).toBe(0);
        expect(clamp(11, 0, 10)).toBe(10);
    });
});

describe('paddingLimit', () => {
    it('Uses height for top/bottom and width for left/right', () => {
        expect(paddingLimit('top', 4, 2)).toBe(1);
        expect(paddingLimit('bottom', 4, 2)).toBe(1);
        expect(paddingLimit('left', 4, 2)).toBe(2);
        expect(paddingLimit('right', 4, 2)).toBe(2);
    });
});

describe('clampPaddings', () => {
    it('Clamps each side to half of its dimension', () => {
        expect(
            clampPaddings({ top: 5, right: -1, bottom: 0.5, left: 9 }, 4, 2),
        ).toEqual({ top: 1, right: 0, bottom: 0.5, left: 2 });
    });
});

describe('fitFontPaddings', () => {
    it('Clamps to the supported weight range', () => {
        expect(fitFontPaddings(50, [100, 900])).toBe(100);
        expect(fitFontPaddings(1000, [100, 900])).toBe(900);
        expect(fitFontPaddings(400, [100, 900])).toBe(400);
    });
});

describe('convertConfigUnits', () => {
    it('Converts and rounds label and sheet measurements', () => {
        const config = createDefaultConfig();
        const converted = convertConfigUnits(config, 'cm', 'in');

        expect(converted.label.width).toBeCloseTo(1.181);
        expect(converted.label.height).toBeCloseTo(0.394);
        expect(converted.label.paddings.top).toBeCloseTo(0.039);
        expect(converted.sheet.paddings.left).toBeCloseTo(0.039);
        expect(config.label.width).toBe(3);
    });

    it('Returns the same object when units match', () => {
        const config = createDefaultConfig();
        expect(convertConfigUnits(config, 'cm', 'cm')).toBe(config);
    });
});

describe('isConfig', () => {
    it('Checks for all config sections', () => {
        expect(isConfig(createDefaultConfig())).toBe(true);
        expect(isConfig({})).toBe(false);
        expect(isConfig(null)).toBe(false);

        const withoutSheet: Partial<ReturnType<typeof createDefaultConfig>> = {
            ...createDefaultConfig(),
        };
        delete withoutSheet.sheet;
        expect(isConfig(withoutSheet)).toBe(false);
    });
});
