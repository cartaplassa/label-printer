import { Predicate, Schema, SchemaGetter } from 'effect';
import { withFallback } from '@/lib/schema';
import {
    type Config,
    createDefaultLabelConfig,
    type SizingConfig,
} from './model';
import { normalizeConfig } from './schema';
import { PaddingsShape, SheetShape } from './shapes';

const SizingConfigShape = Schema.Struct({
    sheet: SheetShape,
    label: Schema.Struct({
        width: Schema.Finite,
        height: Schema.Finite,
        paddings: PaddingsShape,
    }),
});

export function getSizingConfig(
    config: Pick<Config, 'label' | 'sheet'>,
): SizingConfig {
    return {
        sheet: config.sheet,
        label: {
            width: config.label.width,
            height: config.label.height,
            paddings: config.label.paddings,
        },
    };
}

export function applySizingConfig(
    config: Config,
    sizing: SizingConfig,
): Config {
    return normalizeConfig({
        ...config,
        sheet: sizing.sheet,
        label: { ...config.label, ...sizing.label },
    });
}

const RawSizingSchema = Schema.Unknown.pipe(
    Schema.decodeTo(
        Schema.Struct({
            label: withFallback(
                Schema.Record(Schema.String, Schema.Unknown),
                {},
            ),
            sheet: withFallback(
                Schema.Record(Schema.String, Schema.Unknown),
                {},
            ),
        }),
        {
            decode: SchemaGetter.transform((input: unknown) => {
                const source = Predicate.isObject(input) ? input : {};
                return {
                    label: Predicate.isObject(source.label) ? source.label : {},
                    sheet: Predicate.isObject(source.sheet) ? source.sheet : {},
                };
            }),
            encode: SchemaGetter.transform((raw) => raw),
        },
    ),
);

type RawSizing = (typeof RawSizingSchema)['Type'];

function normalizeSizingRaw(raw: RawSizing): SizingConfig {
    return getSizingConfig(
        normalizeConfig({
            label: { ...createDefaultLabelConfig(), ...raw.label },
            sheet: raw.sheet,
        }),
    );
}

export const SizingConfigSchema = RawSizingSchema.pipe(
    Schema.decodeTo(SizingConfigShape, {
        decode: SchemaGetter.transform(normalizeSizingRaw),
        encode: SchemaGetter.transform((sizing) => sizing),
    }),
);
