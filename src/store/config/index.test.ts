import { describe, expect, it } from 'vitest';
import { createDefaultConfig } from '@/domain/config';
import { applyConfigAction } from './index';

const config = () => createDefaultConfig();

describe('applyConfigAction', () => {
    it('Converts units when the paper format changes', () => {
        const result = applyConfigAction(config(), {
            _tag: 'setPaperFormat',
            format: 'Letter',
        });

        expect(result.sheet.format).toBe('Letter');
        expect(result.label.width).toBeCloseTo(1.181);
        expect(result.label.width).not.toBe(3);
    });

    it('Toggles landscape', () => {
        expect(
            applyConfigAction(config(), { _tag: 'toggleLandscape' }).sheet
                .landscape,
        ).toBe(true);
    });

    it('Applies label, image, text and barcode patches', () => {
        const label = applyConfigAction(config(), {
            _tag: 'updateLabel',
            patch: { type: 'text', width: 4 },
        });
        expect(label.label.type).toBe('text');
        expect(label.label.width).toBe(4);

        const image = applyConfigAction(config(), {
            _tag: 'updateImage',
            patch: { data: 'new-image' },
        });
        expect(image.image.data).toBe('new-image');

        const text = applyConfigAction(config(), {
            _tag: 'updateText',
            patch: { data: 'hello', size: 999 },
        });
        expect(text.text.data).toBe('hello');
        expect(text.text.size).toBe(100);

        const barcode = applyConfigAction(config(), {
            _tag: 'updateBarcode',
            patch: { height: 999 },
        });
        expect(barcode.barcode.height).toBe(100);
    });

    it('Clamps padding setters and sheet gaps', () => {
        const label = applyConfigAction(config(), {
            _tag: 'setLabelPadding',
            side: 'top',
            value: 5,
        });
        expect(label.label.paddings.top).toBeCloseTo(0.5);

        const sheet = applyConfigAction(config(), {
            _tag: 'setSheetPadding',
            side: 'bottom',
            value: 5,
        });
        expect(sheet.sheet.paddings.bottom).toBe(5);

        const gaps = applyConfigAction(config(), {
            _tag: 'updateSheet',
            patch: { gapX: 99, gapY: 99 },
        });
        expect(gaps.sheet.gapX).toBe(3);
        expect(gaps.sheet.gapY).toBe(1);
    });

    it('Applies a sizing config', () => {
        const current = config();
        const result = applyConfigAction(current, {
            _tag: 'applySizing',
            sizing: {
                sheet: { ...current.sheet, format: 'Letter', gapX: 1 },
                label: {
                    width: 4,
                    height: 2,
                    paddings: current.label.paddings,
                },
            },
        });

        expect(result.sheet.format).toBe('Letter');
        expect(result.sheet.gapX).toBe(1);
        expect(result.label.width).toBe(4);
        expect(result.label.height).toBe(2);
    });

    it('Resets the image or the whole config', () => {
        const changed = applyConfigAction(config(), {
            _tag: 'updateImage',
            patch: { data: 'changed' },
        });

        expect(
            applyConfigAction(changed, { _tag: 'resetImage' }).image,
        ).toEqual(config().image);
        expect(applyConfigAction(changed, { _tag: 'resetConfig' })).toEqual(
            createDefaultConfig(),
        );
    });
});
