import { Optic } from 'effect';
import { mapOfStructs } from '@/lib/mapOfStructs';

// biome-ignore format: keep table alignment
export const PAPER_FORMATS = mapOfStructs(
    ['name',    'width', 'height', 'unit'],
    // --------------------------------- //
    ['A0',      84.1,    118.9,    'cm'  ],
    ['A1',      59.4,    84.1,     'cm'  ],
    ['A2',      42.0,    59.4,     'cm'  ],
    ['A3',      29.7,    42.0,     'cm'  ],
    ['A4',      21.0,    29.7,     'cm'  ],
    ['A5',      14.8,    21.0,     'cm'  ],
    ['Letter',  8.5,     11,       'in'  ],
    ['Legal',   8.5,     14,       'in'  ],
    ['Tabloid', 11,      17,       'in'  ],
);

export type PaperFormat = keyof typeof PAPER_FORMATS;
export type Unit = (typeof PAPER_FORMATS)[PaperFormat]['unit'];
export const PAPER_FORMAT_KEYS = Object.keys(PAPER_FORMATS) as PaperFormat[];

export const sideToDimension = {
    top: 'height',
    right: 'width',
    bottom: 'height',
    left: 'width',
} as const;
export const SIDES = Object.keys(
    sideToDimension,
) as (keyof typeof sideToDimension)[];
export type Side = (typeof SIDES)[number];
export type Sides<T> = Record<Side, T>;

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
const centimeters = Optic.makeIso<number, number>(
    (i) => i / CM_PER_INCH,
    (m) => m * CM_PER_INCH,
);

export function convertLength(value: number, from: Unit, to: Unit): number {
    if (from === to) return value;

    return from === 'cm' ? centimeters.set(value) : centimeters.get(value);
}

export const roundLength = (value: number): number =>
    Math.round(value * 1000) / 1000;

export const formatLength = (value: number, unit: Unit): string =>
    `${value}${unit}`;

export const formatSides = (paddings: Sides<number>, unit: Unit): string =>
    SIDES.map((side) => formatLength(paddings[side], unit)).join(' ');
