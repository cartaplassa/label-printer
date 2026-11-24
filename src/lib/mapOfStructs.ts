type Row = readonly unknown[];

type IsUnion<T, Whole = T> = T extends Whole
    ? [Whole] extends [T]
        ? false
        : true
    : never;

type IsFixedTuple<T extends Row> = number extends T['length']
    ? false
    : true extends IsUnion<T['length']>
      ? false
      : true;

type SameLength<A extends Row, B extends Row> = IsFixedTuple<A> extends true
    ? IsFixedTuple<B> extends true
        ? [A['length']] extends [B['length']]
            ? [B['length']] extends [A['length']]
                ? true
                : false
            : false
        : false
    : false;

// Widen primitive literals so, for example, "a" and "b" both fit string.
type Widen<T> = true extends IsUnion<T>
    ? T
    : T extends string
      ? string
      : T extends number
        ? number
        : T extends boolean
          ? boolean
          : T extends bigint
            ? bigint
            : T extends symbol
              ? symbol
              : T;

type WidenTuple<T extends Row> = {
    [I in keyof T]: Widen<T[I]>;
};

type RowIsValid<
    Headers extends Row,
    Schema extends Row,
    Candidate extends Row,
> = SameLength<Headers, Candidate> extends true
    ? [Candidate] extends [Schema]
        ? true
        : false
    : false;

type RowsFit<
    Headers extends Row,
    Schema extends Row,
    Rows extends readonly Row[],
> = Rows extends readonly []
    ? true
    : Rows extends readonly [
            infer Head extends Row,
            ...infer Tail extends readonly Row[],
        ]
      ? RowIsValid<Headers, Schema, Head> extends true
          ? RowsFit<Headers, Schema, Tail>
          : false
      : false;

type TupleIndex<K> = K extends number
    ? K
    : K extends `${infer N extends number}`
      ? N
      : never;

type TupleIndices<T extends readonly unknown[]> = TupleIndex<
    Exclude<keyof T, keyof (readonly unknown[])>
>;

type RowKey<R extends Row> = R extends readonly [
    infer K extends string,
    ...unknown[],
]
    ? K
    : never;

type RowFields<H extends readonly [string, ...string[]], R extends Row> = {
    [I in Exclude<TupleIndices<H>, 0> as H[I & keyof H] & string]: R[I &
        keyof R];
};

type MapOfStructs<
    H extends readonly [string, ...string[]],
    Rows extends readonly Row[],
> = {
    [R in Rows[number] as RowKey<R>]: RowFields<H, R>;
};

export function mapOfStructs<
    const H extends readonly [string, ...string[]],
    const First extends readonly [string, ...unknown[]],
    const Rest extends readonly Row[],
>(
    headers: H,
    first: First & (SameLength<H, First> extends true ? unknown : never),
    ...rest: Rest &
        (RowsFit<H, WidenTuple<First>, Rest> extends true ? unknown : never)
): MapOfStructs<H, readonly [First, ...Rest]> {
    const rows: readonly Row[] = [first, ...rest];
    const entries: [string, unknown][] = [];

    for (const row of rows) {
        if (row.length !== headers.length) {
            throw new TypeError('Row length does not match header length');
        }

        const key = row[0];
        if (typeof key !== 'string') {
            throw new TypeError('The first cell of each row must be a string');
        }

        const fields: [string, unknown][] = [];

        for (let i = 1; i < headers.length; i++) {
            const header = headers[i];
            if (typeof header !== 'string') {
                throw new TypeError('Headers must be strings');
            }

            fields.push([header, row[i]]);
        }

        entries.push([key, Object.fromEntries(fields)]);
    }

    // TS can't prove the relationship between the dynamic indices and TableResult.
    return Object.fromEntries(entries) as MapOfStructs<
        H,
        readonly [First, ...Rest]
    >;
}
