import type { LabelConfig, SheetConfig } from './config';
import type { GridLayout } from './layout';
import { formatLength, formatSides } from './paper';

export interface PrintCssOptions {
    label: LabelConfig;
    sheet: SheetConfig;
    layout: GridLayout;
}

const borderWidth = (value: number): string => (value > 0 ? `${value}pt` : '0');

export function buildPrintCss({
    label,
    sheet,
    layout,
}: PrintCssOptions): string {
    const { unit } = layout.paper;
    const width = formatLength(label.width, unit);
    const height = formatLength(label.height, unit);

    return `
            .GRID {
                display: grid;
                grid-template-columns: repeat(${layout.columns}, ${width});
                font-size: ${label.textSize}pt;
                row-gap: ${formatLength(sheet.gapY, unit)};
                column-gap: ${formatLength(sheet.gapX, unit)};
            }

            .CELL {
                width: ${width};
                height: ${height};
                max-width: ${width};
                max-height: ${height};
                padding: ${formatSides(label.paddings, unit)};
                box-sizing: border-box;
                overflow: hidden;
                outline-width: ${borderWidth(label.borderWidth)};
                outline-color: black;
                outline-style: solid;
            }

            .CELL p {
                margin-block-start: 0;
                margin-block-end: 0;
                line-height: 1.5;
                text-align: ${label.textAlign};
            }

            .CELL .SERIAL-IMAGE {
                -webkit-print-color-adjust: exact;
                object-fit: contain;
                background: no-repeat center/contain url("${label.image}");
                width: 100%;
                height: 100%;
            }
            `;
}
