import { Schema } from 'effect';
import { PAPER_FORMAT_KEYS, type PaperFormat } from '../paper';

export const PaddingsShape = Schema.Struct({
    top: Schema.Finite,
    right: Schema.Finite,
    bottom: Schema.Finite,
    left: Schema.Finite,
});

export const SheetShape = Schema.Struct({
    format: Schema.Literals(
        PAPER_FORMAT_KEYS as [PaperFormat, ...PaperFormat[]],
    ),
    landscape: Schema.Boolean,
    paddings: PaddingsShape,
    gapX: Schema.Finite,
    gapY: Schema.Finite,
});
