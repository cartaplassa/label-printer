export const PAPER_FORMATS = {
    A0: { width: 84.1, height: 118.9, unit: 'cm' },
    A1: { width: 59.4, height: 84.1, unit: 'cm' },
    A2: { width: 42.0, height: 59.4, unit: 'cm' },
    A3: { width: 29.7, height: 42.0, unit: 'cm' },
    A4: {
        width: 21.0,
        height: 29.7,
        unit: 'cm',
    },
    A5: { width: 14.8, height: 21.0, unit: 'cm' },
    Letter: { width: 8.5, height: 11, unit: 'in' },
    Legal: { width: 8.5, height: 14, unit: 'in' },
    Tabloid: { width: 11, height: 17, unit: 'in' },
} as const;

export type PaperFormat = keyof typeof PAPER_FORMATS;
export type Unit = (typeof PAPER_FORMATS)[PaperFormat]['unit'];

export const PAPER_FORMAT_KEYS = Object.keys(PAPER_FORMATS) as PaperFormat[];

export type Side = 'top' | 'right' | 'bottom' | 'left';
export const SIDES = [
    'top',
    'right',
    'bottom',
    'left',
] as const satisfies readonly Side[];
export type Sides<T> = Record<Side, T>;

export const sideToDimension: Record<Side, 'width' | 'height'> = {
    top: 'height',
    right: 'width',
    bottom: 'height',
    left: 'width',
};

export interface PaperSize {
    width: number;
    height: number;
    unit: Unit;
}

export const isPaperFormat = (value: unknown): value is PaperFormat =>
    typeof value === 'string' && Object.hasOwn(PAPER_FORMATS, value);

export function getPaperSize(
    format: PaperFormat,
    landscape: boolean,
): PaperSize {
    const { width, height, unit } = PAPER_FORMATS[format];

    return landscape
        ? { width: height, height: width, unit }
        : { width, height, unit };
}

const CM_PER_INCH = 2.54;

export function convertLength(value: number, from: Unit, to: Unit): number {
    if (from === to) return value;

    return from === 'cm' ? value / CM_PER_INCH : value * CM_PER_INCH;
}

export const roundLength = (value: number): number =>
    Math.round(value * 1000) / 1000;

export const formatLength = (value: number, unit: Unit): string =>
    `${value}${unit}`;

export const formatSides = (paddings: Sides<number>, unit: Unit): string =>
    SIDES.map((side) => formatLength(paddings[side], unit)).join(' ');
