import { Button } from './ui/button';
import { Printer } from 'lucide-react';

const PrintButton = () => {
    return (
        <Button
            onClick={() => {
                let printableAreaContent =
                    document.getElementById('PRINTAREA')?.innerHTML;
                if (!printableAreaContent) return;
                const popup = window.open();
                if (!popup) return;
                popup.document.body.innerHTML = printableAreaContent;
                popup.document.body.style = 'margin: 0'; // TODO Full CSS reset
                popup.print();
                popup.close();
            }}
        >
            <Printer />
        </Button>
    );
};

export default PrintButton;
