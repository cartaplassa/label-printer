import {
    code39,
    code128,
    datamatrix,
    drawingSVG,
    ean13,
    qrcode,
    upca,
} from '@bwip-js/browser';
import type { BarcodeConfig, BarcodeType } from './config';

const encoders: Record<BarcodeType, typeof code128> = {
    code128,
    code39,
    ean13,
    upca,
    qrcode,
    datamatrix,
};

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
        const svg = encoders[barcode.type](bwipConfig, drawingSVG());

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
