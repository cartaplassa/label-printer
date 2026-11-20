import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type SizingConfig, SizingConfigSchema } from '@/domain/config';

export interface SizingPreset {
    id: string;
    name: string;
    sizing: SizingConfig;
}

export interface SizingPresetsActions {
    savePreset: (name: string, sizing: SizingConfig) => void;
    renamePreset: (id: string, name: string) => void;
    deletePreset: (id: string) => void;
    deletePresets: (ids: string[]) => void;
}

export type SizingPresetsStore = {
    presets: SizingPreset[];
} & SizingPresetsActions;

const PRESETS_VERSION = 1;
export const SIZING_PRESET_NAME_MAX_LENGTH = 60;

const normalizeName = (name: string): string =>
    name.trim().slice(0, SIZING_PRESET_NAME_MAX_LENGTH);

const createId = (): string =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const PresetSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1).max(SIZING_PRESET_NAME_MAX_LENGTH),
    sizing: SizingConfigSchema,
});

const PersistedPresetsSchema = z
    .object({
        presets: z.array(PresetSchema).catch([]),
    })
    .catch({ presets: [] });

export const useSizingPresetsStore = create<SizingPresetsStore>()(
    persist(
        (set) => ({
            presets: [],
            savePreset: (name, sizing) => {
                const normalizedName = normalizeName(name);
                const parsedSizing = SizingConfigSchema.safeParse(sizing);

                if (!normalizedName || !parsedSizing.success) return;

                set((state) => ({
                    presets: [
                        ...state.presets,
                        {
                            id: createId(),
                            name: normalizedName,
                            sizing: parsedSizing.data,
                        },
                    ],
                }));
            },
            renamePreset: (id, name) => {
                const normalizedName = normalizeName(name);
                if (!normalizedName) return;

                set((state) => ({
                    presets: state.presets.map((preset) =>
                        preset.id === id
                            ? { ...preset, name: normalizedName }
                            : preset,
                    ),
                }));
            },
            deletePreset: (id) =>
                set((state) => ({
                    presets: state.presets.filter((preset) => preset.id !== id),
                })),
            deletePresets: (ids) => {
                const idSet = new Set(ids);
                set((state) => ({
                    presets: state.presets.filter(
                        (preset) => !idSet.has(preset.id),
                    ),
                }));
            },
        }),
        {
            name: 'labelPrinterSizingPresets',
            version: PRESETS_VERSION,
            migrate: (persisted) => persisted,
            partialize: ({ presets }) => ({ presets }),
            merge: (persisted, current) => {
                const parsed = PersistedPresetsSchema.safeParse(persisted);
                return parsed.success
                    ? { ...current, presets: parsed.data.presets }
                    : current;
            },
        },
    ),
);
