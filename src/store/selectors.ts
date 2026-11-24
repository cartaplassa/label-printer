import { useAtomValue } from '@effect/atom-react';
import { useMemo } from 'react';
import {
    type BarcodeConfig,
    getSizingConfig,
    type ImageConfig,
    type LabelConfig,
    type SheetConfig,
    type SizingConfig,
    type TextConfig,
} from '@/domain/config';
import { computeGridLayout, type GridLayout } from '@/domain/layout';
import { getPaperSize, type PaperSize } from '@/domain/paper';
import { configAtom } from './config';

export const useImage = (): ImageConfig =>
    useAtomValue(configAtom, (config) => config.image);

export const useText = (): TextConfig =>
    useAtomValue(configAtom, (config) => config.text);

export const useBarcode = (): BarcodeConfig =>
    useAtomValue(configAtom, (config) => config.barcode);

export const useLabel = (): LabelConfig =>
    useAtomValue(configAtom, (config) => config.label);

export const useSheet = (): SheetConfig =>
    useAtomValue(configAtom, (config) => config.sheet);

export function useSizing(): SizingConfig {
    const label = useLabel();
    const sheet = useSheet();

    return useMemo(() => getSizingConfig({ label, sheet }), [label, sheet]);
}

export function usePaperSize(): PaperSize {
    const format = useAtomValue(configAtom, (config) => config.sheet.format);
    const landscape = useAtomValue(
        configAtom,
        (config) => config.sheet.landscape,
    );

    return useMemo(() => getPaperSize(format, landscape), [format, landscape]);
}

export function useGridLayout(): GridLayout {
    const label = useLabel();
    const sheet = useSheet();

    return useMemo(() => computeGridLayout(label, sheet), [label, sheet]);
}
