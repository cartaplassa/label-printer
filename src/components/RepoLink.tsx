import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

const RepoLink = () => (
    <a
        href="https://github.com/cartaplassa/label-printer"
        target="_blank"
        rel="noopener"
    >
        <Button>
            <Github />
        </Button>
    </a>
);

export default RepoLink;
