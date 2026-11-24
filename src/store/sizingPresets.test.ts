import { describe, expect, it } from 'vitest';
import type { SizingConfig } from '@/domain/config';
import {
    applySizingPresetAction,
    SIZING_PRESET_NAME_MAX_LENGTH,
    type SizingPreset,
} from './sizingPresets';

const paddings = { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 };
const sizing: SizingConfig = {
    sheet: { format: 'A4', landscape: false, paddings, gapX: 0, gapY: 0 },
    label: { width: 3, height: 1, paddings },
};

const preset = (id: string, name: string): SizingPreset => ({
    id,
    name,
    sizing,
});

const names = (presets: ReadonlyArray<SizingPreset>) =>
    presets.map((item) => item.name);

describe('applySizingPresetAction', () => {
    it('Saves a trimmed preset with a generated id', () => {
        const result = applySizingPresetAction([], {
            _tag: 'savePreset',
            name: '  My Preset  ',
            sizing,
        });

        expect(result).toHaveLength(1);
        expect(result[0]?.name).toBe('My Preset');
        expect(result[0]?.id).not.toBe('');
        expect(result[0]?.sizing).toEqual(sizing);
    });

    it('Ignores empty names and truncates long ones', () => {
        const existing = [preset('a', 'A')];

        expect(
            applySizingPresetAction(existing, {
                _tag: 'savePreset',
                name: '   ',
                sizing,
            }),
        ).toBe(existing);

        const long = applySizingPresetAction([], {
            _tag: 'savePreset',
            name: 'x'.repeat(100),
            sizing,
        });
        expect(long[0]?.name).toHaveLength(SIZING_PRESET_NAME_MAX_LENGTH);
    });

    it('Renames presets and ignores empty names or unknown ids', () => {
        const existing = [preset('a', 'Old')];

        expect(
            names(
                applySizingPresetAction(existing, {
                    _tag: 'renamePreset',
                    id: 'a',
                    name: '  New  ',
                }),
            ),
        ).toEqual(['New']);
        expect(
            applySizingPresetAction(existing, {
                _tag: 'renamePreset',
                id: 'missing',
                name: 'New',
            })[0]?.name,
        ).toBe('Old');
        expect(
            applySizingPresetAction(existing, {
                _tag: 'renamePreset',
                id: 'a',
                name: '   ',
            }),
        ).toBe(existing);
    });

    it('Deletes one or many presets', () => {
        const existing = [preset('a', 'A'), preset('b', 'B'), preset('c', 'C')];

        const one = applySizingPresetAction(existing, {
            _tag: 'deletePreset',
            id: 'b',
        });
        expect(one.map((item) => item.id)).toEqual(['a', 'c']);

        const many = applySizingPresetAction(existing, {
            _tag: 'deletePresets',
            ids: ['a', 'c'],
        });
        expect(many.map((item) => item.id)).toEqual(['b']);
    });

    it('Imports valid presets, updates existing ids, and drops invalid ones', () => {
        const result = applySizingPresetAction([preset('a', 'Old')], {
            _tag: 'importPresets',
            presets: [
                preset('a', 'Updated'),
                preset('b', 'New'),
                preset('', 'Bad'),
            ],
        });

        expect(result).toHaveLength(2);
        expect(result.find((item) => item.id === 'a')?.name).toBe('Updated');
        expect(result.find((item) => item.id === 'b')?.name).toBe('New');
    });

    it('Normalizes names on import', () => {
        const result = applySizingPresetAction([], {
            _tag: 'importPresets',
            presets: [preset('a', ` ${'y'.repeat(80)} `)],
        });

        expect(result[0]?.name).toHaveLength(SIZING_PRESET_NAME_MAX_LENGTH);
    });
});
