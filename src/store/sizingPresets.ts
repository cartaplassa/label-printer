import { useAtomSet, useAtomValue } from '@effect/atom-react';
import { Option, Schema } from 'effect';
import { Atom } from 'effect/reactivity';
import { useMemo } from 'react';
import { type SizingConfig, SizingConfigSchema } from '@/domain/config';
import { createMigratedStorage } from '@/lib/migratedStorage';
import { withFallback } from '@/lib/schema';

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
    importPresets: (presets: SizingPreset[]) => void;
}

export type SizingPresetAction =
    | {
          readonly _tag: 'savePreset';
          readonly name: string;
          readonly sizing: SizingConfig;
      }
    | {
          readonly _tag: 'renamePreset';
          readonly id: string;
          readonly name: string;
      }
    | { readonly _tag: 'deletePreset'; readonly id: string }
    | { readonly _tag: 'deletePresets'; readonly ids: string[] }
    | { readonly _tag: 'importPresets'; readonly presets: SizingPreset[] };

const PRESETS_VERSION = 1;
const PRESETS_STORAGE_KEY = 'labelPrinterSizingPresets';
export const SIZING_PRESET_NAME_MAX_LENGTH = 60;

const normalizeName = (name: string): string =>
    name.trim().slice(0, SIZING_PRESET_NAME_MAX_LENGTH);

const createId = (): string =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const PresetSchema = Schema.Struct({
    id: Schema.NonEmptyString,
    name: Schema.String.check(
        Schema.isMinLength(1),
        Schema.isMaxLength(SIZING_PRESET_NAME_MAX_LENGTH),
    ),
    sizing: SizingConfigSchema,
});

export const SizingPresetsSchema = Schema.Array(PresetSchema);

const PersistedPresetsSchema = withFallback(
    Schema.Struct({
        presets: withFallback(SizingPresetsSchema, []),
    }),
    { presets: [] },
);

interface PersistedPresets {
    readonly presets: ReadonlyArray<SizingPreset>;
}

const presetsStorage = createMigratedStorage<PersistedPresets>({
    key: PRESETS_STORAGE_KEY,
    version: PRESETS_VERSION,
    defaultValue: () => ({ presets: [] }),
    decode: (state, version) => {
        if (version !== PRESETS_VERSION) return Option.none();

        return Schema.decodeUnknownOption(PersistedPresetsSchema)(state);
    },
    migrations: {},
});

const loadPresets = (): ReadonlyArray<SizingPreset> =>
    presetsStorage.load().presets;
const persist = (presets: ReadonlyArray<SizingPreset>): void =>
    presetsStorage.save({ presets });

const applyAction = (
    presets: ReadonlyArray<SizingPreset>,
    action: SizingPresetAction,
): ReadonlyArray<SizingPreset> => {
    switch (action._tag) {
        case 'savePreset': {
            const name = normalizeName(action.name);
            const sizing = Schema.decodeUnknownOption(SizingConfigSchema)(
                action.sizing,
            );
            if (!name || Option.isNone(sizing)) return presets;

            return [...presets, { id: createId(), name, sizing: sizing.value }];
        }
        case 'renamePreset': {
            const name = normalizeName(action.name);
            if (!name) return presets;

            return presets.map((preset) =>
                preset.id === action.id ? { ...preset, name } : preset,
            );
        }
        case 'deletePreset':
            return presets.filter((preset) => preset.id !== action.id);
        case 'deletePresets': {
            const idSet = new Set(action.ids);
            return presets.filter((preset) => !idSet.has(preset.id));
        }
        case 'importPresets': {
            const importedById = new Map<string, SizingPreset>();
            for (const preset of action.presets) {
                const parsed = Schema.decodeUnknownOption(PresetSchema)({
                    ...preset,
                    name: normalizeName(preset.name),
                });
                if (Option.isSome(parsed)) {
                    importedById.set(parsed.value.id, parsed.value);
                }
            }

            const existingIds = new Set(presets.map((preset) => preset.id));

            return [
                ...presets.map(
                    (preset) => importedById.get(preset.id) ?? preset,
                ),
                ...[...importedById.values()].filter(
                    (preset) => !existingIds.has(preset.id),
                ),
            ];
        }
    }
};

const stateAtom = Atom.keepAlive(
    Atom.make<ReadonlyArray<SizingPreset>>(loadPresets()),
);

export const sizingPresetsAtom: Atom.Writable<
    ReadonlyArray<SizingPreset>,
    SizingPresetAction
> = Atom.writable(
    (get) => get(stateAtom),
    (ctx, action) => {
        const presets = applyAction(ctx.get(stateAtom), action);
        ctx.set(stateAtom, presets);
        persist(presets);
    },
);

export const useSizingPresets = (): ReadonlyArray<SizingPreset> =>
    useAtomValue(sizingPresetsAtom);

export const useSizingPresetsActions = (): SizingPresetsActions => {
    const setPresets = useAtomSet(sizingPresetsAtom);

    return useMemo(
        () => ({
            savePreset: (name, sizing) =>
                setPresets({ _tag: 'savePreset', name, sizing }),
            renamePreset: (id, name) =>
                setPresets({ _tag: 'renamePreset', id, name }),
            deletePreset: (id) => setPresets({ _tag: 'deletePreset', id }),
            deletePresets: (ids) => setPresets({ _tag: 'deletePresets', ids }),
            importPresets: (presets) =>
                setPresets({ _tag: 'importPresets', presets }),
        }),
        [setPresets],
    );
};
