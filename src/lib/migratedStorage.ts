import { Effect, Option } from 'effect';
import { readPersisted, writePersisted } from './storage';

export type Migration = (state: unknown) => Option.Option<unknown>;

export interface MigratedStorageOptions<A> {
    readonly key: string;
    readonly version: number;
    readonly defaultValue: () => A;
    readonly decode: (state: unknown, version: number) => Option.Option<A>;
    readonly migrations: Readonly<Record<number, Migration>>;
}

export interface MigratedStorage<A> {
    readonly load: () => A;
    readonly save: (value: A) => void;
}

export const createMigratedStorage = <A>(
    options: MigratedStorageOptions<A>,
): MigratedStorage<A> => ({
    load: () => {
        const persisted = Effect.runSync(readPersisted(options.key));
        let state = persisted.state;
        let version = Math.max(0, persisted.version);

        while (version < options.version) {
            const nextVersion = version + 1;
            const migrate = options.migrations[nextVersion];
            if (!migrate) return options.defaultValue();

            const next = migrate(state);
            if (Option.isNone(next)) return options.defaultValue();

            state = next.value;
            version = nextVersion;
        }

        return Option.getOrElse(
            options.decode(state, version),
            options.defaultValue,
        );
    },
    save: (value) => {
        Effect.runSync(writePersisted(options.key, options.version, value));
    },
});
