import {
    FONTS,
    type ImageConfig,
    type LabelConfig,
    type SheetConfig,
    type TextConfig,
} from './config';
import type { GridLayout } from './layout';
import { formatLength, formatSides } from './paper';

export interface PrintCssOptions {
    image: ImageConfig;
    text: TextConfig;
    label: LabelConfig;
    sheet: SheetConfig;
    layout: GridLayout;
    barcodeImage?: string;
}

const borderWidth = (value: number): string => (value > 0 ? `${value}pt` : '0');

export function buildPrintCss({
    image,
    text,
    label,
    sheet,
    layout,
    barcodeImage,
}: PrintCssOptions): string {
    const { unit } = layout.paper;
    const width = formatLength(label.width, unit);
    const height = formatLength(label.height, unit);
    const barcodeBackground = barcodeImage
        ? `background: no-repeat center/contain url("${barcodeImage}");`
        : 'background: none;';

    return `
            .GRID {
                display: grid;
                grid-template-columns: repeat(${layout.columns}, ${width});
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
                outline-offset: -${borderWidth(label.borderWidth)};
                outline-color: ${label.borderColor};
                outline-style: ${label.borderStyle};
            }

            .CELL p {
                margin-block-start: 0;
                margin-block-end: 0;
                line-height: ${text.lineHeight};
                letter-spacing: ${text.letterSpacing}em;
                text-align: ${text.align};
                font-size: ${text.size}pt;
                font-family: ${(text.fontFamily && FONTS?.[text.fontFamily].fullName) ?? 'system-ui'};
                font-weight: ${text.fontWeight};
                white-space: pre-wrap;
                min-width: ${text.wrap ? 'initial' : 'max-content'};
                color: ${text.color};
            }

            .CELL .SERIAL-IMAGE {
                -webkit-print-color-adjust: exact;
                object-fit: contain;
                background: no-repeat center/contain url("${image.data}");
                width: 100%;
                height: 100%;
            }

            .CELL .SERIAL-BARCODE {
                -webkit-print-color-adjust: exact;
                ${barcodeBackground}
                width: 100%;
                height: 100%;
            }
            `;
}
