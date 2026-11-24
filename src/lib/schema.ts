import { Effect, Option, Schema } from 'effect';

/**
 * A forgiving schema: missing keys and invalid values both decode to the
 * fallback value.
 */
export const withFallback = <T>(
    schema: Schema.Codec<T, unknown, never, unknown>,
    fallback: T,
) =>
    schema.pipe(
        Schema.withDecodingDefaultType(Effect.succeed(fallback)),
        Schema.catchDecoding(() => Effect.succeed(Option.some(fallback))),
    );
