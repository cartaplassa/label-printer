import {
    code39,
    code128,
    datamatrix,
    drawingSVG,
    ean13,
    qrcode,
    upca,
} from '@bwip-js/browser';
import { mapOfStructs } from '@/lib/mapOfStructs';
import type { BarcodeConfig } from './config';

// biome-ignore format: keep table alignment
export const BARCODES = mapOfStructs(
    ['name',       'label',       'encoder'],
    ['code128',    'Code 128',    code128],
    ['code39',     'Code 39',     code39],
    ['ean13',      'EAN-13',      ean13],
    ['upca',       'UPC-A',       upca],
    ['qrcode',     'QR Code',     qrcode],
    ['datamatrix', 'Data Matrix', datamatrix],
);

export type BarcodeType = keyof typeof BARCODES;
export const BARCODE_TYPES = Object.keys(BARCODES) as BarcodeType[];
export const isBarcodeType = (value: unknown): value is BarcodeType =>
    BARCODE_TYPES.includes(value as BarcodeType);

const toBwipColor = (value: string): string =>
    value.replace(/^#/, '').slice(0, 6).toUpperCase();

export interface BarcodeResult {
    url: string;
    error?: string;
}

export function generateBarcodeDataUrl(barcode: BarcodeConfig): BarcodeResult {
    if (!barcode.data.trim()) {
        return { url: '', error: 'Enter data to encode.' };
    }

    try {
        const bwipConfig = {
            bcid: barcode.type,
            text: barcode.data,
            // bwip converts this from mm to inches for BWIPP, but the SVG has
            // no physical units; it only sets the viewBox aspect ratio.
            height: barcode.height,
            barcolor: toBwipColor(barcode.color),
            textcolor: toBwipColor(barcode.textColor),
            includetext: barcode.includeText,
        };
        const svg = BARCODES[barcode.type].encoder(bwipConfig, drawingSVG());

        return {
            url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
        };
    } catch (error) {
        const message =
            typeof error === 'string'
                ? error
                : error instanceof Error
                  ? error.message
                  : 'Invalid barcode data.';

        return {
            url: '',
            error: message.replace(/^bwipp\.[^#]+#\d+:\s*/, ''),
        };
    }
}
