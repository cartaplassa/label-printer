import { Option } from 'effect';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMigratedStorage, type Migration } from './migratedStorage';

const createMemoryStorage = () => {
    const data = new Map<string, string>();

    return {
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => {
            data.set(key, String(value));
        },
        removeItem: (key: string) => {
            data.delete(key);
        },
        clear: () => data.clear(),
        length: data.size,
    };
};

beforeEach(() => {
    vi.stubGlobal('localStorage', createMemoryStorage());
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('createMigratedStorage', () => {
    it('Decodes state at the current version directly', () => {
        const storage = createMigratedStorage<string>({
            key: 'settings',
            version: 1,
            defaultValue: () => 'default',
            decode: (state) =>
                typeof state === 'string' ? Option.some(state) : Option.none(),
            migrations: {},
        });
        localStorage.setItem(
            'settings',
            JSON.stringify({ state: 'current', version: 1 }),
        );

        expect(storage.load()).toBe('current');
    });

    it('Runs migrations in destination-version order', () => {
        const migrations: Record<number, Migration> = {
            1: (state) => Option.some(`${String(state)}-v1`),
            2: (state) => Option.some(`${String(state)}-v2`),
        };
        const storage = createMigratedStorage<string>({
            key: 'settings',
            version: 2,
            defaultValue: () => 'default',
            decode: (state, version) =>
                Option.some(`${String(state)}@${version}`),
            migrations,
        });
        localStorage.setItem(
            'settings',
            JSON.stringify({ state: 'old', version: 0 }),
        );

        expect(storage.load()).toBe('old-v1-v2@2');
    });

    it('Falls back when a migration step is missing', () => {
        const storage = createMigratedStorage<string>({
            key: 'settings',
            version: 2,
            defaultValue: () => 'default',
            decode: () => Option.some('decoded'),
            migrations: {
                2: (state) => Option.some(String(state)),
            },
        });
        localStorage.setItem(
            'settings',
            JSON.stringify({ state: 'old', version: 0 }),
        );

        expect(storage.load()).toBe('default');
    });

    it('Falls back when a migration returns None', () => {
        const storage = createMigratedStorage<string>({
            key: 'settings',
            version: 1,
            defaultValue: () => 'default',
            decode: () => Option.some('decoded'),
            migrations: { 1: () => Option.none() },
        });
        localStorage.setItem(
            'settings',
            JSON.stringify({ state: 'old', version: 0 }),
        );

        expect(storage.load()).toBe('default');
    });

    it('Falls back when decoding fails', () => {
        const storage = createMigratedStorage<string>({
            key: 'settings',
            version: 1,
            defaultValue: () => 'default',
            decode: () => Option.none(),
            migrations: {},
        });
        localStorage.setItem(
            'settings',
            JSON.stringify({ state: { bad: true }, version: 1 }),
        );

        expect(storage.load()).toBe('default');
    });

    it('Passes future versions to decode', () => {
        const storage = createMigratedStorage<string>({
            key: 'settings',
            version: 1,
            defaultValue: () => 'default',
            decode: (state, version) =>
                Option.some(`${String(state)}@${version}`),
            migrations: {},
        });
        localStorage.setItem(
            'settings',
            JSON.stringify({ state: 'future', version: 5 }),
        );

        expect(storage.load()).toBe('future@5');
    });

    it('Saves state with the configured version', () => {
        const storage = createMigratedStorage<string>({
            key: 'settings',
            version: 2,
            defaultValue: () => 'default',
            decode: () => Option.some('decoded'),
            migrations: {},
        });

        storage.save('saved');

        expect(JSON.parse(localStorage.getItem('settings') ?? '')).toEqual({
            state: 'saved',
            version: 2,
        });
    });
});
