import { Button } from './ui/button';
import { Printer } from 'lucide-react';

const PrintButton = () => {
    return (
        <Button
            onClick={() => {
                let printableArea = document.getElementById('PRINTAREA');
                if (!printableArea) return;
                const popup = window.open();
                if (!popup) return;
                popup.document.body.innerHTML = printableArea.innerHTML;
                console.log(printableArea.style);
                popup.document.body.style = `${printableArea.style.cssText} margin: 0`;
                popup.print();
                popup.close();
            }}
        >
            <Printer />
        </Button>
    );
};

export default PrintButton;
