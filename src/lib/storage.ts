import { Effect, Predicate, Schema, SchemaGetter } from 'effect';
import { withFallback } from './schema';

export interface PersistedEnvelope {
    readonly state: unknown;
    readonly version: number;
}

const PersistedEnvelopeSchema = Schema.Unknown.pipe(
    Schema.decodeTo(
        Schema.Struct({
            state: withFallback(Schema.Unknown, {}),
            version: withFallback(Schema.Finite, 0),
        }),
        {
            decode: SchemaGetter.transform((input: unknown) =>
                Predicate.isObject(input) && 'state' in input
                    ? { state: input.state, version: input.version }
                    : { state: input, version: 0 },
            ),
            encode: SchemaGetter.transform((envelope) => envelope),
        },
    ),
);

export const readPersisted = (key: string): Effect.Effect<PersistedEnvelope> =>
    Effect.gen(function* () {
        const raw = yield* Effect.try({
            try: () => {
                if (typeof localStorage === 'undefined') return null;
                const raw = localStorage.getItem(key);
                return raw === null ? null : JSON.parse(raw);
            },
            catch: () => null,
        }).pipe(Effect.catch(() => Effect.succeed(null)));

        return Schema.decodeUnknownSync(PersistedEnvelopeSchema)(raw);
    });

export const writePersisted = (
    key: string,
    version: number,
    state: unknown,
): Effect.Effect<void> =>
    Effect.gen(function* () {
        yield* Effect.try({
            try: () => {
                if (typeof localStorage === 'undefined') return;
                localStorage.setItem(key, JSON.stringify({ state, version }));
            },
            catch: () => undefined,
        }).pipe(Effect.catch(() => Effect.void));
    });
