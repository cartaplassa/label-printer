import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { SettingsContent } from './Settings';

const MOBILE_PEEK_HEIGHT = 44;
const MOBILE_DRAG_THRESHOLD = 0.2;

interface MobileSettingsWrapperProps {
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export function MobileSettingsWrapper({
    open,
    onOpen,
    onClose,
}: MobileSettingsWrapperProps) {
    const [dragTranslate, setDragTranslate] = useState<number | null>(null);
    const startRef = useRef<{
        y: number;
        translate: number;
        startedOpen: boolean;
    } | null>(null);

    const getViewportHeight = () =>
        typeof window !== 'undefined' ? window.innerHeight : 800;

    const closedTranslate = () =>
        Math.max(0, getViewportHeight() - MOBILE_PEEK_HEIGHT);
    const currentTranslate = () => {
        if (dragTranslate !== null) return dragTranslate;
        return open ? 0 : closedTranslate();
    };

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) setDragTranslate(null);
    }, [open]);

    useEffect(() => {
        return () => {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, []);

    const beginDrag = (clientY: number) => {
        startRef.current = {
            y: clientY,
            translate: currentTranslate(),
            startedOpen: open,
        };
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    };

    const updateDrag = (clientY: number) => {
        const start = startRef.current;
        if (!start) return;
        const delta = clientY - start.y;
        const next = Math.min(
            closedTranslate(),
            Math.max(0, start.translate + delta),
        );
        setDragTranslate(next);
    };

    const endDrag = () => {
        const start = startRef.current;
        if (!start) return;
        const translate = dragTranslate ?? start.translate;
        const range = closedTranslate();
        startRef.current = null;
        setDragTranslate(null);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        if (start.startedOpen) {
            if (translate >= range * MOBILE_DRAG_THRESHOLD) onClose();
            else onOpen();
        } else {
            if (translate <= range * (1 - MOBILE_DRAG_THRESHOLD)) onOpen();
            else onClose();
        }
    };

    const onHandlePointerDown: React.PointerEventHandler<HTMLDivElement> = (
        e,
    ) => {
        if (e.button !== 0) return;
        e.preventDefault();
        beginDrag(e.clientY);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onHandlePointerMove: React.PointerEventHandler<HTMLDivElement> = (
        e,
    ) => {
        if (!startRef.current) return;
        updateDrag(e.clientY);
    };

    const onHandlePointerUp: React.PointerEventHandler<HTMLDivElement> = (
        e,
    ) => {
        if (!startRef.current) return;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
        endDrag();
    };

    const translate = currentTranslate();
    const closed = closedTranslate();
    const isVisiblyOpen = translate < closed - 1;
    const backdropOpacity =
        closed > 0 ? Math.max(0, Math.min(1, 1 - translate / closed)) * 0.5 : 0;

    return (
        <div className="md:hidden">
            {isVisiblyOpen ? (
                <button
                    type="button"
                    aria-label="Close settings"
                    className="fixed inset-0 z-40 bg-black transition-opacity"
                    style={{ opacity: backdropOpacity }}
                    onClick={onClose}
                />
            ) : null}
            <div
                role="dialog"
                aria-modal={open}
                aria-label="Settings"
                className={cn(
                    'fixed inset-x-0 top-0 z-50 flex h-dvh flex-col',
                    'border-t border-stone-500 bg-background',
                    dragTranslate === null &&
                        'transition-transform duration-200 ease-out',
                )}
                style={{ transform: `translateY(${translate}px)` }}
            >
                <div
                    className="flex h-11 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
                    onPointerDown={onHandlePointerDown}
                    onPointerMove={onHandlePointerMove}
                    onPointerUp={onHandlePointerUp}
                    onPointerCancel={onHandlePointerUp}
                    aria-label="Drag settings panel"
                >
                    <div className="h-1.5 w-12 rounded-full bg-stone-300 dark:bg-stone-600" />
                </div>
                <div className="min-h-0 flex-1 overflow-hidden px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                    <SettingsContent />
                </div>
            </div>
        </div>
    );
}
