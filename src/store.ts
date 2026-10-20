import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import exampleLabel from '@/assets/example.svg';
import exampleImage from '@/components/exampleImage';

export const PAPER_FORMAT_DIMENSIONS = {
    A0: { width: 84.1, height: 118.9, unit: 'cm' },
    A1: { width: 59.4, height: 84.1, unit: 'cm' },
    A2: { width: 42.0, height: 59.4, unit: 'cm' },
    A3: { width: 29.7, height: 42.0, unit: 'cm' },
    A4: {
        width: 21.0,
        height: 29.7,
        unit: 'cm',
    },
    A5: { width: 14.8, height: 21.0, unit: 'cm' },
    Letter: { width: 8.5, height: 11, unit: 'in' },
    Legal: { width: 8.5, height: 14, unit: 'in' },
    Tabloid: { width: 11, height: 17, unit: 'in' },
} as const;

export type PaperFormat = keyof typeof PAPER_FORMAT_DIMENSIONS;
export type MeasurementUnit = Pick<
    (typeof PAPER_FORMAT_DIMENSIONS)[PaperFormat],
    'unit'
>;

export type Side = 'top' | 'right' | 'bottom' | 'left';
export const sideToDimension: Record<Side, 'width' | 'height'> = {
    top: 'height',
    bottom: 'height',
    left: 'width',
    right: 'width',
};
export type Sides<T> = Record<Side, T>;
//  {
//     "top": T,
//     "right": T,
//     "bottom": T,
//     "left": T,
// }
type LabelType = 'text' | 'image';

type Config = {
    paperFormat: PaperFormat;
    setPaperFormat: (paperFormat: PaperFormat) => void;
    isPaperRotationAlbum: boolean;
    togglePaperRotation: () => void;
    labelType: LabelType;
    setLabelType: (newValue: LabelType) => void;
    toggleLabelType: () => void;
    labelBorderWidth: number;
    setLabelBorderWidth: (newValue: number) => void;
    labelText: string;
    setLabelText: (newLabel: string) => void;
    labelTextSize: number;
    setLabelTextSize: (newSize: number) => void;
    labelImage: string;
    setLabelImage: (newLabel: string) => void;
    resetLabelImage: () => void;
    sheetPaddings: Sides<number>;
    setSheetPadding: (type: Side, newValue: number) => void;
    labelWidth: number;
    setLabelWidth: (newValue: number) => void;
    labelHeight: number;
    setLabelHeight: (newValue: number) => void;
    labelPaddings: Sides<number>;
    setLabelPadding: (type: Side, newValue: number) => void;
};

const useConfigStore = create<Config>()(
    persist(
        immer((set) => ({
            paperFormat: 'A4',
            setPaperFormat: (newFormat: PaperFormat) =>
                set((draft) => {
                    draft.paperFormat = newFormat;
                }),
            isPaperRotationAlbum: false,
            togglePaperRotation: () =>
                set((draft) => {
                    draft.isPaperRotationAlbum = !draft.isPaperRotationAlbum;
                }),
            labelType: 'image',
            setLabelType: (newValue: LabelType) =>
                set((draft) => {
                    console.log(newValue);
                    draft.labelType = newValue;
                }),
            toggleLabelType: () =>
                set((draft) => {
                    if (draft.labelType === 'image') {
                        draft.labelType = 'text';
                        return;
                    }
                    draft.labelType = 'image';
                }),
            labelBorderWidth: 1,
            setLabelBorderWidth: (newValue: number) =>
                set((draft) => {
                    draft.labelBorderWidth = newValue;
                }),
            labelText: '',
            setLabelText: (newValue: string) =>
                set((draft) => {
                    draft.labelText = newValue;
                }),
            labelTextSize: 16,
            setLabelTextSize: (newSize: number) =>
                set((draft) => {
                    draft.labelTextSize = newSize;
                }),
            labelImage: exampleImage,
            setLabelImage: (newLabel: string) =>
                set((draft) => {
                    console.log(newLabel);
                    draft.labelImage = newLabel;
                }),
            resetLabelImage: () =>
                set((draft) => {
                    draft.labelImage = exampleLabel;
                }),
            sheetPaddings: {
                top: 0.1,
                right: 0.1,
                bottom: 0.1,
                left: 0.1,
            },
            setSheetPadding: (type: Side, newValue: number) =>
                set((draft) => {
                    draft.sheetPaddings[type] = newValue;
                }),
            labelWidth: 3,
            setLabelWidth: (newValue: number) =>
                set((draft) => {
                    draft.labelWidth = newValue;
                }),
            labelHeight: 1,
            setLabelHeight: (newValue: number) =>
                set((draft) => {
                    draft.labelHeight = newValue;
                }),
            labelPaddings: {
                top: 0.1,
                right: 0.1,
                bottom: 0.1,
                left: 0.1,
            },
            setLabelPadding: (type: Side, newValue: number) =>
                set((draft) => {
                    if (type === 'top' && newValue > draft.labelHeight / 2)
                        return;
                    if (type === 'right' && newValue > draft.labelWidth / 2)
                        return;
                    if (type === 'bottom' && newValue > draft.labelHeight / 2)
                        return;
                    if (type === 'left' && newValue > draft.labelWidth / 2)
                        return;
                    draft.labelPaddings[type] = newValue;
                }),
            // TODO: customizable borders, gaps and whatnot
        })),
        { name: 'labelPrinterStore' },
    ),
);

export default useConfigStore;
