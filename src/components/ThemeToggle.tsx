import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

import cn from '@/cn';

interface ThemeToggleProps
    extends React.ComponentPropsWithoutRef<typeof Button> {}

function ThemeToggle({ className, ...rest }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    return (
        <Button className={cn(className)} onClick={toggleTheme} {...rest}>
            {theme === 'light' ? <Moon /> : <Sun />}
        </Button>
    );
}

export default ThemeToggle;
