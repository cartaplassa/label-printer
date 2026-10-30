import { Button } from './ui/button';
import { Printer } from 'lucide-react';

const PrintButton = () => {
    return (
        <Button
            onClick={() => {
                const printableArea = document.getElementById('PRINTAREA');
                const rootStyle = window.getComputedStyle(
                    document.documentElement,
                );
                const fontFamily = rootStyle.getPropertyValue('font-family');

                if (!printableArea) return;
                const popup = window.open();
                if (!popup) return;

                popup.document.body.innerHTML = printableArea.innerHTML;
                popup.document.body.style.cssText = `${printableArea.style.cssText}; font-family: ${fontFamily};`;
                const fontStyles = Array.from(document.styleSheets)
                    .flatMap((sheet) => {
                        try {
                            return Array.from(sheet.cssRules);
                        } catch (_e) {
                            return [];
                        }
                    })
                    .filter(
                        (rule) => rule.constructor.name === 'CSSFontFaceRule',
                    )
                    .map((rule) => rule.cssText)
                    .join('\n');

                const styleEl = popup.document.createElement('style');
                styleEl.textContent = fontStyles;
                popup.document.head.appendChild(styleEl);

                popup.document.fonts.ready
                    .then(() => {
                        popup.print();
                        popup.close();
                    })
                    .catch((err) => {
                        console.error(
                            'Font loading failed, printing anyway',
                            err,
                        );
                        popup.print();
                        popup.close();
                    });
            }}
        >
            <Printer />
        </Button>
    );
};

export default PrintButton;
