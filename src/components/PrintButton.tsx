import { Button } from './ui/button';
import { Printer } from 'lucide-react';

const PrintButton = () => {
    return (
        <Button
            onClick={() => {
                const printableArea = document.getElementById('PRINTAREA');
                const fontFamily = window
                    .getComputedStyle(document.documentElement)
                    .getPropertyValue('font-family');
                if (!printableArea) return;
                const popup = window.open();
                if (!popup) return;
                popup.document.body.innerHTML = printableArea.innerHTML;
                popup.document.body.style = `${printableArea.style.cssText}; font-family: ${fontFamily};`;
                popup.print();
                popup.close();
            }}
        >
            <Printer />
        </Button>
    );
};

export default PrintButton;
