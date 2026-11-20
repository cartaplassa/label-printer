import { useEffect, useRef } from 'react';
import { SettingsContent } from './Settings';

export const SETTINGS_MIN_WIDTH = 320;
export const SETTINGS_MAX_WIDTH = 720;
export const SETTINGS_DEFAULT_WIDTH = 420;

interface DesktopSettingsWrapperProps {
    collapsed: boolean;
    width: number;
    onWidthChange: (width: number) => void;
}

export function DesktopSettingsWrapper({
    collapsed,
    width,
    onWidthChange,
}: DesktopSettingsWrapperProps) {
    const dragRef = useRef<{
        startX: number;
        startWidth: number;
        pointerId: number;
    } | null>(null);

    useEffect(() => {
        return () => {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, []);

    if (collapsed) {
        return null;
    }

    const clampWidth = (next: number) => {
        const maxByViewport =
            typeof window !== 'undefined'
                ? Math.max(SETTINGS_MIN_WIDTH, window.innerWidth - 320)
                : SETTINGS_MAX_WIDTH;
        const max = Math.min(SETTINGS_MAX_WIDTH, maxByViewport);
        return Math.min(max, Math.max(SETTINGS_MIN_WIDTH, next));
    };

    const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        dragRef.current = {
            startX: e.clientX,
            startWidth: width,
            pointerId: e.pointerId,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== e.pointerId) return;
        const delta = drag.startX - e.clientX;
        onWidthChange(clampWidth(drag.startWidth + delta));
    };

    const stopDrag: React.PointerEventHandler<HTMLDivElement> = (e) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== e.pointerId) return;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
        dragRef.current = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };

    return (
        <aside
            className="relative hidden h-full shrink-0 border-l border-stone-500 bg-background md:flex"
            style={{ width: clampWidth(width) }}
            aria-label="Settings sidebar"
        >
            <div
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize settings"
                className="absolute inset-y-0 left-0 z-20 w-2 -translate-x-1/2 cursor-col-resize touch-none"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={stopDrag}
                onPointerCancel={stopDrag}
            >
                <div className="mx-auto h-full w-px bg-transparent hover:bg-stone-400/60" />
            </div>
            <div className="flex h-full w-full min-w-0 flex-col p-2">
                <SettingsContent />
            </div>
        </aside>
    );
}
