import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

export type ConfigStore = Config & ConfigActions;

const CONFIG_VERSION = 2;

const recordSchema = z.record(z.string(), z.unknown());

const PersistedV2Schema = z
    .object({
        image: recordSchema,
        text: recordSchema,
        barcode: recordSchema,
        label: recordSchema,
        sheet: recordSchema,
    })
    .passthrough();

const PersistedV1Schema = z
    .object({
        label: recordSchema,
        sheet: recordSchema,
    })
    .passthrough();

const LegacyConfigSchema = recordSchema;

type V1Shape = z.infer<typeof PersistedV1Schema>;

const patchPaddings = (
    paddings: Sides<number>,
    side: Side,
    value: number,
): Sides<number> => ({
    ...paddings,
    [side]: value,
});

function legacyToV1(persisted: unknown, defaults: Config): V1Shape | null {
    const legacy = LegacyConfigSchema.safeParse(persisted);
    if (!legacy.success) return null;
    const old = legacy.data;

    return {
        label: {
            type: old.labelType,
            image: old.labelImage,
            text: old.labelText,
            fontFamily: defaults.text.fontFamily,
            fontWeight: defaults.text.fontWeight,
            lineHeight: defaults.text.lineHeight,
            letterSpacing: defaults.text.letterSpacing,
            textAlign: defaults.text.align,
            textWrap: defaults.text.wrap,
            textSize: old.labelTextSize,
            textColor: defaults.text.color,
            barcode: defaults.barcode,
            borderColor: defaults.label.borderColor,
            borderStyle: defaults.label.borderStyle,
            borderWidth: old.labelBorderWidth,
            width: old.labelWidth,
            height: old.labelHeight,
            paddings: old.labelPaddings,
        },
        sheet: {
            format: old.paperFormat,
            landscape: old.isPaperRotationAlbum,
            paddings: old.sheetPaddings,
            gapX: old.sheetGapX,
            gapY: old.sheetGapY,
        },
    };
}

function v1ToConfig(old: V1Shape): Config {
    const label = old.label;

    return normalizeConfig({
        image: { data: label.image },
        text: {
            data: label.text,
            fontFamily: label.fontFamily,
            fontWeight: label.fontWeight,
            lineHeight: label.lineHeight,
            letterSpacing: label.letterSpacing,
            align: label.textAlign,
            wrap: label.textWrap,
            size: label.textSize,
            color: label.textColor,
        },
        barcode: label.barcode,
        label: {
            type: label.type,
            borderColor: label.borderColor,
            borderStyle: label.borderStyle,
            borderWidth: label.borderWidth,
            width: label.width,
            height: label.height,
            paddings: label.paddings,
        },
        sheet: old.sheet,
    });
}

function migrateConfig(persisted: unknown, version: number): Config {
    const defaults = createDefaultConfig();

    if (version >= CONFIG_VERSION) {
        const parsed = PersistedV2Schema.safeParse(persisted);
        return parsed.success ? normalizeConfig(parsed.data) : defaults;
    }

    if (version === 1) {
        const parsed = PersistedV1Schema.safeParse(persisted);
        return parsed.success ? v1ToConfig(parsed.data) : defaults;
    }

    const legacy = legacyToV1(persisted, defaults);
    return legacy ? v1ToConfig(legacy) : defaults;
}

export const useConfigStore = create<ConfigStore>()(
    persist(
        (set) => {
            const setConfig = (updater: (config: Config) => Config) =>
                set((state) =>
                    updater({
                        image: state.image,
                        text: state.text,
                        barcode: state.barcode,
                        label: state.label,
                        sheet: state.sheet,
                    }),
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
                updateImage: (patch) =>
                    setConfig((config) =>
                        normalizeConfig({
                            ...config,
                            image: { ...config.image, ...patch },
                        }),
                    ),
                updateText: (patch) =>
                    setConfig((config) =>
                        normalizeConfig({
                            ...config,
                            text: { ...config.text, ...patch },
                        }),
                    ),
                updateBarcode: (patch) =>
                    setConfig((config) =>
                        normalizeConfig({
                            ...config,
                            barcode: { ...config.barcode, ...patch },
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
                applySizing: (sizing) =>
                    setConfig((config) => applySizingConfig(config, sizing)),
                resetImage: () =>
                    setConfig((config) =>
                        normalizeConfig({
                            ...config,
                            image: createDefaultImageConfig(),
                        }),
                    ),
                resetConfig: () => set(createDefaultConfig()),
            };
        },
        {
            name: 'labelPrinterStore',
            version: CONFIG_VERSION,
            partialize: ({ image, text, barcode, label, sheet }) => ({
                image,
                text,
                barcode,
                label,
                sheet,
            }),
            migrate: migrateConfig,
            merge: (persisted, current) => {
                const parsed = PersistedV2Schema.safeParse(persisted);
                if (!parsed.success) return current;

                return { ...current, ...normalizeConfig(parsed.data) };
            },
        },
    ),
);
