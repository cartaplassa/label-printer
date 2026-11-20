import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import {
    type Config,
    convertConfigUnits,
    createDefaultConfig,
    DEFAULT_IMAGE,
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

const CONFIG_VERSION = 1;

const PersistedConfigShapeSchema = z
    .object({
        label: z.record(z.string(), z.unknown()),
        sheet: z.record(z.string(), z.unknown()),
    })
    .passthrough();

const LegacyConfigSchema = z.record(z.string(), z.unknown());

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

    if (version >= CONFIG_VERSION) {
        const parsed = PersistedConfigShapeSchema.safeParse(persisted);
        return parsed.success ? normalizeConfig(parsed.data) : defaults;
    }

    const legacy = LegacyConfigSchema.safeParse(persisted);
    if (!legacy.success) return defaults;
    const old = legacy.data;

    const labelType =
        old.labelType === 'text' || old.labelType === 'image'
            ? old.labelType
            : defaults.label.type;

    return normalizeConfig({
        label: {
            type: labelType,
            image:
                typeof old.labelImage === 'string'
                    ? old.labelImage
                    : defaults.label.image,
            fontFamily: defaults.label.fontFamily,
            fontWeight: defaults.label.fontWeight,
            lineHeight: defaults.label.lineHeight,
            letterSpacing: defaults.label.letterSpacing,
            text:
                typeof old.labelText === 'string'
                    ? old.labelText
                    : defaults.label.text,
            textAlign: defaults.label.textAlign,
            textWrap: defaults.label.textWrap,
            textSize:
                typeof old.labelTextSize === 'number'
                    ? old.labelTextSize
                    : defaults.label.textSize,
            textColor: defaults.label.textColor,
            borderColor: defaults.label.borderColor,
            borderStyle: defaults.label.borderStyle,
            borderWidth:
                typeof old.labelBorderWidth === 'number'
                    ? old.labelBorderWidth
                    : defaults.label.borderWidth,
            width:
                typeof old.labelWidth === 'number'
                    ? old.labelWidth
                    : defaults.label.width,
            height:
                typeof old.labelHeight === 'number'
                    ? old.labelHeight
                    : defaults.label.height,
            paddings: old.labelPaddings ?? defaults.label.paddings,
        },
        sheet: {
            format: isPaperFormat(old.paperFormat)
                ? old.paperFormat
                : defaults.sheet.format,
            landscape:
                typeof old.isPaperRotationAlbum === 'boolean'
                    ? old.isPaperRotationAlbum
                    : defaults.sheet.landscape,
            paddings: old.sheetPaddings ?? defaults.sheet.paddings,
            gapX:
                typeof old.sheetGapX === 'number'
                    ? old.sheetGapX
                    : defaults.sheet.gapX,
            gapY:
                typeof old.sheetGapY === 'number'
                    ? old.sheetGapY
                    : defaults.sheet.gapY,
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
                const parsed = PersistedConfigShapeSchema.safeParse(persisted);
                if (!parsed.success) return current;

                return { ...current, ...normalizeConfig(parsed.data) };
            },
        },
    ),
);
