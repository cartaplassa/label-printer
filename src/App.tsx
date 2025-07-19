import cn from '@/cn';
import Page from './blocks/Page';
import Settings from './blocks/Settings';

function App() {
    return (
        <div // TODO low-width breakpoint
            className={cn(
                'flex items-center',
                'w-dvw max-w-dvw h-dvh max-h-dvh',
                'bg-stone-400',
            )}
        >
            <Page className="grow" />
            <Settings className="fixed right-2 top-[50%] transform -translate-y-1/2" />
        </div>
    );
}

export default App;
