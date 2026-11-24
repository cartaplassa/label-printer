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
import { useConfigStore } from './config';

export const useImage = (): ImageConfig =>
    useConfigStore((state) => state.image);

export const useText = (): TextConfig => useConfigStore((state) => state.text);

export const useBarcode = (): BarcodeConfig =>
    useConfigStore((state) => state.barcode);

export const useLabel = (): LabelConfig =>
    useConfigStore((state) => state.label);

export const useSheet = (): SheetConfig =>
    useConfigStore((state) => state.sheet);

export function useSizing(): SizingConfig {
    const label = useLabel();
    const sheet = useSheet();

    return useMemo(() => getSizingConfig({ label, sheet }), [label, sheet]);
}

export function usePaperSize(): PaperSize {
    const format = useConfigStore((state) => state.sheet.format);
    const landscape = useConfigStore((state) => state.sheet.landscape);

    return useMemo(() => getPaperSize(format, landscape), [format, landscape]);
}

export function useGridLayout(): GridLayout {
    const label = useLabel();
    const sheet = useSheet();

    return useMemo(() => computeGridLayout(label, sheet), [label, sheet]);
}
