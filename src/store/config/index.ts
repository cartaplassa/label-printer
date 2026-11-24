import { useAtomSet } from '@effect/atom-react';
import { Atom } from 'effect/reactivity';
import { useMemo } from 'react';
import {
    applySizingConfig,
    type BarcodePatch,
    type Config,
    convertConfigUnits,
    createDefaultConfig,
    createDefaultImageConfig,
    type ImagePatch,
    type LabelPatch,
    normalizeConfig,
    type SheetPatch,
    type SizingConfig,
    type TextPatch,
} from '@/domain/config';
import {
    getPaperSize,
    PAPER_FORMATS,
    type PaperFormat,
    type Side,
    type Sides,
} from '@/domain/paper';
import { loadConfig, saveConfig } from './persistence';

export interface ConfigActions {
    setPaperFormat: (format: PaperFormat) => void;
    toggleLandscape: () => void;
    updateLabel: (patch: LabelPatch) => void;
    updateImage: (patch: ImagePatch) => void;
    updateText: (patch: TextPatch) => void;
    updateBarcode: (patch: BarcodePatch) => void;
    setLabelPadding: (side: Side, value: number) => void;
    updateSheet: (patch: SheetPatch) => void;
    setSheetPadding: (side: Side, value: number) => void;
    applySizing: (sizing: SizingConfig) => void;
    resetImage: () => void;
    resetConfig: () => void;
}

export type ConfigAction =
    | { readonly _tag: 'setPaperFormat'; readonly format: PaperFormat }
    | { readonly _tag: 'toggleLandscape' }
    | { readonly _tag: 'updateLabel'; readonly patch: LabelPatch }
    | { readonly _tag: 'updateImage'; readonly patch: ImagePatch }
    | { readonly _tag: 'updateText'; readonly patch: TextPatch }
    | { readonly _tag: 'updateBarcode'; readonly patch: BarcodePatch }
    | {
          readonly _tag: 'setLabelPadding';
          readonly side: Side;
          readonly value: number;
      }
    | { readonly _tag: 'updateSheet'; readonly patch: SheetPatch }
    | {
          readonly _tag: 'setSheetPadding';
          readonly side: Side;
          readonly value: number;
      }
    | { readonly _tag: 'applySizing'; readonly sizing: SizingConfig }
    | { readonly _tag: 'resetImage' }
    | { readonly _tag: 'resetConfig' };

const patchPaddings = (
    paddings: Sides<number>,
    side: Side,
    value: number,
): Sides<number> => ({
    ...paddings,
    [side]: value,
});

const applyAction = (config: Config, action: ConfigAction): Config => {
    switch (action._tag) {
        case 'setPaperFormat': {
            const from = getPaperSize(
                config.sheet.format,
                config.sheet.landscape,
            ).unit;
            const to = PAPER_FORMATS[action.format].unit;
            const converted = convertConfigUnits(config, from, to);

            return normalizeConfig({
                ...converted,
                sheet: { ...converted.sheet, format: action.format },
            });
        }
        case 'toggleLandscape':
            return normalizeConfig({
                ...config,
                sheet: {
                    ...config.sheet,
                    landscape: !config.sheet.landscape,
                },
            });
        case 'updateLabel':
            return normalizeConfig({
                ...config,
                label: { ...config.label, ...action.patch },
            });
        case 'updateImage':
            return normalizeConfig({
                ...config,
                image: { ...config.image, ...action.patch },
            });
        case 'updateText':
            return normalizeConfig({
                ...config,
                text: { ...config.text, ...action.patch },
            });
        case 'updateBarcode':
            return normalizeConfig({
                ...config,
                barcode: { ...config.barcode, ...action.patch },
            });
        case 'setLabelPadding':
            return normalizeConfig({
                ...config,
                label: {
                    ...config.label,
                    paddings: patchPaddings(
                        config.label.paddings,
                        action.side,
                        action.value,
                    ),
                },
            });
        case 'updateSheet':
            return normalizeConfig({
                ...config,
                sheet: { ...config.sheet, ...action.patch },
            });
        case 'setSheetPadding':
            return normalizeConfig({
                ...config,
                sheet: {
                    ...config.sheet,
                    paddings: patchPaddings(
                        config.sheet.paddings,
                        action.side,
                        action.value,
                    ),
                },
            });
        case 'applySizing':
            return applySizingConfig(config, action.sizing);
        case 'resetImage':
            return normalizeConfig({
                ...config,
                image: createDefaultImageConfig(),
            });
        case 'resetConfig':
            return createDefaultConfig();
    }
};

const stateAtom = Atom.keepAlive(Atom.make<Config>(loadConfig()));

export const configAtom: Atom.Writable<Config, ConfigAction> = Atom.writable(
    (get) => get(stateAtom),
    (ctx, action) => {
        const config = applyAction(ctx.get(stateAtom), action);
        ctx.set(stateAtom, config);
        saveConfig(config);
    },
);

export const useConfigActions = (): ConfigActions => {
    const setConfig = useAtomSet(configAtom);

    return useMemo(
        () => ({
            setPaperFormat: (format) =>
                setConfig({ _tag: 'setPaperFormat', format }),
            toggleLandscape: () => setConfig({ _tag: 'toggleLandscape' }),
            updateLabel: (patch) => setConfig({ _tag: 'updateLabel', patch }),
            updateImage: (patch) => setConfig({ _tag: 'updateImage', patch }),
            updateText: (patch) => setConfig({ _tag: 'updateText', patch }),
            updateBarcode: (patch) =>
                setConfig({ _tag: 'updateBarcode', patch }),
            setLabelPadding: (side, value) =>
                setConfig({ _tag: 'setLabelPadding', side, value }),
            updateSheet: (patch) => setConfig({ _tag: 'updateSheet', patch }),
            setSheetPadding: (side, value) =>
                setConfig({ _tag: 'setSheetPadding', side, value }),
            applySizing: (sizing) => setConfig({ _tag: 'applySizing', sizing }),
            resetImage: () => setConfig({ _tag: 'resetImage' }),
            resetConfig: () => setConfig({ _tag: 'resetConfig' }),
        }),
        [setConfig],
    );
};
