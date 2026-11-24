import { describe, expect, it } from 'vitest';
import {
    convertLength,
    formatLength,
    formatSides,
    getPaperSize,
    isPaperFormat,
    roundLength,
    type Sides,
} from './paper';

const paddings: Sides<number> = { top: 1, right: 2, bottom: 3, left: 4 };

describe('getPaperSize', () => {
    it('Returns portrait dimensions', () => {
        expect(getPaperSize('A4', false)).toEqual({
            width: 21,
            height: 29.7,
            unit: 'cm',
        });
        expect(getPaperSize('Letter', false)).toEqual({
            width: 8.5,
            height: 11,
            unit: 'in',
        });
    });

    it('Swaps dimensions for landscape', () => {
        expect(getPaperSize('A4', true)).toEqual({
            width: 29.7,
            height: 21,
            unit: 'cm',
        });
        expect(getPaperSize('Letter', true)).toEqual({
            width: 11,
            height: 8.5,
            unit: 'in',
        });
    });
});

describe('length helpers', () => {
    it('Converts centimeters and inches', () => {
        expect(convertLength(1, 'in', 'cm')).toBeCloseTo(2.54);
        expect(convertLength(2.54, 'cm', 'in')).toBeCloseTo(1);
        expect(convertLength(7, 'cm', 'cm')).toBe(7);
        expect(convertLength(7, 'in', 'in')).toBe(7);
    });

    it('Rounds to three decimals', () => {
        expect(roundLength(1.23456)).toBe(1.235);
        expect(roundLength(1.2344)).toBe(1.234);
    });

    it('Formats lengths and all sides', () => {
        expect(formatLength(2.5, 'cm')).toBe('2.5cm');
        expect(formatSides(paddings, 'cm')).toBe('1cm 2cm 3cm 4cm');
    });
});

describe('isPaperFormat', () => {
    it.each([
        ['A4', true],
        ['Letter', true],
        ['A6', false],
        ['letter', false],
        [42, false],
        [null, false],
    ])('Recognizes %s as %s', (value, expected) => {
        expect(isPaperFormat(value)).toBe(expected);
    });
});
