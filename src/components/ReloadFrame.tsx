import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from './ui/button';
import { ArrowBigDownDash, X } from 'lucide-react';

export default function ReloadFrame() {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW();

    const close = () => {
        setNeedRefresh(false);
    };

    return needRefresh ? (
        <div className="flex flex-col items-center gap-2">
            <span className={''}>Update available</span>
            <div className="flex gap-2">
                <Button onClick={() => updateServiceWorker(true)}>
                    <ArrowBigDownDash />
                    Reload
                </Button>
                <Button variant="secondary" onClick={close}>
                    <X />
                    Close
                </Button>
            </div>
        </div>
    ) : null;
}
