import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx and tailwind-merge for optimal class merging.
 * @param inputs - Class names or conditional class values.
 * @returns A single string with merged class names.
 */
const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export default cn;
