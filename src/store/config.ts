import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    type Config,
    convertConfigUnits,
    createDefaultConfig,
    DEFAULT_IMAGE,
    isConfig,
    type LabelPatch,
    normalizeConfig,
    type SheetPatch,
} from '@/domain/config';
import {
    getPaperSize,
    isPaperFormat,
    PAPER_FORMATS,
    type PaperFormat,
    type Side,
    type Sides,
} from '@/domain/paper';

export interface ConfigActions {
    setPaperFormat: (format: PaperFormat) => void;
    toggleLandscape: () => void;
    updateLabel: (patch: LabelPatch) => void;
    setLabelPadding: (side: Side, value: number) => void;
    updateSheet: (patch: SheetPatch) => void;
    setSheetPadding: (side: Side, value: number) => void;
    resetLabelImage: () => void;
    resetConfig: () => void;
}

export type ConfigStore = Config & ConfigActions;

interface LegacyConfig {
    paperFormat?: PaperFormat;
    isPaperRotationAlbum?: boolean;
    labelType?: 'text' | 'image';
    labelBorderWidth?: number;
    labelText?: string;
    labelTextSize?: number;
    labelImage?: string;
    sheetPaddings?: Sides<number>;
    labelWidth?: number;
    labelHeight?: number;
    sheetGapX?: number;
    sheetGapY?: number;
    labelPaddings?: Sides<number>;
}

const CONFIG_VERSION = 1;

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const patchPaddings = (
    paddings: Sides<number>,
    side: Side,
    value: number,
): Sides<number> => ({
    ...paddings,
    [side]: value,
});

function migrateConfig(persisted: unknown, version: number): Config {
    const defaults = createDefaultConfig();

    if (!isRecord(persisted)) return defaults;

    if (version >= CONFIG_VERSION) {
        return isConfig(persisted) ? normalizeConfig(persisted) : defaults;
    }

    const old = persisted as LegacyConfig;

    return normalizeConfig({
        label: {
            type: old.labelType ?? defaults.label.type,
            image: old.labelImage ?? defaults.label.image,
            text: old.labelText ?? defaults.label.text,
            textAlign: defaults.label.textAlign,
            textSize: old.labelTextSize ?? defaults.label.textSize,
            borderWidth: old.labelBorderWidth ?? defaults.label.borderWidth,
            width: old.labelWidth ?? defaults.label.width,
            height: old.labelHeight ?? defaults.label.height,
            paddings: old.labelPaddings ?? defaults.label.paddings,
        },
        sheet: {
            format: isPaperFormat(old.paperFormat)
                ? old.paperFormat
                : defaults.sheet.format,
            landscape: old.isPaperRotationAlbum ?? defaults.sheet.landscape,
            paddings: old.sheetPaddings ?? defaults.sheet.paddings,
            gapX: old.sheetGapX ?? defaults.sheet.gapX,
            gapY: old.sheetGapY ?? defaults.sheet.gapY,
        },
    });
}

export const useConfigStore = create<ConfigStore>()(
    persist(
        (set) => {
            const setConfig = (updater: (config: Config) => Config) =>
                set((state) =>
                    updater({ label: state.label, sheet: state.sheet }),
                );

            return {
                ...createDefaultConfig(),
                setPaperFormat: (format) =>
                    setConfig((config) => {
                        const from = getPaperSize(
                            config.sheet.format,
                            config.sheet.landscape,
                        ).unit;
                        const to = PAPER_FORMATS[format].unit;
                        const converted = convertConfigUnits(config, from, to);

                        return normalizeConfig({
                            ...converted,
                            sheet: { ...converted.sheet, format },
                        });
                    }),
                toggleLandscape: () =>
                    setConfig((config) =>
                        normalizeConfig({
                            ...config,
                            sheet: {
                                ...config.sheet,
                                landscape: !config.sheet.landscape,
                            },
                        }),
                    ),
                updateLabel: (patch) =>
                    setConfig((config) =>
                        normalizeConfig({
                            ...config,
                            label: { ...config.label, ...patch },
                        }),
                    ),
                setLabelPadding: (side, value) =>
                    setConfig((config) =>
                        normalizeConfig({
                            ...config,
                            label: {
                                ...config.label,
                                paddings: patchPaddings(
                                    config.label.paddings,
                                    side,
                                    value,
                                ),
                            },
                        }),
                    ),
                updateSheet: (patch) =>
                    setConfig((config) =>
                        normalizeConfig({
                            ...config,
                            sheet: { ...config.sheet, ...patch },
                        }),
                    ),
                setSheetPadding: (side, value) =>
                    setConfig((config) =>
                        normalizeConfig({
                            ...config,
                            sheet: {
                                ...config.sheet,
                                paddings: patchPaddings(
                                    config.sheet.paddings,
                                    side,
                                    value,
                                ),
                            },
                        }),
                    ),
                resetLabelImage: () =>
                    setConfig((config) =>
                        normalizeConfig({
                            ...config,
                            label: { ...config.label, image: DEFAULT_IMAGE },
                        }),
                    ),
                resetConfig: () => set(createDefaultConfig()),
            };
        },
        {
            name: 'labelPrinterStore',
            version: CONFIG_VERSION,
            partialize: ({ label, sheet }) => ({ label, sheet }),
            migrate: migrateConfig,
            merge: (persisted, current) => {
                if (!isConfig(persisted)) return current;

                return { ...current, ...normalizeConfig(persisted) };
            },
        },
    ),
);
