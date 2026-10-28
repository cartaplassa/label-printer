import type { LabelConfig, SheetConfig } from './config';
import { getPaperSize, type PaperSize } from './paper';

export const MAX_LABEL_COUNT = 8192;

export interface GridLayout {
    paper: PaperSize;
    columns: number;
    rows: number;
    cellCount: number;
    paddingOverflows: boolean;
}

const countCells = (available: number, size: number, gap: number): number => {
    if (size <= 0 || available <= 0) return 0;

    const step = size + gap;
    if (step <= 0) return 0;

    return Math.max(0, Math.floor((available + gap) / step));
};

export function computeGridLayout(
    label: LabelConfig,
    sheet: SheetConfig,
): GridLayout {
    const paper = getPaperSize(sheet.format, sheet.landscape);
    const availableWidth =
        paper.width - sheet.paddings.left - sheet.paddings.right;
    const availableHeight =
        paper.height - sheet.paddings.top - sheet.paddings.bottom;
    const columns = countCells(availableWidth, label.width, sheet.gapX);
    const rows = countCells(availableHeight, label.height, sheet.gapY);

    return {
        paper,
        columns,
        rows,
        cellCount: Math.min(columns * rows, MAX_LABEL_COUNT),
        paddingOverflows:
            label.width <= label.paddings.left + label.paddings.right ||
            label.height <= label.paddings.top + label.paddings.bottom,
    };
}
